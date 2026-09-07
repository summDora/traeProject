import chinaJson from "../assets/china.json";
import { FONT_DIN } from "./chartTheme";

const MAP_NAME = "china";

/** 辽宁示例同比例；全国地图保留 aspectScale 0.85 适配宽高，center 上移留出底部空间 */
const LAYOUT = {
  aspectScale: 0.85,
  zoom: 0.65,
  layoutCenter: ["50%", "41%"],
  layoutSize: "180%",
};

/** 4 层重影 + 1 主地图 */
export const MAP_MAIN_SERIES_INDEX = 4;

const SHADOW_LAYERS = [
  {
    zlevel: -1,
    centerY: "42%",
    itemStyle: {
      borderWidth: 1,
      borderColor: "rgba(58, 149, 253, 0.8)",
      shadowColor: "rgba(172, 122, 255, 0.5)",
      shadowOffsetY: 5,
      shadowBlur: 15,
      areaColor: "rgba(5, 21, 35, 0.1)",
    },
  },
  {
    zlevel: -2,
    centerY: "43%",
    itemStyle: {
      borderWidth: 1,
      borderColor: "rgba(58, 149, 253, 0.6)",
      shadowColor: "rgba(65, 214, 255, 1)",
      shadowOffsetY: 5,
      shadowBlur: 15,
      areaColor: "transparent",
    },
  },
  {
    zlevel: -3,
    centerY: "44%",
    itemStyle: {
      borderWidth: 1,
      borderColor: "rgba(58, 149, 253, 0.4)",
      shadowColor: "rgba(58, 149, 253, 1)",
      shadowOffsetY: 15,
      shadowBlur: 10,
      areaColor: "transparent",
    },
  },
  {
    zlevel: -4,
    centerY: "45%",
    itemStyle: {
      borderWidth: 5,
      borderColor: "rgba(5, 9, 57, 0.8)",
      shadowColor: "rgba(29, 111, 165, 0.8)",
      shadowOffsetY: 15,
      shadowBlur: 10,
      areaColor: "rgba(5, 21, 35, 0.1)",
    },
  },
];

/** 柱体高度（geo 经纬度偏移） */
const PILLAR_HEIGHT = {
  min: 2.6,
  max: 5.4,
};

/** 圆柱直径（px），柱身与顶/底圆保持一致 */
const PILLAR_WIDTH = 12;

const PILLAR_COLOR = "#FFCE97";
const PILLAR_TOP_COLOR = "rgba(232, 160, 96, 0.95)";

/** 柱身渐变：顶部深、底部透明 */
function createPillarBodyGradient() {
  return {
    type: "linear",
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [
      { offset: 0, color: "rgba(255, 206, 151, 0)" },
      { offset: 0.25, color: "rgba(255, 206, 151, 0.15)" },
      { offset: 0.62, color: "rgba(255, 206, 151, 0.58)" },
      { offset: 1, color: PILLAR_TOP_COLOR },
    ],
    global: false,
  };
}

/** 将数值映射为 0~1（线性 min-max） */
function valueToRatio(value, minValue, maxValue) {
  if (maxValue <= minValue) return 1;
  return (value - minValue) / (maxValue - minValue);
}

function pillarHeight(value, minValue, maxValue) {
  const ratio = valueToRatio(value, minValue, maxValue);
  return PILLAR_HEIGHT.min + ratio * (PILLAR_HEIGHT.max - PILLAR_HEIGHT.min);
}

