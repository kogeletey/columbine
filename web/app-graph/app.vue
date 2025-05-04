<script setup lang="ts">
import { setupQuery } from './state/query'

import 'floating-vue/dist/style.css'
import './styles/global.css'
import './composables/dark'

// setupQuery()
import { computed } from 'vue'
import { rawPayload } from '../state/data'

const props = defineProps<{
  backend?: Backend | undefined
  error?: unknown
}>()


const error = computed(() => {
  if (props.error)
    return props.error
    /*
  if (backend.value?.connectionError.value)
    return backend.value.connectionError.value
  if (backend.value?.status.value === 'error')
    return 'Connection failed'
    */
  return null
})

//const isLoading = computed(() => Boolean(!backend.value || backend.value?.status.value !== 'connected' || error.value || !rawPayload.value))
</script>

<template>
  <div
    v-if="isLoading"
    flex="~ col" h-full w-full items-center justify-center p4
  >
    <div flex="~ col gap-2 items-center justify-center" flex-auto>
      <UiTitle :has-error="!!error" :is-loading="isLoading" />
      <div h-20>
        <div v-if="error" text-red rounded p2 flex="~ col items-center">
          <div text-red5 dark:text-red3>
            {{ error }}
          </div>
        </div>
        <div
          flex="~ gap-2 items-center" text-lg op-fade
        >
        </div>
      </div>
    </div>
  </div>
  <PanelNav v-else />
  <NoMobile />
  <NuxtLayout>
    <NuxtPage v-if="!isLoading" />
  </NuxtLayout>
  <PanelNavRight />
</template>
