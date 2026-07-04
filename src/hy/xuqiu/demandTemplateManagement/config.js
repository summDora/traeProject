import {
  investmentChannelOptions,
  projectTypeOptions,
  projectCategoryOptions,
  fieldTypeOptions
} from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

const searchConfig = [
  createInputField('templateName', '申报模板名称', '请输入申报模板名称'),
  createSelectField('projectType', '项目类型', '请选择项目类型', projectTypeOptions),
  createSelectField('investmentChannel', '投资渠道', '请选择投资渠道', investmentChannelOptions)
];

const searchData = {
  templateName: '',
  projectType: '',
  investmentChannel: '',
  page: 1,
  rows: 10
};

const tableColumn = [
  { key: 'templateName', label: '申报模板名称', width: 280 },
  { key: 'investmentChannel', label: '投资渠道', width: 130 },
  { key: 'projectCategory', label: '项目分类', width: 120 },
  { key: 'createTime', label: '创建时间', width: 160 },
  { key: 'creator', label: '创建人', width: 90 },
  { key: 'batchCount', label: '关联批次数量', width: 120 },
  {
    key: 'associatedBatches',
    label: '关联批次',
    width: 280,
    isSlot: true,
    slotName: 'associatedBatches'
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

const toolbarButtonsConfig = [
  { id: 0, icon: 'el-icon-plus', text: '新建', type: 'primary' }
];

const templateBaseFormConfig = [
  {
    type: 'input',
    key: 'templateName',
    label: '申报模板名称',
    placeholder: '请输入申报模板名称',
    width: 320,
    clearable: true
  },
  {
    type: 'select',
    key: 'investmentChannel',
    label: '投资渠道',
    placeholder: '请选择投资渠道',
    width: 320,
    clearable: true,
    options: investmentChannelOptions.filter((item) => item.key)
  },
  {
    type: 'select',
    key: 'projectCategory',
    label: '项目分类',
    placeholder: '请选择项目分类',
    width: 320,
    clearable: true,
    options: projectCategoryOptions
  }
];

const templateBaseFormData = {
  templateName: '',
  investmentChannel: '',
  projectCategory: ''
};

const fieldTableColumn = [
  { key: 'fieldName', label: '字段名称', width: 180 },
  { key: 'fieldType', label: '字段类型', width: 120 },
  {
    key: 'listDisplay',
    label: '是否列表显示',
    width: 130,
    isSlot: true,
    slotName: 'listDisplay'
  }
];

const selectTemplateSearchConfig = [
  createInputField('templateName', '模板名称', '请输入模板名称')
];

const selectTemplateSearchData = {
  templateName: ''
};

const selectTemplateTableColumn = [
  { key: 'templateName', label: '模板名称', width: 320 },
  { key: 'updateTime', label: '更新时间', width: 180 }
];

export {
  searchConfig,
  searchData,
  tableColumn,
  toolbarButtonsConfig,
  templateBaseFormConfig,
  templateBaseFormData,
  fieldTableColumn,
  fieldTypeOptions,
  selectTemplateSearchConfig,
  selectTemplateSearchData,
  selectTemplateTableColumn
};
