const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const demandStatusOptions = [
  { key: '', value: '全部' },
  { key: '暂存', value: '暂存' },
  { key: '驳回', value: '驳回' },
  { key: '已提交', value: '已提交' },
  { key: '审查中', value: '审查中' }
];

const investmentChannelOptions = [
  { key: '', value: '全部' },
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
const leaders = ['张三', '李四', '王五', '赵六'];
const selfReviewResults = ['未审查', '审查中', '已完成', '存在风险'];

function buildBatchList() {
  const types = ['建设类', '运维类', '数据工程类'];
  const channels = ['综合计划', '成本性', '资本性'];
  const list = [];

  for (let i = 1; i <= 12; i += 1) {
    const batch = batchOptions[(i % 3) + 1];
    list.push({
      id: `BT${100 + i}`,
      batchTitle: `${batch.planYear}年${channels[i % 3]}需求申报批次${i}`,
      planYear: batch.planYear,
      batchCode: batch.key,
      batchName: batch.batchName,
      investmentChannel: channels[i % 3],
      projectCategory: types[i % 3],
      launchTime: `2026-${String((i % 12) + 1).padStart(2, '0')}-01`,
      deadline: `2026-${String((i % 12) + 2).padStart(2, '0')}-28`,
      initiator: leaders[i % leaders.length],
      reportProgress: `${8 + (i % 5)}/${12 + (i % 3)}`,
      declareCount: 10 + i * 2,
      declareFee: (120 + i * 15.6).toFixed(2),
      overBudget: i % 4 === 0 ? '是' : '否'
    });
  }
  return list;
}

function buildDeclarationList() {
  const types = ['建设类', '运维类', '数据工程类'];
  const statuses = ['暂存', '驳回', '已提交', '审查中'];
  const list = [];
  const baseDate = new Date('2026-03-18');

  for (let i = 1; i <= 48; i += 1) {
    const batch = batchOptions[(i % 3) + 1];
    const saveDate = new Date(baseDate);
    saveDate.setHours(18 - (i % 8), 30, 0, 0);
    saveDate.setDate(baseDate.getDate() - Math.floor(i / 3));
    const status = statuses[i % 4];
    const completionStatus = i % 3 === 0 ? '待完善' : '已完善';
    const stampedSummaryStatus = i % 4 === 0 ? '待上传' : '已上传';

    list.push({
      id: `SB${1000 + i}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `基于电网一张图的${departments[i % departments.length]}健康管理深化应用需求${i}`,
      planYear: batch.planYear,
      batchCode: batch.key,
      batchName: batch.batchName,
      projectType: types[i % types.length],
      coreSystem: coreSystems[i % coreSystems.length],
      totalInvestment: (80 + i * 7.25).toFixed(2),
      demandDepartment: departments[i % departments.length],
      demandLeader: leaders[i % leaders.length],
      selfReviewResult: selfReviewResults[i % 4],
      demandStatus: status,
      completionStatus,
      stampedSummaryStatus,
      saveTime: saveDate.toISOString(),
      fromPreReserve: i % 6 === 0,
      reserveCode: i % 6 === 0 ? `YCB2026${String(i).padStart(4, '0')}` : '',
      investmentChannel: ['综合计划', '成本性', '资本性'][i % 3],
      projectCategory: types[i % types.length],
      businessDepartment: departments[i % departments.length],
      demandSource: '需求申报',
      priority: i % 3 === 0 ? '优1' : '一般',
      requirementDesc: `需求描述内容${i}`,
      expectedGoals: `预期成效${i}`,
      attachments: [
        { name: '需求文档', required: true, status: i % 4 === 0 ? '未上传' : '已上传' },
        { name: '需求提出依据', required: false, status: i % 5 === 0 ? '未上传' : '已上传' },
        { name: '佐证材料', required: false, status: '未上传' }
      ]
    });
  }
  return list;
}

const allBatchList = buildBatchList();
const allDeclarationList = buildDeclarationList();

function sortDeclarationList(list) {
  return list.slice().sort((a, b) => {
    const timeDiff = new Date(b.saveTime) - new Date(a.saveTime);
    if (timeDiff !== 0) return timeDiff;
    return b.demandCode.localeCompare(a.demandCode);
  });
}

function filterBatchList(searchObj, source = allBatchList) {
  let list = source.slice();
  if (searchObj.batchTitle) {
    list = list.filter((item) => item.batchTitle.includes(searchObj.batchTitle.trim()));
  }
  if (searchObj.planYear) {
    list = list.filter((item) => String(item.planYear) === String(searchObj.planYear));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  if (searchObj.investmentChannel) {
    list = list.filter((item) => item.investmentChannel === searchObj.investmentChannel);
  }
  return list;
}

function filterDeclarationList(searchObj, source = allDeclarationList) {
  let list = source.slice();

  if (searchObj.selectedBatchCode) {
    list = list.filter((item) => item.batchCode === searchObj.selectedBatchCode);
  }
  if (searchObj.planYear) {
    list = list.filter((item) => String(item.planYear) === String(searchObj.planYear));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode.trim()));
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName.trim()));
  }
  if (searchObj.projectType) {
    list = list.filter((item) => item.projectType === searchObj.projectType);
  }
  if (searchObj.demandStatus) {
    list = list.filter((item) => item.demandStatus === searchObj.demandStatus);
  }

  return sortDeclarationList(list);
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function getSelectablePreReserve(batchContext = {}) {
  return allDeclarationList
    .filter((item) => item.fromPreReserve)
    .slice(0, 15)
    .map((item, index) => ({
      id: `PRSEL${index + 1}`,
      demandCode: item.demandCode,
      demandName: item.demandName,
      reserveCode: item.reserveCode || `YCB2026${String(index + 1).padStart(4, '0')}`,
      totalInvestment: item.totalInvestment,
      demandDepartment: item.demandDepartment,
      demandLeader: item.demandLeader,
      investmentChannel: batchContext.investmentChannel || item.investmentChannel,
      projectCategory: batchContext.projectCategory || item.projectType,
      used: index % 5 === 0
    }))
    .filter((item) => !item.used);
}

function filterPreReserveSelect(searchObj, batchContext = {}) {
  let list = getSelectablePreReserve(batchContext);
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode.trim()));
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName.trim()));
  }
  if (searchObj.reserveCode) {
    list = list.filter((item) => item.reserveCode.includes(searchObj.reserveCode.trim()));
  }
  if (searchObj.demandDepartment) {
    list = list.filter((item) => item.demandDepartment.includes(searchObj.demandDepartment.trim()));
  }
  return list;
}

function getDeclarationDetail(id) {
  return allDeclarationList.find((item) => item.id === id);
}

function createDraft(payload = {}) {
  const batch = batchOptions.find((item) => item.key === payload.batchCode) || batchOptions[1];
  const nextIndex = allDeclarationList.length + 1;
  const now = new Date().toISOString();
  const row = {
    id: `SB${2000 + nextIndex}`,
    demandCode: payload.demandCode || `XX2026KFSS${String(nextIndex).padStart(3, '0')}`,
    demandName: payload.demandName || `新增需求${nextIndex}`,
    planYear: batch.planYear,
    batchCode: batch.key,
    batchName: batch.batchName,
    projectType: payload.projectType || batch.projectCategory || '建设类',
    coreSystem: payload.coreSystem || coreSystems[0],
    totalInvestment: payload.totalInvestment || '0.00',
    demandDepartment: payload.demandDepartment || departments[0],
    demandLeader: payload.demandLeader || leaders[0],
    selfReviewResult: '未审查',
    demandStatus: '暂存',
    completionStatus: payload.completionStatus || '待完善',
    stampedSummaryStatus: '待上传',
    saveTime: now,
    fromPreReserve: !!payload.fromPreReserve,
    reserveCode: payload.reserveCode || '',
    investmentChannel: payload.investmentChannel || '综合计划',
    projectCategory: payload.projectCategory || '建设类',
    businessDepartment: payload.demandDepartment || departments[0],
    demandSource: payload.fromPreReserve ? '预储备库' : '需求申报',
    priority: '一般',
    requirementDesc: payload.requirementDesc || '',
    expectedGoals: payload.expectedGoals || '',
    attachments: payload.attachments || [
      { name: '需求文档', required: true, status: '未上传' },
      { name: '需求提出依据', required: false, status: '未上传' },
      { name: '佐证材料', required: false, status: '未上传' }
    ]
  };
  allDeclarationList.unshift(row);
  return row;
}

function updateDeclaration(id, payload) {
  const item = allDeclarationList.find((row) => row.id === id);
  if (!item) return null;
  Object.assign(item, payload, { saveTime: new Date().toISOString() });
  if (payload.completionStatus === '已完善' && item.attachments.every((file) => !file.required || file.status === '已上传')) {
    item.completionStatus = '已完善';
  }
  return item;
}

function deleteDeclarations(ids) {
  const deletable = ['暂存', '驳回'];
  const blocked = allDeclarationList.filter((item) => ids.includes(item.id) && !deletable.includes(item.demandStatus));
  if (blocked.length) return { success: false, message: '已提交或已进入审查流程的数据不允许删除' };
  ids.forEach((id) => {
    const index = allDeclarationList.findIndex((item) => item.id === id);
    if (index > -1) allDeclarationList.splice(index, 1);
  });
  return { success: true };
}

function runDuplicateCheck(ids) {
  allDeclarationList.forEach((item) => {
    if (ids.includes(item.id)) {
      item.selfReviewResult = item.demandCode.endsWith('1') ? '存在风险' : '已完成';
    }
  });
}

function runHistoryRelevanceReview(ids) {
  allDeclarationList.forEach((item) => {
    if (ids.includes(item.id)) {
      item.selfReviewResult = '已完成';
    }
  });
}

function canSubmit(row) {
  return row.completionStatus === '已完善' && row.stampedSummaryStatus === '已上传';
}

function submitDeclarations(ids) {
  const rows = allDeclarationList.filter((item) => ids.includes(item.id));
  const invalid = rows.filter((item) => !canSubmit(item));
  if (invalid.length) {
    return { success: false, message: '存在未完善或未上传盖章版需求汇总表的需求，请核查后提交！' };
  }
  rows.forEach((item) => {
    item.demandStatus = '已提交';
  });
  return { success: true };
}

export {
  projectTypeOptions,
  demandStatusOptions,
  investmentChannelOptions,
  batchOptions,
  departments,
  allBatchList,
  allDeclarationList,
  filterBatchList,
  filterDeclarationList,
  filterPreReserveSelect,
  paginateList,
  getDeclarationDetail,
  createDraft,
  updateDeclaration,
  deleteDeclarations,
  runDuplicateCheck,
  runHistoryRelevanceReview,
  submitDeclarations,
  canSubmit
};
