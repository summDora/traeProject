<!--
 * 中心卡片 V2 · 省域政策对比
 * 一级 / 二级分类 + 地区筛选 + 省级打分排名条（复用 RankBarChart 原子图表）
-->
<template>
  <div class="qcv2-scene">
    <div class="qcv2-filters">
      <div class="qcv2-filter">
        <span class="qcv2-filter__label">一级分类</span>
        <v2-select
          v-model="primary"
          class="qcv2-filter__select"
          :options="primaryOptions"
          placeholder="请选择"
        />
      </div>
      <div class="qcv2-filter">
        <span class="qcv2-filter__label">二级分类</span>
        <v2-select
          v-model="secondary"
          class="qcv2-filter__select"
          :options="secondaryOptions"
          placeholder="请选择"
        />
      </div>
      <div class="qcv2-filter">
        <span class="qcv2-filter__label">地区</span>
        <v2-select
          v-model="region"
          class="qcv2-filter__select qcv2-filter__select--wide"
          :options="regionOptions"
        />
      </div>
    </div>

    <div class="qcv2-scene__chart">
      <rank-bar-chart :data="rows" :theme="theme" :max="100" />
    </div>
  </div>
</template>

<script>
import V2Select from "../V2Select.vue";
import RankBarChart from "../../charts/RankBarChart.vue";
import { fetchProvinceCompare } from "@/api/quanzhanlvetaishi";
import { regionOptions } from "../mockData";

export default {
  name: "V2ProvinceCompareView",
  components: { V2Select, RankBarChart },
  props: {
    theme: { type: String, default: "dark" },
    primaryOptions: { type: Array, default: () => [] },
    secondaryOptions: { type: Array, default: () => [] },
    tertiaryOptions: { type: Array, default: () => [] },
  },
  data() {
    return {
      regionOptions,
      primary: "",
      secondary: "",
      region: "全国",
      all: [],
    };
  },
  computed: {
    /** 选到具体省份时只留该省，避免排名条只剩一根却仍占满整屏 */
    rows() {
      if (!this.region || this.region === "全国") return this.all;
      return this.all.filter((item) => item.name === this.region);
    },
  },
  watch: {
    primary: "loadData",
    secondary: "loadData",
    region: "loadData",
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      const res = await fetchProvinceCompare({
        primary: this.primary,
        secondary: this.secondary,
        region: this.region,
      });
      this.all = Array.isArray(res) ? res : [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/filters.scss";

.qcv2-scene {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;

  &__chart {
    flex: 1;
    min-height: 0;
    padding-top: calc(10px * var(--qzlt-s, 1));
  }
}
</style>
