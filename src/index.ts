import type { Plugin } from "vite";

/// types
export interface HtmlPagesOptions {}

/// consts
export const PLUGIN_NAME = "vite-plugin-html-pages";

/// plugin
export function viteHtmlPages(opts: HtmlPagesOptions = {}): Plugin {
  return {
    name: PLUGIN_NAME,

    transformIndexHtml(html) {
      console.log("viteHtmlPages", opts);

      return html.replace(/<title>(.*?)<\/title>/, `<title>Title replaced!</title>`);
    },
  };
}

export function test() {
  return "works!";
}
