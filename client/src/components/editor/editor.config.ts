import type { EditorConfig } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import EditorjsList from '@editorjs/list';
import CodeTool from '@editorjs/code';
import { AskInputBlock } from "@/components/ask-input/ask-input.block.ts"

export const editorDefineConfig: EditorConfig = {
    autofocus: true,
    tools: {
        list: EditorjsList,
        code: CodeTool,
        header: {
            class: Header,
            inlineToolbar: true,
        },
        AskInputBlock
    },
    defaultBlock: 'AskInputBlock',
}
