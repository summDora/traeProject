const batchOptions = [
  { key: '', value: '全部' },
  { key: 'B2025-01', value: '2025综合计划补增批次' },
  { key: 'B2023-01', value: '综合计划数字化第一批次' },
  { key: 'B2023-02', value: '综合计划数字化第二批次' }
];

const meetingStatusOptions = [
  { key: '', value: '全部' },
  { key: '未开始', value: '未开始' },
  { key: '进行中', value: '进行中' },
  { key: '已结束', value: '已结束' },
  { key: '已取消', value: '已取消' }
];

const reviewTypeOptions = [
  { key: '', value: '全部' },
  { key: '集中评审', value: '集中评审' },
  { key: '专题评审', value: '专题评审' },
  { key: '线上评审', value: '线上评审' }
];

const meetingLocations = ['杭州万廷酒店', '电科院', '省公司会议中心', '线上会议'];

const projectTypeOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '开发实施类', value: '开发实施类' }
];

const projectCategoryOptions = [
  { key: '', value: '全部' },
  { key: '建设类', value: '建设类' },
  { key: '运维类', value: '运维类' },
  { key: '开发实施类', value: '开发实施类' }
];

const demandTagOptions = [
  { key: '', value: '全部' },
  { key: '重点需求', value: '重点需求' },
  { key: '常规需求', value: '常规需求' },
  { key: '数字化', value: '数字化' }
];

const groupingTypeOptions = [
  { key: '不分组', value: '不分组' },
  { key: '分组', value: '分组' }
];

const groupNameOptions = [
  { key: 'A组', value: 'A组' },
  { key: 'B组', value: 'B组' },
  { key: 'C组', value: 'C组' },
  { key: 'D组', value: 'D组' },
  { key: 'E组', value: 'E组' },
  { key: 'F组', value: 'F组' }
];

const fundingChannelOptions = [
  { key: '综合计划', value: '综合计划' },
  { key: '专项计划', value: '专项计划' },
  { key: '成本性项目', value: '成本性项目' }
];

function buildReviewDemandPool() {
  const batches = batchOptions.filter((item) => item.key);
  const units = ['国网舟山供电公司', '国网杭州供电公司', '数字化部', '设备部', '国网浙江服务中心'];
  const featuredSamples = [
    {
      demandCode: 'XX2024KFSS017',
      demandName: '党建引领综合管理平台应用场景建设项目',
      demandUnit: '国网舟山供电公司',
      projectType: '开发实施类',
      demandTag: ''
    },
    {
      demandCode: 'XX2024KFSS021',
      demandName: '基于PM$3.0"一键式"的保险保案微应用深化改造',
      demandUnit: '设备部',
      projectType: '运维类',
      demandTag: ''
    },
    {
      demandCode: 'XX2024KFSS002',
      demandName: '变电验收及评价应用',
      demandUnit: '设备部',
      projectType: '建设类',
      demandTag: ''
    },
    {
      demandCode: 'XX2024KFSS004',
      demandName: '国网浙江电力-资金支付全链路智慧管控数字员工-开发实施项目',
      demandUnit: '国网浙江服务中心',
      projectType: '开发实施类',
      demandTag: '数字化'
    }
  ];
  const list = [];

  for (let i = 0; i < featuredSamples.length; i += 1) {
    const sample = featuredSamples[i];
    const batch = batches[i % batches.length];
    list.push({
      id: `RD${1000 + i + 1}`,
      planYear: 2024,
      batchCode: batch.key,
      batchName: batch.value,
      ...sample
    });
  }

  for (let i = featuredSamples.length + 1; i <= 20; i += 1) {
    const batch = batches[i % batches.length];
    list.push({
      id: `RD${1000 + i}`,
      planYear: 2024 + (i % 2),
      batchCode: batch.key,
      batchName: batch.value,
      demandCode: `XX2024KFSS${String(i).padStart(3, '0')}`,
      demandName: `数字化需求项目${i}`,
      demandUnit: units[i % units.length],
      demandTag: i % 3 === 0 ? '重点需求' : '',
      projectType: i % 2 === 0 ? '开发实施类' : '建设类'
    });
  }
  return list;
}

const reviewDemandPool = buildReviewDemandPool();

