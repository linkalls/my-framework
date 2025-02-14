import { createElement, render } from "./src/MyFramework";
let count = 0;

// ここでcreateElementを使って、Appコンポーネントを作る
const App = createElement(
  "div",
  { id: "app" },
  createElement("h1", null, "Bun + TS で作ったフレームワーク！"),
  createElement("p", null, "ボタンをクリックしてみて！"),
  createElement(
    "button",
    {
      onClick: () => {
        alert("クリックされた！");
        count++;
        console.log(count);
      },
    },
    "クリックしてね！"
  )
);

// index.html の root にレンダリングする
const root = document.getElementById("root")!;

render(App, root);

console.log(JSON.stringify(App, null, 2));
