import { tagCategoryOptions, tagNameOptions, tagTypeOptions } from './mockData.js';
import { createSelectField } from '@/utils/formField.js';

const searchConfig = [
  createSelectField('tagYear', '标签名称', '请选择', tagNameOptions),
  createSelectField('tagCategory', '标签类别', '请选择标签类别', tagCategoryOptions)
];

const searchData = {
  tagYear: 2026,
  tagCategory: ''
};

const tableColumn = [
  {
    key: 'displayIndex',
    label: '序号',
    width: 72,
    align: 'center',
    isSlot: true,
    slotName: 'displayIndex'
  },
  { key: 'tagCategory', label: '标签类别', width: 220 },
  {
    key: 'tagName',
    label: '标签名称',
    width: 260,
    isSlot: true,
    slotName: 'tagName'
  },
  {
    key: 'relatedDemandCount',
    label: '关联需求总数',
    width: 130,
    isSlot: true,
    slotName: 'relatedDemandCount'
  },
  { key: 'feasibilityCount', label: '进入可研需求数量', width: 150 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 220,
    fixed: 'right'
  }
];

const toolbarButtonsConfig = [
  { id: 0, icon: 'el-icon-plus', text: '新增标签', type: 'primary' }
];

const tagStatusOptions = [
  { label: '启用', value: true },
  { label: '停用', value: false }
];

function buildTagFormConfig(parentTagOptions = []) {
  return [
    {
      type: 'input',
      key: 'tagName',
      label: '标签名称',
      placeholder: '请输入标签名称',
      width: 480,
      clearable: true
    },
    {
      type: 'select',
      key: 'tagType',
      label: '标签类型',
      placeholder: '请选择标签类型',
      width: 480,
      clearable: true,
      options: tagTypeOptions.filter((item) => item.key)
    },
    {
      type: 'select',
      key: 'parentTag',
      label: '上级标签',
      placeholder: '请选择上级标签',
      width: 480,
      clearable: true,
      options: parentTagOptions
    },
    {
      type: 'numberInput',
      key: 'sortOrder',
      label: '排序',
      placeholder: '请输入排序',
      width: 480,
      min: 0,
      precision: 0
    },
    {
      type: 'radio',
      key: 'status',
      label: '状态',
      width: 480,
      options: tagStatusOptions
    },
    {
      type: 'textarea',
      key: 'remark',
      label: '备注',
      placeholder: '请输入备注',
      width: 480,
      rows: 4
    }
  ];
}

const tagFormData = {
  tagName: '',
  tagType: '',
  parentTag: '',
  sortOrder: undefined,
  status: true,
  remark: ''
};

const tagFormRules = {
  tagName: [{ required: true, message: '请输入标签名称', trigger: 'blur' }],
  tagType: [{ required: true, message: '请选择标签类型', trigger: 'change' }]
};

export {
  searchConfig,
  searchData,
  tableColumn,
  toolbarButtonsConfig,
  buildTagFormConfig,
  tagFormData,
  tagFormRules
};
