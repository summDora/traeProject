<template>
  <div class="gvs" :class="rootClass">
    <div class="gvs__head">
      <span v-if="title" class="gvs__title">{{ title }}</span>
      <div class="gvs__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="gvs__tab"
          :class="{ 'is-active': current === tab.key }"
          @click="select(tab.key)"
        >
          {{ tab.label }}
        </button>
      </div>
    </div>
    <div class="gvs__stage">
      <china-map-chart
        v-if="current === 'map'"
        :data="mapData"
        :theme="theme"
        class="gvs__viz"
      />
      <rank-bar-chart
        v-else-if="current === 'rank'"
        :data="rankData"
        :theme="theme"
        class="gvs__viz"
      />
      <release-bar-chart
        v-else
        :data="releaseData"
        :theme="theme"
        class="gvs__viz"
      />
    </div>
  </div>
</template>

<script>
import ChinaMapChart from "./ChinaMapChart.vue";
import RankBarChart from "./RankBarChart.vue";
import ReleaseBarChart from "./ReleaseBarChart.vue";

/**
 * 量化目标三态切换组合组件（他页可整段复用）
 * - 二级 Tab：【目标地图 | 排名列表 | 发布情况】
 * - 下方舞台承载对应图表
 * props:
 *  - value: 当前态 "map" | "rank" | "release"（支持 v-model）
 *  - theme: "dark" | "light"
 *  - title: 头部标题（传空则隐藏）
 *  - mapData / rankData / releaseData: 三张图各自数据
 */
export default {
  name: "GoalVizSwitcher",
  components: { ChinaMapChart, RankBarChart, ReleaseBarChart },
  props: {
    value: { type: String, default: "map" },
    theme: { type: String, default: "dark" },
    title: { type: String, default: "量化目标" },
    mapData: { type: Array, default: () => [] },
    rankData: { type: Array, default: () => [] },
    releaseData: { type: Array, default: () => [] },
  },
  data() {
    return {
      current: this.value,
      tabs: [
        { key: "map", label: "目标地图" },
        { key: "rank", label: "排名列表" },
        { key: "release", label: "发布情况" },
      ],
    };
  },
  computed: {
    rootClass() {
      return this.theme === "light" ? "gvs--light" : "gvs--dark";
    },
  },
  watch: {
    value(v) {
      this.current = v;
    },
  },
  methods: {
    select(key) {
      if (this.current === key) return;
      this.current = key;
      this.$emit("input", key);
      this.$emit("change", key);
    },
  },
};
</script>

<style lang="scss" scoped>
.gvs {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.gvs__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.gvs__title {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}

.gvs__tabs {
  display: flex;
  gap: 8px;
}

.gvs__tab {
  height: 28px;
  padding: 0 18px;
  font-size: 13px;
  letter-spacing: 0.5px;
  line-height: 1;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s, color 0.2s;
  border: 1px solid transparent;
  background: transparent;
}

.gvs__stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.gvs__viz {
  width: 100%;
  height: 100%;
}

/* ---------- dark ---------- */
.gvs--dark {
  .gvs__title {
    color: #eaf6ff;
  }
  .gvs__tab {
    color: #d8ecff;
    border-color: rgba(98, 217, 255, 0.55);
    background: rgba(10, 48, 72, 0.55);
  }
  .gvs__tab:hover {
    color: #ffffff;
    border-color: rgba(98, 217, 255, 0.95);
  }
  .gvs__tab.is-active {
    color: #06283a;
    font-weight: 600;
    border-color: transparent;
    background: linear-gradient(180deg, #8ff2e8 0%, #35c9c4 100%);
    box-shadow: 0 0 14px rgba(53, 201, 196, 0.45);
  }
}

/* ---------- light ---------- */
.gvs--light {
  .gvs__title {
    color: #0f172a;
  }
  .gvs__tab {
    color: #475569;
    border-color: #cbd5e1;
    background: #f1f5f9;
  }
  .gvs__tab:hover {
    color: #0f172a;
    border-color: #94a3b8;
  }
  .gvs__tab.is-active {
    color: #ffffff;
    font-weight: 600;
    border-color: transparent;
    background: linear-gradient(180deg, #22d3ee 0%, #0ea5e9 100%);
    box-shadow: 0 0 10px rgba(14, 165, 233, 0.35);
  }
}
</style>
