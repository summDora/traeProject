<template>
  <div class="es-app">
    <nav class="es-step-tabs">
      <div class="es-step-tabs-inner">
        <button
          v-for="item in tabs"
          :key="item.id"
          type="button"
          class="es-step-tab"
          :class="{ 'is-active': tab === item.id }"
          @click="tab = item.id"
        >
          {{ item.no }}. {{ item.label }}
        </button>
      </div>
    </nav>
    <div class="es-body">
      <source-data-panel :active="tab === 'tab-data'" />
      <storage-params-panel :active="tab === 'tab-storage'" />
      <optimize-panel :active="tab === 'tab-optimize'" />
      <results-panel :active="tab === 'tab-results'" />
      <cost-panel :active="tab === 'tab-cost'" />
      <econ-panel :active="tab === 'tab-econ'" />
    </div>
  </div>
</template>

<script>
import SourceDataPanel from './components/SourceDataPanel.vue'
import StorageParamsPanel from './components/StorageParamsPanel.vue'
import OptimizePanel from './components/OptimizePanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import CostPanel from './components/CostPanel.vue'
import EconPanel from './components/EconPanel.vue'
import { PAGE_TABS } from './config'

export default {
  name: 'PageEnergyStorage',
  components: {
    SourceDataPanel,
    StorageParamsPanel,
    OptimizePanel,
    ResultsPanel,
    CostPanel,
    EconPanel
  },
  data: function () {
    return {
      tab: 'tab-data',
      tabs: PAGE_TABS
    }
  }
}
</script>

<style src="./energyStorage.css"></style>
