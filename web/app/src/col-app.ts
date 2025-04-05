import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import "@columine/components/editor.ts"

@customElement("col-app")

export class ColApp extends LitElement {
  render() {
    return html`
        <slot></slot>
      `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-app": ColApp
  }
}
