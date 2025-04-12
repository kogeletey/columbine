import { html } from "lit"

export default function SuperInputTemplate(props) {
    return html`
    <fieldset @focus=${props.handleFocus}>
        <input />
    </fieldset>`
}
