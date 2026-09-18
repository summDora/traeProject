<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card">
      <h2>上传负荷与新能源数据</h2>
      <div class="upload-row">
        <div class="upload-box">
          <label>负荷 CSV</label>
          <input type="file" accept=".csv" @change="onPickLoad">
          <span class="hint">{{ hintLoad }}</span>
        </div>
        <div class="upload-box">
          <label>新能源 CSV</label>
          <input type="file" accept=".csv" @change="onPickRenewable">
          <span class="hint">{{ hintRenewable }}</span>
        </div>
        <div class="upload-actions">
          <span class="upload-actions-label" aria-hidden="true">&nbsp;</span>
          <div class="upload-actions-btns">
            <button class="btn primary" :disabled="!canUpload || uploading" @click="upload">
              {{ uploading ? '解析中...' : '上传并解析' }}
            </button>
            <button class="btn secondary" :disabled="loadingDefault" @click="loadDefault">
              {{ loadingDefault ? '加载中...' : '加载示例数据' }}
            </button>
          </div>
        </div>
      </div>
      <div class="status" :style="{ color: statusColor }">{{ uploadStatus }}</div>
      <div class="builtin-download" style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="font-size:13px;color:#666">下载示例数据:</span>
        <button type="button" class="btn secondary" style="font-size:12px;padding:6px 14px" :disabled="downloadingSample" @click="downloadSample('load')">负荷CSV</button>
        <button type="button" class="btn secondary" style="font-size:12px;padding:6px 14px" :disabled="downloadingSample" @click="downloadSample('renewable')">新能源CSV</button>
        <span style="flex:1"></span>
        <button v-show="es.dataLoaded" class="btn secondary" style="font-size:12px;padding:6px 14px" @click="resetUpload">重新上传数据</button>
      </div>
    </div>

    <div v-if="es.sourceStats" class="stats-grid">
      <div class="stat-card"><div class="stat-label">数据行数</div><div class="stat-value">{{ fmt0(es.sourceStats.row_count) }}</div></div>
      <div class="stat-card"><div class="stat-label">日期范围</div><div class="stat-value small">{{ es.sourceStats.date_start }} ~ {{ es.sourceStats.date_end }}</div></div>
      <div class="stat-card"><div class="stat-label">最大负荷 (MW)</div><div class="stat-value">{{ fmt1(es.sourceStats.load_max_mw) }}</div></div>
      <div class="stat-card"><div class="stat-label">全年用电量 (MWh)</div><div class="stat-value">{{ fmt0(es.sourceStats.load_total_mwh) }}</div></div>
      <div class="stat-card"><div class="stat-label">负荷小时数</div><div class="stat-value">{{ fmt0(es.sourceStats.load_hours) }}</div></div>
      <div class="stat-card"><div class="stat-label">新能源最大 (MW)</div><div class="stat-value">{{ fmt1(es.sourceStats.renewable_max_mw) }}</div></div>
      <div class="stat-card"><div class="stat-label">新能源电量 (MWh)</div><div class="stat-value">{{ fmt0(es.sourceStats.renewable_total_mwh) }}</div></div>
      <div class="stat-card"><div class="stat-label">新能源小时数</div><div class="stat-value">{{ fmt0(es.sourceStats.renewable_hours) }}</div></div>
    </div>

    <div v-show="es.dataLoaded" class="card">
      <h2>曲线修正 — 缩放系数</h2>
      <div class="form-row">
        <div class="form-group">
          <label>负荷缩放系数</label>
          <el-input size="small" type="number" v-model.number="es.loadScale" :step="0.01" :min="0" :max="10"></el-input>
        </div>
        <div class="form-group">
          <label>新能源缩放系数</label>
          <el-input size="small" type="number" v-model.number="es.renewableScale" :step="0.01" :min="0" :max="10"></el-input>
        </div>
        <button class="btn primary" @click="previewScaling">预览修正结果</button>
      </div>
      <div v-if="es.scalingPreview" class="scaling-results">
        <div>修正后最大负荷: <b>{{ fmt1(es.scalingPreview.load_max_mw) }} MW</b></div>
        <div>修正后全年电量: <b>{{ fmt0(es.scalingPreview.load_total_mwh) }} MWh</b></div>
        <div>修正后负荷小时数: <b>{{ fmt0(es.scalingPreview.load_hours) }} h</b></div>
        <div>修正后新能源最大: <b>{{ fmt1(es.scalingPreview.renewable_max_mw) }} MW</b></div>
        <div>修正后新能源电量: <b>{{ fmt0(es.scalingPreview.renewable_total_mwh) }} MWh</b></div>
        <div>修正后新能源小时数: <b>{{ fmt0(es.scalingPreview.renewable_hours) }} h</b></div>
        <div>修正后净负荷最大: <b>{{ fmt1(es.scalingPreview.net_max_mw) }} MW</b></div>
        <div>修正后净电量: <b>{{ fmt0(es.scalingPreview.net_total_mwh) }} MWh</b></div>
      </div>
    </div>

    <div v-show="es.dataLoaded" class="card">
      <h2>负荷·新能源·净负荷曲线</h2>
      <div class="form-row chart-date-row">
        <div class="form-group"><label>起始日期</label>
          <el-date-picker class="es-date" v-model="es.chartDateStart" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" popper-class="es-date-popper"></el-date-picker>
        </div>
        <div class="form-group"><label>结束日期</label>
          <el-date-picker class="es-date" v-model="es.chartDateEnd" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" popper-class="es-date-popper"></el-date-picker>
        </div>
        <button class="btn secondary" @click="reloadChart">加载图表</button>
      </div>
      <div class="chart-wrap"><div ref="sourceChart" class="chart-el"></div></div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { esMixin } from '../store'
