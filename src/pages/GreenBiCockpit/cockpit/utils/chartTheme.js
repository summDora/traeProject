import Highcharts from 'highcharts'
import { DESIGN_WIDTH, DESIGN_HEIGHT, dpxStr } from './designUnits'

export { DESIGN_WIDTH, DESIGN_HEIGHT }

export const FONT_DIN = '"DIN Alternate", "DIN", sans-serif'
export const AXIS_LABEL_COLOR = '#ffffffcc'
export const GRID_LINE_COLOR = 'rgba(200, 215, 228, 0.26)'
export const POLAR_GRID_LINE_COLOR = 'rgba(200, 215, 228, 0.3)'
export const AXIS_LINE_COLOR = 'rgba(200, 215, 228, 0.2)'

export function getAxisLabelFontSize(viewportWidth) {
  return dpxStr(12, viewportWidth)
}

export const CHART_COLORS = {
  cyan: '#00D4FF',
  lightCyan: '#6BDCFF',
  blue: '#3D7EFF',
  orange: '#FFB347',
  yellow: '#FFD666',
  teal: '#36CFC9',
  muted: '#8ECFFF',
  barPrimary: '#537FF1',
  barSecondary: '#55C4AE'
}

/** 国家/地区 — 折线、饼图配色 */
export const COUNTRY_CHART_COLORS = {
  中国: CHART_COLORS.cyan,
  日本: CHART_COLORS.orange,
  美国: CHART_COLORS.lightCyan,
  德国: CHART_COLORS.blue,
  韩国: CHART_COLORS.teal,
  其他: CHART_COLORS.muted,
  其它: CHART_COLORS.muted
}

/** 有效专利趋势折线 — 高对比配色（避免青色系扎堆） */
export const VALID_PATENT_TREND_COLORS = {
  中国: '#00D4FF',
  日本: '#FF9A3C',
  美国: '#FFD666',
  德国: '#A98BFF',
  韩国: '#FF6B8A'
}

/** 全球专利存量饼图 — 高对比配色 */
export const PIE_CHART_COLORS = {
  中国: '#00D4FF',
  日本: '#FF9A3C',
  美国: '#FFD666',
  德国: '#A98BFF',
  韩国: '#FF6B8A',
  世界知识产权组织: '#5CECC8',
  欧洲: '#6B9FFF',
  法国: '#FFB84D',
  英国: '#FF9A9A',
  加拿大: '#8ECFFF',
  其他: '#36CFC9',
  其它: '#36CFC9'
}

