<template>
  <div class="tab-content">
    <div class="search-group">
      <div class="search-item-wrapper">
        <label class="search-label">预测年限：</label>
        <el-select v-model="predictionYear" placeholder="请选择年份" class="search-input">
          <el-option
            v-for="year in yearOptions"
            :key="year"
            :label="year + '年'"
            :value="year">
          </el-option>
        </el-select>
      </div>
      <div class="search-item-wrapper">
        <label class="search-label">年预测保有量：</label>
        <el-input 
          v-model="annualPrediction" 
          placeholder="请输入0-999999999999" 
          class="search-input"
          @blur="validateAnnualPrediction">
        </el-input>
      </div>
      <div class="search-item-wrapper">
        <label class="search-label">基础负荷年增长率：</label>
        <el-input 
          v-model="baseLoadGrowthRate" 
          placeholder="请输入0-10" 
          class="search-input"
          @blur="validateGrowthRate">
        </el-input>
      </div>
      <el-button type="primary" @click="handleThirdTabPredict">预测</el-button>
    </div>
    <div class="chart-container">
      <div v-show="currentThirdChartIndex > 0" class="arrow arrow-left" @click="switchThirdChart(-1)">
        <i class="el-icon-arrow-left"></i>
      </div>
      <div class="chart-wrapper">
        <div ref="thirdChart" class="chart"></div>
      </div>
      <div v-show="currentThirdChartIndex < chartTitles.length - 1" class="arrow arrow-right" @click="switchThirdChart(1)">
        <i class="el-icon-arrow-right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'TabThird',
  props: {
    yearOptions: {
      type: Array,
      default: () => []
    },
    chartTitles: {
      type: Array,
      default: () => []
    },
    chartDefaultDatas: {
      type: Array,
      default: () => []
    },
    chartDatas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      predictionYear: 2030,
      annualPrediction: '9000000',
      baseLoadGrowthRate: '0.0684',
      currentThirdChartIndex: 0,
      thirdChart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.createThirdChart()
    })
    window.addEventListener('resize', this.handleResize)
  },
  watch: {
    chartDefaultDatas: {
      handler() {
        this.renderThirdChart()
      },
      deep: true
    },
    chartDatas: {
      handler() {
        this.renderThirdChart()
      },
      deep: true
    }
  },
  beforeDestroy() {
    if (this.thirdChart) {
      this.thirdChart.dispose()
      this.thirdChart = null
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    handleThirdTabPredict() {
      this.$message.success('典型日预测功能')
      this.$nextTick(() => {
        this.renderThirdChart()
      })
    },
    validateAnnualPrediction() {
      const val = parseFloat(this.annualPrediction)
      if (isNaN(val) || val < 0 || val > 999999999999) {
        this.$message.warning('请输入0-999999999999之间的数字')
        this.annualPrediction = '9000000'
      }
    },
    validateGrowthRate() {
      const val = parseFloat(this.baseLoadGrowthRate)
      if (isNaN(val) || val < 0 || val > 10) {
        this.$message.warning('请输入0-10之间的数字')
        this.baseLoadGrowthRate = '0.0684'
      }
    },
    createThirdChart() {
      if (!this.thirdChart) {
        const chartDom = this.$refs.thirdChart
        if (!chartDom) {
          console.error('third chart container not found')
          return
        }
        
        const rect = chartDom.getBoundingClientRect()
        if (rect.width === 0 || rect.height === 0) {
          setTimeout(() => this.createThirdChart(), 100)
          return
        }
        
        this.thirdChart = echarts.init(chartDom)
      }
      
      this.renderThirdChart()
    },
    switchThirdChart(direction) {
      const newIndex = this.currentThirdChartIndex + direction
      
      if (newIndex < 0 || newIndex >= this.chartTitles.length) return
      
      this.currentThirdChartIndex = newIndex
      
      if (!this.thirdChart) {
        this.$nextTick(() => {
          this.createThirdChart()
        })
        return
      }
      
      this.renderThirdChart()
    },
    renderThirdChart() {
      if (!this.thirdChart) {
        this.$nextTick(() => {
          this.createThirdChart()
        })
        return
      }
      
      const chartDom = this.$refs.thirdChart
      if (!chartDom) return
      
      const rect = chartDom.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) {
        setTimeout(() => this.renderThirdChart(), 100)
        return
      }
      
      const chartData = this.chartDefaultDatas[this.currentThirdChartIndex]
      
      if (!chartData || chartData.length === 0) {
        const categories = Array.from({length: 24}, (_, i) => i)
        const option = {
          title: {
            text: `${this.chartTitles[this.currentThirdChartIndex] || ''}-${this.predictionYear}年电力负荷多情景预测`,
            left: 'center',
            textStyle: { fontSize: 18, color: '#333' }
          },
          grid: { left: '3%', right: '4%', bottom: '15%', top: '15%', containLabel: true },
          xAxis: {
            type: 'category',
            data: categories,
            name: '时刻（hour）',
            nameLocation: 'middle',
            nameGap: 30,
            axisLabel: { color: '#666', interval: 0, fontSize: 11 },
            axisTick: { alignWithLabel: true }
          },
          yAxis: {
            type: 'value',
            name: '负荷功率（KW）',
            nameLocation: 'middle',
            nameGap: 60,
            axisLabel: { color: '#666', formatter: (v) => v.toLocaleString() }
          },
          series: []
        }
        this.thirdChart.setOption(option, true)
        return
      }
      
      const categories = Array.from({length: 24}, (_, i) => i)
      const year = this.predictionYear
      
      const seriesNames = [
        '真实历史负荷',
        `${year}年自然增长（无EV增量）`,
        'EV数量增加',
        '大容量用户占比提升',
        '电价政策改变'
      ]
      
      const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
      
      const baseData = chartData.map(item => item.value * 10000)
      
      const seriesData = [
        baseData.map((v, i) => Math.floor(v * 0.85 + Math.sin(i * Math.PI / 6) * 5000 + Math.random() * 3000)),
        baseData.map((v, i) => Math.floor(v * 0.95 + Math.cos(i * Math.PI / 8) * 8000 + Math.random() * 5000)),
        baseData.map((v, i) => Math.floor(v * 1.05 + Math.sin(i * Math.PI / 4) * 6000 + Math.random() * 4000)),
        baseData.map((v, i) => Math.floor(v * 1.0 + Math.cos(i * Math.PI / 12) * 7000 + Math.random() * 6000)),
        baseData.map((v, i) => Math.floor(v * 0.9 + Math.sin(i * Math.PI / 3) * 9000 + Math.random() * 7000))
      ]
      
      const series = seriesNames.map((name, index) => ({
        name: name,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        data: seriesData[index],
        lineStyle: {
          color: colors[index],
          width: 2
        },
        itemStyle: {
          color: colors[index]
        },
        emphasis: {
          focus: 'series'
        }
      }))
      
      const option = {
        title: {
          text: `${this.chartTitles[this.currentThirdChartIndex]}-${year}年电力负荷多情景预测`,
          left: 'center',
          textStyle: {
            fontSize: 18,
            color: '#333'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: (params) => {
            let result = `时刻：${params[0].axisValue}时<br/>`
            params.forEach(item => {
              result += `${item.marker} ${item.seriesName}：${item.value.toLocaleString()} KW<br/>`
            })
            return result
          }
        },
        legend: {
          data: seriesNames,
          bottom: '0%',
          textStyle: {
            fontSize: 12
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: categories,
          name: '时刻（hour）',
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
          name: '负荷功率（KW）',
          nameLocation: 'middle',
          nameGap: 60,
          nameTextStyle: {
            fontSize: 14,
            color: '#666'
          },
          axisLabel: {
            color: '#666',
            formatter: (value) => value.toLocaleString()
          }
        },
        series: series
      }
      
      this.thirdChart.setOption(option, true)
      this.thirdChart.resize({ width: rect.width, height: rect.height })
    },
    handleResize() {
      if (this.thirdChart) {
        this.thirdChart.resize()
      }
    }
  }
}
</script>

<style scoped>
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
</style>
