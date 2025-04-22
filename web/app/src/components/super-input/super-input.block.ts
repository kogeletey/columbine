import "@/components/super-input/filter-buttons"

export class SuperInputBlock {
    private wrapper: HTMLElement | null
    constructor({ block }) {
        this.wrapper = null
        this.block = block
    }

    static get toolbox() {
        return {
            title: "SuperInput",
        }
    }

    static get isReadOnlySupported() {
        return true
    }

    static get enableLineBreaks() {
        return true
    }

    render() {
        this.wrapper = document.createElement("fieldset")
        this.wrapper.classList.add("super")

        const input = document.createElement("input")
        const filterButtons = document.createElement("filter-buttons")

        this.wrapper.appendChild(input)
        this.wrapper.appendChild(filterButtons)
        input.placeholder = "Search smart contract"
        // this.wrapper.setAttribute("contenteditable", "true")
        return this.wrapper
    }
}
