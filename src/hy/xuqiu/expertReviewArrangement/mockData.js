const demandStatusOptions = [
  { key: '', value: '全部' },
  { key: '已提报', value: '已提报' },
  { key: '延审', value: '延审' },
  { key: '内审中', value: '内审中' },
  { key: '评审中', value: '评审中' },
  { key: '已评审', value: '已评审' },
  { key: '已收口', value: '已收口' }
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

const applicants = ['张磊', '李明', '王芳', '赵强', '陈静'];

function buildReviewRecordsFromDemands(demands = []) {
  const recordStatuses = ['已收口', '评审中', '已评审', '内审中'];
  const featured = {
    demandCode: 'XX2026CPGZ016',
    demandName: '国网浙江电力-丽水公司网络及安全设备老旧日更换项目-产品购置',
    demandUnit: '丽水供电公司',
    demandStatus: '已收口'
  };

  return demands.map((demand, index) => {
    const batch = allBatchList.find((item) => item.batchCode === demand.batchCode);
    const useFeatured = index === 0;
    return {
      id: `RR${demand.id}`,
      demandId: demand.id,
      demandCode: useFeatured ? featured.demandCode : demand.demandCode,
      demandName: useFeatured ? featured.demandName : demand.demandName,
      applicant: applicants[index % applicants.length],
      applyTime: `2026-03-${String(10 + (index % 18)).padStart(2, '0')} 14:${String(20 + index).padStart(2, '0')}:00`,
      batchName: batch ? batch.batchName : '',
      demandUnit: useFeatured ? featured.demandUnit : demand.demandUnit,
      demandStatus: useFeatured ? featured.demandStatus : recordStatuses[index % recordStatuses.length],
      canWithdraw: index % 3 !== 2
    };
  });
}

function filterReviewRecordList(searchObj, source = []) {
  let list = source.slice();

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

function withdrawReviewOpinion(recordId, source = []) {
  const item = source.find((row) => row.id === recordId);
  if (!item) return { success: false, message: '记录不存在' };
  if (!item.canWithdraw) return { success: false, message: '当前状态不可撤回' };
  item.canWithdraw = false;
  return { success: true };
}

const systemNameOptions = [
  { key: '', value: '全部' },
  { key: '能源互联网营销服务系统', value: '能源互联网营销服务系统' }
];

const microAppOptions = [
  { key: '', value: '全部' },
  { key: '95598客户服务', value: '95598客户服务' },
  { key: '电网接入', value: '电网接入' }
];

const level1FunctionOptions = [
  { key: '', value: '全部' },
  { key: '客户诉求处理', value: '客户诉求处理' },
  { key: '业扩报装', value: '业扩报装' }
];

function getCentralizedReviewDetail(demandId, batchContext = {}) {
  const demand = allDemandList.find((item) => item.id === demandId) || {};
  const batch = allBatchList.find((item) => item.batchCode === demand.batchCode)
    || batchContext
    || {};

  return {
    demandId: demand.id || demandId,
    demandCode: demand.demandCode || 'XX2024KFSS017',
    demandName: demand.demandName || '党建引领综合管理平台应用场景建设项目',
    batchName: batch.batchName || '2024综合计划数字化第一批次',
    batchTitle: batch.batchTitle || '',
    demandSource: '需求申报',
    demandPriority: '一般',
    professionalCategory: '数字化',
    businessDepartment: demand.manageDepartment || '数字化部',
    majorCategory: '建设类',
    minorCategory: '应用建设',
    currentIssues: '现有系统功能分散，数据共享能力不足，难以支撑业务协同。',
    mainWork: '建设统一管理平台，整合现有应用，实现数据互通与业务联动。',
    expectedResults: '提升管理效率，降低运维成本，支撑数字化转型目标。',
    demandBasis: '根据国家电网公司数字化转型相关要求编制。',
    businessPoints: '1. 统一门户入口；2. 数据汇聚展示；3. 业务流程在线办理。',
    businessStatus: '目前以线下流程为主，信息化支撑不足。',
    feasibility: '技术方案成熟，实施风险可控。',
    applicationScope: '省公司及下属单位相关业务部门。',
    implementationDesc: '本期完成核心功能开发与试点上线。',
    previousProjectCode: '—',
    previousProjectName: '—',
    costFee: demand.estimatedCost || '120.00',
    capitalFee: '0.00',
    teamUnit: demand.demandUnit || '数字化部',
    submitter: '张磊',
    blueprintName: '营销业务蓝图 V2.0',
    baselineName: '标准功能基线库-营销域',
    duplicateResult: demand.duplicateResult || '9.47%',
    relevanceLevel: demand.relevanceLevel || '中',
    businessSystemStatus: '所属业务系统运行稳定，具备接入条件。',
    previousProjectStatus: '前期无关联在建项目。',
    baselineTree: [
      {
        label: '能源互联网营销服务系统',
        children: [
          {
            label: '95598客户服务',
            children: [
              { label: '客户诉求处理', status: '成效显著', statusType: 'good' },
              { label: '投诉建议管理', status: '成效较好', statusType: 'better' }
            ]
          },
          {
            label: '电网接入',
            children: [
              { label: '业扩报装', status: '成效一般', statusType: 'normal' },
              { label: '用电检查', status: '成效较差', statusType: 'poor' }
            ]
          }
        ]
      }
    ]
  };
}

function submitCentralizedReview(demandId, payload = {}) {
  const demand = allDemandList.find((item) => item.id === demandId);
  if (demand) {
    demand.reviewProgress = '已评审';
    demand.demandStatus = '已评审';
  }
  return { success: true, opinion: payload.opinion || '' };
}

export {
  demandStatusOptions,
  investmentChannelOptions,
  professionalTypeOptions,
  systemNameOptions,
  microAppOptions,
  level1FunctionOptions,
  allBatchList,
  allDemandList,
  filterBatchList,
  filterDemandList,
  filterReviewRecordList,
  buildReviewRecordsFromDemands,
  withdrawReviewOpinion,
  getCentralizedReviewDetail,
  submitCentralizedReview,
  paginateList
};
