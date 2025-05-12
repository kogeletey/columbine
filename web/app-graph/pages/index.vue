<script setup lang="ts">
import { useRoute, useRouter } from '#app/composables/router'

import { useContractsStore } from '#imports';

const input = defineModel()

const contractsStore = useContractsStore()

const state = reactive({
    loader: false,
    getTokenAddress: computed(() => contractsStore.getTokenAddress)
})

const router = useRouter()
const route = useRoute()

const getInput = async (): Promise<void> => {
    state.loader = true;
    await contractsStore.fetchTokenInformation(input.value as string)
    router.replace({ path: `/report/${state.getTokenAddress}`, hash: location.hash, query: route.query })
    state.loader = false
}

</script>

<template>
    <div class="overview">
        <label
          border="~ base" bg-glass shadow transition-all
          grid="~ gap-2 items-center" py3 px4 text-lg
          rounded-sm
          focus-within="shadow-xl ring-4 ring-primary:10"
        >
          <input
            v-model="input"
            placeholder="Enter contract address"
            :disabled="state.loader"
            w-120 py2 font-mono bg-transparent outline-none
            placeholder-gray:40
            @keydown.enter="getInput"
          >
        </label>
        <div v-if="error" h-20 text-red rounded p2 flex="~ col items-center">
          <div font-bold>
            Failed to Connect to the API
          </div>
          <div text-red5 dark:text-red3>
            {{ error }}
          </div>
        </div>
      </div>
  </template>

<style>
.overview {
    display: grid;
    align-content: center;
    justify-content: center;
    min-height: 100vh;
}
</style>
