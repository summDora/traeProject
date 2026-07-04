import {
  batchOptions,
  projectTypeOptions,
  demandStatusOptions,
  investmentChannelOptions,
  departments
} from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

const getPlanYears = () => {
  const yearMax = new Date().getFullYear();
  const years = [{ key: '', value: '全部' }];
  for (let i = yearMax; i >= 2017; i -= 1) {
    years.push({ key: i, value: i });
  }
  return years;
};

const batchSearchConfig = [
  createInputField('batchTitle', '申报批次标题', '请输入申报批次标题'),
  createSelectField('planYear', '申报计划年度', '请选择申报计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createSelectField('investmentChannel', '投资渠道', '请选择投资渠道', investmentChannelOptions)
];

const batchSearchData = {
  batchTitle: '',
  planYear: '',
  batchCode: '',
  investmentChannel: '',
  page: 1,
  rows: 10
};

const batchTableColumn = [
  { key: 'batchTitle', label: '申报批次标题', width: 220 },
  { key: 'planYear', label: '申报批次计划年度', width: 150 },
  { key: 'batchName', label: '申报批次', width: 220 },
  { key: 'investmentChannel', label: '投资渠道', width: 110 },
  { key: 'projectCategory', label: '项目分类', width: 110 },
  { key: 'launchTime', label: '发起时间', width: 120 },
  { key: 'deadline', label: '填报截止时间', width: 130 },
  { key: 'initiator', label: '发起人', width: 100 },
  { key: 'reportProgress', label: '提报情况', width: 100 },
  { key: 'declareCount', label: '申报数量', width: 100 },
  { key: 'declareFee', label: '申报费用（万元）', width: 130 },
  { key: 'overBudget', label: '是否超出预算控制', width: 140 }
];

const demandSearchConfig = [
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
  createSelectField('demandStatus', '需求状态', '请选择需求状态', demandStatusOptions)
];

const demandSearchData = {
  planYear: '',
  batchCode: '',
  demandCode: '',
  demandName: '',
  projectType: '',
  demandStatus: '',
  selectedBatchCode: '',
  page: 1,
  rows: 20
};

const demandTableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 300 },
  { key: 'batchName', label: '申报批次', width: 220 },
  { key: 'projectType', label: '项目类型', width: 110 },
  { key: 'coreSystem', label: '核心系统', width: 130 },
  { key: 'totalInvestment', label: '计划总投资（万元）', width: 150 },
  { key: 'demandDepartment', label: '需求提出部门', width: 130 },
  { key: 'demandLeader', label: '需求负责人', width: 110 },
  {
    key: 'selfReviewResult',
    label: '自主审查结果',
    width: 120,
    isSlot: true,
    slotName: 'selfReviewResult'
  },
  {
    key: 'demandStatus',
    label: '状态',
    width: 100,
    isSlot: true,
    slotName: 'demandStatus'
  },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 160,
    fixed: 'right'
  }
];

const buttonsConfig = [
  { id: 0, text: '新增', color: '#298BF5' },
  { id: 1, text: '选择预储备库需求', color: '#298BF5' },
  { id: 2, text: '删除', color: '#298BF5' },
  { id: 3, text: '查重', color: '#298BF5' },
  { id: 4, text: '历史关联性审查', color: '#298BF5' },
  { id: 5, text: '全部提交', color: '#298BF5' },
  { id: 6, icon: 'iconzu1192', text: '导出', color: '#298BF5' }
];

const preReserveSearchConfig = [
  createInputField('demandCode', '申报编号', '请输入申报编号', { width: 260 }),
  createInputField('demandName', '需求名称', '请输入需求名称', { width: 260 }),
  createInputField('reserveCode', '储备编号', '请输入储备编号', { width: 260 }),
  createSelectField(
    'demandDepartment',
    '需求提出部门',
    '请选择需求提出部门',
    [{ key: '', value: '全部' }, ...departments.map((item) => ({ key: item, value: item }))],
    { width: 260 }
  )
];

const preReserveSearchData = {
  demandCode: '',
  demandName: '',
  reserveCode: '',
  demandDepartment: ''
};

const preReserveTableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 280 },
  { key: 'reserveCode', label: '储备编号', width: 150 },
  { key: 'totalInvestment', label: '计划总投资（万元）', width: 150 },
  { key: 'demandDepartment', label: '需求提出单位', width: 140 },
  { key: 'demandLeader', label: '需求负责人', width: 110 }
];

const editFormConfig = [
  {
    type: 'input',
    placeholder: '请输入需求名称',
    key: 'demandName',
    label: '需求名称',
    width: 720
  },
  {
    type: 'textarea',
    placeholder: '请输入目前存在的问题',
    key: 'requirementDesc',
    label: '目前存在的问题',
    width: 720,
    rows: 3
  },
  {
    type: 'textarea',
    placeholder: '请输入预期成效',
    key: 'expectedGoals',
    label: '预期成效',
    width: 720,
    rows: 3
  }
];

const editFormData = {
  demandName: '',
  requirementDesc: '',
  expectedGoals: ''
};

export {
  batchSearchConfig,
  batchSearchData,
  batchTableColumn,
  demandSearchConfig,
  demandSearchData,
  demandTableColumn,
  buttonsConfig,
  preReserveSearchConfig,
  preReserveSearchData,
  preReserveTableColumn,
  editFormConfig,
  editFormData
};
