import { COST_SUMMARY_METRICS } from './config'

export function downsample(arr, n) {
  if (!arr || !arr.length) return []
  if (arr.length <= n) return arr
  const step = arr.length / n
  const result = []
  for (let i = 0; i < n; i++) {
    result.push(arr[Math.floor(i * step)])
  }
  return result
}

/** Element 日期面板：禁用 min/max 之外的日期（min/max 为 YYYY-MM-DD） */
export function datePickerOptions(minStr, maxStr) {
  return {
    disabledDate: function (time) {
      const t = time.getTime()
      if (minStr) {
        const min = new Date(String(minStr).replace(/-/g, '/') + ' 00:00:00').getTime()
        if (!isNaN(min) && t < min) return true
      }
      if (maxStr) {
        const max = new Date(String(maxStr).replace(/-/g, '/') + ' 23:59:59').getTime()
        if (!isNaN(max) && t > max) return true
      }
      return false
    }
  }
}

export function parseOrNull(v) {
  if (v == null) return null
  const s = String(v).trim()
  if (s === '' || s.toLowerCase() === 'none') return null
  const n = parseFloat(s)
  return isNaN(n) ? null : n
}

export function classifyPeakValley(price, allPrices) {
  if (!allPrices || !allPrices.length) return '—'
  let sum = 0
  for (let i = 0; i < allPrices.length; i++) sum += allPrices[i]
  const avg = sum / allPrices.length
  if (price > avg * 1.15) return '峰'
  if (price < avg * 0.85) return '谷'
  return '平'
}

export function calcArrayStats(arr) {
  if (!arr || !arr.length) return { max: 0, min: 0, avg: 0 }
  let max = -Infinity
  let min = Infinity
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i]
    if (v > max) max = v
    if (v < min) min = v
    sum += v
  }
  return { max: max, min: min, avg: sum / arr.length }
}

export function extractDateFromLabel(label) {
  if (!label) return null
  const match = String(label).match(/^(\d{4}-\d{2}-\d{2})/)
  return match ? match[1] : null
}

export function filterChartDataByDateRange(labels, arrays, startDate, endDate) {
  if (!labels || !labels.length) return null
  const indices = []
  for (let i = 0; i < labels.length; i++) {
    if (!labels[i]) continue
    const d = extractDateFromLabel(labels[i])
    if (!d) continue
    if ((!startDate || d >= startDate) && (!endDate || d <= endDate)) {
      indices.push(i)
    }
  }
  if (!indices.length) return null
  const result = { labels: indices.map(function (i) { return labels[i] }) }
  Object.keys(arrays).forEach(function (key) {
    result[key] = indices.map(function (i) { return arrays[key][i] })
  })
  return result
}

