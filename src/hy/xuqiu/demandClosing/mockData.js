const CLOSING_STATUS_ORDER = {
  待收口: 0,
  收口中: 1,
  已收口: 2,
  退回修改: 3
};

const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const closingStatusOptions = [
  { key: '', value: '全部' },
  { key: '待收口', value: '待收口' },
  { key: '收口中', value: '收口中' },
  { key: '已收口', value: '已收口' },
  { key: '退回修改', value: '退回修改' }
];

const batchOptions = [
  { key: '', value: '全部', batchName: '全部', planYear: '' },
  { key: 'B2025-01', value: '2025综合计划补增批次', batchName: '2025综合计划补增批次', planYear: 2025 },
  { key: 'B2023-01', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2023 },
  { key: 'B2023-02', value: '综合计划数字化第二批次', batchName: '综合计划数字化第二批次', planYear: 2023 }
];

const unitOptions = [
  { key: '', value: '全部' },
  { key: 'U001', value: '设备部' },
  { key: 'U002', value: '数字化部' },
  { key: 'U003', value: '浙江电力交易中心' },
  { key: 'U004', value: '营销部' }
];

const materialStatusList = ['待上传', '部分上传', '已上传'];
const aiCheckResults = ['未校核', '校核中', '通过', '存在差异', '校核异常'];
const hqStatusList = ['未报送', '已报送', '已反馈'];
const closingStatuses = ['待收口', '收口中', '已收口', '退回修改'];

function buildClosingList() {
  const units = unitOptions.filter((item) => item.key);
  const categories = ['建设类', '运维类', '数据工程类'];
  const list = [];

  for (let i = 1; i <= 52; i += 1) {
    const unit = units[i % units.length];
    const closingStatus = closingStatuses[i % 4];
    const finalUploaded = i % 3 !== 0 ? '是' : '否';
    const enteredFeasibility = i % 2 === 0 ? '是' : '否';
    list.push({
      id: `SK${1000 + i}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `${unit.value}需求收口项目${i}`,
      constructionDemandCode: `JSXQ2026-${String(i).padStart(4, '0')}`,
      demandUnit: unit.value,
      demandUnitCode: unit.key,
      constructionUnit: unit.value,
      constructionUnitCode: unit.key,
      reportUnit: unit.value,
      reportUnitCode: unit.key,
      businessCategory: categories[i % categories.length],
      closingStatus,
      splitMergeStatus: i % 5 === 0 ? '已合并' : '—',
      finalMaterialUploaded: finalUploaded,
      enteredFeasibility,
      materialStatus: materialStatusList[i % 3],
      aiCheckResult: aiCheckResults[i % 5],
      hqCoordinationStatus: hqStatusList[i % 3],
      coordinationFinishTime: `2025-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')} 14:00:00`,
      closingConclusion: '',
      closingOpinion: '',
      materials: {
        stampedCover: i % 3 !== 0,
        feasibilityReport: i % 2 === 0,
        serviceAttachment: i % 4 === 0,
        supportingMaterials: i % 5 === 0
      }
    });
  }
  return list;
}

const allClosingList = buildClosingList();

function sortClosingList(list) {
  return list.slice().sort((a, b) => {
    const statusDiff = CLOSING_STATUS_ORDER[a.closingStatus] - CLOSING_STATUS_ORDER[b.closingStatus];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.coordinationFinishTime) - new Date(a.coordinationFinishTime);
  });
}

function filterClosingList(searchObj, source = allClosingList) {
  let list = source.slice();
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode.trim()));
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName.trim()));
  }
  if (searchObj.constructionDemandCode) {
    list = list.filter((item) => item.constructionDemandCode.includes(searchObj.constructionDemandCode.trim()));
  }
  if (searchObj.constructionUnitCode) {
    list = list.filter((item) => item.constructionUnitCode === searchObj.constructionUnitCode);
  }
  if (searchObj.demandUnitCode) {
    list = list.filter((item) => item.demandUnitCode === searchObj.demandUnitCode);
  }
  if (searchObj.reportUnitCode) {
    list = list.filter((item) => item.reportUnitCode === searchObj.reportUnitCode);
  }
  if (searchObj.businessCategory) {
    list = list.filter((item) => item.businessCategory === searchObj.businessCategory);
  }
  if (searchObj.closingStatus) {
    list = list.filter((item) => item.closingStatus === searchObj.closingStatus);
  }
  if (searchObj.finalMaterialUploaded) {
    list = list.filter((item) => item.finalMaterialUploaded === searchObj.finalMaterialUploaded);
  }
  if (searchObj.enteredFeasibility) {
    list = list.filter((item) => item.enteredFeasibility === searchObj.enteredFeasibility);
  }
  return sortClosingList(list);
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function getClosingDetail(demandId) {
  return allClosingList.find((item) => item.id === demandId) || allClosingList[0];
}

