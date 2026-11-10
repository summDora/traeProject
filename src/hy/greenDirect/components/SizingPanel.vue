<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2>最小储能定容</h2>
      <p class="es-table-note">按 632 指标约束二分搜索最小 E/P。储能效率与 SOC 区间沿用「指标分析」页参数。</p>
      <div class="form-grid">
        <div class="form-group">
          <label>T2 倒送上限</label>
          <el-input size="small" type="number" v-model.number="gd.sizing.T2" :step="0.01" :min="0" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>T3 自用占用电下限</label>
          <el-input size="small" type="number" v-model.number="gd.sizing.T3" :step="0.01" :min="0" :max="2"></el-input>
        </div>
        <div class="form-group">
          <label>E 精度 (MWh)</label>
          <el-input size="small" type="number" v-model.number="gd.sizing.E_tol" :step="0.1" :min="0.01"></el-input>
        </div>
        <div class="form-group">
          <label>P 精度 (MW)</label>
          <el-input size="small" type="number" v-model.number="gd.sizing.P_tol" :step="0.05" :min="0.01"></el-input>
        </div>
      </div>
      <div style="margin-top:14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">
        <button class="btn primary" :disabled="running" @click="runSizing">
          {{ running ? '反推中...' : '开始反推' }}
        </button>
        <div class="status" style="margin:0" :style="{ color: statusColor }">{{ status }}</div>
      </div>
    </div>

    <div v-if="gd.sizingResult">
      <div v-if="!gd.sizingResult.feasible" class="stats-grid">
        <div class="stat-card" style="grid-column:1/-1">
          <div class="stat-label">反推结果</div>
          <div class="stat-value small" style="color:#c62828">{{ gd.sizingResult.msg || '不可行' }}</div>
          <div style="font-size:12px;color:#888;margin-top:6px">
            倒送上限 R_max={{ fmt0(gd.sizingResult.R_max) }}MWh（约束来自{{ gd.sizingResult.binding }}）；
            指标3理论上限 G/U={{ fmtPct(gd.sizingResult.r3_cap) }}
          </div>
        </div>
      </div>
      <div v-else>
        <div class="stats-grid">
          <div class="stat-card"><div class="stat-label">最小储能电量 E*</div><div class="stat-value">{{ fmt1(gd.sizingResult.E) }} <span style="font-size:12px">MWh</span></div></div>
          <div class="stat-card"><div class="stat-label">最小储能功率 P*</div><div class="stat-value">{{ fmt3(gd.sizingResult.P) }} <span style="font-size:12px">MW</span></div></div>
          <div class="stat-card"><div class="stat-label">约束来源</div><div class="stat-value small">{{ gd.sizingResult.binding }}</div></div>
          <div class="stat-card"><div class="stat-label">倒送上限 R_max</div><div class="stat-value small">{{ fmt0(gd.sizingResult.R_max) }} MWh</div></div>
          <div class="stat-card"><div class="stat-label">完全自平衡电量 E_full</div><div class="stat-value small">{{ fmt0(gd.sizingResult.E_full) }} MWh</div></div>
          <div class="stat-card"><div class="stat-label">达标后倒送电量</div><div class="stat-value small">{{ fmt0(gd.sizingResult.reverse) }} MWh</div></div>
        </div>
        <div v-if="gd.sizingResult.no_storage_needed" class="stat-card" style="margin-bottom:16px;background:#e8f5e9">
          <div class="stat-value small" style="color:#2e7d32">原始净负荷已满足632指标，无需加装储能 (E*=0, P*=0)</div>
        </div>
        <div class="card">
          <h2>指标对比</h2>
          <es-table :data="compareRows" :columns="columns.szCompare" :visible="active" />
        </div>
        <div v-if="hasCurve" class="card">
          <h2>E–指标曲线</h2>
          <div class="chart-wrap"><div ref="curveChart" class="chart-el"></div></div>
        </div>
        <div class="card">
          <h2>应用方案</h2>
          <div class="form-grid">
            <div class="form-group">
              <label>推荐 E (MWh)</label>
              <el-input size="small" :value="fmt1(gd.sizingResult.E)" disabled></el-input>
            </div>
            <div class="form-group">
              <label>推荐 P (MW)</label>
              <el-input size="small" :value="fmt3(gd.sizingResult.P)" disabled></el-input>
            </div>
            <div class="form-group">
              <label>采用 E (MWh)</label>
              <el-input size="small" type="number" v-model.number="applyE" :step="0.1" :min="0"></el-input>
            </div>
            <div class="form-group">
              <label>采用 P (MW)</label>
              <el-input size="small" type="number" v-model.number="applyP" :step="0.001" :min="0"></el-input>
            </div>
          </div>
          <div style="margin-top:12px">
            <button class="btn primary" :disabled="applying" @click="applySizing">
              {{ applying ? '应用中...' : '应用并运行632' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { gdMixin } from '../store'
import { COLUMN_CONFIG } from '../config'
import { fmt, fmtPct } from '../helpers'
import { disposeChart, renderChart, whenChartVisible, sizingCurveOption } from '../charts'
import EsTable from './EsTable.vue'

export default {
  name: 'GdSizingPanel',
  mixins: [gdMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data() {
    return {
      running: false,
      applying: false,
      status: '',
      statusType: '',
      applyE: 0,
      applyP: 0,
      chart: null,
      columns: COLUMN_CONFIG
    }
  },
  computed: {
    statusColor() {
      if (this.statusType === 'ok') return '#2e7d32'
      if (this.statusType === 'err') return '#c62828'
      return '#666'
    },
    hasCurve() {
      const r = this.gd.sizingResult
      return !!(r && r.feasible && r.curve && r.curve.length)
    },
    compareRows() {
      const r = this.gd.sizingResult
      if (!r || !r.feasible || !r.baseline) return []
      const b = r.baseline
      return [
        { metric: '指标6 自发自用比例', base: fmtPct(b.r6), ok: fmtPct(r.r6) },
        { metric: '指标3 自用占用电比例', base: fmtPct(b.r3), ok: fmtPct(r.r3) },
        { metric: '指标2 倒送比例', base: fmtPct(b.r2), ok: fmtPct(r.r2) },
        { metric: '倒送电量 (MWh)', base: fmt(b.reverse, 0), ok: fmt(r.reverse, 0) },
        { metric: '自发自用电量 (MWh)', base: fmt(b.selfuse, 0), ok: fmt(r.selfuse, 0) }
      ]
    }
  },
  watch: {
    active(val) {
      if (val) this.$nextTick(this.restoreCurve)
    },
    'gd.sizingResult'() {
      const r = this.gd.sizingResult
      if (r && r.feasible) {
        this.applyE = Number(Number(r.E).toFixed(1))
        this.applyP = Number(Number(r.P).toFixed(3))
      }
      this.$nextTick(this.drawCurve)
    }
  },
  beforeDestroy() {
    disposeChart(this.chart)
    this.chart = null
  },
  methods: {
    fmt0(v) { return fmt(v, 0) },
    fmt1(v) { return fmt(v, 1) },
    fmt3(v) { return fmt(v, 3) },
    fmtPct: fmtPct,
    runSizing() {
      if (!this.gd.dataLoaded) {
        alert('请先在「源荷数据」页上传或加载数据')
        return
      }
      const s = this.gd.storage
      const z = this.gd.sizing
      this.running = true
      this.status = '反推最小储能中（二分搜索，请稍候）…'
      this.statusType = ''
      API.runSizing({
        T2: z.T2,
        T3: z.T3,
        eta: s.eta,
        soc_max_frac: s.soc_max,
        soc_min_frac: s.soc_min,
        init_soc_frac: s.initial_soc,
        E_tol: z.E_tol,
        P_tol: z.P_tol,
        do_scan: true
      }).then((res) => {
        this.gd.sizingResult = res
        this.status = res.feasible ? '反推完成' : '反推结束（不可行）'
        this.statusType = res.feasible ? 'ok' : 'err'
      }).catch((e) => {
        this.status = e.message
        this.statusType = 'err'
      }).then(() => {
        this.running = false
      })
    },
    restoreCurve() {
      if (!this.hasCurve) return
      whenChartVisible(this.$refs.curveChart, () => {
        disposeChart(this.chart)
        this.chart = null
        this.drawCurve()
      })
    },
    drawCurve() {
      if (!this.hasCurve || !this.$refs.curveChart) return
      const curve = this.gd.sizingResult.curve
      this.chart = renderChart(this.$refs.curveChart, sizingCurveOption(
        curve.map((p) => { return fmt(p.E, 0) }),
        curve.map((p) => { return +(p.r2 * 100).toFixed(2) }),
        curve.map((p) => { return +(p.r6 * 100).toFixed(2) }),
        curve.map((p) => { return +(p.r3 * 100).toFixed(2) })
      ), this.chart)
      if (this.chart && this.chart.resize) {
        try { this.chart.resize() } catch (e) {}
      }
    },
    applySizing() {
      const E = this.applyE
      const P = this.applyP
      if (!(E >= 0) || !(P >= 0)) {
        alert('请填写有效的采用 E/P')
        return
      }
      this.gd.storage.rated_power = Number(P.toFixed(3))
      this.gd.storage.energy_capacity = Number(E.toFixed(1))
      this.gd.econ.storage_capacity = this.gd.storage.energy_capacity
      this.gd.econ.storage_power = this.gd.storage.rated_power
      this.applying = true
      API.run632({
        P: this.gd.storage.rated_power,
        E: this.gd.storage.energy_capacity,
        eta: this.gd.storage.eta,
        soc_min_frac: this.gd.storage.soc_min,
        soc_max_frac: this.gd.storage.soc_max,
        init_soc_frac: this.gd.storage.initial_soc,
        base_price: this.gd.basePrice
      }).then((res) => {
        this.gd.analysisResult = res
        this.gd.analysisDone = true
        this.gd.goTab('tab-results')
      }).catch((e) => {
        alert(e.message)
      }).then(() => {
        this.applying = false
      })
    }
  }
}
</script>
