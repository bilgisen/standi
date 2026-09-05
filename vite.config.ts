import { defineConfig } from "vite"
import vinext from "vinext"
import { cloudflare } from "@cloudflare/vite-plugin"
import { vinextPayload } from "vite-plugin-vinext-payload"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [
    tailwindcss(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
    vinext(),
    vinextPayload(),
  ],
})
