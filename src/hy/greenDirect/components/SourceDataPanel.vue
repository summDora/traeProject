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
      <div class="hint" style="margin-top:8px">CSV 需含「时间」列及负荷/新能源功率列；时间格式如 2023/1/1 0:00 或 2023-01-01 00:00。</div>
      <div class="builtin-download" style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <span style="font-size:13px;color:#666">内置示例数据下载：</span>
        <button type="button" class="btn secondary" style="font-size:12px;padding:6px 14px" :disabled="downloadingSample" @click="downloadSample('load')">用户负荷曲线(9MW).csv</button>
        <button type="button" class="btn secondary" style="font-size:12px;padding:6px 14px" :disabled="downloadingSample" @click="downloadSample('renewable')">新能源发电曲线(12MW).csv</button>
        <button type="button" class="btn secondary" style="font-size:12px;padding:6px 14px" :disabled="downloadingSample" @click="downloadSample('market')">市场电价参数.xlsx</button>
      </div>
    </div>

    <div v-if="gd.sourceStats" class="stats-grid">
      <div class="stat-card"><div class="stat-label">数据行数</div><div class="stat-value">{{ fmt0(gd.sourceStats.row_count) }}</div></div>
      <div class="stat-card"><div class="stat-label">日期范围</div><div class="stat-value small">{{ gd.sourceStats.date_start }} ~ {{ gd.sourceStats.date_end }}</div></div>
      <div class="stat-card"><div class="stat-label">最大负荷 (MW)</div><div class="stat-value">{{ fmt2(gd.sourceStats.load_max_mw) }}</div></div>
      <div class="stat-card"><div class="stat-label">全年用电量 (MWh)</div><div class="stat-value">{{ fmt0(gd.sourceStats.load_total_mwh) }}</div></div>
      <div class="stat-card"><div class="stat-label">负荷小时数</div><div class="stat-value">{{ fmt0(gd.sourceStats.load_hours) }}</div></div>
      <div class="stat-card"><div class="stat-label">新能源最大 (MW)</div><div class="stat-value">{{ fmt2(gd.sourceStats.renewable_max_mw) }}</div></div>
      <div class="stat-card"><div class="stat-label">新能源电量 (MWh)</div><div class="stat-value">{{ fmt0(gd.sourceStats.renewable_total_mwh) }}</div></div>
      <div class="stat-card"><div class="stat-label">新能源小时数</div><div class="stat-value">{{ fmt0(gd.sourceStats.renewable_hours) }}</div></div>
    </div>

    <div v-show="gd.dataLoaded" class="card">
      <h2>曲线修正 — 缩放系数</h2>
      <div class="form-row">
        <div class="form-group">
          <label>负荷缩放系数</label>
          <el-input size="small" type="number" v-model.number="gd.loadScale" :step="0.01" :min="0" :max="100"></el-input>
        </div>
        <div class="form-group">
          <label>新能源缩放系数</label>
          <el-input size="small" type="number" v-model.number="gd.renewableScale" :step="0.01" :min="0" :max="100"></el-input>
        </div>
        <button class="btn primary" @click="previewScaling">应用缩放</button>
      </div>
      <div v-if="gd.scalingPreview" class="scaling-results">
        <div>修正后最大负荷: <b>{{ fmt2(gd.scalingPreview.load_max_mw) }} MW</b></div>
        <div>修正后全年电量: <b>{{ fmt0(gd.scalingPreview.load_total_mwh) }} MWh</b></div>
        <div>修正后负荷小时数: <b>{{ fmt0(gd.scalingPreview.load_hours) }} h</b></div>
        <div>修正后新能源最大: <b>{{ fmt2(gd.scalingPreview.renewable_max_mw) }} MW</b></div>
        <div>修正后新能源电量: <b>{{ fmt0(gd.scalingPreview.renewable_total_mwh) }} MWh</b></div>
        <div>修正后新能源小时数: <b>{{ fmt0(gd.scalingPreview.renewable_hours) }} h</b></div>
      </div>
    </div>

    <div v-show="gd.dataLoaded" class="card">
      <h2>负荷·新能源·净负荷曲线</h2>
      <div class="form-row chart-date-row">
        <div class="form-group"><label>起始日期</label>
          <el-date-picker class="es-date" v-model="gd.chartDateStart" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" popper-class="es-date-popper"></el-date-picker>
        </div>
        <div class="form-group"><label>结束日期</label>
          <el-date-picker class="es-date" v-model="gd.chartDateEnd" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" popper-class="es-date-popper"></el-date-picker>
        </div>
        <button class="btn secondary" @click="reloadChart">加载图表</button>
      </div>
      <div class="chart-wrap"><div ref="sourceChart" class="chart-el"></div></div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { gdMixin } from '../store'
import { downsample } from '../helpers'
import { disposeChart, renderChart, sourceLoadOption, whenChartVisible } from '../charts'

