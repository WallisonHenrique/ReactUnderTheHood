import { useEffect, useState } from "./react/index.js";

export function App() {
  const [count, setCount] = useState(0);
  const [count2, setCount2] = useState(3);

  useEffect(() => {
    console.log("@app:inner:useEffect", { count });
    setCount2((prev) => prev + 1);
    return () => console.log("@app:close");
  }, [count]);

  console.log("@app:after:useEffect", { count });

  const handleMore = () => {
    setCount((prevState) => prevState + 1);
    setCount((prevState) => prevState + 1);
  };

  const handleLess = () => {
    setCount((prevState) => prevState - 1);
  };

  return {
    type: "div",
    props: {
      children: [
        { type: "span", props: { children: "COUNT: " + count + " " } },
        { type: "span", props: { children: "COUNT2: " + count2 + " " } },
        {
          type: "button",
          props: { children: "Aumentar 1", onClick: handleMore },
        },
        {
          type: "button",
          props: { children: "Diminuir 1", onClick: handleLess },
        },
      ],
    },
  };
}
