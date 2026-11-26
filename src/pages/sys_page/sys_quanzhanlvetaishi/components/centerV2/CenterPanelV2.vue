<!--
 * 全战略态势 · 中心卡片 V2（新版，独立演进）
 *
 * 与 V1 的边界：
 * - V1 的 CenterPanel.vue / center/* 一律不改，V2 全部落在本目录
 * - 类名统一 qcv2- / qcv2__ 前缀，样式组件内 scoped，不依赖 styles/index.scss 的 .qzlt-center/.qzlt-main-tab 等规则
 * - 尺寸仍只吃父容器与继承下来的 --qzlt-s
 *
 * 交互模型：
 * - home：三张指标卡 + 心形图上两组标签
 * - 点指标卡（量化目标总数 / 约束性目标 / 预期性目标）都进入 goal 场景，标题统一「量化目标」
 * - 点心形图标签进入各自的场景，顶栏出现「返回」回到 home
 *
 * 筛选约定：外层不再放一/二/三级分类，只把「选项」下发给子视图，
 * 各子视图自己维护选中值，互不影响。
-->
<template>
  <section class="qcv2 qzlt-panel">
    <header v-if="!isHome" class="qcv2-bar">
      <button type="button" class="qcv2-bar__back" @click="backHome">
        <img
          class="qcv2-bar__icon"
          src="@/asset/images/qzlts/v2/icon-back.png"
          alt=""
        />
        <span>返回</span>
      </button>
      <h3 class="qcv2-bar__title">{{ title }}</h3>
    </header>

    <v2-stat-cards
      v-if="showStats"
      class="qcv2__stats"
      :items="statCards"
      @pick="openScene('goal')"
    />

    <div class="qcv2__body">
      <home-view v-if="isHome" @open="openScene" />
      <component
        v-else
        :is="sceneView"
        v-bind="viewProps"
        @open="openScene"
      />
    </div>
  </section>
</template>

<script>
import V2StatCards from "./V2StatCards.vue";
import HomeView from "./views/HomeView.vue";
import GoalTableView from "./views/GoalTableView.vue";
import ProvinceCompareView from "./views/ProvinceCompareView.vue";
import DomainCompareView from "./views/DomainCompareView.vue";
import PlaceholderView from "./views/PlaceholderView.vue";
import { categoryTree, allCategoryOption, goalSummary } from "../mockData";
import { sceneTitles } from "./mockData";
import { fetchTertiaryOptions } from "@/api/quanzhanlvetaishi";

/** 已经成型的场景；其余标签走占位视图，做好一个登记一个 */
const SCENE_VIEWS = {
  goal: GoalTableView,
  "province-compare": ProvinceCompareView,
  "domain-compare": DomainCompareView,
};

export default {
  name: "CenterPanelV2",
  components: { V2StatCards, HomeView },
  props: {
    theme: { type: String, default: "dark" },
  },
  data() {
    return {
      scene: "home",
      statCards: goalSummary,
      primaryOptions: [],
      secondaryOptions: [],
      tertiaryOptions: [],
    };
  },
  computed: {
    isHome() {
      return this.scene === "home";
    },
    /** 指标卡只在首页和量化目标页出现 */
    showStats() {
      return this.isHome || this.scene === "goal";
    },
    title() {
      return sceneTitles[this.scene] || "";
    },
    sceneView() {
      return SCENE_VIEWS[this.scene] || PlaceholderView;
    },
    /** 只下发「选项」，不下发选中值 */
    viewProps() {
      if (!SCENE_VIEWS[this.scene]) return { label: this.title };
      return {
        theme: this.theme,
        primaryOptions: this.primaryOptions,
        secondaryOptions: this.secondaryOptions,
        tertiaryOptions: this.tertiaryOptions,
      };
    },
  },
  created() {
    this.primaryOptions = [
      allCategoryOption,
      ...categoryTree.map(({ key, label }) => ({ key, label })),
    ];
    const seconds = [];
    categoryTree.forEach((item) => {
      item.children.forEach((child) => {
        seconds.push({ key: child.key, label: child.label, parent: item.key });
      });
    });
    this.secondaryOptions = [allCategoryOption, ...seconds];
  },
  mounted() {
    this.loadTertiaryOptions();
  },
  methods: {
    openScene(target) {
      const key = typeof target === "string" ? target : target && target.key;
      if (key) this.scene = key;
    },
    backHome() {
      this.scene = "home";
    },
    /**
     * 三级分类目录从接口获取，首个统一补「全部」
     * 目录一次性加载完下发给所有子视图共用，切换场景不重复请求
     */
    async loadTertiaryOptions() {
      const res = await fetchTertiaryOptions({});
      const list = Array.isArray(res) ? res : [];
      const hasAll = list.some((opt) => opt.key === allCategoryOption.key);
      this.tertiaryOptions = hasAll
        ? list
        : [allCategoryOption, ...list.filter((opt) => opt.key !== allCategoryOption.key)];
    },
  },
};
</script>

<style lang="scss" scoped>
.qcv2 {
  min-height: 0;
  padding: calc(12px * var(--qzlt-s, 1)) calc(14px * var(--qzlt-s, 1));

  &__stats {
    margin-bottom: calc(16px * var(--qzlt-s, 1));
  }

  &__body {
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
  }
}

.qcv2-bar {
  position: relative;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(72px * var(--qzlt-s, 1));
  margin-bottom: calc(8px * var(--qzlt-s, 1));

  &__back {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: calc(6px * var(--qzlt-s, 1));
    height: calc(44px * var(--qzlt-s, 1));
    padding: 0 calc(14px * var(--qzlt-s, 1)) 0 calc(10px * var(--qzlt-s, 1));
    font: inherit;
    font-size: clamp(12px, calc(20px * var(--qzlt-s, 1)), 22px);
    color: #a8e9ff;
    border: 1px solid rgba(80, 200, 255, 0.6);
    border-radius: calc(6px * var(--qzlt-s, 1));
    background: rgba(10, 62, 96, 0.6);
    cursor: pointer;
    transition: color 0.18s, border-color 0.18s, background 0.18s, box-shadow 0.18s;

    &:hover {
      color: #ffffff;
      border-color: #7fe6ff;
      background: rgba(18, 110, 160, 0.75);
      box-shadow: 0 0 calc(12px * var(--qzlt-s, 1)) rgba(60, 200, 255, 0.35);
    }
  }

  &__icon {
    width: calc(24px * var(--qzlt-s, 1));
    height: calc(24px * var(--qzlt-s, 1));
  }

  &__title {
    margin: 0;
    font-size: clamp(16px, calc(30px * var(--qzlt-s, 1)), 32px);
    font-weight: 700;
    letter-spacing: calc(3px * var(--qzlt-s, 1));
    color: #f0faff;
    text-shadow: 0 0 calc(14px * var(--qzlt-s, 1)) rgba(90, 205, 255, 0.75);
  }
}
</style>
