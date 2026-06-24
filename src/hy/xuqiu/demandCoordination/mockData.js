const STATUS_ORDER = {
  待统筹: 0,
  统筹中: 1,
  已统筹: 2,
  退回: 3
};

const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const coordinationStatusOptions = [
  { key: '', value: '全部' },
  { key: '待统筹', value: '待统筹' },
  { key: '统筹中', value: '统筹中' },
  { key: '已统筹', value: '已统筹' },
  { key: '退回', value: '退回' }
];

const batchOptions = [
  { key: '', value: '全部', batchName: '全部', planYear: '' },
  { key: 'B2023-01', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2023 },
  { key: 'B2023-02', value: '综合计划数字化第二批次', batchName: '综合计划数字化第二批次', planYear: 2023 },
  { key: 'B2023-03', value: '电力交易中心批次', batchName: '电力交易中心批次', planYear: 2023 },
  { key: 'B2022-01', value: '营销投入批次', batchName: '营销投入批次', planYear: 2022 },
  { key: 'B2022-02', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2022 }
];

const unitOptions = [
  { key: '', value: '全部' },
  { key: 'U001', value: '设备部' },
  { key: 'U002', value: '数字化部' },
  { key: 'U003', value: '营销部' },
  { key: 'U004', value: '财务部' }
];

function buildDemandList() {
  const batches = batchOptions.filter((item) => item.key);
  const units = unitOptions.filter((item) => item.key);
  const types = ['建设类', '运维类', '数据工程类'];
  const statuses = ['待统筹', '统筹中', '已统筹', '退回'];
  const conclusions = ['通过', '原则通过', '修改后通过', '不通过'];
  const results = ['纳入储备', '暂缓', '取消', '—'];

  const list = [];
  for (let i = 1; i <= 48; i += 1) {
    const batch = batches[i % batches.length];
    const unit = units[i % units.length];
    const status = statuses[i % 4];
    list.push({
      id: `D${1000 + i}`,
      demandCode: `XQ2024${String(i).padStart(4, '0')}`,
      demandName: `${batch.batchName}需求项目${i}`,
      planYear: batch.planYear,
      batchCode: batch.key,
      batchName: batch.batchName,
      projectType: types[i % types.length],
      demandUnit: unit.value,
      demandUnitCode: unit.key,
      totalInvestment: (120 + i * 3.5).toFixed(2),
      reviewConclusion: conclusions[i % conclusions.length],
      coordinationStatus: status,
      coordinationResult: status === '已统筹' ? results[i % 3] : '—',
      reviewFinishTime: `2024-${String((i % 12) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')} 10:00:00`
    });
  }
  return list;
}

const allDemandList = buildDemandList();

function buildBatchSummaryList() {
  return batchOptions
    .filter((item) => item.key)
    .map((batch) => {
      const demands = allDemandList.filter((item) => item.batchCode === batch.key);
      const proposedFeasibilityCount = demands.filter(
        (item) => item.coordinationResult === '纳入储备'
      ).length;
      return {
        id: batch.key,
        batchCode: batch.key,
        batchName: batch.batchName,
        planYear: batch.planYear,
        demandCount: demands.length || '',
        proposedFeasibilityCount
      };
    });
}

const allBatchSummaryList = buildBatchSummaryList();

function filterBatchList(searchObj, source = allBatchSummaryList) {
  let list = source.slice();
  if (searchObj.planYear) {
    list = list.filter((item) => String(item.planYear) === String(searchObj.planYear));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  return list.sort((a, b) => b.planYear - a.planYear);
}

function sortDemandList(list) {
  return list.slice().sort((a, b) => {
    const statusDiff = STATUS_ORDER[a.coordinationStatus] - STATUS_ORDER[b.coordinationStatus];
    if (statusDiff !== 0) return statusDiff;
    return new Date(b.reviewFinishTime) - new Date(a.reviewFinishTime);
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
  if (searchObj.demandQuery) {
    const keyword = searchObj.demandQuery.trim();
    list = list.filter(
      (item) => item.demandCode.includes(keyword) || item.demandName.includes(keyword)
    );
  }
  if (searchObj.projectType) {
    list = list.filter((item) => item.projectType === searchObj.projectType);
  }
  if (searchObj.demandUnitCode) {
    list = list.filter((item) => item.demandUnitCode === searchObj.demandUnitCode);
  }
  if (searchObj.coordinationStatus) {
    list = list.filter((item) => item.coordinationStatus === searchObj.coordinationStatus);
  }
  return sortDemandList(list);
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function getManageList(batchName, batchCode) {
  const units = ['设备部', '数字化部', '营销部', '财务部', '后勤部'];
  return units.map((unit, index) => ({
    id: `M${index + 1}`,
    unitName: unit,
    standardCost: (800 + index * 120).toFixed(2),
    adjustedCost: (600 + index * 90).toFixed(2),
    recommendCount: 2 + (index % 3),
    recommendCost: (400 + index * 70).toFixed(2),
    batchName
  }));
}

function getOverviewList(batchKey, searchObj = {}) {
  let list = allDemandList.filter((item) => {
    if (!batchKey) return true;
    return item.batchCode === batchKey || item.batchName === batchKey;
  });
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode));
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName));
  }
  if (searchObj.reviewConclusion) {
    list = list.filter((item) => item.reviewConclusion === searchObj.reviewConclusion);
  }
  if (searchObj.proposedFeasibility) {
    list = list.filter((item) => item.coordinationResult === searchObj.proposedFeasibility);
  }
  return sortDemandList(list);
}

function getCoordinationInfo(demandId) {
  const demand = allDemandList.find((item) => item.id === demandId) || allDemandList[0];
  return {
    demand,
    reviewConclusion: demand.demandName,
    expertScore: '—',
    digitalScore: '—',
    totalScore: '—',
    coordinationGrade: '—',
    proposedFeasibility: demand.coordinationStatus === '已统筹' ? '是' : '否',
    gridResult: '—',
    gridProjectStatus: '—',
    gridDescription: '—',
    remark: '—'
  };
}

function batchUpdateCoordination(ids, payload) {
  allDemandList.forEach((item) => {
    if (ids.includes(item.id)) {
      if (payload.coordinationStatus) item.coordinationStatus = payload.coordinationStatus;
      if (payload.coordinationResult) item.coordinationResult = payload.coordinationResult;
    }
  });
}

export {
  STATUS_ORDER,
  projectTypeOptions,
  coordinationStatusOptions,
  batchOptions,
  unitOptions,
  allDemandList,
  allBatchSummaryList,
  filterDemandList,
  filterBatchList,
  paginateList,
  getManageList,
  getOverviewList,
  getCoordinationInfo,
  batchUpdateCoordination
};
