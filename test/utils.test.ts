import { describe, expect, it } from "vitest";

import { cleanUrl } from "../src/index.ts";

describe("utils", () => {
  it("cleanUrl", () => {
    expect(cleanUrl("/")).toBe("/");
    expect(cleanUrl("index")).toBe("index");
    expect(cleanUrl("/about")).toBe("/about");
    expect(cleanUrl("/about?a=1")).toBe("/about");
    expect(cleanUrl("/about?a=1#x")).toBe("/about");
  });
});
