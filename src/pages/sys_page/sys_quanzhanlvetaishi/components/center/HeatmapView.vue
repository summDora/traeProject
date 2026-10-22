<template>
  <div class="center-view heatmap-view">
    <div class="center-view__caption">
      <div class="heatmap-switch">
        <button
          v-for="m in modes"
          :key="m.key"
          type="button"
          class="heatmap-switch__btn"
          :class="{ 'is-active': mode === m.key }"
          @click="mode = m.key"
        >
          {{ m.label }}
        </button>
      </div>
    </div>
    <div class="center-view__chart">
      <direction-heatmap
        v-if="mode === 'heatmap'"
        :data="heatmap"
        :theme="theme"
      />
      <radar-chart
        v-else-if="mode === 'radar'"
        :data="radarData"
        :theme="theme"
      />
      <bubble-cluster-chart
        v-else
        :data="bubbleData"
        :theme="theme"
        :value="bubbleActive"
        :card-map="bubbleCards"
        @input="onBubbleInput"
      />
    </div>
  </div>
</template>

<script>
import DirectionHeatmap from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/DirectionHeatmap.vue";
import RadarChart from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/RadarChart.vue";
import BubbleClusterChart from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/BubbleClusterChart.vue";
import { fetchDirectionHeatmap, fetchBubbleChart, fetchBubbleCards } from "@/api/quanzhanlvetaishi";
import { directionHeatmapData, portraitBubbles, portraitCardMap } from "../mockData";

const RADAR_COL_COUNT = 8; // 雷达图取强度合计最高的 8 个省份作为维度
const RADAR_ROW_COUNT = 3; // 取强度合计最高的 3 个方向作为系列

export default {
  name: "HeatmapView",
  components: { DirectionHeatmap, RadarChart, BubbleClusterChart },
  props: {
    theme: { type: String, default: "dark" },
    category: { type: String, default: "" },
    primary: { type: String, default: "" },
    secondary: { type: String, default: "" },
    tertiary: { type: String, default: "" },
  },
  data() {
    return {
      heatmap: directionHeatmapData,
      bubbleData: portraitBubbles,
      // 复制一份，避免 $set 直接改到 mock 的共享对象
      bubbleCards: { ...portraitCardMap },
      bubbleActive: portraitBubbles.length ? portraitBubbles[0].key : "",
      mode: "heatmap",
      modes: [
        { key: "heatmap", label: "方向热力" },
        { key: "radar", label: "雷达图" },
        { key: "bubble", label: "气泡图" },
      ],
    };
  },
  computed: {
    /** 由热力矩阵派生雷达：省份为维度，方向为系列 */
    radarData() {
      const { rows = [], cols = [], values = [] } = this.heatmap || {};
      const colTotals = cols.map((_, ci) =>
        values.reduce((sum, row) => sum + (row[ci] || 0), 0)
      );
      const rowTotals = rows.map((_, ri) =>
        (values[ri] || []).reduce((sum, v) => sum + (v || 0), 0)
      );
      const topCols = colTotals
        .map((total, ci) => ({ ci, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, RADAR_COL_COUNT);
      const topRows = rowTotals
        .map((total, ri) => ({ ri, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, RADAR_ROW_COUNT);
      return {
        indicators: topCols.map(({ ci }) => ({ name: cols[ci], max: 100 })),
        series: topRows.map(({ ri }) => ({
          name: rows[ri],
          value: topCols.map(({ ci }) => (values[ri] || [])[ci] || 0),
        })),
      };
    },
  },
  watch: {
    primary: "loadCharts",
    secondary: "loadCharts",
    tertiary: "loadCharts",
  },
  mounted() {
    this.loadCharts();
  },
  methods: {
    /** 热力矩阵 / 气泡数据统一从接口入口获取（接口层失败会回落 mock） */
    async loadCharts() {
      const params = {
        primary: this.primary,
        secondary: this.secondary,
        tertiary: this.tertiary,
      };
      const [heat, bubble] = await Promise.all([
        fetchDirectionHeatmap(params),
        fetchBubbleChart(params),
      ]);
      if (heat && Array.isArray(heat.rows)) this.heatmap = heat;
      if (bubble && Array.isArray(bubble.bubbles) && bubble.bubbles.length) {
        this.bubbleData = bubble.bubbles;
        this.bubbleActive = bubble.bubbles[0].key;
      }
      if (bubble && bubble.cards && typeof bubble.cards === "object") {
        this.bubbleCards = { ...bubble.cards };
      }
    },
    /**
     * 切换气泡时按气泡 key 单独拉取右侧卡片
     * 接口未就绪时由接口层回落本地 mock，页面不会空白
     */
    async loadBubbleCards(key) {
      if (!key) return;
      const res = await fetchBubbleCards(key, {
        primary: this.primary,
        secondary: this.secondary,
        tertiary: this.tertiary,
      });
      if (res && Array.isArray(res.cards) && res.cards.length) {
        this.$set(this.bubbleCards, key, res.cards);
      }
    },
    onBubbleInput(key) {
      this.bubbleActive = key;
      this.loadBubbleCards(key);
    },
  },
};
</script>
