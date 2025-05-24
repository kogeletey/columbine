import { map } from "nanostores"

export type FilesValue = Array<{
    id: number;
    name: string;
    path: string;
}>

export class FilesStore {
    static $files = map<{ files: FilesValue }>()

    addFiles() {
        FilesStore.$files.setKey('files', [{
            id: 0,
            name: "File 1",
            path: "/",
        }]
        )
    }
    getFiles(): FilesValue {
        return FilesStore.$files.value.files
    }

}
