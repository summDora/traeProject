/**
 * echarts 4.9 兼容封装。
 * - echarts 5（当前 sysbase）：`import * as echarts from 'echarts'`
 * - echarts 4.9（目标项目）：改成 `import echarts from 'echarts'`，getEcharts 直接 return echarts 即可
 */
import * as echarts from 'echarts'

/** 取得可用的 echarts 实例（兼容 4.9 default 导出与 5.x namespace 导出） */
export function getEcharts() {
  if (echarts && typeof echarts.init === 'function') return echarts
  if (typeof window !== 'undefined' && window.echarts) return window.echarts
  throw new Error('echarts 未加载')
}

/** 销毁图表，避免切换页签或重绘时残留实例 */
export function disposeChart(chart) {
  if (chart && typeof chart.dispose === 'function') {
    try {
      chart.dispose()
    } catch (e) {
      /* ignore */
    }
  }
}

/** 页签从隐藏恢复后：等容器有宽高再回调，避免 echarts 按 0 尺寸排版 */
export function whenChartVisible(el, cb, tries) {
  tries = tries == null ? 16 : tries
  if (typeof cb !== 'function') return
  const list = Array.isArray(el) ? el.filter(Boolean) : (el ? [el] : [])
  if (!list.length) return
  const ready = list.every(function (node) {
    return node.clientWidth >= 8 && node.clientHeight >= 8
  })
  if (ready) {
    cb()
    return
  }
  if (tries <= 0) return
  requestAnimationFrame(function () {
    whenChartVisible(el, cb, tries - 1)
  })
}

/** 在指定 DOM 上渲染/更新 option；已有实例则复用，否则重新 init */
export function renderChart(el, option, existed) {
  if (!el) return null
  const echartsNs = getEcharts()
  let chart = existed
  if (chart && typeof chart.isDisposed === 'function' && chart.isDisposed()) {
    chart = null
  }
  if (!chart) {
    if (el.clientWidth < 8 || el.clientHeight < 8) return null
    chart = echartsNs.init(el)
  }
  chart.setOption(option, true)
  if (el.clientWidth >= 8 && el.clientHeight >= 8 && typeof chart.resize === 'function') {
    chart.resize()
  }
  return chart
}

/** 将时间标签压成短格式，如 2023-03-01 00:00:00 → 03/01 00:00 */
export function formatTickLabel(label) {
  if (!label) return ''
  const m = String(label).match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):/)
  if (m) return m[2] + '/' + m[3] + ' ' + m[4] + ':00'
  return String(label)
}

/** 计算类目轴 interval，保证可见刻度数不超过 maxTicks */
function axisInterval(len, maxTicks) {
  if (!len || len <= maxTicks) return 0
  return Math.ceil(len / maxTicks) - 1
}

/**
 * 生成类目 x 轴。
 * 标签过多时自动旋转 45°（对齐原 Chart.js maxRotation / matplotlib autofmt_xdate）
 */
export function categoryAxis(labels, opts) {
  opts = opts || {}
  const len = (labels && labels.length) || 0
  const maxTicks = opts.maxTicks || 24
  const rotateAfter = opts.rotateAfter != null ? opts.rotateAfter : 10
  const rotate = opts.rotate != null ? opts.rotate : (len > rotateAfter ? 45 : 0)
  const axisLabel = {
    interval: axisInterval(len, maxTicks),
    rotate: rotate,
    fontSize: rotate ? 10 : 12,
    margin: 8
  }
  if (opts.formatter) axisLabel.formatter = opts.formatter
  return {
    type: 'category',
    data: labels || [],
    axisLabel: axisLabel
  }
}

/** 按是否旋转 x 轴，预留底部空间，避免刻度被裁切 */
function chartGrid(labels, extra, opts) {
  opts = opts || {}
  const len = (labels && labels.length) || 0
  const rotateAfter = opts.rotateAfter != null ? opts.rotateAfter : 10
  const rotate = opts.rotate != null ? opts.rotate : (len > rotateAfter ? 45 : 0)
  return Object.assign({
    left: 56,
    right: 28,
    top: 40,
    bottom: rotate ? 28 : 16,
    containLabel: true
  }, extra || {})
}

/** 纵向面积渐变：顶部带色、底部淡出，避免两块面积叠成脏色 */
function areaFade(rgb, topAlpha) {
  return {
    type: 'linear',
    x: 0,
    y: 0,
    x2: 0,
    y2: 1,
    colorStops: [
      { offset: 0, color: 'rgba(' + rgb + ',' + topAlpha + ')' },
      { offset: 1, color: 'rgba(' + rgb + ',0.02)' }
    ]
  }
}

