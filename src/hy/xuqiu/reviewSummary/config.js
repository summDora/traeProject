import { demandStatusOptions } from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

const meetingSearchConfig = [
  createInputField('meetingName', '会议名称', '请输入会议名称')
];

const meetingSearchData = {
  meetingName: '',
  page: 1,
  rows: 10
};

const meetingTableColumn = [
  { key: 'meetingName', label: '会议名称', width: 260 },
  { key: 'meetingLocation', label: '会议地点', width: 120 },
  { key: 'meetingStartTime', label: '开始时间', width: 160 },
  { key: 'meetingEndTime', label: '结束时间', width: 160 },
  { key: 'meetingLeader', label: '会议负责人', width: 110 },
  {
    key: 'expert',
    label: '专家',
    width: 100,
    isSlot: true,
    slotName: 'expert'
  },
  {
    key: 'meetingMaterials',
    label: '会议资料',
    width: 90,
    isSlot: true,
    slotName: 'meetingMaterials'
  },
  { key: 'groupingStrategy', label: '分组策略', width: 100 },
  {
    key: 'meetingStatus',
    label: '会议状态',
    width: 100,
    isSlot: true,
    slotName: 'meetingStatus'
  }
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
  selectedMeetingId: '',
  page: 1,
  rows: 20
};

const demandTableColumn = [
  { key: 'groupName', label: '组别', width: 80 },
  { key: 'reviewNumber', label: '评审号码', width: 100 },
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 260 },
  {
    key: 'reviewProgress',
    label: '评审进度',
    width: 140,
    isSlot: true,
    slotName: 'reviewProgress'
  },
  {
    key: 'demandStatus',
    label: '需求状态',
    width: 100,
    isSlot: true,
    slotName: 'demandStatus'
  },
  { key: 'businessDepartment', label: '业务主管部门', width: 130 },
  { key: 'initialOpinion', label: '初评意见', width: 100 },
  { key: 'deptPriority', label: '业务主管部门优先级排序', width: 180 },
  { key: 'deptOpinion', label: '业务部门意见', width: 140 }
];

const toolbarButtonsConfig = [
  { id: 0, text: '评审记录', color: '#298BF5' },
  { id: 1, text: '批量提交', color: '#298BF5' },
  { id: 2, text: '材料导出', color: '#298BF5' },
  { id: 3, icon: 'iconzu1192', text: '导出', color: '#298BF5' }
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
  { key: 'meetingName', label: '所属会议', width: 200 },
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

export {
  meetingSearchConfig,
  meetingSearchData,
  meetingTableColumn,
  demandSearchConfig,
  demandSearchData,
  demandTableColumn,
  toolbarButtonsConfig,
  reviewRecordSearchConfig,
  reviewRecordSearchData,
  reviewRecordTableColumn
};