function buildStampedCoverFileName(demandName) {
  return `任务需求说明书封面盖章-${demandName}`;
}

function getStampedCoverData(demandId) {
  const detail = getClosingDetail(demandId);
  const fileName = buildStampedCoverFileName(detail.demandName);
  const hasFile = detail.materials && detail.materials.stampedCover;
  return {
    demandId: detail.id,
    demandName: detail.demandName,
    reportUnit: detail.reportUnit || '电力调控中心',
    constructionUnit: detail.constructionUnit || '电力调控中心',
    approvalUnit: '数字化部',
    fileList: hasFile
      ? [{
        id: `SF-${detail.id}`,
        fileName,
        lastUpdater: '需求统筹12',
        lastUpdateTime: '2026-06-10 15:13:13'
      }]
      : [],
    sealRecognized: hasFile,
    sealResults: hasFile
      ? [
        { id: 1, content: '浙江省电力设计院有限公司' },
        { id: 2, content: '浙江省电力设计院有限公司' }
      ]
      : [],
    unitCompareResults: hasFile
      ? [
        { key: 'reportUnit', label: '提报单位', unitName: detail.reportUnit || '电力调控中心', status: 'inconsistent' },
        { key: 'constructionUnit', label: '建设单位', unitName: detail.constructionUnit || '电力调控中心', status: 'consistent' },
        { key: 'approvalUnit', label: '审批单位', unitName: '数字化部', status: 'notDetected' }
      ]
      : []
  };
}

function saveStampedCoverFile(demandId, fileMeta) {
  const item = allClosingList.find((row) => row.id === demandId);
  if (!item) return;
  if (!item.materials) {
    item.materials = {};
  }
  item.materials.stampedCover = true;
  return {
    id: `SF-${demandId}`,
    fileName: fileMeta.fileName,
    lastUpdater: fileMeta.lastUpdater || '当前用户',
    lastUpdateTime: fileMeta.lastUpdateTime || new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
  };
}

function removeStampedCoverFile(demandId) {
  const item = allClosingList.find((row) => row.id === demandId);
  if (!item || !item.materials) return;
  item.materials.stampedCover = false;
}

function runSealRecognition(demandId) {
  const detail = getClosingDetail(demandId);
  if (!detail.materials || !detail.materials.stampedCover) {
    return null;
  }
  return {
    sealResults: [
      { id: 1, content: '浙江省电力设计院有限公司' },
      { id: 2, content: '浙江省电力设计院有限公司' }
    ],
    unitCompareResults: [
      { key: 'reportUnit', label: '提报单位', unitName: detail.reportUnit || '电力调控中心', status: 'inconsistent' },
      { key: 'constructionUnit', label: '建设单位', unitName: detail.constructionUnit || '电力调控中心', status: 'consistent' },
      { key: 'approvalUnit', label: '审批单位', unitName: '数字化部', status: 'notDetected' }
    ]
  };
}

const CLOSING_MATERIAL_TAB_KEYS = [
  'requirementReport',
  'handSign',
  'preliminaryMaterials',
  'requirementBasis'
];

function buildClosingMaterialFileName(detail, tabKey) {
  const { demandCode, demandName } = detail;
  const nameMap = {
    requirementReport: `${demandCode}-${demandName}`,
    handSign: `${demandCode}-手签件-${demandName}`,
    preliminaryMaterials: `${demandCode}-佐证材料-${demandName}`,
    requirementBasis: `${demandCode}-需求依据-${demandName}`
  };
  return nameMap[tabKey] || `${demandCode}-${demandName}`;
}

