<template>
  <div
    class="sys-chart sys-chart--policy-rank"
    :class="chartClass"
    style="width:100%;height:100%"
  >
    <div ref="chartEl" class="sys-chart__el"></div>
  </div>
</template>

<script>
import chartMixin from "./chartMixin";
import { getTheme, buildTooltip } from "./theme";

/** 堆叠系列：激励型 / 约束型 / 混合型 */
const SERIES = [
  { key: "incentive", name: "激励型", color: "#35d6e8" },
  { key: "constraint", name: "约束型", color: "#38d07f" },
  { key: "mixed", name: "混合型", color: "#e0b04c" },
];

/**
 * 政策类型排行（横向堆叠柱状图，按省份排名）
 * props:
 *  - data: [{ name, incentive, constraint, mixed }]，内部按合计降序（最大在最上）
 *  - theme: "dark" | "light"
 */
export default {
  name: "PolicyTypeRankChart",
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
      // 升序传 y 轴（横向柱状图从下往上绘制，最大项落在最上方）
      const arr = [...(this.data || [])].sort((a, b) => {
        const ta = (a.incentive || 0) + (a.constraint || 0) + (a.mixed || 0);
        const tb = (b.incentive || 0) + (b.constraint || 0) + (b.mixed || 0);
        return ta - tb;
      });
      const names = arr.map((d) => d.name);

      return {
        tooltip: {
          ...buildTooltip(p),
          trigger: "axis",
          axisPointer: { type: "shadow" },
          formatter: (params) => {
            const name = params[0] ? params[0].name : "";
            const rows = params.map(
              (it) => `${it.marker}${it.seriesName}：${it.value}`
            );
            const total = params.reduce((sum, it) => sum + (it.value || 0), 0);
            return [name, ...rows, `合计：${total}`].join("<br/>");
          },
        },
        legend: {
          bottom: 0,
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 18,
          icon: "rect",
          textStyle: { color: p.text, fontSize: 12 },
          data: SERIES.map((s) => s.name),
        },
        grid: {
          left: 8,
          right: 28,
          top: 30,
          bottom: 34,
          containLabel: true,
        },
        xAxis: {
          type: "value",
          position: "top",
          splitLine: {
            show: true,
            lineStyle: { color: p.splitLine, type: "dashed" },
          },
          axisLabel: { color: p.textDim, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        yAxis: {
          type: "category",
          data: names,
          axisLabel: { color: p.text, fontSize: 12 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        series: SERIES.map((s) => ({
          name: s.name,
          type: "bar",
          stack: "total",
          barWidth: "58%",
          itemStyle: { color: s.color },
          emphasis: { focus: "series" },
          data: arr.map((d) => d[s.key] || 0),
        })),
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-chart--policy-rank {
  .sys-chart__el {
    width: 100%;
    height: 100%;
  }
}
</style>
