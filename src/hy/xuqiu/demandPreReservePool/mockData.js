const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const investmentChannelOptions = [
  { key: '综合计划', value: '综合计划' },
  { key: '成本性', value: '成本性' },
  { key: '资本性', value: '资本性' }
];

const batchOptions = [
  { key: '', value: '全部', batchName: '全部', planYear: '' },
  { key: 'B2026-01', value: '2026综合计划数字化第一批次', batchName: '2026综合计划数字化第一批次', planYear: 2026 },
  { key: 'B2025-01', value: '2025综合计划补增批次', batchName: '2025综合计划补增批次', planYear: 2025 },
  { key: 'B2023-01', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2023 }
];

const coreSystems = ['支撑管控平台', '营销系统', '生产管控系统', '数据中台'];
const departments = ['数字化部', '运检部', '营销部', '设备部', '调控中心'];
const businessCategories = ['业务赋能', '管理提升', '安全合规', '创新试点'];
const tagOptions = ['高优先级', 'GIS相关', '跨系统', '保供减碳', '安全合规'];

const assignableBatches = [
  {
    id: 'AB001',
    batchTitle: '26年综合计划预储备需求',
    batchCode: 'B2026-01',
    batchName: '综合计划数字化第一批次',
    investmentChannel: '综合计划',
    projectType: '建设类',
    startTime: '2025年12月12日',
    deadline: '2026年1月14日'
  },
  {
    id: 'AB002',
    batchTitle: '26年成本性预储备需求',
    batchCode: 'B2026-02',
    batchName: '成本性数字化第二批次',
    investmentChannel: '成本性',
    projectType: '运维类',
    startTime: '2025年11月20日',
    deadline: '2026年2月10日'
  },
  {
    id: 'AB003',
    batchTitle: '25年综合计划补增预储备',
    batchCode: 'B2025-01',
    batchName: '2025综合计划补增批次',
    investmentChannel: '综合计划',
    projectType: '数据工程类',
    startTime: '2025年8月1日',
    deadline: '2025年9月30日'
  }
];

function buildRelatedProjects(seed) {
  const statuses = [
    { status: '验收中', effect: '成效明显', cls: 'status-review' },
    { status: '建设中', effect: '成效一般', cls: 'status-build' },
    { status: '已完成', effect: '成效明显', cls: 'status-done' }
  ];
  return [0, 1, 2].map((idx) => {
    const s = statuses[(seed + idx) % statuses.length];
    return {
      projectCode: `P202${4 + idx}-${100 + seed + idx}`,
      projectName: `关联项目${seed + idx + 1}——电网数字化建设应用`,
      constructionUnit: departments[(seed + idx) % departments.length],
      projectStatus: s.status,
      statusClass: s.cls,
      effectResult: s.effect,
      effectClass: s.cls
    };
  });
}

