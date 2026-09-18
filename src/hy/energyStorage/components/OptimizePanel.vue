<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2>优化参数</h2>
      <div class="form-grid col3">
        <div class="form-group">
          <label>起始日期</label>
          <el-date-picker class="es-date" v-model="es.opt.start_date" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" popper-class="es-date-popper"></el-date-picker>
        </div>
        <div class="form-group">
          <label>结束日期</label>
          <el-date-picker class="es-date" v-model="es.opt.end_date" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" popper-class="es-date-popper"></el-date-picker>
        </div>
        <div class="form-group">
          <label>时间步长 (h)</label>
          <el-input size="small" type="number" v-model.number="es.opt.dt_hours" :step="0.25" :min="0.25"></el-input>
        </div>
        <div class="form-group">
          <label>平段基准电价 (元/MWh)</label>
          <el-input size="small" type="number" v-model.number="es.opt.base_price" :step="1"></el-input>
        </div>
        <div class="form-group">
          <label>上网电价 (元/MWh)</label>
          <el-input size="small" type="number" v-model.number="es.opt.export_price" :step="1"></el-input>
        </div>
        <div class="form-group">
          <label>净功率下限 (MW, 空=无约束)</label>
          <el-input size="small" v-model="es.opt.grid_power_min" placeholder="None"></el-input>
        </div>
        <div class="form-group">
          <label>净功率上限 (MW, 空=无约束)</label>
          <el-input size="small" v-model="es.opt.grid_power_max" placeholder="None"></el-input>
        </div>
      </div>
      <div style="margin-top:18px">
        <button class="btn primary" style="padding:11px 30px;font-size:14px" :disabled="es.optimizing" @click="runOptimize">
          {{ es.optimizing ? '计算中...' : '开始逐日优化计算' }}
        </button>
      </div>
      <div class="status" :style="{ color: statusColor }">{{ es.optimizeStatus }}</div>
      <div v-show="es.progressVisible">
        <div class="progress-bar"><div class="progress-fill" :style="{ width: es.progressPct + '%' }"></div></div>
        <div>{{ es.progressText }}</div>
        <div style="margin-top:10px;">
          <button class="btn danger" :disabled="es.cancelling" @click="cancelOptimize">
            {{ es.cancelling ? '正在终止...' : '终止优化' }}
          </button>
        </div>
        <div>
          <span v-if="es.progressLatest" class="date-chip completed" style="display:inline-block;margin:2px;padding:2px 8px;border-radius:4px;background:#22c55e;color:#fff;font-size:13px;">
            正在计算: {{ es.progressLatest }} ({{ es.progressDone }}/{{ es.progressTotalDays || '?' }})
          </span>
          <span v-else style="color:#666;font-size:13px;">已完成 0 / {{ es.progressTotalDays || '?' }} 天</span>
        </div>
      </div>
    </div>

    <div v-if="es.optimizeResult && es.optimizeResult.success" class="card">
      <h2>优化汇总</h2>
      <div>
        <div>储能前购电: <b>{{ fmt(es.optimizeResult.cum_baseline_buy) }}</b> 元 &nbsp;&nbsp; → &nbsp;&nbsp;
             储能后购电: <b>{{ fmt(es.optimizeResult.cum_optimized_buy) }}</b> 元</div>
        <div>储能前售电: <b>{{ fmt(es.optimizeResult.cum_baseline_sell) }}</b> 元 &nbsp;&nbsp; → &nbsp;&nbsp;
             储能后售电: <b>{{ fmt(es.optimizeResult.cum_optimized_sell) }}</b> 元</div>
        <div>储能前净费: <b>{{ fmt(es.optimizeResult.baseline_net) }}</b> 元 &nbsp;&nbsp; → &nbsp;&nbsp;
             储能后净费: <b>{{ fmt(es.optimizeResult.optimized_net) }}</b> 元</div>
        <div class="highlight">总成本节省: {{ fmt(es.optimizeResult.total_saving) }} 元 &nbsp;({{ pct }}%)</div>
        <div>总充电量: {{ mwh(es.optimizeResult.cum_charge_mwh) }} MWh &nbsp;|&nbsp; 总放电量: {{ mwh(es.optimizeResult.cum_discharge_mwh) }} MWh &nbsp;|&nbsp; 累计循环: {{ cyc }} 次</div>
      </div>
    </div>

    <div v-if="dailyRows.length" class="card">
      <h2>逐日优化明细</h2>
      <es-table :data="dailyRows" :columns="columns.dailyOptimize" :max-height="420" :visible="active" />
    </div>
  </section>
