import { batchOptions } from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

const getPlanYears = () => {
  const yearMax = new Date().getFullYear();
  const years = [{ key: '', value: '全部' }];
  for (let i = yearMax; i >= 2017; i -= 1) {
    years.push({ key: i, value: i });
  }
  return years;
};

// 主列表
const searchConfig = [
  createSelectField('planYear', '申报批次计划年度', '请选择申报计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  )
];

const searchData = {
  planYear: '',
  batchCode: '',
  page: 1,
  rows: 20
};

const tableColumn = [
  { key: 'planYear', label: '申报批次计划年度', width: 160 },
  { key: 'batchName', label: '申报批次', width: 360 },
  { key: 'demandCount', label: '需求数量', width: 120 },
  { key: 'proposedFeasibilityCount', label: '拟进入可研', width: 120 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 180,
    fixed: 'right'
  }
];

// 统筹管理
const manageButtonsConfig = [
  { id: 0, text: '统筹推荐生成', color: '#298BF5' },
  { id: 1, text: '统筹存档', color: '#298BF5' },
  { id: 2, text: '统筹结果导出', color: '#298BF5' }
];

const manageTableColumn = [
  { key: 'unitName', label: '单位（部门）', width: 160 },
  { key: 'standardCost', label: '标准成本（万元）', width: 140 },
  { key: 'adjustedCost', label: '可按系数进入可研（万元）', width: 180 },
  {
    key: 'recommendGroup',
    label: '建议进入可研项目',
    children: [
      { key: 'recommendCount', label: '数量', width: 90 },
      { key: 'recommendCost', label: '费用', width: 110 }
    ]
  },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 120,
    fixed: 'right'
  }
];

// 统筹概览
const overviewSearchConfig = [
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createInputField('demandName', '需求名称', '请输入需求名称'),
  createSelectField('reviewConclusion', '评审结论', '请选择评审结论', [
    { key: '', value: '全部' },
    { key: '通过', value: '通过' },
    { key: '原则通过', value: '原则通过' },
    { key: '修改后通过', value: '修改后通过' },
    { key: '不通过', value: '不通过' }
  ]),
  createSelectField('proposedFeasibility', '拟进入可研', '请选择拟进入可研', [
    { key: '', value: '全部' },
    { key: '纳入储备', value: '纳入储备' },
    { key: '暂缓', value: '暂缓' },
    { key: '取消', value: '取消' },
    { key: '—', value: '未统筹' }
  ])
];

const overviewSearchData = {
  demandCode: '',
  demandName: '',
  reviewConclusion: '',
  proposedFeasibility: '',
  page: 1,
  rows: 20
};

const overviewButtonsConfig = [
  { id: 0, text: '导入国网统筹批复', color: '#298BF5' },
  { id: 1, text: '批量统筹调整', color: '#298BF5' },
  { id: 2, icon: 'iconzu1192', text: '导出', color: '#298BF5' }
];

const overviewTableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 320 },
  { key: 'demandUnit', label: '需求提报单位', width: 120 },
  { key: 'projectType', label: '项目类型', width: 110 },
  { key: 'totalInvestment', label: '建议费用（万元）', width: 130 },
  { key: 'reviewConclusion', label: '评审结论', width: 110 },
  { key: 'coordinationResult', label: '拟进入可研', width: 110 },
  { key: 'coordinationStatus', label: '统筹状态', width: 100 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 100,
    fixed: 'right'
  }
];

export {
  searchConfig,
  searchData,
  tableColumn,
  manageButtonsConfig,
  manageTableColumn,
  overviewSearchConfig,
  overviewSearchData,
  overviewButtonsConfig,
  overviewTableColumn
};
