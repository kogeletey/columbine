import { defineContentScript } from "wxt/sandbox"

export default defineContentScript({
  matches: ["*://*/*"],
  main() { },
})