function buildMeetingList() {
  const batches = batchOptions.filter((item) => item.key);
  const statuses = ['未开始', '进行中', '已结束'];
  const reviewTypes = ['集中评审', '专题评审', '线上评审'];
  const creators = ['张三', '李四', '王五', '赵六'];
  const list = [];

  for (let i = 1; i <= 28; i += 1) {
    const batch = batches[i % batches.length];
    const startDay = String((i % 20) + 1).padStart(2, '0');
    const endDay = String((i % 20) + 2).padStart(2, '0');
    list.push({
      id: `MT${1000 + i}`,
      meetingName: `2026年${['第一', '第二', '第三'][i % 3]}批成本性项目评审会议（${['第一', '第二', '第三'][(i + 1) % 3]}批）`,
      meetingStartTime: `2026-01-${startDay} 09:00`,
      meetingEndTime: `2026-01-${endDay} 17:00`,
      meetingTime: `2026-01-${startDay} 09:00 ~ 2026-01-${endDay} 17:00`,
      meetingLocation: meetingLocations[i % meetingLocations.length],
      meetingLeader: '',
      batchCode: batch.key,
      batchName: batch.value,
      reviewDemandCount: 5 + (i % 12),
      expertCount: 3 + (i % 8),
      groupingType: i % 3 === 0 ? '分组' : '不分组',
      meetingStatus: statuses[i % statuses.length],
      statusEnabled: i % 2 === 0,
      externalTransmit: i % 4 === 0,
      reviewType: reviewTypes[i % reviewTypes.length],
      creator: creators[i % creators.length],
      createTime: i % 2 === 0
        ? `2026-01-${String((i % 15) + 1).padStart(2, '0')} 10:${String(i % 60).padStart(2, '0')}:00`
        : ''
    });
  }
  return list;
}

const allMeetingList = buildMeetingList();

function filterMeetingList(searchObj, source = allMeetingList) {
  let list = source.slice();
  if (searchObj.meetingName) {
    list = list.filter((item) => item.meetingName.includes(searchObj.meetingName.trim()));
  }
  if (searchObj.batchCode) {
    list = list.filter((item) => item.batchCode === searchObj.batchCode);
  }
  if (searchObj.meetingStatus) {
    list = list.filter((item) => item.meetingStatus === searchObj.meetingStatus);
  }
  if (searchObj.reviewType) {
    list = list.filter((item) => item.reviewType === searchObj.reviewType);
  }
  if (searchObj.meetingTime && searchObj.meetingTime.length === 2) {
    const [start, end] = searchObj.meetingTime;
    if (start && end) {
      const startTs = new Date(start).getTime();
      const endTs = new Date(end).getTime();
      list = list.filter((item) => {
        const itemStart = new Date(item.meetingStartTime).getTime();
        return itemStart >= startTs && itemStart <= endTs;
      });
    }
  }
  return list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
}

function paginateList(list, page, rows) {
  const start = (page - 1) * rows;
  return {
    rows: list.slice(start, start + rows),
    total: list.length
  };
}

function deleteMeetings(ids) {
  ids.forEach((id) => {
    const index = allMeetingList.findIndex((item) => item.id === id);
    if (index > -1) {
      allMeetingList.splice(index, 1);
    }
  });
}

function toggleMeetingField(meetingId, field, value) {
  const item = allMeetingList.find((row) => row.id === meetingId);
  if (item) {
    item[field] = value;
  }
}

