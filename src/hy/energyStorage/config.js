export const PAGE_TABS = [
  { id: 'tab-data', no: 1, label: '源荷数据' },
  { id: 'tab-storage', no: 2, label: '储能参数' },
  { id: 'tab-optimize', no: 3, label: '优化计算' },
  { id: 'tab-results', no: 4, label: '结果展示' },
  { id: 'tab-cost', no: 5, label: '电费计算' },
  { id: 'tab-econ', no: 6, label: '经济性评价' }
]

/**
 * 经济性评价 — 按项目类型的默认单价/费率。切换类型时回填 store.econ。
 *
 * 本表键 → store.econ → 后端 EconomicEvalRequest（Java 对齐用后者）
 *   epc                       → re_epc_price              → re_epc_price                 万元/MW 含税
 *   om                        → om_rate（页面为%）        → om_rate                      接口为小数
 *   storage_epc               → storage_epc_price         → storage_epc_price            万元/MWh 含税
 *   storage_lifespan          → storage_lifespan          → storage_lifespan             年
 *   storage_replacement_ratio → storage_replacement_ratio → storage_replacement_ratio
 *   capacity_ratio            → capacity_ratio            → capacity_ratio               容配比
 *   loan_ratio                → loan_ratio（页面为%）     → loan_ratio                   接口为小数
 *   loan_rate                 → loan_rate（页面为%）      → loan_rate                    接口为小数
 *   loan_years                → loan_years                → loan_years
 *   overhead[电压]            → overhead_price            → overhead_line_price          万元/km
 *   cable[电压]               → cable_price               → cable_price                  万元/km
 *
 * project_type：distributed_pv / centralized_pv / onshore_wind / offshore_wind
 */
export const ECON_DEFAULTS = {
  distributed_pv: {
    epc: 300, // 本体EPC 万元/MW
    om: 0.8, // 运维费率 %
    storage_epc: 100, // 储能EPC 万元/MWh
    storage_lifespan: 10, // 储能寿命 年
    storage_replacement_ratio: 0.6, // 更换成本占首次储能投资比例
    capacity_ratio: 1.2, // 容配比
    loan_ratio: 70, // 贷款比例 %
    loan_rate: 4.0, // 贷款年利率 %
    loan_years: 12, // 贷款期限 年
    overhead: { '10kV': 50, '35kV': 80, '110kV': 150, '220kV': 250 }, // 架空线单价 万元/km
    cable: { '10kV': 100, '35kV': 200, '110kV': 400, '220kV': 600 } // 电缆单价 万元/km
  },
  centralized_pv: {
    epc: 330, // 本体EPC 万元/MW
    om: 1.5, // 运维费率 %
    storage_epc: 70, // 储能EPC 万元/MWh
    storage_lifespan: 10, // 储能寿命 年
    storage_replacement_ratio: 0.7, // 更换成本占首次储能投资比例
    capacity_ratio: 1.2, // 容配比
    loan_ratio: 70, // 贷款比例 %
    loan_rate: 4.0, // 贷款年利率 %
    loan_years: 15, // 贷款期限 年
    overhead: { '10kV': 30, '35kV': 50, '110kV': 100, '220kV': 180 }, // 架空线单价 万元/km
    cable: { '10kV': 60, '35kV': 90, '110kV': 150, '220kV': 250 } // 电缆单价 万元/km
  },
  onshore_wind: {
    epc: 550, // 本体EPC 万元/MW
    om: 2.0, // 运维费率 %
    storage_epc: 90, // 储能EPC 万元/MWh
    storage_lifespan: 10, // 储能寿命 年
    storage_replacement_ratio: 0.6, // 更换成本占首次储能投资比例
    capacity_ratio: 1.0, // 容配比
    loan_ratio: 70, // 贷款比例 %
    loan_rate: 4.0, // 贷款年利率 %
    loan_years: 15, // 贷款期限 年
    overhead: { '10kV': 30, '35kV': 80, '110kV': 160, '220kV': 300 }, // 架空线单价 万元/km
    cable: { '10kV': 100, '35kV': 200, '110kV': 450, '220kV': 900 } // 电缆单价 万元/km
  },
  offshore_wind: {
    epc: 1550, // 本体EPC 万元/MW
    om: 2.5, // 运维费率 %
    storage_epc: 90, // 储能EPC 万元/MWh
    storage_lifespan: 10, // 储能寿命 年
    storage_replacement_ratio: 0.8, // 更换成本占首次储能投资比例
    capacity_ratio: 1.0, // 容配比
    loan_ratio: 80, // 贷款比例 %
    loan_rate: 3.5, // 贷款年利率 %
    loan_years: 15, // 贷款期限 年
    overhead: { '10kV': 40, '35kV': 70, '110kV': 140, '220kV': 250 }, // 架空线单价 万元/km
    cable: { '10kV': 60, '35kV': 120, '110kV': 220, '220kV': 450 } // 电缆单价 万元/km
  }
}

