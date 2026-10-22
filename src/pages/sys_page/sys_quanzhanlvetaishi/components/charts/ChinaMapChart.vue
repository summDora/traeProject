<template>
  <div class="sys-chart sys-chart--map" :class="chartClass">
    <div ref="chartEl" class="sys-chart__el"></div>

    <!-- 最大值省份：气泡展示数值（底图 bubble-bg.png） -->
    <div
      v-if="bubble.show"
      class="map-bubble"
      :style="{
        left: `${bubble.x}px`,
        top: `${bubble.y}px`,
        width: `${bubble.size}px`,
        height: `${bubble.size}px`,
      }"
    >
      <span class="map-bubble__value">{{ bubble.value }}</span>
    </div>

    <!-- 连续色阶图例：与设计稿一致（深→浅五段 + 0 / 无数据 区分） -->
    <ul class="map-legend">
      <li
        v-for="band in legendBands"
        :key="band.label"
        class="map-legend__item"
      >
        <span
          class="map-legend__swatch"
          :style="{ backgroundColor: band.color }"
        ></span>
        <span class="map-legend__label">{{ band.label }}</span>
      </li>
      <li class="map-legend__item map-legend__item--gap">
        <span class="map-legend__swatch map-legend__swatch--zero"></span>
        <span class="map-legend__label">0</span>
      </li>
      <li class="map-legend__item">
        <span class="map-legend__swatch map-legend__swatch--empty"></span>
        <span class="map-legend__label">无数据</span>
      </li>
    </ul>
  </div>
</template>

<script>
import echarts from "./echarts";
import chinaJson from "./assets/china.json";
import chartMixin from "./chartMixin";
import { getTheme, buildTooltip } from "./theme";

let mapRegistered = false;
function registerChinaMap() {
  if (mapRegistered) return;
  echarts.registerMap("china", chinaJson);
  mapRegistered = true;
}

/** 设计稿色阶（低 → 高：深青 → 亮青，深色底图上高值更醒目） */
const RAMP = ["#17576b", "#1a7a90", "#1b9aaf", "#23b4c6", "#45cfe0"];
/** 图例分段：与设计稿一致（自上而下 90-100 → 50-59） */
const LEGEND_BANDS = [
  { label: "90-100", color: RAMP[4] },
  { label: "80-89", color: RAMP[3] },
  { label: "70-79", color: RAMP[2] },
  { label: "60-69", color: RAMP[1] },
  { label: "50-59", color: RAMP[0] },
];
/** 色阶取值区间 */
const RAMP_MIN = 0;
const RAMP_MAX = 100;
/** 气泡圆环直径（px，设计基准） */
const BUBBLE_DIAM = 104;
/**
 * bubble-bg.png（1523 × 994）里可见圆环：中心 (760, 502)、直径 804px
 * 底图自带的环只有 1px 宽，直接缩到气泡尺寸会消失，
 * 所以把底图放大 1523/804 ≈ 189.45% 并偏移，让圆环正好铺满气泡直径
 */
const BUBBLE_BG_SCALE = 189.45;
const BUBBLE_BG_POS_X = 49.8;
const BUBBLE_BG_POS_Y = 52.7;

