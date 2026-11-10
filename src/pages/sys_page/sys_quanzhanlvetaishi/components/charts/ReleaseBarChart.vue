<template>
  <div class="sys-chart sys-chart--releasebar" :class="chartClass" style="width:100%;height:100%">
    <div ref="chartEl" class="sys-chart__el"></div>
  </div>
</template>

<script>
import chartMixin from "./chartMixin";
import { getTheme, buildTooltip } from "./theme";

/**
 * 发布情况柱状（可复用原子图表）
 * props:
 *  - data: [{ name, value }]
 *  - theme: "dark" | "light"
 */
export default {
  name: "ReleaseBarChart",
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
      const arr = this.data || [];
      const names = arr.map((it) => it.name);
      const values = arr.map((it) => it.value);
      return {
        tooltip: {
          ...buildTooltip(p),
          trigger: "axis",
          axisPointer: { type: "shadow" },
        },
        grid: {
          left: 8,
          right: 16,
          top: 24,
          bottom: 8,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: names,
          axisLabel: {
            color: p.text,
            fontSize: 12,
            interval: 0,
            rotate: names.length > 8 ? 30 : 0,
          },
          axisLine: { lineStyle: { color: p.axisLine } },
          axisTick: { show: false },
        },
        yAxis: {
          type: "value",
          splitLine: { lineStyle: { color: p.splitLine } },
          axisLabel: { color: p.textDim, fontSize: 11 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        series: [
          {
            name: "发布量",
            type: "bar",
            data: values,
            barWidth: "46%",
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: {
                type: "linear",
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: p.accent },
                  { offset: 1, color: p.barGradEnd },
                ],
              },
            },
            label: {
              show: true,
              position: "top",
              color: p.text,
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
.sys-chart--releasebar {
  .sys-chart__el {
    width: 100%;
    height: 100%;
  }
}
</style>
