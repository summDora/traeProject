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
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
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
      if (this.chart) {
        this.chart.reflow()
      }
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
  overflow: hidden;
}
</style>
