const investmentChannelOptions = [
  { key: '', value: '全部' },
  { key: '综合计划', value: '综合计划' },
  { key: '省公司自控成本', value: '省公司自控成本' },
  { key: '成本性', value: '成本性' },
  { key: '资本性', value: '资本性' }
];

const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '咨询设计类', value: '咨询设计类' },
  { key: '实施类', value: '实施类' },
  { key: '开发实施类', value: '开发实施类' },
  { key: '建设类', value: '建设类' }
];

const projectCategoryOptions = [
  { key: '咨询设计类', value: '咨询设计类' },
  { key: '实施类', value: '实施类' },
  { key: '开发实施类', value: '开发实施类' },
  { key: '建设类', value: '建设类' }
];

const fieldTypeOptions = [
  { key: '单行文本', value: '单行文本' },
  { key: '下拉选择', value: '下拉选择' },
  { key: '多行文本', value: '多行文本' }
];

const defaultFieldList = () => [
  { id: 'F1', fieldName: '任务需求名称', fieldType: '单行文本', listDisplay: true, locked: true, required: true, previewSpan: 24 },
  { id: 'F2', fieldName: '指南对应章节', fieldType: '单行文本', listDisplay: true, locked: true, required: true, previewSpan: 24 },
  { id: 'F3', fieldName: '专业大类', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 8 },
  { id: 'F4', fieldName: '专业小类', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 8 },
  { id: 'F5', fieldName: '需求来源', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 8 },
  { id: 'F6', fieldName: '需求优先级', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 12 },
  { id: 'F7', fieldName: '核心系统', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 12 },
  { id: 'F8', fieldName: '业务主管部门', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 12 },
  { id: 'F9', fieldName: '所属技术领域', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 12 },
  { id: 'F10', fieldName: '需求分点描述', fieldType: '多行文本', listDisplay: true, locked: false, required: true, previewSpan: 24 },
  { id: 'F11', fieldName: '需求依据', fieldType: '多行文本', listDisplay: true, locked: false, required: true, previewSpan: 24 },
  { id: 'F12', fieldName: '预期成效', fieldType: '多行文本', listDisplay: true, locked: false, required: true, previewSpan: 24 },
  { id: 'F13', fieldName: '建设可行性', fieldType: '多行文本', listDisplay: true, locked: false, required: true, previewSpan: 24 },
  { id: 'F14', fieldName: '建设内容', fieldType: '多行文本', listDisplay: true, locked: false, required: false, previewSpan: 24 },
  { id: 'F15', fieldName: '投资估算说明', fieldType: '多行文本', listDisplay: false, locked: false, required: false, previewSpan: 24 },
  { id: 'F16', fieldName: '备注', fieldType: '多行文本', listDisplay: false, locked: false, required: false, previewSpan: 24 }
];

/** 字段较少，用于验证预览区不足一屏时的最小高度效果 */
const shortFieldList = () => [
  { id: 'S1', fieldName: '任务需求名称', fieldType: '单行文本', listDisplay: true, locked: true, required: true, previewSpan: 24 },
  { id: 'S2', fieldName: '指南对应章节', fieldType: '单行文本', listDisplay: true, locked: true, required: true, previewSpan: 24 },
  { id: 'S3', fieldName: '需求优先级', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 12 },
  { id: 'S4', fieldName: '需求来源', fieldType: '下拉选择', listDisplay: true, locked: false, required: true, previewSpan: 12 }
];

function cloneFields(fields = []) {
  return fields.map((item) => ({ ...item }));
}

function buildTemplateList() {
  return [
    {
      id: 'TPL001',
      templateName: '2026年综合计划项目提报表单模板',
      investmentChannel: '综合计划',
      projectCategory: '咨询设计类',
      createTime: '2026-01-08 10:20:30',
      creator: '张',
      batchCount: 3,
      associatedBatches: '2026年综合计划数字化项目需求申报批次；2026年综合计划补增批次；2026年第一批数字化需求评审批次',
      fields: cloneFields(defaultFieldList())
    },
    {
      id: 'TPL002',
      templateName: '2026年省公司自控成本项目提报表单模板',
      investmentChannel: '省公司自控成本',
      projectCategory: '实施类',
      createTime: '2026-01-12 14:35:18',
      creator: '李',
      batchCount: 1,
      associatedBatches: '2026年省公司自控成本专项批次',
      fields: cloneFields(defaultFieldList())
    },
    {
      id: 'TPL003',
      templateName: '2025年数字化建设类提报表单模板',
      investmentChannel: '综合计划',
      projectCategory: '建设类',
      createTime: '2025-12-20 09:15:42',
      creator: '王',
      batchCount: 2,
      associatedBatches: '2025年数字化专项批次；2025年综合计划第三批次',
      fields: cloneFields(defaultFieldList())
    },
    {
      id: 'TPL004',
      templateName: '【示例】精简字段模板（内容不足一屏）',
      investmentChannel: '综合计划',
      projectCategory: '咨询设计类',
      createTime: '2026-03-01 11:00:00',
      creator: '赵',
      batchCount: 0,
      associatedBatches: '',
      fields: cloneFields(shortFieldList())
    }
  ];
}

