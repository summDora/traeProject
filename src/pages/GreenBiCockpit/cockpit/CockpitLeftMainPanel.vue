<template>
  <div class="cockpit-column left-main">
    <CockpitSectionTitle title="全球态势分析对比" more />
    <div class="cockpit-column__body left-main__content">
    <!-- 上栏 278fr：936 / 372 -->
    <div class="left-main__top">
      <!-- 全球绿色能源电力领域专利 -->
      <div class="inner-block left-main__global">
        <CockpitSectionTitle sub title="全球绿色能源电力领域专利" />
        <div class="global-body">
          <CockpitWorldRankHub
            :total="total"
            :left-countries="leftCountries"
            :right-countries="rightCountries"
          />
          <div class="global-body__pie">
            <CockpitHighchartsBase :options="pieOptions" />
          </div>
        </div>
      </div>
      <!-- 折线趋势 -->
      <div class="inner-block left-main__trend">
        <CockpitSectionTitle sub title="中国和其他国家绿色有效专利变化趋势" />
        <div class="left-main__chart-wrap">
          <CockpitHighchartsBase :options="trendOptions" />
        </div>
      </div>
    </div>

    <!-- 下栏 595fr：372 / 254 / 698 -->
    <div class="left-main__bottom">
      <!-- 图表：上下 50% / 50% -->
      <div class="left-main__charts">
        <div class="inner-block chart-block chart-block--apply">
          <CockpitSectionTitle sub title="近5年绿色能源电力全球申请趋势" />
          <div class="chart-block__tabs">
            <span
              v-for="tab in applyTabs"
              :key="tab.key"
              class="chart-block__tab"
              :class="{ 'chart-block__tab--active': applyTab === tab.key }"
              @click="applyTab = tab.key"
            >{{ tab.label }}</span>
          </div>
          <div class="chart-block__chart chart-block__chart--apply">
            <CockpitHighchartsBase :options="applyTrendOptions" />
          </div>
        </div>
        <div class="inner-block chart-block chart-block--radar">
          <CockpitSectionTitle sub title="近5年全球绿色能源电力各技术分支授权量" />
          <div class="chart-block__chart chart-block__chart--radar">
            <CockpitHighchartsBase :options="radarOptions" />
          </div>
        </div>
      </div>
      <!-- 排名：189fr / 398fr -->
      <div class="left-main__rankings">
        <div class="inner-block rank-block rank-block--region">
          <CockpitSectionTitle sub title="全国绿色专利授权量区域排名" />
          <ul class="rank-list rank-list--region">
            <li v-for="item in regionRankingDisplay" :key="item.rank" class="rank-list__item">
              <span
                class="rank-list__badge"
                :class="item.rank <= 3 ? 'rank-list__badge--' + item.rank : 'rank-list__badge--default'"
              >{{ item.rank }}</span>
              <span class="rank-list__name">{{ item.name }}</span>
              <span class="rank-list__value">{{ formatNumber(item.value) }}</span>
            </li>
          </ul>
        </div>
        <div class="inner-block rank-block rank-block--grantee">
          <CockpitSectionTitle sub title="绿色专利授权权人排名" />
          <div class="rank-block__tabs">
            <span
              v-for="tab in granteeTabs"
              :key="tab.key"
              class="rank-block__tab"
              :class="{ 'rank-block__tab--active': granteeTab === tab.key }"
              @click="granteeTab = tab.key"
            >{{ tab.label }}</span>
          </div>
          <ul class="grantee-list">
            <li v-for="item in currentGranteeList" :key="item.rank" class="grantee-list__item">
              <span
                class="grantee-list__badge"
                :class="item.rank <= 3 ? 'grantee-list__badge--' + item.rank : 'grantee-list__badge--default'"
              >{{ item.rank }}</span>
              <span class="grantee-list__name">{{ item.name }}</span>
              <span class="grantee-list__value">{{ item.value }}<span class="grantee-list__unit">件</span></span>
            </li>
          </ul>
        </div>
      </div>
      <CockpitMapPlaceholder :data="mapProvinceData" />
    </div>
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
import Highcharts3D from 'highcharts/highcharts-3d'
import HighchartsMore from 'highcharts/highcharts-more'
import CockpitWorldRankHub from './CockpitWorldRankHub.vue'
import CockpitSectionTitle from './CockpitSectionTitle.vue'
import CockpitHighchartsBase from './CockpitHighchartsBase.vue'
import CockpitMapPlaceholder from './CockpitMapPlaceholder.vue'
import cockpitViewportMixin from './mixins/cockpitViewport'
import {
  formatNumber,
  FONT_DIN,
  getPieChartColor,
  getTrendLineColor,
  getApplyBarGradient,
  getApplyBarTopColor,
  normalizeSeriesValues,
  AXIS_LABEL_COLOR,
  GRID_LINE_COLOR,
  POLAR_GRID_LINE_COLOR,
  AXIS_LINE_COLOR,
  formatRadarAxisLabel
} from './utils/chartTheme'

