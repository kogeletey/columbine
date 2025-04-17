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

    render() {
        this.wrapper = document.createElement("iframe")
        this.wrapper.setAttribute("src", this.constructLink({
            unit: "eth",
            pools: "0xa6cc3c2531fdaa6ae1a3ca84c2855806728693e8",
            chart: {
                type: "price",
                resolution: "1d",
            },
        }))
        this.wrapper.setAttribute("frameborder", "0")
        this.wrapper.classList.add("geckoterminal")
        return this.wrapper
    }
}
