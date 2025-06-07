import type { EditorConfig } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import { AskInputBlock } from "@/components/ask-input/ask-input.block.ts"

export const editorDefineConfig: EditorConfig = {
    autofocus: true,
    tools: {
        header: {
            class: Header,
            inlineToolbar: true,
        },
        AskInputBlock
    },
    defaultBlock: 'AskInputBlock',
}
