/**
 * echarts 4.9 兼容封装。
 * - echarts 5（当前 sysbase）：`import * as echarts from 'echarts'`
 * - echarts 4.9（目标项目）：改成 `import echarts from 'echarts'`，getEcharts 直接 return echarts 即可
 */
import * as echarts from 'echarts'

export function getEcharts() {
  if (echarts && typeof echarts.init === 'function') return echarts
  if (typeof window !== 'undefined' && window.echarts) return window.echarts
  throw new Error('echarts 未加载')
}

export function disposeChart(chart) {
  if (chart && typeof chart.dispose === 'function') {
    try {
      chart.dispose()
    } catch (e) {
      /* ignore */
    }
  }
}

export function renderChart(el, option, existed) {
  if (!el) return null
  const echarts = getEcharts()
  let chart = existed
  if (chart && typeof chart.isDisposed === 'function' && chart.isDisposed()) {
    chart = null
  }
  if (!chart) {
    chart = echarts.init(el)
  }
  chart.setOption(option, true)
  return chart
}

export function formatTickLabel(label) {
  if (!label) return ''
  const m = String(label).match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):/)
  if (m) return m[2] + '/' + m[3] + ' ' + m[4] + ':00'
  return String(label)
}

function axisInterval(len, maxTicks) {
  if (!len || len <= maxTicks) return 0
  return Math.ceil(len / maxTicks) - 1
}

/** 标签过多时倾斜，对齐原 Chart.js maxRotation / matplotlib autofmt_xdate */
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

export function sourceLoadOption(labels, load, renewable, net) {
  return {
    color: ['#3b82f6', '#22c55e', '#f97316'],
    tooltip: { trigger: 'axis' },
    legend: { data: ['负荷 (MW)', '新能源 (MW)', '净负荷 (MW)'], top: 0 },
    grid: chartGrid(labels, null, { maxTicks: 24 }),
    xAxis: categoryAxis(labels, { maxTicks: 24, formatter: formatTickLabel }),
    yAxis: { type: 'value', name: 'MW' },
    series: [
      {
        name: '负荷 (MW)',
        type: 'line',
        data: load,
        smooth: 0.1,
        showSymbol: false,
        areaStyle: { color: 'rgba(59,130,246,0.12)' },
      },
      {
        name: '新能源 (MW)',
        type: 'line',
        data: renewable,
        smooth: 0.1,
        showSymbol: false,
        areaStyle: { color: 'rgba(34,197,94,0.12)' },
      },
      {
        name: '净负荷 (MW)',
        type: 'line',
        data: net,
        smooth: 0.1,
        showSymbol: false,
        lineStyle: { type: 'dashed' },
      },
    ],
  }
}

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

export function costPieOption(feeLabels, values, colors) {
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
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { fontSize: 11 },
    },
    series: [
      {
        type: 'pie',
        radius: ['42%', '68%'],
        center: ['50%', '46%'],
        avoidLabelOverlap: true,
        label: {
          normal: {
            show: true,
            formatter: function (p) {
              return p.percent < 3 ? '' : p.percent.toFixed(1) + '%'
            },
            textStyle: { color: '#fff', fontSize: 11 },
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

export function econCashFlowOption(labels, totalCf, equityCf, cumTotal, cumEquity) {
  return {
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        if (!params || !params.length) return ''
        var lines = [params[0].axisValue]
        params.forEach(function (p) {
          var v = p.value == null ? '-' : Number(p.value).toLocaleString('zh-CN', { maximumFractionDigits: 0 })
          lines.push(p.seriesName + ': ' + v + ' 万元')
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
