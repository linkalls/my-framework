// src/MyFramework.ts
function createElement(tag, props, ...children) {
  return { tag, props, children };
}
function render(vnode, container) {
  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }
  const element = document.createElement(vnode.tag);
  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
      if (vnode.children) {
        for (const child of vnode.children) {
          render(child, element);
        }
      }
    }
  }
  container.appendChild(element);
}

// index.ts
var App = createElement("div", { id: "app" }, createElement("h1", null, "Bun + TS で作ったフレームワーク！"), createElement("p", null, "ボタンをクリックしてみて！"), createElement("button", { onClick: () => alert("クリックされた！") }, "クリック"));
var root = document.getElementById("root");
render(App, root);
console.log(JSON.stringify(App, null, 2));
