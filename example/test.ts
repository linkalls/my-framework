import { createElement, render, useState } from "../src/neonX";

const Counter = () => {
  const [count, setCount] = useState<number>(0);
  const [text, setText] = useState<string>("");
  return createElement(
    "div",
    { class: "flex flex-col items-center justify-center min-h-screen" },
    createElement("h1", { class: "text-2xl" }, `カウント:${count} `),
    createElement(
      "button",
      {
        onClick: async () => {
          console.log("counter");
          setCount((count) => {
            return count + 2;
          });
        },
        class:
          "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded",
      },
      "カウントを増やす"
    ),
    createElement("input", {
      onchange: (e: Event) => {
        setText((e.target as HTMLInputElement).value);
      },
      class:
        "bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal",
    }),
    createElement("h1", { class: "text-2xl" }, `テキスト:${text}`)
  );
};

const root = document.getElementById("root")!;

render(Counter, root)!;
