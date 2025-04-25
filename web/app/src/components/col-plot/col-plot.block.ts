import type { API } from "@editorjs/editorjs"
import type {
    BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"

import * as Plot from "@observablehq/plot"

export type ColPlotParams = BlockToolConstructorOptions

export class ColPlotBlock {
    private api: API
    constructor({ api }: ColPlotParams) {
        this.api = api
    }

    static get toolbox() {
        return {
            title: "ColPlot",
        }
    }

    createPlot() {
        return Plot.rectY({ length: 10000 }, Plot.binX({ y: "count" }, { x: Math.random })).plot()
    }

    render() {
        const wrapper = document.createElement("section")
        const plot = this.createPlot()
        wrapper.append(plot)
        return wrapper
    }
}
