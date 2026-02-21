/// multi-page
import { defineConfig } from "vite";

// import { viteHtmlPages } from "vite-plugin-html-pages";
import { viteHtmlPages } from "../../src/index.ts";

export default defineConfig({
  plugins: [viteHtmlPages()],
});