/** 申请趋势柱状图渐变（按序） */
export const APPLY_BAR_GRADIENTS = [
  { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#5CECC8'], [1, '#2A9D8F']] },
  { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#6B9FFF'], [1, '#3D6FD9']] },
  { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#FFB84D'], [1, '#E8922E']] },
  { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#A98BFF'], [1, '#7B5FD9']] },
  { linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 }, stops: [[0, '#FF9A9A'], [1, '#E86B6B']] }
]

/** 中国专利趋势折线配色 */
export const CHINA_TREND_SERIES_COLORS = {
  申请总量: CHART_COLORS.barPrimary,
  授权总量: CHART_COLORS.barSecondary
}

export function getTrendLineColor(name) {
  return VALID_PATENT_TREND_COLORS[name] || COUNTRY_CHART_COLORS[name] || CHART_COLORS.muted
}

export function getPieChartColor(name) {
  return PIE_CHART_COLORS[name] || COUNTRY_CHART_COLORS[name] || CHART_COLORS.muted
}

function colorWithAlpha(color, alpha) {
  if (!color.startsWith('#')) return color
  const hex = color.slice(1)
  const full = hex.length === 3 ? hex.split('').map(c => c + c).join('') : hex
  const num = parseInt(full, 16)
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${alpha})`
}

export function getApplyBarGradient(index, alpha = 1) {
  const gradient = APPLY_BAR_GRADIENTS[index % APPLY_BAR_GRADIENTS.length]
  if (alpha >= 1) return gradient
  return {
    linearGradient: { ...gradient.linearGradient },
    stops: gradient.stops.map(([pos, color]) => [pos, colorWithAlpha(color, alpha)])
  }
}

/** 申请趋势柱状图顶部 2px 色带颜色（取渐变顶部色） */
export function getApplyBarTopColor(index) {
  const gradient = APPLY_BAR_GRADIENTS[index % APPLY_BAR_GRADIENTS.length]
  return gradient.stops[0][1]
}

export function getChinaTrendSeriesColor(name) {
  return CHINA_TREND_SERIES_COLORS[name] || CHART_COLORS.barPrimary
}

export function getChinaTrendAreaStops(color) {
  if (color === CHART_COLORS.barPrimary) {
    return [[0, 'rgba(83,127,241,0.45)'], [1, 'rgba(83,127,241,0.12)']]
  }
  return [[0, 'rgba(85,196,174,0.45)'], [1, 'rgba(85,196,174,0.12)']]
}

/** 将接口 seriesData 规范为纯数值数组 */
export function normalizeSeriesValues(seriesData) {
  if (!Array.isArray(seriesData)) return []

  return seriesData.map(item => {
    if (typeof item === 'number') return item
    if (item && typeof item === 'object') {
      if (item.value != null) return item.value
      if (item.y != null) return item.y
    }
    return 0
  })
}

export function applyAxisLineStyles(chart) {
  if (!chart || chart.options.chart.polar) return

  chart.axes.forEach(axis => {
    if (!axis.axisLine || !axis.options.lineWidth) return

    axis.axisLine.attr({
      dashstyle: axis.coll === 'yAxis' ? 'Dash' : 'Solid',
      'stroke-width': axis.options.lineWidth
    })
  })
}

export function mergeCockpitChartOptions(options = {}) {
  const userEvents = options.chart && options.chart.events
  const userRender = userEvents && userEvents.render

  return Highcharts.merge(true, {}, options, {
    chart: {
      events: {
        render: function renderCockpitChart() {
          applyAxisLineStyles(this)
          if (userRender) userRender.call(this)
        }
      }
    }
  })
}

export function applyCockpitTheme(viewportWidth = typeof window !== 'undefined' ? window.innerWidth : DESIGN_WIDTH) {
  const axisFontSize = getAxisLabelFontSize(viewportWidth)
  const legendFontSize = dpxStr(11, viewportWidth)
  const tooltipFontSize = dpxStr(12, viewportWidth)

  Highcharts.setOptions({
    chart: {
      backgroundColor: 'transparent',
      style: { fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' }
    },
    credits: { enabled: false },
    title: { text: null },
    legend: {
      itemStyle: { color: '#A8D4FF', fontSize: legendFontSize, fontWeight: 'normal' },
      itemHoverStyle: { color: '#FFFFFF' }
    },
    xAxis: {
      labels: { style: { color: AXIS_LABEL_COLOR, fontSize: axisFontSize } },
      lineWidth: 1,
      lineColor: AXIS_LINE_COLOR,
      tickColor: AXIS_LINE_COLOR,
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: GRID_LINE_COLOR
    },
    yAxis: {
      labels: { style: { color: AXIS_LABEL_COLOR, fontSize: axisFontSize, fontFamily: FONT_DIN } },
      lineWidth: 1,
      lineColor: AXIS_LINE_COLOR,
      tickColor: AXIS_LINE_COLOR,
      gridLineWidth: 1,
      gridLineDashStyle: 'Dash',
      gridLineColor: GRID_LINE_COLOR,
      title: { text: null }
    },
    tooltip: {
      backgroundColor: 'rgba(2, 18, 48, 0.92)',
      borderColor: 'rgba(0, 212, 255, 0.4)',
      headerFormat: `<span style="font-size:${tooltipFontSize};color:#FFFFFF;font-family:${FONT_DIN}">{point.key}</span><br/>`,
      style: { color: '#FFFFFF', fontSize: tooltipFontSize, fontFamily: FONT_DIN }
    },
    plotOptions: {
      series: {
        dataLabels: {
          style: { fontFamily: FONT_DIN, textOutline: 'none' }
        }
      }
    }
  })
}

export function formatNumber(num) {
  return Number(num).toLocaleString('zh-CN')
}

/** 雷达图坐标轴长文本换行 */
export function formatRadarAxisLabel(text, fontSize) {
  const value = String(text)
  const baseStyle = `color:#ffffffcc;font-size:${fontSize};text-align:center;line-height:1.25;display:inline-block`

  if (value.length <= 7) {
    return `<span style="${baseStyle};white-space:nowrap">${value}</span>`
  }

  let splitAt = Math.ceil(value.length / 2)
  for (const ch of ['及', '与', '和', '的']) {
    const idx = value.indexOf(ch)
    if (idx > 1 && idx < value.length - 2) {
      splitAt = idx + 1
      break
    }
  }

  return `<span style="${baseStyle}">${value.slice(0, splitAt)}<br/>${value.slice(splitAt)}</span>`
}
