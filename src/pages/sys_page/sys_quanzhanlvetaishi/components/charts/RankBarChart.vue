<template>
  <div class="sys-chart sys-chart--rankbar" :class="chartClass" style="width:100%;height:100%">
    <div ref="chartEl" class="sys-chart__el"></div>
  </div>
</template>

<script>
import chartMixin from "./chartMixin";
import { getTheme, buildTooltip } from "./theme";

/**
 * 排名横向条（可复用原子图表）
 * props:
 *  - data: [{ name, value }]，内部按 value 降序
 *  - theme: "dark" | "light"
 */
export default {
  name: "RankBarChart",
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
      const arr = [...(this.data || [])].sort((a, b) => a.value - b.value);
      const names = arr.map((it) => it.name);
      const total = arr.length;
      // 前三：红 / 黄 / 绿；其余：青
      const rankColor = { 1: "#FF6D6D", 2: "#FFD074", 3: "#26FF92" };
      const normalColor = "#00E1FF";
      const seriesData = arr.map((it, i) => {
        const color = rankColor[total - i] || normalColor;
        return {
          value: it.value,
          itemStyle: { color },
          label: { color },
        };
      });
      return {
        tooltip: {
          ...buildTooltip(p),
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            const t = params[0];
            return `${t.name}<br/>${t.marker}${t.value}`;
          },
        },
        grid: {
          left: 4,
          right: 44,
          top: 10,
          bottom: 6,
          containLabel: true,
        },
        xAxis: {
          type: "value",
          position: "top",
          splitLine: { show: true, lineStyle: { color: p.splitLine } },
          axisLabel: { color: p.textDim, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        yAxis: {
          type: "category",
          data: names,
          axisLabel: { color: p.text, fontSize: 12 },
          axisLine: { lineStyle: { color: p.axisLine } },
          axisTick: { show: false },
        },
        series: [
          {
            name: "数值",
            type: "bar",
            data: seriesData,
            barWidth: "52%",
            itemStyle: { borderRadius: [0, 4, 4, 0] },
            label: {
              show: true,
              position: "right",
              fontSize: 12,
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-chart--rankbar {
  .sys-chart__el {
    width: 100%;
    height: 100%;
  }
}
</style>
