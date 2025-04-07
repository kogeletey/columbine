import { html } from "lit"
import { unsafeSVG } from "lit/directives/unsafe-svg.js"
import carbonView from "./carbon-view.svg?raw"

export function ColNavTemplate() {
    return html`
        <nav>
            <div class="view">
                    ${unsafeSVG(carbonView)}
            </div>
            <slot name="account"></slot>
        </nav>
        `
}
