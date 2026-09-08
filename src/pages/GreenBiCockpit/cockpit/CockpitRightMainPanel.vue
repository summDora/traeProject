<template>
  <div class="cockpit-column right-main">
    <CockpitSectionTitle title="中国绿色能源电力专利数据分析" more />
    <div class="cockpit-column__body right-main__body">
      <!-- 307fr：总量和占比 -->
      <div class="inner-block right-main__section right-main__section--summary">
        <CockpitSectionTitle sub title="总量和占比" />
        <div class="summary-cards">
          <div class="summary-cards__card">
            <img class="summary-cards__icon" src="@/bi/asset/images/cockpit/patentapply.png" alt="">
            <div class="summary-cards__content">
              <div class="summary-cards__label">近5年全国申请专利总数</div>
              <div class="summary-cards__value-row">
                <span class="summary-cards__value summary-cards__value--apply">{{ summary.applyTotal }}</span>
                <span class="summary-cards__unit">件</span>
              </div>
            </div>
          </div>
          <div class="summary-cards__card">
            <img class="summary-cards__icon" src="@/bi/asset/images/cockpit/patentshouquan.png" alt="">
            <div class="summary-cards__content">
              <div class="summary-cards__label">近5年全国授权专利总数</div>
              <div class="summary-cards__value-row">
                <span class="summary-cards__value summary-cards__value--grant">{{ summary.grantTotal }}</span>
                <span class="summary-cards__unit">件</span>
              </div>
            </div>
          </div>
        </div>
        <div class="summary-chart">
          <CockpitHighchartsBase :options="trendOptions" />
        </div>
      </div>
      <!-- 332fr：TOP50 排名 -->
      <div class="inner-block right-main__section right-main__section--top50">
        <CockpitSectionTitle sub title="创新主体专利申请专利权人排名（TOP50）" />
        <div class="top50-cols">
          <ul class="top50-col">
            <li v-for="item in top50Odd" :key="item.rank" class="top50-col__item">
              <span
                class="top50-col__badge"
                :class="item.rank <= 3 ? 'top50-col__badge--' + item.rank : 'top50-col__badge--default'"
              >{{ item.rank }}</span>
              <span class="top50-col__name">{{ item.name }}</span>
              <span class="top50-col__value">{{ formatNumber(item.value) }}</span>
            </li>
          </ul>
          <ul class="top50-col">
            <li v-for="item in top50Even" :key="item.rank" class="top50-col__item">
              <span
                class="top50-col__badge"
                :class="item.rank <= 3 ? 'top50-col__badge--' + item.rank : 'top50-col__badge--default'"
              >{{ item.rank }}</span>
              <span class="top50-col__name">{{ item.name }}</span>
              <span class="top50-col__value">{{ formatNumber(item.value) }}</span>
            </li>
          </ul>
        </div>
      </div>
      <!-- 245fr：技术领域分布 -->
      <div class="inner-block right-main__section right-main__section--tech">
        <CockpitSectionTitle sub title="技术领域授权专利分布" />
        <div class="tech-chart">
          <CockpitHighchartsBase :options="barOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CockpitSectionTitle from './CockpitSectionTitle.vue'
import CockpitHighchartsBase from './CockpitHighchartsBase.vue'
import cockpitViewportMixin from './mixins/cockpitViewport'
import { formatNumber, FONT_DIN, AXIS_LABEL_COLOR, GRID_LINE_COLOR, AXIS_LINE_COLOR, getChinaTrendSeriesColor, getChinaTrendAreaStops } from './utils/chartTheme'

