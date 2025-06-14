import type { API, ToolboxConfig } from "@editorjs/editorjs"
import type {
    BlockTool,
    BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"

import "./ask-input.css";
import { useClientModelInput } from './use-model-input.ts'
//import type { MessageContentComplex } from "@langchain/core/messages";
import EditorJSMarkdownConverter from "../markdown-parser/index.ts";

export type AskInputParams = BlockToolConstructorOptions

export class AskInputBlock implements BlockTool {
    private _element: HTMLElement | null
    private _message: null | string
    private _loader: boolean
    private _blockIndex: number;
    private _placeholder: string
    api: API

    static get DEFAULT_PLACEHOLDER() {
        return "Write a AI Request";
    }

    constructor({ api, config }: BlockToolConstructorOptions) {
        this._element = null
        this._message = null
        this._loader = false
        this.api = api
        this._blockIndex = this.api.blocks.getCurrentBlockIndex()
        this.onKeyUp = this.onKeyUp.bind(this);

        this._placeholder = config.placeholder
            ? config.placeholder
            : AskInputBlock.DEFAULT_PLACEHOLDER
    }

    static get toolbox(): ToolboxConfig {
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
        const promptOutput = await useClientModelInput(text)
        this._message = promptOutput.content as string
        this._loader = false
        return this._message;
    }

    onKeyUp(e: KeyboardEvent): void {
        if (e.code !== 'Backspace' && e.code !== 'Delete') {
            return;
        }

        if (!this._element) {
            return;
        }

        const { value } = this._element.firstChild as HTMLInputElement;

        if (value === '') {
            this.api.blocks.delete(this._blockIndex)
        }
    }

    static get conversionConfig() {
        return {
            import: 'text',
        };
    }

    private onKeyDown(e: KeyboardEvent, input: HTMLInputElement): void {
        if (e.key === "Enter") {
            e.preventDefault();
            if (input.value && !e.shiftKey) {
                this.modelInputResponse(input.value).then(() => {
                    const blocks = EditorJSMarkdownConverter.toBlocks(this._message ?? '')

                    blocks.forEach(block => {
                        this.api.blocks.insert(block.type, block.data)
                    }
                    )
                })
            }
            else if (e.shiftKey) {
                this.api.blocks.insert(undefined, undefined, undefined, this._blockIndex + 1, true)
            }
        }
    }

    public render(): HTMLFieldSetElement {
        this._element = document.createElement("fieldset")
        this._element.classList.add("ask-input")

        const input = document.createElement("input")

        this._element.appendChild(input)
        input.focus()
        input.placeholder = this._placeholder

        input.contentEditable = 'true'

        this._element.addEventListener("keydown",
            (event) => this.onKeyDown(event, input)
        )

        this._element.addEventListener('keyup', this.onKeyUp)

        return this._element as HTMLFieldSetElement
    }
    public save() { }
    public destroy() {
        this._element = null
    }
}
