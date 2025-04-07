import type { ColTreeProps } from "./col-tree.d.ts"
import { html } from "lit"

export function ColTreeTemplate(props: ColTreeProps) {
    return html`
<aside>
  <ul>
    <li>
      <a href="${props.path}"> ${props.name} </a>
    </li>
  </ul>
</aside>
`
}