export function downloadCsv(filename, header, rows) {
  const csv = '\uFEFF' + header + '\n' + rows.join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function buildNetStats(result, optimizeParams) {
  const fmt = function (v) {
    return v == null || isNaN(v) ? '-' : Number(v).toFixed(2)
  }
  const fmtPct = function (v) {
    return v == null || isNaN(v) ? '-' : (v * 100).toFixed(1) + '%'
  }
  let loadStats = result.load_stats || {}
  let netLoadStats = result.net_load_stats || {}
  let netWithStats = result.net_with_storage_stats || {}
  if (!loadStats.max && !loadStats.min && !loadStats.avg) {
    loadStats = calcArrayStats(result.detail_load)
    netLoadStats = calcArrayStats(result.detail_net_load)
    netWithStats = calcArrayStats(result.detail_net_with_storage)
  }
  const gridMin = optimizeParams && optimizeParams.grid_power_min != null
    ? optimizeParams.grid_power_min + ' MW' : '无限制'
  const gridMax = optimizeParams && optimizeParams.grid_power_max != null
    ? optimizeParams.grid_power_max + ' MW' : '无限制'
  const dt = result.dt_hours || 0.5
  const sumArr = function (arr) {
    if (!arr || !arr.length) return 0
    let s = 0
    for (let i = 0; i < arr.length; i++) s += arr[i]
    return s
  }
  const calcReverse = function (arr) {
    if (!arr || !arr.length) return 0
    let s = 0
    for (let i = 0; i < arr.length; i++) { if (arr[i] < 0) s += -arr[i] }
    return s * dt
  }
  const calcDownward = function (arr) {
    if (!arr || !arr.length) return 0
    let s = 0
    for (let i = 0; i < arr.length; i++) { if (arr[i] > 0) s += arr[i] }
    return s * dt
  }
  const renewableGen = sumArr(result.detail_renewable) * dt
  const userEnergy = sumArr(result.detail_load) * dt
  const downwardNet = calcDownward(result.detail_net_load)
  const reverseNet = calcReverse(result.detail_net_load)
  const selfUseNet = renewableGen - reverseNet
  const downwardOpt = calcDownward(result.detail_net_with_storage)
  const reverseOpt = calcReverse(result.detail_net_with_storage)
  const selfUseOpt = renewableGen - reverseOpt
  return {
    gridMin: gridMin,
    gridMax: gridMax,
    rows: [
      { metric: '最大值', load: fmt(loadStats.max), net: fmt(netLoadStats.max), storage: fmt(netWithStats.max) },
      { metric: '最小值', load: fmt(loadStats.min), net: fmt(netLoadStats.min), storage: fmt(netWithStats.min) },
      { metric: '平均值', load: fmt(loadStats.avg), net: fmt(netLoadStats.avg), storage: fmt(netWithStats.avg) },
      { metric: '用户电量 (MWh)', load: fmt(userEnergy), net: '-', storage: '-' },
      { metric: '下网电量 (MWh)', load: fmt(userEnergy), net: fmt(downwardNet), storage: fmt(downwardOpt) },
      { metric: '新能源发电量 (MWh)', load: fmt(renewableGen), net: fmt(renewableGen), storage: fmt(renewableGen) },
      { metric: '上网电量 (MWh)', load: '-', net: fmt(reverseNet), storage: fmt(reverseOpt) },
      { metric: '自发自用电量 (MWh)', load: '-', net: fmt(selfUseNet), storage: fmt(selfUseOpt) },
      { metric: '指标6-自发自用比例', load: '-', net: fmtPct(renewableGen > 0 ? selfUseNet / renewableGen : 0), storage: fmtPct(renewableGen > 0 ? selfUseOpt / renewableGen : 0) },
      { metric: '指标3-自用占用电比例', load: '-', net: fmtPct(userEnergy > 0 ? selfUseNet / userEnergy : 0), storage: fmtPct(userEnergy > 0 ? selfUseOpt / userEnergy : 0) },
      { metric: '指标2-倒送比例', load: '-', net: fmtPct(renewableGen > 0 ? reverseNet / renewableGen : 0), storage: fmtPct(renewableGen > 0 ? reverseOpt / renewableGen : 0) }
    ]
  }
}

export function buildDetailPreview(result, basePrice) {
  if (!result || !result.detail_chart_labels || !result.detail_chart_labels.length) return null
  const allPrices = result.detail_price || []
  const price = result.detail_price[0] != null ? result.detail_price[0] : 0
  const ratio = basePrice > 0 ? (price / basePrice).toFixed(2) : '1.00'
  return {
    time: result.detail_chart_labels[0] || '',
    load: (result.detail_load[0] != null ? result.detail_load[0] : 0).toFixed(3),
    renewable: (result.detail_renewable[0] != null ? result.detail_renewable[0] : 0).toFixed(3),
    net: (result.detail_net_load[0] != null ? result.detail_net_load[0] : 0).toFixed(3),
    storage: (result.detail_storage_load[0] != null ? result.detail_storage_load[0] : 0).toFixed(3),
    netStorage: (result.detail_net_with_storage[0] != null ? result.detail_net_with_storage[0] : 0).toFixed(3),
    soc: ((result.detail_soc[0] != null ? result.detail_soc[0] : 0) * 100).toFixed(1) + '%',
    ratio: ratio,
    period: classifyPeakValley(price, allPrices),
    total: result.detail_chart_labels.length
  }
}

function formatCostValue(format, v) {
  if (v == null) return '-'
  if (format === 'wan') {
    return (v / 1e4).toLocaleString('zh-CN', { maximumFractionDigits: 2 })
  }
  if (format === 'locale') return Number(v).toLocaleString()
  return v
}

export function buildCostSummaryRows(results) {
  if (!results || results.length < 3) return []
  return COST_SUMMARY_METRICS.map(function (m) {
    if (m.type === 'avgPrice') {
      const avg = function (s) {
        const e = s.annual.downward_energy_mwh
        return e > 0 ? (s.annual.total_purchase_fee / e).toFixed(2) : '-'
      }
      return { metric: m.label, load: avg(results[0]), net: avg(results[1]), storage: avg(results[2]) }
    }
    return {
      metric: m.label,
      load: formatCostValue(m.format, results[0].annual[m.key]),
      net: formatCostValue(m.format, results[1].annual[m.key]),
      storage: formatCostValue(m.format, results[2].annual[m.key])
    }
  })
}

export function sliceOptimizeResult(result, startDate, endDate) {
  if (!result || !result.detail_chart_labels) return null
  const filtered = filterChartDataByDateRange(result.detail_chart_labels, {
    detail_load: result.detail_load,
    detail_renewable: result.detail_renewable,
    detail_price: result.detail_price,
    detail_storage_load: result.detail_storage_load,
    detail_soc: result.detail_soc,
    detail_net_load: result.detail_net_load,
    detail_net_with_storage: result.detail_net_with_storage
  }, startDate, endDate)
  if (!filtered || !filtered.labels.length) return null
  return {
    detail_chart_labels: filtered.labels,
    detail_load: filtered.detail_load,
    detail_renewable: filtered.detail_renewable,
    detail_price: filtered.detail_price,
    detail_storage_load: filtered.detail_storage_load,
    detail_soc: filtered.detail_soc,
    detail_net_load: filtered.detail_net_load,
    detail_net_with_storage: filtered.detail_net_with_storage
  }
}
