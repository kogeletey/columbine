import { LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import colTreeStyles from "./col-tree.css?inline"
// import styles from "./col-tree.css" with { type: "css" }
import { ColTreeTemplate } from "./col-tree.html.ts"

@customElement("col-tree")
export class ColTree extends LitElement {
    static styles = unsafeCSS(colTreeStyles)

    @property()
    props = [{
        name: "Smart Contract Name",
        path: "/",
        active: false,
    }]

    render() {
        return ColTreeTemplate(this.props)
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-tree": ColTree
    }
}
