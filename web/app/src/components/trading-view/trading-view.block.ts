type ChartConfig = {
  type: string
  resolution: string
}

type InputData = {
  unit: string
  pools: string
  chart: ChartConfig
}

export class TradingViewBlock {
  private wrapper: HTMLElement | null

  constructor({ api, data, block }) {
    this.api = api
    this.block = block
    this.data = data
    if (Object.values(this.data).length === 0) {
      this.data = { search: "0xa6cc3c2531fdaa6ae1a3ca84c2855806728693e8" }
    }
  }

  static get toolbox() {
    return {
      title: "TradingView",
    }
  }

  constructLink(data: InputData): string {
    const baseUrl = "https://www.geckoterminal.com"
    const { unit, pools, chart } = data

    const { type, resolution } = chart

    const queryParams = new URLSearchParams({
      embed: "1",
      info: "0",
      swaps: "0",
      grayscale: "0",
      /* eslint-disable-next-line camelcase */
      light_chart: "1",
      /* eslint-disable-next-line camelcase */
      chart_type: type,
      resolution,
    })

    return `${baseUrl}/${unit}/pools/${pools}?${queryParams.toString()}`
  }

  createBlock(value: string): HTMLElement {
    const wrapper = document.createElement("section")
    const iframe = document.createElement("iframe")
    iframe.setAttribute("src", this.constructLink({
      unit: "tron",
      pools: value,
      chart: {
        type: "price",
        resolution: "1d",
      },
    }))
    iframe.setAttribute("frameborder", "0")
    wrapper.classList.add("geckoterminal")
    wrapper.append(iframe)
    Promise.resolve().then(() => {
      this.block.stretched = true
    }).catch((err) => {
      console.error(err)
    })
    return wrapper
  }

  save() { }

  render() {
    this.wrapper = this.createBlock(this.data.search)
    return this.wrapper
  }
}