</template>

<script>
import API from '../api'
import { esMixin } from '../store'
import { parseOrNull } from '../helpers'
import { COLUMN_CONFIG } from '../config'
import EsTable from './EsTable.vue'

export default {
  name: 'OptimizePanel',
  mixins: [esMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      pollInFlight: false,
      startTime: 0,
      pollTimer: null,
      columns: COLUMN_CONFIG
    }
  },
  computed: {
    statusColor: function () {
      if (this.es.optimizeStatusType === 'ok') return 'green'
      if (this.es.optimizeStatusType === 'warn') return 'orange'
      if (this.es.optimizeStatusType === 'err') return 'red'
      return ''
    },
    pct: function () {
      const r = this.es.optimizeResult
      return r && r.saving_pct != null ? Number(r.saving_pct).toFixed(1) : '0.0'
    },
    cyc: function () {
      const r = this.es.optimizeResult
      return r && r.cum_cycles != null ? Number(r.cum_cycles).toFixed(2) : '0.00'
    },
    dailyRows: function () {
      const r = this.es.optimizeResult
      if (!r || !r.daily_results) return []
      return r.daily_results.map(function (d) {
        const badge = d.status === 'SKIP' ? '跳过' : (d.validation_ok ? '通过' : '失败')
        const color = d.status === 'SKIP' ? '#999' : (d.validation_ok ? 'green' : 'red')
        return Object.assign({}, d, { badge: badge, color: color })
      })
    }
  },
  beforeDestroy: function () {
    this.clearTimer()
  },
  methods: {
    fmt: function (v) {
      return v == null ? '-' : Number(v).toLocaleString()
    },
    mwh: function (v) {
      return v == null ? '-' : Number(v).toFixed(1)
    },
    clearTimer: function () {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
    },
    buildParams: function () {
      return {
        start_date: this.es.opt.start_date,
        end_date: this.es.opt.end_date,
        load_scale: this.es.loadScale,
        renewable_scale: this.es.renewableScale,
        dt_hours: this.es.opt.dt_hours,
        base_price: this.es.opt.base_price,
        grid_power_min: parseOrNull(this.es.opt.grid_power_min),
        grid_power_max: parseOrNull(this.es.opt.grid_power_max),
        export_price: this.es.opt.export_price,
        storage: {
          rated_power: this.es.storage.rated_power,
          energy_capacity: this.es.storage.energy_capacity,
          charge_efficiency: this.es.storage.charge_efficiency,
          discharge_efficiency: this.es.storage.discharge_efficiency,
          soc_min: this.es.storage.soc_min,
          soc_max: this.es.storage.soc_max,
          initial_soc: this.es.storage.initial_soc,
          require_daily_cycle: this.es.storage.require_daily_cycle
        }
      }
    },
    runOptimize: function () {
      const self = this
      if (!this.es.dataLoaded) {
        alert('请先在"源荷数据"页上传数据')
        return
      }
      const params = this.buildParams()
      this.es.optimizeParams = params
      this.es.optimizeResult = null
      this.es.costResult = null
      this.es.optimizing = true
      this.es.progressVisible = true
      this.es.progressText = '正在启动优化任务...'
      this.es.optimizeStatus = ''
      this.es.cancelling = false
      this.startTime = Date.now()
      let totalEstimatedDays = 0
      if (params.start_date && params.end_date) {
        const start = new Date(params.start_date)
        const end = new Date(params.end_date)
        totalEstimatedDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
      }
      this.es.progressTotalDays = totalEstimatedDays
      this.es.progressDone = 0
      this.es.progressLatest = ''
      this.clearTimer()
      API.startOptimization(params).then(function (res) {
        self.es.activeTaskId = res.task_id
        self.es.progressText = '优化任务已启动，正在计算...'
        self.pollTimer = setInterval(function () {
          self.poll(res.task_id, totalEstimatedDays)
        }, 500)
      }).catch(function (e) {
        self.es.optimizing = false
        self.es.progressVisible = false
        self.es.activeTaskId = null
        self.es.optimizeStatus = '错误: ' + e.message
        self.es.optimizeStatusType = 'err'
      })
    },
    poll: function (taskId, totalEstimatedDays) {
      const self = this
      if (this.pollInFlight) return
      this.pollInFlight = true
      API.getProgress(taskId).then(function (progress) {
        const completedCount = (progress.progress && progress.progress.length) || 0
        self.es.progressDone = completedCount
        self.es.progressPct = totalEstimatedDays > 0 ? Math.min(100, (completedCount / totalEstimatedDays) * 100) : 0
        self.es.progressText = '已计算 ' + completedCount + ' 天'
        if (progress.progress && progress.progress.length) {
          self.es.progressLatest = progress.progress[progress.progress.length - 1]
        }
        if (progress.status === 'completed') {
          self.clearTimer()
          self.es.progressText = '优化完成，正在加载结果...'
          self.es.progressPct = 100
          return API.getResult(taskId).then(function (result) {
            self.finishOk(result)
          })
        }
        if (progress.status === 'failed') {
          self.finishFail('优化失败: ' + (progress.error || '未知错误'))
        }
        if (progress.status === 'cancelled') {
          self.es.cancelling = false
          self.finishWarn('任务已取消，可稍后重新发起优化')
        }
      }).catch(function (e) {
        console.error(e)
      }).then(function () {
        self.pollInFlight = false
      })
    },
    finishOk: function (result) {
      this.es.optimizing = false
      this.es.progressVisible = false
      this.es.activeTaskId = null
      if (result.success) {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1)
        const elapsedStr = elapsed > 60 ? (elapsed / 60).toFixed(1) + ' 分钟' : elapsed + ' 秒'
        this.es.optimizeResult = result
        this.es.optimizeStatus = '完成! 有效天数 ' + result.valid_days + '/' + result.total_days + '，耗时 ' + elapsedStr + '。可前往"结果展示"页查看。'
        this.es.optimizeStatusType = 'ok'
      } else {
        this.es.optimizeStatus = result.message || '优化未能产生有效结果'
        this.es.optimizeStatusType = 'warn'
      }
    },
    finishFail: function (msg) {
      this.clearTimer()
      this.es.optimizing = false
      this.es.progressVisible = false
      this.es.activeTaskId = null
      this.es.optimizeStatus = msg
      this.es.optimizeStatusType = 'err'
    },
    finishWarn: function (msg) {
      this.clearTimer()
      this.es.optimizing = false
      this.es.progressVisible = false
      this.es.activeTaskId = null
      this.es.optimizeStatus = msg
      this.es.optimizeStatusType = 'warn'
    },
    cancelOptimize: function () {
      const self = this
      if (!this.es.activeTaskId) return
      this.es.cancelling = true
      this.es.progressText = '正在终止优化任务...'
      API.cancelOptimization(this.es.activeTaskId).catch(function (e) {
        self.es.cancelling = false
        self.es.optimizeStatus = '终止失败: ' + e.message
        self.es.optimizeStatusType = 'err'
      })
    }
  }
}
</script>
