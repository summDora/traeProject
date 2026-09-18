<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2 style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        投资与财务参数设置
        <span style="font-size:12px;color:#888;font-weight:normal">默认参数为浙江地区典型参考值，可手动修改</span>
        <button class="btn secondary" style="margin-left:auto" :disabled="aiFetching" @click="aiFetch">
          {{ aiFetching ? '获取中...' : 'AI获取' }}
        </button>
      </h2>
      <div class="status" :style="{ color: aiStatusColor }">{{ aiStatus }}</div>
      <p v-if="gd.selfUseFeeHint" class="es-table-note">{{ gd.selfUseFeeHint }}，已默认填入「收益扣除」</p>

      <div class="econ-sections">
        <div class="econ-section">
          <div class="econ-section-title">收益</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>年度效益 (万元,含税) <small style="color:#999">来自电费计算</small></label>
              <el-input size="small" type="number" v-model.number="gd.econ.annual_benefit" :step="1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>收益扣除 (万元) <small style="color:#999">自发自用缴费</small></label>
              <el-input size="small" type="number" v-model.number="gd.econ.revenue_deduction" :step="0.01" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>年衰减率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.degradation_rate" :step="0.1" :min="0" :max="5"></el-input>
            </div>
            <div class="form-group">
              <label>扣除后收益 (万元) <small style="color:#999">自动</small></label>
              <el-input size="small" :value="netBenefitHint" readonly></el-input>
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">投资</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>项目类型</label>
              <el-select v-model="gd.econ.project_type" size="small" popper-class="es-select-dropdown" @change="onProjectTypeChange">
                <el-option label="陆上风电" value="onshore_wind"></el-option>
                <el-option label="海上风电" value="offshore_wind"></el-option>
                <el-option label="集中式光伏" value="centralized_pv"></el-option>
                <el-option label="分布式工商业光伏" value="distributed_pv"></el-option>
              </el-select>
            </div>
            <div class="form-group">
              <label>最大发电功率 (MW)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.re_max_power" :step="0.1" :min="0" @input="syncCapacityFromMaxPower"></el-input>
            </div>
            <div class="form-group">
              <label>容配比</label>
              <el-input size="small" type="number" v-model.number="gd.econ.capacity_ratio" :step="0.05" :min="0.1" :max="5" @input="syncCapacityFromRatio"></el-input>
            </div>
            <div class="form-group">
              <label>装机容量 (MW) <span style="color:#1565c0;font-size:11px">{{ outputRateHint }}</span></label>
              <el-input size="small" type="number" v-model.number="gd.econ.re_capacity" :step="0.1" :min="0" @input="syncRatioFromCapacity"></el-input>
            </div>
            <div class="form-group">
              <label>本体EPC单价 (万元/MW,含税)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.re_epc_price" :step="10" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>其它费用 (万元)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.other_costs" :step="10" :min="0"></el-input>
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">储能与线路</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>储能容量 (MWh) <small style="color:#999">取自632/定容</small></label>
              <el-input size="small" type="number" v-model.number="gd.econ.storage_capacity" :step="0.1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>储能功率 (MW)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.storage_power" :step="0.1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>储能EPC单价 (万元/MWh,含税)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.storage_epc_price" :step="5" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>储能寿命 (年)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.storage_lifespan" :step="1" :min="1" :max="30"></el-input>
            </div>
            <div class="form-group">
              <label>更换成本比例</label>
              <el-input size="small" type="number" v-model.number="gd.econ.storage_replacement_ratio" :step="0.05" :min="0" :max="1"></el-input>
            </div>
            <div class="form-group">
              <label>电压等级</label>
              <el-select v-model="gd.econ.voltage_level" size="small" popper-class="es-select-dropdown" @change="onVoltageLevelChange">
                <el-option label="10kV" value="10kV"></el-option>
                <el-option label="35kV" value="35kV"></el-option>
                <el-option label="110kV" value="110kV"></el-option>
                <el-option label="220kV" value="220kV"></el-option>
              </el-select>
            </div>
            <div class="form-group">
              <label>架空线单价 (万元/km)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.overhead_price" :step="5" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>架空线距离 (km)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.overhead_distance" :step="0.1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>电缆单价 (万元/km)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.cable_price" :step="5" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>电缆距离 (km)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.cable_distance" :step="0.1" :min="0"></el-input>
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">融资与运维</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>经营期 (年)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.operating_years" :step="1" :min="1"></el-input>
            </div>
            <div class="form-group">
              <label>贷款比例 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.loan_ratio" :step="5" :min="0" :max="100"></el-input>
            </div>
            <div class="form-group">
              <label>贷款年利率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.loan_rate" :step="0.1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>贷款期限 (年)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.loan_years" :step="1" :min="1" :max="30"></el-input>
            </div>
            <div class="form-group">
              <label>还款方式</label>
              <el-select v-model="gd.econ.repay_method" size="small" popper-class="es-select-dropdown">
                <el-option label="等额本息" value="equal_pi"></el-option>
                <el-option label="等额本金" value="equal_p"></el-option>
              </el-select>
            </div>
            <div class="form-group">
              <label>运维费率 (% 不含税投资)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.om_rate" :step="0.1" :min="0" :max="10"></el-input>
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">税费与折现</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>所得税率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.income_tax" :step="1" :min="0" :max="100"></el-input>
            </div>
            <div class="form-group">
              <label>设备增值税率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.equip_vat_rate" :step="1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>电价增值税率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.elec_vat_rate" :step="0.5" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>进项税抵扣年限 (年)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.input_vat_years" :step="1" :min="1" :max="20"></el-input>
            </div>
            <div class="form-group">
              <label>折旧年限 (年)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.dep_years" :step="1" :min="1"></el-input>
            </div>
            <div class="form-group">
              <label>残值率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.residual_rate" :step="1" :min="0" :max="100"></el-input>
            </div>
            <div class="form-group">
              <label>折现率 / 基准收益率 (%)</label>
              <el-input size="small" type="number" v-model.number="gd.econ.discount_rate" :step="0.5" :min="0"></el-input>
            </div>
          </div>
        </div>

        <div class="econ-section econ-summary-section">
          <div class="econ-section-title">投资汇总 (万元,含税)</div>
          <div class="summary-grid">
            <div class="summary-cell"><span class="sc-label">本体</span><strong>{{ derived.reBody }}</strong></div>
            <div class="summary-cell"><span class="sc-label">线路</span><strong>{{ derived.line }}</strong></div>
            <div class="summary-cell"><span class="sc-label">储能</span><strong>{{ derived.storage }}</strong></div>
            <div class="summary-cell"><span class="sc-label">其它</span><strong>{{ derived.other }}</strong></div>
            <div class="summary-cell"><span class="sc-label">年运维</span><strong>{{ derived.om }}</strong></div>
            <div class="summary-cell summary-cell-total"><span class="sc-label">总投资</span><strong>{{ derived.total }}</strong></div>
          </div>
          <div class="econ-calc-action">
            <button class="btn primary" :disabled="calculating" @click="calcEcon">
              {{ calculating ? '计算中...' : '开始经济性评价' }}
            </button>
            <details class="method-details">
              <summary>经济性评价方法论说明</summary>
              <div style="margin-top:10px;line-height:1.9;font-size:12px">
                <p><strong>不含税口径</strong>：建设投资含税（实际支付），折旧/收入/成本不含税，增值税单独核算。</p>
                <p><strong>增值税</strong>：自发自用销项=0；建设期进项税（投资×13/113）在运营期前5年平均抵扣，形成现金流入。</p>
                <p><strong>所得税</strong>：三免三减半（1-3年免、4-6年12.5%、7年起25%），利息可抵税。</p>
                <p><strong>双口径</strong>：全投资IRR（不含融资）+ 资本金IRR（含杠杆）。</p>
                <p><strong>储能更换</strong>：寿命到期（默认10年）按首次投资60%更换。</p>
                <p><strong>收益衰减</strong>：逐年递减（默认0.5%/年）。</p>
              </div>
            </details>
            <div class="status" style="margin:0" :style="{ color: statusColor }">{{ status }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="gd.econResult">
      <div class="stats-grid econ-ind-grid">
        <div
          v-for="ind in indicators"
          :key="ind.label"
          class="econ-ind"
          :class="ind.tone"
          :style="{ borderLeftColor: ind.color }"
        >
          <div class="econ-ind-label">{{ ind.label }}</div>
          <div class="econ-ind-value" :style="{ color: ind.color }">{{ ind.value }}</div>
        </div>
      </div>
      <div class="econ-result-grid">
        <div class="card" style="margin-bottom:0">
          <h2 style="font-size:15px">投资汇总</h2>
          <es-table :data="investmentRows" :columns="columns.econInvestment" :visible="active" />
        </div>
        <div class="card" style="margin-bottom:0">
          <h2 style="font-size:15px">融资与经营概要</h2>
          <div class="finance-cards">
            <div v-for="c in financeCards" :key="c.label">
              <div class="fc-label">{{ c.label }}</div>
              <div class="fc-value">{{ c.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <h2>年度现金流 (万元)</h2>
        <div class="chart-wrap" style="max-height:280px"><div ref="cashflowChart" class="chart-el"></div></div>
        <div class="es-cf-wrap">
          <es-table
            :data="cashFlows"
            :columns="columns.econCashFlow"
            :summary-row="cfSummaryRow"
            :visible="active"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { gdMixin } from '../store'
import { disposeChart, renderChart, whenChartVisible, econCashFlowOption } from '../charts'
import { COLUMN_CONFIG, CF_SUM_KEYS, ECON_DEFAULTS } from '../config'
import EsTable from './EsTable.vue'

export default {
  name: 'GdEconPanel',
  mixins: [gdMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      calculating: false,
      status: '',
      statusType: '',
      aiFetching: false,
      aiStatus: '',
      aiStatusType: '',
      chart: null,
      columns: COLUMN_CONFIG,
      defaults: JSON.parse(JSON.stringify(ECON_DEFAULTS))
    }
  },
  computed: {
    statusColor: function () {
      if (this.statusType === 'ok') return '#2e7d32'
      if (this.statusType === 'err') return '#c62828'
      return '#666'
    },
    aiStatusColor: function () {
      if (this.aiStatusType === 'ok') return '#2e7d32'
      if (this.aiStatusType === 'err') return '#c62828'
      return '#666'
    },
    netBenefitHint: function () {
      const v = (this.gd.econ.annual_benefit || 0) - (this.gd.econ.revenue_deduction || 0)
      return v.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    outputRateHint: function () {
      const maxPower = this.gd.econ.re_max_power || 0
      const capacity = this.gd.econ.re_capacity || 0
      if (capacity > 0 && maxPower > 0) {
        return '(最大出力率 ' + (maxPower / capacity * 100).toFixed(1) + '%)'
      }
      return ''
    },
    derived: function () {
      const e = this.gd.econ
      const reBodyInv = (e.re_capacity || 0) * (e.re_epc_price || 0)
      const lineInv = (e.overhead_price || 0) * (e.overhead_distance || 0) + (e.cable_price || 0) * (e.cable_distance || 0)
      const stInv = (e.storage_capacity || 0) * (e.storage_epc_price || 0)
      const other = e.other_costs || 0
      const total = reBodyInv + lineInv + stInv + other
      const vat = (e.equip_vat_rate || 13) / 100
      const totalEx = reBodyInv / (1 + vat) + lineInv / (1 + vat) + stInv / (1 + vat) + other
      const om = totalEx * ((e.om_rate || 0) / 100)
      const fmt = function (v) {
        return Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      return {
        reBody: fmt(reBodyInv),
        line: fmt(lineInv),
        storage: fmt(stInv),
        other: fmt(other),
        om: fmt(om),
        total: fmt(total)
      }
    },
    indicators: function () {
      const r = this.gd.econResult
      if (!r) return []
      const f = this.fmt2
      return [
        { label: '总投资 (万元，含税)', value: f(r.total_investment, 0), color: '#0E7490', tone: '' },
        { label: '全投资IRR', value: Number(r.total_irr).toFixed(2) + '%', color: r.total_irr > 8 ? '#0F6E56' : '#B91C1C', tone: r.total_irr > 8 ? 'is-good' : 'is-bad' },
        { label: '资本金IRR', value: Number(r.equity_irr).toFixed(2) + '%', color: r.equity_irr > 10 ? '#0F6E56' : '#B91C1C', tone: r.equity_irr > 10 ? 'is-good' : 'is-bad' },
        { label: '净现值NPV (万元)', value: f(r.npv, 0), color: r.npv > 0 ? '#0F6E56' : '#B91C1C', tone: r.npv > 0 ? 'is-good' : 'is-bad' },
        { label: '静态回收期 (年)', value: Number(r.static_payback).toFixed(2), color: '#0F6E56', tone: 'is-good' },
        { label: '动态回收期 (年)', value: Number(r.dynamic_payback).toFixed(2), color: '#0F6E56', tone: 'is-good' },
        { label: '总投资收益率', value: Number(r.total_roi).toFixed(2) + '%', color: r.total_roi > 5 ? '#0F6E56' : '#B91C1C', tone: r.total_roi > 5 ? 'is-good' : 'is-bad' }
      ]
    },
    investmentRows: function () {
      const r = this.gd.econResult
      if (!r) return []
      const total = r.total_investment
      const f = this.fmt2
      const pct = function (v) { return total > 0 ? (v / total * 100).toFixed(1) + '%' : '-' }
      return [
        { name: '新能源本体', amount: f(r.re_investment), pct: pct(r.re_investment) },
        { name: '送出线路', amount: f(r.line_investment || 0), pct: pct(r.line_investment || 0) },
        { name: '储能', amount: f(r.storage_investment), pct: pct(r.storage_investment) },
        { name: '其它费用', amount: f(r.other_costs || 0), pct: pct(r.other_costs || 0) },
        { name: '总投资', amount: f(total), pct: '100%', _total: true },
        { name: '装机容量', amount: f(r.re_capacity_mw, 2) + ' MW', _muted: true, _spanEnd: 2 },
        { name: '储能规模', amount: f(r.storage_capacity_mwh, 2) + ' MWh / ' + f(r.storage_power_mw, 2) + ' MW', _muted: true, _spanEnd: 2 }
      ]
    },
    financeCards: function () {
      const r = this.gd.econResult
      if (!r) return []
      const f = this.fmt2
      return [
        { label: '贷款金额 (万元)', value: f(r.loan_amount) },
        { label: '资本金 (万元)', value: f(r.equity_amount) },
        { label: '年营业收入 (万元)', value: f(r.annual_revenue) },
        { label: '年运维成本 (万元)', value: f(r.annual_om_cost) },
        { label: '年折旧 (万元)', value: f(r.annual_depreciation) },
        { label: '首年还本付息 (万元)', value: f(r.annual_loan_payment) }
      ]
    },
    cashFlows: function () {
      return (this.gd.econResult && this.gd.econResult.cash_flows) || []
    },
    cfSummaryRow: function () {
      const sums = { year: '合计' }
      CF_SUM_KEYS.forEach(function (k) { sums[k] = 0 })
      this.cashFlows.forEach(function (cf) {
        CF_SUM_KEYS.forEach(function (k) { sums[k] += cf[k] || 0 })
      })
      return sums
    }
  },
  watch: {
    active: function (val) {
      if (val) this.$nextTick(this.restoreChart)
    },
    'gd.econResult': function (val) {
      if (val) this.$nextTick(this.drawChart)
    }
  },
  beforeDestroy: function () {
    disposeChart(this.chart)
    this.chart = null
  },
  methods: {
    fmt2: function (v, d) {
      if (d === 0) {
        return Number(v || 0).toLocaleString('zh-CN', { maximumFractionDigits: 0 })
      }
      return Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    syncCapacityFromRatio: function () {
      const maxP = this.gd.econ.re_max_power || 0
      const ratio = this.gd.econ.capacity_ratio || 1
      if (maxP > 0) this.gd.econ.re_capacity = Number((maxP * ratio).toFixed(2))
    },
    syncCapacityFromMaxPower: function () {
      this.syncCapacityFromRatio()
    },
    syncRatioFromCapacity: function () {
      const maxP = this.gd.econ.re_max_power || 0
      const cap = this.gd.econ.re_capacity || 0
      if (maxP > 0 && cap > 0) this.gd.econ.capacity_ratio = Number((cap / maxP).toFixed(3))
    },
    applyVoltagePrices: function () {
      const defs = this.defaults[this.gd.econ.project_type] || this.defaults.onshore_wind
      const voltage = this.gd.econ.voltage_level || '35kV'
      this.gd.econ.overhead_price = (defs.overhead && defs.overhead[voltage]) || 30
      this.gd.econ.cable_price = (defs.cable && defs.cable[voltage]) || 80
    },
    onProjectTypeChange: function () {
      const defs = this.defaults[this.gd.econ.project_type] || this.defaults.onshore_wind
      this.gd.econ.re_epc_price = defs.epc
      if (defs.om_rate != null) this.gd.econ.om_rate = defs.om_rate
      this.applyVoltagePrices()
    },
    onVoltageLevelChange: function () {
      this.applyVoltagePrices()
    },
    aiFetch: function () {
      const self = this
      this.aiFetching = true
      this.aiStatus = '正在通过AI获取参数...'
      this.aiStatusType = ''
      const type = this.gd.econ.project_type
      const voltage = this.gd.econ.voltage_level
      API.aiFetchParams({
        project_type: type,
        voltage_level: voltage,
        query_types: ['epc', 'storage', 'transmission', 'om', 'finance']
      }).then(function (result) {
        if (!result.success) throw new Error(result.message || 'AI获取失败')
        const p = result.params || {}
        const applied = []
        const defs = self.defaults
        if (p.epc_prices && typeof p.epc_prices === 'object') {
          Object.keys(p.epc_prices).forEach(function (k) {
            if (p.epc_prices[k] != null && defs[k]) defs[k].epc = p.epc_prices[k]
          })
          if (p.epc_prices[type] != null) self.gd.econ.re_epc_price = p.epc_prices[type]
          applied.push('新能源EPC')
        } else if (p.re_epc_price != null) {
          if (defs[type]) defs[type].epc = p.re_epc_price
          self.gd.econ.re_epc_price = p.re_epc_price
          applied.push('新能源EPC')
        }
        if (p.om_rates && typeof p.om_rates === 'object') {
          Object.keys(p.om_rates).forEach(function (k) {
            if (p.om_rates[k] != null && defs[k]) defs[k].om_rate = p.om_rates[k]
          })
          if (p.om_rates[type] != null) self.gd.econ.om_rate = p.om_rates[type]
          applied.push('运维费率')
        } else if (p.om_rate != null) {
          self.gd.econ.om_rate = p.om_rate
          applied.push('运维费率')
        }
        if (p.storage_epc_price != null) {
          self.gd.econ.storage_epc_price = p.storage_epc_price
          applied.push('储能EPC')
        }
        if (p.overhead_prices && typeof p.overhead_prices === 'object') {
          Object.keys(defs).forEach(function (k) {
            defs[k].overhead = Object.assign({}, defs[k].overhead || {}, p.overhead_prices)
          })
          if (p.overhead_prices[voltage] != null) self.gd.econ.overhead_price = p.overhead_prices[voltage]
          applied.push('架空线')
        }
        if (p.cable_prices && typeof p.cable_prices === 'object') {
          Object.keys(defs).forEach(function (k) {
            defs[k].cable = Object.assign({}, defs[k].cable || {}, p.cable_prices)
          })
          if (p.cable_prices[voltage] != null) self.gd.econ.cable_price = p.cable_prices[voltage]
          applied.push('电缆')
        }
        if (p.loan_rate != null) { self.gd.econ.loan_rate = p.loan_rate; applied.push('贷款利率') }
        if (p.loan_years != null) { self.gd.econ.loan_years = p.loan_years; applied.push('贷款期限') }
        if (p.loan_ratio != null) { self.gd.econ.loan_ratio = p.loan_ratio; applied.push('贷款比例') }
        self.aiStatus = applied.length ? ('已更新: ' + applied.join('、')) : (result.message || '完成')
        self.aiStatusType = 'ok'
      }).catch(function (e) {
        self.aiStatus = e.message || 'AI获取失败'
        self.aiStatusType = 'err'
      }).then(function () {
        self.aiFetching = false
      })
    },
    calcEcon: function () {
      const self = this
      const e = this.gd.econ
      const params = {
        annual_benefit: (e.annual_benefit || 0) - (e.revenue_deduction || 0),
        project_type: e.project_type,
        other_costs: e.other_costs || 0,
        re_max_power_mw: e.re_max_power || 0,
        capacity_ratio: e.capacity_ratio || 1,
        re_capacity_mw: e.re_capacity || 0,
        re_epc_price: e.re_epc_price || 410,
        storage_capacity_mwh: e.storage_capacity || 0,
        storage_power_mw: e.storage_power || 0,
        storage_epc_price: e.storage_epc_price || 80,
        storage_lifespan: e.storage_lifespan || 10,
        storage_replacement_ratio: e.storage_replacement_ratio || 0.6,
        overhead_line_price: e.overhead_price || 50,
        overhead_line_distance: e.overhead_distance || 0,
        cable_price: e.cable_price || 120,
        cable_distance: e.cable_distance || 0,
        operating_years: e.operating_years || 20,
        degradation_rate: (e.degradation_rate || 0.5) / 100,
        om_rate: (e.om_rate || 2) / 100,
        loan_ratio: (e.loan_ratio || 70) / 100,
        loan_rate: (e.loan_rate || 3.5) / 100,
        loan_years: e.loan_years || 15,
        repay_method: e.repay_method,
        income_tax_rate: (e.income_tax || 25) / 100,
        electricity_vat_rate: (e.elec_vat_rate || 13) / 100,
        equipment_vat_rate: (e.equip_vat_rate || 13) / 100,
        input_vat_deduct_years: e.input_vat_years || 5,
        depreciation_years: e.dep_years || 15,
        residual_rate: (e.residual_rate || 5) / 100,
        discount_rate: (e.discount_rate || 8) / 100
      }
      this.calculating = true
      this.status = '经济性评价计算中…'
      this.statusType = ''
      API.calculateEconomicEval(params).then(function (result) {
        self.gd.econResult = result
        self.status = result.message || '计算完成'
        self.statusType = 'ok'
      }).catch(function (err) {
        self.status = err.message
        self.statusType = 'err'
      }).then(function () {
        self.calculating = false
      })
    },
    restoreChart: function () {
      const self = this
      if (!this.gd.econResult) return
      whenChartVisible(this.$refs.cashflowChart, function () {
        disposeChart(self.chart)
        self.chart = null
        self.drawChart()
      })
    },
    drawChart: function () {
      const r = this.gd.econResult
      if (!r || !this.$refs.cashflowChart) return
      const labels = r.cash_flows.map(function (cf) { return 'Y' + cf.year })
      const totalCf = r.cash_flows.map(function (cf) { return cf.total_cf })
      const equityCf = r.cash_flows.map(function (cf) { return cf.equity_cf })
      let cumT = 0
      let cumE = 0
      const cumTotalArr = []
      const cumEquityArr = []
      r.cash_flows.forEach(function (cf) {
        cumT += cf.total_cf
        cumE += cf.equity_cf
        cumTotalArr.push(cumT)
        cumEquityArr.push(cumE)
      })
      this.chart = renderChart(
        this.$refs.cashflowChart,
        econCashFlowOption(labels, totalCf, equityCf, cumTotalArr, cumEquityArr),
        this.chart
      )
      if (this.chart && this.chart.resize) {
        try { this.chart.resize() } catch (e) {}
      }
    }
  }
}
</script>
