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
          <img
            class="qzlt-main-tab__icon"
            :src="activeMain === tab.key ? tab.activeIcon : tab.icon"
            alt=""
          />
          <span class="qzlt-main-tab__label">{{ tab.label }}</span>
        </button>
      </div>
      <div class="qzlt-center__filters">
        <filter-select
          :value="activePrimary"
          class="qzlt-filter-select qzlt-filter-select--primary"
          :options="primaryOptions"
          @input="onPrimaryInput"
        />
        <filter-select
          :value="activeSecondary"
          class="qzlt-filter-select qzlt-filter-select--secondary"
          :options="secondaryOptions"
          :disabled="!secondaryOptions.length"
          @input="onSecondaryInput"
        />
      </div>
    </header>

    <div class="qzlt-stage">
      <portrait-view
        v-if="activeMain === 'portrait'"
        :theme="theme"
        :primary="activePrimary"
        :secondary="activeSecondary"
        :tertiary="activeTertiary"
        :tertiary-options="tertiaryOptions"
        @update:tertiary="activeTertiary = $event"
      />
      <goal-view
        v-else-if="activeMain === 'goal'"
        :theme="theme"
        :primary="activePrimary"
        :secondary="activeSecondary"
        :tertiary="activeTertiary"
        :tertiary-options="tertiaryOptions"
        @update:tertiary="activeTertiary = $event"
      />
      <heatmap-view
        v-else
        :theme="theme"
        :primary="activePrimary"
        :secondary="activeSecondary"
        :tertiary="activeTertiary"
      />
    </div>
  </section>
</template>

<script>
import PortraitView from "./center/PortraitView.vue";
import GoalView from "./center/GoalView.vue";
import HeatmapView from "./center/HeatmapView.vue";
import FilterSelect from "./FilterSelect.vue";
import iconZhengce from "@/asset/images/qzlts/icon-zhengce.png";
import iconZhengceActive from "@/asset/images/qzlts/icon-zhengce-active.png";
import iconLianghua from "@/asset/images/qzlts/icon-lianghua.png";
import iconLianghuaActive from "@/asset/images/qzlts/icon-lianghua-active.png";
import iconHeat from "@/asset/images/qzlts/icon-heat.png";
import iconHeatActive from "@/asset/images/qzlts/icon-fire-active.png";
import { categoryTree, allCategoryOption } from "./mockData";
import { fetchTertiaryOptions } from "@/api/quanzhanlvetaishi";

export default {
  name: "CenterPanel",
  components: { PortraitView, GoalView, HeatmapView, FilterSelect },
  data() {
    return {
      theme: "dark",
      activeMain: "goal",
      // 一级 / 二级分类默认选中「全部」
      activePrimary: allCategoryOption.key,
      activeSecondary: allCategoryOption.key,
      // 三级分类默认选中下拉列表第一项
      activeTertiary: "",
      tertiaryOptions: [],
      mainTabs: [
        {
          key: "goal",
          label: "量化目标",
          icon: iconLianghua,
          activeIcon: iconLianghuaActive,
          accent: "accent--orange",
        },
        {
          key: "heatmap",
          label: "方向热力",
          icon: iconHeat,
          activeIcon: iconHeatActive,
          accent: "accent--cyan",
        },
        {
          key: "portrait",
          label: "政策画像",
          icon: iconZhengce,
          activeIcon: iconZhengceActive,
          accent: "accent--cyan",
        },
      ],
    };
  },
  computed: {
    /** 一级分类：全部 + 业务分类 */
    primaryOptions() {
      return [allCategoryOption, ...categoryTree.map(({ key, label }) => ({ key, label }))];
    },
    /** 二级分类：一级为「全部」时展示全部二级，否则展示该一级下的二级 */
    secondaryOptions() {
      if (this.activePrimary === allCategoryOption.key) {
        const all = [];
        categoryTree.forEach((item) => {
          item.children.forEach((child) => {
            all.push({ key: child.key, label: child.label, parent: item.key });
          });
        });
        return [allCategoryOption, ...all];
      }
      const hit = categoryTree.find((c) => c.key === this.activePrimary);
      return hit ? [allCategoryOption, ...hit.children] : [allCategoryOption];
    },
  },
  watch: {
    activePrimary: {
      handler() {
        this.resetSecondary();
        this.loadTertiary();
      },
    },
    activeSecondary: {
      handler() {
        this.loadTertiary();
      },
    },
  },
  mounted() {
    this.loadTertiary();
  },
  methods: {
    /** 一级分类切换后，二级回落到「全部」（无子项则清空） */
    onPrimaryInput(key) {
      this.activePrimary = key;
    },
    onSecondaryInput(key) {
      this.activeSecondary = key;
    },
    resetSecondary() {
      const opts = this.secondaryOptions;
      this.activeSecondary = opts.length ? opts[0].key : "";
    },
    /**
     * 三级分类目录从接口获取，拿到后默认选中第一项
     * 无论后端是否返回「全部」，前端统一在首位补上，避免没有全部可选
     */
    async loadTertiary() {
      const res = await fetchTertiaryOptions({
        primary: this.activePrimary,
        secondary: this.activeSecondary,
      });
      const list = Array.isArray(res) ? res : [];
      const hasAll = list.some((opt) => opt.key === allCategoryOption.key);
      const options = hasAll
        ? list
        : [allCategoryOption, ...list.filter((opt) => opt.key !== allCategoryOption.key)];
      this.tertiaryOptions = options;
      this.activeTertiary = options.length ? options[0].key : "";
    },
  },
};
</script>
