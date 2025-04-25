export class ColPlotBlock {
    static get toolbox() {
        return {
            title: "ColPlot",
        }
    }
    render() {
        const wrapper = document.createElement("div")
        wrapper.classList.add('col-plot')
        return wrapper
    }
}
