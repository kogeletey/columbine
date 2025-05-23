import { html } from "lit"
import type { ColTreeProps } from './col-tree.d.ts'

export function ColTreeTemplate(props: ColTreeProps) {
    return html`
    ${props.files && html`
        <aside>
        <ul>
        ${props.files.map(item => (
        html`
    <li aria-selected="${item.active}">
      <a href="${item.path}"> ${item.name} </a>
    </li>
    `))
            }
    </ul>
        </aside>
        `
        }
`
}
