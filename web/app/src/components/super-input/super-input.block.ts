import type { API } from "@editorjs/editorjs"
import type {
  BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"

import "@/components/super-input/filter-buttons"

export type SuperInputParams = BlockToolConstructorOptions

export class SuperInputBlock {
  private wrapper: HTMLElement | null
  private api: API

  constructor({ api }: SuperInputParams) {
    this.wrapper = null
    this.api = api
  }

  static get toolbox() {
    return {
      title: "SuperInput",
    }
  }

  static get isReadOnlySupported() {
    return true
  }

  static get enableLineBreaks() {
    return true
  }

  getSearch(search: HTMLInputElement | null): void {
    if (!search) {
      return
    }
    const value = search.value
    this.api.blocks.insert("tradingView", { search: value })
  }

  render() {
    this.wrapper = document.createElement("fieldset")
    this.wrapper.classList.add("super")

    const input = document.createElement("input")
    const filterButtons = document.createElement("filter-buttons")

    this.wrapper.appendChild(input)
    this.wrapper.appendChild(filterButtons)
    input.placeholder = "Search smart contract"

    this.wrapper.addEventListener("click", () => {
      const input = document.querySelector("input")
      this.getSearch(input)
    })
    return this.wrapper
  }

  save(blockContent) {
    const input = blockContent.querySelector("input")

    return {
      search: input.value,
    }
  }
}
