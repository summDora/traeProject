<template>
  <div class="center-view goal-view">
    <!-- 左侧固定三块统计：点击切换右侧图表数据源 -->
    <div class="goal-view__stats">
      <div
        v-for="item in summary"
        :key="item.key"
        class="goal-stat"
        :class="{ 'is-active': active === item.key }"
        @click="select(item.key)"
      >
        <img class="goal-stat__icon" :src="item.icon" alt="" />
        <div class="goal-stat__label">{{ item.label }}</div>
        <div class="goal-stat__value">
          <span class="goal-stat__num">{{ formatNum(item.value) }}</span>
          <span class="goal-stat__unit">{{ item.unit }}</span>
        </div>
      </div>
    </div>

    <!-- 右侧：量化目标三态切换（由可复用组件 GoalVizSwitcher 承载） -->
    <div class="goal-view__main">
      <goal-viz-switcher
        title=""
        :theme="theme"
        :map-data="chartData.map"
        :rank-data="chartData.rank"
        :release-data="chartData.release"
        :tertiary="tertiary"
        :tertiary-options="tertiaryOptions"
        @tertiary-change="onTertiary"
      />
    </div>
  </div>
</template>

<script>
import GoalVizSwitcher from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/GoalVizSwitcher.vue";
import { fetchGoalViz } from "@/api/quanzhanlvetaishi";
import { goalSummary, goalDataSets } from "../mockData";

export default {
  name: "GoalView",
  components: { GoalVizSwitcher },
  props: {
    theme: { type: String, default: "dark" },
    category: { type: String, default: "" },
    primary: { type: String, default: "" },
    secondary: { type: String, default: "" },
    tertiary: { type: String, default: "" },
    tertiaryOptions: { type: Array, default: () => [] },
  },
  data() {
    return {
      summary: goalSummary,
      active: "total",
      loadedData: null,
    };
  },
  computed: {
    chartData() {
      return this.loadedData || goalDataSets[this.active] || goalDataSets.total;
    },
  },
  watch: {
    primary: "loadData",
    secondary: "loadData",
    tertiary: "loadData",
    active: "loadData",
  },
  mounted() {
    this.loadData();
  },
  methods: {
    /** 量化目标图表数据统一走接口入口（接口层失败会回落 mock） */
    async loadData() {
      const res = await fetchGoalViz({
        primary: this.primary,
        secondary: this.secondary,
        tertiary: this.tertiary,
        type: this.active,
      });
      if (res && Array.isArray(res.map)) this.loadedData = res;
    },
    select(key) {
      if (this.active === key) return;
      this.active = key;
    },
    onTertiary(key) {
      this.$emit("update:tertiary", key);
    },
    formatNum(v) {
      return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
