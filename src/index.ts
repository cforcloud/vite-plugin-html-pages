import type { HtmlTagDescriptor, IndexHtmlTransform, Plugin } from "vite";

/// types
export type HtmlItem = {
  /** unique page path */
  path: string;

  /** unique destination file */
  filename: `${string}.html`;

  tags?: HtmlTagDescriptor[];
};

type HtmlBaseOptions = {
  /** @default 'node_modules' */
  cacheParentDir?: string;

  /** where temp html files are placed @default '.html-pages' */
  cacheDir?: string;
};

export type HtmlPagesOptions = HtmlBaseOptions & {
  pages?: HtmlItem[];
};

/// constants
export const PLUGIN_NAME = "vite-plugin-html-pages";

/// plugin
export function viteHtmlPages(options: HtmlPagesOptions = {}): Plugin[] {
  const opts = options;

  const getTransformIndexHtml = (isBuild = false): IndexHtmlTransform => {
    console.log("h:IndexHtmlTransform", { opts, isBuild });

    return {
      order: "pre",
      handler(html, ctx) {
        /// path, filename for build, since its virtual-like page
        /// originalUrl is defined only in serve
        const { path, filename, originalUrl } = ctx;

        console.log("h:IndexHtmlTransform", { path, filename, originalUrl });

        return html.replace(/<title>(.*?)<\/title>/, "<title>$1 Title replaced!</title>");
      },
    };
  };

  const servePlugin: Plugin = {
    name: PLUGIN_NAME,
    apply: "serve",
    transformIndexHtml: getTransformIndexHtml(),
  };

  return [servePlugin];
}
