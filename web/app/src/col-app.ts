import { html, LitElement } from "lit"
import { customElement } from "lit/decorators.js"
import "@columine/components/editor.ts"
import "./col-tree/col-tree.ts"
import "./styles/app.css"

@customElement("col-app")

export class ColApp extends LitElement {
    render() {
        return html`
        <nav></nav>
        <col-tree></col-tree>
        <slot></slot>
      `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-app": ColApp
    }
}
