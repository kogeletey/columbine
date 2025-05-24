import sitemap from "@astrojs/sitemap"
import lit from "@semantic-ui/astro-lit"
import { defineConfig } from "astro/config"

// https://astro.build/config
export default defineConfig({
    output: "static",
    integrations: [sitemap(), lit()],
})
