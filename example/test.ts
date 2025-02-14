import { createElement, render } from "../src/MyFramework";

const Counter = () => {
  return createElement(
    "div",
    null,
    createElement("h1", null, `カウント: `),
    createElement(
      "button",
      {
        onClick: async () => {
          console.log("counter");
        },
      },
      "カウントを増やす"
    )
  );
};

const root = document.getElementById("root")!;

render(Counter(), root)!;
