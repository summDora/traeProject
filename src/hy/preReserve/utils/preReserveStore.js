const STORAGE_KEY = 'pre_reserve_submissions';

const PROJECT_TYPES = [
  '综合计划电网数字化项目',
  '成本性数字化项目',
  '业务运营项目',
  '资本性数字化项目',
];

const STATUS_OPTIONS = ['暂存', '审核中', '已储备', '驳回', '需求合并', '需求拆分'];

const CORE_SYSTEMS = ['支撑管控平台', '营销系统', '生产管控系统', '数据中台'];

const DEPARTMENTS = ['数字化部', '运检部', '营销部', '财务部', '调控中心'];

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatDate(d = new Date()) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function genDeclarationNo() {
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `XX2025KFSS${seq}`;
}

function seedData() {
  const now = Date.now();
  const names = [
    '浙江省保供减碳智能分析应用项目',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
    '基于人工智能的配网故障研判应用',
  ];
  const statuses = [
    '已储备', '审核中', '驳回', '需求合并', '需求拆分', '暂存',
    '已储备', '审核中', '驳回', '需求合并', '需求拆分', '暂存',
    '已储备', '审核中', '驳回', '需求合并', '需求拆分', '暂存',
    '已储备', '审核中',
  ];
  const dupResults = [
    { type: 'percent', value: 10.3 },
    { type: 'percent', value: 8.5 },
    { type: 'none' },
    { type: 'checking' },
    { type: 'percent', value: 12.1 },
    { type: 'none' },
    { type: 'percent', value: 5.2 },
    { type: 'none' },
    { type: 'percent', value: 15.8 },
    { type: 'none' },
    { type: 'percent', value: 9.4 },
    { type: 'none' },
    { type: 'checking' },
    { type: 'percent', value: 7.6 },
    { type: 'none' },
    { type: 'percent', value: 11.2 },
    { type: 'none' },
    { type: 'percent', value: 6.8 },
    { type: 'none' },
    { type: 'percent', value: 13.5 },
  ];

  return names.map((name, i) => {
    const dup = dupResults[i % dupResults.length];
    let duplicateResult = '未查重';
    let duplicatePercent = null;
    let duplicateDetails = [];
    if (dup.type === 'percent') {
      duplicatePercent = dup.value;
      duplicateResult = `${dup.value.toFixed(2)}%`;
      duplicateDetails = buildSimilarDetails(name, dup.value);
    } else if (dup.type === 'checking') {
      duplicateResult = '查重中';
    }

    return {
      id: `pr-${i + 1}`,
      declarationNo: `XX2025KFSS0${70 + i}`,
      requirementName: name,
      projectType: PROJECT_TYPES[i % PROJECT_TYPES.length],
      coreSystem: CORE_SYSTEMS[i % CORE_SYSTEMS.length],
      plannedInvestment: (480 + i * 12.5).toFixed(2),
      department: DEPARTMENTS[i % DEPARTMENTS.length],
      personInCharge: `负责人${(i % 5) + 1}`,
      status: statuses[i],
      duplicateResult,
      duplicatePercent,
      duplicateDetails,
      dupChecked: dup.type === 'percent',
      requirementDesc: `${name}建设方案说明`,
      createdAt: now - i * 3600000,
      updatedAt: now - i * 3600000,
    };
  });
}

function buildSimilarDetails(name, percent) {
  return [
    {
      declarationNo: 'XX2024KFSS031',
      requirementName: name.replace('项目', '相关项目'),
      projectType: '综合计划电网数字化项目',
      similarity: percent,
    },
    {
      declarationNo: 'XX2023KFSS018',
      requirementName: '配网智能化改造应用',
      projectType: '成本性数字化项目',
      similarity: Math.max(percent - 3.2, 0).toFixed(2),
    },
  ];
}

function loadList() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    /* ignore */
  }
  const seeded = seedData();
  saveList(seeded);
  return seeded;
}

