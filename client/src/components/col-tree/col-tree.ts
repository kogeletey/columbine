import { useStores } from "@nanostores/lit";
import { FilesStore, type FilesValue } from "@/stores/files.ts";
import { LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";
import colTreeStyles from "./col-tree.css?inline";
import { ColTreeTemplate } from "./col-tree.html.ts";

const filesStore = new FilesStore();

@customElement("col-tree")
@useStores(FilesStore.$files)
export class ColTree extends LitElement {
  static styles = unsafeCSS(colTreeStyles);

  constructor() {
    super();
    filesStore.addFiles();
    this.files = filesStore.getFiles();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  @property()
  files: FilesValue | null = null;

  render() {
    return ColTreeTemplate({
      selected: false,
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "col-tree": ColTree;
  }
}
