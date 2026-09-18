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
      <indicator-panel :active="tab === 'tab-632'" />
      <sizing-panel :active="tab === 'tab-sizing'" />
      <results-panel :active="tab === 'tab-results'" />
      <cost-panel :active="tab === 'tab-cost'" />
      <econ-panel :active="tab === 'tab-econ'" />
      <report-panel :active="tab === 'tab-report'" />
    </div>
  </div>
</template>

<script>
import SourceDataPanel from './components/SourceDataPanel.vue'
import IndicatorPanel from './components/IndicatorPanel.vue'
import SizingPanel from './components/SizingPanel.vue'
import ResultsPanel from './components/ResultsPanel.vue'
import CostPanel from './components/CostPanel.vue'
import EconPanel from './components/EconPanel.vue'
import ReportPanel from './components/ReportPanel.vue'
import { PAGE_TABS } from './config'
import { gdStore } from './store'

export default {
  name: 'PageGreenDirect',
  components: {
    SourceDataPanel,
    IndicatorPanel,
    SizingPanel,
    ResultsPanel,
    CostPanel,
    EconPanel,
    ReportPanel
  },
  data: function () {
    return {
      tab: 'tab-data',
      tabs: PAGE_TABS
    }
  },
  created: function () {
    const self = this
    gdStore.tabHandler = function (id) {
      self.tab = id
    }
  },
  beforeDestroy: function () {
    gdStore.tabHandler = null
  }
}
</script>

<style src="../energyStorage/energyStorage.css"></style>
