import nodePath from "node:path";

import { defineConfig } from "vite";
import type { IndexHtmlTransformContext, IndexHtmlTransformHook, UserConfig } from "vite";
import { describe, expect, it } from "vitest";

import { PLUGIN_NAME, viteHtmlPages } from "../src/index.ts";
import type { HtmlPage } from "../src/index.ts";

const mockPages: HtmlPage[] = [
  {
    path: "/",
    filename: "index.html",
  },

  {
    path: "/about",
    filename: "about/index.html",
    tags: [
      {
        tag: "meta",
        attrs: { name: "description", content: "tells about" },
      },
    ],
  },
];

const mockHtml = "<body>mock</body>";

describe("vite-plugin-html-pages", () => {
  it("returns serve and build plugins array", () => {
    const pluginInstance = viteHtmlPages();

    expect(pluginInstance).toHaveLength(2);

    const servePlugin = pluginInstance.find((a) => a.apply === "serve");
    const buildPlugin = pluginInstance.find((a) => a.apply === "build");
    expect(servePlugin?.name).toBe(PLUGIN_NAME);
    expect(buildPlugin?.name).toBe(`${PLUGIN_NAME}:build`);
  });

  describe("serve plugin", () => {
    it("runs transform index html", async () => {
      const pluginInstance = viteHtmlPages();
      const servePlugin = pluginInstance.find((a) => a.apply === "serve");

      const mockCtx: IndexHtmlTransformContext = {
        path: "/",
        filename: "/unknownPage",
        originalUrl: `/unknownPage?a=1`,
      };

      // @ts-expect-error handler callable
      // oxlint-disable-next-line no-unsafe-optional-chaining
      const finalHtml = await (servePlugin?.transformIndexHtml?.handler as IndexHtmlTransformHook)(
        mockHtml,
        mockCtx,
      );

      expect(finalHtml === mockHtml).toBe(true);
    });

    it("runs transform index html with pages", async () => {
      const pluginInstance = viteHtmlPages({ pages: mockPages });
      const servePlugin = pluginInstance.find((a) => a.apply === "serve");

      const root = process.cwd();
      const mockPagesWithUnknown = [...mockPages, { path: "/unknownPage", filename: "index.html" }];

      mockPagesWithUnknown.forEach(async (page) => {
        const mockCtx: IndexHtmlTransformContext = {
          path: page.path,
          filename: nodePath.resolve(root, "node_modules/.html-pages", page.filename),
          originalUrl: `${page.path}?a=1`,
        };

        const finalHtml = await // @ts-expect-error handler callable
        // oxlint-disable-next-line no-unsafe-optional-chaining
        (servePlugin?.transformIndexHtml?.handler as IndexHtmlTransformHook)(mockHtml, mockCtx);

        expect(finalHtml).toBeDefined();

        expect(
          finalHtml === mockHtml ||
            (finalHtml &&
              typeof finalHtml !== "string" &&
              "html" in finalHtml &&
              finalHtml.html === mockHtml),
        ).toBe(true);
      });
    });
  });

  describe("build plugin", () => {
    it("runs config", async () => {
      const pluginInstance = viteHtmlPages();
      const buildPlugin = pluginInstance.find((a) => a.apply === "build");

      /// mock a vite config
      const mockConfig = defineConfig({});

      // @ts-expect-error config callable
      const finalConfig: UserConfig = await buildPlugin?.config?.(mockConfig);

      expect(finalConfig).toBeNull();
    });

    it("runs with pages and cacheDir", async () => {
      const cacheParentDir = "dist";
      const cacheDir = ".htmls";
      const pluginInstance = viteHtmlPages({
        cacheParentDir,
        cacheDir,
        pages: mockPages,
      });
      const buildPlugin = pluginInstance.find((a) => a.apply === "build");

      // @ts-expect-error config callable
      const finalConfig: UserConfig = await buildPlugin?.config?.(defineConfig({}));

      // console.log(finalConfig);

      expect(finalConfig).toBeDefined();
      expect(finalConfig.build?.rollupOptions?.input).toHaveLength(mockPages.length);

      mockPages.forEach((page) => {
        expect(
          (finalConfig.build?.rollupOptions?.input as string[])?.find((ip) =>
            ip.endsWith(`/${cacheParentDir}/${cacheDir}/${page.filename}`),
          ),
        ).toBeTypeOf("string");
      });
    });

    it("runs transform index html", async () => {
      const pluginInstance = viteHtmlPages({ pages: mockPages });
      const buildPlugin = pluginInstance.find((a) => a.apply === "build");

      const root = process.cwd();
      const mockCtx: IndexHtmlTransformContext = {
        path: "/index.html",
        filename: nodePath.resolve(root, "node_modules/.html-pages", "about/index.html"),
        originalUrl: "/about?a=1",
      };

      // @ts-expect-error handler callable
      // oxlint-disable-next-line no-unsafe-optional-chaining
      const finalHtml = await (buildPlugin?.transformIndexHtml?.handler as IndexHtmlTransformHook)(
        mockHtml,
        mockCtx,
      );

      expect(finalHtml).toBeDefined();
      /* oxlint-disable no-conditional-expect */
      if (finalHtml && typeof finalHtml !== "string" && "html" in finalHtml) {
        expect(finalHtml.html).toBe(mockHtml);
        expect(finalHtml.tags).toHaveLength(1);
      }
      /* oxlint-enable no-conditional-expect */
    });

    it("runs configResolved", async () => {
      const pluginInstance = viteHtmlPages({ pages: mockPages });
      const buildPlugin = pluginInstance.find((a) => a.apply === "build");

      // @ts-expect-error configResolved callable
      await buildPlugin?.configResolved?.(defineConfig({}));

      expect(buildPlugin?.configResolved).toBeDefined();
    });

    it("runs closeBundle", async () => {
      const pluginInstance = viteHtmlPages({ pages: mockPages });
      const buildPlugin = pluginInstance.find((a) => a.apply === "build");

      // await buildPlugin?.configResolved?.(defineConfig({}));

      // @ts-expect-error closeBundle callable
      await buildPlugin?.closeBundle();

      expect(buildPlugin?.closeBundle).toBeDefined();
    });
  });
});
