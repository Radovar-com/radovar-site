import type { NextConfig } from "next"
import path from "node:path"

/* When the site is served from a subpath (the GitHub Pages project URL,
   https://<user>.github.io/<repo>/), every absolute link and asset URL needs
   that prefix. On the custom domain it is served from the root, so BASE_PATH
   is left unset there. One switch, no duplicated config. */
const basePath = process.env.BASE_PATH || ""

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export: produces a plain HTML/CSS/JS site in out/ that any host can serve.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // This is a public URL prefix, shared by the server and client components.
  env: { BASE_PATH: basePath },
  basePath: basePath || undefined,
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
