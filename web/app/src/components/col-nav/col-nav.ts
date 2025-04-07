import { LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
// import colNav from "./col-nav.css?inline"
import { ColNavTemplate } from "./col-nav.html.ts"

@customElement("col-nav")
export class ColNav extends LitElement {
    // static styles = unsafeCSS(colNavStyles)
    render() {
        return ColNavTemplate()
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-nav": ColNav
    }
}
