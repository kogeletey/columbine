import type { EditorConfig } from "@editorjs/editorjs"
import Header from "@editorjs/header"
import EditorjsList from '@editorjs/list';
import CodeTool from '@editorjs/code';
import Table from '@editorjs/table'
import Quote from '@editorjs/quote';
import Delimiter from '@coolbytes/editorjs-delimiter'
import { AskInputBlock } from "@/components/ask-input/ask-input.block.ts"

export const editorDefineConfig: EditorConfig = {
    autofocus: true,
    placeholder: 'Start thinking about ideas',
    tools: {
        list: EditorjsList,
        code: CodeTool,
        table: Table,
        quote: Quote,
        delimiter: Delimiter,
        header: Header,
        AskInputBlock: {
            class: AskInputBlock,
            inlineToolbar: true,
        }
    },
    inlineToolbar: true,
    defaultBlock: 'AskInputBlock',
}
