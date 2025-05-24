import { ProfileStore } from "@/stores/profile.ts"
import { FilesStore, type FilesValue } from "@/stores/files.ts"
import { useStores } from "@nanostores/lit"
import { LitElement, unsafeCSS } from "lit"
import { customElement, property } from "lit/decorators.js"
import colTreeStyles from "./col-tree.css?inline"
// import styles from "./col-tree.css" with { type: "css" }
import { ColTreeTemplate } from "./col-tree.html.ts"

// const profileStore = new ProfileStore()
const filesStore = new FilesStore()

@customElement("col-tree")
@useStores(ProfileStore.$profiles, FilesStore.$files)
export class ColTree extends LitElement {
    static styles = unsafeCSS(colTreeStyles)

    constructor() {
        super();
        filesStore.addFiles()
        this.files = filesStore.getFiles()
    }

    connectedCallback() {
        super.connectedCallback();
    }


    @property()
    files: FilesValue | null = null
    render() {
        return ColTreeTemplate({
            files: this.files,
            active: false
        })
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "col-tree": ColTree
    }
}
