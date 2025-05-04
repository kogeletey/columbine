<script setup lang="ts">
import { computed } from 'vue'
import { rawPayload } from '../../state/data'
import { getDeprecatedInfo, payloads, totalWorkspaceSize } from '../../state/payload'
import { settings } from '../../state/settings'
</script>

<template>
  <div flex="~ col">
    <h1 text-lg p4 flex="~ gap-3 items-center">
            Sign In
      <button
        v-tooltip="'Collapse sidepanel'"
        w-10 h-10 mr--2
        op30
        hover="op100 bg-active"
        title="Collapse sidepanel"
        flex="~ items-center justify-center"
        @click="settings.collapseSidepanel = !settings.collapseSidepanel"
      >
        <div i-ph-caret-double-right />
      </button>
    </h1>
  </div>
</template>
