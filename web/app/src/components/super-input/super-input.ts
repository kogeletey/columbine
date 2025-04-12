import { html, LitElement } from "lit"
import { customElement, property } from "lit/decorators.js"
import SuperInputTemplate from "./super-input.html.ts";

@customElement("super-input")
export class SuperInput extends LitElement {
    connectedCallback() {
        super.connectedCallback();
    }

    handleFocus() {
    }

    render() {
        return SuperInputTemplate({
            handleFocus: this.handleFocus
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "super-input": SuperInput
    }
}
