<template>
  <div class="tab-content">
    <div class="search-group">
      <div class="search-item-wrapper">
        <label class="search-label">需要提高占比的类型：</label>
        <el-select v-model="selectedTypes" multiple placeholder="请选择" class="search-input">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="search-item-wrapper">
        <label class="search-label">目标组总占比：</label>
        <el-input 
          v-model="targetGroupRatio" 
          placeholder="请输入0.01-0.99" 
          class="search-input"
          @input="handleTargetRatioChange"
          @blur="validateTargetRatio">
        </el-input>
      </div>
      <div class="search-item-wrapper">
        <label class="search-label">其他组总占比：</label>
        <el-input 
          v-model="otherGroupRatio" 
          placeholder="请输入0.01-0.99" 
          class="search-input"
          @input="handleOtherRatioChange"
          @blur="validateOtherRatio">
        </el-input>
      </div>
      <el-button type="primary" @click="handlePredict">预测</el-button>
    </div>
    <div class="chart-container">
      <div v-show="showArrows && currentChartIndex === 1" class="arrow arrow-left" @click="switchChart(-1)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="chart-wrapper">
        <div ref="barChart" class="chart"></div>
      </div>
      <div v-show="showArrows && currentChartIndex === 0" class="arrow arrow-right" @click="switchChart(1)">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
    <div v-if="showArrows" class="chart-indicator">
      <span :class="{active: currentChartIndex === 0}">默认</span>
      <span class="separator">|</span>
      <span :class="{active: currentChartIndex === 1}">预测</span>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TabSecond',
  props: {
    typeOptions: {
      type: Array,
      default: () => []
    },
    chartData1: {
      type: Array,
      default: () => []
    },
    chartData2: {
      type: Array,
      default: () => []
    },
    activeTab: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectedTypes: [],
      targetGroupRatio: '0.6',
      otherGroupRatio: '0.4',
      myChart: null,
      currentChartIndex: 0,
      showArrows: false
    }
  },
  mounted() {
    console.log('TabSecond mounted')
    console.log('chartData1:', this.chartData1)
    console.log('chartData2:', this.chartData2)
    this.$nextTick(() => {
      this.createChart()
    })
    window.addEventListener('resize', this.handleResize)
  },
  watch: {
    chartData1: {
      handler() {
        console.log('chartData1 changed:', this.chartData1)
        this.renderChart()
      },
      deep: true
    },
    chartData2: {
      handler() {
        console.log('chartData2 changed:', this.chartData2)
        this.renderChart()
      },
      deep: true
    },
    activeTab: {
      handler(newVal) {
        console.log('activeTab changed to:', newVal)
        if (newVal === 'second') {
          this.$nextTick(() => {
            console.log('Creating chart for second tab')
            this.createChart()
          })
        }
      }
    }
  },
  beforeDestroy() {
    if (this.myChart) {
      this.myChart.dispose()
      this.myChart = null
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handlePredict() {
      this.$message.success('预测功能')
      this.showArrows = true
      this.switchChart(1)
    },
    handleTargetRatioChange() {
      const val = parseFloat(this.targetGroupRatio)
      if (!isNaN(val) && val >= 0.01 && val <= 0.99) {
        const other = (1 - val).toFixed(2)
        if (parseFloat(other) >= 0.01 && parseFloat(other) <= 0.99) {
          this.otherGroupRatio = other
        }
      }
    },
    handleOtherRatioChange() {
      const val = parseFloat(this.otherGroupRatio)
      if (!isNaN(val) && val >= 0.01 && val <= 0.99) {
        const target = (1 - val).toFixed(2)
        if (parseFloat(target) >= 0.01 && parseFloat(target) <= 0.99) {
          this.targetGroupRatio = target
        }
      }
    },
    validateTargetRatio() {
      const val = parseFloat(this.targetGroupRatio)
      if (isNaN(val) || val < 0.01 || val > 0.99) {
        this.$message.warning('请输入0.01-0.99之间的数字')
        this.targetGroupRatio = '0.6'
      }
    },
    validateOtherRatio() {
      const val = parseFloat(this.otherGroupRatio)
      if (isNaN(val) || val < 0.01 || val > 0.99) {
        this.$message.warning('请输入0.01-0.99之间的数字')
        this.otherGroupRatio = '0.4'
      }
    },
    createChart() {
      const chartDom = this.$refs.barChart
      if (!chartDom) {
        console.error('chart container not found')
        return
      }
      
      const rect = chartDom.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        console.warn('chart container has no size, retrying...')
        setTimeout(() => this.createChart(), 100)
        return
      }
      
      if (this.myChart) {
        this.myChart.dispose()
        this.myChart = null
      }
      
      this.myChart = echarts.init(chartDom)
      this.renderChart()
    },
    renderChart() {
      if (!this.myChart) {
        this.$nextTick(() => {
          this.createChart()
        })
        return
      }
      
      const chartDom = this.$refs.barChart
      if (!chartDom) return
      
      const rect = chartDom.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(() => this.renderChart(), 100)
        return
      }
      
      const currentData = this.currentChartIndex === 0 ? this.chartData1 : this.chartData2
      
      if (!currentData || currentData.length === 0) {
        const categories = Array.from({length: 20}, (_, i) => i + 1)
        const option = {
          title: {
            text: this.currentChartIndex === 0 ? '订单占比' : '预测结果',
            left: 'center',
            textStyle: { fontSize: 18, color: '#333' }
          },
          grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
          xAxis: {
            type: 'category',
            data: categories,
            name: '类型',
            nameLocation: 'middle',
            nameGap: 30,
            axisLabel: { color: '#666', interval: 0, fontSize: 11 },
            axisTick: { alignWithLabel: true }
          },
          yAxis: {
            type: 'value',
            name: '订单量占比',
            nameLocation: 'middle',
            nameGap: 50,
            axisLabel: { color: '#666', formatter: '{value}%' }
          },
          series: [{ name: '订单量占比', type: 'bar', barWidth: '60%', data: [] }]
        }
        this.myChart.setOption(option, true)
        return
      }
      
      const data = currentData.map(item => item.value)
      const categories = currentData.map((_, i) => i + 1)
      
      const option = {
        title: {
          text: this.currentChartIndex === 0 ? '订单占比' : '预测结果',
          left: 'center',
          textStyle: {
            fontSize: 18,
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            const item = params[0]
            const index = item.dataIndex
            const chartItem = currentData[index]
            return `类型：${chartItem.time}<br/>` +
                   `负荷：${chartItem.load}<br/>` +
                   `温度：${chartItem.temperature}<br/>` +
                   `湿度：${chartItem.humidity}<br/>` +
                   `占比：${chartItem.value}%`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          name: '类型',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontSize: 14,
            color: '#666'
          },
          axisLabel: {
            color: '#666',
            interval: 0,
            fontSize: 11
          },
          axisTick: {
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          name: '订单量占比',
          nameLocation: 'middle',
          nameGap: 50,
          nameTextStyle: {
            fontSize: 14,
            color: '#666'
          },
          axisLabel: {
            color: '#666',
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '订单量占比',
            type: 'bar',
            barWidth: '60%',
            data: data,
            itemStyle: {
              color: this.currentChartIndex === 0 ? '#E6A23C' : '#F56C6C'
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}%',
              fontSize: 12,
              color: '#666'
            }
          }
        ]
      }
      
      this.myChart.setOption(option, true)
      this.myChart.resize({ width: rect.width, height: rect.height })
    },
    switchChart(direction) {
      const newIndex = this.currentChartIndex + direction
      
      if (newIndex < 0 || newIndex > 1) return
      
      this.currentChartIndex = newIndex
      
      if (!this.myChart) {
        this.$nextTick(() => {
          this.createChart()
        })
        return
      }
      
      this.renderChart()
    },
    handleResize() {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  }
}
</script>

<style scoped>
.tab-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-item-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-label {
  font-size: 14px;
  color: #666;
}

.search-input {
  width: 200px;
}

.chart-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  position: relative;
  height: 400px;
}

.chart-wrapper {
  flex: 1;
  height: 400px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #fff;
}

.chart {
  width: 100%;
  height: 400px;
}

.arrow {
  width: 50px;
  height: 50px;
  min-width: 50px;
  min-height: 50px;
  flex-shrink: 0;
  border-radius: 50%;
  background-color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  position: absolute;
}

.arrow:hover {
  background-color: #66b1ff;
  transform: scale(1.1);
}

.arrow i {
  color: #fff;
  font-size: 24px;
}

.arrow-left {
  left: 10px;
}

.arrow-right {
  right: 10px;
}

.chart-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 15px;
  font-size: 14px;
  color: #999;
}

.chart-indicator .separator {
  color: #e4e7ed;
}

.chart-indicator .active {
  color: #409EFF;
  font-weight: bold;
}
</style>