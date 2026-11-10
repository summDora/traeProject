export const PAGE_TABS = [
  { id: 'tab-data', no: 1, label: '源荷数据' },
  { id: 'tab-632', no: 2, label: '指标分析' },
  { id: 'tab-sizing', no: 3, label: '最小储能定容' },
  { id: 'tab-results', no: 4, label: '结果展示' },
  { id: 'tab-cost', no: 5, label: '电费计算' },
  { id: 'tab-econ', no: 6, label: '经济性评价' },
  { id: 'tab-report', no: 7, label: '一键生成报告' }
]

/**
 * 经济性评价 — 按项目类型的默认单价/费率。切换类型时回填 store.econ。
 *
 * 本表键 → store.econ → 后端 EconomicEvalRequest（Java 对齐用后者）
 *   epc            → re_epc_price     → re_epc_price          万元/MW 含税
 *   om_rate        → om_rate（页面为%）→ om_rate              接口为小数
 *   overhead[电压] → overhead_price   → overhead_line_price   万元/km
 *   cable[电压]    → cable_price      → cable_price           万元/km
 *
 * project_type：onshore_wind / offshore_wind / centralized_pv / distributed_pv
 */
export const ECON_DEFAULTS = {
  onshore_wind: {
    epc: 410, // 本体EPC 万元/MW
    om_rate: 2.0, // 运维费率 %
    overhead: { '10kV': 30, '35kV': 50, '110kV': 80, '220kV': 120 }, // 架空线单价 万元/km
    cable: { '10kV': 80, '35kV': 120, '110kV': 200, '220kV': 350 } // 电缆单价 万元/km
  },
  offshore_wind: {
    epc: 950, // 本体EPC 万元/MW
    om_rate: 3.5, // 运维费率 %
    overhead: { '10kV': 30, '35kV': 50, '110kV': 80, '220kV': 120 }, // 架空线单价 万元/km
    cable: { '10kV': 100, '35kV': 180, '110kV': 300, '220kV': 500 } // 电缆单价 万元/km
  },
  centralized_pv: {
    epc: 270, // 本体EPC 万元/MW
    om_rate: 1.5, // 运维费率 %
    overhead: { '10kV': 20, '35kV': 30, '110kV': 50, '220kV': 80 }, // 架空线单价 万元/km
    cable: { '10kV': 60, '35kV': 80, '110kV': 150, '220kV': 250 } // 电缆单价 万元/km
  },
  distributed_pv: {
    epc: 300, // 本体EPC 万元/MW
    om_rate: 1.0, // 运维费率 %
    overhead: { '10kV': 15, '35kV': 25, '110kV': 40, '220kV': 70 }, // 架空线单价 万元/km
    cable: { '10kV': 50, '35kV': 70, '110kV': 130, '220kV': 220 } // 电缆单价 万元/km
  }
}

function col(prop, label, extra) {
  const item = { prop: prop, label: label, align: 'center' }
  if (extra) {
    Object.keys(extra).forEach((k) => { item[k] = extra[k] })
  }
  return item
}

