import type { API, ToolboxConfig } from "@editorjs/editorjs"
import type {
    BlockTool,
    BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"

import "./ask-input.css";
import  useModelInput  from './use-model-input.ts'

export type AskInputParams = BlockToolConstructorOptions

export class AskInputBlock implements BlockTool {
    private _wrapper: HTMLElement | null
    private _message: string | null
    private _loader: boolean
    private _api: API

    constructor({api}: BlockToolConstructorOptions) {
        this._wrapper = null
        this._message = null
        this._loader = false
        this._api = api
    }

    static get toolbox():  ToolboxConfig {
        return {
            title: "AskInput",
        }
    }

    static get isReadOnlySupported(): boolean {
        return true
    }

    static get enableLineBreaks(): boolean {
        return true
    }

    private async modelInputResponse(text: string): Promise<string | null> {
        this._loader = true
        const promptOutput = await useModelInput(text)
        this._message = promptOutput.content
        this._loader = false
        return this._message;
    }

    public render() {
        this._wrapper = document.createElement("fieldset")
        this._wrapper.classList.add("ask-input")

        const input = document.createElement("input")

        this._wrapper.appendChild(input)
        input.placeholder = "Start thinking about ideas"

        this._wrapper.addEventListener("keydown", (event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (input.value) {
                this.modelInputResponse(input.value).then(() => {
                    this._api.blocks.insert("paragraph", { text: this._message })
                })
              }
            }
        })

        return this._wrapper
    }
    public save() {}
}
