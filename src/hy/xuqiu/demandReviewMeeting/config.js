import {
  batchOptions,
  meetingStatusOptions,
  reviewTypeOptions,
  projectTypeOptions,
  projectCategoryOptions,
  demandTagOptions,
  groupingTypeOptions,
  groupNameOptions,
  fundingChannelOptions
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

const searchConfig = [
  createInputField('meetingName', '会议名称', '请输入会议名称'),
  {
    width: 420,
    embedWidth: 90,
    type: 'dateTimepicker',
    dateTimeType: 'datetimerange',
    format: 'yyyy-MM-dd HH:mm',
    valFormat: 'yyyy-MM-dd HH:mm',
    key: 'meetingTime',
    placeholder: ['开始日期', '结束日期'],
    selectClass: 'selectEmbed',
    selectEmbedLabel: '会议时间',
    embed: true,
    clearable: true
  },
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createSelectField('meetingStatus', '会议状态', '请选择会议状态', meetingStatusOptions),
  createSelectField('reviewType', '评审类型', '请选择评审类型', reviewTypeOptions)
];

const searchData = {
  meetingName: '',
  meetingTime: [],
  batchCode: '',
  meetingStatus: '',
  reviewType: '',
  page: 1,
  rows: 10
};

const tableColumn = [
  { key: 'meetingName', label: '会议名称', width: 280 },
  { key: 'meetingLocation', label: '会议地点', width: 120 },
  { key: 'meetingStartTime', label: '开始时间', width: 150 },
  { key: 'meetingEndTime', label: '结束时间', width: 150 },
  { key: 'meetingLeader', label: '会议负责人', width: 100 },
  {
    key: 'expert',
    label: '专家',
    width: 140,
    isSlot: true,
    slotName: 'expert'
  },
  { key: 'groupingType', label: '分组策略', width: 90 },
  {
    key: 'statusEnabled',
    label: '会议状态',
    width: 90,
    isSlot: true,
    slotName: 'statusEnabled'
  },
  {
    key: 'externalTransmit',
    label: '外网传输',
    width: 90,
    isSlot: true,
    slotName: 'externalTransmit'
  },
  { key: 'createTime', label: '创建时间', width: 160 },
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
  { id: 0, icon: 'el-icon-plus', text: '新建', type: 'primary' },
  { id: 1, icon: 'el-icon-edit', text: '修改', type: 'default' },
  { id: 2, icon: 'el-icon-close', text: '删除', type: 'default' }
];

const meetingFormConfig = [
  {
    type: 'input',
    key: 'meetingName',
    label: '会议名称',
    placeholder: '请输入会议名称',
    width: 480,
    clearable: true
  },
  {
    type: 'input',
    key: 'meetingLocation',
    label: '会议地点',
    placeholder: '请输入会议地点',
    width: 480,
    clearable: true
  },
  {
    type: 'input',
    key: 'meetingLeader',
    label: '会议负责人',
    placeholder: '请输入会议负责人',
    width: 480,
    clearable: true
  },
  {
    type: 'dateTimepicker',
    key: 'meetingTime',
    label: '会议时间',
    dateTimeType: 'datetimerange',
    format: 'yyyy-MM-dd HH:mm',
    valFormat: 'yyyy-MM-dd HH:mm',
    placeholder: ['开始时间', '结束时间'],
    width: 480,
    clearable: true
  },
  {
    type: 'select',
    key: 'groupingType',
    label: '分组策略',
    placeholder: '请选择分组策略',
    width: 480,
    clearable: true,
    options: groupingTypeOptions
  },
  {
    type: 'checkbox',
    key: 'groupNames',
    label: '分组名称',
    width: 480,
    notShow: false,
    options: groupNameOptions
  },
  {
    type: 'select',
    key: 'fundingChannel',
    label: '出资建议渠道',
    placeholder: '请选择出资建议渠道',
    width: 480,
    clearable: true,
    options: fundingChannelOptions
  },
  {
    type: 'textarea',
    key: 'remark',
    label: '备注',
    placeholder: '请输入备注',
    width: 480,
    rows: 2,
    clearable: true
  }
];

const meetingFormData = {
  meetingName: '',
  meetingLocation: '',
  meetingLeader: '',
  meetingTime: [],
  groupingType: '不分组',
  groupNames: ['A组', 'B组', 'C组', 'D组', 'E组', 'F组'],
  fundingChannel: '',
  remark: ''
};

const meetingFormRules = {
  meetingName: [{ required: true, message: '请输入会议名称', trigger: 'blur' }],
  meetingLocation: [{ required: true, message: '请输入会议地点', trigger: 'blur' }],
  meetingLeader: [{ required: true, message: '请输入会议负责人', trigger: 'blur' }],
  meetingTime: [{
    required: true,
    trigger: 'change',
    validator: (rule, value, callback) => {
      if (value && value.length === 2 && value[0] && value[1]) {
        callback();
        return;
      }
      callback(new Error('请选择会议时间'));
    }
  }],
  groupingType: [{ required: true, message: '请选择分组策略', trigger: 'change' }],
  fundingChannel: [{ required: true, message: '请选择出资建议渠道', trigger: 'change' }]
};

const reviewDemandSearchConfig = [
  createSelectField('planYear', '申报批次计划年度', '请选择申报批次计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '申报批次',
    '请选择申报批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createSelectField('projectType', '项目类型', '请选择项目类型', projectTypeOptions),
  createSelectField('demandTag', '需求标签', '请选择需求标签', demandTagOptions),
  createInputField('demandName', '需求名称', '请输入需求名称')
];

const reviewDemandSearchData = {
  planYear: '',
  batchCode: '',
  demandCode: '',
  projectType: '',
  demandTag: '',
  demandName: ''
};

const reviewDemandTableColumn = [
  { key: 'batchName', label: '申报批次', width: 200 },
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 280 },
  { key: 'demandUnit', label: '需求提报单位', width: 160 },
  { key: 'demandTag', label: '需求标签', width: 100 },
  { key: 'projectType', label: '项目类型', width: 110 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 80,
    fixed: 'right'
  }
];

const addReviewDemandSearchConfig = [
  createSelectField('planYear', '计划年度', '请选择计划年度', getPlanYears()),
  createSelectField(
    'batchCode',
    '计划批次',
    '请选择计划批次',
    batchOptions.map((item) => ({ key: item.key, value: item.value }))
  ),
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createSelectField('projectCategory', '项目大类', '请选择项目大类', projectCategoryOptions),
  createSelectField('demandTag', '需求标签', '请选择需求标签', demandTagOptions),
  createInputField('demandName', '需求名称', '请输入需求名称')
];

const addReviewDemandSearchData = {
  planYear: '',
  batchCode: '',
  demandCode: '',
  projectCategory: '',
  demandTag: '',
  demandName: ''
};

const addReviewDemandTableColumn = [
  { key: 'batchName', label: '申报批次', width: 200 },
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 280 },
  { key: 'demandUnit', label: '需求提报单位', width: 160 },
  { key: 'demandTag', label: '需求标签', width: 100 },
  { key: 'projectType', label: '项目类型', width: 110 }
];

