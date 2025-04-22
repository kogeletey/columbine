import { html, LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import { unsafeSVG } from "lit/directives/unsafe-svg.js"
import FilterButtonsStyle from "./filter-buttons.css?inline"
import Plus from "./plus.svg?raw"

@customElement("filter-buttons")
export class FilterButtons extends LitElement {
    static styles = unsafeCSS(FilterButtonsStyle)
    render() {
        return html`
 <div class="filter-buttons">
<button>
         ${unsafeSVG(Plus)}
    </button>
<button class="justify-end">
        Send
    </button>
</div>
        `
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "filter-buttons": FilterButton
    }
}
