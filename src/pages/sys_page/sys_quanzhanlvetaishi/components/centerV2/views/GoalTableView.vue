<!--
 * 中心卡片 V2 · 量化目标明细（三张指标卡任意一张点进来都是这一页）
 * - 标题固定「量化目标」，由 CenterPanelV2 的顶栏统一渲染
 * - 筛选只吃父级下发的「选项」，选中值由本组件自己维护
-->
<template>
  <div class="qcv2-goal">
    <div class="qcv2-filters">
      <div class="qcv2-filter">
        <span class="qcv2-filter__label">方向</span>
        <v2-select
          v-model="direction"
          class="qcv2-filter__select"
          :options="tertiaryOptions"
          placeholder="请选择"
        />
      </div>
      <div class="qcv2-filter">
        <span class="qcv2-filter__label">硬度</span>
        <v2-select
          v-model="hardness"
          class="qcv2-filter__select"
          :options="hardnessOptions"
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

    <div class="qcv2-table">
      <div class="qcv2-table__head">
        <span v-for="col in columns" :key="col.key">{{ col.label }}</span>
      </div>
      <div class="qcv2-table__body">
        <div v-for="(row, i) in rows" :key="`${row.direction}-${row.target}-${i}`" class="qcv2-table__row">
          <span class="qcv2-table__cell">{{ row.direction }}</span>
          <span class="qcv2-table__cell">{{ row.target }}</span>
          <span class="qcv2-table__cell">{{ row.region }}</span>
          <span class="qcv2-table__cell">{{ row.value }}</span>
          <span class="qcv2-table__cell">{{ row.deadline }}</span>
          <span class="qcv2-table__cell">
            <em
              class="qcv2-hard"
              :class="row.hardness === '约束性' ? 'qcv2-hard--orange' : 'qcv2-hard--cyan'"
            >
              {{ row.hardness }}
            </em>
          </span>
          <span class="qcv2-table__cell qcv2-table__cell--source">{{ row.source }}</span>
        </div>
        <p v-if="!rows.length" class="qcv2-table__empty">暂无符合条件的目标</p>
      </div>
    </div>
  </div>
</template>

<script>
import V2Select from "../V2Select.vue";
import { fetchGoalTable } from "@/api/quanzhanlvetaishi";
import { hardnessOptions, regionOptions } from "../mockData";

/**
 * 明细表列定义：宽度用同一套 grid 模板，表头与数据行共用
 * 设计稿顺序：方向 / 目标 / 地区 / 数值 / 时间节点 / 硬度 / 出处
 */
const COLUMNS = [
  { key: "direction", label: "方向" },
  { key: "target", label: "目标" },
  { key: "region", label: "地区" },
  { key: "value", label: "数值" },
  { key: "deadline", label: "时间节点" },
  { key: "hardness", label: "硬度" },
  { key: "source", label: "出处" },
];

export default {
  name: "V2GoalTableView",
  components: { V2Select },
  props: {
    theme: { type: String, default: "dark" },
    /** 父级下发的分类选项（本页只用三级分类目录做「方向」） */
    primaryOptions: { type: Array, default: () => [] },
    secondaryOptions: { type: Array, default: () => [] },
    tertiaryOptions: { type: Array, default: () => [] },
  },
  data() {
    return {
      columns: COLUMNS,
      hardnessOptions,
      regionOptions,
      direction: "",
      hardness: "",
      region: "全国",
      allRows: [],
    };
  },
  computed: {
    /** 接口层已按参数过滤；这里再兜一次，保证 mock 环境下筛选也生效 */
    rows() {
      return this.allRows.filter((row) => {
        if (
          this.direction &&
          this.direction !== "all" &&
          row.direction !== this.direction
        ) {
          return false;
        }
        if (this.hardness && row.hardness !== this.hardness) return false;
        if (this.region && this.region !== "全国" && row.region !== this.region) {
          return false;
        }
        return true;
      });
    },
  },
  watch: {
    direction: "loadRows",
    hardness: "loadRows",
    region: "loadRows",
  },
  mounted() {
    this.loadRows();
  },
  methods: {
    /** 数据统一走接口入口，未接入时接口层回落 mock */
    async loadRows() {
      const res = await fetchGoalTable({
        direction: this.direction,
        hardness: this.hardness,
        region: this.region,
      });
      this.allRows = Array.isArray(res) ? res : [];
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/filters.scss";

.qcv2-goal {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.qcv2-table {
  --cols: 0.9fr 1.5fr 0.7fr 0.85fr 0.8fr 0.7fr 1.9fr;

  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  border: 1px solid rgba(44, 138, 178, 0.45);
  background: rgba(4, 22, 40, 0.45);

  &__head {
    flex: none;
    display: grid;
    grid-template-columns: var(--cols);
    align-items: center;
    height: calc(64px * var(--qzlt-s, 1));
    padding: 0 calc(10px * var(--qzlt-s, 1));
    font-size: clamp(12px, calc(21px * var(--qzlt-s, 1)), 23px);
    color: #9fe8ff;
    background: linear-gradient(
      180deg,
      rgba(10, 66, 100, 0.9) 0%,
      rgba(8, 44, 72, 0.9) 100%
    );

    span {
      text-align: center;
      letter-spacing: calc(1px * var(--qzlt-s, 1));
    }
  }

  &__body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  &__row {
    display: grid;
    grid-template-columns: var(--cols);
    align-items: center;
    min-height: calc(96px * var(--qzlt-s, 1));
    padding: calc(10px * var(--qzlt-s, 1)) calc(10px * var(--qzlt-s, 1));
    border-bottom: 1px solid rgba(38, 110, 145, 0.35);
    font-size: clamp(12px, calc(20px * var(--qzlt-s, 1)), 22px);
    color: #d7ecff;
    transition: background 0.18s;

    &:nth-child(odd) {
      background: rgba(9, 42, 68, 0.35);
    }
    &:hover {
      background: rgba(20, 96, 140, 0.42);
    }
  }

  &__cell {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 calc(6px * var(--qzlt-s, 1));
    text-align: center;
    line-height: 1.5;
    word-break: break-all;

    &--source {
      text-align: left;
      justify-content: flex-start;
      color: #bfe2f8;
    }
  }

  &__empty {
    margin: 0;
    padding: calc(40px * var(--qzlt-s, 1)) 0;
    text-align: center;
    font-size: clamp(12px, calc(20px * var(--qzlt-s, 1)), 22px);
    color: rgba(180, 220, 245, 0.6);
  }
}

.qcv2-hard {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: calc(86px * var(--qzlt-s, 1));
  height: calc(34px * var(--qzlt-s, 1));
  padding: 0 calc(12px * var(--qzlt-s, 1));
  font-size: clamp(11px, calc(18px * var(--qzlt-s, 1)), 20px);
  font-style: normal;
  border-radius: calc(6px * var(--qzlt-s, 1));

  &--cyan {
    color: #6fe6ff;
    border: 1px solid rgba(80, 220, 255, 0.75);
    background: rgba(20, 130, 180, 0.22);
  }

  &--orange {
    color: #ffb46b;
    border: 1px solid rgba(255, 170, 90, 0.75);
    background: rgba(180, 100, 30, 0.22);
  }
}
</style>
