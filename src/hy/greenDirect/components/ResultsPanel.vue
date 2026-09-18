<template>
  <section class="tab-content" :class="{ active: active }" v-show="active">
    <div v-if="!gd.analysisDone" class="card">
      <p class="empty-hint">请先在「指标分析」页运行 632，结果将在此展示。</p>
    </div>
    <div v-else>
      <div class="card">
        <h2>功率 / 电量 / 632 统计</h2>
        <es-table :data="statsRows" :columns="columns.resStats" :visible="active" />
      </div>
      <div class="form-row chart-date-row" style="margin-bottom:12px">
        <div class="form-group"><label>起始日期</label>
          <el-date-picker class="es-date" v-model="chartStart" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :picker-options="chartPickerOptions" popper-class="es-date-popper"></el-date-picker>
        </div>
        <div class="form-group"><label>结束日期</label>
          <el-date-picker class="es-date" v-model="chartEnd" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="false" :picker-options="chartPickerOptions" popper-class="es-date-popper"></el-date-picker>
        </div>
        <button class="btn secondary" @click="loadResults">加载图表</button>
      </div>
      <div class="card">
        <h2>削峰填谷效果</h2>
        <div class="series-checkboxes">
          <el-checkbox v-model="peakSeries.net_load">净负荷(源荷)</el-checkbox>
          <el-checkbox v-model="peakSeries.net_with_storage">优化后净负荷(含储能)</el-checkbox>
          <el-checkbox v-model="peakSeries.load">调整后负荷</el-checkbox>
          <el-checkbox v-model="peakSeries.renewable">新能源发电</el-checkbox>
          <el-checkbox v-model="peakSeries.storage_power">储能负荷</el-checkbox>
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
        <h2>时序明细（预览前 48 行）</h2>
        <div class="form-row chart-date-row" style="margin-bottom:10px">
          <div class="form-group"><label>数据下载起始日期</label>
            <el-date-picker class="es-date" v-model="downloadStart" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="true" popper-class="es-date-popper"></el-date-picker>
          </div>
          <div class="form-group"><label>数据下载结束日期</label>
            <el-date-picker class="es-date" v-model="downloadEnd" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期" :clearable="true" popper-class="es-date-popper"></el-date-picker>
          </div>
          <button class="btn secondary" @click="downloadFiltered">下载筛选数据 (CSV)</button>
          <button class="btn secondary" style="margin-left:4px" @click="downloadAll">下载全量数据 (CSV)</button>
        </div>
        <es-table :data="detailRows" :columns="columns.detailPreview" :max-height="420" :visible="active" />
        <p v-if="gd.lastDetail && gd.lastDetail.labels && gd.lastDetail.labels.length > 48" class="es-table-note">
          共 {{ gd.lastDetail.labels.length }} 行，请下载 CSV 查看完整数据
        </p>
      </div>
    </div>
  </section>
</template>

<script>
import API from '../api'
import { gdMixin } from '../store'
import { COLUMN_CONFIG, PEAK_SERIES_CONFIG } from '../config'
import { downsample, buildResStatsRows, buildDetailRows, datePickerOptions } from '../helpers'
import {
  disposeChart,
  renderChart,
  whenChartVisible,
  peakShavingOption,
  chargeDischargeOption,
  socStorageOption
} from '../charts'
import EsTable from './EsTable.vue'

export default {
  name: 'GdResultsPanel',
  mixins: [gdMixin],
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
      columns: COLUMN_CONFIG,
      peakSeries: {
        net_load: true,
        net_with_storage: true,
        load: false,
        renewable: false,
        storage_power: false
      },
      peakChart: null,
      cdChart: null,
      socChart: null,
      loaded: false
    }
  },
  computed: {
    statsRows: function () {
      return buildResStatsRows(this.gd.powerStats)
    },
    detailRows: function () {
      return buildDetailRows(this.gd.lastDetail, 48)
    },
    chartPickerOptions: function () {
      return datePickerOptions(this.gd.dateStart, this.gd.dateEnd)
    }
  },
  watch: {
    active: function (val) {
      if (val && this.gd.analysisDone) {
        if (!this.loaded) this.loadResults()
        else this.$nextTick(this.restoreCharts)
      }
    },
    'gd.analysisDone': function (val) {
      if (val && this.active) this.loadResults()
    },
    peakSeries: {
      deep: true,
      handler: function () {
        if (this.gd.lastDetail) this.drawPeak()
      }
    }
  },
  beforeDestroy: function () {
    this.disposeAll()
  },
  methods: {
    ensureDates: function () {
      if (!this.chartStart && this.gd.dateStart) this.chartStart = this.gd.dateStart
      if (!this.chartEnd && this.gd.dateStart) this.chartEnd = this.gd.dateStart
    },
    loadResults: function () {
      const self = this
      if (!this.gd.analysisDone) {
        alert('请先运行632分析')
        return
      }
      this.ensureDates()
      API.getPowerStats().then(function (ps) {
        self.gd.powerStats = ps
        return API.getDetail(self.chartStart, self.chartEnd)
      }).then(function (d) {
        self.gd.lastDetail = d
        self.loaded = true
        self.$nextTick(self.drawCharts)
      }).catch(function (e) {
        alert(e.message)
      })
    },
    drawCharts: function () {
      this.drawPeak()
      this.drawChargeDischarge()
      this.drawSoc()
      this.resizeAll()
    },
    restoreCharts: function () {
      const self = this
      if (!this.gd.lastDetail) return
      whenChartVisible([this.$refs.peakChart, this.$refs.cdChart, this.$refs.socChart], function () {
        self.disposeAll()
        self.drawCharts()
      })
    },
    drawPeak: function () {
      const d = this.gd.lastDetail
      if (!d || !this.$refs.peakChart) return
      const N = Math.min((d.labels || []).length, 600)
      const ds = function (arr) { return downsample(arr, N) }
      const self = this
      const seriesList = []
      PEAK_SERIES_CONFIG.forEach(function (s) {
        if (self.peakSeries[s.key]) {
          seriesList.push({ name: s.name, data: ds(d[s.field]), color: s.color, width: s.width })
        }
      })
      this.peakChart = renderChart(this.$refs.peakChart, peakShavingOption(ds(d.labels), seriesList), this.peakChart)
    },
    drawChargeDischarge: function () {
      const d = this.gd.lastDetail
      if (!d || !this.$refs.cdChart) return
      const N = Math.min((d.labels || []).length, 600)
      this.cdChart = renderChart(
        this.$refs.cdChart,
        chargeDischargeOption(downsample(d.labels, N), downsample(d.storage_power, N), downsample(d.price, N)),
        this.cdChart
      )
    },
    drawSoc: function () {
      const d = this.gd.lastDetail
      if (!d || !this.$refs.socChart) return
      const N = Math.min((d.labels || []).length, 600)
      this.socChart = renderChart(
        this.$refs.socChart,
        socStorageOption(downsample(d.labels, N), downsample(d.soc, N), downsample(d.storage_power, N)),
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
    downloadFiltered: function () {
      API.downloadDetail(this.downloadStart, this.downloadEnd).catch(function (e) {
        alert(e.message || '下载失败')
      })
    },
    downloadAll: function () {
      API.downloadDetail('', '').catch(function (e) {
        alert(e.message || '下载失败')
      })
    }
  }
}
</script>
