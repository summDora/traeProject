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
    disabledDate(time) {
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

export function fmt(v, d) {
  if (d == null) d = 2
  if (v === null || v === undefined || isNaN(v)) return '-'
  return Number(v).toLocaleString('zh-CN', { minimumFractionDigits: d, maximumFractionDigits: d })
}

export function fmtPct(v, d) {
  if (d == null) d = 1
  if (v === null || v === undefined || isNaN(v)) return '-'
  return (v * 100).toFixed(d) + '%'
}

export function buildCostSummaryRows(results) {
  if (!results || results.length < 3) return []
  return COST_SUMMARY_METRICS.map((m) => {
    const cell = (s) => {
      let v = s.annual[m.key]
      if (v == null) return '-'
      if (m.kind === 'fee') v = v / 1e4
      const dec = m.kind === 'mwh' ? 1 : 2
      return fmt(v, dec)
    }
    return { metric: m.label, load: cell(results[0]), net: cell(results[1]), storage: cell(results[2]) }
  })
}

export function buildAnaCompareRows(res) {
  if (!res || !res.indicators || !res.energies) return []
  const ind = res.indicators
  const en = res.energies
  const rows = [
    ['新能源发电量 (MWh)', en.renewableGen, en.renewableGen, false],
    ['用户用电量 (MWh)', en.userEnergy, en.userEnergy, false],
    ['下网电量 (MWh)', en.downwardNet, en.downwardOpt, false],
    ['上网(倒送)电量 (MWh)', en.reverseNet, en.reverseOpt, false],
    ['自发自用电量 (MWh)', en.selfUseNet, en.selfUseOpt, false],
    ['指标6 自发自用比例', ind.r6Net, ind.r6Opt, true],
    ['指标3 自用占用电比例', ind.r3Net, ind.r3Opt, true],
    ['指标2 倒送比例', ind.r2Net, ind.r2Opt, true]
  ]
  return rows.map((r) => {
    const delta = r[2] - r[1]
    return {
      metric: r[0],
      net: r[3] ? fmtPct(r[1]) : fmt(r[1], 1),
      opt: r[3] ? fmtPct(r[2]) : fmt(r[2], 1),
      delta: r[3]
        ? ((delta >= 0 ? '+' : '') + (delta * 100).toFixed(1) + ' pp')
        : ((delta >= 0 ? '+' : '') + fmt(delta, 1)),
      _signed: delta
    }
  })
}

export function buildAnaPowerRows(ps) {
  if (!ps) return []
  return [
    { metric: '最大值', load: fmt(ps.load.max), net: fmt(ps.net.max), opt: fmt(ps.opt.max) },
    { metric: '最小值', load: fmt(ps.load.min), net: fmt(ps.net.min), opt: fmt(ps.opt.min) },
    { metric: '平均值', load: fmt(ps.load.avg), net: fmt(ps.net.avg), opt: fmt(ps.opt.avg) }
  ]
}

export function buildResStatsRows(ps) {
  if (!ps) return []
  const en = ps.energies || {}
  const ind = ps.indicators || {}
  const st = ps.storage || {}
  const D = '-'
  const cell = (v, isPct) => {
    if (v === D || v == null) return D
    return isPct ? fmtPct(v) : fmt(v)
  }
  return [
    { metric: '最大值', load: cell(ps.load.max), net: cell(ps.net.max), opt: cell(ps.opt.max) },
    { metric: '最小值', load: cell(ps.load.min), net: cell(ps.net.min), opt: cell(ps.opt.min) },
    { metric: '平均值', load: cell(ps.load.avg), net: cell(ps.net.avg), opt: cell(ps.opt.avg) },
    { metric: '用户电量 (MWh)', load: cell(en.userEnergy), net: D, opt: D, _rowClass: 'es-row-summary' },
    { metric: '下网电量 (MWh)', load: cell(en.userEnergy), net: cell(en.downwardNet), opt: cell(en.downwardOpt) },
    { metric: '新能源发电量 (MWh)', load: D, net: cell(en.renewableGen), opt: cell(en.renewableGen) },
    { metric: '上网电量 (MWh)', load: D, net: cell(en.reverseNet), opt: cell(en.reverseOpt) },
    { metric: '自发自用电量 (MWh)', load: D, net: cell(en.selfUseNet), opt: cell(en.selfUseOpt) },
    { metric: '储能损耗电量 (MWh)', load: D, net: D, opt: cell(st.loss) },
    { metric: '指标6-自发自用比例', load: D, net: cell(ind.r6Net, true), opt: cell(ind.r6Opt, true) },
    { metric: '指标3-自用占用电比例', load: D, net: cell(ind.r3Net, true), opt: cell(ind.r3Opt, true) },
    { metric: '指标2-倒送比例', load: D, net: cell(ind.r2Net, true), opt: cell(ind.r2Opt, true) }
  ]
}

export function buildDetailRows(d, maxRows) {
  if (!d || !d.labels) return []
  const n = Math.min(d.labels.length, maxRows || 48)
  const rows = []
  for (let i = 0; i < n; i++) {
    rows.push({
      time: d.labels[i],
      load: fmt(d.load[i]),
      renewable: fmt(d.renewable[i]),
      net: fmt(d.net_load[i]),
      storage: fmt(d.storage_power[i]),
      netStorage: fmt(d.net_with_storage[i]),
      soc: fmt(d.soc[i]),
      ratio: fmt(d.ratio[i], 3),
      period: d.period[i]
    })
  }
  return rows
}