import { downsample } from '../helpers'
import { disposeChart, renderChart, sourceLoadOption, whenChartVisible } from '../charts'

export default {
  name: 'SourceDataPanel',
  mixins: [esMixin],
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      loadFile: null,
      renewableFile: null,
      hintLoad: '未选择文件',
      hintRenewable: '未选择文件',
      uploading: false,
      loadingDefault: false,
      downloadingSample: false,
      uploadStatus: '',
      statusColor: '',
      chart: null
    }
  },
  computed: {
    canUpload: function () {
      return !!(this.loadFile && this.renewableFile)
    }
  },
  mounted: function () {
    this.autoLoad()
    if (this.es.dataLoaded) this.$nextTick(this.drawChart)
  },
  watch: {
    active: function (val) {
      if (val) this.$nextTick(this.restoreChart)
    }
  },
  beforeDestroy: function () {
    disposeChart(this.chart)
    this.chart = null
  },
  methods: {
    fmt1: function (v) { return v == null ? '-' : Number(v).toFixed(1) },
    fmt0: function (v) {
      return v == null ? '-' : Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    downloadSample: function (kind) {
      const self = this
      if (this.downloadingSample) return
      this.downloadingSample = true
      API.downloadSample(kind).catch(function (e) {
        self.uploadStatus = '下载失败: ' + e.message
        self.statusColor = 'red'
      }).then(function () {
        self.downloadingSample = false
      })
    },
    onPickLoad: function (e) {
      this.loadFile = e.target.files && e.target.files[0]
      this.hintLoad = this.loadFile ? this.loadFile.name : '未选择文件'
    },
    onPickRenewable: function (e) {
      this.renewableFile = e.target.files && e.target.files[0]
      this.hintRenewable = this.renewableFile ? this.renewableFile.name : '未选择文件'
    },
    applyLoaded: function (data, msg) {
      this.es.dataLoaded = true
      this.uploadStatus = msg || '示例数据已加载（可重新上传替换）'
      this.statusColor = 'green'
      this.es.sourceStats = data
      this.es.sourceChart = {
        chart_labels: data.chart_labels,
        chart_load: data.chart_load,
        chart_renewable: data.chart_renewable,
        chart_net: data.chart_net
      }
      this.es.loadScale = 1
      this.es.renewableScale = 1
      if (data.date_start) {
        this.es.chartDateStart = data.date_start
        this.es.chartDateEnd = data.date_end
        this.es.opt.start_date = data.date_start
        this.es.opt.end_date = data.date_end
      }
      if (data.time_step_hours != null) {
        this.es.opt.dt_hours = data.time_step_hours
      }
      this.$nextTick(this.drawChart)
    },
    drawChart: function () {
      const src = this.es.scalingPreview || this.es.sourceChart
      if (!src || !this.$refs.sourceChart) return
      this.chart = renderChart(this.$refs.sourceChart, sourceLoadOption(
        downsample(src.chart_labels, 360),
        downsample(src.chart_load, 360),
        downsample(src.chart_renewable, 360),
        downsample(src.chart_net, 360)
      ), this.chart)
    },
    restoreChart: function () {
      const self = this
      if (!this.es.dataLoaded) return
      whenChartVisible(this.$refs.sourceChart, function () {
        disposeChart(self.chart)
        self.chart = null
        self.drawChart()
      })
    },
    resizeChart: function () {
      if (this.chart && this.chart.resize) this.chart.resize()
    },
    autoLoad: function () {
      const self = this
      if (this.es.dataLoaded) return
      this.loadDefault(true)
    },
    loadDefault: function (silent) {
      const self = this
      if (this.loadingDefault) return
      this.loadingDefault = true
      if (!silent) {
        this.uploadStatus = '正在加载示例数据…'
        this.statusColor = '#666'
      }
      return API.loadDefaultData().then(function (data) {
        self.applyLoaded(data, '示例数据已加载（可重新上传替换）')
      }).catch(function (e) {
        if (!silent) {
          self.uploadStatus = '错误: ' + e.message
          self.statusColor = 'red'
        }
      }).then(function () {
        self.loadingDefault = false
      })
    },
    upload: function () {
      const self = this
      this.uploading = true
      this.uploadStatus = ''
      API.uploadData(this.loadFile, this.renewableFile).then(function (data) {
        self.applyLoaded(data, '数据已解析')
      }).catch(function (e) {
        self.uploadStatus = '错误: ' + e.message
        self.statusColor = 'red'
      }).then(function () {
        self.uploading = false
      })
    },
    previewScaling: function () {
      const self = this
      const run = function () {
        return API.previewScaling(self.es.loadScale, self.es.renewableScale)
      }
      const go = this.es.dataLoaded ? Promise.resolve() : API.loadDefaultData().then(function (data) {
        self.applyLoaded(data)
      })
      go.then(run).then(function (preview) {
        self.es.scalingPreview = preview
        self.$nextTick(self.drawChart)
      }).catch(function (e) {
        alert('预览失败: ' + e.message)
      })
    },
    reloadChart: function () {
      const self = this
      if (!this.es.dataLoaded) return
      API.getChartData(this.es.chartDateStart, this.es.chartDateEnd, this.es.loadScale, this.es.renewableScale).then(function (chartData) {
        self.es.sourceChart = {
          chart_labels: chartData.labels || [],
          chart_load: chartData.load || [],
          chart_renewable: chartData.renewable || [],
          chart_net: chartData.net || []
        }
        self.es.scalingPreview = null
        self.$nextTick(self.drawChart)
      }).catch(function (e) {
        console.error(e)
      })
    },
    resetUpload: function () {
      disposeChart(this.chart)
      this.chart = null
      this.es.resetSource()
      this.loadFile = null
      this.renewableFile = null
      this.hintLoad = '未选择文件'
      this.hintRenewable = '未选择文件'
      this.uploadStatus = ''
    }
  }
}
</script>
