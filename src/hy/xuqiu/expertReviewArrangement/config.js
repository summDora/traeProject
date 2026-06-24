import { demandStatusOptions, systemNameOptions, microAppOptions, level1FunctionOptions } from './mockData.js';
import { createInputField, createSelectField } from '../utils/formField.js';

const batchSearchConfig = [
  createInputField('meetingName', '会议名称', '请输入会议名称')
];

const batchSearchData = {
  meetingName: '',
  page: 1,
  rows: 10
};

const batchTableColumn = [
  { key: 'planYear', label: '申报批次计划年度', width: 140 },
  { key: 'batchName', label: '申报批次', width: 220 },
  { key: 'batchTitle', label: '申报批次标题', width: 240 },
  { key: 'batchCode', label: '批次编号', width: 130 },
  { key: 'applyStartTime', label: '申报开始时间', width: 160 },
  { key: 'applyEndTime', label: '申报截止时间', width: 160 },
  { key: 'investmentChannel', label: '投资渠道', width: 110 },
  { key: 'professionalType', label: '专业类型', width: 100 },
  { key: 'creator', label: '创建人', width: 100 },
  { key: 'createTime', label: '创建时间', width: 160 }
];

const demandSearchConfig = [
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createInputField('demandName', '需求名称', '请输入需求名称'),
  createInputField('demandUnit', '需求提出单位', '请输入需求提出单位'),
  createSelectField('demandStatus', '需求状态', '请选择需求状态', demandStatusOptions)
];

const demandSearchData = {
  demandCode: '',
  demandName: '',
  demandUnit: '',
  demandStatus: '',
  selectedBatchCode: '',
  page: 1,
  rows: 20
};

const demandTableColumn = [
  { key: 'groupName', label: '组别', width: 90 },
  { key: 'reviewNumber', label: '评审号码', width: 100 },
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 280 },
  {
    key: 'demandStatus',
    label: '需求状态',
    width: 100,
    isSlot: true,
    slotName: 'demandStatus'
  },
  { key: 'manageDepartment', label: '专业管理部门', width: 130 },
  {
    key: 'reviewProgress',
    label: '评审进度',
    width: 100,
    isSlot: true,
    slotName: 'reviewProgress'
  },
  { key: 'demandUnit', label: '需求提出单位', width: 130 },
  { key: 'estimatedCost', label: '预估费用', width: 110 },
  { key: 'reportUnit', label: '提报单位', width: 130 },
  { key: 'duplicateResult', label: '查重结果', width: 100 },
  {
    key: 'relevanceLevel',
    label: '关联性等级',
    width: 100,
    isSlot: true,
    slotName: 'relevanceLevel'
  },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 180,
    fixed: 'right'
  }
];

const toolbarButtonsConfig = [
  { id: 0, text: '评审记录', color: '#298BF5' },
  { id: 1, text: '材料导出', color: '#298BF5' },
  { id: 2, text: '项目查重', color: '#298BF5' },
  { id: 3, text: '关联性审查', color: '#298BF5' }
];

const reviewRecordSearchConfig = [
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createInputField('demandName', '需求名称', '请输入需求名称'),
  createInputField('demandUnit', '需求提出单位', '请输入需求提出单位'),
  createSelectField('demandStatus', '需求状态', '请选择需求状态', demandStatusOptions)
];

const reviewRecordSearchData = {
  demandCode: '',
  demandName: '',
  demandUnit: '',
  demandStatus: '',
  page: 1,
  rows: 20
};

const reviewRecordTableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 320 },
  {
    key: 'opinionWithdraw',
    label: '意见撤回',
    width: 100,
    isSlot: true,
    slotName: 'opinionWithdraw'
  },
  { key: 'applicant', label: '申报人', width: 100 },
  { key: 'applyTime', label: '申报时间', width: 160 },
  { key: 'batchName', label: '所属批次', width: 200 },
  { key: 'demandUnit', label: '需求提出单位', width: 140 },
  {
    key: 'demandStatus',
    label: '需求状态',
    width: 100,
    isSlot: true,
    slotName: 'demandStatus'
  },
  {
    key: 'operation',
    label: '查看',
    width: 80,
    isSlot: true,
    slotName: 'operation',
    fixed: 'right'
  }
];

const baselineSearchConfig = [
  createSelectField('systemName', '系统名称', '请选择系统名称', systemNameOptions),
  createSelectField('microAppName', '微应用名称', '请选择微应用名称', microAppOptions),
  createSelectField('level1Function', '一级功能', '请选择一级功能', level1FunctionOptions)
];

const baselineSearchData = {
  systemName: '',
  microAppName: '',
  level1Function: ''
};

const centralizedReviewTabs = [
  { key: 'baseline', label: '标准功能基线库' },
  { key: 'blueprint', label: '关联业务蓝图' },
  { key: 'basicInfo', label: '需求基本信息' },
  { key: 'detailInfo', label: '需求详情信息' },
  { key: 'duplicate', label: '需求查重结果' },
  { key: 'relevance', label: '关联性审查结果' },
  { key: 'businessSystem', label: '所属业务系统情况' },
  { key: 'previousProject', label: '前期项目情况' }
];

export {
  batchSearchConfig,
  batchSearchData,
  batchTableColumn,
  demandSearchConfig,
  demandSearchData,
  demandTableColumn,
  toolbarButtonsConfig,
  reviewRecordSearchConfig,
  reviewRecordSearchData,
  reviewRecordTableColumn,
  baselineSearchConfig,
  baselineSearchData,
  centralizedReviewTabs
};
