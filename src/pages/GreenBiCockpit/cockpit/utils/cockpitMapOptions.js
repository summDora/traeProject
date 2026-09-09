import chinaJson from "../assets/china.json";
import { FONT_DIN } from "./chartTheme";
import { dpx, DESIGN_WIDTH } from "./designUnits";

const MAP_NAME = "china";

/** 辽宁示例同比例；全国地图保留 aspectScale 0.85 适配宽高，center 上移留出底部空间 */
const LAYOUT = {
  aspectScale: 0.85,
  zoom: 0.65,
  layoutCenter: ["50%", "38%"],
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
  min: 1,
  max: 5.5,
};

/** 设计稿柱宽（px） */
const PILLAR_WIDTH_DESIGN = 12;

/**
 * 柱体整体偏移 [经度, 纬度]（柱身、顶圆、底圆同步）
 * 也可在单条数据上设置 pillarOffset: [lng, lat] 覆盖全局值
 */
const PILLAR_GEO_OFFSET = [0, 0];

const PILLAR_TOP_COLOR = "#F8AF5C";

function resolveViewportWidth(viewportWidth) {
  if (viewportWidth != null) return viewportWidth;
  return typeof window !== "undefined" ? window.innerWidth : DESIGN_WIDTH;
}

function createScale(viewportWidth) {
  const vw = resolveViewportWidth(viewportWidth);
  const d = (value) => dpx(value, vw);
  const pillarWidth = d(PILLAR_WIDTH_DESIGN);
  const pillarCapSize = [pillarWidth, Math.round(pillarWidth * 0.72)];

  return { vw, d, pillarWidth, pillarCapSize };
}

