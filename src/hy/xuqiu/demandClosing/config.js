import { closingStatusOptions, unitOptions } from './mockData.js';
import { createInputField, createSelectField } from '@/utils/formField.js';

const yesNoOptions = [
  { key: '', value: '全部' },
  { key: '是', value: '是' },
  { key: '否', value: '否' }
];

const businessCategoryOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

// 主列表
const searchConfig = [
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createInputField('demandName', '需求名称', '请输入需求名称'),
  createInputField('constructionDemandCode', '建设需求编号', '请输入建设需求编号'),
  createSelectField('constructionUnitCode', '建设单位', '请选择建设单位', unitOptions),
  createSelectField('demandUnitCode', '需求提出单位', '请选择需求提出单位', unitOptions),
  createSelectField('reportUnitCode', '提报单位', '请选择提报单位', unitOptions),
  createSelectField('businessCategory', '业务需求类别', '请选择业务需求类别', businessCategoryOptions),
  createSelectField('closingStatus', '状态', '请选择状态', closingStatusOptions),
  createSelectField('finalMaterialUploaded', '是否上传最终材料', '请选择', yesNoOptions),
  createSelectField('enteredFeasibility', '是否进入可研', '请选择', yesNoOptions)
];

const searchData = {
  demandCode: '',
  demandName: '',
  constructionDemandCode: '',
  constructionUnitCode: '',
  demandUnitCode: '',
  reportUnitCode: '',
  businessCategory: '',
  closingStatus: '',
  finalMaterialUploaded: '',
  enteredFeasibility: '',
  page: 1,
  rows: 20
};

const tableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 320 },
  { key: 'constructionDemandCode', label: '建设需求编号', width: 150 },
  { key: 'demandUnit', label: '需求提出单位', width: 140 },
  { key: 'constructionUnit', label: '建设单位', width: 140 },
  {
    key: 'closingStatus',
    label: '状态',
    width: 100,
    isSlot: true,
    slotName: 'closingStatus'
  },
  { key: 'splitMergeStatus', label: '拆分合并状态', width: 120 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 450,
    fixed: 'right'
  }
];

const toolbarButtonsConfig = [
  { id: 0, text: '批量上传收口材料', color: '#298BF5' },
  { id: 1, text: '下载所有附件', color: '#298BF5' },
  { id: 2, text: '进入可研', color: '#298BF5' },
  { id: 3, text: '需求收口', color: '#298BF5' },
  { id: 4, text: '全部收口', color: '#298BF5' },
  { id: 5, text: '可研评审', color: '#298BF5' },
  { id: 6, text: '推送', color: '#298BF5' },
  { id: 7, text: '全部推送', color: '#298BF5' },
  { id: 8, icon: 'icondaoru', text: '导入', color: '#298BF5' },
  { id: 9, icon: 'iconzu1192', text: '导出', color: '#298BF5' },
  { id: 10, text: '全部导出', color: '#298BF5' },
  { id: 11, text: '智能校核', color: '#298BF5' }
];

const materialTypes = [
  { key: 'stampedCover', label: '盖章封面' },
  { key: 'feasibilityReport', label: '可研报告' },
  { key: 'serviceAttachment', label: '服务内容附件' },
  { key: 'supportingMaterials', label: '佐证材料' }
];

const stampedCoverInstruction =
  '请上传任务需求说明书盖章封面文件，文件命名：任务需求说明书封面盖章-【需求名称】';

const stampedCoverFileColumn = [
  { key: 'index', label: '序号', width: 60 },
  { key: 'fileName', label: '文件名称（点击下载）', width: 320, isSlot: true, slotName: 'fileName' },
  { key: 'operation', label: '操作', width: 80, isSlot: true, slotName: 'fileOperation' },
  { key: 'lastUpdater', label: '最后更新人', width: 120 },
  { key: 'lastUpdateTime', label: '最后更新时间', width: 160 }
];

const closingMaterialTabs = [
  {
    key: 'requirementReport',
    label: '需求报告',
    instruction: '请上传任务需求说明书收口版文档，文件命名：【需求编号】-【需求名称】'
  },
  {
    key: 'handSign',
    label: '手签件',
    instruction: '请上传手签件扫描文件，文件命名：【需求编号】-手签件-【需求名称】'
  },
  {
    key: 'preliminaryMaterials',
    label: '前期项目佐证材料',
    instruction: '请上传前期项目佐证材料，文件命名：【需求编号】-佐证材料-【需求名称】'
  },
  {
    key: 'requirementBasis',
    label: '需求依据',
    instruction: '请上传需求依据材料，文件命名：【需求编号】-需求依据-【需求名称】'
  }
];

const unitCompareStatusMap = {
  consistent: { text: '一致', className: 'badge-success' },
  inconsistent: { text: '不一致', className: 'badge-danger' },
  notDetected: { text: '未检测到印章', className: 'badge-warning' }
};

// 收口处理
const closingFormConfig = [
  {
    type: 'select',
    placeholder: '请选择收口结论',
    key: 'closingConclusion',
    label: '收口结论',
    width: 360,
    clearable: true,
    options: [
      { key: '收口通过', value: '收口通过' },
      { key: '退回修改', value: '退回修改' },
      { key: '暂缓', value: '暂缓' }
    ]
  },
  {
    type: 'textarea',
    placeholder: '请输入收口意见',
    key: 'closingOpinion',
    label: '收口意见',
    width: 360,
    rows: 4
  }
];

