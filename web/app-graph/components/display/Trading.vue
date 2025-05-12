<script setup lang="ts">
import { reactive, onBeforeMount } from '#imports'

const props = defineProps<{
    address: string
}>()

export type InputData = {
    unit: string
    pools: string
    chart: ChartConfig
}

export type ChartConfig = {
    type: string
    resolution: string
}

const state = reactive({
    iframeSrc: ''
})

function constructLink(data: InputData): string {
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

onBeforeMount(() => {
  state.iframeSrc = constructLink({
    unit: 'tron',
    pools: props.address,
    chart: {
      type: 'price',
      resolution: '1d'
    }
  })
})
</script>

<template>
  <section class="geckoterminal">
    <iframe
      :src="state.iframeSrc"
      frameborder="0"
    ></iframe>
  </section>
</template>

<script setup>


</script>

<style scoped>
.geckoterminal {
  width: 100%;
  height: 100%;
}
iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
