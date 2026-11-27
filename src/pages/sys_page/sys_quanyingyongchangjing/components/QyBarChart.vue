<!--
 * 全应用场景 —— 柱状图（ECharts 4.9）
 * 通过 package.json 的 npm 别名 echarts4 引入 4.9 版本，与项目主体 5.x 并存互不影响
 * 视觉：柱体主体半透明蓝、柱顶 2px 实色、横竖双向虚线网格、柱顶数值标签
-->
<template>
  <div ref="chartEl" class="qy-bar-chart"></div>
</template>

<script>
// eslint-disable-next-line
const echarts = require("echarts4");

const BAR_COLOR = "#3086f3";
const BAR_BODY_COLOR = "rgba(48, 134, 243, 0.6)";
const SPLIT_COLOR = "rgba(94, 149, 175, 0.4)";
const AXIS_COLOR = "rgba(94, 149, 175, 0.5)";

export default {
  name: "QyBarChart",
  props: {
    labels: { type: Array, default: () => [] },
    values: { type: Array, default: () => [] },
    ticks: { type: Array, default: () => [] },
  },
  data() {
    return {
      chart: null,
      observer: null,
    };
  },
  watch: {
    labels() {
      this.renderChart();
    },
    values() {
      this.renderChart();
    },
    ticks() {
      this.renderChart();
    },
  },
  mounted() {
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
        this.observer = new ResizeObserver(() => {
          if (this.chart) this.chart.resize();
        });
        this.observer.observe(el);
      } else {
        window.addEventListener("resize", this.handleWindowResize);
      }
      this.renderChart();
    },
    handleWindowResize() {
      if (this.chart) this.chart.resize();
    },
    teardownChart() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
      window.removeEventListener("resize", this.handleWindowResize);
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
    renderChart() {
      if (!this.chart) return;

      const barWidth = 34;
      const maxValue = this.ticks.length ? this.ticks[0] : undefined;
      const interval =
        this.ticks.length > 1 ? maxValue / (this.ticks.length - 1) : undefined;

      this.chart.setOption(
        {
          animationDuration: 500,
          grid: {
            left: 6,
            right: 10,
            top: 18,
            bottom: 4,
            containLabel: true,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: { type: "shadow" },
            backgroundColor: "rgba(4, 26, 42, 0.9)",
            borderColor: "rgba(48, 134, 243, 0.6)",
            textStyle: { color: "#d8f4ff", fontSize: 12 },
          },
          xAxis: {
            type: "category",
            data: this.labels,
            axisTick: { show: false },
            axisLine: { lineStyle: { color: AXIS_COLOR } },
            axisLabel: { color: "#9fc0d2", fontSize: 11 },
            splitLine: {
              show: true,
              lineStyle: { type: "dashed", color: SPLIT_COLOR },
            },
          },
          yAxis: {
            type: "value",
            min: 0,
            max: maxValue,
            interval,
            axisTick: { show: false },
            axisLine: { show: true, lineStyle: { color: AXIS_COLOR } },
            axisLabel: { color: "#8fb0c1", fontSize: 11 },
            splitLine: {
              show: true,
              lineStyle: { type: "dashed", color: SPLIT_COLOR },
            },
          },
          series: [
            {
              name: "数值",
              type: "bar",
              barWidth,
              data: this.values,
              itemStyle: { color: BAR_BODY_COLOR },
              label: {
                show: true,
                position: "top",
                distance: 4,
                color: "#d8f4ff",
                fontSize: 11,
              },
            },
            {
              // 柱顶 2px 实色（pictorialBar 的 symbolSize 支持像素，保证不随柱高变化）
              name: "柱顶",
              type: "pictorialBar",
              symbol: "rect",
              symbolSize: [barWidth, 2],
              symbolPosition: "end",
              z: 5,
              silent: true,
              tooltip: { show: false },
              data: this.values,
              itemStyle: { color: BAR_COLOR },
            },
          ],
        },
        true
      );
    },
  },
};
</script>
