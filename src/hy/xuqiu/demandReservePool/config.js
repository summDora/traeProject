import {
  batchOptions,
  projectTypeOptions,
  reserveStatusOptions,
  unitOptions,
  priorityOptions,
  tagOptions
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

const searchConfig = [
  createSelectField('planYear', '申报计划年度', '请选择申报计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createInputField('demandKeyword', '需求名称/编号', '请输入需求名称或编号'),
  createSelectField('projectType', '项目类型', '请选择项目类型', projectTypeOptions),
  createSelectField('demandUnitCode', '需求提出单位', '请选择需求提出单位', unitOptions),
  createSelectField('reserveStatus', '储备状态', '请选择储备状态', reserveStatusOptions)
];

const searchData = {
  planYear: '',
  batchCode: '',
  demandKeyword: '',
  projectType: '',
  demandUnitCode: '',
  reserveStatus: '',
  page: 1,
  rows: 20
};

const tableColumn = [
  { key: 'demandCode', label: '需求编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 320 },
  { key: 'projectType', label: '项目类型', width: 110 },
  { key: 'demandUnit', label: '需求提出单位', width: 140 },
  { key: 'totalInvestment', label: '计划总投资（万元）', width: 150 },
  { key: 'reviewConclusion', label: '评审结论', width: 110 },
  { key: 'coordinationResult', label: '统筹结果', width: 110 },
  { key: 'closingTime', label: '收口时间', width: 160 },
  {
    key: 'reserveStatus',
    label: '储备状态',
    width: 100,
    isSlot: true,
    slotName: 'reserveStatus'
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

const tagFormConfig = [
  {
    type: 'select',
    placeholder: '请选择优先级',
    key: 'priority',
    label: '优先级',
    width: 360,
    clearable: true,
    options: priorityOptions
  },
  {
    type: 'select',
    placeholder: '请选择标签',
    key: 'tags',
    label: '需求标签',
    width: 360,
    clearable: true,
    multiple: true,
    options: tagOptions.map((item) => ({ key: item, value: item }))
  }
];

const tagFormData = {
  priority: '',
  tags: []
};

export {
  searchConfig,
  searchData,
  tableColumn,
  tagFormConfig,
  tagFormData
};
