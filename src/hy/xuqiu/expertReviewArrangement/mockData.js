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

function getCentralizedReviewDetail(demandId, batchContext = {}) {
  const demand = allDemandList.find((item) => item.id === demandId) || {};
  const batch = allBatchList.find((item) => item.batchCode === demand.batchCode)
    || batchContext
    || {};

  return {
    demandId: demand.id || demandId,
    demandCode: demand.demandCode || 'XX2025KFSS072',
    demandName: demand.demandName || '党建引领综合管理平台应用场景建设项目',
    batchName: batch.batchName || '2024综合计划数字化第一批次',
    batchTitle: batch.batchTitle || '',
    demandSource: '需求来源xxxxxxxxxxx',
    demandPriority: '一般',
    professionalCategory: '开发实施类',
    businessDepartment: '党建部',
    majorCategory: '党建',
    minorCategory: '党员教育',
    currentIssues: '目前xxxxxxxxxxxxxxxxxx尚不完善，xxxxxxxxxxxxxx功能逻辑不够通顺。',
    mainWork: '在哪个系统上开展哪些功能完善或数据治理。',
    expectedResults: '成效：可量化可验收的业务成效，与"目前存在的问题"和"本期主要开展工作"能够呼应，不应为过于空洞的成效，也不追求高大上的成效（300字以内）。示例：通过该项目的实施，实现变电专业工作票、输电专业工作票、配电专业工作票、营销工作票、信息通信工作票等29个票种全业务流程贯通，满足国安监要求，提升现场人员数票实用效率，基于电网一张图提升变电一票智能化水平。',
    demandBasis: '填写需求依据，可填写相关文件、单位等，支持多行输入。',
    businessPoints: '分点描述业务需求，示例：1.新建电费结算系统；2.完善客户档案管理；3.优化业扩报装流程。',
    businessStatus: '描述需求业务现状，说明当前业务开展方式及存在不足。',
    feasibility: '描述建设可行性，包括技术路线、资源保障及风险分析等内容。',
    applicationScope: '描述实施范围，如省公司本部、11家地市供电公司及相关直属单位。',
    implementationDesc: '描述项目实施功能，这是一个实施功能的描述。',
    previousProjectCode: 'B311HZ123456',
    previousProjectName: '这是项目名称xxx',
    costFee: '233',
    capitalFee: '333',
    teamUnit: '国网浙江信通公司',
    submitter: 'xxx',
    undertakeUnit: '国网浙江信通公司',
    undertakeLeader: 'xxx',
    teamMembers: 'xxxxxxxxxxxxxxxxx',
    blueprintName: '营销业务蓝图 V2.0',
    baselineName: '标准功能基线库-营销域',
    duplicateCompare: {
      top1Rate: '38%',
      top2Rate: '34%',
      groups: [
        {
          name: '重复需求',
          rows: [
            {
              field: '申报编号',
              current: 'XX2025KFSS072',
              top1: 'XX2025KFSS068',
              top2: 'XX2025KFSS061',
              currentLink: true,
              top1Link: true,
              top2Link: true
            },
            {
              field: '需求名称',
              current: '党建引领综合管理平台应用场景建设项目',
              top1: 'xxxxxxxxxxxx需求',
              top2: 'xxxxxxxxxxxx需求'
            },
            {
              field: '本期主要开展工作',
              current: '在哪个系统上开展哪些功能完善或数据治理。',
              top1: 'xxxxxxxxxxxxxxxxxxxxxxxx',
              top2: 'xxxxxxxxxxxxxxxxxxxxxxxx'
            },
            {
              field: '预期目标',
              current: '提升管理效率，降低运维成本，支撑数字化转型目标。',
              top1: 'xxxxxxxxxxxxxxxxxxxxxxxx',
              top2: 'xxxxxxxxxxxxxxxxxxxxxxxx'
            },
            {
              field: '批次编号',
              current: 'PC2026002',
              top1: 'PC2026002',
              top2: 'PC2026001'
            },
            {
              field: '批次名称',
              current: '2026年综合计划数字化项目需求申报批次',
              top1: '2026年综合计划数字化项目需求申报批次',
              top2: '2026年综合计划数字化项目需求申报批次'
            }
          ]
        },
        {
          name: '重复可研',
          rows: [
            {
              field: '可研编号',
              current: '',
              top1: 'ZKY2024013',
              top2: 'ZKY2024008',
              top1Link: true,
              top2Link: true
            },
            {
              field: '项目名称',
              current: '',
              top1: '可研名称1',
              top2: '可研名称2'
            },
            { field: '关联可研状态', current: '', top1: '', top2: '' },
            { field: '本期主要开展工作', current: '', top1: '', top2: '' },
            { field: '预期目标', current: '', top1: '', top2: '' },
            { field: '项目状态', current: '', top1: '', top2: '' },
            { field: '备注', current: '', top1: '', top2: '' },
            { field: '批次编号', current: '', top1: '', top2: '' },
            { field: '批次名称', current: '', top1: '', top2: '' }
          ]
        }
      ]
    },
    relevanceReview: {
      level: '极高',
      projectCode: 'B311AA129878432',
      projectName: '党建引领综合管理平台应用场景建设项目',
      previousProjectCode: 'B311AB187298302',
      previousProjectName: 'xxxxxxxxxxxxxxxxxxxx项目',
      mainArguments: '新建项目名称、建设主题与候选项目完全一致，均聚焦基础设施安全感知与风险预警能力建设。',
      contentSimilarity: '两者核心目标均为提升安全管理水平，均提出利用人工智能开展违章识别与风险管控。',
      systemOverlap: '均基于同一基础设施安全感知平台，整合物联网、视频与人工智能技术。',
      teamOverlap: '需求提出单位均为建设部，提出人虽不同（秦申峰与陈哲），但团队及业务类别重叠度较高。',
      functionSimilarity: '风险预警、感知接入等功能高度重合，新建项目在此基础上深化人工智能与无人机联动应用。'
    },
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

const materialCategories = ['需求文档', '需求提出依据', '佐证材料'];

function getDemandMaterials(demandId, demandCode = '') {
  const demand = allDemandList.find((item) => item.id === demandId);
  const code = demandCode || (demand && demand.demandCode) || 'XX2026ZHJH1233';
  const baseDate = '2026-06-10 15:13:13';

  return materialCategories.map((category, index) => ({
    id: `${demandId || 'material'}-${index}`,
    category,
    fileName: `${category}- ${code}.docx`,
    updateTime: index === 0 ? baseDate : '2026-06-24 15:13:13'
  }));
}

function getPreReviewOpinions(demandId) {
  const demand = allDemandList.find((item) => item.id === demandId) || {};
  const idx = Number(String(demandId).replace(/\D/g, '')) || 1;
  const isReject = idx % 5 === 0;

  return {
    demandCode: demand.demandCode || 'XX2025KFSS072',
    demandName: demand.demandName || '党建引领综合管理平台应用场景建设项目',
    preliminary: {
      cover: isReject ? '不符合' : '符合',
      template: isReject ? '错误' : '正确',
      content: isReject ? '不符合' : '符合',
      opinionDesc: isReject
        ? '申报材料封面信息不完整，文档模板使用错误，请按规范修改后重新提报。'
        : '该需求符合要求，xxxxxxxxxxxxxxxxxx。'
    },
    professionalList: [
      {
        reviewer: '审查人1',
        opinion: '同意',
        priority: '1',
        opinionDesc: '该需求建设需求强烈，功能逻辑清晰，将极大提升工作效率，同意提交专家评审。'
      },
      {
        reviewer: '审查人1',
        opinion: idx % 4 === 0 ? '不同意' : '同意',
        priority: idx % 4 === 0 ? '-' : '2',
        opinionDesc: idx % 4 === 0
          ? '该需求无建设必要，建议退回修改。'
          : '经专业审查，需求建设内容合理，技术路线可行，同意提交专家评审。'
      }
    ]
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
  filterReviewRecordList,
  buildReviewRecordsFromDemands,
  withdrawReviewOpinion,
  getCentralizedReviewDetail,
  submitCentralizedReview,
  getDemandMaterials,
  getPreReviewOpinions,
  paginateList
};
