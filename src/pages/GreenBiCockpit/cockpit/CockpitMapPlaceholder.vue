<template>
  <div class="inner-block cockpit-map">
    <div ref="mapChart" class="cockpit-map__chart" />
    <div class="cockpit-map__glow" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaJson from './assets/china.json'
import { buildCockpitMapOptions } from './utils/cockpitMapOptions'
import cockpitViewportMixin from './mixins/cockpitViewport'

let chinaMapRegistered = false

function registerChinaMap() {
  if (chinaMapRegistered) return
  echarts.registerMap('china', chinaJson)
  chinaMapRegistered = true
}

export default {
  name: 'CockpitMapPlaceholder',
  mixins: [cockpitViewportMixin],
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    viewportWidth() {
      this.updateChart()
    },
    data: {
      deep: true,
      handler() {
        this.updateChart()
      }
    }
  },
  mounted() {
    registerChinaMap()
    this.initChart()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.mapChart) return
      this.chart = echarts.init(this.$refs.mapChart)
      this.updateChart()
    },
    updateChart() {
      if (!this.chart) return
      this.chart.setOption(buildCockpitMapOptions(this.data, this.viewportWidth), true)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import './styles/map-placeholder.scss';
</style>

<style lang="scss">
.cockpit-map-tip {
  line-height: 1.5;

  &__title {
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__row {
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
