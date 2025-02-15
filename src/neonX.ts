export type FunctionComponent = () => VNode;

export interface VNode {
  tag: string;
  props?: Record<string, any> | null;
  key: string; // 一意な識別子
  children?: Array<VNode | string>;
}

// コンポーネントインスタンスを追跡
interface ComponentInstance {
  component: FunctionComponent;
  parentElement: HTMLElement;
  key: string;
}

const instances = new Map<string, ComponentInstance>();
let currentInstance: ComponentInstance | null = null;

export function createElement(
  tag: string,
  props?: Record<string, any> | null,
  ...children: (VNode | string)[]
): VNode {
  return { tag, props, key: props?.key ?? String(Math.random()), children };
}

export function render(
  component: FunctionComponent,
  container: HTMLElement
): void {
  // インスタンスを作成して保存
  const instance: ComponentInstance = {
    component,
    parentElement: container,
    key: String(Math.random()),
  };

  instances.set(instance.key, instance);
  currentInstance = instance;

  // コンポーネントを実行してVNodeを取得
  const vnode = component();
  renderVNode(vnode, container);
}

// 内部用のレンダリング関数
function renderVNode(vnode: VNode | string, container: HTMLElement): void {
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
// 状態管理
const stateMap = new Map<string, any[]>();
const stateIndexMap = new Map<string, number>();
//* indexをやることでuseStateを複数回呼び出しても正しく動作するようにする

export function useState<T>(
  initialState: T
): [T, (newState: T | ((prev: T) => T)) => void] {
  if (!currentInstance) {
    throw new Error("useState must be called inside a component");
  }

  const instanceKey = currentInstance.key;

  // このインスタンスの最初のuseState呼び出しなら初期化
  if (!stateMap.has(instanceKey)) {
    stateMap.set(instanceKey, []);
    stateIndexMap.set(instanceKey, 0);
  }

  const states = stateMap.get(instanceKey)!;
  const index = stateIndexMap.get(instanceKey)!;

  // まだ状態が無ければ初期値を設定
  if (states.length <= index) {
    states.push(initialState);
  }

  const currentState = states[index];

  const setState = (newState: T | ((prev: T) => T)) => {
    const nextState =
      typeof newState === "function"
        ? (newState as (prev: T) => T)(currentState)
        : newState;

    states[index] = nextState;
    rerender(instanceKey);
  };
  // 次のuseStateのために索引を進める
 
  stateIndexMap.set(instanceKey, index + 1);

  return [currentState, setState as (newState: T | ((prev: T) => T)) => void];
}

function rerender(instanceKey: string): void {
  const instance = instances.get(instanceKey);
  if (!instance) return;

  currentInstance = instance;
  // useState用の索引をリセット
  stateIndexMap.set(instanceKey, 0);

  instance.parentElement.innerHTML = "";
  const vnode = instance.component();
  renderVNode(vnode, instance.parentElement);
}
