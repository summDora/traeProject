const POINT_COUNT = 96;
const TREND_THRESHOLD = 0.05;

const CHART_COLORS = [
  "#667eea",
  "#f56c6c",
  "#67c23a",
  "#e6a23c",
  "#409eff",
];

export function getTimePointLabels() {
  return Array.from({ length: POINT_COUNT }, (_, i) => `时点${i + 1}`);
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

export function generatePriceSeries(key) {
  const random = seededRandom(hashSeed(key));
  const base = 280 + (hashSeed(key) % 120);
  const trend = (random() - 0.5) * 0.8;
  const data = [];

  for (let i = 0; i < POINT_COUNT; i++) {
    const wave =
      Math.sin((i / POINT_COUNT) * Math.PI * 4) * 18 +
      Math.cos((i / POINT_COUNT) * Math.PI * 2) * 10;
    const noise = (random() - 0.5) * 16;
    const trendValue = trend * i;
    const price = Math.max(50, base + wave + noise + trendValue);
    data.push(Number(price.toFixed(2)));
  }

  return data;
}

export function analyzeTrend(data) {
  const segment = Math.floor(POINT_COUNT / 4);
  const head = data.slice(0, segment);
  const tail = data.slice(POINT_COUNT - segment);
  const headAvg = head.reduce((sum, val) => sum + val, 0) / head.length;
  const tailAvg = tail.reduce((sum, val) => sum + val, 0) / tail.length;
  const changeRate = headAvg === 0 ? 0 : (tailAvg - headAvg) / headAvg;

  if (Math.abs(changeRate) < TREND_THRESHOLD) {
    return "变化幅度不大";
  }
  if (changeRate > 0) {
    return "呈上升趋势";
  }
  return "呈下降趋势";
}

export function buildTrendText(items, seriesMap) {
  return items
    .map((item) => {
      const data = seriesMap[item.key];
      const trend = analyzeTrend(data);
      return `${item.label}96时点的价格数据${trend}`;
    })
    .join("；");
}

export function buildStatsTable(dimension, items, seriesMap) {
  const dimensionLabelMap = {
    year: "年份",
    month: "月度",
    week: "周度",
  };

  return {
    dimensionLabel: dimensionLabelMap[dimension] || "时间",
    rows: items.map((item) => {
      const data = seriesMap[item.key];
      const min = Math.min(...data);
      const max = Math.max(...data);
      const avg = data.reduce((sum, val) => sum + val, 0) / data.length;
      return {
        label: item.label,
        avg: avg.toFixed(2),
        min: min.toFixed(2),
        max: max.toFixed(2),
      };
    }),
  };
}

export function buildChartOption(items, seriesMap) {
  const xLabels = getTimePointLabels();
  const legendTop = items.length > 3 ? 8 : 8;
  const gridTop = items.length > 3 ? 72 : 56;

  return {
    color: CHART_COLORS,
    tooltip: {
      trigger: "axis",
      confine: true,
      formatter(params) {
        if (!params || !params.length) return "";
        const pointLabel = params[0].axisValue;
        const lines = params.map(
          (item) =>
            `${item.marker}${item.seriesName}<br/>时点：${pointLabel}<br/>价格：${item.value} 元/千千瓦时`
        );
        return lines.join("<br/><br/>");
      },
    },
    legend: {
      type: items.length > 4 ? "scroll" : "plain",
      data: items.map((item) => item.label),
      top: legendTop,
      left: "center",
      itemGap: 16,
    },
    grid: {
      left: 16,
      right: 24,
      top: gridTop,
      bottom: 16,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xLabels,
      name: "时点",
      nameLocation: "middle",
      nameGap: 28,
      axisLabel: {
        interval: 7,
        rotate: 0,
      },
    },
    yAxis: {
      type: "value",
      name: "价格（元/千千瓦时）",
      nameLocation: "end",
      nameGap: 12,
      scale: true,
    },
    series: items.map((item) => ({
      name: item.label,
      type: "line",
      smooth: true,
      symbol: "circle",
      symbolSize: 4,
      data: seriesMap[item.key],
    })),
  };
}
