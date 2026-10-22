<template>
  <div class="center-view portrait-view">
    <div class="portrait-view__head">
      <div class="portrait-view__tabs">
        <button
          v-for="m in modes"
          :key="m.key"
          type="button"
          class="portrait-view__tab"
          :class="{ 'is-active': mode === m.key }"
          @click="mode = m.key"
        >
          {{ m.label }}
        </button>
      </div>
      <div class="portrait-view__filter">
        <filter-select
          :value="tertiary"
          :options="tertiaryOptions"
          placeholder="三级分类"
          @input="onTertiary"
        />
      </div>
    </div>

    <div class="portrait-view__stage">
      <china-map-chart
        v-if="mode === 'map'"
        :data="mapData"
        :theme="theme"
        class="portrait-view__viz"
      />
      <policy-type-rank-chart
        v-else
        :data="rankData"
        :theme="theme"
        class="portrait-view__viz"
      />
    </div>
  </div>
</template>

<script>
import ChinaMapChart from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/ChinaMapChart.vue";
import PolicyTypeRankChart from "@/pages/sys_page/sys_quanzhanlvetaishi/components/charts/PolicyTypeRankChart.vue";
import FilterSelect from "../FilterSelect.vue";
import { fetchPortraitViz } from "@/api/quanzhanlvetaishi";
import { goalMapData, policyTypeRankData } from "../mockData";

/**
 * 政策画像：【目标地图 | 政策类型排行】双态切换 + 右上角三级分类筛选
 */
export default {
  name: "PortraitView",
  components: { ChinaMapChart, PolicyTypeRankChart, FilterSelect },
  props: {
    theme: { type: String, default: "dark" },
    /** 兼容旧字段：二级分类 key */
    category: { type: String, default: "" },
    primary: { type: String, default: "" },
    secondary: { type: String, default: "" },
    tertiary: { type: String, default: "" },
    tertiaryOptions: { type: Array, default: () => [] },
  },
  data() {
    return {
      mode: "map",
      modes: [
        { key: "map", label: "目标地图" },
        { key: "rank", label: "政策类型排行" },
      ],
      mapData: goalMapData,
      rankData: policyTypeRankData,
    };
  },
  watch: {
    primary: "loadData",
    secondary: "loadData",
    tertiary: "loadData",
  },
  mounted() {
    this.loadData();
  },
  methods: {
    /** 图表数据统一走接口入口，失败时接口层已回落 mock */
    async loadData() {
      const res = await fetchPortraitViz({
        primary: this.primary,
        secondary: this.secondary,
        tertiary: this.tertiary,
      });
      if (!res) return;
      if (Array.isArray(res.map)) this.mapData = res.map;
      if (Array.isArray(res.rank)) this.rankData = res.rank;
    },
    onTertiary(key) {
      this.$emit("input", key);
      this.$emit("update:tertiary", key);
    },
  },
};
</script>
