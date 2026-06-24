const reportTypeOptions = [
  { key: '', value: '全部' },
  { key: '批次统计', value: '批次统计' },
  { key: '流程统计', value: '流程统计' },
  { key: '单位统计', value: '单位统计' },
  { key: '综合统计', value: '综合统计' }
];

const statPeriodOptions = [
  { key: '', value: '全部' },
  { key: '年度', value: '年度' },
  { key: '季度', value: '季度' },
  { key: '月度', value: '月度' }
];

const reportStatusOptions = [
  { key: '', value: '全部' },
  { key: '已生成', value: '已生成' },
  { key: '生成中', value: '生成中' },
  { key: '待刷新', value: '待刷新' },
  { key: '已失效', value: '已失效' }
];

const batchOptions = [
  { key: '', value: '全部', batchName: '全部', planYear: '' },
  { key: 'B2026-01', value: '2026综合计划数字化第一批次', batchName: '2026综合计划数字化第一批次', planYear: 2026 },
  { key: 'B2025-01', value: '2025综合计划补增批次', batchName: '2025综合计划补增批次', planYear: 2025 },
  { key: 'B2023-01', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2023 }
];

const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const flowStatusOptions = [
  { key: '', value: '全部' },
  { key: '申报', value: '申报' },
  { key: '审查', value: '审查' },
  { key: '评审', value: '评审' },
  { key: '统筹', value: '统筹' },
  { key: '收口', value: '收口' },
  { key: '储备', value: '储备' }
];

const unitOptions = [
  { key: '', value: '全部' },
  { key: 'U001', value: '设备部' },
  { key: 'U002', value: '数字化部' },
  { key: 'U003', value: '浙江电力交易中心' },
  { key: 'U004', value: '营销部' }
];

const statDimensionTabs = [
  { key: 'unit', label: '需求提报单位（部门）' },
  { key: 'major', label: '专业大类' },
  { key: 'guide', label: '需求指南' },
  { key: 'tag', label: '需求标签' }
];

const statFieldGroups = [
  {
    key: 'beforeReview',
    label: '评审前',
    fields: [
      { key: 'reviewCount', label: '评审个数' },
      { key: 'declareCost', label: '申报预估费用（万元）' }
    ]
  },
  {
    key: 'afterReview',
    label: '评审后',
    fields: [
      { key: 'approveCount', label: '同意个数(个)' },
      { key: 'cancelCount', label: '取消数量（个）' },
      { key: 'mergedCount', label: '被合并数量（个）' },
      { key: 'deferCount', label: '暂缓数量（个）' },
      { key: 'pendingCount', label: '待定数量（个）' },
      { key: 'splitCount', label: '拆分数量（个）' },
      { key: 'passedReviewCost', label: '通过评审费用' },
      { key: 'feasibilityCount', label: '进入可研个数（个）' },
      { key: 'feasibilityCost', label: '进入可研费用（万元）' },
      { key: 'reserveCount', label: '储备个数（个）' },
      { key: 'closingCount', label: '收口数量（个）' }
    ]
  },
  {
    key: 'regular',
    label: '常规字段',
    fields: [
      { key: 'majorDistribution', label: '需求主要分布专业' }
    ]
  }
];

const defaultSelectedStatFields = [
  'reviewCount',
  'declareCost',
  'approveCount',
  'cancelCount',
  'mergedCount',
  'deferCount',
  'pendingCount',
  'splitCount',
  'passedReviewCost',
  'feasibilityCount',
  'feasibilityCost',
  'reserveCount',
  'closingCount'
];

const statMetricColumns = {
  submitCount: { key: 'submitCount', label: '提报数量', width: 100 },
  reviewRejectCount: { key: 'reviewRejectCount', label: '专业管理部门审查不通过数量', width: 200 },
  collectCount: { key: 'collectCount', label: '收集数量', width: 100 },
  approveCount: { key: 'approveCount', label: '同意数量', width: 100 },
  cancelCount: { key: 'cancelCount', label: '取消数量', width: 100 },
  mergedCount: { key: 'mergedCount', label: '被合并数量', width: 110 },
  deferCount: { key: 'deferCount', label: '暂缓数量', width: 100 },
  pendingCount: { key: 'pendingCount', label: '待定数量', width: 100 },
  splitCount: { key: 'splitCount', label: '拆分出数量', width: 110 },
  declareCost: { key: 'declareCost', label: '申报预估费用（亿元）', width: 160 },
  reviewCount: { key: 'reviewCount', label: '评审数量', width: 100 },
  passedReviewCost: { key: 'passedReviewCost', label: '通过评审费用（亿元）', width: 160 },
  feasibilityCount: { key: 'feasibilityCount', label: '进入可研个数（个）', width: 140 },
  feasibilityCost: { key: 'feasibilityCost', label: '进入可研费用（万元）', width: 150 },
  reserveCount: { key: 'reserveCount', label: '储备个数（个）', width: 120 },
  closingCount: { key: 'closingCount', label: '收口数量（个）', width: 120 },
  majorDistribution: { key: 'majorDistribution', label: '需求主要分布专业', width: 160 }
};

const dimensionLabels = {
  unit: '需求提报单位（部门）',
  major: '专业大类',
  guide: '需求指南',
  tag: '需求标签'
};

const dimensionRowMap = {
  unit: ['综合计划数字化', '预储备', '26年综合计划', '设备部', '数字化部', '营销部'],
  major: ['电网数字化', '数据工程', '信息安全', '基础设施', '应用开发'],
  guide: ['保供减碳', '安全生产', '营销服务', '设备运维', '管理提升'],
  tag: ['重点需求', '数字化专项', '创新试点', '安全合规', '保供减碳']
};