function ensureClosingMaterialFiles(item) {
  if (!item.closingMaterialFiles) {
    item.closingMaterialFiles = {
      requirementReport: item.materials && item.materials.feasibilityReport
        ? [{
          id: `CM-RR-${item.id}`,
          fileName: buildClosingMaterialFileName(item, 'requirementReport'),
          lastUpdater: '需求统筹12',
          lastUpdateTime: '2026-06-10 15:13:13'
        }]
        : [],
      handSign: [],
      preliminaryMaterials: item.materials && item.materials.supportingMaterials
        ? [{
          id: `CM-PM-${item.id}`,
          fileName: buildClosingMaterialFileName(item, 'preliminaryMaterials'),
          lastUpdater: '需求统筹12',
          lastUpdateTime: '2026-06-10 14:20:00'
        }]
        : [],
      requirementBasis: []
    };
  }
  return item.closingMaterialFiles;
}

function getClosingMaterialData(demandId, tabKey = 'requirementReport') {
  const detail = getClosingDetail(demandId);
  const files = ensureClosingMaterialFiles(detail);
  return {
    demandId: detail.id,
    demandCode: detail.demandCode,
    demandName: detail.demandName,
    fileList: (files[tabKey] || []).slice()
  };
}

function saveClosingMaterialFile(demandId, tabKey, fileMeta) {
  const item = allClosingList.find((row) => row.id === demandId);
  if (!item) return null;
  const files = ensureClosingMaterialFiles(item);
  const saved = {
    id: `CM-${tabKey}-${demandId}-${Date.now()}`,
    fileName: fileMeta.fileName,
    lastUpdater: fileMeta.lastUpdater || '当前用户',
    lastUpdateTime: fileMeta.lastUpdateTime || new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
  };
  files[tabKey] = [saved];
  if (!item.materials) {
    item.materials = {};
  }
  const materialFlagMap = {
    requirementReport: 'feasibilityReport',
    handSign: 'handSign',
    preliminaryMaterials: 'supportingMaterials',
    requirementBasis: 'serviceAttachment'
  };
  const materialKey = materialFlagMap[tabKey];
  if (materialKey) {
    item.materials[materialKey] = true;
  }
  return saved;
}

function removeClosingMaterialFile(demandId, tabKey) {
  const item = allClosingList.find((row) => row.id === demandId);
  if (!item || !item.closingMaterialFiles) return;
  item.closingMaterialFiles[tabKey] = [];
  const materialFlagMap = {
    requirementReport: 'feasibilityReport',
    handSign: 'handSign',
    preliminaryMaterials: 'supportingMaterials',
    requirementBasis: 'serviceAttachment'
  };
  const materialKey = materialFlagMap[tabKey];
  if (materialKey && item.materials) {
    item.materials[materialKey] = false;
  }
}

function updateClosingDetail(demandId, payload) {
  const item = allClosingList.find((row) => row.id === demandId);
  if (!item) return;
  Object.assign(item, payload);
  if (payload.closingConclusion) {
    item.closingStatus = payload.closingConclusion === '退回修改' ? '退回修改' : '已收口';
  }
}

function runAiCheck(ids) {
  allClosingList.forEach((item) => {
    if (ids.includes(item.id)) {
      item.aiCheckResult = item.businessCategory === '建设类' ? '通过' : '存在差异';
    }
  });
}

