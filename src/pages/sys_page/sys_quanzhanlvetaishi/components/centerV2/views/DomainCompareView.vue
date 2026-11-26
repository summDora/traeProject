<!--
 * 中心卡片 V2 · 政策领域对比
 * 一级 / 二级分类共用父级目录，省份横向分页，雷达图复用 RadarChart
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
    </div>

    <div class="qcv2-provinces">
      <button
        type="button"
        class="qcv2-provinces__arrow"
        aria-label="上一组省份"
        :disabled="provincePage === 0"
        @click="movePage(-1)"
      >
        ‹
      </button>
      <div class="qcv2-provinces__items">
        <button
          v-for="province in visibleProvinces"
          :key="province"
          type="button"
          class="qcv2-provinces__item"
          :class="{ 'is-active': activeProvince === province }"
          @click="selectProvince(province)"
        >
          {{ province }}
        </button>
      </div>
      <button
        type="button"
        class="qcv2-provinces__arrow"
        aria-label="下一组省份"
        :disabled="provincePage >= maxPage"
        @click="movePage(1)"
      >
        ›
      </button>
    </div>

    <div class="qcv2-scene__chart">
      <radar-chart
        :data="radarData"
        :theme="theme"
        :show-legend="false"
        radius="58%"
        :indicator-font-size="12"
      />
    </div>
  </div>
</template>

<script>
import V2Select from "../V2Select.vue";
import RadarChart from "../../charts/RadarChart.vue";
import { fetchDomainCompare } from "@/api/quanzhanlvetaishi";
import { domainProvinces } from "../mockData";

const PAGE_SIZE = 15;

export default {
  name: "V2DomainCompareView",
  components: { V2Select, RadarChart },
  props: {
    theme: { type: String, default: "dark" },
    primaryOptions: { type: Array, default: () => [] },
    secondaryOptions: { type: Array, default: () => [] },
    tertiaryOptions: { type: Array, default: () => [] },
  },
  data() {
    return {
      provinces: domainProvinces,
      provincePage: 0,
      activeProvince: domainProvinces[0],
      primary: "",
      secondary: "",
      radarData: { indicators: [], series: [] },
    };
  },
  computed: {
    maxPage() {
      return Math.max(0, Math.ceil(this.provinces.length / PAGE_SIZE) - 1);
    },
    visibleProvinces() {
      return this.provinces.slice(
        this.provincePage * PAGE_SIZE,
        (this.provincePage + 1) * PAGE_SIZE
      );
    },
  },
  watch: {
    primary: "loadData",
    secondary: "loadData",
    activeProvince: "loadData",
  },
  mounted() {
    this.loadData();
  },
  methods: {
    movePage(delta) {
      this.provincePage = Math.min(this.maxPage, Math.max(0, this.provincePage + delta));
    },
    selectProvince(province) {
      this.activeProvince = province;
      this.provincePage = Math.floor(this.provinces.indexOf(province) / PAGE_SIZE);
    },
    async loadData() {
      const res = await fetchDomainCompare({
        primary: this.primary,
        secondary: this.secondary,
        province: this.activeProvince,
      });
      if (res && Array.isArray(res.indicators) && Array.isArray(res.series)) {
        this.radarData = res;
      }
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

.qcv2-provinces {
  flex: none;
  display: flex;
  align-items: center;
  gap: calc(8px * var(--qzlt-s, 1));
  padding: 0 calc(4px * var(--qzlt-s, 1)) calc(6px * var(--qzlt-s, 1));

  &__items {
    display: flex;
    flex: 1;
    min-width: 0;
    gap: calc(8px * var(--qzlt-s, 1));
    overflow: hidden;
  }

  &__item {
    flex: 0 0 auto;
    min-width: calc(68px * var(--qzlt-s, 1));
    height: calc(48px * var(--qzlt-s, 1));
    padding: 0 calc(12px * var(--qzlt-s, 1));
    font: inherit;
    font-size: clamp(12px, calc(18px * var(--qzlt-s, 1)), 20px);
    font-weight: 600;
    color: #d7ecff;
    white-space: nowrap;
    border: 1px solid transparent;
    border-radius: calc(4px * var(--qzlt-s, 1));
    background: rgba(4, 22, 38, 0.82);
    cursor: pointer;
    transition: color 0.18s, background 0.18s, border-color 0.18s,
      box-shadow 0.18s;

    &:hover {
      color: #ffffff;
      background: rgba(10, 80, 114, 0.72);
    }

    &.is-active {
      color: #ffffff;
      border-color: #28e8ff;
      background: linear-gradient(180deg, rgba(19, 114, 150, 0.68), rgba(6, 43, 68, 0.9));
      box-shadow: 0 0 calc(10px * var(--qzlt-s, 1)) rgba(32, 216, 255, 0.34);
    }
  }

  &__arrow {
    flex: none;
    width: calc(40px * var(--qzlt-s, 1));
    height: calc(48px * var(--qzlt-s, 1));
    padding: 0;
    font-size: clamp(24px, calc(36px * var(--qzlt-s, 1)), 40px);
    line-height: 1;
    color: #ffffff;
    border: 0;
    background: rgba(0, 136, 193, 0.85);
    cursor: pointer;

    &:hover:not(:disabled) {
      background: #14b6e8;
    }
    &:disabled {
      opacity: 0.38;
      cursor: not-allowed;
    }
  }
}
</style>
