/**
 * 全战略态势大屏 —— 图表数据接口入口
 *
 * 说明：
 * - 后端就绪后，在 vue.config.js 的 devServer.proxy 里配置 BASE 前缀指向真实服务，
 *   或通过环境变量 VUE_APP_QZLT_API 指定（默认 "/qzlt-api"）。
 * - 接口暂未接入时，下面的函数会自动回落到页面 mockData，保证页面可正常渲染。
 * - 每个 fetchXxx 都接受筛选参数（primary / secondary / tertiary），后端按需使用。
 */
import {
  portraitBubbles,
  portraitCardMap,
  goalMapData,
  goalRankData,
  goalReleaseData,
  goalSummary,
  directionHeatmapData,
  policyTypeRankData,
  getTertiaryOptions,
  statsCategories,
  statsDetailMap,
  externalFeedMap,
} from "@/pages/sys_page/sys_quanzhanlvetaishi/components/mockData";

const BASE = process.env.VUE_APP_QZLT_API || "/qzlt-api";

function toQuery(params = {}) {
  const search = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    const val = params[key];
    if (val !== undefined && val !== null && val !== "") {
      search.append(key, val);
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function request(path, { method = "GET", params, data } = {}) {
  const url = `${BASE}${path}${toQuery(params)}`;
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) {
    throw new Error(`[qzlt] ${method} ${url} -> HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

/**
 * 兼容后端多种返回包装：{ data } / { result } / { rows } / 直接数据体
 * 取不到业务字段时返回原始对象，由调用方自行判断
 */
function unwrap(payload) {
  if (!payload || typeof payload !== "object") return payload;
  const candidates = ["data", "result", "rows", "list", "records"];
  for (const key of candidates) {
    const val = payload[key];
    if (val && typeof val === "object" && !Array.isArray(val)) return val;
  }
  return payload;
}

/**
 * 统一入口：优先请求真实接口，失败时回落 mock。
 * @param {string} path 接口路径
 * @param {object} options request 配置
 * @param {Function} mockFn 返回兜底数据的函数
 */
function withMock(path, options, mockFn) {
  return request(path, options)
    .then(unwrap)
    .catch((err) => {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.info("[qzlt] 接口未接入，已回落到 mock：", path, err && err.message);
      }
      return typeof mockFn === "function" ? mockFn() : mockFn;
    });
}

/* ---------------- 中间·气泡图（气泡 + 右侧政策类型卡片） ---------------- */
export const fetchBubbleChart = (params) =>
  withMock("/portrait/bubbles", { params }, () => ({
    bubbles: portraitBubbles,
    cards: portraitCardMap,
  }));

/**
 * 单个气泡对应的政策类型卡片（激励型 / 约束型 / 混合型 + 省份得分）
 * @param {string} bubbleKey 气泡 key
 */
export const fetchBubbleCards = (bubbleKey, params) =>
  withMock(
    `/portrait/bubbles/${encodeURIComponent(bubbleKey)}/cards`,
    { params: { ...params, bubbleKey } },
    () => ({ cards: portraitCardMap[bubbleKey] || [] })
  );

/* ---------------- 中间·政策画像（目标地图 / 政策类型排行） ---------------- */
export const fetchPortraitViz = (params) =>
  withMock("/portrait/viz", { params }, () => ({
    map: goalMapData,
    rank: policyTypeRankData,
  }));

/* ---------------- 中间·量化目标（地图 / 排名 / 发布 + 左侧统计） ---------------- */
export const fetchGoalSummary = (params) =>
  withMock("/goal/summary", { params }, () => goalSummary);

export const fetchGoalViz = (params) =>
  withMock("/goal/viz", { params }, () => ({
    map: goalMapData,
    rank: goalRankData,
    release: goalReleaseData,
  }));

/* ---------------- 中间·方向热力矩阵 ---------------- */
export const fetchDirectionHeatmap = (params) =>
  withMock("/direction/heatmap", { params }, () => directionHeatmapData);

/* ---------------- 筛选项：三级分类目录 ---------------- */
export const fetchTertiaryOptions = (params) =>
  withMock("/categories/tertiary", { params }, () => getTertiaryOptions());

/* ---------------- 左侧政策统计 ---------------- */
export const fetchPolicyStats = (params) =>
  withMock("/policy/stats", { params }, () => ({
    categories: statsCategories,
    detailMap: statsDetailMap,
  }));

/* ---------------- 右侧外部动态 ---------------- */
export const fetchExternalFeed = (params) =>
  withMock("/policy/feed", { params }, () => externalFeedMap);

export default {
  fetchBubbleChart,
  fetchBubbleCards,
  fetchPortraitViz,
  fetchGoalSummary,
  fetchGoalViz,
  fetchDirectionHeatmap,
  fetchTertiaryOptions,
  fetchPolicyStats,
  fetchExternalFeed,
};
