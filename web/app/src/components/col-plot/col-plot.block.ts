import type { API } from "@editorjs/editorjs"
import type {
  BlockToolConstructorOptions,
} from "@editorjs/editorjs/types/tools"
import { createPieChart } from "@/components/col-plot/creator-plots"

type DataParams = {
  plot: {
    x: () => {}
  }
}
export type ColPlotParams = BlockToolConstructorOptions<DataParams>

export class ColPlotBlock {
  private api: API
  private data: DataParams

  constructor({ api, data }: ColPlotParams) {
    this.api = api
    this.data = data
  }

  static get toolbox() {
    return {
      title: "ColPlot",
    }
  }

  render() {
    const wrapper = document.createElement("section")
    const plot = createPieChart([{
      name: "Treasure",
      value: "100",
    }, {
      name: "Treasure",
      value: "10",
    }])
    wrapper.append(plot)
    return wrapper
  }
}