/** 雷达图各维度数值标签位置（设计稿 px） */
const RADAR_LABEL_LAYOUT = {
  智能电网产业: { distance: 14, x: -4, y: 22 },
  太阳能产业: { distance: 16, x: 20, y: 3 },
  生物质能及其他新能源产业: { distance: 20, x: 12, y: 22 },
  风能产业: { distance: 16, x: -12, y: 22 },
  核电产业: { distance: 14, x: -20, y: 3 }
}

Highcharts3D(Highcharts)
HighchartsMore(Highcharts)

export default {
  name: 'CockpitLeftMainPanel',
  components: { CockpitSectionTitle, CockpitHighchartsBase, CockpitMapPlaceholder, CockpitWorldRankHub },
  mixins: [cockpitViewportMixin],
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      granteeTab: 'domestic',
      applyTab: 'countries',
      granteeTabs: [
        { key: 'domestic', label: '国内' },
        { key: 'global', label: '全球' }
      ],
      applyTabs: [
        { key: 'countries', label: '申请人前5国' },
        { key: 'offices', label: '申请量前5专利局' }
      ]
    }
  },
  computed: {
    axisLabelFontSize() {
      return this.ds(12)
    },
    total() {
      const stock = this.data.globalPatentStock
      return (stock && stock.total) || 0
    },
    countryStats() {
      const stock = this.data.globalPatentStock
      return (stock && stock.countryStats) || []
    },
    pieData() {
      const stock = this.data.globalPatentStock
      return (stock && stock.pieData) || []
    },
    trendYears() {
      const trend = this.data.globalValidPatentTrend
      return (trend && trend.xAxisData && trend.xAxisData.data) || []
    },
    trendSeries() {
      const trend = this.data.globalValidPatentTrend
      return (trend && trend.seriesData) || []
    },
    regionRanking() {
      const ranking = this.data.domesticRegionRanking
      return (ranking && ranking.list) || []
    },
    granteeDomestic() {
      const ranking = this.data.granteeRanking
      return (ranking && ranking.domestic) || []
    },
    granteeGlobal() {
      const ranking = this.data.granteeRanking
      return (ranking && ranking.global) || []
    },
    applyTrendCountries() {
      const applyTrend = this.data.globalApplyTrend
      const block = (applyTrend && applyTrend.countries) || {}
      return {
        categories: block.categories || [],
        data: normalizeSeriesValues(block.seriesData)
      }
    },
    applyTrendOffices() {
      const applyTrend = this.data.globalApplyTrend
      const block = (applyTrend && applyTrend.offices) || {}
      return {
        categories: block.categories || [],
        data: normalizeSeriesValues(block.seriesData)
      }
    },
    radarCategories() {
      const radar = this.data.globalTechRadar
      return (radar && radar.categories) || []
    },
    radarData() {
      const radar = this.data.globalTechRadar
      const series = radar && radar.seriesData
      const firstSeries = series && series[0]
      return (firstSeries && firstSeries.data) || []
    },
    mapProvinceData() {
      return this.data.mapProvinceData || []
    },
    leftCountries() {
      const names = ['中国', '日本', '美国']
      return names.map(name => this.countryStats.find(item => item.name === name)).filter(Boolean)
    },
    rightCountries() {
      const names = ['德国', '韩国', '其它']
      return names.map(name => this.countryStats.find(item => item.name === name)).filter(Boolean)
    },
    currentGranteeList() {
      const list = this.granteeTab === 'domestic' ? this.granteeDomestic : this.granteeGlobal
      return list.slice(0, 10)
    },
    regionRankingDisplay() {
      return this.regionRanking.slice(0, 5)
    },
    currentApplyData() {
      return this.applyTab === 'countries' ? this.applyTrendCountries : this.applyTrendOffices
    },
    pieOptions() {
      const ds = n => this.ds(n)
      return {
        chart: { type: 'pie', options3d: { enabled: true, alpha: 50, beta: 0 }, margin: [0, 0, 0, 0] },
        plotOptions: {
          pie: {
            innerSize: '55%', depth: 35, size: '92%', center: ['50%', '52%'],
            dataLabels: {
              enabled: true, distance: this.d(14), connectorColor: 'rgba(0,212,255,0.25)',
              format: `<span style="color:#A8D4FF;font-size:${ds(10)};">{point.name}</span><br/>` +
                `<span style="color:#00D4FF;font-size:${ds(11)};font-weight:600;font-family:${FONT_DIN}">{point.y}%</span>`,
              style: { textOutline: 'none', fontFamily: FONT_DIN }
            }
          }
        },
        tooltip: { pointFormat: '<b>{point.y}%</b> ({point.value:,.0f})' },
        series: [{
          name: '占比',
          data: this.pieData.map(d => ({
            name: d.name,
            y: d.y,
            value: d.value,
            color: getPieChartColor(d.name)
          }))
        }]
      }
    },
    trendOptions() {
      return {
        chart: { type: 'spline', marginTop: this.d(8), marginBottom: this.d(72) },
        xAxis: {
          categories: this.trendYears,
          tickmarkPlacement: 'between',
          startOnTick: false,
          endOnTick: false,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR
        },
        yAxis: {
          min: 0,
          max: 40,
          tickInterval: 10,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR,
          labels: { format: '{value}万', style: { color: AXIS_LABEL_COLOR, fontSize: this.axisLabelFontSize, fontFamily: FONT_DIN } }
        },
        legend: {
          align: 'center',
          verticalAlign: 'bottom',
          margin: this.d(32),
          itemDistance: this.d(8),
          symbolWidth: this.d(8),
          symbolHeight: this.d(8)
        },
        plotOptions: { spline: { lineWidth: this.d(2), marker: { enabled: false } } },
        series: this.trendSeries.map(s => {
          const color = getTrendLineColor(s.name)
          return {
            name: s.name,
            color,
            data: s.data,
            shadow: {
              color,
              width: this.d(8),
              opacity: 0.12,
              offsetX: 0,
              offsetY: this.d(3)
            }
          }
        })
      }
    },
    applyTrendOptions() {
      const data = this.currentApplyData
      const maxY = 2000000
      const items = data.data
      const d = n => this.d(n)
      const ds = n => this.ds(n)
      const stripH = d(2)
      const axisFontSize = this.axisLabelFontSize

      return {
        chart: {
          type: 'column',
          marginTop: d(24),
          marginBottom: d(36),
          marginLeft: d(44),
          marginRight: d(8),
          backgroundColor: 'transparent',
          events: {
            render() {
              const chart = this
              const dataSeries = chart.series.find(s => s.name === '申请量')
              if (!dataSeries) return

              if (!chart._applyBarTopStrips) chart._applyBarTopStrips = []
              chart._applyBarTopStrips.forEach(el => el.destroy())
              chart._applyBarTopStrips = []

              dataSeries.points.forEach((point, index) => {
                if (!point.shapeArgs || !point.y) return
                const { x, y, width } = point.shapeArgs
                const strip = chart.renderer
                  .rect(x, y - stripH, width, stripH)
                  .attr({
                    fill: getApplyBarTopColor(index),
                    zIndex: 6
                  })
                  .add(dataSeries.group)
                chart._applyBarTopStrips.push(strip)
              })
            }
          }
        },
        xAxis: {
          categories: data.categories,
          lineWidth: 1,
          lineColor: AXIS_LINE_COLOR,
          tickLength: 0,
          gridLineWidth: 0,
          labels: {
            style: { color: AXIS_LABEL_COLOR, fontSize: axisFontSize },
            rotation: 0,
            autoRotation: false,
            useHTML: true,
            formatter() {
              const text = String(this.value)
              if (text.length <= 5) return text
              const mid = Math.ceil(text.length / 2)
              return `${text.slice(0, mid)}<br/>${text.slice(mid)}`
            }
          }
        },
        yAxis: {
          min: 0,
          max: maxY,
          tickInterval: 1000000,
          gridLineWidth: 1,
          gridLineDashStyle: 'Dash',
          gridLineColor: GRID_LINE_COLOR,
          title: { text: null },
          labels: {
            style: { color: AXIS_LABEL_COLOR, fontSize: axisFontSize, fontFamily: FONT_DIN },
            formatter() {
              return (this.value / 10000) + '万'
            }
          }
        },
        tooltip: {
          formatter() {
            return `<b>${this.x}</b><br/>${this.y.toLocaleString('zh-CN')}`
          }
        },
        legend: { enabled: false },
        plotOptions: {
          column: {
            borderWidth: 0,
            borderRadius: 1,
            grouping: false,
            shadow: false,
            dataLabels: {
              enabled: true,
              crop: false,
              overflow: 'none',
              y: d(-4),
              format: '{y:,.0f}',
              style: { color: '#FFFFFF', fontSize: ds(10), textOutline: 'none', fontWeight: 'normal', fontFamily: FONT_DIN }
            }
          },
          series: { states: { hover: { brightness: 0.08 } } }
        },
        series: [
          {
            name: '背景',
            data: items.map(() => maxY),
            color: 'rgba(20, 60, 110, 0.45)',
            pointWidth: d(40),
            enableMouseTracking: false,
            dataLabels: { enabled: false },
            zIndex: 0
          },
          {
            name: '申请量',
            data: items.map((y, index) => ({
              y,
              color: getApplyBarGradient(index, 0.68)
            })),
            pointWidth: d(22),
            zIndex: 1
          }
        ]
      }
    },
    radarOptions() {
      const values = this.radarData
      const dataMax = values.length ? Math.max(...values) : 0
      const maxVal = dataMax > 0 ? Math.ceil(dataMax / 10000) * 10000 : 10000
      const ringCount = 5
      const ringStep = maxVal / ringCount
      const gridLineColor = POLAR_GRID_LINE_COLOR
      const plotBands = Array.from({ length: ringCount }, (_, i) => ({
        from: ringStep * i,
        to: ringStep * (i + 1),
        color: i % 2 === 0 ? 'rgba(200, 215, 228, 0.1)' : 'transparent'
      }))
      const d = n => this.d(n)
      const ds = n => this.ds(n)
      const axisFontSize = this.axisLabelFontSize

      return {
        chart: {
          polar: true,
          type: 'line',
          margin: [d(10), d(16), d(10), d(16)],
          backgroundColor: 'transparent',
          spacing: [d(4), d(4), d(4), d(4)]
        },
        pane: {
          size: '80%',
          startAngle: 0,
          endAngle: 360,
          background: [{
            backgroundColor: 'transparent',
            borderWidth: 0
          }]
        },
        xAxis: {
          categories: this.radarCategories,
          tickmarkPlacement: 'on',
          lineWidth: 0,
          gridLineWidth: 1,
          gridLineDashStyle: 'Solid',
          gridLineColor,
          labels: {
            useHTML: true,
            distance: d(12),
            formatter: function formatRadarLabel() {
              return formatRadarAxisLabel(this.value, axisFontSize)
            }
          }
        },
        yAxis: {
          gridLineInterpolation: 'polygon',
          min: 0,
          max: maxVal,
          tickInterval: ringStep,
          labels: { enabled: false },
          gridLineWidth: 1,
          gridLineDashStyle: 'Solid',
          gridLineColor,
          lineWidth: 0,
          plotBands
        },
        legend: { enabled: false },
        plotOptions: {
          series: {
            connectEnds: true
          },
          line: {
            lineWidth: d(2),
            lineColor: '#537FF1',
            marker: {
              enabled: true,
              radius: d(3),
              fillColor: '#537FF1',
              lineColor: '#fff',
              lineWidth: 1
            }
          },
          area: {
            dataLabels: {
              enabled: true,
              useHTML: true,
              allowOverlap: true,
              crop: false,
              overflow: 'none',
              formatter() {
                const wan = (this.y / 10000).toFixed(2)
                return `<span style="color:#ffffffcc;font-size:${ds(10)};font-family:${FONT_DIN};white-space:nowrap">${wan}万</span>`
              }
            }
          }
        },
        series: [{
          type: 'area',
          name: '授权量',
          color: '#537FF1',
          lineColor: '#537FF1',
          connectEnds: true,
          pointPlacement: 'on',
          data: this.radarCategories.map((category, index) => {
            const y = values[index] || 0
            const custom = RADAR_LABEL_LAYOUT[category] || {}
            const defaultDistance = Math.max(d(12), (0.9 - y / maxVal) * d(72))

            return {
              y,
              dataLabels: {
                distance: custom.distance != null ? d(custom.distance) : defaultDistance,
                x: custom.x != null ? d(custom.x) : 0,
                y: custom.y != null ? d(custom.y) : 0
              }
            }
          }),
          fillColor: 'rgba(83, 127, 241, 0.6)',
          fillOpacity: 1
        }]
      }
    }
  },
  methods: { formatNumber }
}
</script>

<style scoped lang="scss">
@import './styles/left-main-panel.scss';
</style>
