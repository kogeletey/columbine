import type { ColNavStateProps } from "./col-nav.d.ts"

import { html } from "lit"
import { unsafeSVG } from "lit/directives/unsafe-svg.js"
import carbonViewOff from "./carbon-view-off.svg?raw"
import carbonView from "./carbon-view.svg?raw"

export default function ColNavTemplate(state: ColNavStateProps) {
  return html`
        <nav>
            <button class="watch" @click="${state.changeView}" >
                    ${state.isView
                        ? unsafeSVG(carbonViewOff)
                        : unsafeSVG(carbonView)
                    }
    </button>
    <slot name = "account"> </slot>
    </nav>
        `
}
