import { css, LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import styles from "./col-tree.css?inline"
// import styles from "./col-tree.css" with { type: "css" }
import { ColTreeTemplate } from "./col-tree.html.ts"

@customElement("col-tree")
export class ColTree extends LitElement {
    static styles = unsafeCSS(styles)

    @property()
    name = "Smart Contract Name"

    createRenderRoot() {
        return this
    }

    render() {
        return ColTreeTemplate({ name: this.name, path: "/" })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-tree": ColTree
    }
}
