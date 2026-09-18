<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2 style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
        投资与财务参数设置
        <span style="font-size:12px;color:#888;font-weight:normal">默认参数为浙江地区典型参考值，可手动修改</span>
      </h2>

      <div class="econ-sections">
        <div class="econ-section">
          <div class="econ-section-title">收益</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>年度效益 (万元,含税) <small style="color:#999">来自Tab5</small></label>
              <input type="number" v-model.number="es.econ.annual_benefit" step="1" min="0" @input="onManualBenefit">
            </div>
            <div class="form-group">
              <label>收益扣除 (万元) <small style="color:#999">自发自用缴费</small></label>
              <input type="number" v-model.number="es.econ.revenue_deduction" step="1" min="0">
            </div>
            <div class="form-group">
              <label>年衰减率 (%)</label>
              <input type="number" v-model.number="es.econ.degradation_rate" step="0.1" min="0" max="5">
            </div>
            <div class="form-group">
              <label>首年扣除后收益 (不含税) <small style="color:#999">自动</small></label>
              <input type="text" :value="netRevenueHint" readonly style="background:#f5f5f5">
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">投资</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>项目类型</label>
              <select v-model="es.econ.project_type" @change="onProjectTypeChange">
                <option value="distributed_pv">分布式工商业光伏</option>
                <option value="centralized_pv">集中式光伏</option>
                <option value="onshore_wind">陆上风电</option>
                <option value="offshore_wind">海上风电</option>
              </select>
            </div>
            <div class="form-group">
              <label>最大发电功率 (MW) <small style="color:#999">取自Tab1</small></label>
              <input type="number" v-model.number="es.econ.re_max_power" step="0.1" min="0" @input="onMaxPowerInput">
            </div>
            <div class="form-group">
              <label>容配比</label>
              <input type="number" v-model.number="es.econ.capacity_ratio" step="0.05" min="1" max="2" @input="syncCapacity">
            </div>
            <div class="form-group">
              <label>装机容量 (MW) <span style="color:#1565c0;font-size:11px">{{ outputRateHint }}</span></label>
              <input type="number" v-model.number="es.econ.re_capacity" step="0.1" min="0" @input="onCapacityInput">
            </div>
            <div class="form-group">
              <label>本体EPC单价 (万元/MW,含税)</label>
              <input type="number" v-model.number="es.econ.re_epc_price" step="10" min="0">
            </div>
            <div class="form-group">
              <label>其它费用 (万元) <small style="color:#999">设计/监理/土地</small></label>
              <input type="number" v-model.number="es.econ.other_costs" step="10" min="0">
            </div>
            <div class="form-group">
              <label>新能源项目投资 (万元) <small style="color:#999">本体+线路·自动</small></label>
              <input type="text" :value="derived.rePlusLine" readonly style="background:var(--surface-2)">
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">储能与线路</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>储能容量 (MWh) <small style="color:#999">取自Tab2</small></label>
              <input type="number" v-model.number="es.econ.storage_capacity" step="1" min="0" @input="onManualStorage">
            </div>
            <div class="form-group">
              <label>储能EPC单价 (万元/MWh,含税)</label>
              <input type="number" v-model.number="es.econ.storage_epc_price" step="5" min="0">
            </div>
            <div class="form-group">
              <label>储能寿命 (年)</label>
              <input type="number" v-model.number="es.econ.storage_lifespan" step="1" min="1" max="30">
            </div>
            <div class="form-group">
              <label>更换成本比例 <small style="color:#999">占首次储能投资</small></label>
              <input type="number" v-model.number="es.econ.storage_replacement_ratio" step="0.05" min="0" max="1">
            </div>
            <div class="form-group">
              <label>电压等级</label>
              <select v-model="es.econ.voltage_level" @change="onVoltageLevelChange">
                <option value="10kV">10kV</option>
                <option value="35kV">35kV</option>
                <option value="110kV">110kV</option>
                <option value="220kV">220kV</option>
              </select>
            </div>
            <div class="form-group">
              <label>架空线单价 (万元/km)</label>
              <input type="number" v-model.number="es.econ.overhead_price" step="5" min="0">
            </div>
            <div class="form-group">
              <label>架空线距离 (km)</label>
              <input type="number" v-model.number="es.econ.overhead_distance" step="0.1" min="0">
            </div>
            <div class="form-group">
              <label>电缆单价 (万元/km)</label>
              <input type="number" v-model.number="es.econ.cable_price" step="5" min="0">
            </div>
            <div class="form-group">
              <label>电缆距离 (km)</label>
              <input type="number" v-model.number="es.econ.cable_distance" step="0.1" min="0">
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">融资与运维</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>经营期 (年)</label>
              <input type="number" v-model.number="es.econ.operating_years" step="1" min="1">
            </div>
            <div class="form-group">
              <label>贷款比例 (%)</label>
              <input type="number" v-model.number="es.econ.loan_ratio" step="5" min="0" max="100">
            </div>
            <div class="form-group">
              <label>贷款年利率 (%)</label>
              <input type="number" v-model.number="es.econ.loan_rate" step="0.1" min="0">
            </div>
            <div class="form-group">
              <label>贷款期限 (年)</label>
              <input type="number" v-model.number="es.econ.loan_years" step="1" min="1" max="30">
            </div>
            <div class="form-group">
              <label>还款方式</label>
              <select v-model="es.econ.repay_method">
                <option value="equal_pi">等额本息</option>
                <option value="equal_p">等额本金</option>
              </select>
            </div>
            <div class="form-group">
              <label>运维费率 (% 三项不含税投资)</label>
              <input type="number" v-model.number="es.econ.om_rate" step="0.1" min="0" max="10">
            </div>
          </div>
        </div>

        <div class="econ-section">
          <div class="econ-section-title">税费与折现</div>
          <div class="econ-grid">
            <div class="form-group">
              <label>所得税率 (%)</label>
              <input type="number" v-model.number="es.econ.income_tax" step="1" min="0" max="100">
            </div>
            <div class="form-group">
              <label>设备增值税率 (%) <small style="color:#999">投资进项</small></label>
              <input type="number" v-model.number="es.econ.equip_vat_rate" step="1" min="0">
            </div>
            <div class="form-group">
              <label>电价增值税率 (%) <small style="color:#999">收入分离</small></label>
              <input type="number" v-model.number="es.econ.price_vat_rate" step="0.5" min="0">
            </div>
            <div class="form-group">
              <label>进项税抵扣年限 (年)</label>
              <input type="number" v-model.number="es.econ.input_tax_years" step="1" min="1" max="20">
            </div>
            <div class="form-group">
              <label>附加税率 (% 增值税)</label>
              <input type="number" v-model.number="es.econ.surcharge_rate" step="1" min="0">
            </div>
            <div class="form-group">
              <label>折旧年限 (年)</label>
              <input type="number" v-model.number="es.econ.dep_years" step="1" min="1">
            </div>
            <div class="form-group">
              <label>残值率 (%)</label>
              <input type="number" v-model.number="es.econ.residual_rate" step="1" min="0" max="100">
            </div>
            <div class="form-group">
              <label>折现率 / 基准收益率 (%)</label>
              <input type="number" v-model.number="es.econ.discount_rate" step="0.5" min="0">
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
            <div class="summary-cell"><span class="sc-label">装机</span><strong>{{ derived.capacity }} MW</strong></div>
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

    <div v-if="!es.econResult" class="card">
      <p class="empty-hint">请先完成优化计算和电费计算，再到此处进行经济性评价。</p>
    </div>

    <div v-if="es.econResult">
      <div class="stats-grid">
        <div v-for="ind in indicators" :key="ind.label" :style="{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: '8px', borderLeft: '3px solid ' + ind.color }">
          <div style="font-size:11px;color:#888;margin-bottom:3px;white-space:nowrap">{{ ind.label }}</div>
          <div :style="{ fontSize: '17px', fontWeight: 700, color: ind.color, whiteSpace: 'nowrap' }">{{ ind.value }}</div>
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
            <div v-for="c in financeCards" :key="c.label" style="padding:8px 10px;background:var(--surface-2);border-radius:6px;font-size:12px">
              <div style="color:#888;margin-bottom:2px">{{ c.label }}</div>
              <div style="font-size:14px;font-weight:600;color:var(--text)">{{ c.value }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>年度现金流 (万元)</h2>
        <div class="chart-wrap" style="max-height:280px"><div ref="cashflowChart" class="chart-el"></div></div>
        <div class="cf-formula-note">
          <div><strong>全投资净现金流</strong> = 营业收入 + 进项税抵扣 + 回收余值 − 运维成本 − 附加税 − 储能更换 − 全投资所得税 − 建设投资</div>
          <div><strong>资本金净现金流</strong> = 营业收入 + 进项税抵扣 + 回收余值 − 运维成本 − 附加税 − 储能更换 − 资本金所得税 − 还本付息 − 资本金投入</div>
          <div class="cf-note-sub">「折旧」为非付现成本、「利息」已含在「还本付息」中，二者仅作参考、不参与上式加减。自发自用项目销项税=0，附加税通常为0。第0年为建设期投入，末年含回收余值。</div>
        </div>
        <es-table
          :data="cashFlows"
          :columns="columns.econCashFlow"
          :max-height="440"
          :summary-row="cfSummaryRow"
          :visible="active"
        />
        <p class="cf-round-note">注：表中各列数值分别四舍五入（显示为整数万元），「合计」行为各列分别求和后再取整，与逐行加总可能存在 1~2 万元的舍入尾差，属正常现象。</p>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { esMixin, ECON_DEFAULTS } from '../store'
import { disposeChart, renderChart, econCashFlowOption } from '../charts'
import { COLUMN_CONFIG, CF_SUM_KEYS } from '../config'
import EsTable from './EsTable.vue'

export default {
  name: 'EconPanel',
  mixins: [esMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      calculating: false,
      status: '',
      statusType: '',
      chart: null,
      columns: COLUMN_CONFIG
    }
  },
  computed: {
    statusColor: function () {
      if (this.statusType === 'ok') return 'green'
      if (this.statusType === 'err') return 'red'
      return '#666'
    },
    netRevenueHint: function () {
      const benefit = this.es.econ.annual_benefit || 0
      const deduction = this.es.econ.revenue_deduction || 0
      const priceVat = (this.es.econ.price_vat_rate || 6) / 100
      if (benefit <= 0) return '-'
      return (benefit / (1 + priceVat) - deduction).toFixed(2) + ' 万元'
    },
    outputRateHint: function () {
      const maxPower = this.es.econ.re_max_power || 0
      const capacity = this.es.econ.re_capacity || 0
      if (capacity > 0 && maxPower > 0) {
        return '(最大出力率 ' + (maxPower / capacity * 100).toFixed(1) + '%)'
      }
      return ''
    },
    derived: function () {
      const e = this.es.econ
      const reBodyInv = (e.re_capacity || 0) * (e.re_epc_price || 0)
      const lineInv = (e.overhead_price || 0) * (e.overhead_distance || 0) + (e.cable_price || 0) * (e.cable_distance || 0)
      const stInv = (e.storage_capacity || 0) * (e.storage_epc_price || 0)
      const other = e.other_costs || 0
      const total = reBodyInv + lineInv + stInv + other
      const fmt = function (v) {
        return Number(v).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      }
      return {
        reBody: fmt(reBodyInv),
        line: fmt(lineInv),
        storage: fmt(stInv),
        other: fmt(other),
        total: fmt(total),
        capacity: Number(e.re_capacity || 0).toFixed(2),
        rePlusLine: (reBodyInv + lineInv).toFixed(2)
      }
    },
    indicators: function () {
      const r = this.es.econResult
      if (!r) return []
      const fmt = this.fmt2
      return [
        { label: '全投资内部收益率 (IRR)', value: r.total_irr.toFixed(2) + '%', color: r.total_irr > 8 ? '#2e7d32' : '#c62828' },
        { label: '资本金内部收益率', value: r.equity_irr.toFixed(2) + '%', color: r.equity_irr > 10 ? '#2e7d32' : '#c62828' },
        { label: '净现值 NPV (万元)', value: fmt(r.npv), color: r.npv > 0 ? '#2e7d32' : '#c62828' },
        { label: '静态回收期 (年)', value: r.static_payback.toFixed(2), color: '#2e7d32' },
        { label: '动态回收期 (年)', value: r.dynamic_payback.toFixed(2), color: '#2e7d32' },
        { label: '总投资收益率 (ROI)', value: r.total_roi.toFixed(2) + '%', color: r.total_roi > 5 ? '#2e7d32' : '#c62828' }
      ]
    },
    investmentRows: function () {
      const r = this.es.econResult
      if (!r) return []
      const total = r.total_investment
      const fmt = this.fmt2
      const pct = function (v) { return total > 0 ? (v / total * 100).toFixed(1) + '%' : '-' }
      const rated = (this.es.optimizeParams && this.es.optimizeParams.storage && this.es.optimizeParams.storage.rated_power) || 0
      return [
        { name: '新能源本体', amount: fmt(r.re_investment), pct: pct(r.re_investment) },
        { name: '送出线路', amount: fmt(r.line_investment || 0), pct: pct(r.line_investment || 0) },
        { name: '储能', amount: fmt(r.storage_investment), pct: pct(r.storage_investment) },
        { name: '其它费用', amount: fmt(r.other_costs || 0), pct: pct(r.other_costs || 0) },
        { name: '总投资', amount: fmt(total), pct: '100%', _total: true },
        { name: '装机容量', amount: r.re_capacity_mw + ' MW', _muted: true, _spanEnd: 2 },
        { name: '储能规模', amount: (r.storage_capacity_mwh || 0) + ' MWh / ' + rated + ' MW', _muted: true, _spanEnd: 2 }
      ]
    },
    financeCards: function () {
      const r = this.es.econResult
      if (!r) return []
      const fmt = this.fmt2
      return [
        { label: '贷款金额 (万元)', value: fmt(r.loan_amount) },
        { label: '资本金 (万元)', value: fmt(r.equity_amount) },
        { label: '年营业收入 (万元)', value: fmt(r.annual_revenue) },
        { label: '年运维成本 (万元)', value: fmt(r.annual_om_cost) },
        { label: '年折旧 (万元)', value: fmt(r.annual_depreciation) },
        { label: '首年还本付息 (万元)', value: fmt(r.annual_loan_payment) }
      ]
    },
    cashFlows: function () {
      return (this.es.econResult && this.es.econResult.cash_flows) || []
    },
    cfSums: function () {
      const sums = {}
      CF_SUM_KEYS.forEach(function (k) { sums[k] = 0 })
      this.cashFlows.forEach(function (cf) {
        CF_SUM_KEYS.forEach(function (k) { sums[k] += cf[k] || 0 })
      })
      return sums
    },
    cfSummaryRow: function () {
      return Object.assign({ year: '合计' }, this.cfSums)
    }
  },
  mounted: function () {
    this.populateFromUpstream()
    if (this.es.econResult) this.$nextTick(this.drawChart)
  },
  watch: {
    active: function (val) {
      if (val) {
        this.populateFromUpstream()
        this.$nextTick(this.drawChart)
      }
    },
    'es.econResult': function (val) {
      if (val) this.$nextTick(this.drawChart)
    }
  },
  beforeDestroy: function () {
    disposeChart(this.chart)
    this.chart = null
  },
  methods: {
    fmt2: function (v) {
      return Number(v || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    populateFromUpstream: function () {
      const e = this.es.econ
      if (this.es.optimizeResult && this.es.optimizeResult.detail_renewable) {
        const arr = this.es.optimizeResult.detail_renewable
        let maxRe = -Infinity
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] > maxRe) maxRe = arr[i]
        }
        if (e.re_max_power === 0 || e.autoMaxPower) {
          e.re_max_power = Number(maxRe.toFixed(2))
          e.autoMaxPower = true
        }
        if (e.re_capacity === 0 || e.autoCapacity) {
          e.re_capacity = Number((maxRe * (e.capacity_ratio || 1.2)).toFixed(2))
          e.autoCapacity = true
        }
      }
      if (this.es.optimizeParams && this.es.optimizeParams.storage) {
        if (e.storage_capacity === 0 || e.autoStorage) {
          e.storage_capacity = this.es.optimizeParams.storage.energy_capacity
          e.autoStorage = true
        }
      }
      if (this.es.annualBenefit != null && (e.annual_benefit === 0 || e.autoBenefit)) {
        e.annual_benefit = Number(this.es.annualBenefit.toFixed(2))
        e.autoBenefit = true
      }
    },
    onManualBenefit: function () {
      this.es.econ.autoBenefit = false
    },
    onManualStorage: function () {
      this.es.econ.autoStorage = false
    },
    onMaxPowerInput: function () {
      this.es.econ.autoMaxPower = false
      this.syncCapacity()
    },
    syncCapacity: function () {
      const maxP = this.es.econ.re_max_power || 0
      const ratio = this.es.econ.capacity_ratio || 1.2
      if (maxP > 0) {
        this.es.econ.re_capacity = Number((maxP * ratio).toFixed(2))
        this.es.econ.autoCapacity = true
      }
    },
    onCapacityInput: function () {
      this.es.econ.autoCapacity = false
      const maxP = this.es.econ.re_max_power || 0
      const cap = this.es.econ.re_capacity || 0
      if (maxP > 0 && cap > 0) {
        this.es.econ.capacity_ratio = Number((cap / maxP).toFixed(3))
      }
    },
    applyTypeDefaults: function () {
      const defs = ECON_DEFAULTS[this.es.econ.project_type] || ECON_DEFAULTS.distributed_pv
      const e = this.es.econ
      e.re_epc_price = defs.epc
      if (defs.om != null) e.om_rate = defs.om
      if (defs.storage_epc != null) e.storage_epc_price = defs.storage_epc
      if (defs.storage_lifespan != null) e.storage_lifespan = defs.storage_lifespan
      if (defs.storage_replacement_ratio != null) e.storage_replacement_ratio = defs.storage_replacement_ratio
      if (defs.capacity_ratio != null) e.capacity_ratio = defs.capacity_ratio
      if (defs.loan_ratio != null) e.loan_ratio = defs.loan_ratio
      if (defs.loan_rate != null) e.loan_rate = defs.loan_rate
      if (defs.loan_years != null) e.loan_years = defs.loan_years
      this.applyVoltagePrices()
      this.syncCapacity()
    },
    applyVoltagePrices: function () {
      const defs = ECON_DEFAULTS[this.es.econ.project_type] || ECON_DEFAULTS.distributed_pv
      const voltage = this.es.econ.voltage_level || '35kV'
      this.es.econ.overhead_price = (defs.overhead && defs.overhead[voltage]) || 30
      this.es.econ.cable_price = (defs.cable && defs.cable[voltage]) || 80
    },
    onProjectTypeChange: function () {
      this.applyTypeDefaults()
    },
    onVoltageLevelChange: function () {
      this.applyVoltagePrices()
    },
    calcEcon: function () {
      const self = this
      const e = this.es.econ
      const params = {
        annual_benefit: e.annual_benefit || 0,
        revenue_deduction: e.revenue_deduction || 0,
        degradation_rate: (e.degradation_rate || 0.5) / 100,
        project_type: e.project_type,
        capacity_ratio: e.capacity_ratio || 1.2,
        re_max_power_mw: e.re_max_power || 0,
        re_capacity_mw: e.re_capacity || 0,
        re_epc_price: e.re_epc_price || 300,
        overhead_line_price: e.overhead_price || 30,
        overhead_line_distance: e.overhead_distance || 0,
        cable_price: e.cable_price || 80,
        cable_distance: e.cable_distance || 0,
        other_costs: e.other_costs || 0,
        storage_capacity_mwh: e.storage_capacity || 0,
        storage_epc_price: e.storage_epc_price || 120,
        storage_lifespan: e.storage_lifespan || 10,
        storage_replacement_ratio: e.storage_replacement_ratio || 0.6,
        om_rate: (e.om_rate || 1) / 100,
        operating_years: e.operating_years || 20,
        loan_ratio: (e.loan_ratio || 70) / 100,
        loan_rate: (e.loan_rate || 4) / 100,
        loan_years: e.loan_years || 15,
        repay_method: e.repay_method,
        income_tax_rate: (e.income_tax || 25) / 100,
        equip_vat_rate: (e.equip_vat_rate || 13) / 100,
        price_vat_rate: (e.price_vat_rate || 6) / 100,
        input_tax_years: e.input_tax_years || 5,
        surcharge_rate: (e.surcharge_rate || 12) / 100,
        depreciation_years: e.dep_years || 15,
        residual_rate: (e.residual_rate || 5) / 100,
        discount_rate: (e.discount_rate || 8) / 100
      }
      this.calculating = true
      this.status = '正在计算...'
      this.statusType = ''
      API.calculateEconomicEval(params).then(function (result) {
        self.es.econResult = result
        self.status = '计算完成'
        self.statusType = 'ok'
      }).catch(function (err) {
        self.status = err.message
        self.statusType = 'err'
      }).then(function () {
        self.calculating = false
      })
    },
    drawChart: function () {
      const r = this.es.econResult
      if (!r || !this.$refs.cashflowChart) return
      const labels = r.cash_flows.map(function (cf) { return '第' + cf.year + '年' })
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
