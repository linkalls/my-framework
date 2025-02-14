export interface VNode {
  tag: string;
  props?: Record<string, any> | null;
  children?: Array<VNode | string>;
}

export function createElement(
  tag: string,
  props?: Record<string, any> | null,
  ...children: (VNode | string)[]
): VNode {
  return { tag, props, children };
}

export function render(vnode: VNode | string, container: HTMLElement): void {
  if (typeof vnode === "string") {
    container.appendChild(document.createTextNode(vnode));
    return;
  }
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
