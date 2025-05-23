import type { OutputData } from "@editorjs/editorjs"

import EditorJS from "@editorjs/editorjs"
import DragDrop from "editorjs-drag-drop"
import { editorDefineConfig } from "./editor.config.ts"

export class EditorJSComponent {
    static tag = "alemufu"
    private editor?: EditorJS = undefined

    async getData(): Promise<OutputData | undefined> {
        try {
            const value = localStorage.getItem("editordata")
            // const value = await storage.getItem("local:editordata")
            if (value) {
                return JSON.parse(value)
            }
        }
        catch (error) {
            console.error("Failed to get data", error)
            return undefined
        }
    }

    async initializeEditor() {
        const initialData = await this.getData()
        this.editor = new EditorJS({
            holder: EditorJSComponent.tag,
            data: initialData,
            onReady: async () => {
                return new DragDrop(this.editor)
            },
            ...editorDefineConfig,
        })
    }

    async saveData() {
        try {
            const outputData = await this.editor?.save()
            localStorage.setItem("editordata", JSON.stringify(outputData))
            // await storage.setItem("local:editordata", JSON.stringify(outputData))
        }
        catch (error) {
            console.error("Error saving data", error)
            throw error
        }
    }

    async handleGetDataButtonClick() {
        try {
            const _ = await this.getData()
            // console.log("get-a-data-vl", val)
        }
        catch (error) {
            console.error("Failed to fetch data", error)
        }
    }

    async handleSaveButtonClick() {
        try {
            await this.saveData()
        }
        catch (error) {
            console.error("Failed to save data", error)
        }
    }

    attachEventListeners() {
        const getDataButton = document.querySelector("button.get-data")
        if (getDataButton) {
            getDataButton.addEventListener("click", () => this.handleGetDataButtonClick())
        }

        const saveButton = document.querySelector("button.save-document")
        if (saveButton) {
            saveButton.addEventListener("click", () => this.handleSaveButtonClick())
        }
    }

    async initialize() {
        await this.initializeEditor()
        // this.attachEventListeners()
    }
}

(async () => {
    const editorManager = new EditorJSComponent()
    await editorManager.initialize()
})()