function saveList(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

let listCache = null;

function getList() {
  if (!listCache) {
    listCache = loadList();
  }
  return listCache;
}

function refreshCache() {
  listCache = loadList();
  return listCache;
}

function queryList(filters = {}) {
  let list = [...getList()].sort((a, b) => b.createdAt - a.createdAt);
  const { declarationNo, requirementName, projectType, department, status } = filters;
  if (declarationNo) {
    list = list.filter((r) => r.declarationNo.includes(declarationNo.trim()));
  }
  if (requirementName) {
    list = list.filter((r) => r.requirementName.includes(requirementName.trim()));
  }
  if (projectType) {
    list = list.filter((r) => r.projectType === projectType);
  }
  if (department) {
    list = list.filter((r) => r.department === department);
  }
  if (status) {
    list = list.filter((r) => r.status === status);
  }
  return list;
}

function getById(id) {
  return getList().find((r) => r.id === id) || null;
}

function addRecord(payload) {
  const list = getList();
  const record = {
    id: `pr-${Date.now()}`,
    declarationNo: genDeclarationNo(),
    duplicateResult: '未查重',
    duplicatePercent: null,
    duplicateDetails: [],
    dupChecked: false,
    status: '暂存',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    ...payload,
  };
  list.unshift(record);
  saveList(list);
  listCache = list;
  return record;
}

function updateRecord(id, payload) {
  const list = getList();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...payload, updatedAt: Date.now() };
  saveList(list);
  listCache = list;
  return list[idx];
}

function deleteRecords(ids) {
  const idSet = new Set(ids);
  const list = getList().filter((r) => !idSet.has(r.id));
  saveList(list);
  listCache = list;
}

function canDelete(status) {
  return status === '暂存' || status === '驳回';
}

function exportFields() {
  return [
    { key: 'declarationNo', label: '申报编号' },
    { key: 'requirementName', label: '需求名称' },
    { key: 'projectType', label: '项目类型' },
    { key: 'coreSystem', label: '核心系统' },
    { key: 'plannedInvestment', label: '计划总投资（万元）' },
    { key: 'department', label: '需求提出部门' },
    { key: 'personInCharge', label: '需求负责人' },
    { key: 'requirementDesc', label: '需求描述' },
    { key: 'duplicateResult', label: '查重结果' },
    { key: 'status', label: '状态' },
    { key: 'createdAt', label: '创建时间' },
  ];
}

function toExportRow(record) {
  const row = {};
  exportFields().forEach(({ key }) => {
    if (key === 'createdAt') {
      row[key] = new Date(record.createdAt).toLocaleString('zh-CN');
    } else {
      row[key] = record[key] != null ? record[key] : '';
    }
  });
  return row;
}

function runDuplicateCheck(ids, options = {}) {
  const { isCityUser = true } = options;
  const list = getList();
  const idSet = new Set(ids);
  const targets = list.filter((r) => idSet.has(r.id));

  if (!targets.length) {
    return { ok: false, message: '请先选择需要查重的数据' };
  }

  if (isCityUser) {
    const alreadyChecked = targets.filter((r) => r.dupChecked);
    if (alreadyChecked.length) {
      return { ok: false, message: '地市用户仅可查重一次，所选数据中存在已查重记录' };
    }
  }

  targets.forEach((r) => {
    r.duplicateResult = '查重中';
  });
  saveList(list);

  return new Promise((resolve) => {
    setTimeout(() => {
      try {
        const current = getList();
        ids.forEach((id) => {
          const rec = current.find((r) => r.id === id);
          if (!rec) return;
          const percent = Number((Math.random() * 15 + 3).toFixed(2));
          rec.duplicatePercent = percent;
          rec.duplicateResult = `${percent.toFixed(2)}%`;
          rec.duplicateDetails = buildSimilarDetails(rec.requirementName, percent);
          rec.dupChecked = true;
          rec.updatedAt = Date.now();
        });
        saveList(current);
        listCache = current;
        resolve({ ok: true });
      } catch (e) {
        resolve({ ok: false, message: '查重失败，请稍后重试！' });
      }
    }, 1500);
  });
}

export {
  PROJECT_TYPES,
  STATUS_OPTIONS,
  CORE_SYSTEMS,
  DEPARTMENTS,
  formatDate,
  queryList,
  getById,
  addRecord,
  updateRecord,
  deleteRecords,
  canDelete,
  exportFields,
  toExportRow,
  runDuplicateCheck,
  refreshCache,
};
