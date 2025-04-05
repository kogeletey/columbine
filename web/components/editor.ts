import type { OutputData } from "@editorjs/editorjs"

import EditorJS from "@editorjs/editorjs"
import DragDrop from "editorjs-drag-drop"

export class EditorJSComponent {
    static tag = "alemufu"
    private editor?: EditorJS = undefined

    async getData(): Promise<OutputData | undefined> {
        try {
            // const value = await storage.getItem("local:editordata")
            return JSON.parse()
        }
        catch (error) {
            console.error("Failed to get data", error)
            return undefined
        }
    }

    async initializeEditor() {
        // const initialData = await this.getData()
        this.editor = new EditorJS({
            holder: EditorJSComponent.tag,
            onReady: async () => {
                return new DragDrop(this.editor)
            },
        })
    }

    async saveData() {
        try {
            const outputData = await this.editor?.save()
            // await storage.setItem("local:editordata", JSON.stringify(outputData))
        }
        catch (error) {
            console.error("Error saving data", error)
            throw error
        }
    }

    async handleGetDataButtonClick() {
        try {
            const val = await this.getData()
            console.log("get-a-data-vl", val)
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
