import { describe, expect, test } from "bun:test";
import { createElement } from "./neonX";

describe("createElement function", () => {
  // should return a VNode object with the correct tag when only tag is provided
  test("タグのみを提供した場合、正しいタグを持つVNodeオブジェクトを返すかテスト", () => {
    const result = createElement("div");
    console.log(result);
    expect(result).toEqual({
      tag: "div",
      props: undefined,
      children: [],
    });
  });
  // should return a VNode object with the correct props and children when props object and children array are provided
  test(" propsオブジェクトとchildren配列を提供した場合、正しいVNodeオブジェクトを返すかテスト", () => {
    const result = createElement(
      "div",
      { class: "container" },
      "Hello, World!"
    );
    console.log(result);
    expect(result).toEqual({
      tag: "div",
      props: { class: "container" },
      children: ["Hello, World!"],
    });
  });

  test("複数の子要素を持つVNodeオブジェクトを返すかテスト", () => {
    // Additional tests for createElement function
    test("空のpropsとchildrenの場合のテスト", () => {
      const result = createElement("div", {});
      expect(result).toEqual({
        tag: "div",
        props: {},
        children: [],
      });
    });

    test("ネストされた子要素を持つVNodeオブジェクトのテスト", () => {
      const result = createElement(
        "div",
        { class: "wrapper" },
        createElement(
          "div",
          { class: "inner" },
          createElement("span", null, "Inner text")
        )
      );
      expect(result).toEqual({
        tag: "div",
        props: { class: "wrapper" },
        children: [
          {
            tag: "div",
            props: { class: "inner" },
            children: [
              {
                tag: "span",
                props: null,
                children: ["Inner text"],
              },
            ],
          },
        ],
      });
    });

    test("複数のプロパティを持つVNodeオブジェクトのテスト", () => {
      const result = createElement("div", {
        id: "test",
        class: "container",
        "data-test": "value",
      });
      expect(result).toEqual({
        tag: "div",
        props: {
          id: "test",
          class: "container",
          "data-test": "value",
        },
        children: undefined,
      });
    });
  });
});
