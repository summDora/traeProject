<template>
  <div class="page6-container">
    <div ref="sankeyChart" class="sankey-chart"></div>
    <div class="tables-container">
      <div class="table-wrapper">
        <h3 class="table-title">化工行业上游用电系数</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>行业</th>
              <th>化工上游</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in upstreamData" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="table-wrapper">
        <h3 class="table-title">化工行业下游用电系数</h3>
        <table class="data-table">
          <thead>
            <tr>
              <th>行业</th>
              <th>化工下游</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in downstreamData" :key="item.name">
              <td>{{ item.name }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Page6',
  data() {
    return {
      chart: null,
      upstreamData: [
        { name: '电力、热力生产和供应', value: 0.214673066 },
        { name: '交通运输、仓储和邮政', value: 0.052035691 },
        { name: '纺织品（上游）', value: 0.021967612 },
        { name: '批发和零售', value: 0.017789866 },
        { name: '食品与烟草', value: 0.010042788 }
      ],
      downstreamData: [
        { name: '电气机械和器材', value: 0.087861555 },
        { name: '纺织品（下游）', value: 0.08358947 },
        { name: '卫生和社会工作', value: 0.026808569 },
        { name: '研究和试验发展', value: 0.015875025 },
        { name: '水的生产和供应', value: 0.012172174 }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    initChart() {
      const chartDom = this.$refs.sankeyChart
      if (!chartDom) return

      const rect = chartDom.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(() => this.initChart(), 100)
        return
      }

      this.chart = echarts.init(chartDom)
      this.renderChart()
    },
    renderChart() {
      if (!this.chart) return

      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          formatter: (params) => {
            if (params.dataType === 'edge') {
              if (params.data.source === 'B') {
                return `${params.data.target}: ${params.value}`
              }
              return `${params.data.source}: ${params.value}`
            }
            if (params.name === 'B') return ''
            return `${params.name}: ${params.value}`
          }
        },
        series: [
          {
            type: 'sankey',
            layout: 'none',
            emphasis: {
              focus: 'adjacency',
              lineStyle: {
                width: 10
              }
            },
            nodeAlign: 'justify',
            nodeGap: 15,
            nodeWidth: 24,
            layoutIterations: 0,
            left: '10%',
            right: '10%',
            data: [
              { name: '电力、热力生产和供应', itemStyle: { color: '#667EEA' } },
              { name: '交通运输、仓储和邮政', itemStyle: { color: '#764BA2' } },
              { name: '纺织品（上游）', itemStyle: { color: '#F093FB' } },
              { name: '批发和零售', itemStyle: { color: '#4FACFE' } },
              { name: '食品与烟草', itemStyle: { color: '#43E97B' } },
              { name: 'B', itemStyle: { color: '#FA709A' } },
              { name: '电气机械和器材', itemStyle: { color: '#FEE140' }, label: { position: 'left' } },
              { name: '纺织品（下游）', itemStyle: { color: '#FDC086' }, label: { position: 'left' } },
              { name: '卫生和社会工作', itemStyle: { color: '#FF9A9E' }, label: { position: 'left' } },
              { name: '研究和试验发展', itemStyle: { color: '#A8EDEA' }, label: { position: 'left' } },
              { name: '水的生产和供应', itemStyle: { color: '#D4A5A5' }, label: { position: 'left' } }
            ],
            links: [
              { source: '电力、热力生产和供应', target: 'B', value: 0.214, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#667EEA' }, { offset: 0.5, color: '#B5C4E5' }, { offset: 1, color: '#E8ECF0' }] } } },
              { source: '交通运输、仓储和邮政', target: 'B', value: 0.052, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#764BA2' }, { offset: 0.5, color: '#B89AD8' }, { offset: 1, color: '#E8ECF0' }] } } },
              { source: '纺织品（上游）', target: 'B', value: 0.021, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#F093FB' }, { offset: 0.5, color: '#F8CFFE' }, { offset: 1, color: '#F0F4F8' }] } } },
              { source: '批发和零售', target: 'B', value: 0.017, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#4FACFE' }, { offset: 0.5, color: '#B5D8FE' }, { offset: 1, color: '#E8ECF0' }] } } },
              { source: '食品与烟草', target: 'B', value: 0.010     , lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#43E97B' }, { offset: 0.5, color: '#B5F0D8' }, { offset: 1, color: '#F0F4F8' }] } } },
              { source: 'B', target: '电气机械和器材', value: 0.087, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#E8ECF0' }, { offset: 1, color: '#FEE970' }, { offset: 1, color: '#FEE140' }] } } },
              { source: 'B', target: '纺织品（下游）', value: 0.083, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#E8ECF0' }, { offset: 1, color: '#FED988' }, { offset: 1, color: '#FDC086' }] } } },
              { source: 'B', target: '卫生和社会工作', value: 0.026, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#E8ECF0' }, { offset: 1, color: '#FFC4C8' }, { offset: 1, color: '#FF9A9E' }] } } },
              { source: 'B', target: '研究和试验发展', value: 0.015, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#E8ECF0' }, { offset: 1, color: '#C8E8E4' }, { offset: 1, color: '#A8EDEA' }] } } },
              { source: 'B', target: '水的生产和供应', value: 0.012, lineStyle: { color: { type: 'linear', x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: '#E8ECF0' }, { offset: 1, color: '#E6C8C8' }, { offset: 1, color: '#D4A5A5' }] } } }
            ],
            lineStyle: {
              curveness: 0.3,
              opacity: 0.9,
              width: 20
            },
            itemStyle: {
              borderColor: 'transparent',
              borderWidth: 0
            },
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#333'
            }
          }
        ]
      }

      this.chart.setOption(option)
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize()
      }
    }
  }
}
</script>

<style scoped>
.page6-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.sankey-chart {
  width: 100%;
  max-width: 1200px;
  height: 500px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background-color: #fff;
  margin-bottom: 30px;
}

.tables-container {
  display: flex;
  justify-content: center;
  gap: 40px;
  width: 100%;
  max-width: 900px;
}

.table-wrapper {
  flex: 1;
  min-width: 280px;
}

.table-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
  text-align: center;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
}

.data-table th,
.data-table td {
  padding: 10px 12px;
  text-align: left;
  border-bottom: 1px solid #e4e7ed;
}

.data-table th {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #666;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover {
  background-color: #fafafa;
}
</style>