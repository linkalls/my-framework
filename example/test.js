// src/neonX.ts
var instances = new Map;
var currentInstance = null;
function createElement(tag, props, ...children) {
  return { tag, props, key: props?.key ?? String(Math.random()), children };
}
function render(component, container) {
  const instance = {
    component,
    parentElement: container,
    key: String(Math.random())
  };
  instances.set(instance.key, instance);
  currentInstance = instance;
  const vnode = component();
  renderVNode(vnode, container);
}
function renderVNode(vnode, container) {
  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }
  const element = document.createElement(vnode.tag);
  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      if (key.startsWith("on") && typeof value === "function") {
        element.addEventListener(key.substring(2).toLowerCase(), value);
      } else if (key.startsWith("className") && typeof value === "string") {
        element.classList.add(value);
      } else {
        element.setAttribute(key, value);
      }
    }
  }
  if (vnode.children) {
    for (const child of vnode.children) {
      renderVNode(child, element);
    }
  }
  container.appendChild(element);
}
var stateMap = new Map;
var stateIndexMap = new Map;
function useState(initialState) {
  if (!currentInstance) {
    throw new Error("useState must be called inside a component");
  }
  const instanceKey = currentInstance.key;
  if (!stateMap.has(instanceKey)) {
    stateMap.set(instanceKey, []);
    stateIndexMap.set(instanceKey, 0);
  }
  const states = stateMap.get(instanceKey);
  const index = stateIndexMap.get(instanceKey);
  if (states.length <= index) {
    states.push(initialState);
  }
  const currentState = states[index];
  const setState = (newState) => {
    const nextState = typeof newState === "function" ? newState(currentState) : newState;
    states[index] = nextState;
    rerender(instanceKey);
  };
  stateIndexMap.set(instanceKey, index + 1);
  return [currentState, setState];
}
function rerender(instanceKey) {
  const instance = instances.get(instanceKey);
  if (!instance)
    return;
  currentInstance = instance;
  stateIndexMap.set(instanceKey, 0);
  instance.parentElement.innerHTML = "";
  const vnode = instance.component();
  renderVNode(vnode, instance.parentElement);
}

// example/test.ts
var Counter = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  return createElement("div", { class: "flex flex-col items-center justify-center min-h-screen" }, createElement("h1", { class: "text-2xl" }, `カウント:${count} `), createElement("button", {
    onClick: async () => {
      console.log("counter");
      setCount((count2) => {
        return count2 + 2;
      });
    },
    class: "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
  }, "カウントを増やす"), createElement("input", {
    onchange: (e) => {
      setText(e.target.value);
    },
    class: "bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
  }), createElement("h1", { class: "text-2xl" }, `テキスト:${text}`));
};
var root = document.getElementById("root");
render(Counter, root);