function buildPreReserveList() {
  const types = ['建设类', '运维类', '数据工程类'];
  const channels = investmentChannelOptions.map((item) => item.key);
  const list = [];
  const baseDate = new Date('2026-03-15');

  for (let i = 1; i <= 35; i += 1) {
    const assigned = i % 4 !== 0;
    const batch = assigned ? batchOptions[(i % 3) + 1] : null;
    const storageDate = new Date(baseDate);
    storageDate.setDate(baseDate.getDate() - i);
    const channel = channels[i % channels.length];
    const projectType = types[i % types.length];
    const materialUploaded = i % 3 === 0;
    const dupPercent = i % 5 === 0 ? null : Number((Math.random() * 12 + 3).toFixed(2));

    list.push({
      id: `PR${String(1000 + i)}`,
      reserveCode: `YCB2026${String(i).padStart(4, '0')}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `基于电网一张图的${departments[i % departments.length]}健康管理深化应用需求${i}`,
      planYear: batch ? batch.planYear : 2026,
      batchCode: batch ? batch.key : '',
      batchName: batch ? batch.batchName : '待分配',
      investmentChannel: channel,
      projectType,
      coreSystem: coreSystems[i % coreSystems.length],
      totalInvestment: (480 + i * 12.5).toFixed(2),
      demandLeader: `负责人${(i % 5) + 1}`,
      demandDepartment: departments[i % departments.length],
      businessDepartment: departments[(i + 1) % departments.length],
      businessCategory: businessCategories[i % businessCategories.length],
      preReserveBatch: batch ? `${batch.planYear}年第一批` : '待分配',
      deptPriority: String((i % 3) + 1),
      materialUploadStatus: materialUploaded ? '已上传' : '待上传',
      duplicateResult: dupPercent != null ? `${dupPercent.toFixed(2)}%` : '未查重',
      duplicatePercent: dupPercent,
      duplicateReportName: dupPercent != null ? `查重报告_${i}.pdf` : '',
      storageTime: storageDate.toISOString(),
      formalDeclared: i % 17 === 0,
      hasStampedSummaryFile: materialUploaded,
      stampedSummaryFileName: materialUploaded ? `${departments[i % departments.length]}需求汇总表.docx` : '',
      remark: '',
      editRemark: '',
      tags: i % 2 === 0 ? [tagOptions[0], tagOptions[1]] : [tagOptions[2]],
      priority: String((i % 3) + 1),
      requirementDesc: '围绕电网一张图建设背景，开展变电站健康管理深化应用，提升设备状态感知与运维决策能力。',
      expectedGoals: '1. 实现变电站设备状态全景感知；\n2. 基于历史数据开展故障预警；\n3. 提升运维效率与决策准确性。',
      relatedProjects: buildRelatedProjects(i)
    });
  }

  return list;
}

const allPreReserveList = buildPreReserveList();

function sortPreReserveList(list) {
  return list.slice().sort((a, b) => {
    const timeDiff = new Date(b.storageTime) - new Date(a.storageTime);
    if (timeDiff !== 0) return timeDiff;
    return b.reserveCode.localeCompare(a.reserveCode);
  });
}

function filterPreReserveList(searchObj, source = allPreReserveList) {
  let list = source.filter((item) => !item.formalDeclared);

  if (searchObj.planYear) {
    list = list.filter((item) => String(item.planYear) === String(searchObj.planYear));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode.trim()));
  }
  if (searchObj.projectType) {
    list = list.filter((item) => item.projectType === searchObj.projectType);
  }

  return sortPreReserveList(list);
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function getPreReserveDetail(id) {
  return allPreReserveList.find((item) => item.id === id) || allPreReserveList[0];
}

function getAssignableBatches(investmentChannel, projectType) {
  return assignableBatches.filter(
    (item) => item.investmentChannel === investmentChannel && item.projectType === projectType
  );
}

function assignBatch(ids, batch) {
  allPreReserveList.forEach((item) => {
    if (!ids.includes(item.id)) return;
    item.batchCode = batch.batchCode;
    item.batchName = batch.batchName;
    item.planYear = batch.batchCode.includes('2026') ? 2026 : batch.batchCode.includes('2025') ? 2025 : 2023;
    item.preReserveBatch = `${item.planYear}年第一批`;
    if (item.batchName === '待分配') {
      item.batchName = batch.batchName;
    }
  });
}

function uploadStampedSummary(ids, fileName) {
  allPreReserveList.forEach((item) => {
    if (!ids.includes(item.id)) return;
    item.materialUploadStatus = '已上传';
    item.hasStampedSummaryFile = true;
    item.stampedSummaryFileName = fileName;
  });
}

function deletePreReserve(ids) {
  ids.forEach((id) => {
    const idx = allPreReserveList.findIndex((item) => item.id === id);
    if (idx !== -1) allPreReserveList.splice(idx, 1);
  });
}

function updatePreReserveEdit(id, payload) {
  const item = allPreReserveList.find((row) => row.id === id);
  if (!item) return;
  Object.assign(item, payload);
}

function invalidatePreReserve(id) {
  const idx = allPreReserveList.findIndex((item) => item.id === id);
  if (idx !== -1) allPreReserveList.splice(idx, 1);
}

function formatExportDate() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

export {
  projectTypeOptions,
  investmentChannelOptions,
  batchOptions,
  tagOptions,
  assignableBatches,
  allPreReserveList,
  filterPreReserveList,
  paginateList,
  getPreReserveDetail,
  getAssignableBatches,
  assignBatch,
  uploadStampedSummary,
  deletePreReserve,
  updatePreReserveEdit,
  invalidatePreReserve,
  formatExportDate
};
