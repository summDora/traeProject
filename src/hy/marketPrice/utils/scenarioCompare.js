/** 用户已创建的场景（模拟数据） */
export const MOCK_SCENARIOS = [
  { id: "s1", name: "2026年负荷预测" },
  { id: "s2", name: "2026年电源预测" },
  { id: "s3", name: "2027年负荷预测" },
  { id: "s4", name: "2027年电源预测" },
  { id: "s5", name: "2028年负荷预测" },
  { id: "s6", name: "2028年电源预测" },
  { id: "s7", name: "2029年负荷预测" },
  { id: "s8", name: "2029年电源预测" },
  { id: "s9", name: "2030年负荷预测" },
  { id: "s10", name: "2030年电源预测" },
];

const SCENARIO_META = {
  s1: { forecastType: "系统负荷曲线预测", dimension: "冬季" },
  s2: { forecastType: "电源出力曲线预测", dimension: "春季" },
  s3: { forecastType: "系统负荷曲线预测", dimension: "假期" },
  s4: { forecastType: "电源出力曲线预测", dimension: "夏高" },
  s5: { forecastType: "系统负荷曲线预测", dimension: "秋季" },
  s6: { forecastType: "电源出力曲线预测", dimension: "冬季" },
  s7: { forecastType: "系统负荷曲线预测", dimension: "春季" },
  s8: { forecastType: "电源出力曲线预测", dimension: "假期" },
  s9: { forecastType: "系统负荷曲线预测", dimension: "夏高" },
  s10: { forecastType: "电源出力曲线预测", dimension: "秋季" },
};

export const MAX_SCENARIO_SELECT = 5;
export const MAX_SCENARIO_NAME_LEN = 20;

export function truncateName(name, maxLen = MAX_SCENARIO_NAME_LEN) {
  if (!name) return "";
  return name.length > maxLen ? `${name.slice(0, maxLen)}…` : name;
}

function hashSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function generateScenarioSeries(scenarioId) {
  const random = seededRandom(hashSeed(scenarioId));
  const base = 260 + (hashSeed(scenarioId) % 100);
  const data = [];

  for (let i = 0; i < 96; i++) {
    const wave = Math.sin((i / 96) * Math.PI * 4) * 20;
    const noise = (random() - 0.5) * 18;
    data.push(Number(Math.max(50, base + wave + noise).toFixed(2)));
  }

  return data;
}

function calcStats(data) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
  return {
    avg: avg.toFixed(0),
    min: min.toFixed(0),
    max: max.toFixed(0),
  };
}

export function buildCompareDetails(scenarios) {
  return scenarios.map((item, index) => {
    const meta = SCENARIO_META[item.id] || {
      forecastType: "系统负荷曲线预测",
      dimension: "冬季",
    };
    const series = generateScenarioSeries(item.id);
    const stats = calcStats(series);

    return {
      id: item.id,
      index: index + 1,
      name: item.name,
      forecastType: meta.forecastType,
      dimension: meta.dimension,
      version: "v1.1",
      createTime: "2025-11-29 12:33:19",
      avg: stats.avg,
      min: stats.min,
      max: stats.max,
      series,
    };
  });
}

export function buildSingleCurveOption(scenario) {
  const xLabels = Array.from({ length: 96 }, (_, i) => `时点${i + 1}`);

  return {
    color: ["#409eff"],
    tooltip: { trigger: "axis", confine: true },
    grid: {
      left: 16,
      right: 24,
      top: 40,
      bottom: 16,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xLabels,
      axisLabel: { interval: 7 },
    },
    yAxis: {
      type: "value",
      name: "价格（元/千千瓦时）",
      scale: true,
    },
    series: [
      {
        name: scenario.name,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 4,
        data: scenario.series,
      },
    ],
  };
}