const closingFormData = {
  closingConclusion: '',
  closingOpinion: ''
};

const aiReportItems = [
  '需求与可研一致性校核',
  '印章识别校核',
  '单位比对校核',
  '功能映射校核',
  '硬件采购一致性校核'
];

const aiCheckHeaderButtons = [
  { id: 0, text: '自定义校核', color: '#298BF5' },
  { id: 1, text: '全部校核', color: '#298BF5' }
];

const aiCheckTabs = [
  { key: 'functionMapping', label: '功能映射核查', status: 'completed', statusText: '已完成' },
  { key: 'supportingMaterial', label: '佐证材料验证', status: 'processing', statusText: '校核中' },
  { key: 'feasibilityConsistency', label: '可研一致性校核', status: 'pending', statusText: '未校核' }
];

const aiCheckStatusClassMap = {
  completed: 'status-completed',
  processing: 'status-processing',
  pending: 'status-pending-tab'
};

const aiCheckFunctionColumn = [
  { key: 'level2Function', label: '二级功能', width: 140 },
  { key: 'briefBefore', label: '二级功能简述（建设前）', width: 220 },
  { key: 'briefAfter', label: '二级功能简述（建设后）', width: 220 }
];

const customAiCheckAgentColumn = [
  { key: 'agentType', label: '智能体类型', width: 320 }
];

const customAiCheckAgents = [
  { id: 'functionMapping', agentType: '功能映射核查' },
  { id: 'supportingMaterial', agentType: '佐证材料验证' },
  { id: 'feasibilityConsistency', agentType: '可研一致性校核' }
];

const hqBusinessDepartmentOptions = [
  { key: '', value: '全部' },
  { key: '数字化部', value: '数字化部' },
  { key: '设备部', value: '设备部' },
  { key: '营销部', value: '营销部' }
];

const hqProjectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' }
];

const hqAuditResultOptions = [
  { key: '', value: '全部' },
  { key: '通过', value: '通过' },
  { key: '—', value: '—' }
];

const hqStatusOptions = [
  { key: '', value: '全部' },
  { key: '待推送', value: '待推送' },
  { key: '待总部审核', value: '待总部审核' },
  { key: '已反馈', value: '已反馈' }
];

const hqConstructionFormOptions = [
  { key: '', value: '全部' },
  { key: '新建', value: '新建' },
  { key: '—', value: '—' }
];

// 总部统筹清单
const hqSearchConfig = [
  createInputField('demandCode', '申报编号', '请输入申报编号'),
  createInputField('demandName', '需求名称', '请输入需求名称'),
  createSelectField('businessDepartment', '业务主管部门', '请选择业务主管部门', hqBusinessDepartmentOptions),
  createInputField('proposeUnit', '提出单位', '请输入提出单位'),
  createSelectField('projectType', '项目类型', '请选择项目类型', hqProjectTypeOptions),
  createSelectField('auditResult', '审核结果', '请选择审核结果', hqAuditResultOptions),
  createSelectField('status', '状态', '请选择状态', hqStatusOptions),
  createSelectField('constructionForm', '建设形式', '请选择建设形式', hqConstructionFormOptions)
];

const hqSearchData = {
  demandCode: '',
  demandName: '',
  businessDepartment: '',
  proposeUnit: '',
  projectType: '',
  auditResult: '',
  status: '',
  constructionForm: '',
  page: 1,
  rows: 20
};

const hqButtonsConfig = [
  { id: 0, text: '批量同步需求', color: '#298BF5' },
  { id: 1, text: '推送总部系统', color: '#298BF5' }
];

const hqTableColumn = [
  { key: 'demandCode', label: '申报编号', width: 140 },
  { key: 'demandName', label: '需求名称', width: 320 },
  { key: 'estimatedCost', label: '预估费用（万元）', width: 130 },
  { key: 'businessDepartment', label: '业务主管部门', width: 120 },
  { key: 'proposeUnit', label: '提出单位', width: 140 },
  { key: 'projectType', label: '项目类型', width: 100 },
  { key: 'auditResult', label: '审核结果', width: 100 },
  { key: 'constructionForm', label: '建设形式', width: 100 },
  { key: 'status', label: '状态', width: 110 },
  {
    key: 'operation',
    label: '操作',
    isSlot: true,
    slotName: 'operation',
    baseWidth: 200,
    fixed: 'right'
  }
];

export {
  searchConfig,
  searchData,
  tableColumn,
  toolbarButtonsConfig,
  materialTypes,
  stampedCoverInstruction,
  stampedCoverFileColumn,
  closingMaterialTabs,
  unitCompareStatusMap,
  closingFormConfig,
  closingFormData,
  aiReportItems,
  aiCheckHeaderButtons,
  aiCheckTabs,
  aiCheckStatusClassMap,
  aiCheckFunctionColumn,
  customAiCheckAgentColumn,
  customAiCheckAgents,
  hqSearchConfig,
  hqSearchData,
  hqButtonsConfig,
  hqTableColumn
};
