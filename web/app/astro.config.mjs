import sitemap from "@astrojs/sitemap"
import vue from "@astrojs/vue"
import lit from "@semantic-ui/astro-lit"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [sitemap(), lit(), vue()],
})
