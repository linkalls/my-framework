// src/MyFramework.ts
function createElement(tag, props, ...children) {
  if (typeof tag === "function") {
    setCurrentVNode({
      tag: "",
      props,
      key: props?.key ?? String(Math.random()),
      children: []
    });
    return tag();
  }
  return { tag, props, key: props?.key ?? String(Math.random()), children };
}
function render(vnode, container) {
  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }
  setCurrentVNode(vnode);
  const element = document.createElement(vnode.tag);
  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }
  if (vnode.children) {
    for (const child of vnode.children) {
      render(child, element);
    }
  }
  container.appendChild(element);
}
var currentVNode = null;
function setCurrentVNode(vnode) {
  currentVNode = vnode;
}
var stateMap = new Map;

// example/test.ts
var Counter = () => {
  return createElement("div", null, createElement("h1", null, `カウント: `), createElement("button", {
    onClick: async () => {
      console.log("counter");
    }
  }, "カウントを増やす"));
};
var root = document.getElementById("root");
render(Counter(), root);
