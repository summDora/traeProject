<template>
  <div class="sys-chart sys-chart--map" :class="chartClass" style="width:100%;height:100%">
    <div ref="chartEl" class="sys-chart__el"></div>
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

/**
 * 目标地图（可复用原子图表）—— 中国地图着色 + 数值散点
 * props:
 *  - data: [{ name, value }]，name 需与 china.json 行政区名一致（如「广东」「北京」）
 *  - theme: "dark" | "light"
 */
export default {
  name: "ChinaMapChart",
  mixins: [chartMixin],
  computed: {
    palette() {
      return getTheme(this.theme);
    },
    chartClass() {
      return this.theme === "light" ? "is-light" : "is-dark";
    },
  },
  mounted() {
    registerChinaMap();
    // mixin 已在 mounted 里 init；这里补充注册后由 mixin initChart 完成
  },
  methods: {
    buildOption(p) {
      const arr = this.data || [];
      const max = Math.max(1, ...arr.map((d) => d.value || 0));
      return {
        tooltip: {
          ...buildTooltip(p),
          trigger: "item",
          formatter: (params) =>
            params.value || params.value === 0
              ? `${params.name}<br/>${params.marker}${params.value}`
              : params.name,
        },
        visualMap: {
          show: false,
          min: 0,
          max,
          inRange: {
            color: [p.vmColor[0], p.vmColor[1]],
          },
          textStyle: { color: p.vmText },
        },
        series: [
          {
            name: "目标",
            type: "map",
            map: "china",
            roam: false,
            scaleLimit: { min: 0.8, max: 2 },
            label: { show: false },
            itemStyle: {
              areaColor: p.mapArea,
              borderColor: p.mapBorder,
              borderWidth: 0.8,
            },
            emphasis: {
              label: { show: true, color: p.textStrong, fontSize: 13 },
              itemStyle: {
                areaColor: p.accent,
              },
            },
            data: arr,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-chart--map {
  .sys-chart__el {
    width: 100%;
    height: 100%;
  }
}
</style>
