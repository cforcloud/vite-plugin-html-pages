import { defineConfig } from "vite";

import { viteHtmlPages } from "vite-plugin-html-pages";

export default defineConfig({
  plugins: [viteHtmlPages()],
});
