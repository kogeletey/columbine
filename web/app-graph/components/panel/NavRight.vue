<script setup lang="ts">
import { reactive } from "vue";
import { toggleDark } from "../../composables/dark";
import { rawPayload } from "../../state/data";

const state = reactive({
  isVisible: false,
});
</script>

<template>
  <div flex="~ items-center gap-2" fixed right-4 top-4 z-panel-nav>
    <!-- <PanelFiltersMini /> -->
    <div flex="~ items-center" px3 py2 bg-glass border border-base shadow gap2>
      <TronLink
        v-tooltip="'Login in your account'"
            />
      <button v-if="state.isVisible"
        v-tooltip="'UnWatchContract'"
        hover:bg-active
        op-fade
        hover:op100
        flex="~ items-center justify-center"
        w-10
        h-10
            >
        <div i-ph-eye-slash text-xl />
      </button>
      <button v-else
        v-tooltip="'Watch contract states'"
        hover:bg-active
        op-fade
        hover:op100
        flex="~ items-center justify-center"
        w-10
        h-10
            >
        <div i-ph-eye-duotone text-xl />
      </button>
      <button
        v-tooltip="'Toggle Dark Mode'"
        w-10
        h-10
        hover:bg-active
        op-fade
        hover:op100
        flex="~ items-center justify-center"
        title="Toggle Dark Mode"
        @click="toggleDark()"
      >
        <div i-ph-sun-duotone dark:i-ph-moon-duotone text-xl />
      </button>
    </div>
  </div>
</template>