export default {
  name: 'GdSourceDataPanel',
  mixins: [gdMixin],
  props: {
    active: { type: Boolean, default: false }
  },
  data() {
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
    canUpload() {
      return !!(this.loadFile && this.renewableFile)
    }
  },
  mounted() {
    this.autoLoad()
  },
  watch: {
    active(val) {
      if (val) {
        if (this.gd.dataLoaded && !this.gd.sourceChart) this.reloadChart()
        else this.$nextTick(this.restoreChart)
      }
    }
  },
  beforeDestroy() {
    disposeChart(this.chart)
    this.chart = null
  },
  methods: {
    fmt2(v) { return v == null ? '-' : Number(v).toFixed(2) },
    fmt0(v) {
      return v == null ? '-' : Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })
    },
    downloadSample(kind) {
      if (this.downloadingSample) return
      this.downloadingSample = true
      API.downloadSample(kind).catch((e) => {
        this.uploadStatus = '下载失败: ' + e.message
        this.statusColor = '#c62828'
      }).then(() => {
        this.downloadingSample = false
      })
    },
    onPickLoad(e) {
      this.loadFile = e.target.files && e.target.files[0]
      this.hintLoad = this.loadFile ? this.loadFile.name : '未选择文件'
    },
    onPickRenewable(e) {
      this.renewableFile = e.target.files && e.target.files[0]
      this.hintRenewable = this.renewableFile ? this.renewableFile.name : '未选择文件'
    },
    applyLoaded(data, msg) {
      if (!data || !data.row_count) {
        throw new Error('未返回有效统计数据')
      }
      this.gd.dataLoaded = true
      this.uploadStatus = msg || ('已加载 ' + data.row_count + ' 行，' + (data.date_start || '') + ' ~ ' + (data.date_end || ''))
      this.statusColor = '#2e7d32'
      this.gd.sourceStats = data
      this.gd.dateStart = data.date_start || ''
      this.gd.dateEnd = data.date_end || ''
      this.gd.loadScale = 1
      this.gd.renewableScale = 1
      if (data.date_start) {
        this.gd.chartDateStart = data.date_start
        this.gd.chartDateEnd = data.date_start
      }
      if (data.renewable_max_mw != null) {
        this.gd.econ.re_max_power = Number(Number(data.renewable_max_mw).toFixed(2))
        this.gd.econ.re_capacity = Number((this.gd.econ.re_max_power * (this.gd.econ.capacity_ratio || 1)).toFixed(2))
      }
      this.reloadChart()
    },
    autoLoad() {
      if (this.gd.dataLoaded) {
        this.$nextTick(this.drawAndResize)
        return
      }
      API.getStats().then((s) => {
        if (s && s.row_count > 0) {
          this.applyLoaded(s, '已恢复上次上传数据：' + s.row_count + ' 行')
          return
        }
        return this.loadDefault()
      }).catch(() => {
        this.loadDefault()
      })
    },
    drawChart() {
      const src = this.gd.sourceChart
      const el = this.$refs.sourceChart
      if (!src || !el || !src.labels || !src.labels.length) return
      this.chart = renderChart(el, sourceLoadOption(
        downsample(src.labels, 360),
        downsample(src.load, 360),
        downsample(src.renewable, 360),
        downsample(src.net, 360)
      ), this.chart)
    },
    resizeChart() {
      if (this.chart && this.chart.resize) {
        try { this.chart.resize() } catch (e) {}
      }
    },
    drawAndResize() {
      this.drawChart()
      this.resizeChart()
    },
    restoreChart() {
      whenChartVisible(this.$refs.sourceChart, () => {
        disposeChart(this.chart)
        this.chart = null
        this.drawAndResize()
      })
    },
    reloadChart() {
      if (!this.gd.dataLoaded) return
      API.getChartData(this.gd.chartDateStart, this.gd.chartDateEnd, this.gd.loadScale, this.gd.renewableScale).then((chartData) => {
        this.gd.sourceChart = {
          labels: chartData.labels || [],
          load: chartData.load || [],
          renewable: chartData.renewable || [],
          net: chartData.net || []
        }
        if (!this.gd.sourceChart.labels.length) {
          this.uploadStatus = '当前日期范围内没有曲线点，请调整起止日期后重新加载'
          this.statusColor = '#c62828'
        }
        this.$nextTick(() => {
          this.drawAndResize()
        })
      }).catch((e) => {
        this.uploadStatus = '图表加载失败: ' + e.message
        this.statusColor = '#c62828'
      })
    },
    loadDefault() {
      this.loadingDefault = true
      this.uploadStatus = '正在加载示例数据…'
      this.statusColor = '#666'
      return API.loadDefaultData().then((data) => {
        this.applyLoaded(data, '示例数据已加载：' + data.row_count + ' 行，' + data.date_start + ' ~ ' + data.date_end)
      }).catch((e) => {
        this.uploadStatus = '错误: ' + e.message
        this.statusColor = '#c62828'
      }).then(() => {
        this.loadingDefault = false
      })
    },
    upload() {
      this.uploading = true
      this.uploadStatus = ''
      API.uploadData(this.loadFile, this.renewableFile).then((data) => {
        this.applyLoaded(data, '数据已解析')
      }).catch((e) => {
        this.uploadStatus = '错误: ' + e.message
        this.statusColor = '#c62828'
      }).then(() => {
        this.uploading = false
      })
    },
    previewScaling() {
      API.previewScaling(this.gd.loadScale, this.gd.renewableScale).then((preview) => {
        this.gd.scalingPreview = preview
        this.reloadChart()
      }).catch((e) => {
        alert('预览失败: ' + e.message)
      })
    }
  }
}
</script>
