const systemOptions = [
  { key: 'S001', value: '100960-能源互联网营销服务系统' },
  { key: 'S002', value: '100961-人工智能开放服务平台' },
  { key: 'S003', value: '100962-数字化运维管理平台' }
];

const subsystemOptions = [
  { key: 'SS001', value: '业扩接入管理', systemId: 'S001' },
  { key: 'SS002', value: '接入管理', systemId: 'S001' },
  { key: 'SS003', value: '能力开放管理', systemId: 'S002' },
  { key: 'SS004', value: '智能服务接入', systemId: 'S002' },
  { key: 'SS005', value: '运行监控', systemId: 'S003' }
];

const level1FunctionPool = [
  {
    id: 'P-L1-001',
    systemId: 'S001',
    systemName: '100960-能源互联网营销服务系统',
    subsystemId: 'SS001',
    subsystemName: '业扩接入管理',
    level1Name: '获得电力',
    level1Desc: '面向高压、低压非居民用户提供获得电力全流程服务。'
  },
  {
    id: 'P-L1-002',
    systemId: 'S001',
    systemName: '100960-能源互联网营销服务系统',
    subsystemId: 'SS002',
    subsystemName: '接入管理',
    level1Name: '接入管理',
    level1Desc: '支撑用户接入方案编制与审批。'
  },
  {
    id: 'P-L1-003',
    systemId: 'S002',
    systemName: '100961-人工智能开放服务平台',
    subsystemId: 'SS003',
    subsystemName: '能力开放管理',
    level1Name: '智能服务接入',
    level1Desc: '提供 AI 能力统一接入与编排。'
  },
  {
    id: 'P-L1-004',
    systemId: 'S002',
    systemName: '100961-人工智能开放服务平台',
    subsystemId: 'SS004',
    subsystemName: '智能服务接入',
    level1Name: '服务编排',
    level1Desc: '支持多模型服务链路编排与发布。'
  },
  {
    id: 'P-L1-005',
    systemId: 'S003',
    systemName: '100962-数字化运维管理平台',
    subsystemId: 'SS005',
    subsystemName: '运行监控',
    level1Name: '告警管理',
    level1Desc: '统一采集、分析并处置系统运行告警。'
  }
];

const level2FunctionPool = [
  {
    id: 'P-L2-001',
    level1PoolId: 'P-L1-001',
    level2Name: '服务目录管理',
    descBefore: '建设前：服务目录分散维护，缺乏统一标准。',
    descAfter: ''
  },
  {
    id: 'P-L2-002',
    level1PoolId: 'P-L1-001',
    level2Name: '服务接入管理',
    descBefore: '建设前：接入流程线下流转，效率较低。',
    descAfter: ''
  },
  {
    id: 'P-L2-003',
    level1PoolId: 'P-L1-001',
    level2Name: '服务运行监控',
    descBefore: '建设前：缺少统一运行监控视图。',
    descAfter: ''
  },
  {
    id: 'P-L2-004',
    level1PoolId: 'P-L1-002',
    level2Name: '接入方案编制',
    descBefore: '建设前：方案模板不统一。',
    descAfter: ''
  },
  {
    id: 'P-L2-005',
    level1PoolId: 'P-L1-002',
    level2Name: '接入审批流转',
    descBefore: '建设前：审批节点不可视。',
    descAfter: ''
  },
  {
    id: 'P-L2-006',
    level1PoolId: 'P-L1-003',
    level2Name: '能力注册',
    descBefore: '建设前：能力注册缺少统一规范。',
    descAfter: ''
  },
  {
    id: 'P-L2-007',
    level1PoolId: 'P-L1-003',
    level2Name: '能力发布',
    descBefore: '建设前：发布流程手工操作较多。',
    descAfter: ''
  }
];

let blueprintIdSeed = 1000;

function nextId(prefix) {
  blueprintIdSeed += 1;
  return `${prefix}${blueprintIdSeed}`;
}

function cloneLevel2(item) {
  return {
    id: nextId('L2_'),
    poolId: item.id,
    level2Name: item.level2Name,
    descBefore: item.descBefore,
    descAfter: item.descAfter || ''
  };
}

function buildDefaultBlueprint(demandId) {
  return {
    demandId,
    blueprintName: '2026年数字化业务蓝图',
    systems: [
      {
        id: 'SYS_D1',
        systemId: 'S001',
        systemName: '100960-能源互联网营销服务系统',
        expanded: true,
        subsystems: [
          {
            id: 'SUB_D1',
            subsystemId: 'SS001',
            subsystemName: '业扩接入管理',
            expanded: true,
            level1Functions: [
              {
                id: 'L1_D1',
                poolId: 'P-L1-001',
                level1Name: '获得电力',
                expanded: true,
                level2Functions: level2FunctionPool
                  .filter((item) => item.level1PoolId === 'P-L1-001')
                  .slice(0, 2)
                  .map(cloneLevel2)
              }
            ]
          }
        ]
      }
    ]
  };
}

const blueprintStore = new Map();

function getBlueprintData(demandId) {
  if (!blueprintStore.has(demandId)) {
    blueprintStore.set(demandId, buildDefaultBlueprint(demandId));
  }
  return JSON.parse(JSON.stringify(blueprintStore.get(demandId)));
}

function saveBlueprintData(demandId, payload) {
  blueprintStore.set(demandId, JSON.parse(JSON.stringify(payload)));
  return { success: true };
}

function filterLevel1Pool(searchObj = {}, excludePoolIds = []) {
  let list = level1FunctionPool.slice();
  if (searchObj.keyword) {
    const kw = searchObj.keyword.trim();
    list = list.filter(
      (item) =>
        item.systemName.includes(kw)
        || item.subsystemName.includes(kw)
        || item.level1Name.includes(kw)
    );
  }
  if (excludePoolIds.length) {
    list = list.filter((item) => !excludePoolIds.includes(item.id));
  }
  return list;
}

function filterLevel2Pool(level1PoolId, searchObj = {}, excludePoolIds = []) {
  let list = level2FunctionPool.filter((item) => item.level1PoolId === level1PoolId);
  if (searchObj.keyword) {
    const kw = searchObj.keyword.trim();
    list = list.filter(
      (item) => item.level2Name.includes(kw) || item.descBefore.includes(kw)
    );
  }
  if (excludePoolIds.length) {
    list = list.filter((item) => !excludePoolIds.includes(item.id));
  }
  return list;
}

function getSubsystemOptions(systemId) {
  return subsystemOptions.filter((item) => item.systemId === systemId);
}

export {
  systemOptions,
  subsystemOptions,
  level1FunctionPool,
  level2FunctionPool,
  getBlueprintData,
  saveBlueprintData,
  filterLevel1Pool,
  filterLevel2Pool,
  getSubsystemOptions,
  nextId
};
