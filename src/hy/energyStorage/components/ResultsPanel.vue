<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div class="card" v-if="netStats">
      <h2>功率统计对比</h2>
      <p class="es-table-note">电网功率约束：下限 {{ netStats.gridMin }}　|　上限 {{ netStats.gridMax }}</p>
      <es-table :data="netStats.rows" :columns="columns.netStats" :visible="active" />
    </div>

    <div v-if="!hasResult" class="card">
      <p class="empty-hint">请先在"优化计算"页运行优化，结果将在此展示。</p>
    </div>

    <div v-else>
      <div class="form-row chart-date-row" style="margin-bottom:12px">
        <div class="form-group"><label>起始日期</label>
          <el-date-picker class="es-date" v-model="chartStart" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :picker-options="chartPickerOptions" popper-class="es-date-popper"></el-date-picker>
        </div>
        <div class="form-group"><label>结束日期</label>
          <el-date-picker class="es-date" v-model="chartEnd" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :picker-options="chartPickerOptions" popper-class="es-date-popper"></el-date-picker>
        </div>
        <button class="btn secondary" @click="reloadCharts">加载图表</button>
      </div>
      <div class="card">
        <h2>削峰填谷效果</h2>
        <div class="series-checkboxes">
          <el-checkbox v-model="peakSeries.net_load">净负荷(负荷-新能源)</el-checkbox>
          <el-checkbox v-model="peakSeries.net_with_storage">优化后净负荷(含储能)</el-checkbox>
          <el-checkbox v-model="peakSeries.load">调整后负荷</el-checkbox>
          <el-checkbox v-model="peakSeries.renewable">新能源发电</el-checkbox>
          <el-checkbox v-model="peakSeries.storage_load">储能负荷</el-checkbox>
        </div>
        <div class="chart-wrap"><div ref="peakChart" class="chart-el"></div></div>
      </div>
      <div class="card">
        <h2>储能负荷·分时电价</h2>
        <div class="chart-wrap"><div ref="cdChart" class="chart-el"></div></div>
      </div>
      <div class="card">
        <h2>SOC·储能负荷</h2>
        <div class="chart-wrap"><div ref="socChart" class="chart-el"></div></div>
      </div>
      <div class="card">
        <h2>关键数据列表（预览第1行，完整数据请下载CSV）</h2>
        <div class="form-row chart-date-row" style="margin-bottom:10px">
          <div class="form-group"><label>数据下载起始日期</label>
            <el-date-picker class="es-date" v-model="downloadStart" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="true" :picker-options="chartPickerOptions" popper-class="es-date-popper"></el-date-picker>
          </div>
          <div class="form-group"><label>数据下载结束日期</label>
            <el-date-picker class="es-date" v-model="downloadEnd" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="true" :picker-options="chartPickerOptions" popper-class="es-date-popper"></el-date-picker>
          </div>
          <button class="btn secondary" @click="downloadFiltered">下载筛选数据 (CSV)</button>
          <button class="btn secondary" style="margin-left:4px" @click="downloadAll">下载全量数据 (CSV)</button>
        </div>
        <es-table :data="detailRows" :columns="columns.detailPreview" :visible="active" />
        <p v-if="detailPreview && detailPreview.total > 1" class="es-table-note">
          共 {{ detailPreview.total }} 行数据，请使用日期筛选后点击下载按钮导出完整数据
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import { esMixin } from '../store'
import {
  downsample,
  extractDateFromLabel,
  classifyPeakValley,
  buildNetStats,
  buildDetailPreview,
  sliceOptimizeResult,
  downloadCsv,
  datePickerOptions
} from '../helpers'
import { COLUMN_CONFIG, DETAIL_CSV_FIELDS, PEAK_SERIES_CONFIG } from '../config'
import {
  disposeChart,
  renderChart,
  whenChartVisible,
  chargeDischargeOption,
  socStorageOption,
  peakShavingOption
} from '../charts'
import EsTable from './EsTable.vue'

