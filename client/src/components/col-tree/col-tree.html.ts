import { html } from "lit";
import type { ColTreeProps } from "./col-tree.type.ts";
import en from "@/langs/en.json";

import "@awesome.me/webawesome/dist/components/icon/icon.js";
import "@awesome.me/webawesome/dist/components/tree/tree.js";
import "@awesome.me/webawesome/dist/components/spinner/spinner.js";
import "@awesome.me/webawesome/dist/components/tree-item/tree-item.js";

export function ColTreeTemplate(props: ColTreeProps) {
  return html`
    <aside>
      <h3>${en.title}</h3>
      <wa-tree>
        <wa-tree-item selected=${props.selected}>
          <wa-icon name="plus"></wa-icon>
          ${en.startTreeItem}
        </wa-tree-item>
      </wa-tree>
    </aside>
  `;
}