/** 源荷数据页：负荷 / 新能源 / 净负荷曲线 */
export function sourceLoadOption(labels, load, renewable, net) {
  const xAxis = categoryAxis(labels, { maxTicks: 18, formatter: formatTickLabel })
  xAxis.boundaryGap = false
  xAxis.axisTick = { show: false }
  xAxis.axisLine = { lineStyle: { color: '#E5E7EB' } }
  xAxis.axisLabel = Object.assign({}, xAxis.axisLabel, { color: '#64748B', fontSize: 11 })

  return {
    color: ['#0E7490', '#10B981', '#F59E0B'],
    animation: false,
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(15, 23, 42, 0.92)',
      borderWidth: 0,
      padding: [10, 12],
      textStyle: { color: '#F8FAFC', fontSize: 12 },
      axisPointer: {
        type: 'line',
        lineStyle: { color: '#94A3B8', width: 1, type: 'dashed' }
      },
      formatter: function (params) {
        if (!params || !params.length) return ''
        var lines = [params[0].axisValue]
        for (var i = 0; i < params.length; i++) {
          var p = params[i]
          var v = p.value == null ? '-' : Number(p.value).toFixed(2)
          lines.push((p.marker || '') + p.seriesName + '　<b>' + v + '</b> MW')
        }
        return lines.join('<br/>')
      }
    },
    legend: {
      data: ['负荷 (MW)', '新能源 (MW)', '净负荷 (MW)'],
      top: 2,
      icon: 'roundRect',
      itemWidth: 16,
      itemHeight: 8,
      itemGap: 22,
      textStyle: { color: '#475569', fontSize: 12 }
    },
    grid: chartGrid(labels, { left: 52, right: 20, top: 44 }, { maxTicks: 18 }),
    xAxis: xAxis,
    yAxis: {
      type: 'value',
      name: 'MW',
      nameGap: 12,
      nameTextStyle: { color: '#64748B', fontSize: 11, padding: [0, 8, 0, 0] },
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#EEF2F6', width: 1 } },
      axisLabel: { color: '#64748B', fontSize: 11 }
    },
    series: [
      {
        name: '负荷 (MW)',
        type: 'line',
        data: load,
        smooth: 0.1,
        showSymbol: false,
        z: 2,
        lineStyle: { width: 2, color: '#0E7490' },
        itemStyle: { color: '#0E7490' },
        areaStyle: { color: areaFade('14,116,144', 0.22) }
      },
      {
        name: '新能源 (MW)',
        type: 'line',
        data: renewable,
        smooth: 0.1,
        showSymbol: false,
        z: 3,
        lineStyle: { width: 2, color: '#10B981' },
        itemStyle: { color: '#10B981' },
        areaStyle: { color: areaFade('16,185,129', 0.16) }
      },
      {
        name: '净负荷 (MW)',
        type: 'line',
        data: net,
        smooth: 0.1,
        showSymbol: false,
        z: 4,
        lineStyle: { width: 2.5, color: '#F59E0B' },
        itemStyle: { color: '#F59E0B' }
      }
    ]
  }
}

/** 储能负荷柱：充电为正色、放电为负色 */
function storageBarData(values) {
  return (values || []).map(function (v) {
    return {
      value: v,
      itemStyle: {
        color: v >= 0 ? 'rgba(6,182,212,0.7)' : 'rgba(249,115,22,0.7)',
      },
    }
  })
}

/** 结果页：储能负荷柱 + 分时电价线（双 y 轴） */
export function chargeDischargeOption(labels, storageLoad, price) {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['储能负荷 (MW)', '分时电价 (元/MWh)'], top: 0 },
    grid: chartGrid(labels, { right: 56 }, { maxTicks: 30 }),
    xAxis: categoryAxis(labels, { maxTicks: 30, formatter: formatTickLabel }),
    yAxis: [
      { type: 'value', name: 'MW' },
      { type: 'value', name: '元/MWh', splitLine: { show: false } },
    ],
    series: [
      {
        name: '储能负荷 (MW)',
        type: 'bar',
        data: storageBarData(storageLoad),
        barMaxWidth: 8,
      },
      {
        name: '分时电价 (元/MWh)',
        type: 'line',
        yAxisIndex: 1,
        data: price,
        smooth: 0.1,
        showSymbol: false,
        itemStyle: { color: '#ef4444' },
        lineStyle: { type: 'dashed', color: '#ef4444' },
      },
    ],
  }
}

/** 结果页：储能负荷柱 + SOC 曲线（双 y 轴） */
export function socStorageOption(labels, storageLoad, socPct) {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: ['储能负荷 (MW)', 'SOC (%)'], top: 0 },
    grid: chartGrid(labels, { right: 52 }, { maxTicks: 30 }),
    xAxis: categoryAxis(labels, { maxTicks: 30, formatter: formatTickLabel }),
    yAxis: [
      { type: 'value', name: 'MW' },
      { type: 'value', name: 'SOC (%)', min: 0, max: 105, splitLine: { show: false } },
    ],
    series: [
      {
        name: '储能负荷 (MW)',
        type: 'bar',
        data: storageBarData(storageLoad),
        barMaxWidth: 8,
      },
      {
        name: 'SOC (%)',
        type: 'line',
        yAxisIndex: 1,
        data: socPct,
        smooth: 0.1,
        showSymbol: false,
        itemStyle: { color: '#8b5cf6' },
        areaStyle: { color: 'rgba(139,92,246,0.18)' },
      },
    ],
  }
}

