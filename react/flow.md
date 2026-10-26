1 index.html: arquivo contendo a estrutura base com uma tag vazia `<div id="root"></div>`.
2 script src main.js: importação do arquivo JavaScript principal que inicializa a aplicação.
3 document.getElementById("root"): captura o container do DOM real onde a aplicação será ancorada.
4 createRoot: inicializa a raiz do React associando o container do DOM real à estrutura de controle interna.
5 render (executa): método chamado na raiz para injetar o componente principal e iniciar o ciclo de vida.
6 Execução de componentes: as funções dos componentes são executadas em memória para processar a lógica.
7 Inicialização do useState (1ª vez): verifica que é a primeira vez, armazena o valor inicial no vetor de estados e retorna o valor atual com a função despachante.
8 Inicialização do useEffect (1ª vez): verifica que é a primeira vez, agenda a execução do callback do efeito para depois do commit e armazena sua função de limpeza.
9 Criação de métodos e manipuladores de eventos: funções auxiliares e listeners são definidos dentro do escopo do componente.
10 Disparo do useState (dispatch): recebe um novo valor ou função atualizadora, adiciona o item na fila de atualizações pendentes daquele estado.
11 Verificação de agendamento: confira se já existe um re-render agendado; caso contrário, programa a execução para o próximo microtask.
12 Batching de filas: processa todos os valores acumulados na fila aplicando as funções ou valores atualizados, calcula o novo valor final do estado e limpa a fila.
13 Fase de Render / JSX (1ª vez): o JSX é convertido em chamadas de função que geram a árvore de objetos JavaScript puros (Virtual DOM / WorkInProgress inicial).
14 Armazenamento da árvore inicial: a árvore gerada é salva como o Virtual DOM atual que serve de base e mantém o ponteiro para os nós reais.
15 Fase de Commit (1ª vez - Montagem): cria os elementos HTML reais do zero na memória a partir da árvore, vincula a referência do nó real e insere tudo no container root do DOM.
16 Fase de Layout Effects (1ª vez): executa ganchos síncronos pós-commit, como o `useLayoutEffect`, imediatamente após o DOM ser mutado.
17 Browser Paint (1ª vez): o navegador renderiza os pixels atualizados na tela para o usuário.
18 Fase de Passive Effects (1ª vez): executa de forma assíncrona os efeitos colaterais pós-pintura, como o `useEffect` inicial e seu cleanup.
19 Fase de Render / JSX (2ª vez): após uma atualização de estado, o componente roda novamente gerando uma nova árvore de objetos (WorkInProgress).
20 Reconciliação / Diffing (2ª vez): compara a árvore nova (WorkInProgress) com a árvore antiga (Virtual DOM) para detectar quais nós mudaram.
21 Substituição do Virtual DOM: a árvore antiga é descartada e substituída por completo pela nova árvore (WorkInProgress), atualizando os ponteiros.
22 Fase de Commit (2ª vez - Atualização): usa o ponteiro armazenado para alterar cirurgicamente apenas os elementos específicos que mudaram no DOM real, sem recriar o container.
23 Reexecução do useEffect (2ª vez - Sem dependências): executa o cleanup anterior, roda o novo callback e armazena o novo cleanup.
24 Reexecução do useEffect (2ª vez - Com dependências): compara os valores atuais com os anteriores; se mudaram, executa o cleanup, roda o callback e atualiza o armazenamento.
25 Execução do Cleanup (Desmontagem): quando o componente é removido da tela, executa a última função de limpeza armazenada.
