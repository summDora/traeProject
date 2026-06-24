const STORAGE_KEY = 'sysbase_async_tasks';

export const TASK_TYPES = [
  { value: 'file_upload', label: '大文件上传' },
  { value: 'file_download', label: '大文件下载' },
  { value: 'predict', label: '数据预测' },
  { value: 'batch', label: '跑批任务' },
  { value: 'duplicate_check', label: '查重任务' },
  { value: 'export', label: '数据导出' },
  { value: 'import', label: '批量导入' },
];

export const TASK_STATUS = [
  { value: 'pending', label: '排队中' },
  { value: 'running', label: '执行中' },
  { value: 'success', label: '成功' },
  { value: 'failed', label: '失败' },
  { value: 'cancelled', label: '已取消' },
  { value: 'timeout', label: '超时' },
];

const BIZ_TYPE_LABELS = {
  dr: '导入',
  yc: '预测',
  xz: '下载',
  fx: '分析',
};

function getBizTypeLabel(value) {
  return BIZ_TYPE_LABELS[value] || value || '-';
}

const TERMINAL_STATUS = new Set(['success', 'failed', 'cancelled', 'timeout']);

const STATUS_TO_BIZ_SUFFIX = {
  pending: '中',
  running: '中',
  success: '成功',
  failed: '失败',
  cancelled: '取消',
  timeout: '超时',
};

/** 根据内部 status 同步业务 status 文案，如 dr + running -> 导入中 */
function syncBizStatus(task) {
  if (!task.bizType) return task;
  const prefix = getBizTypeLabel(task.bizType);
  const suffix = STATUS_TO_BIZ_SUFFIX[task.status];
  if (!suffix) return task;
  return { ...task, bizStatus: `${prefix}${suffix}` };
}

const FAIL_REASONS = [
  '服务端处理超时，请稍后重试',
  '文件格式不符合要求，仅支持 xlsx/xls/csv',
  '预测模型参数缺失：历史年份未配置',
  '磁盘空间不足，无法完成文件写入',
  '数据源连接失败：数据库连接超时',
  '任务被管理员强制终止',
  '并发任务数已达上限，任务自动取消',
  '校验失败：必填字段「项目名称」为空',
];

const SOURCE_MODULES = [
  '预储备提报',
  '市场价格预测',
  'CS项目内审',
  '数字化项目管理',
  '材料上传',
  '需求统筹',
];

let listCache = null;

function now() {
  return Date.now();
}