/** 柱身渐变：顶部深、底部透明 */
function createPillarBodyGradient() {
  return {
    type: "linear",
    x: 0,
    y: 1,
    x2: 0,
    y2: 0,
    colorStops: [
      { offset: 0, color: "rgba(202, 243, 155, 0.7)" },
      { offset: 0.06, color: "rgba(159, 233, 255, 0.6)" },
      { offset: 0.3, color: "rgba(255, 206, 151, 0.25)" },
      { offset: 0.62, color: "rgba(255, 206, 151, 0.48)" },
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

function applyPillarOffset(lng, lat, itemOffset) {
  const [offsetLng, offsetLat] = itemOffset || PILLAR_GEO_OFFSET;
  return [lng + offsetLng, lat + offsetLat];
}

function buildPillarData(data, pillarWidth) {
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
    const [lng, lat] = applyPillarOffset(item.coord[0], item.coord[1], item.pillarOffset);
    const h = pillarHeight(item.value, minValue, maxValue);
    const topLat = lat + h;

    lines.push({
      coords: [
        [lng, lat],
        [lng, topLat],
      ],
      lineStyle: {
        width: pillarWidth,
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

function buildShadowSeries(d) {
  return SHADOW_LAYERS.map((layer, index) => ({
    name: `map-shadow-${index + 1}`,
    type: "map",
    map: MAP_NAME,
    zlevel: layer.zlevel,
    ...mapLayout(layer.centerY),
    silent: true,
    label: { show: false },
    emphasis: { disabled: true },
    itemStyle: {
      ...layer.itemStyle,
      shadowOffsetY: d(layer.itemStyle.shadowOffsetY),
      shadowBlur: d(layer.itemStyle.shadowBlur),
      borderWidth: Math.max(1, d(layer.itemStyle.borderWidth)),
    },
    data: shadowRegionData,
  }));
}

function createTooltipPosition(d) {
  return function tooltipPosition(point, params, dom, rect, size) {
    const boxWidth = size.contentSize[0];
    const boxHeight = size.contentSize[1];
    const gap = d(10);
    let x = boxWidth > point[0] ? point[0] + gap : point[0] - boxWidth - gap;
    let y = boxHeight > point[1] ? d(5) : point[1] - boxHeight;
    // 鼠标/区域中心坐标常为亚像素，不取整会导致 DOM tooltip 文字发糊
    return [Math.round(x), Math.round(y)];
  };
}

function createFormatTooltip(d) {
  const titleSize = `${d(14)}px`;
  const rowSize = `${d(12)}px`;

  return function formatTooltip(params) {
    if (params.seriesType === "map") {
      const name = params.name || "";
      let val = params.data && params.data.value;
      if (val == null || val === "" || Number.isNaN(Number(val))) {
        return `<div class="cockpit-map-tip"><div class="cockpit-map-tip__title" style="font-size:${titleSize}">${name}</div><div class="cockpit-map-tip__row" style="font-size:${rowSize}">暂无数据</div></div>`;
      }
      const num = Number(val).toLocaleString("zh-CN");
      return `<div class="cockpit-map-tip"><div class="cockpit-map-tip__title" style="font-size:${titleSize}">${name}</div><div class="cockpit-map-tip__row" style="font-size:${rowSize}">绿色专利授权量：${num}</div></div>`;
    }
    if (
      params.seriesType === "scatter" &&
      params.data &&
      params.data.rawValue != null
    ) {
      const num = Number(params.data.rawValue).toLocaleString("zh-CN");
      return `<div class="cockpit-map-tip"><div class="cockpit-map-tip__title" style="font-size:${titleSize}">${params.name}</div><div class="cockpit-map-tip__row" style="font-size:${rowSize}">绿色专利授权量：${num}</div></div>`;
    }
    return "";
  };
}

export function buildCockpitMapOptions(data = [], viewportWidth) {
  const { d, pillarWidth, pillarCapSize } = createScale(viewportWidth);
  const pillar = buildPillarData(data, pillarWidth);
  const provinceLabelSize = d(10);

  return {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "item",
      enterable: true,
      confine: true,
      transitionDuration: 0,
      position: createTooltipPosition(d),
      backgroundColor: "rgba(0, 2, 89, 0.85)",
      borderColor: "rgba(58, 149, 253, 0.45)",
      borderWidth: Math.max(1, d(1)),
      padding: d(8),
      textStyle: {
        color: "#fff",
        fontSize: d(12),
        fontFamily: FONT_DIN,
      },
      extraCssText: "-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;",
      formatter: createFormatTooltip(d),
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
          shadowOffsetY: d(10),
          shadowBlur: d(120),
          areaColor: "transparent",
        },
      },

      ...buildShadowSeries(d),
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
          fontSize: provinceLabelSize,
        },
        emphasis: {
          label: {
            show: true,
            color: "#fff",
            fontSize: provinceLabelSize,
          },
          itemStyle: {
            areaColor: "rgba(0, 254, 233, 0.4)",
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
          borderColor: "#ffffff66",
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
          width: pillarWidth,
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
        symbolSize: pillarCapSize,
        itemStyle: {
          color: PILLAR_TOP_COLOR,
          opacity: 1,
          borderWidth: 0,
        },
        emphasis: { disabled: true },
        label: {
          show: false,
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
        symbolSize: pillarCapSize,
        silent: true,
        label: { show: false },
        itemStyle: {
          color: "#71e1f5ff",
          opacity: 1,
          borderWidth: 0,
          shadowColor: "rgba(255, 206, 151, 0.45)",
          shadowBlur: d(6),
        },
        emphasis: { disabled: true },
        data: pillar.bases,
      },
      {
        type: "effectScatter",
        rippleEffect: {
          period: 4,
          scale: 2,
          number: 2,
          brushType: "stroke",
        },
        name: "pillar-base-effect",
        coordinateSystem: "geo",
        geoIndex: 0,
        zlevel: 6,
        symbol: "circle",
        symbolSize: [20,10],
        silent: true,
        label: { show: false },
        itemStyle: {
          color: "#ffffff56",
          opacity: .4,
          borderWidth: 0,
          shadowColor: "rgba(255, 206, 151, 0.45)",
          shadowBlur: d(6),
        },
        emphasis: { disabled: true },
        data: pillar.bases,
      },
    ],
  };
}
