export type FunctionComponent = () => VNode;

export interface VNode {
  tag: string;
  props?: Record<string, any> | null;
  key: string; // 一意な識別子
  children?: Array<VNode | string>;
}

export function createElement(
  tag: string | FunctionComponent,
  props?: Record<string, any> | null,
  ...children: (VNode | string)[]
): VNode {
  if (typeof tag === "function") {
    setCurrentVNode({
      tag: "",
      props,
      key: props?.key ?? String(Math.random()),
      children: [],
    });
    return tag();
  }
  return { tag, props, key: props?.key ?? String(Math.random()), children };
}

export function render(vnode: VNode | string, container: HTMLElement): void {
  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }

  setCurrentVNode(vnode); // 🔥 ここで `currentVNode` をセットする！

  const element = document.createElement(vnode.tag);

  if (vnode.props) {
    for (const [key, value] of Object.entries(vnode.props)) {
      //* 関数とイベントリスナーの場合
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

let currentVNode: VNode | null = null;

function setCurrentVNode(vnode: VNode) {
  currentVNode = vnode;
}

let stateMap: Map<string, any> = new Map(); // keyで状態を管理

export function useState<T>(
  initialState: T
): [T, (newState: T | ((prevState: T) => T)) => Promise<T>] {
  if (!currentVNode) {
    throw new Error("useState must be called inside a component");
  }

  const key = currentVNode.key;

  if (!stateMap.has(key)) {
    stateMap.set(key, initialState);
  }

  const getState = stateMap.get(key) as T;

  const setState = async (newState: T | ((prevState: T) => T)): Promise<T> => {
    const state = stateMap.get(key);
    const updatedState =
      typeof newState === "function"
        ? (newState as (prevState: T) => T)(state)
        : newState;
    stateMap.set(key, updatedState);
    // console.log(stateMap.get(key));

    // // rerender();
    console.log(updatedState);
    return updatedState;
  };

  return [getState, setState];
}

// // 再レンダリングを管理する関数

// let rerender: Function = () => {};

// // この関数を使って再レンダリングを管理する
// export function setRerender(callbackFunction: Function): void {
//   rerender = callbackFunction;
// }
