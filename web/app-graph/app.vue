<script setup lang="ts">
import { setupQuery } from './state/query'

import 'floating-vue/dist/style.css'
import './styles/global.css'
import './composables/dark'

// setupQuery()
import { computed } from 'vue'
import { rawPayload } from '../state/data'

const props = defineProps<{
  error?: unknown
}>()


const error = computed(() => {
  if (props.error)
    return props.error
  return null
})

const isLoading = computed(() => Boolean(error.value))
</script>

<template>
  <!-- <NoMobile /> -->
  <NuxtLayout>
    <NuxtPage v-if="!isLoading" />
  </NuxtLayout>
  <PanelNavRight />
</template>
