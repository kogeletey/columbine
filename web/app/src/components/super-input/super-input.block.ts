import "@/components/super-input/super-input"

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
        return true;
    }

    render() {
        this.wrapper = document.createElement('super-input')
        this.wrapper.setAttribute('contenteditable', 'true')
        return this.wrapper
    }
}
