<!--
 * 全应用场景 —— 园区省份分布地图
 * 使用项目固定的 ECharts 4.9 + china.json：地图着色、省份名称、数量徽标、图例与 tooltip
-->
<template>
  <div class="qy-park-map">
    <div ref="chartEl" class="qy-park-map__canvas"></div>

    <ul v-if="scene.key === 'green-direct'" class="qy-map-legend">
      <li v-for="item in legend" :key="item.label" class="qy-map-legend__item">
        <span class="qy-map-legend__swatch" :style="{ background: item.color }"></span>
        <span class="qy-map-legend__label">{{ item.label }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
// eslint-disable-next-line
const echarts = require("echarts4");
import chinaJson from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/assets/china.json";
import { mapTooltips } from "./mockData";

let chinaRegistered = false;

const PROVINCE_CP = chinaJson.features.reduce((result, feature) => {
  const cp = feature.properties && feature.properties.cp;
  if (cp) result[feature.properties.name] = cp;
  return result;
}, {});
const PROVINCES = Object.keys(PROVINCE_CP);

const AREA_COLOR = "#0a7f96";
const AREA_ACTIVE = "#12b9ca";
const BORDER_COLOR = "#5fe4f2";
const VALUE_COLORS = ["#007d99", "#009fb8", "#00bcd1", "#00dfeb"];

function valueColor(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return AREA_COLOR;
  if (n >= 90) return VALUE_COLORS[3];
  if (n >= 5) return VALUE_COLORS[2];
  if (n >= 2) return VALUE_COLORS[1];
  return VALUE_COLORS[0];
}

function registerChinaMap() {
  if (!chinaRegistered) {
    echarts.registerMap("qy-china", chinaJson);
    chinaRegistered = true;
  }
}

export default {
  name: "QyParkMap",
  props: {
    scene: { type: Object, required: true },
  },
  data() {
    return {
      chart: null,
      observer: null,
      legend: [
        { label: "≥ 90 个", color: "#00dfeb" },
        { label: "5 - 9 个", color: "#00bcd1" },
        { label: "2 - 4 个", color: "#009fb8" },
        { label: "1 个", color: "#007d99" },
      ],
    };
  },
  computed: {
    badges() {
      return (this.scene && this.scene.badges) || [];
    },
  },
  watch: {
    badges() {
      this.renderChart();
    },
  },
  mounted() {
    registerChinaMap();
    this.$nextTick(() => this.initChart());
  },
  beforeDestroy() {
    this.teardownChart();
  },
  methods: {
    initChart() {
      const el = this.$refs.chartEl;
      if (!el) return;
      this.chart = echarts.init(el);
      if (typeof ResizeObserver !== "undefined") {
        this.observer = new ResizeObserver(() => this.resizeChart());
        this.observer.observe(el);
      } else {
        window.addEventListener("resize", this.resizeChart);
      }
      this.renderChart();
    },
    resizeChart() {
      if (this.chart) this.chart.resize();
    },
    teardownChart() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      window.removeEventListener("resize", this.resizeChart);
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
    buildProvinceData() {
      const valueMap = this.badges.reduce((map, item) => {
        map[item.name] = item.value;
        return map;
      }, {});

      return PROVINCES.map((name) => {
        const value = valueMap[name];
        const hasValue = value !== undefined && value !== null;
        return {
          name,
          value: hasValue ? Number(value) : null,
          itemStyle: {
            areaColor: hasValue ? valueColor(value) : AREA_COLOR,
            borderColor: BORDER_COLOR,
            borderWidth: 1,
          },
        };
      });
    },
    buildBadgeData() {
      return this.badges
        .filter((item) => PROVINCE_CP[item.name])
        .map((item) => ({
          name: item.name,
          value: [...PROVINCE_CP[item.name], Number(item.value)],
        }));
    },
    buildGlowData() {
      return this.badges
        .filter((item) => PROVINCE_CP[item.name])
        .map((item) => ({
          name: item.name,
          value: [...PROVINCE_CP[item.name], Number(item.value)],
        }));
    },
    buildRippleData() {
      return this.buildGlowData();
    },
    tooltipFormatter(params) {
      const sample = mapTooltips[this.scene.key] || mapTooltips["green-direct"];
      const name = params.name || sample.province;
      const value =
        (this.badges.find((item) => item.name === name) || {}).value ||
        sample.count;
      return `<div class="qy-map-tip">
        <div class="qy-map-tip__head">
          <span class="qy-map-tip__name">${name}</span>
          <span class="qy-map-tip__chip">${value} 个</span>
        </div>
        <p class="qy-map-tip__status">${sample.status}</p>
        <span class="qy-map-tip__line"></span>
        <p class="qy-map-tip__row">代表项目 · ${sample.projects[0]}</p>
        <p class="qy-map-tip__row">代表项目 · ${sample.projects[1]}</p>
        <p class="qy-map-tip__row">代表项目 · ${sample.projects[2]}</p>
        <span class="qy-map-tip__line"></span>
        <p class="qy-map-tip__dim">${sample.footnotes[0]}</p>
        <p class="qy-map-tip__dim">${sample.footnotes[1]}</p>
      </div>`;
    },
    renderChart() {
      if (!this.chart) return;
      this.chart.setOption(
        {
          animationDuration: 500,
          tooltip: {
            trigger: "item",
            confine: true,
            appendToBody: true,
            backgroundColor: "transparent",
            borderWidth: 0,
            padding: 0,
            extraCssText:
              "box-shadow:none;max-width:none;white-space:normal;z-index:9999;",
            formatter: (params) => this.tooltipFormatter(params),
          },
          geo: {
            map: "qy-china",
            roam: false,
            layoutCenter: ["50%", "50%"],
            layoutSize: "130%",
            silent: true,
            itemStyle: {
              areaColor: "transparent",
              borderColor: "transparent",
              borderWidth: 0,
            },
            label: { show: false },
            emphasis: {
              itemStyle: { areaColor: "transparent" },
              label: { show: false },
            },
            select: { disabled: true },
          },
          series: [
            {
              name: "省份分布",
              type: "map",
              map: "qy-china",
              roam: false,
              layoutCenter: ["50%", "50%"],
              layoutSize: "130%",
              data: this.buildProvinceData(),
              label: {
                show: true,
                color: "#ffffff",
                fontSize: 9,
                align: "center",
                verticalAlign: "middle",
                textShadowColor: "#000",
                textShadowBlur: 1.68,
                textShadowOffsetX: 0,
                textShadowOffsetY: 0.84,
                formatter: "{b}",
              },
              itemStyle: {
                areaColor: AREA_COLOR,
                borderColor: BORDER_COLOR,
                borderWidth: 1,
              },
              emphasis: {
                label: { show: true, color: "#ffffff", fontSize: 10 },
                itemStyle: { areaColor: AREA_ACTIVE },
              },
              select: { disabled: true },
            },
            {
              name: "项目波纹",
              type: "scatter",
              coordinateSystem: "geo",
              data: this.buildRippleData(),
              symbol: "circle",
              symbolSize: [25, 4],
              symbolOffset: [0, -10],
              silent: true,
              tooltip: { show: false },
              itemStyle: {
                color: "rgba(0, 223, 235, 0.06)",
                borderColor: "rgba(0, 223, 235, 0.16)",
                borderWidth: 1.5,
                shadowBlur: 0,
              },
              zlevel: 0,
            },
            {
              name: "项目光晕",
              type: "scatter",
              coordinateSystem: "geo",
              data: this.buildGlowData(),
              symbol: "circle",
              symbolSize: [5, 2],
              symbolOffset: [0, -10],
              silent: true,
              tooltip: { show: false },
              itemStyle: {
                color: "rgba(0, 223, 235, 0.14)",
                borderColor: "rgba(0, 223, 235, 0.45)",
                borderWidth: 2,
                shadowBlur: 24,
                shadowColor: "rgba(0, 223, 235, 0.55)",
              },
              zlevel: 1,
            },
            {
              name: "项目数量",
              type: "scatter",
              coordinateSystem: "geo",
              data: this.buildBadgeData(),
              symbol: "pin",
              symbolSize: (val) => {
                const w = Math.max(34, String(val[2]).length * 7 + 22);
                return [w, 30];
              },
              symbolOffset: [0, -10],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "rgba(0, 220, 255, 1)" },
                  { offset: 1, color: "rgba(0, 120, 220, 1)" },
                ]),
                borderColor: "#e5fdff",
                borderWidth: 1.2,
                shadowBlur: 10,
                shadowColor: "rgba(0, 223, 235, 0.6)",
              },
              label: {
                show: true,
                color: "#ffffff",
                fontSize: 11,
                fontWeight: 700,
                textShadowColor: "rgba(0, 80, 120, 0.7)",
                textShadowBlur: 1.4,
                formatter: (params) => String(params.value[2]),
              },
              emphasis: {
                scale: 1.12,
                itemStyle: {
                  borderColor: "#ffffff",
                  shadowBlur: 18,
                  shadowColor: "rgba(0, 238, 255, 0.9)",
                },
              },
              zlevel: 2,
            },
          ],
        },
        true
      );
    },
  },
};
</script>