function getAiCheckDetail(demandId) {
  const detail = getClosingDetail(demandId);
  const compareContent = {
    currentProblems: '目前系统功能分散，数据未打通，党建业务与综合管理缺乏统一入口。',
    mainWork: '建设党建引领综合管理平台，整合现有应用，实现业务协同与数据共享。',
    expectedResults: '形成统一管理平台，提升党建引领与综合管理工作效率。',
    businessBlueprint: '党建管理蓝图 V2.1',
    microApp: '党建综合应用',
    level1Function: '组织与队伍管理',
    projectPersonnel: '张三、李四、王五'
  };
  const functionRows = [
    {
      id: 'F1',
      level2Function: '书记队伍管理',
      briefBefore: '线下台账管理，信息更新滞后。',
      briefAfter: '线上统一管理，实时更新与查询。'
    },
    {
      id: 'F2',
      level2Function: '组织生活管理',
      briefBefore: '会议记录纸质存档，统计困难。',
      briefAfter: '全流程线上记录，自动汇总统计。'
    },
    {
      id: 'F3',
      level2Function: '党员发展管理',
      briefBefore: '流程节点靠人工跟踪。',
      briefAfter: '流程节点系统提醒与进度可视。'
    }
  ];
  return {
    demandId: detail.id,
    demandCode: detail.demandCode,
    demandName: detail.demandName,
    investmentChannel: '综合计划',
    projectCategory: '开发实施类',
    systemInfo: { ...compareContent },
    documentInfo: {
      ...compareContent,
      currentProblems: compareContent.currentProblems,
      mainWork: compareContent.mainWork.replace('整合现有应用', '整合相关应用'),
      briefBefore: functionRows[0].briefBefore
    },
    functionRows,
    documentFunctionRows: functionRows.map((row, index) => (
      index === 0
        ? { ...row, briefBefore: '线下台账管理，信息更新不及时。' }
        : { ...row }
    )),
    checkTabs: [
      { key: 'functionMapping', label: '功能映射核查', status: 'completed', statusText: '已完成' },
      { key: 'supportingMaterial', label: '佐证材料验证', status: 'processing', statusText: '校核中' },
      { key: 'feasibilityConsistency', label: '可研一致性校核', status: 'pending', statusText: '未校核' }
    ]
  };
}

function runCustomAiCheck(demandId, agentIds) {
  const detail = getClosingDetail(demandId);
  if (!detail) return;
  detail.aiCheckResult = agentIds.length === 3 ? '通过' : '校核中';
}

function runAllAiCheck(demandId) {
  runAiCheck([demandId]);
  const detail = getClosingDetail(demandId);
  if (detail) {
    detail.aiCheckResult = '通过';
  }
}

function submitClosing(ids) {
  allClosingList.forEach((item) => {
    if (ids.includes(item.id)) {
      item.closingStatus = '已收口';
    }
  });
}

function buildHqList() {
  const departments = ['数字化部', '设备部', '营销部'];
  const units = unitOptions.filter((item) => item.key);
  const hqStatuses = ['待推送', '待总部审核', '已反馈'];
  const list = [];

  for (let i = 1; i <= 30; i += 1) {
    const unit = units[i % units.length];
    list.push({
      id: `HQ${1000 + i}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `${unit.value}总部统筹报送需求${i}`,
      estimatedCost: (300 + i * 5.7).toFixed(2),
      businessDepartment: departments[i % departments.length],
      proposeUnit: unit.value,
      projectType: i % 2 === 0 ? '建设类' : '—',
      auditResult: i % 3 === 0 ? '通过' : '—',
      constructionForm: i % 4 === 0 ? '新建' : '—',
      status: hqStatuses[i % 3]
    });
  }
  return list;
}

const allHqList = buildHqList();

function filterHqList(searchObj, source = allHqList) {
  let list = source.slice();
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode));
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName));
  }
  if (searchObj.businessDepartment) {
    list = list.filter((item) => item.businessDepartment === searchObj.businessDepartment);
  }
  if (searchObj.proposeUnit) {
    list = list.filter((item) => item.proposeUnit.includes(searchObj.proposeUnit));
  }
  if (searchObj.projectType) {
    list = list.filter((item) => item.projectType === searchObj.projectType);
  }
  if (searchObj.auditResult) {
    list = list.filter((item) => item.auditResult === searchObj.auditResult);
  }
  if (searchObj.status) {
    list = list.filter((item) => item.status === searchObj.status);
  }
  if (searchObj.constructionForm) {
    list = list.filter((item) => item.constructionForm === searchObj.constructionForm);
  }
  return list;
}

export {
  CLOSING_STATUS_ORDER,
  projectTypeOptions,
  closingStatusOptions,
  batchOptions,
  unitOptions,
  allClosingList,
  allHqList,
  filterClosingList,
  filterHqList,
  paginateList,
  getClosingDetail,
  getStampedCoverData,
  saveStampedCoverFile,
  removeStampedCoverFile,
  runSealRecognition,
  getClosingMaterialData,
  saveClosingMaterialFile,
  removeClosingMaterialFile,
  buildClosingMaterialFileName,
  CLOSING_MATERIAL_TAB_KEYS,
  updateClosingDetail,
  runAiCheck,
  getAiCheckDetail,
  runCustomAiCheck,
  runAllAiCheck,
  submitClosing
};
