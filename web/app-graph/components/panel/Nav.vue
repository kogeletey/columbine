<script setup lang="ts">
import { useRoute } from '#app/composables/router'
import { selectedNode } from '../../state/current'
import { filters } from '../../state/filters'
import { settings } from '../../state/settings'
import { isFiltersOpen, isSettingOpen, isSidepanelCollapsed } from '../../state/ui'

const route = useRoute()
const location = window.location

const tabsMeta = [
  {
    name: 'Graph View',
    path: '/graph',
    icon: 'i-ph-tree-structure-duotone',
  },
  {
    name: 'Grid View',
    path: '/grid',
    icon: 'i-ph-grid-nine-duotone',
  },
  {
    name: 'Report View',
    path: '/report',
    icon: 'i-ph-projector-screen-chart-duotone',
  },
  {
    name: 'Chart View',
    path: '/chart',
    icon: 'i-ph-chart-donut-duotone',
  },
  {
    name: 'Add Contract',
    path: '/',
    icon: 'i-ph-plus-light',
  },
]
</script>

<template>
  <div fixed left-4 top-4 flex="~ gap-3 items-center" z-panel-nav>
    <div
      bg-glass border border-base shadow px3 py2 flex-none
      flex="~ items-center gap-1" w-max
    >
      <template v-for="tab of tabsMeta" :key="tab.value">
        <RouterLink
          v-tooltip="tab.name"
          w-10 h-10 rounded-full hover:bg-active
          flex="~ items-center justify-center"
          :title="tab.name"
          :class="route.path.endsWith(tab.path) ? 'text-primary' : 'op-fade'"
          :to="{ path: tab.path, hash: location.hash }"
        >
          <div :class="tab.icon" text-xl />
        </RouterLink>
      </template>
      <PanelGoto />
    </div>
  </div>
</template>
