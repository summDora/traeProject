<template>
  <div class="energy-page">
    <section class="chart-card">
      <div ref="chart" class="chart"></div>
    </section>
  </div>
</template>

<script>
import echarts from "echarts4";

const years = Array.from({ length: 34 }, (_, index) => String(1990 + index));
const production = [
  320, 330, 360, 390, 410, 460, 370, 390, 490, 450, 440, 520, 810, 970, 1130,
  1290, 1430, 1410, 1440, 1290, 1460, 1460, 1900, 1620, 1620, 2100, 2430, 2390,
  2430, 2910, 3070, 3880, 4480, 4599.79,
];
const purchase = [
  2510, 2840, 3170, 3720, 4120, 4390, 4810, 5090, 5170, 5590, 6180, 6810, 7550,
  8570, 9760, 10790, 11820, 13150, 13690, 14240, 15420, 16390, 16180, 17140,
  17250, 17540, 17890, 18630, 19080, 19510, 21510, 23130, 25020, 37758.2,
];
const selfRate = [
  11.31, 10.3, 10.15, 9.48, 8.95, 9.44, 7.19, 7.17, 8.61, 7.48, 6.65, 7.06,
  8.97, 9.86, 10.05, 10.5, 9.17, 8.04, 8.02, 7.95, 8.69, 7.6, 9.41, 8.2, 8.31,
  10.8, 11.45, 10.14, 11.04, 12.96, 12.47, 13.02, 12.57, 8.86,
];

export default {
  name: "PageExcel",
  data() {
    return { chartInstance: null };
  },
  mounted() {
    this.initChart();
    window.addEventListener("resize", this.resizeChart);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeChart);
    if (this.chartInstance) this.chartInstance.dispose();
  },
  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart);
      this.chartInstance.setOption({
        backgroundColor: "transparent",
        color: ["#35c8c1", "#4b83e5", "#f3c451"],
        title: {
          text: "浙江省能源供应（1990—2023年）",
          left: "center",
          top: 8,
          textStyle: { color: "#eaf7ff", fontSize: 24, fontWeight: "normal" },
        },
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(4, 22, 44, .96)",
          borderColor: "#2e7597",
          textStyle: { color: "#eaf7ff" },
          axisPointer: { type: "cross", crossStyle: { color: "#70bdd4" } },
          formatter(params) {
            const rows = params.map((item) => {
              const unit =
                item.seriesName === "一次能源自产率" ? "%" : "万吨标准煤";
              return `${item.marker}${item.seriesName}：${Number(
                item.value,
              ).toLocaleString()} ${unit}`;
            });
            return `${params[0].axisValue}年<br/>${rows.join("<br/>")}`;
          },
        },
        legend: {
          top: 48,
          left: "center",
          itemWidth: 22,
          itemHeight: 10,
          textStyle: { color: "#b9d9e6", fontSize: 13 },
          data: ["一次能源生产总量", "省外购入及进口净值", "一次能源自产率"],
        },
        grid: { left: 72, right: 72, top: 92, bottom: 58, containLabel: true },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: years,
          axisLine: { lineStyle: { color: "#39728b" } },
          axisTick: { show: false },
          axisLabel: { color: "#91b9c9", interval: 1, fontSize: 12 },
        },
        yAxis: [
          {
            type: "value",
            name: "万吨标准煤",
            min: 0,
            max: 50000,
            interval: 10000,
            nameTextStyle: { color: "#8db7c7", padding: [0, 0, 8, 0] },
            axisLabel: {
              color: "#8db7c7",
              formatter: (value) => value.toLocaleString(),
            },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: {
              lineStyle: { color: "rgba(102, 170, 192, .18)", type: "dashed" },
            },
          },
          {
            type: "value",
            name: "%",
            min: 0,
            max: 15,
            interval: 3,
            nameTextStyle: { color: "#f3c451", padding: [0, 0, 8, 0] },
            axisLabel: { color: "#d6b85c" },
            axisLine: { lineStyle: { color: "#39728b" } },
            axisTick: { show: false },
            splitLine: { show: false },
          },
        ],
        series: [
          {
            name: "一次能源生产总量",
            type: "line",
            stack: "energy",
            smooth: true,
            symbol: "none",
            lineStyle: { width: 1, color: "#35c8c1" },
            areaStyle: { color: "#35c8c1", opacity: 0.82 },
            data: production,
          },
          {
            name: "省外购入及进口净值",
            type: "line",
            stack: "energy",
            smooth: true,
            symbol: "none",
            lineStyle: { width: 1, color: "#4b83e5" },
            areaStyle: { color: "#4b83e5", opacity: 0.88 },
            data: purchase,
          },
          {
            name: "一次能源自产率",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              width: 3,
              color: "#f3c451",
              shadowColor: "rgba(243, 196, 81, .5)",
              shadowBlur: 8,
            },
            itemStyle: {
              color: "#f3c451",
              borderColor: "#fff3b6",
              borderWidth: 1,
            },
            data: selfRate,
          },
        ],
      });
    },
    resizeChart() {
      if (this.chartInstance) this.chartInstance.resize();
    },
  },
};
</script>

<style scoped>
.energy-page {
  box-sizing: border-box;
  padding: 20px;
  min-height: calc(100vh - 56px);
  background: #06182d;
  color: #eaf7ff;
}
.chart-card {
  max-width: 1440px;
  height: calc(100vh - 96px);
  min-height: 440px;
  margin: 0 auto;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid rgba(86, 177, 203, 0.35);
  background: radial-gradient(circle at 50% -15%, #123d5b 0, #06182d 45%, #020b19 100%);
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.24),
    inset 0 0 40px rgba(22, 104, 139, 0.08);
}
.chart {
  width: 100%;
  height: 100%;
}
@media (max-width: 700px) {
  .energy-page {
    padding: 10px;
  }
  .chart-card {
    height: calc(100vh - 76px);
    min-height: 380px;
    padding: 4px;
  }
}
</style>
