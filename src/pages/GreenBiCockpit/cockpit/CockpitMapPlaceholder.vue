<template>
  <div class="inner-block cockpit-map">
    <div ref="mapChart" class="cockpit-map__chart" />
    <div class="cockpit-map__glow" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import chinaJson from '../assets/china.json'
import { buildCockpitMapOptions, MAP_MAIN_SERIES_INDEX } from '../utils/cockpitMapOptions'

let chinaMapRegistered = false

function registerChinaMap() {
  if (chinaMapRegistered) return
  echarts.registerMap('china', chinaJson)
  chinaMapRegistered = true
}

export default {
  name: 'CockpitMapPlaceholder',
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tipIndex: 0,
      tipTimer: null
    }
  },
  watch: {
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
    this.unbindTipEvents()
    this.clearTipLoop()
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    initChart() {
      if (!this.$refs.mapChart) return
      this.chart = echarts.init(this.$refs.mapChart)
      this.unbindTipEvents()
      this.bindTipEvents()
      this.updateChart()
    },
    updateChart() {
      if (!this.chart) return
      this.chart.setOption(buildCockpitMapOptions(this.data), true)
      this.tipIndex = 0
      this.startTipLoop()
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    },
    bindTipEvents() {
      if (!this.chart) return
      this.chart.on('mouseover', this.handleTipMouseover)
      this.chart.on('globalout', this.handleTipGlobalout)
    },
    unbindTipEvents() {
      if (!this.chart) return
      this.chart.off('mouseover', this.handleTipMouseover)
      this.chart.off('globalout', this.handleTipGlobalout)
    },
    handleTipMouseover(params) {
      const isMap = params.seriesType === 'map' && params.seriesIndex === MAP_MAIN_SERIES_INDEX
      const isPillar = params.seriesName === 'pillar-base' && params.name
      if (!isMap && !isPillar) return
      if (!params.name) return

      this.clearTipLoop()
      const idx = this.data.findIndex(item => item.name === params.name)
      this.tipIndex = idx >= 0 ? idx : 0
    },
    handleTipGlobalout() {
      this.startTipLoop()
    },
    startTipLoop() {
      this.clearTipLoop()
      const len = this.data.length
      if (!len || !this.chart) return

      const showCurrentTip = () => {
        if (!this.chart) return
        const item = this.data[this.tipIndex]
        if (!item) return
        this.chart.dispatchAction({
          type: 'showTip',
          seriesIndex: MAP_MAIN_SERIES_INDEX,
          name: item.name
        })
        this.tipIndex = (this.tipIndex + 1) % len
      }

      showCurrentTip()
      this.tipTimer = setInterval(showCurrentTip, 2000)
    },
    clearTipLoop() {
      if (this.tipTimer) {
        clearInterval(this.tipTimer)
        this.tipTimer = null
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
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  &__row {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
  }
}
</style>
