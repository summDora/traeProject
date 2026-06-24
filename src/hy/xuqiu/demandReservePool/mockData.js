const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '数据工程类', value: '数据工程类' }
];

const reserveStatusOptions = [
  { key: '', value: '全部' },
  { key: '在库', value: '在库' },
  { key: '已出库', value: '已出库' },
  { key: '冻结', value: '冻结' }
];

const batchOptions = [
  { key: '', value: '全部', batchName: '全部', planYear: '' },
  { key: 'B2026-01', value: '2026综合计划数字化第一批次', batchName: '2026综合计划数字化第一批次', planYear: 2026 },
  { key: 'B2025-01', value: '2025综合计划补增批次', batchName: '2025综合计划补增批次', planYear: 2025 },
  { key: 'B2023-01', value: '综合计划数字化第一批次', batchName: '综合计划数字化第一批次', planYear: 2023 }
];

const unitOptions = [
  { key: '', value: '全部' },
  { key: 'U001', value: '设备部' },
  { key: 'U002', value: '数字化部' },
  { key: 'U003', value: '浙江电力交易中心' },
  { key: 'U004', value: '营销部' }
];

const priorityOptions = [
  { key: '优1', value: '优1' },
  { key: '优2', value: '优2' },
  { key: '优3', value: '优3' },
  { key: '一般', value: '一般' }
];

const tagOptions = ['重点需求', '数字化专项', '保供减碳', '安全合规', '创新试点'];

const reviewConclusions = ['通过', '原则通过', '修改后通过', '不通过'];
const coordinationResults = ['纳入储备', '纳入可研', '暂缓', '取消'];
const reserveStatuses = ['在库', '已出库', '冻结'];

function buildReserveList() {
  const batches = batchOptions.filter((item) => item.key);
  const units = unitOptions.filter((item) => item.key);
  const types = ['建设类', '运维类', '数据工程类'];
  const list = [];
  const baseDate = new Date('2026-03-01');

  for (let i = 1; i <= 48; i += 1) {
    const batch = batches[i % batches.length];
    const unit = units[i % units.length];
    const storageDate = new Date(baseDate);
    storageDate.setDate(baseDate.getDate() - i * 2);
    const closingDate = new Date(storageDate);
    closingDate.setHours(14, 30, 0, 0);

    list.push({
      id: `CB${1000 + i}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `${unit.value}需求储备项目${i}`,
      planYear: batch.planYear,
      batchCode: batch.key,
      batchName: batch.batchName,
      projectType: types[i % types.length],
      demandUnit: unit.value,
      demandUnitCode: unit.key,
      totalInvestment: (120 + i * 8.35).toFixed(2),
      reviewConclusion: reviewConclusions[i % reviewConclusions.length],
      coordinationResult: coordinationResults[i % coordinationResults.length],
      closingTime: `${closingDate.getFullYear()}-${String(closingDate.getMonth() + 1).padStart(2, '0')}-${String(closingDate.getDate()).padStart(2, '0')} ${String(closingDate.getHours()).padStart(2, '0')}:${String(closingDate.getMinutes()).padStart(2, '0')}`,
      closingStorageTime: storageDate.toISOString(),
      reserveStatus: reserveStatuses[i % 3],
      priority: priorityOptions[i % priorityOptions.length].key,
      tags: [tagOptions[i % tagOptions.length], tagOptions[(i + 2) % tagOptions.length]].slice(0, i % 2 === 0 ? 2 : 1),
      reviewOpinion: `审查意见：项目方案完整，建议${reviewConclusions[i % reviewConclusions.length]}。`,
      closingConclusion: '收口通过',
      closingOpinion: '材料齐全，同意入库储备。',
      materials: [
        { name: '可研报告', status: '已上传' },
        { name: '盖章封面', status: i % 3 === 0 ? '未上传' : '已上传' },
        { name: '服务内容附件', status: '已上传' },
        { name: '佐证材料', status: i % 4 === 0 ? '未上传' : '已上传' }
      ],
      flowSteps: ['需求申报', '审查评审', '需求统筹', '需求收口', '储备入库']
    });
  }
  return list;
}

const allReserveList = buildReserveList();

function sortReserveList(list) {
  return list.slice().sort(
    (a, b) => new Date(b.closingStorageTime) - new Date(a.closingStorageTime)
  );
}

function filterReserveList(searchObj, source = allReserveList) {
  let list = source.slice();

  if (searchObj.planYear) {
    list = list.filter((item) => String(item.planYear) === String(searchObj.planYear));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  if (searchObj.demandKeyword) {
    const keyword = searchObj.demandKeyword.trim();
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
  if (searchObj.reserveStatus) {
    list = list.filter((item) => item.reserveStatus === searchObj.reserveStatus);
  }

  return sortReserveList(list);
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function getReserveDetail(demandId) {
  return allReserveList.find((item) => item.id === demandId) || allReserveList[0];
}

function updateReserveTags(demandId, payload) {
  const item = allReserveList.find((row) => row.id === demandId);
  if (!item) return;
  Object.assign(item, payload);
}

export {
  projectTypeOptions,
  reserveStatusOptions,
  batchOptions,
  unitOptions,
  priorityOptions,
  tagOptions,
  allReserveList,
  filterReserveList,
  paginateList,
  getReserveDetail,
  updateReserveTags
};
