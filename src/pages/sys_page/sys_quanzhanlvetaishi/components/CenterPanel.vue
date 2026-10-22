<template>
  <section class="qzlt-center qzlt-panel">
    <header class="qzlt-center__head">
      <div class="qzlt-main-tabs">
        <button
          v-for="tab in mainTabs"
          :key="tab.key"
          type="button"
          class="qzlt-main-tab"
          :class="[tab.accent, { 'is-active': activeMain === tab.key }]"
          @click="activeMain = tab.key"
        >
          <img class="qzlt-main-tab__icon" :src="tab.icon" alt="" />
          <span class="qzlt-main-tab__label">{{ tab.label }}</span>
        </button>
      </div>
      <div class="qzlt-center__filters">
        <filter-select
          v-model="activeYear"
          class="qzlt-filter-select qzlt-filter-select--year"
          :options="yearOptions"
        />
        <filter-select
          :value="activePrimary"
          class="qzlt-filter-select qzlt-filter-select--primary"
          :options="primaryOptions"
          @input="onPrimaryInput"
        />
        <filter-select
          v-model="activeSecondary"
          class="qzlt-filter-select qzlt-filter-select--secondary"
          :options="secondaryOptions"
          :disabled="!secondaryOptions.length"
        />
      </div>
    </header>

    <div class="qzlt-stage">
      <portrait-view v-if="activeMain === 'portrait'" :theme="theme" :category="activeSecondary" />
      <goal-view v-else-if="activeMain === 'goal'" :theme="theme" :category="activeSecondary" />
      <heatmap-view v-else :theme="theme" :category="activeSecondary" />
    </div>
  </section>
</template>

<script>
import PortraitView from "./center/PortraitView.vue";
import GoalView from "./center/GoalView.vue";
import HeatmapView from "./center/HeatmapView.vue";
import FilterSelect from "./FilterSelect.vue";
import iconZhengce from "@/asset/images/qzlts/icon-zhengce.png";
import iconLianghua from "@/asset/images/qzlts/icon-lianghua.png";
import iconHeat from "@/asset/images/qzlts/icon-heat.png";
import { yearOptions, categoryTree } from "./mockData";

export default {
  name: "CenterPanel",
  components: { PortraitView, GoalView, HeatmapView, FilterSelect },
  data() {
    return {
      theme: "dark",
      activeMain: "portrait",
      activeYear: yearOptions[0].key,
      activePrimary: categoryTree[0].key,
      activeSecondary: categoryTree[0].children[0].key,
      yearOptions,
      mainTabs: [
        { key: "portrait", label: "政策画像", icon: iconZhengce, accent: "accent--cyan" },
        { key: "goal", label: "量化目标", icon: iconLianghua, accent: "accent--orange" },
        { key: "heatmap", label: "方向热力", icon: iconHeat, accent: "accent--cyan" },
      ],
    };
  },
  computed: {
    primaryOptions() {
      return categoryTree.map(({ key, label }) => ({ key, label }));
    },
    secondaryOptions() {
      const hit = categoryTree.find((c) => c.key === this.activePrimary);
      return hit ? hit.children : [];
    },
  },
  methods: {
    // 一级分类切换后，二级回落到该一级下的首项（无子项则清空）
    onPrimaryInput(key) {
      this.activePrimary = key;
      this.activeSecondary = this.secondaryOptions.length
        ? this.secondaryOptions[0].key
        : "";
    },
  },
};
</script>
