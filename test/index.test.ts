import { describe, expect, it } from "vitest";
import { test } from "../src/index.ts";

describe("vite-plugin-html-pages", () => {
  it("pass", () => {
    expect(test()).toBe("works!");
  });
});
