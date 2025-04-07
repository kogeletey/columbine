import type { ColTreeProps } from "./col-tree.d.ts"
import { html } from "lit"

export function ColTreeTemplate(props: ColTreeProps[]) {
    return html`
<aside>
  <ul>
    ${props.map(item => (
        html`
    <li aria-selected="${item.active}">
      <a href="${item.path}"> ${item.name} </a>
    </li>
    `))}
  </ul>
</aside>
`
}
