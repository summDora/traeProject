/**
 * 模拟后端返回的搜索条件（扁平结构）
 * 同一业务类型 value 下会有多条不同 status 的记录
 */
export const MOCK_SEARCH_OPTIONS = [
  { label: '导入', value: 'dr', status: '导入成功' },
  { label: '导入', value: 'dr', status: '导入中' },
  { label: '导入', value: 'dr', status: '导入失败' },
  { label: '导入', value: 'dr', status: '导入取消' },
  { label: '预测', value: 'yc', status: '预测成功' },
  { label: '预测', value: 'yc', status: '预测中' },
  { label: '预测', value: 'yc', status: '预测取消' },
  { label: '下载', value: 'xz', status: '下载成功' },
  { label: '下载', value: 'xz', status: '下载中' },
  { label: '下载', value: 'xz', status: '下载失败' },
  { label: '下载', value: 'xz', status: '下载取消' },
  { label: '分析', value: 'fx', status: '分析成功' },
  { label: '分析', value: 'fx', status: '分析中' },
  { label: '分析', value: 'fx', status: '分析失败' },
  { label: '分析', value: 'fx', status: '分析取消' },
  { label: '分析', value: 'fx', status: '分析超时' },
  { label: '分析', value: 'fx', status: '分析暂停' },
];

/** 模拟请求后端搜索条件（仅返回扁平数组） */
export function fetchSearchOptions() {
  return Promise.resolve({
    ok: true,
    list: MOCK_SEARCH_OPTIONS,
  });
}

/** 业务类型：按 value 去重 */
export function getBizTypeOptions(flatList = []) {
  const map = new Map();
  flatList.forEach((item) => {
    if (!map.has(item.value)) {
      map.set(item.value, { label: item.label, value: item.value });
    }
  });
  return Array.from(map.values());
}

/** 业务状态：filter 当前 bizType 后对 status 去重 */
export function getBizStatusOptions(flatList = [], bizType = '') {
  if (!bizType) return [];
  const seen = new Set();
  const options = [];
  flatList.forEach((item) => {
    if (item.value !== bizType || !item.status || seen.has(item.status)) return;
    seen.add(item.status);
    options.push({ label: item.status, value: item.status });
  });
  return options;
}