/** 十六进制色值线性插值 */
function mixColor(a, b, t) {
  const pa = [1, 3, 5].map((i) => parseInt(a.substr(i, 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.substr(i, 2), 16));
  const out = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${out[0]},${out[1]},${out[2]})`;
}

/** 按数值在色阶上取色 */
function rampColor(value) {
  const t = Math.max(
    0,
    Math.min(1, (value - RAMP_MIN) / (RAMP_MAX - RAMP_MIN)),
  );
  const scaled = t * (RAMP.length - 1);
  const idx = Math.min(RAMP.length - 2, Math.floor(scaled));
  return mixColor(RAMP[idx], RAMP[idx + 1], scaled - idx);
}

/** 省份中心点（取自 china.json 的 cp 字段） */
const PROVINCE_CP = chinaJson.features.reduce((map, feature) => {
  const cp = feature.properties && feature.properties.cp;
  if (cp) map[feature.properties.name] = cp;
  return map;
}, {});

/**
 * 目标地图（可复用原子图表）—— 中国地图着色 + 省份名 + 最大值气泡
 * props:
 *  - data: [{ name, value }]，name 需与 china.json 行政区名一致（如「广东」「北京」）
 *    value 为 null / undefined 表示无数据，与 0 视觉区分
 *  - theme: "dark" | "light"
 */
export default {
  name: "ChinaMapChart",
  mixins: [chartMixin],
  data() {
    return {
      legendBands: LEGEND_BANDS,
      bubble: { show: false, x: 0, y: 0, size: 0, value: "" },
    };
  },
  computed: {
    palette() {
      return getTheme(this.theme);
    },
    chartClass() {
      return this.theme === "light" ? "is-light" : "is-dark";
    },
    /** 当前数据里的最大值省份 */
    maxProvince() {
      const arr = Array.isArray(this.data) ? this.data : [];
      return arr
        .filter(
          (item) =>
            item &&
            item.value !== null &&
            item.value !== undefined &&
            item.value !== "",
        )
        .reduce(
          (best, item) =>
            !best || Number(item.value) > Number(best.value) ? item : best,
          null,
        );
    },
  },
  mounted() {
    registerChinaMap();
    // 容器尺寸变化时重新定位气泡（mixin 只负责 resize 画布）
    if (typeof ResizeObserver !== "undefined" && this.$refs.chartEl) {
      this._bubbleObserver = new ResizeObserver(() => this.syncBubble());
      this._bubbleObserver.observe(this.$refs.chartEl);
    }
  },
  beforeDestroy() {
    if (this._bubbleObserver) {
      this._bubbleObserver.disconnect();
      this._bubbleObserver = null;
    }
  },
  methods: {
    /** 读取页面缩放比例（--qzlt-s） */
    readScale() {
      const el = this.$refs.chartEl;
      if (!el) return 1;
      const value = parseFloat(
        getComputedStyle(el).getPropertyValue("--qzlt-s"),
      );
      return Number.isFinite(value) && value > 0 ? value : 1;
    },
    /** 渲染后把最大值气泡定位到对应省份上 */
    syncBubble() {
      const max = this.maxProvince;
      if (!max || !this.chart) {
        this.bubble = { show: false, x: 0, y: 0, size: 0, value: "" };
        return;
      }
      const cp = PROVINCE_CP[max.name];
      if (!cp) {
        this.bubble = { show: false, x: 0, y: 0, size: 0, value: "" };
        return;
      }
      const point = this.chart.convertToPixel({ seriesIndex: 0 }, cp);
      if (!point || !Number.isFinite(point[0])) {
        this.bubble = { show: false, x: 0, y: 0, size: 0, value: "" };
        return;
      }
      // 容器边长 = 圆环直径（底图放大后圆环正好铺满容器）
      const ringSize = BUBBLE_DIAM * this.readScale();
      this.bubble = {
        show: true,
        x: point[0],
        y: point[1],
        size: Math.round(ringSize),
        value: String(max.value),
      };
    },
    /** 覆盖 mixin 的 renderChart：先画图，再定位气泡 */
    renderChart() {
      chartMixin.methods.renderChart.call(this);
      this.$nextTick(this.syncBubble);
    },
    buildOption(p) {
      const arr = Array.isArray(this.data) ? this.data : [];
      const valueMap = arr.reduce((map, item) => {
        map[item.name] = item.value;
        return map;
      }, {});

      // 0 与无数据分别取色，避免「没有数据」被误读成「数值为 0」
      const zeroColor = p.mapZeroColor;
      const emptyColor = p.mapEmptyColor;

      const regionData = Object.keys(PROVINCE_CP).map((name) => {
        const has = Object.prototype.hasOwnProperty.call(valueMap, name);
        const value = has ? valueMap[name] : null;
        const isEmpty =
          !has || value === null || value === undefined || value === "";
        const isZero = !isEmpty && Number(value) === 0;
        return {
          name,
          value: isEmpty ? null : Number(value),
          itemStyle: {
            areaColor: isEmpty
              ? emptyColor
              : isZero
              ? zeroColor
              : rampColor(Number(value)),
            borderColor: isEmpty
              ? p.mapEmptyBorder
              : isZero
              ? p.mapZeroBorder
              : p.mapBorder,
            borderWidth: isEmpty ? 0.6 : isZero ? 1.1 : 0.8,
            borderType: isZero ? "dashed" : "solid",
          },
          label: {
            show: true,
            color: p.mapLabel,
            // color: isEmpty
            //   ? p.mapEmptyText
            //   : isZero
            //   ? p.mapZeroText
            //   : p.mapLabel,
            fontSize: 10,
            formatter: name,
          },
        };
      });

      return {
        tooltip: {
          ...buildTooltip(p),
          trigger: "item",
          formatter: (params) => {
            const has = Object.prototype.hasOwnProperty.call(
              valueMap,
              params.name,
            );
            const raw = valueMap[params.name];
            if (!has || raw === null || raw === undefined || raw === "") {
              return `${params.name}<br/>无数据`;
            }
            if (Number(raw) === 0)
              return `${params.name}<br/>${params.marker}0`;
            return `${params.name}<br/>${params.marker}${raw}`;
          },
        },
        series: [
          {
            name: "目标",
            type: "map",
            map: "china",
            roam: false,
            scaleLimit: { min: 0.8, max: 2 },
            label: { show: true, color: p.mapLabel, fontSize: 10 },
            itemStyle: {
              areaColor: p.mapArea,
              borderColor: p.mapBorder,
              borderWidth: 0.8,
            },
            emphasis: {
              label: { show: true, color: p.textStrong, fontSize: 12 },
              itemStyle: { areaColor: p.accent },
            },
            select: { disabled: true },
            data: regionData,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-chart--map {
  position: relative;
  width: 100%;
  height: 100%;

  .sys-chart__el {
    width: 100%;
    height: 100%;
  }
}

/* ---- 最大值气泡 ---- */
.map-bubble {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 3;

  /* 底图是浅色柔光，深色底上用滤色让光晕透出来 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("~@/asset/images/qzlts/bubble-bg.png");
    background-repeat: no-repeat;
    /* 放大底图让其自带圆环正好铺满气泡直径 */
    background-size: 189.45% auto;
    background-position: 49.8% 52.7%;
    mix-blend-mode: screen;
    filter: brightness(1.2) saturate(1.1);
  }

  &__value {
    position: relative;
    font-size: calc(30px * var(--qzlt-s, 1));
    font-weight: 700;
    letter-spacing: 1px;
    color: #ffffff;
    text-shadow: 0 0 calc(10px * var(--qzlt-s, 1)) rgba(0, 30, 60, 0.9);
  }
}

/* ---- 连续色阶图例 ---- */
.map-legend {
  position: absolute;
  right: calc(10px * var(--qzlt-s, 1));
  top: 50%;
  transform: translateY(-50%);
  margin: 0;
  padding: 0;
  list-style: none;
  pointer-events: none;
  z-index: 2;

  &__item {
    display: flex;
    align-items: center;
    gap: calc(8px * var(--qzlt-s, 1));
    height: calc(22px * var(--qzlt-s, 1));
  }
  &__item--gap {
    margin-top: calc(8px * var(--qzlt-s, 1));
  }
  &__swatch {
    flex: none;
    width: calc(20px * var(--qzlt-s, 1));
    height: calc(20px * var(--qzlt-s, 1));
    border: 1px solid rgba(255, 255, 255, 0.85);
  }
  &__swatch--zero {
    background: rgba(74, 122, 158, 0.85);
    border: 1px dashed rgba(190, 235, 255, 0.75);
  }
  &__swatch--empty {
    background: rgba(9, 30, 50, 0.92);
    border-color: rgba(70, 130, 170, 0.4);
  }
  &__label {
    font-size: calc(13px * var(--qzlt-s, 1));
    letter-spacing: 0.5px;
    color: #d7ecf7;
    white-space: nowrap;
  }
}
.is-light {
  .map-legend__label {
    color: #334155;
  }
}
</style>
