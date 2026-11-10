<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:center;cursor:pointer;user-select:none" @click="marketOpen = !marketOpen">
        <span :style="{ fontSize: '12px', marginRight: '6px', transition: 'transform 0.2s', transform: marketOpen ? 'rotate(90deg)' : '' }">▶</span>
        <h2 style="margin:0;font-size:15px">市场电价参数</h2>
        <span style="font-size:12px;color:#999;margin-left:12px">{{ marketBrief }}</span>
      </div>
      <div v-show="marketOpen" style="margin-top:12px">
        <div class="upload-row">
          <div class="upload-box">
            <label>上传市场电价 Excel</label>
            <input type="file" accept=".xlsx,.xls" @change="onPickMarket">
            <span class="hint">{{ hintMarket }}</span>
          </div>
          <div class="upload-actions">
            <span class="upload-actions-label" aria-hidden="true">&nbsp;</span>
            <div class="upload-actions-btns">
              <button class="btn secondary" @click="loadMarket">加载市场电价参数</button>
              <button class="btn secondary" @click="uploadMarket">上传电价 Excel</button>
            </div>
          </div>
        </div>
        <div class="status" :style="{ color: marketStatusColor }">{{ marketStatus }}</div>
        <div v-if="marketData">
          <h3 style="font-size:13px;color:#555">{{ marketData.sample_month }}月 48时段参考电价 (元/kWh)</h3>
          <div class="chart-wrap" style="height:220px"><div ref="marketChart" class="chart-el"></div></div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2>电费计算参数</h2>
      <p style="color:#888;font-size:12px;margin-bottom:12px">基于 632 分析缓存的三条功率序列，分别计算下网电费与上网电费。</p>
      <div class="form-grid col3">
        <div class="form-group">
          <label>电压等级 <small style="color:#999">含电价制度</small></label>
          <el-select v-model="gd.cost.voltageValue" size="small" placeholder="待加载..." popper-class="es-select-dropdown">
            <el-option v-for="v in gd.voltageLevels" :key="v.value" :label="v.label" :value="v.value"></el-option>
          </el-select>
        </div>
        <div class="form-group" v-show="!isSingle">
          <label>计费方式</label>
          <el-select v-model="gd.cost.billingMethod" size="small" popper-class="es-select-dropdown">
            <el-option label="按需量" value="demand"></el-option>
            <el-option label="按容量" value="capacity"></el-option>
          </el-select>
        </div>
        <div class="form-group" v-show="showTransformer">
          <label>变压器容量 (MW)</label>
          <el-input size="small" type="number" v-model.number="gd.cost.transformerCapacity" :step="0.1" :min="0"></el-input>
        </div>
        <div class="form-group">
          <label>上网电价 (元/MWh)</label>
          <el-input size="small" type="number" v-model.number="gd.cost.exportPrice" :step="1"></el-input>
        </div>
      </div>
      <div style="margin-top:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <button class="btn primary btn-large" :disabled="calculating" @click="calcCost">
          {{ calculating ? '计算中...' : '开始电费计算' }}
        </button>
        <div class="status" style="margin:0" :style="{ color: costStatusColor }">{{ costStatus }}</div>
        <div v-if="gd.annualBenefit != null" class="es-benefit-chip">
          <span>年度效益：</span>
          <span class="es-benefit-chip__value">{{ Number(gd.annualBenefit).toFixed(2) }}</span>
          <span>万元</span>
        </div>
      </div>
    </div>

    <div v-if="!gd.analysisDone" class="card">
      <p class="empty-hint">请先在「指标分析」页运行 632，再到此处计算电费。</p>
    </div>

    <div v-if="gd.costResult">
      <div class="card">
        <h2>年度电费汇总对比</h2>
        <es-table :data="summaryRows" :columns="columns.costSummary" :visible="active" />
      </div>
      <div class="card">
        <h2>月度电费明细
          <el-select v-model="monthlyIdx" size="mini" class="es-inline-select" popper-class="es-select-dropdown">
            <el-option :value="0" label="调整后负荷"></el-option>
            <el-option :value="1" label="源荷净负荷"></el-option>
            <el-option :value="2" label="源荷储净负荷"></el-option>
          </el-select>
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
import { gdMixin } from '../store'
import { buildCostSummaryRows } from '../helpers'
import { COLUMN_CONFIG } from '../config'
import { disposeChart, renderChart, whenChartVisible, costMonthlyOption, costPieOption, marketBarOption, COST_PIE_COLORS } from '../charts'
import EsTable from './EsTable.vue'

