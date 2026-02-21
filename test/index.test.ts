import { describe, expect, it } from "vitest";
import { PLUGIN_NAME, viteHtmlPages } from "../src/index.ts";

describe("vite-plugin-html-pages", () => {
  it("plugin name", () => {
    expect(PLUGIN_NAME).toBe("vite-plugin-html-pages");
  });

  it("returns plugin array", () => {
    expect(viteHtmlPages()).toHaveLength(1);
  });
});
