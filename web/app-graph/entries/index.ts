import { defineAsyncComponent } from 'vue'

export default defineAsyncComponent(() => {
    return import('./dev.vue')
})
