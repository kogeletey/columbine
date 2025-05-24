import { LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import colNavStyles from "./col-nav.css?inline"
import ColNavTemplate  from "./col-nav.html.ts"

@customElement("col-nav")
export class ColNav extends LitElement {
  static styles = unsafeCSS(colNavStyles)
  @property({ type: Boolean })
  isView: boolean = false

  public changeView = () => {
    this.isView = !this.isView
  }

  render() {
    return ColNavTemplate({
      changeView: this.changeView,
      isView: this.isView
    })
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-nav": ColNav
  }
}
