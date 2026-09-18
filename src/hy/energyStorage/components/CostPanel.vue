<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;cursor:pointer;user-select:none" @click="marketOpen = !marketOpen">
        <span :style="{ fontSize: '12px', marginRight: '6px', transition: 'transform 0.2s', transform: marketOpen ? 'rotate(90deg)' : '' }">▶</span>
        <h2 style="margin:0;font-size:15px">市场电价参数</h2>
        <span style="font-size:12px;color:#999;margin-left:12px">{{ marketBrief }}</span>
      </div>
      <div v-show="marketOpen" style="margin-top:12px">
        <div class="form-row">
          <button class="btn secondary" @click="loadMarket">加载市场电价参数</button>
          <div class="form-group" style="margin-left:12px">
            <label>上传市场电价 Excel</label>
            <input type="file" accept=".xlsx,.xls" @change="onPickMarket">
          </div>
          <button class="btn secondary" @click="uploadMarket">上传电价 Excel</button>
        </div>
        <div class="status" :style="{ color: marketStatusColor }">{{ marketStatus }}</div>
        <div v-if="marketData">
          <h3 style="font-size:13px;color:#555">{{ marketData.sample_month }}月 48时段参考电价 (元/kWh)</h3>
          <es-table :data="marketRows" :columns="marketColumns" :max-height="200" :visible="active" />
        </div>
      </div>
    </div>

    <div class="card">
      <h2>电费计算参数</h2>
      <p style="color:#888;font-size:12px;margin-bottom:12px">基于优化结果的三条功率序列（调整后负荷、源荷净负荷、源荷储净负荷），分别计算下网电费与上网电费。</p>
      <div class="form-grid col3">
        <div class="form-group">
          <label>电压等级 <small style="color:#999">含电价制度</small></label>
          <select v-model="es.cost.voltageValue">
            <option v-if="!es.voltageLevels.length" value="">待加载...</option>
            <option v-for="v in es.voltageLevels" :key="v.value" :value="v.value">{{ v.label }}</option>
          </select>
        </div>
        <div class="form-group" v-show="!isSingle">
          <label>计费方式</label>
          <select v-model="es.cost.billingMethod">
            <option value="demand">按需量</option>
            <option value="capacity">按容量</option>
          </select>
        </div>
        <div class="form-group" v-show="showTransformer">
          <label>变压器容量 (MW)</label>
          <input type="number" v-model.number="es.cost.transformerCapacity" step="0.1" min="0">
        </div>
        <div class="form-group">
          <label>上网电价 (元/MWh)</label>
          <input type="number" v-model.number="es.cost.exportPrice" step="1">
        </div>
      </div>
      <div style="margin-top:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <button class="btn primary btn-large" :disabled="calculating" @click="calcCost">
          {{ calculating ? '计算中...' : '开始电费计算' }}
        </button>
        <div class="status" style="margin:0" :style="{ color: costStatusColor }">{{ costStatus }}</div>
        <div v-if="es.annualBenefit != null" class="es-benefit-chip">
          <span>年度效益：</span>
          <span class="es-benefit-chip__value">{{ Number(es.annualBenefit).toFixed(2) }}</span>
          <span>万元</span>
        </div>
      </div>
    </div>

    <div v-if="!es.optimizeResult" class="card">
      <p class="empty-hint">请先在"优化计算"页运行优化，再到此处计算电费。</p>
    </div>

    <div v-if="es.costResult">
      <div class="card">
        <h2>年度电费汇总对比</h2>
        <es-table :data="summaryRows" :columns="columns.costSummary" :visible="active" />
      </div>

      <div class="card">
        <h2>月度电费明细
          <select v-model.number="monthlyIdx" style="font-size:12px;padding:3px 8px;margin-left:12px;border:1px solid #ddd;border-radius:4px">
            <option :value="0">调整后负荷</option>
            <option :value="1">源荷净负荷</option>
            <option :value="2">源荷储净负荷</option>
          </select>
        </h2>
        <es-table :data="monthlyTableRows" :columns="columns.costMonthly" :max-height="500" :visible="active" />
      </div>

      <div class="card">
        <h2>月度净电费对比</h2>
        <div class="chart-wrap"><div ref="monthlyChart" class="chart-el"></div></div>
      </div>

      <div class="card">
        <h2>年度费用构成</h2>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          <div v-for="(s, i) in pieTitles" :key="i">
            <div style="text-align:center;font-weight:600;font-size:13px;margin-bottom:4px">{{ s }}</div>
            <div class="chart-wrap"><div :ref="'pie' + i" class="chart-el"></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { esMixin } from '../store'