function filterReviewDemandPool(searchObj, source = reviewDemandPool, options = {}) {
  let list = source.slice();
  const { excludeIds = [] } = options;

  if (excludeIds.length) {
    list = list.filter((item) => !excludeIds.includes(item.id));
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
  if (searchObj.projectType) {
    list = list.filter((item) => item.projectType === searchObj.projectType);
  }
  if (searchObj.projectCategory) {
    list = list.filter((item) => item.projectType === searchObj.projectCategory);
  }
  if (searchObj.demandTag) {
    list = list.filter((item) => item.demandTag === searchObj.demandTag);
  }
  if (searchObj.demandName) {
    list = list.filter((item) => item.demandName.includes(searchObj.demandName.trim()));
  }
  return list;
}

function getMeetingDetail(meetingId) {
  const meeting = allMeetingList.find((item) => item.id === meetingId);
  if (!meeting) return null;
  return {
    ...meeting,
    meetingLeader: meeting.meetingLeader || '会议负责人',
    meetingTime: [meeting.meetingStartTime, meeting.meetingEndTime],
    groupingType: meeting.groupingType || '不分组',
    groupNames: meeting.groupNames || ['A组', 'B组', 'C组', 'D组', 'E组', 'F组'],
    fundingChannel: meeting.fundingChannel || '综合计划',
    remark: meeting.remark || '',
    reviewDemands: meeting.reviewDemands
      ? meeting.reviewDemands.slice()
      : reviewDemandPool.slice(0, 4).map((item) => ({ ...item }))
  };
}

function saveMeeting(payload, meetingId) {
  const [start, end] = payload.meetingTime || [];
  const meetingTime = start && end ? `${start} ~ ${end}` : '';
  const reviewDemands = payload.reviewDemands || [];
  const record = {
    id: meetingId || `MT${Date.now()}`,
    meetingName: payload.meetingName,
    meetingLocation: payload.meetingLocation,
    meetingLeader: payload.meetingLeader,
    meetingStartTime: start || '',
    meetingEndTime: end || '',
    meetingTime,
    groupingType: payload.groupingType,
    groupNames: payload.groupNames,
    fundingChannel: payload.fundingChannel,
    remark: payload.remark,
    batchCode: reviewDemands[0] ? reviewDemands[0].batchCode : '',
    batchName: reviewDemands[0] ? reviewDemands[0].batchName : '',
    reviewDemandCount: reviewDemands.length,
    expertCount: 0,
    meetingStatus: '未开始',
    statusEnabled: true,
    externalTransmit: false,
    reviewType: '集中评审',
    creator: '当前用户',
    createTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
    reviewDemands
  };
  if (meetingId) {
    const index = allMeetingList.findIndex((item) => item.id === meetingId);
    if (index > -1) {
      allMeetingList.splice(index, 1, { ...allMeetingList[index], ...record });
    }
  } else {
    allMeetingList.unshift(record);
  }
  return record;
}

const expertGroupTree = [
  {
    id: 'all',
    label: '全部'
  },
  {
    id: 'tech',
    label: '技术组',
    children: [
      { id: 'tech-app', label: '业务应用组' },
      { id: 'tech-data', label: '数据组' },
      { id: 'tech-new', label: '新技术组' },
      { id: 'tech-platform', label: '平台组' }
    ]
  },
  {
    id: 'finance',
    label: '财务组',
    children: [
      { id: 'finance-group', label: '财务组' }
    ]
  }
];

const reviewRoleOptions = [
  { key: '业务专家', value: '业务专家' },
  { key: '技术专家', value: '技术专家' },
  { key: '财务专家', value: '财务专家' },
  { key: '组长', value: '组长' },
  { key: '发展专家', value: '发展专家' }
];

const expertTypeOptions = [
  { key: '平台专家', value: '平台专家' },
  { key: '架构专家', value: '架构专家' },
  { key: '财务专家', value: '财务专家' },
  { key: '安全专家', value: '安全专家' }
];

function buildExpertPool() {
  const units = ['数字化部', '设备部', '财务部', '营销部'];
  const schedules = [
    '可研会议：4.25 14:00-17:00',
    '成效会议：4.25 09:00-12:00',
    ''
  ];
  const groups = ['tech-app', 'tech-data', 'tech-new', 'tech-platform', 'finance-group'];
  const list = [];
  for (let i = 1; i <= 24; i += 1) {
    list.push({
      id: `EXP${1000 + i}`,
      employeeNo: `P${String(1000000 + i)}`,
      expertName: `专家${i}`,
      unit: units[i % units.length],
      contact: `1380000${String(i).padStart(4, '0')}`,
      meetingSchedule: schedules[i % schedules.length],
      groupId: groups[i % groups.length]
    });
  }
  return list;
}

const expertPool = buildExpertPool();
const meetingExpertMap = {};

function filterExpertPool(searchObj, groupId, source = expertPool) {
  let list = source.slice();
  if (groupId && groupId !== 'all') {
    if (groupId === 'tech') {
      list = list.filter((item) => item.groupId.startsWith('tech'));
    } else if (groupId === 'finance') {
      list = list.filter((item) => item.groupId.startsWith('finance'));
    } else {
      list = list.filter((item) => item.groupId === groupId);
    }
  }
  if (searchObj.expertName) {
    list = list.filter((item) => item.expertName.includes(searchObj.expertName.trim()));
  }
  if (searchObj.unit) {
    list = list.filter((item) => item.unit.includes(searchObj.unit.trim()));
  }
  return list;
}

function getAssignedExperts(meetingId) {
  return (meetingExpertMap[meetingId] || []).slice();
}

function saveAssignedExperts(meetingId, experts) {
  meetingExpertMap[meetingId] = experts.map((item) => ({ ...item }));
  const meeting = allMeetingList.find((item) => item.id === meetingId);
  if (meeting) {
    meeting.expertCount = experts.length;
  }
}

export {
  batchOptions,
  meetingStatusOptions,
  reviewTypeOptions,
  projectTypeOptions,
  projectCategoryOptions,
  demandTagOptions,
  groupingTypeOptions,
  groupNameOptions,
  fundingChannelOptions,
  reviewDemandPool,
  allMeetingList,
  filterMeetingList,
  filterReviewDemandPool,
  paginateList,
  deleteMeetings,
  toggleMeetingField,
  getMeetingDetail,
  saveMeeting,
  expertGroupTree,
  reviewRoleOptions,
  expertTypeOptions,
  expertPool,
  filterExpertPool,
  getAssignedExperts,
  saveAssignedExperts
};
