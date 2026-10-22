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
      />
    </div>
  </div>
</template>

<script>
import GoalVizSwitcher from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/GoalVizSwitcher.vue";
import { goalSummary, goalDataSets } from "../mockData";

export default {
  name: "GoalView",
  components: { GoalVizSwitcher },
  props: {
    theme: { type: String, default: "dark" },
    category: { type: String, default: "" },
  },
  data() {
    return {
      summary: goalSummary,
      active: "total",
    };
  },
  computed: {
    chartData() {
      return goalDataSets[this.active] || goalDataSets.total;
    },
  },
  methods: {
    select(key) {
      if (this.active === key) return;
      this.active = key;
    },
    formatNum(v) {
      return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
  },
};
</script>
