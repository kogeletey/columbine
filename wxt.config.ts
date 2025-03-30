import { defineConfig } from "wxt"
// eslint-disable-file camelcase

// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  manifestVersion: 2,
  manifest: {
    chrome_url_overrides: {
      newtab: "index.html",
    },
    permissions: ["storage"],
    browser_specific_settings: {
      gecko: {
        id: "columbine@ofs.pub",
        strict_min_version: "75",
      },
    },
  },
  imports: false,
  runner: {
    binaries: {
      chrome: "io.github.ungoogled_software.ungoogled_chromium",
      firefox: "firefox-nightly",
    },
    firefoxProfile: "default-release",
    keepProfileChanges: true,
  },
})