/** 结果页：削峰填谷对比曲线（系列由勾选配置动态传入） */
export function peakShavingOption(labels, seriesList) {
  return {
    tooltip: { trigger: 'axis' },
    legend: { data: seriesList.map(function (s) { return s.name }), top: 0 },
    grid: chartGrid(labels, null, { maxTicks: 30 }),
    xAxis: categoryAxis(labels, { maxTicks: 30, formatter: formatTickLabel }),
    yAxis: { type: 'value', name: 'MW' },
    series: seriesList.map(function (s) {
      return {
        name: s.name,
        type: 'line',
        data: s.data,
        smooth: 0.1,
        showSymbol: false,
        itemStyle: { color: s.color },
        lineStyle: { width: s.width || 1.5, color: s.color },
      }
    }),
  }
}

/** 电费页：三条功率序列的月度净电费柱状对比 */
export function costMonthlyOption(months, seriesList) {
  return {
    color: ['#3b82f6', '#f97316', '#22c55e'],
    tooltip: { trigger: 'axis' },
    legend: { data: seriesList.map(function (s) { return s.name }), top: 0 },
    grid: chartGrid(months, { left: 60 }, { rotateAfter: 8, maxTicks: 12 }),
    xAxis: categoryAxis(months, { rotateAfter: 8, maxTicks: 12 }),
    yAxis: { type: 'value', name: '元' },
    series: seriesList.map(function (s) {
      return { name: s.name, type: 'bar', data: s.data, barMaxWidth: 18 }
    }),
  }
}

/** 电费页年度费用构成：终端电能 / 输配电 / 政府基金 / 容需量 */
export var COST_PIE_COLORS = ['#5E6AFE', '#FFB320', '#00D4D8', '#6CD623']

/** 电费页：年度费用构成环形图（echarts 4.9 用 pie + radius） */
export function costPieOption(feeLabels, values, colors) {
  colors = colors && colors.length ? colors : COST_PIE_COLORS
  const total = (values || []).reduce(function (a, b) { return a + b }, 0)
  return {
    color: colors,
    tooltip: {
      trigger: 'item',
      formatter: function (p) {
        const pct = total > 0 ? ((p.value / total) * 100).toFixed(1) : '0.0'
        return p.name + ': ' + Number(p.value).toLocaleString() + ' 元 (' + pct + '%)'
      },
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      itemGap: 10,
      textStyle: { fontSize: 11, color: '#475569' },
    },
    series: [
      {
        type: 'pie',
        radius: ['35%', '76%'],
        center: ['50%', '44%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          normal: {
            show: true,
            position: 'inside',
            formatter: function (p) {
              if (p.percent < 3) return ''
              return p.percent.toFixed(1) + '%'
            },
            textStyle: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: 'bold' },
          },
        },
        labelLine: { normal: { show: false } },
        data: feeLabels.map(function (name, i) {
          return { name: name, value: values[i] }
        }),
      },
    ],
  }
}

/** 经济性评价页：全投资/资本金年度现金流（柱）+ 累计现金流（线） */
export function econCashFlowOption(labels, totalCf, equityCf, cumTotal, cumEquity) {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (!params || !params.length) return ''
        var lines = [params[0].axisValue]
        params.forEach(function (p) {
          var v = p.value == null ? '-' : Number(p.value).toLocaleString('zh-CN', { maximumFractionDigits: 0 })
          var marker = p.marker
          if (!marker && p.color) {
            marker = '<span style="display:inline-block;margin-right:6px;border-radius:50%;width:8px;height:8px;background-color:' + p.color + '"></span>'
          }
          lines.push((marker || '') + p.seriesName + ': ' + v + ' 万元')
        })
        return lines.join('<br/>')
      },
    },
    legend: { data: ['全投资净现金流', '资本金净现金流', '累计全投资现金流', '累计资本金现金流'], top: 0 },
    grid: chartGrid(labels, { left: 60, right: 56, top: 40 }, { rotate: 45 }),
    xAxis: categoryAxis(labels, { rotate: 45, maxTicks: 24 }),
    yAxis: [
      { type: 'value', name: '年度现金流 (万元)' },
      { type: 'value', name: '累计现金流 (万元)', splitLine: { show: false } },
    ],
    series: [
      { name: '全投资净现金流', type: 'bar', data: totalCf, itemStyle: { color: 'rgba(59,130,246,0.7)' }, barMaxWidth: 16 },
      { name: '资本金净现金流', type: 'bar', data: equityCf, itemStyle: { color: 'rgba(16,185,129,0.7)' }, barMaxWidth: 16 },
      {
        name: '累计全投资现金流',
        type: 'line',
        yAxisIndex: 1,
        data: cumTotal,
        itemStyle: { color: '#1e3a5f' },
        showSymbol: true,
        symbolSize: 4,
      },
      {
        name: '累计资本金现金流',
        type: 'line',
        yAxisIndex: 1,
        data: cumEquity,
        itemStyle: { color: '#f97316' },
        showSymbol: true,
        symbolSize: 4,
      },
    ],
  }
}