export default {
  name: 'ResultsPanel',
  mixins: [esMixin],
  components: { EsTable },
  props: {
    active: { type: Boolean, default: false }
  },
  data: function () {
    return {
      chartStart: '',
      chartEnd: '',
      downloadStart: '',
      downloadEnd: '',
      dateMin: '',
      dateMax: '',
      columns: COLUMN_CONFIG,
      peakSeries: {
        net_load: true,
        net_with_storage: true,
        load: false,
        renewable: false,
        storage_load: false
      },
      peakChart: null,
      cdChart: null,
      socChart: null
    }
  },
  computed: {
    hasResult: function () {
      const r = this.es.optimizeResult
      return !!(r && r.detail_chart_labels && r.detail_chart_labels.length)
    },
    netStats: function () {
      if (!this.hasResult) return null
      return buildNetStats(this.es.optimizeResult, this.es.optimizeParams)
    },
    detailPreview: function () {
      if (!this.hasResult) return null
      const base = (this.es.optimizeParams && this.es.optimizeParams.base_price) || 500
      return buildDetailPreview(this.es.optimizeResult, base)
    },
    detailRows: function () {
      return this.detailPreview ? [this.detailPreview] : []
    },
    chartPickerOptions: function () {
      return datePickerOptions(this.dateMin, this.dateMax)
    }
  },
  mounted: function () {
    if (this.hasResult) {
      this.applyResultRange(this.es.optimizeResult)
      this.$nextTick(this.drawCharts)
    }
  },
  watch: {
    active: function (val) {
      if (val && this.hasResult) this.$nextTick(this.restoreCharts)
    },
    'es.optimizeResult': function (val) {
      if (val && val.detail_chart_labels && val.detail_chart_labels.length) {
        this.applyResultRange(val)
        this.$nextTick(this.drawCharts)
      } else {
        this.disposeAll()
      }
    },
    peakSeries: {
      deep: true,
      handler: function () {
        if (this.hasResult) this.drawPeak()
      }
    }
  },
  beforeDestroy: function () {
    this.disposeAll()
  },
  methods: {
    applyResultRange: function (result) {
      const labels = result.detail_chart_labels
      const first = extractDateFromLabel(labels[0])
      const last = extractDateFromLabel(labels[labels.length - 1])
      this.chartStart = first || ''
      this.chartEnd = first || ''
      this.downloadStart = first || ''
      this.downloadEnd = last || ''
      if (first && last) {
        this.dateMin = first.substring(0, 4) + '-01-01'
        this.dateMax = last.substring(0, 4) + '-12-31'
      }
    },
    filteredResult: function () {
      return sliceOptimizeResult(this.es.optimizeResult, this.chartStart, this.chartEnd) || this.es.optimizeResult
    },
    reloadCharts: function () {
      this.drawCharts()
    },
    restoreCharts: function () {
      const self = this
      if (!this.hasResult) return
      whenChartVisible([this.$refs.peakChart, this.$refs.cdChart, this.$refs.socChart], function () {
        self.disposeAll()
        self.drawCharts()
      })
    },
    drawCharts: function () {
      if (!this.hasResult) return
      this.drawPeak()
      this.drawChargeDischarge()
      this.drawSoc()
      this.resizeAll()
    },
    drawPeak: function () {
      const result = this.filteredResult()
      const N = Math.min(result.detail_chart_labels.length, 600)
      const ds = function (arr) { return downsample(arr, N) }
      const self = this
      const seriesList = []
      PEAK_SERIES_CONFIG.forEach(function (s) {
        if (self.peakSeries[s.key]) {
          seriesList.push({ name: s.name, data: ds(result[s.field]), color: s.color, width: s.width })
        }
      })
      this.peakChart = renderChart(this.$refs.peakChart, peakShavingOption(ds(result.detail_chart_labels), seriesList), this.peakChart)
    },
    drawChargeDischarge: function () {
      const result = this.filteredResult()
      const N = Math.min(result.detail_chart_labels.length, 600)
      this.cdChart = renderChart(
        this.$refs.cdChart,
        chargeDischargeOption(
          downsample(result.detail_chart_labels, N),
          downsample(result.detail_storage_load, N),
          downsample(result.detail_price, N)
        ),
        this.cdChart
      )
    },
    drawSoc: function () {
      const result = this.filteredResult()
      const N = Math.min(result.detail_chart_labels.length, 600)
      const socPct = downsample(result.detail_soc.map(function (v) { return v * 100 }), N)
      this.socChart = renderChart(
        this.$refs.socChart,
        socStorageOption(
          downsample(result.detail_chart_labels, N),
          downsample(result.detail_storage_load, N),
          socPct
        ),
        this.socChart
      )
    },
    resizeAll: function () {
      ;[this.peakChart, this.cdChart, this.socChart].forEach(function (c) {
        if (c && c.resize) {
          try { c.resize() } catch (e) {}
        }
      })
    },
    disposeAll: function () {
      disposeChart(this.peakChart)
      disposeChart(this.cdChart)
      disposeChart(this.socChart)
      this.peakChart = null
      this.cdChart = null
      this.socChart = null
    },
    csvRows: function (result) {
      const allPrices = result.detail_price || []
      const base = (this.es.optimizeParams && this.es.optimizeParams.base_price) || 500
      const header = DETAIL_CSV_FIELDS.map(function (f) { return f.header }).join(',')
      const rows = []
      for (let i = 0; i < result.detail_chart_labels.length; i++) {
        rows.push(DETAIL_CSV_FIELDS.map(function (f) {
          return f.get(result, i, base, allPrices, classifyPeakValley)
        }).join(','))
      }
      return { header: header, rows: rows }
    },
    downloadFiltered: function () {
      const sliced = sliceOptimizeResult(this.es.optimizeResult, this.downloadStart, this.downloadEnd)
      this.downloadAll(sliced || this.es.optimizeResult)
    },
    downloadAll: function (result) {
      const src = result && result.detail_chart_labels ? result : this.es.optimizeResult
      if (!src) return
      const csv = this.csvRows(src)
      downloadCsv('优化结果明细数据.csv', csv.header, csv.rows)
    }
  }
}
</script>
