let memoizedState = [];
let memoizedEffects = [];
let stateIndex = 0; // Ponteiro para garantir a ordem correta dos useStates (Regra dos Hooks)
let effectIndex = 0; // Ponteiro para rastrear a ordem dos useEffects
let scheduledUpdate = false; // Flag para evitar múltiplos agendamentos no mesmo ciclo (Batching)
let createRooterRender = null; // Função global que dispara a re-renderização da raiz

/**
 * useState: Gerenciador de Estado
 * O componente inteiro executa de novo a cada render, mas o estado persiste
 * porque fica guardado no `memoizedState` externo, recuperado sequencialmente pelo `stateIndex`.
 */
export const useState = (initialState) => {
  // Captura o índice atual do hook e incrementa para o próximo
  const i = stateIndex++;

  // Inicialização lazy: se o slot estiver vazio, inicializa com o valor padrão e fila vazia
  if (memoizedState[i] === undefined) {
    memoizedState[i] = { value: initialState, queue: [] };
  }

  // Função dispatch: adiciona a nova alteração na fila (Queue) do hook específico
  const dispatchSetState = (value) => {
    const currentHook = memoizedState[i];
    memoizedState[i] = { ...currentHook, queue: [...currentHook.queue, value] };

    // Mecanismo de Batching Assíncrono via Microtask (similar ao React)
    // Se já houver um re-render agendado, apenas acumulamos na fila sem reagendar.
    if (!scheduledUpdate) {
      scheduledUpdate = true;
      queueMicrotask(scheduleUpdate);
    }
  };

  return [memoizedState[i].value, dispatchSetState];
};

/**
 * useEffect: Gerenciador de Efeitos Colaterais (Passive Effects)
 * Compara dependências usando Object.is e gerencia funções de limpeza (cleanup).
 */
export const useEffect = (effect, deps) => {
  const i = effectIndex++;
  const hasNoDeps = deps === undefined;
  const lastEffect = memoizedEffects[i];

  let hasChanged = true;

  if (lastEffect) {
    if (hasNoDeps) {
      hasChanged = true; // Roda a cada render se não houver array de dependências
    } else {
      // Compara se alguma dependência mudou desde o último render usando Object.is
      hasChanged = deps.some(
        (dep, index) => !Object.is(dep, lastEffect.deps[index]),
      );
    }
  }

  // Se as dependências mudaram (ou é o mount inicial), agendamos o efeito para pós-commit
  if (hasChanged) {
    queueMicrotask(() => {
      // 1. Fase de Cleanup: Se houver efeito anterior com limpeza, executa primeiro
      if (lastEffect && typeof lastEffect.cleanup === "function") {
        lastEffect.cleanup();
      }

      // 2. Executa o efeito atual e armazena a nova função de limpeza retornada
      const cleanup = effect();
      memoizedEffects[i] = { deps, cleanup };
    });
  }
};

/**
 * schedule: Orquestrador do Ciclo de Renderização
 * Processa o batching, reseta os ponteiros de hooks e dispara a Commit Phase.
 */
const scheduleUpdate = () => {
  // Processa a fila de alterações de estado em lote (Batching)
  memoizedState = batching(memoizedState);

  // Reseta os ponteiros e a flag de agendamento para o próximo ciclo de render
  scheduledUpdate = false;
  stateIndex = 0;
  effectIndex = 0;

  // Dispara a re-renderização da árvore (Commit Phase simulada)
  if (createRooterRender) {
    createRooterRender();
  }
};

/**
 * batching: Acumulador de Fila de Estados
 * Processa todas as ações acumuladas na queue (valores diretos ou funções de atualização)
 * aplicando o conceito de redução em cadeia.
 */
const batching = (states) => {
  return states.map((hookState) => {
    if (hookState.queue.length === 0) {
      return hookState;
    }

    let nextValue = hookState.value;

    // Itera sobre cada ação na fila cronologicamente
    hookState.queue.forEach((action) => {
      if (typeof action === "function") {
        nextValue = action(nextValue);
      } else {
        nextValue = action;
      }
    });

    return {
      value: nextValue,
      queue: [], // Limpa a fila após processar o lote
    };
  });
};

/**
 * renderElement: Construtor do DOM Virtual Simplificado
 * Transforma objetos de componentes em elementos reais do DOM do navegador.
 */
const renderElement = (component) => {
  const element = document.createElement(component.type);
  const { children, ...restProps } = component.props;

  Object.keys(restProps).forEach((key) => {
    element[key.toLowerCase()] = restProps[key];
  });

  if (children !== null && children !== undefined) {
    if (Array.isArray(children)) {
      children.forEach((child) => {
        const c = child;
        if (typeof c === "object") {
          element.appendChild(renderElement(c));
        } else {
          element.appendChild(document.createTextNode(c));
        }
      });
    } else if (typeof children === "object") {
      element.appendChild(renderElement(children));
    } else {
      element.textContent = children;
    }
  }

  return element;
};

/**
 * createRooter: Ponto de Entrada da Aplicação (Equivalente ao ReactDOM.createRoot)
 */
export const createRooter = (container) => {
  return {
    render: (children) => {
      createRooterRender = () => {
        const element = renderElement(children());
        // Atualiza o DOM real de uma só vez (Commit Phase)
        container.replaceChildren(element);
      };

      // Dispara a primeira renderização (Mount inicial)
      createRooterRender();
    },
  };
};
