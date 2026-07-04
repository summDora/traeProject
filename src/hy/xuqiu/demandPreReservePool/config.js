import { batchOptions, projectTypeOptions } from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

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
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createSelectField('projectType', '项目类型', '请选择项目类型', projectTypeOptions)
];

const searchData = {
  planYear: '',
  batchCode: '',
  demandCode: '',
  projectType: '',
  page: 1,
  rows: 10
};

const tableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 300 },
  {
    key: 'batchName',
    label: '申报批次',
    width: 220,
    isSlot: true,
    slotName: 'batchName'
  },
  { key: 'projectType', label: '项目类型', width: 110 },
  { key: 'coreSystem', label: '核心系统', width: 130 },
  { key: 'totalInvestment', label: '计划总投资（万元）', width: 150 },
  { key: 'demandLeader', label: '需求负责人', width: 110 },
  { key: 'demandDepartment', label: '需求提出部门', width: 130 },
  {
    key: 'materialUploadStatus',
    label: '材料上传状态',
    width: 120,
    isSlot: true,
    slotName: 'materialUploadStatus'
  },
  {
    key: 'duplicateResult',
    label: '查重结果',
    width: 100,
    isSlot: true,
    slotName: 'duplicateResult'
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

const buttonsConfig = [
  { id: 0, text: '分配批次', color: '#298BF5' },
  { id: 1, text: '上传盖章版汇总需求表', color: '#298BF5' },
  { id: 2, icon: 'iconzu1192', text: '导出盖章版汇总需求表', color: '#298BF5' },
  { id: 3, text: '删除需求', color: '#298BF5' }
];

const assignBatchSearchConfig = [
  createInputField('batchTitle', '申报批次标题', '请输入申报批次标题', { width: 260 }),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.filter((item) => item.key).map((item) => ({ key: item.key, value: item.value })),
    { width: 260 }
  )
];

const assignBatchSearchData = {
  batchTitle: '',
  batchCode: ''
};

const assignBatchTableColumn = [
  { key: 'batchTitle', label: '申报批次标题', width: 220 },
  { key: 'batchName', label: '申报批次', width: 220 },
  { key: 'startTime', label: '发起时间', width: 140 },
  { key: 'deadline', label: '提报截止时间', width: 140 }
];

const editFormConfig = [
  {
    type: 'textarea',
    placeholder: '请输入备注',
    key: 'editRemark',
    label: '备注',
    width: 720,
    rows: 3
  },
  {
    type: 'input',
    placeholder: '请输入优先级',
    key: 'priority',
    label: '优先级',
    width: 360
  }
];

const editFormData = {
  editRemark: '',
  priority: '1',
  tags: []
};

export {
  searchConfig,
  searchData,
  tableColumn,
  buttonsConfig,
  assignBatchSearchConfig,
  assignBatchSearchData,
  assignBatchTableColumn,
  editFormConfig,
  editFormData
};