function formatDateTime(ts) {
  if (!ts) return '-';
  const d = new Date(ts);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function formatDuration(ms) {
  if (ms == null || ms < 0) return '-';
  if (ms < 1000) return `${ms}ms`;
  const sec = Math.floor(ms / 1000);
  if (sec < 60) return `${sec}秒`;
  const min = Math.floor(sec / 60);
  const remainSec = sec % 60;
  if (min < 60) return remainSec ? `${min}分${remainSec}秒` : `${min}分钟`;
  const hour = Math.floor(min / 60);
  const remainMin = min % 60;
  return remainMin ? `${hour}小时${remainMin}分` : `${hour}小时`;
}

function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genTaskId() {
  return `TASK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function buildSeedTasks() {
  const base = now();
  const seeds = [
    {
      taskName: '2026年负荷预测-冬季方案',
      taskType: 'predict',
      bizType: 'yc',
      bizStatus: '预测成功',
      sourceModule: '市场价格预测',
      status: 'success',
      progress: 100,
      submitter: '张三',
      createdAt: base - 3600000 * 5,
      startedAt: base - 3600000 * 5 + 2000,
      finishedAt: base - 3600000 * 5 + 45000,
      retryCount: 0,
      requestSummary: '预测维度：冬季；算法：LSTM',
      resultSummary: '生成 8760 个时间点预测数据',
    },
    {
      taskName: '项目清单批量导出',
      taskType: 'export',
      bizType: 'xz',
      bizStatus: '下载中',
      sourceModule: '数字化项目管理',
      status: 'running',
      progress: 62,
      submitter: '李四',
      createdAt: base - 120000,
      startedAt: base - 110000,
      finishedAt: null,
      retryCount: 0,
      requestSummary: '导出范围：2025年度全部项目',
      resultSummary: '',
    },
    {
      taskName: '可行性报告.zip 上传',
      taskType: 'file_upload',
      bizType: 'dr',
      bizStatus: '导入失败',
      sourceModule: '材料上传',
      status: 'failed',
      progress: 78,
      submitter: '王五',
      createdAt: base - 7200000,
      startedAt: base - 7190000,
      finishedAt: base - 7100000,
      retryCount: 1,
      failReason: '文件格式不符合要求，仅支持 xlsx/xls/csv',
      errorCode: 'FILE_TYPE_INVALID',
      requestSummary: '文件：可行性报告.zip；大小：128MB',
      resultSummary: '',
    },
    {
      taskName: '预储备需求查重',
      taskType: 'duplicate_check',
      bizType: 'fx',
      bizStatus: '分析成功',
      sourceModule: '预储备提报',
      status: 'success',
      progress: 100,
      submitter: '赵六',
      createdAt: base - 1800000,
      startedAt: base - 1790000,
      finishedAt: base - 1770000,
      retryCount: 0,
      requestSummary: '查重记录数：15 条',
      resultSummary: '最高相似度 8.32%',
    },
    {
      taskName: 'CS内审批次数据导入',
      taskType: 'import',
      bizType: 'dr',
      bizStatus: '导入中',
      sourceModule: 'CS项目内审',
      status: 'pending',
      progress: 0,
      submitter: '钱七',
      createdAt: base - 30000,
      startedAt: null,
      finishedAt: null,
      retryCount: 0,
      requestSummary: '导入文件：batch_2026_q1.xlsx',
      resultSummary: '',
    },
    {
      taskName: '历史电价数据下载',
      taskType: 'file_download',
      bizType: 'xz',
      bizStatus: '下载失败',
      sourceModule: '市场价格预测',
      status: 'timeout',
      progress: 45,
      submitter: '孙八',
      createdAt: base - 86400000,
      startedAt: base - 86390000,
      finishedAt: base - 85190000,
      retryCount: 2,
      failReason: '服务端处理超时，请稍后重试',
      errorCode: 'TASK_TIMEOUT',
      requestSummary: '时间范围：2020-01 ~ 2025-12',
      resultSummary: '',
    },
    {
      taskName: '需求统筹跑批核算',
      taskType: 'batch',
      bizType: 'fx',
      bizStatus: '分析中',
      sourceModule: '需求统筹',
      status: 'running',
      progress: 35,
      submitter: '周九',
      createdAt: base - 300000,
      startedAt: base - 280000,
      finishedAt: null,
      retryCount: 0,
      requestSummary: '批次：2026-REQ-001；核算项：投资估算',
      resultSummary: '',
    },
    {
      taskName: '评审材料打包下载',
      taskType: 'file_download',
      bizType: 'xz',
      bizStatus: '下载取消',
      sourceModule: 'CS项目内审',
      status: 'cancelled',
      progress: 22,
      submitter: '吴十',
      createdAt: base - 5400000,
      startedAt: base - 5380000,
      finishedAt: base - 5360000,
      retryCount: 0,
      failReason: '用户主动取消任务',
      errorCode: 'USER_CANCELLED',
      requestSummary: '项目数：8 个；材料类型：全部',
      resultSummary: '',
    },
  ];

  return seeds.map((item, index) => ({
    id: `seed-${index + 1}`,
    taskId: genTaskId(),
    ...item,
    pollUrl: '/api/async-task/status',
    updatedAt: item.finishedAt || item.startedAt || item.createdAt,
  }));
}

function getList() {
  if (listCache) return listCache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      listCache = JSON.parse(raw);
      return listCache;
    }
  } catch (e) {
    // ignore
  }
  listCache = buildSeedTasks();
  saveList(listCache);
  return listCache;
}

function saveList(list) {
  listCache = list;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function refreshCache() {
  listCache = null;
  return getList();
}

function getTypeLabel(value) {
  const item = TASK_TYPES.find((t) => t.value === value);
  return item ? item.label : value;
}

function getStatusLabel(value) {
  const item = TASK_STATUS.find((s) => s.value === value);
  return item ? item.label : value;
}

function simulateProgress(task) {
  if (TERMINAL_STATUS.has(task.status)) return task;

  const updated = { ...task };

  if (updated.status === 'pending') {
    if (Math.random() > 0.4) {
      updated.status = 'running';
      updated.startedAt = now();
      updated.progress = Math.max(updated.progress, 5);
    }
    updated.updatedAt = now();
    return syncBizStatus(updated);
  }

  if (updated.status === 'running') {
    const step = Math.floor(Math.random() * 12) + 5;
    updated.progress = Math.min(100, (updated.progress || 0) + step);
    updated.updatedAt = now();

    if (updated.progress >= 100) {
      if (Math.random() > 0.15) {
        updated.status = 'success';
        updated.progress = 100;
        updated.finishedAt = now();
        updated.resultSummary = updated.resultSummary || '任务执行完成';
        updated.failReason = '';
        updated.errorCode = '';
      } else {
        updated.status = Math.random() > 0.5 ? 'failed' : 'timeout';
        updated.progress = Math.min(updated.progress, 95);
        updated.finishedAt = now();
        updated.failReason = randomPick(FAIL_REASONS);
        updated.errorCode = updated.status === 'timeout' ? 'TASK_TIMEOUT' : 'TASK_FAILED';
      }
    }
    return syncBizStatus(updated);
  }

  return updated;
}

function queryTaskList(filters = {}) {
  refreshCache();
  let list = getList().slice();

  const {
    keyword = '',
    taskType = '',
    status = '',
    statusIn = [],
    bizType = '',
    bizStatus = '',
    dateRange = [],
  } = filters;

  if (keyword) {
    const kw = keyword.trim().toLowerCase();
    list = list.filter(
      (t) =>
        t.taskName.toLowerCase().includes(kw) ||
        t.taskId.toLowerCase().includes(kw) ||
        (t.submitter && t.submitter.includes(kw))
    );
  }

  if (taskType) {
    list = list.filter((t) => t.taskType === taskType);
  }

  if (bizType) {
    list = list.filter((t) => t.bizType === bizType);
  }

  if (bizStatus) {
    list = list.filter((t) => t.bizStatus === bizStatus);
  }

  if (statusIn && statusIn.length) {
    const set = new Set(statusIn);
    list = list.filter((t) => set.has(t.status));
  } else if (status) {
    list = list.filter((t) => t.status === status);
  }

  if (dateRange && dateRange.length === 2) {
    const [start, end] = dateRange;
    const startTs = new Date(`${start} 00:00:00`).getTime();
    const endTs = new Date(`${end} 23:59:59`).getTime();
    list = list.filter((t) => t.createdAt >= startTs && t.createdAt <= endTs);
  }

  list.sort((a, b) => b.createdAt - a.createdAt);

  const stats = {
    total: getList().length,
    pending: 0,
    running: 0,
    success: 0,
    failed: 0,
    cancelled: 0,
    timeout: 0,
  };

  getList().forEach((t) => {
    if (stats[t.status] != null) stats[t.status] += 1;
  });

  return Promise.resolve({
    ok: true,
    list,
    stats,
  });
}

function queryTaskStatus(taskId) {
  refreshCache();
  const list = getList();
  const index = list.findIndex((t) => t.taskId === taskId || t.id === taskId);
  if (index < 0) {
    return Promise.resolve({ ok: false, message: '任务不存在' });
  }

  let task = { ...list[index] };
  if (!TERMINAL_STATUS.has(task.status)) {
    task = simulateProgress(task);
    list[index] = task;
    saveList(list);
  }

  return Promise.resolve({ ok: true, task: enrichTask(task) });
}

function pollRunningTasks() {
  refreshCache();
  const list = getList();
  let changed = false;

  const next = list.map((task) => {
    if (task.status === 'pending' || task.status === 'running') {
      changed = true;
      return simulateProgress(task);
    }
    return task;
  });

  if (changed) {
    saveList(next);
  }

  return Promise.resolve({ ok: true });
}

function retryTask(taskId) {
  refreshCache();
  const list = getList();
  const index = list.findIndex((t) => t.taskId === taskId || t.id === taskId);
  if (index < 0) {
    return Promise.resolve({ ok: false, message: '任务不存在' });
  }

  const task = list[index];
  if (!['failed', 'timeout', 'cancelled'].includes(task.status)) {
    return Promise.resolve({ ok: false, message: '仅失败、超时或已取消的任务可重试' });
  }

  list[index] = {
    ...task,
    status: 'pending',
    progress: 0,
    failReason: '',
    errorCode: '',
    resultSummary: '',
    startedAt: null,
    finishedAt: null,
    retryCount: (task.retryCount || 0) + 1,
    createdAt: now(),
    updatedAt: now(),
  };
  saveList(list);

  return Promise.resolve({ ok: true, message: '已提交重试，任务进入排队' });
}

function cancelTask(taskId) {
  refreshCache();
  const list = getList();
  const index = list.findIndex((t) => t.taskId === taskId || t.id === taskId);
  if (index < 0) {
    return Promise.resolve({ ok: false, message: '任务不存在' });
  }

  const task = list[index];
  if (!['pending', 'running'].includes(task.status)) {
    return Promise.resolve({ ok: false, message: '仅排队中或执行中的任务可取消' });
  }

  list[index] = syncBizStatus({
    ...task,
    status: 'cancelled',
    failReason: '用户主动取消任务',
    errorCode: 'USER_CANCELLED',
    finishedAt: now(),
    updatedAt: now(),
  });
  saveList(list);

  return Promise.resolve({ ok: true, message: '任务已取消' });
}

function registerAsyncTask(payload) {
  refreshCache();
  const list = getList();
  const task = syncBizStatus({
    id: `task-${now()}`,
    taskId: genTaskId(),
    taskName: payload.taskName || '未命名任务',
    taskType: payload.taskType || 'batch',
    bizType: payload.bizType || 'fx',
    sourceModule: payload.sourceModule || randomPick(SOURCE_MODULES),
    status: 'pending',
    progress: 0,
    submitter: payload.submitter || '当前用户',
    createdAt: now(),
    startedAt: null,
    finishedAt: null,
    retryCount: 0,
    failReason: '',
    errorCode: '',
    requestSummary: payload.requestSummary || '',
    resultSummary: '',
    pollUrl: payload.pollUrl || '/api/async-task/status',
    updatedAt: now(),
  });
  list.unshift(task);
  saveList(list);
  return task;
}

function enrichTask(task) {
  const duration =
    task.finishedAt && task.startedAt
      ? task.finishedAt - task.startedAt
      : task.startedAt
        ? now() - task.startedAt
        : null;

  return {
    ...task,
    taskTypeLabel: getTypeLabel(task.taskType),
    bizTypeLabel: getBizTypeLabel(task.bizType),
    statusLabel: task.bizStatus || getStatusLabel(task.status),
    createdAtText: formatDateTime(task.createdAt),
    startedAtText: formatDateTime(task.startedAt),
    finishedAtText: formatDateTime(task.finishedAt),
    durationText: formatDuration(duration),
    isTerminal: TERMINAL_STATUS.has(task.status),
    canRetry: ['failed', 'timeout', 'cancelled'].includes(task.status),
    canCancel: ['pending', 'running'].includes(task.status),
  };
}

function enrichTaskList(list) {
  return list.map(enrichTask);
}

export {
  formatDateTime,
  formatDuration,
  getTypeLabel,
  getStatusLabel,
  getBizTypeLabel,
  queryTaskList,
  queryTaskStatus,
  pollRunningTasks,
  retryTask,
  cancelTask,
  registerAsyncTask,
  enrichTask,
  enrichTaskList,
  refreshCache,
};
