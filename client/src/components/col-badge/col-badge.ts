import { LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import colBadgeStyles from './col-badge.css?inline'
import ColBadgeTemplate from './col-badge.html'

@customElement("col-badge")
export default class ColBadge extends LitElement {
    static styles = unsafeCSS(colBadgeStyles)

    @property({ type: Boolean })
    close: boolean = true


    render() {
        return ColBadgeTemplate({
            close: this.close
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-badge": ColBadge
    }
}
