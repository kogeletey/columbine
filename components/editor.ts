import EditorJS from "@editorjs/editorjs"
import { storage } from "@wxt-dev/storage"

const editor = new EditorJS({
  holder: "alemufu",
})

export async function saveData(): Promise<void> {
  editor
    .save()
    .then(async (outputData) => {
      await storage.setItem(
        "local:editordata",
        JSON.stringify(outputData.blocks),
      )
    })
    .catch((error) => {
      console.error("Error with server", error)
      throw error
    })
}

const saveButton = document.querySelector("button.save-document")
const getDataButton = document.querySelector("button.get-data")

saveButton?.addEventListener("click", async () => {
  await saveData()
})

getDataButton?.addEventListener("click", async () => {
  // const value = await storage.getItem("local:editordata")
})
