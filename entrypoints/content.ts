import { defineContentScript } from "wxt/sandbox";

export default defineContentScript({
    matches: ['*://*.ofs.pub/*'],
    main() {
        console.log('Hello content.');
    },
});
