import {
  batchOptions,
  projectTypeOptions,
  preliminaryStatusOptions,
  unitOptions
} from './mockData.js';
import { createInputField, createSelectField } from '../utils/formField.js';

const getPlanYears = () => {
  const yearMax = new Date().getFullYear();
  const years = [{ key: '', value: '全部' }];
  for (let i = yearMax; i >= 2017; i -= 1) {
    years.push({ key: i, value: i });
  }
  return years;
};

const summarySearchConfig = [
  createSelectField('planYear', '申报计划年度', '请选择申报计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  )
];

const summarySearchData = {
  planYear: '',
  batchCode: '',
  page: 1,
  rows: 20
};

const summaryTableColumn = [
  { key: 'planYear', label: '申报批次计划年度', width: 160 },
  { key: 'batchName', label: '申报批次', width: 320 },
  { key: 'demandCount', label: '需求数量', width: 100 },
  { key: 'pendingCount', label: '未初审数量', width: 110 },
  { key: 'reviewingCount', label: '初审中数量', width: 110 },
  { key: 'archivedCount', label: '初审已归档', width: 110 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 100,
    fixed: 'right'
  }
];

const summaryButtonsConfig = [
  { id: 0, text: '初审列表', color: '#298BF5' }
];

const listSearchConfig = [
  createSelectField('planYear', '申报计划年度', '请选择申报计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createInputField('demandName', '需求名称', '请输入需求名称'),
  createSelectField('projectType', '项目类型', '请选择项目类型', projectTypeOptions),
  createSelectField('demandUnitCode', '需求提出单位', '请选择需求提出单位', unitOptions),
  createSelectField('preliminaryStatus', '初审状态', '请选择初审状态', preliminaryStatusOptions)
];

const listSearchData = {
  planYear: '',
  batchCode: '',
  demandCode: '',
  demandName: '',
  projectType: '',
  demandUnitCode: '',
  preliminaryStatus: '',
  page: 1,
  rows: 20
};

const listTableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 300 },
  { key: 'batchName', label: '申报批次', width: 220 },
  { key: 'projectType', label: '项目类型', width: 110 },
  { key: 'demandUnit', label: '需求提出单位', width: 140 },
  { key: 'totalInvestment', label: '计划总投资（万元）', width: 150 },
  {
    key: 'functionCompareResult',
    label: '功能比对结果',
    width: 120,
    isSlot: true,
    slotName: 'functionCompareResult'
  },
  {
    key: 'relevanceReviewResult',
    label: '关联性审查结果',
    width: 130,
    isSlot: true,
    slotName: 'relevanceReviewResult'
  },
  {
    key: 'preliminaryStatus',
    label: '初审状态',
    width: 100,
    isSlot: true,
    slotName: 'preliminaryStatus'
  },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 200,
    fixed: 'right'
  }
];

const mainButtonsConfig = [
  { id: 0, text: '初审列表', color: '#298BF5' },
  { id: 1, text: '批量初审', color: '#298BF5' },
  { id: 2, text: '一键功能比对', color: '#298BF5' },
  { id: 3, text: '一键关联性审查', color: '#298BF5' },
  { id: 4, icon: 'iconzu1192', text: '导出', color: '#298BF5' }
];

const classifyButtonsConfig = [
  { id: 0, text: '批量初审', color: '#298BF5' },
  { id: 1, text: '一键功能比对', color: '#298BF5' },
  { id: 2, text: '一键关联性审查', color: '#298BF5' },
  { id: 3, icon: 'iconzu1192', text: '导出', color: '#298BF5' }
];

const reviewFormConfig = [
  {
    type: 'select',
    placeholder: '请选择初审结论',
    key: 'preliminaryConclusion',
    label: '初审结论',
    width: 360,
    clearable: true,
    options: [
      { key: '通过', value: '通过' },
      { key: '驳回', value: '驳回' },
      { key: '转专业审查', value: '转专业审查' }
    ]
  },
  {
    type: 'textarea',
    placeholder: '请输入初审意见',
    key: 'preliminaryOpinion',
    label: '初审意见',
    width: 360,
    rows: 4
  }
];

const reviewFormData = {
  preliminaryConclusion: '',
  preliminaryOpinion: ''
};

export {
  summarySearchConfig,
  summarySearchData,
  summaryTableColumn,
  summaryButtonsConfig,
  listSearchConfig,
  listSearchData,
  listTableColumn,
  mainButtonsConfig,
  classifyButtonsConfig,
  reviewFormConfig,
  reviewFormData
};
