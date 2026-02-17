import { defineConfig } from "vite";

// import { viteHtmlPages } from "vite-plugin-html-pages";
import { viteHtmlPages } from "../../src";

export default defineConfig({
  plugins: [viteHtmlPages()],
});
