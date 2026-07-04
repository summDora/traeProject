const demandStatusOptions = [
  { key: '', value: '全部' },
  { key: '已初审', value: '已初审' },
  { key: '已提报', value: '已提报' },
  { key: '评审中', value: '评审中' },
  { key: '已评审', value: '已评审' },
  { key: '已收口', value: '已收口' }
];

const meetingStatuses = ['已开启', '已结束', '未开始'];
const groupingStrategies = ['不分组', 'A, B', 'A, B, C'];
const meetingLocations = ['杭州万廷酒店', '电科院', '省公司会议中心', '线上会议'];
const meetingLeaders = ['张三', '李四', '王五', '赵六'];
const departments = ['数字化部', '运检部', '营销部', '设备部', '调控中心'];
const demandUnits = ['省公司本部', '南京供电公司', '苏州供电公司', '无锡供电公司'];
const initialOpinions = ['同意', '不同意', '有条件同意', '—'];
const deptOpinions = ['同意上会', '建议修改', '不同意', '—'];
const meetingNames = [
  '2026年第一批数字化需求评审会',
  '2026年综合计划补增评审会',
  '2025年数字化专项评审会',
  '2026年运检专业需求评审会'
];

function buildMeetingList() {
  const list = [];
  for (let i = 1; i <= 12; i += 1) {
    list.push({
      id: `RSM${100 + i}`,
      meetingName: meetingNames[i % meetingNames.length],
      meetingLocation: meetingLocations[i % meetingLocations.length],
      meetingStartTime: `2026-0${(i % 6) + 1}-${String(10 + (i % 15)).padStart(2, '0')} 09:00:00`,
      meetingEndTime: `2026-0${(i % 6) + 1}-${String(10 + (i % 15)).padStart(2, '0')} 17:00:00`,
      meetingLeader: meetingLeaders[i % meetingLeaders.length],
      groupingStrategy: groupingStrategies[i % groupingStrategies.length],
      meetingStatus: meetingStatuses[i % meetingStatuses.length],
      materialFileName: `会议资料-${meetingNames[i % meetingNames.length]}.zip`
    });
  }
  return list;
}

function buildDemandList() {
  const groups = ['A', 'B', 'C', '不分组'];
  const statuses = ['已初审', '评审中', '已评审', '已收口'];
  const list = [];
  const meetings = buildMeetingList();

  for (let i = 1; i <= 48; i += 1) {
    const meeting = meetings[i % meetings.length];
    list.push({
      id: `RSD${1000 + i}`,
      meetingId: meeting.id,
      meetingName: meeting.meetingName,
      groupName: groups[i % groups.length],
      reviewNumber: `PS${String(i).padStart(4, '0')}`,
      demandCode: `XX2026KFSS${String(i).padStart(3, '0')}`,
      demandName: `基于电网一张图的${departments[i % departments.length]}健康管理深化应用需求${i}`,
      demandStatus: statuses[i % statuses.length],
      businessDepartment: departments[i % departments.length],
      initialOpinion: initialOpinions[i % initialOpinions.length],
      deptPriority: i % 4 === 0 ? '—' : String((i % 5) + 1),
      deptOpinion: deptOpinions[i % deptOpinions.length],
      demandUnit: demandUnits[i % demandUnits.length],
      reviewSubmitted: i % 3 === 0,
      applicant: meetingLeaders[i % meetingLeaders.length],
      applyTime: `2026-0${(i % 6) + 1}-08 10:${String(i % 60).padStart(2, '0')}:00`
    });
  }
  return list;
}

const allMeetingList = buildMeetingList();
const allDemandList = buildDemandList();

function filterMeetingList(searchObj, source = allMeetingList) {
  let list = source.slice();
  if (searchObj.meetingName) {
    list = list.filter((item) => item.meetingName.includes(searchObj.meetingName.trim()));
  }
  return list;
}

function filterDemandList(searchObj, source = allDemandList) {
  let list = source.slice();

  if (searchObj.selectedMeetingId) {
    list = list.filter((item) => item.meetingId === searchObj.selectedMeetingId);
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
  const total = list.length;
  const start = (page - 1) * rows;
  return {
    total,
    rows: list.slice(start, start + rows)
  };
}

function buildReviewRecordsFromDemands(demands = []) {
  return demands.map((item, index) => ({
    id: `RR${item.id}-${index}`,
    demandId: item.id,
    demandCode: item.demandCode,
    demandName: item.demandName,
    demandUnit: item.demandUnit,
    demandStatus: item.demandStatus,
    meetingName: item.meetingName,
    applicant: item.applicant,
    applyTime: item.applyTime,
    canWithdraw: item.demandStatus === '评审中' && !item.reviewSubmitted
  }));
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

function withdrawReviewOpinion(recordId, source) {
  const record = source.find((item) => item.id === recordId);
  if (!record) {
    return { success: false, message: '记录不存在' };
  }
  if (!record.canWithdraw) {
    return { success: false, message: '当前状态不可撤回' };
  }
  record.canWithdraw = false;
  return { success: true };
}

function submitDemandReview(demandId) {
  const demand = allDemandList.find((item) => item.id === demandId);
  if (!demand) {
    return { success: false, message: '需求不存在' };
  }
  if (demand.reviewSubmitted) {
    return { success: false, message: '该需求已提交' };
  }
  demand.reviewSubmitted = true;
  demand.demandStatus = '已评审';
  return { success: true };
}

function batchSubmitDemands(demandIds = []) {
  let count = 0;
  demandIds.forEach((id) => {
    const result = submitDemandReview(id);
    if (result.success) count += 1;
  });
  return { success: true, count };
}

function getOpinionSummaryDetail(demandId) {
  const demand = allDemandList.find((item) => item.id === demandId) || {};
  return {
    demandCode: demand.demandCode || 'SXZ Q2026000001',
    demandName: demand.demandName || '国网浙江电力-xxxxxxxxxxxxxxxxx-开发实施',
    experts: [
      { name: '专家1', status: 'opinionOnly' },
      { name: '专家2', status: 'pending' },
      { name: '专家3', status: 'completed' }
    ],
    groups: [
      {
        key: 'tech',
        name: '技术组',
        expanded: true,
        expertOpinions: [
          {
            expertName: '专家1',
            opinionDesc: '该需求建设需求强烈，功能逻辑清晰，将极大提升工作效率。'
          },
          {
            expertName: '专家2',
            opinionDesc: '技术路线合理，与现有系统衔接方案可行，建议纳入评审汇总。'
          }
        ],
        summaryOpinion: '',
        conclusion: '退回拆分'
      },
      {
        key: 'finance',
        name: '财务组',
        expanded: false,
        expertOpinions: [
          {
            expertName: '专家1',
            opinionDesc: '投资估算基本准确，资金来源明确。'
          },
          {
            expertName: '专家3',
            opinionDesc: '建议进一步细化年度投资计划后通过。'
          }
        ],
        summaryOpinion: '',
        conclusion: ''
      }
    ]
  };
}

function saveOpinionSummary(demandId, groups = []) {
  const demand = allDemandList.find((item) => item.id === demandId);
  if (demand && groups.length) {
    demand.summaryGroups = groups.map((item) => ({ ...item }));
  }
  return { success: true };
}

export {
  demandStatusOptions,
  allMeetingList,
  allDemandList,
  filterMeetingList,
  filterDemandList,
  paginateList,
  buildReviewRecordsFromDemands,
  filterReviewRecordList,
  withdrawReviewOpinion,
  submitDemandReview,
  batchSubmitDemands,
  getOpinionSummaryDetail,
  saveOpinionSummary
};
