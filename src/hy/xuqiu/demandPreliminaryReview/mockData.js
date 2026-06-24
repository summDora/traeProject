const PRELIMINARY_STATUS_ORDER = {
  待初审: 0,
  初审中: 1,
  已通过: 2,
  已初审: 2,
  已驳回: 3
};

const preliminaryStatusOptions = [
  { key: '', value: '全部' },
  { key: '待初审', value: '待初审' },
  { key: '初审中', value: '初审中' },
  { key: '已通过', value: '已通过' },
  { key: '已初审', value: '已初审' },
  { key: '已驳回', value: '已驳回' }
];

const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const batchOptions = [
  { key: '', value: '全部', batchName: '全部', planYear: '' },
  { key: 'B2026-01', value: '2026综合计划数字化第一批次', batchName: '2026综合计划数字化第一批次', planYear: 2026 },
  { key: 'B2023-01', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2023 },
  { key: 'B2023-02', value: '综合计划数字化第二批次', batchName: '综合计划数字化第二批次', planYear: 2023 },
  { key: 'B2022-01', value: '营销投入批次', batchName: '营销投入批次', planYear: 2022 }
];

const unitOptions = [
  { key: '', value: '全部' },
  { key: 'U001', value: '设备部' },
  { key: 'U002', value: '数字化部' },
  { key: 'U003', value: '浙江电力交易中心' },
  { key: 'U004', value: '营销部' },
  { key: 'U005', value: '国网舟山供电公司' }
];

const functionCompareStatuses = ['未比对', '比对中', '已完成', '比对异常'];
const relevanceReviewStatuses = ['未审查', '审查中', '已完成', '审查异常'];
const preliminaryStatuses = ['待初审', '初审中', '已通过', '已初审', '已驳回'];

function buildDemandList() {
  const batches = batchOptions.filter((item) => item.key);
  const units = unitOptions.filter((item) => item.key);
  const types = ['建设类', '运维类', '数据工程类'];
  const list = [];
  const baseDate = new Date('2026-03-10');

  for (let i = 1; i <= 52; i += 1) {
    const batch = batches[i % batches.length];
    const unit = units[i % units.length];
    const submitDate = new Date(baseDate);
    submitDate.setDate(baseDate.getDate() - i);
    const preliminaryStatus = preliminaryStatuses[i % 5];
    const functionCompareResult = functionCompareStatuses[i % 4];
    const relevanceReviewResult = relevanceReviewStatuses[i % 4];
    const hasReport = functionCompareResult === '已完成' || relevanceReviewResult === '已完成';

    list.push({
      id: `CS${1000 + i}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `${unit.value}需求初审项目${i}`,
      planYear: batch.planYear,
      batchCode: batch.key,
      batchName: batch.batchName,
      projectType: types[i % types.length],
      demandUnit: unit.value,
      demandUnitCode: unit.key,
      totalInvestment: (80 + i * 6.5).toFixed(2),
      functionCompareResult,
      relevanceReviewResult,
      preliminaryStatus,
      submitTime: submitDate.toISOString(),
      hasReport,
      preliminaryConclusion: '',
      preliminaryOpinion: '',
      source: '需求申报',
      priority: i % 3 === 0 ? '优1' : '一般',
      businessCategory: types[i % types.length],
      businessDepartment: unit.value,
      materials: [
        { name: '需求申报书', status: '已上传' },
        { name: '附件材料', status: i % 4 === 0 ? '待上传' : '已上传' }
      ],
      functionCompareReport: hasReport ? '功能点提取完成，与标准功能基线比对一致。' : '',
      relevanceReviewReport: relevanceReviewResult === '已完成' ? '存在 2 个历史相似项目，风险等级：低。' : ''
    });
  }
  return list;
}

const allDemandList = buildDemandList();

function sortDemandList(list) {
  return list.slice().sort((a, b) => {
    const statusDiff = PRELIMINARY_STATUS_ORDER[a.preliminaryStatus] - PRELIMINARY_STATUS_ORDER[b.preliminaryStatus];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.submitTime) - new Date(a.submitTime);
  });
}

function filterDemandList(searchObj, source = allDemandList) {
  let list = source.slice();

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
  if (searchObj.demandUnitCode) {
    list = list.filter((item) => item.demandUnitCode === searchObj.demandUnitCode);
  }
  if (searchObj.preliminaryStatus) {
    list = list.filter((item) => item.preliminaryStatus === searchObj.preliminaryStatus);
  }

  return sortDemandList(list);
}

function buildBatchSummary(source = allDemandList) {
  const map = new Map();
  source.forEach((item) => {
    const key = item.batchCode;
    if (!map.has(key)) {
      map.set(key, {
        id: key,
        planYear: item.planYear,
        batchCode: item.batchCode,
        batchName: item.batchName,
        demandCount: 0,
        pendingCount: 0,
        reviewingCount: 0,
        archivedCount: 0
      });
    }
    const row = map.get(key);
    row.demandCount += 1;
    if (item.preliminaryStatus === '待初审') row.pendingCount += 1;
    else if (item.preliminaryStatus === '初审中') row.reviewingCount += 1;
    else row.archivedCount += 1;
  });
  return Array.from(map.values()).sort((a, b) => b.planYear - a.planYear);
}

function filterBatchSummary(searchObj) {
  let list = buildBatchSummary();
  if (searchObj.planYear) {
    list = list.filter((item) => String(item.planYear) === String(searchObj.planYear));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  return list;
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function getDemandDetail(demandId) {
  return allDemandList.find((item) => item.id === demandId) || allDemandList[0];
}

function updatePreliminaryReview(demandId, payload) {
  const item = allDemandList.find((row) => row.id === demandId);
  if (!item) return;
  Object.assign(item, payload);
  if (payload.preliminaryConclusion === '通过') {
    item.preliminaryStatus = '已通过';
  } else if (payload.preliminaryConclusion === '驳回') {
    item.preliminaryStatus = '已驳回';
  } else if (payload.preliminaryConclusion === '转专业审查') {
    item.preliminaryStatus = '已初审';
  }
}

function runFunctionCompare(ids) {
  allDemandList.forEach((item) => {
    if (ids.includes(item.id)) {
      item.functionCompareResult = '已完成';
      item.hasReport = true;
      item.functionCompareReport = '功能点提取完成，与业务蓝图、标准功能基线比对一致（模拟）。';
    }
  });
}

function runRelevanceReview(ids) {
  allDemandList.forEach((item) => {
    if (ids.includes(item.id)) {
      item.relevanceReviewResult = '已完成';
      item.hasReport = true;
      item.relevanceReviewReport = '历史项目关联性审查完成，发现 1 个相似项目（模拟）。';
    }
  });
}

function batchPreliminaryReview(ids, payload) {
  ids.forEach((id) => updatePreliminaryReview(id, payload));
}

export {
  PRELIMINARY_STATUS_ORDER,
  preliminaryStatusOptions,
  projectTypeOptions,
  batchOptions,
  unitOptions,
  allDemandList,
  filterDemandList,
  filterBatchSummary,
  paginateList,
  getDemandDetail,
  updatePreliminaryReview,
  runFunctionCompare,
  runRelevanceReview,
  batchPreliminaryReview
};