function buildTemplatePool() {
  return [
    {
      id: 'POOL001',
      templateName: '综合计划标准提报模板',
      updateTime: '2026-02-10 16:20:00',
      fields: cloneFields(defaultFieldList())
    },
    {
      id: 'POOL002',
      templateName: '数字化项目实施模板',
      updateTime: '2026-01-28 11:08:33',
      fields: cloneFields(defaultFieldList())
    },
    {
      id: 'POOL003',
      templateName: '咨询设计类精简模板',
      updateTime: '2026-01-15 09:42:18',
      fields: cloneFields(defaultFieldList().slice(0, 12))
    },
    {
      id: 'POOL006',
      templateName: '【示例】精简字段模板（内容不足一屏）',
      updateTime: '2026-03-01 11:00:00',
      fields: cloneFields(shortFieldList())
    },
    {
      id: 'POOL004',
      templateName: '成本性项目提报模板',
      updateTime: '2025-12-30 15:55:06',
      fields: cloneFields(defaultFieldList())
    },
    {
      id: 'POOL005',
      templateName: '可研阶段需求模板',
      updateTime: '2025-11-18 08:30:12',
      fields: cloneFields(defaultFieldList())
    }
  ];
}

let templateList = buildTemplateList();
const templatePool = buildTemplatePool();
let templateIdSeed = 100;

function paginateList(list, page, rows) {
  const total = list.length;
  const start = (page - 1) * rows;
  return { total, rows: list.slice(start, start + rows) };
}

function filterTemplateList(searchObj, source = templateList) {
  let list = source.slice();
  if (searchObj.templateName) {
    list = list.filter((item) => item.templateName.includes(searchObj.templateName.trim()));
  }
  if (searchObj.projectType) {
    list = list.filter((item) => item.projectCategory === searchObj.projectType);
  }
  if (searchObj.investmentChannel) {
    list = list.filter((item) => item.investmentChannel === searchObj.investmentChannel);
  }
  return list;
}

function filterTemplatePool(searchObj, source = templatePool) {
  let list = source.slice();
  if (searchObj.templateName) {
    list = list.filter((item) => item.templateName.includes(searchObj.templateName.trim()));
  }
  return list;
}

function getTemplateDetail(templateId) {
  return templateList.find((item) => item.id === templateId) || null;
}

function getTemplatePoolItem(poolId) {
  return templatePool.find((item) => item.id === poolId) || null;
}

function saveTemplate(payload = {}, templateId = '') {
  if (templateId) {
    const index = templateList.findIndex((item) => item.id === templateId);
    if (index === -1) {
      return { success: false, message: '模板不存在' };
    }
    templateList.splice(index, 1, {
      ...templateList[index],
      ...payload,
      id: templateId
    });
    return { success: true, id: templateId };
  }

  templateIdSeed += 1;
  const newId = `TPL${String(templateIdSeed).padStart(3, '0')}`;
  const newItem = {
    id: newId,
    templateName: payload.templateName,
    investmentChannel: payload.investmentChannel,
    projectCategory: payload.projectCategory,
    createTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
    creator: '当前用户',
    batchCount: 0,
    associatedBatches: '',
    fields: cloneFields(payload.fields || defaultFieldList())
  };
  templateList.unshift(newItem);
  return { success: true, id: newId };
}

function deleteTemplate(templateId) {
  const index = templateList.findIndex((item) => item.id === templateId);
  if (index === -1) {
    return { success: false, message: '模板不存在' };
  }
  templateList.splice(index, 1);
  return { success: true };
}

export {
  investmentChannelOptions,
  projectTypeOptions,
  projectCategoryOptions,
  fieldTypeOptions,
  defaultFieldList,
  shortFieldList,
  filterTemplateList,
  filterTemplatePool,
  paginateList,
  getTemplateDetail,
  getTemplatePoolItem,
  saveTemplate,
  deleteTemplate
};
