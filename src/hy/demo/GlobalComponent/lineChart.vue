<template>
  <div class="chart" :id="`lineChart${name}`"></div>
</template>

<script>
export default {
  name: 'lineChart',
  props: {
    name: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      lineChart: null,
      option: {
        tooltip: {
          trigger: 'axis',
          formatter: params => {
            const data = params[0].axisValue
            const value = params[0].value
            return `<div style="padding: 8px;background: #fff;border: 1px solid #ccc;border-radius: 4px;box-shadow: 0 0 5px rgba(0,0,0,0.2);">
      <div style="font-size: 14px; color: #999;margin-bottom: 4px;">${data}</div>
      <div style="font-size: 16px; color: #26b3a4;font-weight: bold;">${value}</div>
    </div>`
          },
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          padding: 0,
        },
        grid: {
          left: 0,
          top: 0,
          bottom: 0,
          right: 0,
          containLabel: false,
        },
        xAxis: {
          type: 'category',
          show: false,
          data: ['04-14', '04-15', '04-16', '04-17', '04-18', '04-19', '04-20', '04-21', '04-22'],
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        backgroundColor: '#f5f7fa',
        series: [
          {
            name: this.name || '测试',
            type: 'line',
            data: [1, 2, 1.8, 4, 5, 7, 6, 5, 3],
            smooth: true,
            showSymbol: false,
            //
            lineStyle: {
              color: '#26b3a4',
              width: 2,
              shadowColor: 'rgba(38,179,164,0.3)',
              shadowBlur: 10,
            },
            itemStyle: {
              color: '#26b3a4',
              borderColor: '#fff',
              borderWidth: 2,
            },
            areaStyle: {
              color: new this.$echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  { offset: 0, color: 'rgba(38,179,164,0.2)' },
                  { offset: 1, color: 'rgba(38,179,164,0)' },
                ],
                false
              ),
            },
          },
        ],
      },
    }
  },
  mounted() {
    this.lineChart = this.$echarts.init(document.getElementById('lineChart' + this.name))
    window.addEventListener('resize', () => {
      this.reloadCharts()
    })
  },
  methods: {
    initChart(array) {
      const { xData, seriesData } = this.extractChartData(array)
      this.option.series[0].data = seriesData
      this.option.xAxis.data = xData
      this.$nextTick(() => {
        this.getData()
      })
    },
    getData() {
      this.lineChart.setOption(this.option)
    },
    initRadar() {
      this.lineChart.setOption(this.option)
    },
    reloadCharts() {
      this.lineChart && this.lineChart.resize()
    },
    extractChartData(chartObj, sort = true) {
      if (!chartObj || typeof chartObj !== 'object') {
        return { xData: [], seriesData: [] }
      }
      const entries = Object.entries(chartObj)
      if (sort) {
        entries.sort(([k1], [k2]) => k1.localeCompare(k2))
      }
      const xData = []
      const seriesData = []
      entries.forEach(([k, v]) => {
        xData.push(k)
        seriesData.push(Number(v))
      })
      return { xData, seriesData }
    },
  },
}
</script>

<style lang="less" scoped>
// .content{
//     height: 100%;
.chart {
  height: 100%;
}
// }
</style>