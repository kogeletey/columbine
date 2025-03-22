import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifestVersion: 2,
  manifest: {
    // eslint-disable-next-line camelcase
    chrome_url_overrides: {
      newtab: "index.html",
    },
  },
  imports: false,
  runner: {
    binaries: {
      chrome: "io.github.ungoogled_software.ungoogled_chromium",
      firefox: "flatpak:org.mozilla.firefox",
    },
  },
})
