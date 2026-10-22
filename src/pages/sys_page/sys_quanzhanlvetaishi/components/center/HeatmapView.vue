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
      <span class="center-view__caption-sub">{{ subtitle }}</span>
    </div>
    <div class="center-view__chart">
      <direction-heatmap
        v-if="mode === 'heatmap'"
        :data="heatmap"
        :theme="theme"
      />
      <radar-chart
        v-if="mode === 'radar'"
        :data="radarData"
        :theme="theme"
      />
    </div>
  </div>
</template>

<script>
import DirectionHeatmap from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/DirectionHeatmap.vue";
import RadarChart from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/RadarChart.vue";
import { directionHeatmapData } from "../mockData";

const RADAR_COL_COUNT = 8; // 雷达图取强度合计最高的 8 个省份作为维度
const RADAR_ROW_COUNT = 3; // 取强度合计最高的 3 个方向作为系列

export default {
  name: "HeatmapView",
  components: { DirectionHeatmap, RadarChart },
  props: {
    theme: { type: String, default: "dark" },
    category: { type: String, default: "" },
  },
  data() {
    return {
      heatmap: directionHeatmapData,
      mode: "heatmap",
      modes: [
        { key: "heatmap", label: "方向热力" },
        { key: "radar", label: "雷达图" },
      ],
    };
  },
  computed: {
    subtitle() {
      return this.mode === "heatmap"
        ? "颜色越亮强度越高"
        : "离中心越远强度越高";
    },
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
};
</script>
