/// vite-plugin-html-page
import nodePath from "node:path";
import fsPromises from "node:fs/promises";

import type { HtmlTagDescriptor, IndexHtmlTransform, Plugin, ResolvedConfig } from "vite";

import { cleanUrl } from "./utils.ts";
export * from "./utils.ts";

/// types
export type HtmlPage = {
  /** unique page path */
  path: `/${string}`;

  /** unique destination file */
  filename: `${string}.html`;

  tags?: HtmlTagDescriptor[];
};

type HtmlBaseOptions = {
  /** @default 'node_modules' */
  cacheParentDir?: string;

  /** where temp html files are placed @default '.html-page' */
  cacheDir?: string;

  /** default html file name @default index.html */
  defaultTemplate?: string;
};

export type HtmlPageOptions = HtmlBaseOptions & {
  /** array of pages */
  pages?: HtmlPage[];
};

type HtmlPageItem = HtmlPage & { cacheFilename: string };

/// constants
export const PLUGIN_NAME = "vite-plugin-html-page";

/**
 * Vite plugin to support multiple pages with single HTML
 * @param options - Configuration options
 * @param options.pages - array of pages
 * @param options.cacheParentDir - parent directory of `cacheDir`
 * @param options.cacheDir - place where temp html files are cached
 * @param options.defaultTemplate - default html file name
 * @returns Vite Plugin
 *
 * @example
 * ```js
 * /// vite.config.ts
 * import { defineConfig } from "vite";
 * import { viteHtmlPage } from "vite-plugin-html-page";
 * export default defineConfig({
 *   plugins: [viteHtmlPage()],
 * });
 * ```
 * 
 * @see https://github.com/cforcloud/vite-plugin-html-page
 */
export function viteHtmlPage(options: HtmlPageOptions = {}): Plugin[] {
  const {
    cacheParentDir = "node_modules",
    cacheDir = ".html-page",
    defaultTemplate = "index.html",
    pages,
  } = options;
  let viteConfig: ResolvedConfig | undefined;

  /// normalise
  const cwd = process.cwd();
  const cacheDirname = nodePath.resolve(cwd, cacheParentDir, cacheDir);

  /// sort long to short path
  const pageItems = pages?.length
    ? [...pages]
        .sort((a, b) => b.path.localeCompare(a.path))
        .map((pageItem) => {
          const { filename } = pageItem;

          const cacheFilename = nodePath.resolve(cacheDirname, filename);
          return { ...pageItem, cacheFilename } as HtmlPageItem;
        })
    : undefined;

  const prepareCacheDir = async () => {
    if (!viteConfig || !pageItems) {
      return;
    }

    try {
      const { root = "" } = viteConfig;
      const srcDefaultTemplate = nodePath.resolve(root, defaultTemplate);

      const copyPromises = pageItems.map(async (pageItem) => {
        const { cacheFilename } = pageItem;

        const destinationDir = nodePath.dirname(cacheFilename);

        /// create dir and copy
        await fsPromises.mkdir(destinationDir, { recursive: true });

        await fsPromises.copyFile(srcDefaultTemplate, cacheFilename);
      });

      await Promise.allSettled(copyPromises);
    } catch (err) {
      viteConfig.logger.error("Error preparing cache dir");
      throw err;
    }
  };

  const getTransformIndexHtml = (isBuild = false): IndexHtmlTransform => {
    return {
      order: "pre",
      handler(html, ctx) {
        /// path, filename for build, since its virtual-like page
        /// originalUrl is defined only in serve
        const { filename, originalUrl } = ctx;

        /// multi page
        if (pageItems) {
          let pageItem: HtmlPage | undefined;

          if (isBuild) {
            pageItem = pageItems.find((a) => a.cacheFilename === filename);
          } else if (originalUrl) {
            /// is serve
            const reqUrl = cleanUrl(originalUrl);
            pageItem = pageItems.find((a) => reqUrl.startsWith(a.path));
          }

          // console.log("h", { isBuild, path: ctx.path, filename, originalUrl, pageItem });

          if (pageItem) {
            const { tags } = pageItem;

            if (!isBuild) {
              console.info("[Html]", { originalUrl, pagePath: pageItem.path });
            }

            return tags ? { html, tags } : html;
          }
        }

        return html;
      },
    };
  };

  const servePlugin: Plugin = {
    name: PLUGIN_NAME,
    apply: "serve",
    transformIndexHtml: getTransformIndexHtml(),
  };

  const buildPlugin: Plugin = {
    name: `${PLUGIN_NAME}:build`,
    apply: "build",
    config(_config) {
      if (!pageItems) {
        return null;
      }

      const input = pageItems.map((a) => a.cacheFilename);

      return {
        build: {
          rollupOptions: {
            input,
          },
        },
      };
    },

    async configResolved(_config) {
      viteConfig = _config;
      await prepareCacheDir();
    },

    transformIndexHtml: getTransformIndexHtml(true),

    async closeBundle() {
      if (!viteConfig || !pageItems) {
        return;
      }

      const startTime = performance.now();
      const outDirname = nodePath.resolve(viteConfig.root, viteConfig.build.outDir);
      const cacheBuildDirname = nodePath.resolve(outDirname, cacheParentDir, cacheDir);
      const cacheBuildParentDirname = nodePath.resolve(outDirname, cacheParentDir);

      /// copy
      await fsPromises.cp(cacheBuildDirname, outDirname, { recursive: true });

      /// delete cache
      await fsPromises.rm(cacheDirname, { recursive: true, force: true });
      await fsPromises.rm(cacheBuildParentDirname, { recursive: true, force: true });

      viteConfig.logger.info(
        `✓ moved html files in ${Math.round(performance.now() - startTime)}ms`,
      );
    },
  };

  return [servePlugin, buildPlugin];
}