function formatPillarValue(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万`;
  return num.toLocaleString("zh-CN");
}

const provinceCoords = {};
const shadowRegionData = [];
chinaJson.features.forEach((f) => {
  const { name, cp } = f.properties || {};
  if (name) {
    shadowRegionData.push({ name, value: 0 });
    if (cp) provinceCoords[name] = cp;
  }
});

function mapLayout(centerY = LAYOUT.layoutCenter[1]) {
  return {
    aspectScale: LAYOUT.aspectScale,
    zoom: LAYOUT.zoom,
    layoutCenter: ["50%", centerY],
    layoutSize: LAYOUT.layoutSize,
    roam: false,
  };
}

function getCoord(item) {
  if (item.coordinate && item.coordinate.length >= 2) {
    return item.coordinate;
  }
  return provinceCoords[item.name];
}

function buildPillarData(data) {
  const valid = data
    .map((item) => ({ ...item, coord: getCoord(item) }))
    .filter((item) => item.coord && item.value > 0);

  if (!valid.length) {
    return { lines: [], tops: [], bases: [], maxValue: 1 };
  }

  const values = valid.map((item) => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const lines = [];
  const tops = [];
  const bases = [];

  valid.forEach((item) => {
    const [lng, lat] = item.coord;
    const h = pillarHeight(item.value, minValue, maxValue);
    const topLat = lat + h;

    lines.push({
      coords: [
        [lng, lat],
        [lng, topLat],
      ],
      lineStyle: {
        width: PILLAR_WIDTH,
        color: createPillarBodyGradient(),
      },
    });
    tops.push({
      name: item.name,
      value: [lng, topLat],
      rawValue: item.value,
    });
    bases.push({
      name: item.name,
      value: [lng, lat],
      rawValue: item.value,
    });
  });

  return { lines, tops, bases, maxValue };
}

function buildShadowSeries() {
  return SHADOW_LAYERS.map((layer, index) => ({
    name: `map-shadow-${index + 1}`,
    type: "map",
    map: MAP_NAME,
    zlevel: layer.zlevel,
    ...mapLayout(layer.centerY),
    silent: true,
    label: { show: false },
    emphasis: { disabled: true },
    itemStyle: layer.itemStyle,
    data: shadowRegionData,
  }));
}

function tooltipPosition(point, params, dom, rect, size) {
  const boxWidth = size.contentSize[0];
  const boxHeight = size.contentSize[1];
  let x = boxWidth > point[0] ? point[0] + 10 : point[0] - boxWidth - 10;
  let y = boxHeight > point[1] ? 5 : point[1] - boxHeight;
  return [x, y];
}

function formatTooltip(params) {
  if (params.seriesType === "map") {
    const name = params.name || "";
    let val = params.data && params.data.value;
    if (val == null || val === "" || Number.isNaN(Number(val))) {
      return `<div class="cockpit-map-tip"><div class="cockpit-map-tip__title">${name}</div><div class="cockpit-map-tip__row">暂无数据</div></div>`;
    }
    const num = Number(val).toLocaleString("zh-CN");
    return `<div class="cockpit-map-tip"><div class="cockpit-map-tip__title">${name}</div><div class="cockpit-map-tip__row">绿色专利授权量：${num}</div></div>`;
  }
  if (
    params.seriesType === "scatter" &&
    params.data &&
    params.data.rawValue != null
  ) {
    const num = Number(params.data.rawValue).toLocaleString("zh-CN");
    return `<div class="cockpit-map-tip"><div class="cockpit-map-tip__title">${params.name}</div><div class="cockpit-map-tip__row">绿色专利授权量：${num}</div></div>`;
  }
  return "";
}

export function buildCockpitMapOptions(data = []) {
  const pillar = buildPillarData(data);

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      enterable: true,
      position: tooltipPosition,
      backgroundColor: "rgba(0, 2, 89, 0.85)",
      borderColor: "rgba(58, 149, 253, 0.45)",
      textStyle: {
        color: "#fff",
        fontSize: 12,
        fontFamily: FONT_DIN,
      },
      formatter: formatTooltip,
    },
    geo: [
      {
        map: MAP_NAME,
        ...mapLayout(),
        show: true,
        roam: false,
        silent: true,
        label: {
          show: false,
          emphasis: { show: false },
        },
        itemStyle: {
          borderColor: "#c0f3fb",
          borderWidth: 1,
          shadowColor: "#8cd3ef",
          shadowOffsetY: 10,
          shadowBlur: 120,
          areaColor: "transparent",
        },
      },

      ...buildShadowSeries(),
    ],
    series: [
      {
        name: "省份数据",
        type: "map",
        map: MAP_NAME,

        ...mapLayout(),
        zlevel: 1,
        data,
        label: {
          show: true,
          color: "#fff",
          fontSize: 10,
        },
        emphasis: {
          label: {
            show: true,
            color: "#fff",
            fontSize: 10,
          },
          itemStyle: {
            areaColor: "rgba(0, 254, 233, 0.6)",
            borderWidth: 0,
          },
        },
        itemStyle: {
          areaColor: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 700,
            colorStops: [
              { offset: 0, color: "rgba(3, 27, 78, 0.75)" },
              { offset: 1, color: "rgba(58, 149, 253, 0.75)" },
            ],
            global: true,
          },
          borderColor: "#fff",
          borderWidth: 0.2,
        },
        select: { disabled: true },
      },
      {
        name: "pillar-lines",
        type: "lines",
        coordinateSystem: "geo",
        geoIndex: 0,
        zlevel: 5,
        silent: true,
        effect: { show: false },
        lineStyle: {
          width: PILLAR_WIDTH,
          opacity: 1,
          curveness: 0,
          cap: "round",
        },
        data: pillar.lines,
      },
      {
        name: "pillar-top",
        type: "scatter",
        coordinateSystem: "geo",
        geoIndex: 0,
        zlevel: 6,
        silent: true,
        symbol: "circle",
        symbolSize: PILLAR_WIDTH,
        itemStyle: {
          color: PILLAR_TOP_COLOR,
          opacity: 1,
          borderColor: "rgba(255, 230, 200, 0.9)",
          borderWidth: 1,
        },
        label: {
          show: true,
          formatter: (params) => formatPillarValue(params.data.rawValue),
          position: "top",
          distance: 4,
          color: PILLAR_COLOR,
          fontSize: 11,
          fontWeight: 600,
          fontFamily: FONT_DIN,
          textBorderColor: "rgba(0, 20, 60, 0.85)",
          textBorderWidth: 2,
        },
        data: pillar.tops,
      },
      {
        name: "pillar-base",
        type: "scatter",
        coordinateSystem: "geo",
        geoIndex: 0,
        zlevel: 5,
        symbol: "circle",
        symbolSize: PILLAR_WIDTH,
        silent: true,
        label: { show: false },
        itemStyle: {
          color: "#ffffff",
          opacity: 1,
          borderColor: "rgba(255, 230, 210, 0.95)",
          borderWidth: 1,
          shadowColor: "rgba(255, 206, 151, 0.45)",
          shadowBlur: 6,
        },
        data: pillar.bases,
      },
    ],
  };
}