const reviewDemandButtonsConfig = [
  { id: 0, text: '新增评审需求', color: '#298BF5' },
  { id: 1, text: '选择标签新增', color: '#298BF5' },
  { id: 2, icon: 'icondaoru', text: '导入', color: '#298BF5' },
  { id: 3, icon: 'iconzu1192', text: '导出', color: '#298BF5' },
  { id: 4, icon: 'el-icon-close', text: '删除', type: 'default' }
];

const expertSearchConfig = [
  createInputField('expertName', '姓名', '请输入姓名'),
  createInputField('unit', '单位', '请输入单位')
];

const expertSearchData = {
  expertName: '',
  unit: ''
};

const expertCandidateColumn = [
  { key: 'employeeNo', label: '工号', width: 110 },
  { key: 'expertName', label: '姓名', width: 90 },
  { key: 'unit', label: '单位', width: 120 },
  { key: 'contact', label: '联系方式', width: 120 },
  { key: 'meetingSchedule', label: '会议安排', width: 180 }
];

const expertSelectedColumn = [
  { key: 'employeeNo', label: '工号', width: 100 },
  { key: 'expertName', label: '姓名', width: 80 },
  { key: 'unit', label: '单位', width: 100 },
  { key: 'contact', label: '联系方式', width: 110 },
  {
    key: 'reviewRole',
    label: '评审角色',
    width: 120,
    isSlot: true,
    slotName: 'reviewRole'
  },
  {
    key: 'expertType',
    label: '专家类型',
    width: 120,
    isSlot: true,
    slotName: 'expertType'
  }
];

const expertSelectedButtonsConfig = [
  { id: 0, icon: 'icondaoru', text: '导入', color: '#298BF5' },
  { id: 1, icon: 'iconzu1192', text: '导出', color: '#298BF5' },
  { id: 2, icon: 'el-icon-close', text: '删除', type: 'default' }
];

export {
  searchConfig,
  searchData,
  tableColumn,
  buttonsConfig,
  meetingFormConfig,
  meetingFormData,
  meetingFormRules,
  reviewDemandSearchConfig,
  reviewDemandSearchData,
  reviewDemandTableColumn,
  addReviewDemandSearchConfig,
  addReviewDemandSearchData,
  addReviewDemandTableColumn,
  reviewDemandButtonsConfig,
  expertSearchConfig,
  expertSearchData,
  expertCandidateColumn,
  expertSelectedColumn,
  expertSelectedButtonsConfig
};
