/**
 * 中心卡片 V2 —— 专属 mock
 *
 * 与 V1 的 components/mockData.js 分开维护：V2 改版不动 V1 数据；
 * 分类树、方向清单、省份清单这类公共数据仍从 V1 mock 复用，避免重复维护。
 */
import { directionRows, chinaProvinces } from "../mockData";

const hashStr = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/* ---------------- 首页 · 心形图上的两组标签 ---------------- */

/** 左：打分情况 */
export const scoreTags = [
  { key: "province-compare", label: "省域政策对比" },
  { key: "province-portrait", label: "省域政策画像" },
  { key: "domain-compare", label: "政策领域对比" },
  { key: "direction-matrix", label: "方向×省份全量矩阵" },
];

/** 右：方向研判 */
export const researchTags = [
  { key: "policy-evolution", label: "政策演进脉络" },
  { key: "policy-stage", label: "政策当前阶段" },
  { key: "policy-trend", label: "政策未来走向" },
  { key: "policy-clause", label: "政策条款对比" },
];

/** 标签 key → 场景标题（详情页顶部标题与返回逻辑用） */
export const sceneTitles = {
  goal: "量化目标",
  ...scoreTags.reduce((m, t) => ({ ...m, [t.key]: t.label }), {}),
  ...researchTags.reduce((m, t) => ({ ...m, [t.key]: t.label }), {}),
};

/* ---------------- 量化目标 · 明细表 ---------------- */

export const goalTableRows = [
  {
    direction: "充电桩",
    target: "市级充电桩示范小区数量",
    region: "浙江",
    value: "5个以上",
    deadline: "2027年",
    hardness: "预期性",
    source: "关于印发《黄浦区碳达峰重点项目实施方案》的通知",
  },
  {
    direction: "充电桩",
    target: "新建公共",
    region: "浙江",
    value: "2000",
    deadline: "2027年",
    hardness: "约束性",
    source: "关于印发《黄浦区碳达峰重点项目实施方案》的通知",
  },
  {
    direction: "充电桩",
    target: "专用充电桩数量",
    region: "浙江",
    value: "推进",
    deadline: "2028年",
    hardness: "预期性",
    source: "关于印发《黄浦区碳达峰重点项目实施方案》的通知",
  },
  {
    direction: "光伏",
    target: "既有充电桩直流快充更换",
    region: "浙江",
    value: "不低于70%",
    deadline: "2030年",
    hardness: "预期性",
    source: "黄浦区人民政府关于印发《国家碳达峰试点（黄浦）实施方案》的通知",
  },
  {
    direction: "光伏",
    target: "公共建筑绿色建筑两星级及以上占比",
    region: "浙江",
    value: "同比下降3%左右",
    deadline: "2030年",
    hardness: "约束性",
    source: "黄浦区人民政府关于印发《国家碳达峰试点（黄浦）实施方案》的通知",
  },
  {
    direction: "光伏",
    target: "既有公共建筑节能改造",
    region: "浙江",
    value: "不低于30%",
    deadline: "2027年",
    hardness: "预期性",
    source: "关于印发《上海市粮食光伏建设实施方案》的通知",
  },
  {
    direction: "新型储能",
    target: "新型储能装机规模",
    region: "江苏",
    value: "500万千瓦",
    deadline: "2028年",
    hardness: "约束性",
    source: "江苏省《关于加快新型储能发展的实施意见》",
  },
  {
    direction: "新型储能",
    target: "电网侧独立储能示范项目",
    region: "江苏",
    value: "20个",
    deadline: "2027年",
    hardness: "预期性",
    source: "江苏省《关于加快新型储能发展的实施意见》",
  },
  {
    direction: "风电",
    target: "海上风电并网装机容量",
    region: "广东",
    value: "1800万千瓦",
    deadline: "2030年",
    hardness: "约束性",
    source: "广东省《海上风电发展规划》",
  },
  {
    direction: "风电",
    target: "陆上风电新增装机",
    region: "内蒙古",
    value: "1200万千瓦",
    deadline: "2029年",
    hardness: "预期性",
    source: "内蒙古自治区《新能源发展规划》",
  },
  {
    direction: "煤电",
    target: "煤电机组灵活性改造规模",
    region: "山东",
    value: "不低于3000万千瓦",
    deadline: "2028年",
    hardness: "约束性",
    source: "山东省《煤电低碳化改造实施方案》",
  },
  {
    direction: "煤电",
    target: "煤电节能降碳改造覆盖率",
    region: "山东",
    value: "90%以上",
    deadline: "2030年",
    hardness: "预期性",
    source: "山东省《煤电低碳化改造实施方案》",
  },
];

/** 明细表筛选：硬度 / 地区（方向直接用三级分类目录） */
export const hardnessOptions = [
  { key: "约束性", label: "约束性" },
  { key: "预期性", label: "预期性" },
];

export const regionOptions = [
  { key: "全国", label: "全国" },
  ...chinaProvinces.map((name) => ({ key: name, label: name })),
];

/* ---------------- 省域政策对比 ---------------- */

/** 省级打分（设计稿口径：0-100 分，越高政策力度越强） */
export const provinceScores = [
  { name: "北京", value: 95 },
  { name: "浙江", value: 92 },
  { name: "天津", value: 89 },
  { name: "上海", value: 85 },
  { name: "重庆", value: 82 },
  { name: "河北", value: 82 },
  { name: "山西", value: 78 },
  { name: "辽宁", value: 76 },
  { name: "吉林", value: 73 },
  { name: "黑龙江", value: 71 },
  { name: "江苏", value: 67 },
  { name: "安徽", value: 66 },
  { name: "福建", value: 63 },
  { name: "江西", value: 62 },
  { name: "山东", value: 58 },
  { name: "河南", value: 54 },
  { name: "湖北", value: 53 },
  { name: "湖南", value: 52 },
  { name: "广东", value: 51 },
  { name: "海南", value: 51 },
  { name: "四川", value: 48 },
  { name: "贵州", value: 47 },
  { name: "云南", value: 44 },
  { name: "陕西", value: 43 },
  { name: "甘肃", value: 38 },
  { name: "青海", value: 36 },
  { name: "台湾", value: 31 },
  { name: "内蒙古", value: 28 },
  { name: "广西", value: 26 },
  { name: "西藏", value: 21 },
  { name: "宁夏", value: 15 },
  { name: "新疆", value: 12 },
  { name: "香港", value: 11 },
  { name: "澳门", value: 9 },
];

/* ---------------- 政策领域对比 ---------------- */

/** 政策领域对比：可横向切换的省份清单（顺序即设计稿顺序） */
export const domainProvinces = [
  "上海", "内蒙古", "吉林", "天津", "安徽", "山西", "广西", "江苏",
  "河北", "浙江", "湖北", "甘肃", "西藏", "辽宁", "陕西", "北京",
  "广东", "福建", "山东", "河南", "湖南", "四川", "重庆", "云南",
];

/**
 * 雷达数据：维度取方向清单（与方向热力行保持一致）
 * 接接口后由后端按「省份 + 一级 + 二级」返回每个维度的得分
 */
export const buildDomainRadar = (province = "上海") => {
  const seed = hashStr(province);
  const indicators = directionRows.map((name) => ({ name, max: 100 }));
  const value = directionRows.map((name, i) => {
    const h = (seed + i * 977 + name.length * 31) % 100;
    return 12 + (h % 88);
  });
  return { indicators, series: [{ name: province, value }] };
};
