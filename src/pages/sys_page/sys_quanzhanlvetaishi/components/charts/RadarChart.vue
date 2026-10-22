<template>
  <div class="sys-chart sys-chart--radar" :class="chartClass" style="width:100%;height:100%">
    <div ref="chartEl" class="sys-chart__el"></div>
  </div>
</template>

<script>
import chartMixin from "./chartMixin";
import { getTheme, buildTooltip } from "./theme";

/**
 * 政策画像雷达（可复用原子图表）
 * props:
 *  - data: { indicators: [{ name, max }], series: [{ name, value: [], color? }] }
 *  - theme: "dark" | "light"
 */
export default {
  name: "RadarChart",
  mixins: [chartMixin],
  computed: {
    palette() {
      return getTheme(this.theme);
    },
    chartClass() {
      return this.theme === "light" ? "is-light" : "is-dark";
    },
  },
  methods: {
    buildOption(p) {
      const d = this.data || {};
      const indicators = (d.indicators || []).map((it) => ({
        name: it.name,
        max: it.max || 100,
      }));
      const series = (d.series || []).map((s, i) => ({
        name: s.name,
        value: s.value || [],
        itemStyle: { color: s.color || p.series[i % p.series.length] },
        lineStyle: { width: 2, color: s.color || p.series[i % p.series.length] },
        areaStyle: {
          color: s.color || p.series[i % p.series.length],
          opacity: 0.18,
        },
      }));
      return {
        color: p.series,
        tooltip: { ...buildTooltip(p), trigger: "item" },
        legend: {
          bottom: 6,
          icon: "circle",
          itemWidth: 9,
          itemHeight: 9,
          textStyle: { color: p.textDim, fontSize: 12 },
        },
        radar: {
          center: ["50%", "48%"],
          radius: "62%",
          indicator: indicators,
          /* 4.x 用 name.textStyle 控制维度文字样式 */
          name: {
            textStyle: { color: p.text, fontSize: 13 },
          },
          splitLine: { lineStyle: { color: p.splitLine } },
          splitArea: {
            show: true,
            areaStyle: {
              color: [p.splitLine, "rgba(0,0,0,0)"],
            },
          },
          axisLine: { lineStyle: { color: p.axisLine } },
        },
        series: [
          {
            name: "画像",
            type: "radar",
            data: series,
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-chart--radar {
  .sys-chart__el {
    width: 100%;
    height: 100%;
  }
}
</style>
