import {
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
  dimensionLabels
} from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

const getStatYears = () => {
  const yearMax = new Date().getFullYear();
  const years = [{ key: '', value: '全部' }];
  for (let i = yearMax; i >= 2017; i -= 1) {
    years.push({ key: i, value: i });
  }
  return years;
};

const searchConfig = [
  createInputField('reportName', '报表名称', '请输入报表名称'),
  createSelectField('reportType', '报表类型', '请选择报表类型', reportTypeOptions),
  createSelectField('statYear', '统计年度', '请选择统计年度', getStatYears()),
  createSelectField('statPeriod', '统计周期', '请选择统计周期', statPeriodOptions),
  createSelectField('reportStatus', '报表状态', '请选择报表状态', reportStatusOptions)
];

const searchData = {
  reportName: '',
  reportType: '',
  statYear: '',
  statPeriod: '',
  reportStatus: '',
  page: 1,
  rows: 20
};

const tableColumn = [
  { key: 'reportName', label: '报表名称', width: 220 },
  { key: 'reportType', label: '报表类型', width: 120 },
  { key: 'statScope', label: '统计口径', width: 140 },
  { key: 'generateTime', label: '生成时间', width: 160 },
  { key: 'updater', label: '更新人', width: 100 },
  {
    key: 'reportStatus',
    label: '报表状态',
    width: 100,
    isSlot: true,
    slotName: 'reportStatus'
  },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 100,
    fixed: 'right'
  }
];

const buttonsConfig = [
  { id: 0, text: '报表统计', color: '#298BF5' },
  { id: 1, icon: 'iconzu1192', text: '导出', color: '#298BF5' },
  { id: 2, text: '刷新统计', color: '#298BF5' }
];

const statisticsSearchConfig = [
  createSelectField('planYear', '申报计划年度', '请选择申报计划年度', getStatYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createSelectField('projectType', '项目类型', '请选择项目类型', projectTypeOptions),
  createSelectField('demandUnitCode', '需求提报单位', '请选择需求提报单位', unitOptions),
  createSelectField('flowStatus', '流程状态', '请选择流程状态', flowStatusOptions)
];

const statisticsSearchData = {
  planYear: '',
  batchCode: '',
  projectType: '',
  demandUnitCode: '',
  flowStatus: ''
};

const statisticsButtonsConfig = [
  { id: 0, icon: 'iconzu1192', text: '导出', color: '#298BF5' },
  { id: 1, text: '刷新统计', color: '#298BF5' }
];

function buildStatisticsTableColumn(dimension, selectedFields) {
  const dimensionKey = `dimension_${dimension}`;
  const columns = [
    {
      key: dimensionKey,
      label: dimensionLabels[dimension],
      width: 180,
      isSlot: true,
      slotName: 'dimensionLabel'
    }
  ];

  const displayFields = selectedFields.length
    ? selectedFields
    : defaultSelectedStatFields;

  displayFields.forEach((fieldKey) => {
    const metric = statMetricColumns[fieldKey];
    if (metric) {
      columns.push({ ...metric });
    }
  });

  ['submitCount', 'reviewRejectCount', 'collectCount'].forEach((fieldKey) => {
    const metric = statMetricColumns[fieldKey];
    if (metric && !columns.find((col) => col.key === fieldKey)) {
      columns.push({ ...metric });
    }
  });

  return columns;
}

export {
  searchConfig,
  searchData,
  tableColumn,
  buttonsConfig,
  statisticsSearchConfig,
  statisticsSearchData,
  statisticsButtonsConfig,
  statDimensionTabs,
  statFieldGroups,
  defaultSelectedStatFields,
  buildStatisticsTableColumn
};