import { buildCostSummaryRows } from '../helpers'
import { COLUMN_CONFIG, buildMarketColumns, buildMarketRows } from '../config'
import { disposeChart, renderChart, costMonthlyOption, costPieOption } from '../charts'
import EsTable from './EsTable.vue'

export default {
  name: 'CostPanel',
  mixins: [esMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      marketOpen: false,
      marketFile: null,
      marketData: null,
      marketStatus: '',
      marketStatusType: '',
      marketBrief: '',
      calculating: false,
      costStatus: '',
      costStatusType: '',
      monthlyIdx: 0,
      monthlyChart: null,
      pieCharts: [],
      columns: COLUMN_CONFIG
    }
  },
  computed: {
    isSingle: function () {
      const cat = (this.es.cost.voltageValue || '').split('|')[0]
      return cat === '单一制'
    },
    showTransformer: function () {
      return !this.isSingle && this.es.cost.billingMethod === 'capacity'
    },
    marketStatusColor: function () {
      if (this.marketStatusType === 'ok') return 'green'
      if (this.marketStatusType === 'err') return 'red'
      return ''
    },
    costStatusColor: function () {
      if (this.costStatusType === 'ok') return 'green'
      if (this.costStatusType === 'err') return 'red'
      return '#666'
    },
    summaryRows: function () {
      const response = this.es.costResult
      if (!response || !response.results) return []
      return buildCostSummaryRows(response.results)
    },
    marketColumns: function () {
      return buildMarketColumns(this.marketData && this.marketData.sample_periods)
    },
    marketRows: function () {
      return buildMarketRows(this.marketData && this.marketData.sample_prices)
    },
    monthlyTableRows: function () {
      const s = this.currentSeries
      if (!s) return []
      const rows = (s.monthly || []).slice()
      if (s.annual) {
        rows.push(Object.assign({}, s.annual, {
          month_label: '年度合计',
          max_load_mw: '-',
          energy_trade_price: '-',
          _summary: true
        }))
      }
      return rows
    },
    currentSeries: function () {
      const r = this.es.costResult
      if (!r || !r.results) return null
      return r.results[this.monthlyIdx] || r.results[0]
    },
    pieTitles: function () {
      const r = this.es.costResult
      if (!r || !r.results) return []
      return r.results.map(function (s) { return s.series_label })
    }
  },
  mounted: function () {
    this.loadMarketSilent()
    if (this.es.costResult) this.$nextTick(this.drawCharts)
  },
  watch: {
    active: function (val) {
      if (val) {
        if (!this.es.voltageLevels.length) this.loadMarketSilent()
        this.$nextTick(this.resizeAll)
      }
    },
    'es.costResult': function (val) {
      if (val) this.$nextTick(this.drawCharts)
    }
  },
  beforeDestroy: function () {
    this.disposeAll()
  },
  methods: {
    applyVoltageLevels: function (data) {
      if (!data || !data.voltage_levels) return
      this.es.voltageLevels = data.voltage_levels.map(function (v) {
        const label = [v.category, v.voltage].filter(Boolean).join(' ')
        return {
          value: (v.category || '') + '|' + (v.voltage || ''),
          label: label || v.voltage
        }
      })
      if (!this.es.cost.voltageValue && this.es.voltageLevels.length) {
        this.es.cost.voltageValue = this.es.voltageLevels[0].value
      }
    },
    loadMarketSilent: function () {
      const self = this
      API.getMarketParams().then(function (data) {
        self.marketData = data
        self.marketBrief = data.message || ''
        self.marketStatus = data.message || ''
        self.marketStatusType = 'ok'
        self.applyVoltageLevels(data)
      }).catch(function () {
        self.marketBrief = '未加载'
      })
    },
    loadMarket: function () {
      const self = this
      this.marketStatus = '加载中...'
      this.marketStatusType = ''
      API.getMarketParams().then(function (data) {
        self.marketData = data
        self.marketStatus = data.message
        self.marketStatusType = 'ok'
        self.marketBrief = data.message || ''
        self.applyVoltageLevels(data)
      }).catch(function (e) {
        self.marketStatus = '加载失败: ' + e.message
        self.marketStatusType = 'err'
      })
    },
    onPickMarket: function (e) {
      this.marketFile = e.target.files && e.target.files[0]
    },
    uploadMarket: function () {
      const self = this
      if (!this.marketFile) {
        alert('请先选择市场电价文件')
        return
      }
      this.marketStatus = '上传中...'
      this.marketStatusType = ''
      API.uploadMarketPrice(this.marketFile).then(function (data) {
        self.marketStatus = data.message || '上传成功'
        self.marketStatusType = 'ok'
        return API.getMarketParams()
      }).then(function (marketData) {
        self.marketData = marketData
        self.marketBrief = marketData.message || ''
        self.applyVoltageLevels(marketData)
      }).catch(function (e) {
        self.marketStatus = '上传失败: ' + e.message
        self.marketStatusType = 'err'
      })
    },
    calcCost: function () {
      const self = this
      if (!this.es.optimizeResult) {
        alert('请先在"优化计算"页运行优化')
        return
      }
      const r = this.es.optimizeResult
      const voltVal = this.es.cost.voltageValue || ''
      const sepIdx = voltVal.indexOf('|')
      const voltCategory = (sepIdx >= 0 ? voltVal.slice(0, sepIdx) : '').trim()
      const voltLevel = sepIdx >= 0 ? voltVal.slice(sepIdx + 1) : voltVal
      const params = {
        adjusted_load: r.detail_load,
        net_load: r.detail_net_load,
        net_with_storage: r.detail_net_with_storage,
        time_labels: r.detail_chart_labels,
        detail_price: r.detail_price,
        tariff_type: voltCategory === '单一制' ? 'single_part' : 'two_part',
        voltage: voltLevel,
        billing_method: this.es.cost.billingMethod,
        transformer_capacity: this.es.cost.transformerCapacity,
        export_price: this.es.cost.exportPrice,
        base_price: (this.es.optimizeParams && this.es.optimizeParams.base_price) || 500,
        dt_hours: r.dt_hours || 0.5
      }
      this.calculating = true
      this.costStatus = '正在计算...'
      this.costStatusType = ''
      API.calculateElectricityCost(params).then(function (result) {
        self.es.costResult = result
        const adjustedNetFee = result.results[0] ? result.results[0].annual.net_fee : 0
        const storageNetFee = result.results[2] ? result.results[2].annual.net_fee : 0
        self.es.annualBenefit = (adjustedNetFee - storageNetFee) / 10000
        self.costStatus = '计算完成'
        self.costStatusType = 'ok'
      }).catch(function (e) {
        self.costStatus = e.message
        self.costStatusType = 'err'
      }).then(function () {
        self.calculating = false
      })
    },
    drawCharts: function () {
      const response = this.es.costResult
      if (!response) return
      const months = response.results[0].monthly.map(function (m) { return m.month_label })
      const seriesList = response.results.map(function (s) {
        return { name: s.series_label, data: s.monthly.map(function (m) { return m.net_fee }) }
      })
      this.monthlyChart = renderChart(this.$refs.monthlyChart, costMonthlyOption(months, seriesList), this.monthlyChart)

      this.pieCharts.forEach(disposeChart)
      this.pieCharts = []
      const colorMap = ['#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444']
      const feeLabels = ['终端电能电费', '电度输配电费', '政府性基金', '容/需量电费']
      const self = this
      response.results.forEach(function (s, i) {
        const el = self.$refs['pie' + i]
        const node = Array.isArray(el) ? el[0] : el
        if (!node) return
        const values = [
          s.annual.terminal_energy_fee,
          s.annual.energy_tnd_fee,
          s.annual.gov_fund_fee,
          s.annual.capacity_demand_fee
        ]
        self.pieCharts.push(renderChart(node, costPieOption(feeLabels, values, colorMap), null))
      })
      this.resizeAll()
    },
    resizeAll: function () {
      if (this.monthlyChart && this.monthlyChart.resize) {
        try { this.monthlyChart.resize() } catch (e) {}
      }
      this.pieCharts.forEach(function (c) {
        if (c && c.resize) {
          try { c.resize() } catch (e) {}
        }
      })
    },
    disposeAll: function () {
      disposeChart(this.monthlyChart)
      this.monthlyChart = null
      this.pieCharts.forEach(disposeChart)
      this.pieCharts = []
    }
  }
}
</script>
