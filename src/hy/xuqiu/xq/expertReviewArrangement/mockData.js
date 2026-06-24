const demandStatusOptions = [
  { key: '', value: '全部' },
  { key: '已提报', value: '已提报' },
  { key: '延审', value: '延审' },
  { key: '内审中', value: '内审中' },
  { key: '评审中', value: '评审中' },
  { key: '已评审', value: '已评审' }
];

const investmentChannelOptions = [
  { key: '', value: '全部' },
  { key: '综合计划', value: '综合计划' },
  { key: '成本性', value: '成本性' },
  { key: '资本性', value: '资本性' }
];

const professionalTypeOptions = [
  { key: '', value: '全部' },
  { key: '数字化', value: '数字化' },
  { key: '运检', value: '运检' },
  { key: '营销', value: '营销' },
  { key: '调控', value: '调控' }
];

const relevanceLevels = ['高', '极高', '中', '低'];
const departments = ['数字化部', '运检部', '营销部', '设备部', '调控中心'];
const reportUnits = ['省公司本部', '南京供电公司', '苏州供电公司', '无锡供电公司'];
const creators = ['张三', '李四', '王五', '赵六'];
const meetingNames = [
  '2026年第一批数字化需求评审会',
  '2026年综合计划补增评审会',
  '2025年数字化专项评审会',
  '2026年运检专业需求评审会'
];

function buildBatchList() {
  const channels = ['综合计划', '成本性', '资本性'];
  const types = ['数字化', '运检', '营销', '调控'];
  const list = [];

  for (let i = 1; i <= 15; i += 1) {
    const year = 2026 - (i % 3);
    list.push({
      id: `ERB${100 + i}`,
      meetingName: meetingNames[i % meetingNames.length],
      planYear: year,
      batchName: `${year}综合计划数字化第${(i % 3) + 1}批次`,
      batchTitle: `${year}年${channels[i % 3]}需求申报批次${i}`,
      batchCode: `B${year}-${String(i).padStart(2, '0')}`,
      applyStartTime: `${year}-0${(i % 9) + 1}-01 08:00:00`,
      applyEndTime: `${year}-0${(i % 9) + 2}-28 18:00:00`,
      investmentChannel: channels[i % 3],
      professionalType: types[i % types.length],
      creator: creators[i % creators.length],
      createTime: `${year}-0${(i % 9) + 1}-15 10:${String(i % 60).padStart(2, '0')}:00`
    });
  }
  return list;
}

function buildDemandList() {
  const statuses = ['已提报', '延审', '内审中', '评审中', '已评审'];
  const groups = ['第一组', '第二组', '第三组', '第四组'];
  const list = [];
  const batches = buildBatchList();

  for (let i = 1; i <= 60; i += 1) {
    const batch = batches[(i % batches.length)];
    list.push({
      id: `ERD${1000 + i}`,
      batchCode: batch.batchCode,
      groupName: groups[i % groups.length],
      reviewNumber: `PS${String(i).padStart(4, '0')}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `基于电网一张图的${departments[i % departments.length]}健康管理深化应用需求${i}`,
      demandStatus: statuses[i % statuses.length],
      manageDepartment: departments[i % departments.length],
      reviewProgress: i % 4 === 0 ? '待评审' : '评审中',
      demandUnit: departments[i % departments.length],
      estimatedCost: (80 + i * 6.35).toFixed(2),
      reportUnit: reportUnits[i % reportUnits.length],
      duplicateResult: `${(5 + (i % 50) * 0.17).toFixed(2)}%`,
      relevanceLevel: relevanceLevels[i % relevanceLevels.length]
    });
  }
  return list;
}

const allBatchList = buildBatchList();
const allDemandList = buildDemandList();

function filterBatchList(searchObj, source = allBatchList) {
  let list = source.slice();
  if (searchObj.meetingName) {
    list = list.filter((item) => item.meetingName.includes(searchObj.meetingName.trim()));
  }
  return list;
}

function filterDemandList(searchObj, source = allDemandList) {
  let list = source.slice();

  if (searchObj.selectedBatchCode) {
    list = list.filter((item) => item.batchCode === searchObj.selectedBatchCode);
  }
  if (searchObj.demandCode) {
    list = list.filter((item) => item.demandCode.includes(searchObj.demandCode.trim()));
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName.trim()));
  }
  if (searchObj.demandUnit) {
    list = list.filter((item) => item.demandUnit.includes(searchObj.demandUnit.trim()));
  }
  if (searchObj.demandStatus) {
    list = list.filter((item) => item.demandStatus === searchObj.demandStatus);
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

export {
  demandStatusOptions,
  investmentChannelOptions,
  professionalTypeOptions,
  allBatchList,
  allDemandList,
  filterBatchList,
  filterDemandList,
  paginateList
};