function buildReportList() {
  const types = reportTypeOptions.filter((item) => item.key);
  const periods = statPeriodOptions.filter((item) => item.key);
  const statuses = ['已生成', '生成中', '待刷新', '已失效'];
  const scopes = ['按批次统计', '按单位统计', '按流程统计', '按专业统计', '综合统计'];
  const updaters = ['张三', '李四', '王五', '赵六'];
  const list = [];
  const baseDate = new Date('2026-03-15');

  for (let i = 1; i <= 36; i += 1) {
    const updateDate = new Date(baseDate);
    updateDate.setDate(baseDate.getDate() - i);
    list.push({
      id: `RP${1000 + i}`,
      demandId: `CB${1000 + i}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      reportName: `需求${types[i % types.length].value}报表${i}`,
      reportType: types[i % types.length].key,
      statScope: scopes[i % scopes.length],
      statYear: 2026 - (i % 3),
      statPeriod: periods[i % periods.length].key,
      generateTime: `${updateDate.getFullYear()}-${String(updateDate.getMonth() + 1).padStart(2, '0')}-${String(updateDate.getDate()).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:30:00`,
      updateTime: updateDate.toISOString(),
      updater: updaters[i % updaters.length],
      reportStatus: statuses[i % statuses.length]
    });
  }
  return list;
}

const allReportList = buildReportList();

function sortReportList(list) {
  return list.slice().sort((a, b) => new Date(b.updateTime) - new Date(a.updateTime));
}

function filterReportList(searchObj, source = allReportList) {
  let list = source.slice();

  if (searchObj.reportName) {
    list = list.filter((item) => item.reportName.includes(searchObj.reportName.trim()));
  }
  if (searchObj.reportType) {
    list = list.filter((item) => item.reportType === searchObj.reportType);
  }
  if (searchObj.statYear) {
    list = list.filter((item) => String(item.statYear) === String(searchObj.statYear));
  }
  if (searchObj.statPeriod) {
    list = list.filter((item) => item.statPeriod === searchObj.statPeriod);
  }
  if (searchObj.reportStatus) {
    list = list.filter((item) => item.reportStatus === searchObj.reportStatus);
  }

  return sortReportList(list);
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function refreshReportStats(reportIds) {
  const now = new Date();
  const timeText = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
  allReportList.forEach((item) => {
    if (reportIds.includes(item.id)) {
      item.generateTime = timeText;
      item.updateTime = now.toISOString();
      item.reportStatus = '已生成';
    }
  });
}

function buildStatRow(label, index) {
  const factor = index + 1;
  return {
    id: `ST${index}`,
    dimensionLabel: label,
    submitCount: 10 + factor * 3,
    reviewRejectCount: index % 3,
    collectCount: 8 + factor * 3,
    approveCount: 6 + factor * 2,
    cancelCount: index % 2,
    mergedCount: index % 4,
    deferCount: index % 3,
    pendingCount: index % 2,
    splitCount: index % 3,
    declareCost: (0.8 + factor * 0.35).toFixed(2),
    reviewCount: 7 + factor * 2,
    passedReviewCost: (0.6 + factor * 0.28).toFixed(2),
    feasibilityCount: 4 + factor,
    feasibilityCost: (120 + factor * 45).toFixed(2),
    reserveCount: 3 + factor,
    closingCount: 2 + factor,
    majorDistribution: ['电网数字化', '数据工程', '信息安全'][index % 3]
  };
}

function buildStatisticsData(dimension, searchObj = {}) {
  const labels = dimensionRowMap[dimension] || dimensionRowMap.unit;
  let rows = labels.map((label, index) => buildStatRow(label, index));

  if (searchObj.projectType) {
    rows = rows.filter((_, index) => index % 2 === 0);
  }
  if (searchObj.demandUnitCode) {
    rows = rows.slice(0, 4);
  }
  if (searchObj.flowStatus) {
    rows = rows.map((row) => ({
      ...row,
      submitCount: Math.max(1, row.submitCount - 2)
    }));
  }

  return rows;
}

function sumNumericField(rows, key) {
  return rows.reduce((sum, row) => {
    const val = Number(row[key]);
    return sum + (Number.isNaN(val) ? 0 : val);
  }, 0);
}

function buildSummaryRow(rows, selectedFields) {
  const summary = {
    _isSummary: true,
    dimensionLabel: '合计'
  };

  selectedFields.forEach((key) => {
    const col = statMetricColumns[key];
    if (!col) return;
    if (key === 'majorDistribution') {
      summary[key] = '—';
      return;
    }
    const total = sumNumericField(rows, key);
    summary[key] = key.includes('Cost') && !key.includes('feasibilityCost')
      ? total.toFixed(2)
      : total;
  });

  ['submitCount', 'reviewRejectCount', 'collectCount'].forEach((key) => {
    if (summary[key] === undefined) {
      summary[key] = sumNumericField(rows, key);
    }
  });

  return summary;
}

function getReportDetail(reportId) {
  return allReportList.find((item) => item.id === reportId) || allReportList[0];
}

export {
  reportTypeOptions,
  statPeriodOptions,
  reportStatusOptions,
  batchOptions,
  projectTypeOptions,
  flowStatusOptions,
  unitOptions,
  statDimensionTabs,
  statFieldGroups,
  defaultSelectedStatFields,
  statMetricColumns,
  dimensionLabels,
  allReportList,
  filterReportList,
  paginateList,
  refreshReportStats,
  buildStatisticsData,
  buildSummaryRow,
  getReportDetail
};
