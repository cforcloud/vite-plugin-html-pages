/// multi-page
import { defineConfig } from "vite";

import { viteHtmlPages } from "vite-plugin-html-pages";
// import { viteHtmlPages } from "../../src/index.ts";

export default defineConfig({
  plugins: [
    viteHtmlPages({
      pages: [
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
              attrs: { name: "description", content: "tells about us" },
            },
            {
              tag: "meta",
              attrs: { name: "keywords", content: "about page" },
              injectTo: "head-prepend",
            },
            {
              tag: "p",
              attrs: { class: "inject" },
              children: "This is injected in About",
              injectTo: "body",
            },
          ],
        },

        {
          path: "/contact",
          filename: "contact.html",
          tags: [
            {
              tag: "meta",
              attrs: { name: "description", content: "how to reach" },
            },
            {
              tag: "meta",
              attrs: { name: "keywords", content: "contact us" },
              injectTo: "head",
            },
            {
              tag: "p",
              attrs: { class: "inject" },
              children: "This is injected in Contact",
              injectTo: "body-prepend",
            },
          ],
        },
      ],
    }),
  ],

  css: {
    devSourcemap: true,
  },
});
