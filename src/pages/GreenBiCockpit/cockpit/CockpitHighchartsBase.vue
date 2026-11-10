<template>
  <div ref="chartContainer" class="highcharts-base" />
</template>

<script>
import Highcharts from 'highcharts'
import { mergeCockpitChartOptions } from './utils/chartTheme'

export default {
  name: 'CockpitHighchartsBase',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  watch: {
    options: {
      deep: true,
      handler(val) {
        if (this.chart) {
          this.chart.update(val, true, true)
        }
      }
    }
  },
  mounted() {
    this.renderChart()
    window.addEventListener('resize', this.handleResize, { passive: true })
    if (typeof ResizeObserver !== 'undefined' && this.$refs.chartContainer) {
      this.resizeObserver = new ResizeObserver(() => {
        this.handleResize()
      })
      this.resizeObserver.observe(this.$refs.chartContainer)
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    if (this.resizeObserver) {
      this.resizeObserver.disconnect()
      this.resizeObserver = null
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer)
      this.resizeTimer = null
    }
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
    renderChart() {
      if (this.chart) {
        this.chart.destroy()
      }
      this.chart = Highcharts.chart(this.$refs.chartContainer, mergeCockpitChartOptions(this.options))
    },
    handleResize() {
      if (this.resizeTimer) clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        this.resizeTimer = null
        this.reflowChart()
      }, 80)
    },
    reflowChart() {
      if (!this.chart || !this.$refs.chartContainer) return

      const el = this.$refs.chartContainer
      // reflow 可能写入 inline height，反复触发会导致 flex/grid 行被撑高
      el.style.height = ''
      el.style.height = '100%'

      this.chart.reflow()
    },
    getChart() {
      return this.chart
    }
  }
}
</script>

<style scoped lang="scss">
.highcharts-base {
  width: 100%;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
}
</style>