export const COLUMN_CONFIG = {
  anaCompare: [
    col('metric', '统计项目', { minWidth: 160, align: 'left' }),
    col('net', '无储能(源荷)', { minWidth: 130 }),
    col('opt', '加装储能(源荷储)', { minWidth: 150 }),
    col('delta', '变化', { minWidth: 110, color: 'signedStr' })
  ],
  anaPower: [
    col('metric', '统计指标', { minWidth: 120 }),
    col('load', '调整后负荷 (MW)', { minWidth: 140 }),
    col('net', '净负荷(源荷) (MW)', { minWidth: 150 }),
    col('opt', '优化后净负荷(含储能) (MW)', { minWidth: 180 })
  ],
  szCompare: [
    col('metric', '指标', { minWidth: 160, align: 'left' }),
    col('base', '无储能', { minWidth: 120 }),
    col('ok', '达标后', { minWidth: 120 })
  ],
  resStats: [
    col('metric', '统计指标', { minWidth: 180, align: 'left' }),
    col('load', '调整后负荷 (MW)', { minWidth: 140 }),
    col('net', '净负荷(源荷) (MW)', { minWidth: 150 }),
    col('opt', '优化后净负荷(含储能) (MW)', { minWidth: 180 })
  ],
  detailPreview: [
    col('time', '时间', { minWidth: 140 }),
    col('load', '调整后负荷(MW)', { minWidth: 130 }),
    col('renewable', '调整后新能源(MW)', { minWidth: 140 }),
    col('net', '源荷净负荷(MW)', { minWidth: 130 }),
    col('storage', '储能充放电(MW)', { minWidth: 130 }),
    col('netStorage', '源荷储净负荷(MW)', { minWidth: 140 }),
    col('soc', 'SOC(MWh)', { minWidth: 100 }),
    col('ratio', '浮动比例', { minWidth: 90 }),
    col('period', '峰谷时段', { minWidth: 90 })
  ],
  costSummary: [
    col('metric', '费用项目', { minWidth: 170, align: 'left' }),
    col('load', '调整后负荷', { minWidth: 120 }),
    col('net', '源荷净负荷', { minWidth: 120 }),
    col('storage', '源荷储净负荷', { minWidth: 130 })
  ],
  costMonthly: [
    col('month_label', '月份', { minWidth: 80 }),
    col('downward_energy_mwh', '下网电量\n(MWh)', { minWidth: 100, format: 'fixed1' }),
    col('export_energy_mwh', '上网电量\n(MWh)', { minWidth: 100, format: 'fixed1' }),
    col('max_load_mw', '最大负荷\n(MW)', { minWidth: 90, format: 'fixed3' }),
    col('energy_trade_price', '电能量交易\n价格(元/MWh)', { minWidth: 120, format: 'fixed2' }),
    col('terminal_energy_fee', '终端电能\n电费(万元)', { minWidth: 110, format: 'wan' }),
    col('energy_tnd_fee', '电度输配\n电费(万元)', { minWidth: 100, format: 'wan' }),
    col('gov_fund_fee', '政府性基金\n(万元)', { minWidth: 110, format: 'wan' }),
    col('capacity_demand_fee', '容/需量\n电费(万元)', { minWidth: 100, format: 'wan' }),
    col('total_purchase_fee', '总下网\n电费(万元)', { minWidth: 100, format: 'wan' }),
    col('export_revenue', '上网收入\n(万元)', { minWidth: 100, format: 'wan' }),
    col('net_fee', '净电费\n(万元)', { minWidth: 100, format: 'wan', color: 'negGreen', weight: 'bold' })
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
        col('input_vat_deduct', '进项税\n抵扣', { minWidth: 80, format: 'dashMoney', labelClassName: 'es-cf-h-inflow' }),
        col('residual_recover', '回收\n余值', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-inflow' })
      ]
    },
    {
      label: '现金流出 (−)',
      labelClassName: 'es-cf-h-outflow',
      children: [
        col('operating_cost', '运维\n成本', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('surcharge', '附加税', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('storage_replacement', '储能\n更换', { minWidth: 72, format: 'dashMoney', color: 'replace', weight: 'bold', labelClassName: 'es-cf-h-outflow' }),
        col('income_tax', '全投资\n所得税', { minWidth: 80, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('income_tax_eq', '资本金\n所得税', { minWidth: 80, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('loan_repay', '还本\n付息', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('construction_inv', '建设\n投资', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' }),
        col('equity_input', '资本金\n投入', { minWidth: 72, format: 'dashMoney', labelClassName: 'es-cf-h-outflow' })
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
  { label: '下网电量 (MWh)', key: 'downward_energy_mwh', kind: 'mwh' },
  { label: '上网电量 (MWh)', key: 'export_energy_mwh', kind: 'mwh' },
  { label: '电能量均价 (元/MWh)', key: 'energy_avg_price_mwh', kind: 'price' },
  { label: '终端电能电费 (万元)', key: 'terminal_energy_fee', kind: 'fee' },
  { label: '电度输配电费 (万元)', key: 'energy_tnd_fee', kind: 'fee' },
  { label: '政府性基金 (万元)', key: 'gov_fund_fee', kind: 'fee' },
  { label: '容/需量电费 (万元)', key: 'capacity_demand_fee', kind: 'fee' },
  { label: '总下网电费 (万元)', key: 'total_purchase_fee', kind: 'fee' },
  { label: '上网收入 (万元)', key: 'export_revenue', kind: 'fee' },
  { label: '净电费 (万元)', key: 'net_fee', kind: 'fee' }
]

export const PEAK_SERIES_CONFIG = [
  { key: 'net_load', name: '净负荷(源荷)', color: '#f97316', width: 1.5, field: 'net_load' },
  { key: 'net_with_storage', name: '优化后净负荷(含储能)', color: '#3b82f6', width: 2, field: 'net_with_storage' },
  { key: 'load', name: '调整后负荷', color: '#9ca3af', width: 1.5, field: 'load' },
  { key: 'renewable', name: '新能源发电', color: '#22c55e', width: 1.5, field: 'renewable' },
  { key: 'storage_power', name: '储能负荷', color: '#8b5cf6', width: 1.5, field: 'storage_power' }
]

export const CF_SUM_KEYS = [
  'revenue', 'input_vat_deduct', 'residual_recover', 'operating_cost', 'surcharge',
  'storage_replacement', 'income_tax', 'income_tax_eq', 'loan_repay',
  'construction_inv', 'equity_input', 'total_cf', 'equity_cf', 'depreciation', 'interest'
]

export function buildMarketColumns(periods) {
  const cols = [col('label', '时段', { minWidth: 70, width: 70, fixed: true })]
  ;(periods || []).forEach((p, i) => {
    cols.push(col('p' + i, String(p), { minWidth: 72, format: 'fixed4' }))
  })
  return cols
}

export function buildMarketRows(prices) {
  const row = { label: '电价' }
  ;(prices || []).forEach((p, i) => {
    row['p' + i] = p
  })
  return [row]
}
