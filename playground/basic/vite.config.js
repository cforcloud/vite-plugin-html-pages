import { defineConfig } from "vite";

import { viteHtmlPage } from "vite-plugin-html-page";

export default defineConfig({
  plugins: [viteHtmlPage()],
});