export default {
  name: 'GdCostPanel',
  mixins: [gdMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data() {
    return {
      marketOpen: false,
      marketFile: null,
      hintMarket: '未选择文件',
      marketData: null,
      marketStatus: '',
      marketStatusType: '',
      marketBrief: '',
      calculating: false,
      costStatus: '',
      costStatusType: '',
      monthlyIdx: 2,
      monthlyChart: null,
      marketChart: null,
      pieCharts: [],
      columns: COLUMN_CONFIG
    }
  },
  computed: {
    isSingle() {
      return (this.gd.cost.voltageValue || '').indexOf('single_part|') === 0
    },
    showTransformer() {
      return !this.isSingle && this.gd.cost.billingMethod === 'capacity'
    },
    marketStatusColor() {
      if (this.marketStatusType === 'ok') return '#2e7d32'
      if (this.marketStatusType === 'err') return '#c62828'
      return ''
    },
    costStatusColor() {
      if (this.costStatusType === 'ok') return '#2e7d32'
      if (this.costStatusType === 'err') return '#c62828'
      return '#666'
    },
    summaryRows() {
      const response = this.gd.costResult
      if (!response || !response.results) return []
      return buildCostSummaryRows(response.results)
    },
    monthlyTableRows() {
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
    currentSeries() {
      const r = this.gd.costResult
      if (!r || !r.results) return null
      return r.results[this.monthlyIdx] || r.results[0]
    },
    pieTitles() {
      const r = this.gd.costResult
      if (!r || !r.results) return []
      return r.results.map((s) => { return s.series_label })
    }
  },
  mounted() {
    this.loadMarketSilent()
    if (this.gd.costResult) this.$nextTick(this.drawCharts)
  },
  watch: {
    active(val) {
      if (val) {
        if (!this.gd.voltageLevels.length) this.loadMarketSilent()
        this.$nextTick(this.restoreCharts)
      }
    },
    'gd.costResult'(val) {
      if (val) this.$nextTick(this.drawCharts)
    },
    marketOpen(val) {
      if (val) this.$nextTick(this.restoreCharts)
    }
  },
  beforeDestroy() {
    this.disposeAll()
  },
  methods: {
    applyVoltageLevels(data) {
      if (!data || !data.voltage_levels) return
      const seen = {}
      const list = []
      data.voltage_levels.forEach((v) => {
        const tt = v.category === '单一制' ? 'single_part' : 'two_part'
        const value = tt + '|' + (v.voltage || '')
        if (seen[value]) return
        seen[value] = true
        list.push({
          value: value,
          label: [v.category, v.voltage].filter(Boolean).join(' ')
        })
      })
      this.gd.voltageLevels = list
      if (!this.gd.cost.voltageValue && list.length) {
        this.gd.cost.voltageValue = list[0].value
      }
    },
    loadMarketSilent() {
      API.getMarketParams().then((data) => {
        this.applyMarket(data)
      }).catch(() => {
        this.marketBrief = '未加载'
      })
    },
    applyMarket(data) {
      this.marketData = data
      this.marketBrief = data.message || (data.months ? ('已加载 ' + data.months.length + ' 个月') : '')
      this.marketStatus = data.message || ''
      this.marketStatusType = 'ok'
      this.applyVoltageLevels(data)
      this.$nextTick(this.drawMarket)
    },
    loadMarket() {
      this.marketStatus = '加载中...'
      this.marketStatusType = ''
      API.getMarketParams().then((data) => {
        this.applyMarket(data)
      }).catch((e) => {
        this.marketStatus = '加载失败: ' + e.message
        this.marketStatusType = 'err'
      })
    },
    onPickMarket(e) {
      this.marketFile = e.target.files && e.target.files[0]
      this.hintMarket = this.marketFile ? this.marketFile.name : '未选择文件'
    },
    uploadMarket() {
      if (!this.marketFile) {
        alert('请先选择市场电价文件')
        return
      }
      this.marketStatus = '上传中...'
      this.marketStatusType = ''
      API.uploadMarketPrice(this.marketFile).then((data) => {
        this.applyMarket(data)
      }).catch((e) => {
        this.marketStatus = '上传失败: ' + e.message
        this.marketStatusType = 'err'
      })
    },
    restoreCharts() {
      const els = []
      if (this.$refs.monthlyChart) els.push(this.$refs.monthlyChart)
      if (this.marketOpen && this.$refs.marketChart) els.push(this.$refs.marketChart)
      for (let i = 0; i < 3; i++) {
        const el = this.$refs['pie' + i]
        const node = Array.isArray(el) ? el[0] : el
        if (node) els.push(node)
      }
      if (!els.length) return
      whenChartVisible(els, () => {
        if (this.gd.costResult) {
          this.disposeAll()
          this.drawCharts()
        }
        if (this.marketOpen) this.drawMarket()
      })
    },
    drawMarket() {
      if (!this.marketData || !this.$refs.marketChart) return
      this.marketChart = renderChart(
        this.$refs.marketChart,
        marketBarOption(this.marketData.sample_periods, this.marketData.sample_prices),
        this.marketChart
      )
    },
    calcCost() {
      if (!this.gd.analysisDone) {
        alert('请先运行632分析')
        return
      }
      const voltVal = this.gd.cost.voltageValue || ''
      if (!voltVal) {
        alert('请先加载市场电价参数并选择电压等级')
        return
      }
      const sepIdx = voltVal.indexOf('|')
      const tariffType = sepIdx >= 0 ? voltVal.slice(0, sepIdx) : 'two_part'
      const voltLevel = sepIdx >= 0 ? voltVal.slice(sepIdx + 1) : voltVal
      this.calculating = true
      this.costStatus = '电费计算中…'
      this.costStatusType = ''
      API.calculateElectricityCost({
        tariff_type: tariffType,
        voltage: voltLevel,
        billing_method: this.gd.cost.billingMethod,
        transformer_capacity: this.gd.cost.transformerCapacity,
        export_price: this.gd.cost.exportPrice
      }).then((result) => {
        this.gd.costResult = result
        this.gd.annualBenefit = result.annual_benefit_wan
        this.gd.econ.annual_benefit = Number(Number(result.annual_benefit_wan).toFixed(2))
        this.costStatus = result.message || '计算完成'
        this.costStatusType = 'ok'
        this.updateSelfUseFeeHint()
      }).catch((e) => {
        this.costStatus = e.message
        this.costStatusType = 'err'
      }).then(() => {
        this.calculating = false
      })
    },
    updateSelfUseFeeHint() {
      API.getPowerStats().then((ps) => {
        const selfUse = ps.energies && ps.energies.selfUseOpt
        const st = this.gd.costResult && this.gd.costResult.results && this.gd.costResult.results[2]
        const ann = st ? st.annual : null
        if (selfUse == null || !ann || !(ann.downward_energy_mwh > 0)) {
          this.gd.selfUseFeeHint = ''
          return
        }
        const unitPrice = (ann.energy_tnd_fee + ann.gov_fund_fee) / ann.downward_energy_mwh
        const feeWan = selfUse * unitPrice / 10000
        this.gd.selfUseFeeHint = '自发自用电量 ' + Number(selfUse).toFixed(1) + ' MWh，需缴费用 ' +
          feeWan.toFixed(2) + ' 万元（输配电费+政府性基金均价 ' + unitPrice.toFixed(2) + ' 元/MWh）'
        this.gd.econ.revenue_deduction = Number(feeWan.toFixed(2))
      }).catch(() => {})
    },
    drawCharts() {
      const response = this.gd.costResult
      if (!response || !response.results || !response.results.length) return
      const months = response.results[0].monthly.map((m) => { return m.month_label })
      const seriesList = response.results.map((s) => {
        return { name: s.series_label, data: s.monthly.map((m) => { return m.net_fee }) }
      })
      this.monthlyChart = renderChart(this.$refs.monthlyChart, costMonthlyOption(months, seriesList), this.monthlyChart)

      this.pieCharts.forEach(disposeChart)
      this.pieCharts = []
      const colorMap = COST_PIE_COLORS
      const feeLabels = ['终端电能电费', '电度输配电费', '政府性基金', '容/需量电费']
      response.results.forEach((s, i) => {
        const el = this.$refs['pie' + i]
        const node = Array.isArray(el) ? el[0] : el
        if (!node) return
        const values = [
          s.annual.terminal_energy_fee,
          s.annual.energy_tnd_fee,
          s.annual.gov_fund_fee,
          s.annual.capacity_demand_fee
        ]
        this.pieCharts.push(renderChart(node, costPieOption(feeLabels, values, colorMap), null))
      })
      this.resizeAll()
    },
    resizeAll() {
      ;[this.monthlyChart, this.marketChart].concat(this.pieCharts).forEach((c) => {
        if (c && c.resize) {
          try { c.resize() } catch (e) {}
        }
      })
    },
    disposeAll() {
      disposeChart(this.monthlyChart)
      disposeChart(this.marketChart)
      this.monthlyChart = null
      this.marketChart = null
      this.pieCharts.forEach(disposeChart)
      this.pieCharts = []
    }
  }
}
</script>
