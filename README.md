# vite-plugin-html-page

<!-- automd:badges color=yellow -->

[![npm version](https://img.shields.io/npm/v/vite-plugin-html-page?color=yellow)](https://npmjs.com/package/vite-plugin-html-page)
[![npm downloads](https://img.shields.io/npm/dm/vite-plugin-html-page?color=yellow)](https://npm.chart.dev/vite-plugin-html-page)

<!-- /automd -->

Vite plugin to support multiple HTML pages using a single HTML template file and inject page specific HTML tags (e.g., meta, link, script) based on configured page paths.

## Features

- `SPA` and `MPA` modes support
- Uses root `index.html` file by default
- Support custom default template

## Install

node version: >=20.0.0

vite version: >=5.0.0

```sh
# npm
npm install vite-plugin-html-page
```

## Single page usage

```ts
/// vite.config.ts
import { defineConfig } from "vite";
import { viteHtmlPage } from "vite-plugin-html-page";

export default defineConfig({
  plugins: [viteHtmlPage()],
});
```

## Multi page usage

```ts
/// vite.config.ts
import { defineConfig } from "vite";
import { viteHtmlPage } from "vite-plugin-html-page";

export default defineConfig({
  plugins: [
    viteHtmlPage({
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
              tag: "p",
              attrs: { class: "inject" },
              children: "This is injected in About",
              injectTo: "body",
            },
          ],
        },
      ],
    }),
  ],
});
```

## Development

<details>
<summary>Local development</summary>

- Clone this repository
- Install latest LTS version of Node.js
- Enable Corepack using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`
</details>

## License

Published under the [MIT](https://github.com/cforcloud/vite-plugin-html-page/blob/main/LICENSE) license 💛.
