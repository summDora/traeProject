<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2>储能系统参数</h2>
      <div class="form-grid">
        <div class="form-group">
          <label>额定功率 P (MW)</label>
          <el-input size="small" type="number" v-model.number="gd.storage.rated_power" :step="0.1" :min="0"></el-input>
        </div>
        <div class="form-group">
          <label>储能容量 E (MWh)</label>
          <el-input size="small" type="number" v-model.number="gd.storage.energy_capacity" :step="0.1" :min="0"></el-input>
        </div>
        <div class="form-group">
          <label>单侧效率 η</label>
          <el-input size="small" type="number" v-model.number="gd.storage.eta" :step="0.01" :min="0.01" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>SOC 下限</label>
          <el-input size="small" type="number" v-model.number="gd.storage.soc_min" :step="0.01" :min="0" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>SOC 上限</label>
          <el-input size="small" type="number" v-model.number="gd.storage.soc_max" :step="0.01" :min="0" :max="1"></el-input>
        </div>
        <div class="form-group">
          <label>起始 SOC</label>
          <el-input size="small" type="number" v-model.number="gd.storage.initial_soc" :step="0.01" :min="0" :max="1"></el-input>
        </div>
      </div>
      <div class="param-summary">{{ summary }}</div>
    </div>

    <div class="card">
      <h2>632 指标分析</h2>
      <div class="form-row">
        <div class="form-group">
          <label>平段基准电价 (元/MWh) <small style="color:#999">仅影响结果页分时电价曲线</small></label>
          <el-input size="small" type="number" v-model.number="gd.basePrice" :step="1" :min="0"></el-input>
        </div>
        <button class="btn primary" :disabled="running" @click="run632">
          {{ running ? '分析中...' : '运行632分析' }}
        </button>
        <div class="status" style="margin:0" :style="{ color: statusColor }">{{ status }}</div>
      </div>
    </div>

    <div v-if="gd.analysisResult">
      <div class="stats-grid">
        <div v-for="c in indicatorCards" :key="c.label" class="stat-card">
          <div class="stat-label">{{ c.label }}</div>
          <div class="stat-value" style="font-size:16px">{{ c.text }}</div>
          <div :style="{ fontSize: '12px', color: c.good ? '#2e7d32' : '#c62828', marginTop: '4px' }">{{ c.delta }}</div>
        </div>
      </div>
      <div class="card">
        <h2>电量与指标对比</h2>
        <es-table :data="compareRows" :columns="columns.anaCompare" :visible="active" />
      </div>
      <div class="card">
        <h2>功率统计</h2>
        <es-table :data="powerRows" :columns="columns.anaPower" :visible="active" />
      </div>
      <div class="card">
        <h2>验证清单</h2>
        <div v-for="c in checks" :key="c.name" :style="{ color: c.ok ? '#2e7d32' : '#c62828', margin: '4px 0' }">
          [{{ c.ok ? '通过' : '失败' }}] {{ c.name }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { gdMixin } from '../store'
import { COLUMN_CONFIG } from '../config'
import { fmtPct, buildAnaCompareRows, buildAnaPowerRows } from '../helpers'
import EsTable from './EsTable.vue'

export default {
  name: 'GdIndicatorPanel',
  mixins: [gdMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      running: false,
      status: '',
      statusType: '',
      columns: COLUMN_CONFIG
    }
  },
  computed: {
    summary: function () {
      const s = this.gd.storage
      return s.rated_power + 'MW / ' + s.energy_capacity + 'MWh · η' + s.eta +
        ' · SOC ' + (s.soc_min * 100).toFixed(0) + '%~' + (s.soc_max * 100).toFixed(0) +
        '% · 初值 ' + (s.initial_soc * 100).toFixed(0) + '%'
    },
    statusColor: function () {
      if (this.statusType === 'ok') return '#2e7d32'
      if (this.statusType === 'err') return '#c62828'
      return '#666'
    },
    indicatorCards: function () {
      const res = this.gd.analysisResult
      if (!res || !res.indicators) return []
      const ind = res.indicators
      const mk = function (label, net, opt, reverse) {
        const delta = (opt - net) * 100
        const good = reverse ? delta <= 0 : delta >= 0
        return {
          label: label,
          text: fmtPct(net) + ' → ' + fmtPct(opt),
          delta: (delta >= 0 ? '+' : '') + delta.toFixed(1) + ' pp',
          good: good
        }
      }
      return [
        mk('指标6 自发自用比例', ind.r6Net, ind.r6Opt, false),
        mk('指标3 自用占用电比例', ind.r3Net, ind.r3Opt, false),
        mk('指标2 倒送比例', ind.r2Net, ind.r2Opt, true)
      ]
    },
    compareRows: function () {
      return buildAnaCompareRows(this.gd.analysisResult)
    },
    powerRows: function () {
      return this.gd.analysisResult ? buildAnaPowerRows(this.gd.analysisResult.power_stats) : []
    },
    checks: function () {
      return (this.gd.analysisResult && this.gd.analysisResult.checks) || []
    }
  },
  methods: {
    storageBody: function () {
      const s = this.gd.storage
      return {
        P: s.rated_power,
        E: s.energy_capacity,
        eta: s.eta,
        soc_min_frac: s.soc_min,
        soc_max_frac: s.soc_max,
        init_soc_frac: s.initial_soc,
        base_price: this.gd.basePrice
      }
    },
    run632: function () {
      const self = this
      if (!this.gd.dataLoaded) {
        alert('请先在「源荷数据」页上传或加载数据')
        return Promise.resolve()
      }
      this.gd.econ.storage_capacity = this.gd.storage.energy_capacity
      this.gd.econ.storage_power = this.gd.storage.rated_power
      this.running = true
      this.status = '运行632分析中…'
      this.statusType = ''
      return API.run632(this.storageBody()).then(function (res) {
        self.gd.analysisResult = res
        self.gd.analysisDone = true
        self.status = '632分析完成'
        self.statusType = 'ok'
      }).catch(function (e) {
        self.status = e.message
        self.statusType = 'err'
      }).then(function () {
        self.running = false
      })
    }
  }
}
</script>
