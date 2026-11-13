<template>
  <section class="jy-panel jy-center">
    <div class="jy-center-body">
      <!-- 顶部四张指标卡 -->
      <div class="jy-metrics">
        <div v-for="m in metrics" :key="m.key" class="jy-metric">
          <div class="jy-metric__head">
            <img class="jy-metric__icon" :src="m.icon" alt="" />
            <span class="jy-metric__label">{{ m.label }}</span>
          </div>
          <div class="jy-metric__value">
            <span class="jy-metric__num">{{ m.value }}</span>
            <span class="jy-metric__unit">{{ m.unit }}</span>
          </div>
          <img class="jy-metric__divider" :src="dividerLine" alt="" />
          <div class="jy-metric__sub" :style="{ color: m.color }">
            {{ m.sub }}
          </div>
        </div>
      </div>

      <!-- 核价传导导图 -->
      <div class="jy-section jy-section--nodes">
        <div class="jy-section__head">
          <span class="jy-section__text">核价传导导图</span>
        </div>
        <div class="jy-nodes">
          <template v-for="item in nodeFlow">
            <div
              v-if="item.type === 'node'"
              :key="item.uid"
              class="jy-node"
              :style="{ backgroundImage: `url(${item.bg})` }"
            >
              <img class="jy-node__icon" :src="item.icon" alt="" />
              <div class="jy-node__label">{{ item.label }}</div>
              <div class="jy-node__sub">{{ item.sub }}</div>
            </div>
            <div v-else :key="item.uid" class="jy-node__arrow">
              <img :src="ARROW_FLOW" alt="" />
            </div>
          </template>
        </div>
      </div>

      <!-- 经营结果趋势 -->
      <div class="jy-section jy-section--grow jy-section--trends">
        <div class="jy-section__head">
          <span class="jy-section__text">经营结果趋势</span>
        </div>
        <div class="jy-trends">
          <div class="jy-trend__card">
            <div class="jy-trend__title">固定资产投资：规划值与临界值</div>
            <div class="jy-trend__chart" ref="investChart"></div>
          </div>
          <div class="jy-trend__sep"></div>
          <div class="jy-trend__card">
            <div class="jy-trend__title">带息负债与资产负债率</div>
            <div class="jy-trend__chart" ref="debtChart"></div>
          </div>
        </div>
      </div>

      <!-- 方案对比 -->
      <div class="jy-section jy-section--compare">
        <div class="jy-section__head">
          <span class="jy-section__text">方案对比</span>
          <span class="jy-section__extra"></span>
          <button type="button" class="jy-btn jy-btn--set">
            <img class="jy-btn--set__icon" :src="iconFlag" alt="" />
            设为当前方案
          </button>
        </div>
        <div class="jy-table-wrap">
          <table class="jy-table">
            <thead>
              <tr>
                <th v-for="c in COMPARE_COLS" :key="c.key">{{ c.label }}</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(r, ri) in COMPARE_ROWS"
                :key="ri"
                :class="{ 'jy-table__row--plan': ri === 0 }"
              >
                <td v-for="c in COMPARE_COLS" :key="c.key">{{ r[c.key] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import * as echarts from "echarts";
import {
  METRICS,
  COMPARE_COLS,
  COMPARE_ROWS,
  CORE_NODES,
  ARROW_FLOW,
  INVEST_YEARS,
  INVEST_PLAN,
  INVEST_LIMIT,
  DEBT_YEARS,
  DEBT_SERIES,
  RATIO_SERIES,
} from "./mockData";
import dividerLine from "@/asset/images/jyzbyc/divider-line.png";
import iconFlag from "@/asset/images/jyzbyc/icon-file.png";

export default {
  name: "JyCenterPanel",
  data() {
    return {
      metrics: METRICS,
      dividerLine,
      iconFlag,
      CORE_NODES,
      ARROW_FLOW,
      COMPARE_COLS,
      COMPARE_ROWS,
      INVEST_YEARS,
      INVEST_PLAN,
      INVEST_LIMIT,
      DEBT_YEARS,
      DEBT_SERIES,
      RATIO_SERIES,
      investChart: null,
      debtChart: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initInvestChart();
      this.initDebtChart();
      this.observeCharts();
    });
    window.addEventListener("resize", this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    if (this._ros) {
      this._ros.forEach((ro) => ro.disconnect());
      this._ros = null;
    }
    this.disposeChart("investChart");
    this.disposeChart("debtChart");
  },
  computed: {
    nodeFlow() {
      const flow = [];
      this.CORE_NODES.forEach((n, i) => {
        flow.push({ type: "node", uid: `node-${n.key}`, ...n });
        if (i < this.CORE_NODES.length - 1) {
          flow.push({ type: "arrow", uid: `arrow-${i}` });
        }
      });
      return flow;
    },
  },
  methods: {
    observeCharts() {
      if (typeof ResizeObserver === "undefined") return;
      this._ros = [this.investChart, this.debtChart]
        .filter(Boolean)
        .map((chart) => {
          const ro = new ResizeObserver(() => {
            if (!chart.isDisposed()) chart.resize();
          });
          ro.observe(chart.getDom());
          return ro;
        });
    },
    onResize() {
      if (this.investChart && !this.investChart.isDisposed()) {
        this.investChart.resize();
      }
      if (this.debtChart && !this.debtChart.isDisposed()) {
        this.debtChart.resize();
      }
    },
    disposeChart(key) {
      const chart = this[key];
      if (chart && !chart.isDisposed()) {
        chart.dispose();
        this[key] = null;
      }
    },
    initInvestChart() {
      const el = this.$refs.investChart;
      if (!el) return;
      const chart = (this.investChart = echarts.init(el));
      chart.setOption({
        backgroundColor: "transparent",
        grid: { left: 34, right: 14, top: 36, bottom: 20 },
        tooltip: { trigger: "axis", axisPointer: { type: "shadow" } },
        legend: {
          top: 8,
          right: 20,
          itemWidth: 8,
          itemHeight: 8,
          itemGap: 18,
          icon: "rect",
          textStyle: { color: "#8fc3d9", fontSize: 12 },
        },
        xAxis: {
          type: "category",
          data: INVEST_YEARS,
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#8fc3d9", fontSize: 12 },
          splitLine: {
            show: true,
            lineStyle: { color: "#38506A", type: [5, 5], width: 1 },
          },
        },
        yAxis: {
          type: "value",
          min: 0,
          max: 100,
          interval: 50,
          splitLine: {
            show: true,
            lineStyle: { color: "#38506A", type: [5, 5], width: 1 },
          },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: "#8fc3d9", fontSize: 12 },
        },
        series: [
          {
            name: "规划值",
            type: "bar",
            barWidth: 16,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#00A1FF" },
                { offset: 1, color: "#023BA5" },
              ]),
              borderRadius: [6, 6, 6, 6],
            },
            data: INVEST_PLAN,
          },
          {
            name: "临界值",
            type: "bar",
            barWidth: 16,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#00FFFF" },
                { offset: 1, color: "#006C6C" },
              ]),
              borderRadius: [6, 6, 6, 6],
            },
            data: INVEST_LIMIT,
          },
        ],
      });
    },
    initDebtChart() {
      const el = this.$refs.debtChart;
      if (!el) return;
      const chart = (this.debtChart = echarts.init(el));
      chart.setOption({
        backgroundColor: "transparent",
        grid: { left: 52, right: 52, top: 36, bottom: 20 },
        tooltip: { trigger: "axis" },
        legend: {
          top: 8,
          right: 14,
          itemWidth: 14,
          itemHeight: 10,
          itemGap: 20,
          textStyle: { color: "#8fc3d9", fontSize: 12 },
        },
        xAxis: {
          type: "category",
          data: DEBT_YEARS,
          axisLine: { lineStyle: { color: "#38506A" } },
          axisTick: { show: false },
          splitLine: {
            show: true,
            lineStyle: { color: "#38506A", type: [5, 5], width: 1 },
          },
          axisLabel: { color: "#8fc3d9", fontSize: 12 },
        },
        yAxis: [
          {
            type: "value",
            min: 0,
            max: 50,
            interval: 25,
            position: "left",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: "#f14e51", fontSize: 12 },

            splitLine: {
              show: true,
              lineStyle: { color: "#38506A", type: [5, 5], width: 1 },
            },
          },
          {
            type: "value",
            min: 0,
            max: 100,
            interval: 50,
            position: "right",
            axisLine: { show: false },
            axisTick: { show: false },
            axisLabel: { color: "#00ffff", fontSize: 12 },

            splitLine: {
              show: true,
              lineStyle: { color: "#38506A", type: [5, 5], width: 1 },
            },
          },
        ],
        series: [
          {
            name: "带息负债",
            type: "line",
            yAxisIndex: 0,
            smooth: true,
            showSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: { color: "#f14e51", width: 2 },
            itemStyle: { color: "#f14e51", borderColor: "#f14e51" },
            data: DEBT_SERIES,
          },
          {
            name: "资产负债率",
            type: "line",
            yAxisIndex: 1,
            smooth: true,
            showSymbol: true,
            symbol: "emptyCircle",
            symbolSize: 6,
            lineStyle: { color: "#00ffff", width: 2 },
            itemStyle: { color: "#00ffff", borderColor: "#00ffff" },
            data: RATIO_SERIES,
          },
        ],
      });
    },
  },
};
</script>
