import { html } from "lit"
import { classMap } from 'lit/directives/class-map.js';
import { unsafeSVG } from "lit/directives/unsafe-svg.js"

import CloseIcon from "./carbon-close-icon.svg?raw"
import type { ColBadgeState } from "./col-badge.def.ts"

export default function ColBadgeTemplate(state: ColBadgeState) {
    return html`
            <span
                class="badge"
            >
                <slot></slot>
                ${state.close ?
            html`
                <button class="close-icon">
                    ${unsafeSVG(CloseIcon)}
                </button>
                ` : undefined}
            </span>
        `
}