function col(prop, label, extra) {
  const item = { prop: prop, label: label, align: 'center' }
  if (extra) {
    Object.keys(extra).forEach(function (k) { item[k] = extra[k] })
  }
  return item
}

export const COLUMN_CONFIG = {
  dailyOptimize: [
    col('date', '日期', { minWidth: 110 }),
    col('slots', '时段', { minWidth: 70, format: 'dash' }),
    col('status', '状态', { minWidth: 80, color: 'row' }),
    col('cost_saving', '净节省(元)', { minWidth: 110, format: 'locale' }),
    col('cycle_equivalent', '循环(次)', { minWidth: 90, format: 'fixed2' }),
    col('soc_final', '终SOC', { minWidth: 80, format: 'percent' }),
    col('charge_mwh', '充电(MWh)', { minWidth: 100, format: 'fixed2' }),
    col('discharge_mwh', '放电(MWh)', { minWidth: 100, format: 'fixed2' }),
    col('badge', '验证', { minWidth: 80, color: 'row' })
  ],

  netStats: [
    col('metric', '统计指标', { minWidth: 160 }),
    col('load', '调整后负荷 (MW)', { minWidth: 140 }),
    col('net', '净负荷\n(负荷-新能源) (MW)', { minWidth: 150 }),
    col('storage', '优化后净负荷\n(含储能) (MW)', { minWidth: 150 })
  ],

  detailPreview: [
    col('time', '时间', { minWidth: 160 }),
    col('load', '调整后负荷(MW)', { minWidth: 130 }),
    col('renewable', '调整后新能源(MW)', { minWidth: 140 }),
    col('net', '源荷净负荷(MW)', { minWidth: 130 }),
    col('storage', '储能充放电(MW)', { minWidth: 130 }),
    col('netStorage', '源荷储净负荷(MW)', { minWidth: 140 }),
    col('soc', 'SOC', { minWidth: 80 }),
    col('ratio', '浮动比例', { minWidth: 90 }),
    col('period', '峰谷时段', { minWidth: 90 })
  ],

  costSummary: [
    col('metric', '费用项目', { minWidth: 160, align: 'left' }),
    col('load', '调整后负荷', { minWidth: 120 }),
    col('net', '源荷净负荷', { minWidth: 120 }),
    col('storage', '源荷储净负荷', { minWidth: 130 })
  ],

  costMonthly: [
    col('month_label', '月份', { minWidth: 80 }),
    col('downward_energy_mwh', '下网电量\n(MWh)', { minWidth: 100, format: 'locale' }),
    col('export_energy_mwh', '上网电量\n(MWh)', { minWidth: 100, format: 'locale' }),
    col('max_load_mw', '最大负荷\n(MW)', { minWidth: 90, format: 'fixed2' }),
    col('energy_trade_price', '电能量交易\n价格(元/MWh)', { minWidth: 120, format: 'locale' }),
    col('terminal_energy_fee', '终端电能\n电费(元)', { minWidth: 110, format: 'locale' }),
    col('energy_tnd_fee', '电度输配\n电费(元)', { minWidth: 100, format: 'locale' }),
    col('gov_fund_fee', '政府性基金\n(元)', { minWidth: 110, format: 'locale' }),
    col('capacity_demand_fee', '容/需量\n电费(元)', { minWidth: 100, format: 'locale' }),
    col('total_purchase_fee', '总下网\n电费(元)', { minWidth: 100, format: 'locale' }),
    col('export_revenue', '上网收入\n(元)', { minWidth: 100, format: 'locale' }),
    col('net_fee', '净电费\n(元)', { minWidth: 100, format: 'locale', color: 'negGreen', weight: 'bold' })
  ],

  econInvestment: [
    col('name', '项目', { minWidth: 120, align: 'left', color: 'mutedRow' }),
    col('amount', '金额 (万元)', { minWidth: 120 }),
    col('pct', '占比', { minWidth: 80 })
  ],

  econCashFlow: [
    col('year', '年份', { minWidth: 70, width: 70, labelClassName: 'es-cf-h-year' }),
    {
      label: '现金流入 (+)',
      labelClassName: 'es-cf-h-inflow',
      children: [
        col('revenue', '营业收入', { minWidth: 88, format: 'dashMoney', labelClassName: 'es-cf-h-inflow' }),
        col('input_tax_credit', '进项税\n抵扣', { minWidth: 80, format: 'dashMoney', labelClassName: 'es-cf-h-inflow' }),
        col('salvage_value', '回收\n余值', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-inflow' })
      ]
    },
    {
      label: '现金流出 (−)',
      labelClassName: 'es-cf-h-outflow',
      children: [
        col('operating_cost', '运维\n成本', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('surcharge_tax', '附加税', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('storage_replacement', '储能\n更换', { minWidth: 72, format: 'dashMoney', color: 'replace', weight: 'bold', labelClassName: 'es-cf-h-outflow' }),
        col('income_tax_total', '全投资\n所得税', { minWidth: 80, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('income_tax_equity', '资本金\n所得税', { minWidth: 80, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('loan_payment', '还本\n付息', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('construction_investment', '建设\n投资', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('equity_investment', '资本金\n投入', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' })
      ]
    },
    {
      label: '净现金流',
      labelClassName: 'es-cf-h-net',
      children: [
        col('total_cf', '全投资', { minWidth: 88, format: 'money', color: 'signed', weight: 'bold', labelClassName: 'es-cf-h-net' }),
        col('equity_cf', '资本金', { minWidth: 88, format: 'money', color: 'signed', weight: 'bold', labelClassName: 'es-cf-h-net' })
      ]
    },
    {
      label: '参考项·非付现',
      labelClassName: 'es-cf-h-ref',
      children: [
        col('depreciation', '折旧', { minWidth: 72, format: 'dashMoney', color: 'muted', labelClassName: 'es-cf-h-ref' }),
        col('interest', '利息', { minWidth: 72, format: 'dashMoney', color: 'muted', labelClassName: 'es-cf-h-ref' })
      ]
    }
  ]
}

export const COST_SUMMARY_METRICS = [
  { label: '下网电量 (MWh)', key: 'downward_energy_mwh', format: 'locale' },
  { label: '上网电量 (MWh)', key: 'export_energy_mwh', format: 'locale' },
  { label: '终端电能电费 (万元)', key: 'terminal_energy_fee', format: 'wan' },
  { label: '电度输配电费 (万元)', key: 'energy_tnd_fee', format: 'wan' },
  { label: '政府性基金 (万元)', key: 'gov_fund_fee', format: 'wan' },
  { label: '容/需量电费 (万元)', key: 'capacity_demand_fee', format: 'wan' },
  { label: '总下网电费 (万元)', key: 'total_purchase_fee', format: 'wan' },
  { label: '上网收入 (万元)', key: 'export_revenue', format: 'wan' },
  { label: '净电费 (万元)', key: 'net_fee', format: 'wan' },
  { label: '下网电费均价 (元/MWh)', type: 'avgPrice' }
]

export const DETAIL_CSV_FIELDS = [
  { header: '时间', get: function (r, i) { return r.detail_chart_labels[i] || '' } },
  { header: '调整后负荷(MW)', get: function (r, i) { return r.detail_load[i] != null ? r.detail_load[i].toFixed(3) : '' } },
  { header: '调整后新能源(MW)', get: function (r, i) { return r.detail_renewable[i] != null ? r.detail_renewable[i].toFixed(3) : '' } },
  { header: '源荷净负荷(MW)', get: function (r, i) { return r.detail_net_load[i] != null ? r.detail_net_load[i].toFixed(3) : '' } },
  { header: '储能充放电(MW)', get: function (r, i) { return r.detail_storage_load[i] != null ? r.detail_storage_load[i].toFixed(3) : '' } },
  { header: '源荷储净负荷(MW)', get: function (r, i) { return r.detail_net_with_storage[i] != null ? r.detail_net_with_storage[i].toFixed(3) : '' } },
  { header: 'SOC(%)', get: function (r, i) { return r.detail_soc[i] != null ? (r.detail_soc[i] * 100).toFixed(1) + '%' : '' } },
  { header: '分时电价浮动比例', get: function (r, i, base) {
    const price = r.detail_price[i] != null ? r.detail_price[i] : 0
    return base > 0 ? (price / base).toFixed(2) : '1.00'
  } },
  { header: '峰谷时段', get: function (r, i, base, allPrices, classify) {
    const price = r.detail_price[i] != null ? r.detail_price[i] : 0
    return classify(price, allPrices)
  } }
]

export const PEAK_SERIES_CONFIG = [
  { key: 'net_load', name: '源荷净负荷', color: '#9ca3af', width: 1.5, field: 'detail_net_load' },
  { key: 'net_with_storage', name: '优化后下网功率(源荷储净负荷)', color: '#22c55e', width: 2, field: 'detail_net_with_storage' },
  { key: 'load', name: '调整后负荷', color: '#3b82f6', width: 1.5, field: 'detail_load' },
  { key: 'renewable', name: '新能源发电', color: '#f59e0b', width: 1.5, field: 'detail_renewable' },
  { key: 'storage_load', name: '储能负荷', color: '#8b5cf6', width: 1.5, field: 'detail_storage_load' }
]

export const CF_SUM_KEYS = [
  'revenue', 'input_tax_credit', 'salvage_value', 'operating_cost', 'surcharge_tax',
  'storage_replacement', 'income_tax_total', 'income_tax_equity', 'loan_payment',
  'construction_investment', 'equity_investment', 'total_cf', 'equity_cf', 'depreciation', 'interest'
]

export function buildMarketColumns(periods) {
  const cols = [col('label', '时段', { minWidth: 70, width: 70, fixed: true })]
  ;(periods || []).forEach(function (p, i) {
    cols.push(col('p' + i, String(p), { minWidth: 72, format: 'fixed4' }))
  })
  return cols
}

export function buildMarketRows(prices) {
  const row = { label: '电价' }
  ;(prices || []).forEach(function (p, i) {
    row['p' + i] = p
  })
  return [row]
}