export default {
  name: 'CockpitRightMainPanel',
  components: { CockpitSectionTitle, CockpitHighchartsBase },
  mixins: [cockpitViewportMixin],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    axisLabelFontSize() {
      return this.ds(12)
    },
    summary() {
      return this.data.chinaPatentSummary || {}
    },
    trendYears() {
      const trend = this.data.chinaPatentTrend
      return (trend && trend.xAxisData && trend.xAxisData.data) || []
    },
    trendSeries() {
      const trend = this.data.chinaPatentTrend
      return (trend && trend.seriesData) || []
    },
    top50List() {
      const ranking = this.data.chinaTop50Ranking
      return (ranking && ranking.list) || []
    },
    techFieldData() {
      const block = this.data.chinaTechFieldDistribution || {}
      const yAxisData = block.yAxisData
      const seriesData = block.seriesData
      const names = (yAxisData && yAxisData.data) || []
      const firstSeries = seriesData && seriesData[0]
      const values = (firstSeries && firstSeries.data) || []
      return names.map((name, index) => ({
        name,
        value: values[index] || 0
      }))
    },
    top50Odd() {
      return this.top50List.filter(item => item.rank % 2 === 1).slice(0, 6)
    },
    top50Even() {
      return this.top50List.filter(item => item.rank % 2 === 0).slice(0, 6)
    },
    trendOptions() {
      const d = n => this.d(n)
      return {
        chart: { type: 'areaspline', marginTop: d(22), marginBottom: d(48) },
        xAxis: {
          categories: this.trendYears,
          tickmarkPlacement: 'on',
          lineWidth: 1,
          lineColor: AXIS_LINE_COLOR,
          tickLength: 0,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR,
          labels: {
            align: 'center',
            style: { color: AXIS_LABEL_COLOR, fontSize: this.axisLabelFontSize },
            y: d(16)
          }
        },
        yAxis: {
          min: 0,
          max: 500000,
          tickInterval: 250000,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR,
          labels: { formatter() { return (this.value / 10000) + '万' }, style: { color: AXIS_LABEL_COLOR, fontSize: this.axisLabelFontSize, fontFamily: FONT_DIN } }
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
          y: d(-4),
          itemDistance: d(32),
          symbolWidth: d(18),
          symbolHeight: d(10),
          itemStyle: { color: '#C8E6FF', fontSize: this.ds(11), fontWeight: 'normal' },
          itemHoverStyle: { color: '#FFFFFF' }
        },
        plotOptions: {
          areaspline: {
            fillOpacity: 1,
            lineWidth: d(2),
            legendSymbol: 'lineMarker',
            marker: {
              enabled: true,
              radius: d(4),
              symbol: 'circle',
              fillColor: '#10224D',
              lineWidth: d(2),
              lineColor: null
            }
          }
        },
        series: this.trendSeries.map(item => {
          const color = getChinaTrendSeriesColor(item.name)
          return {
            name: item.name,
            color,
            data: item.data,
            marker: {
              fillColor: '#10224D',
              lineColor: color,
              lineWidth: d(2)
            },
            fillColor: {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
              stops: getChinaTrendAreaStops(color)
            }
          }
        })
      }
    },
    barOptions() {
      const categories = this.techFieldData.map(d => d.name)
      const values = this.techFieldData.map(d => d.value)
      const barColor = '#537FF1'
      const maxLabelLen = Math.max(...categories.map(name => name.length))
      const axisMax = 400000
      const d = n => this.d(n)

      return {
        chart: {
          type: 'bar',
          marginLeft: Math.max(d(148), maxLabelLen * d(11) + d(16)),
          marginRight: d(64),
          marginTop: d(22),
          marginBottom: d(8),
          spacingTop: d(4)
        },
        xAxis: {
          categories,
          reversed: true,
          labels: {
            style: { color: AXIS_LABEL_COLOR, fontSize: this.axisLabelFontSize },
            align: 'right',
            x: d(-14),
            reserveSpace: true
          },
          lineWidth: 0,
          tickWidth: 0,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR
        },
        yAxis: {
          min: 0,
          max: axisMax,
          tickInterval: 100000,
          opposite: true,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR,
          labels: {
            formatter() {
              return this.value === 0 ? '0' : (this.value / 10000) + '万'
            },
            style: { color: AXIS_LABEL_COLOR, fontSize: this.axisLabelFontSize, fontFamily: FONT_DIN },
            x: d(10)
          },
          lineColor: AXIS_LINE_COLOR,
          tickColor: AXIS_LINE_COLOR,
          title: { text: null }
        },
        legend: { enabled: false },
        plotOptions: {
          bar: {
            borderWidth: 0,
            borderRadius: 1,
            grouping: false,
            pointPadding: 0.14,
            groupPadding: 0.1,
            dataLabels: {
              enabled: true,
              align: 'right',
              format: '{y:.0f}',
              style: { color: '#FFFFFF', fontSize: this.ds(10), textOutline: 'none', fontFamily: FONT_DIN },
              x: d(6)
            }
          },
          series: { states: { hover: { brightness: 0.08 } } }
        },
        series: [
          {
            name: '背景',
            data: values.map(() => axisMax),
            color: 'rgba(130, 140, 150, 0.22)',
            enableMouseTracking: false,
            dataLabels: { enabled: false },
            zIndex: 0
          },
          {
            name: '授权量',
            data: values,
            color: barColor,
            zIndex: 1
          }
        ]
      }
    }
  },
  methods: { formatNumber }
}
</script>

<style scoped lang="scss">
@import './styles/right-main-panel.scss';
</style>
