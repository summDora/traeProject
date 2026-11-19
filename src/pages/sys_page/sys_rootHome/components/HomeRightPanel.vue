<!--
 * 首页右侧：场景驱动（Scene-driven）
 * - 整体底色：research-team-frame-side.png（逻辑 249 × 660），按右栏高度铺满
 * - 卡片底色 item-bg-macro-industry-enterprise-economy.png（225 × 66）
 * - 图标统一取 src/asset/images/home/right-*.png（逻辑 47 × 46）
 * - 右栏宽度：由 index.vue 写入 --home-right-panel-w（1920 → 235px，2880 → 270px）
 * - 词条卡片：目前只有【重大政策】挂了演示词条，不需要时把数据里的 en / desc
 *   两行注释掉即可完全关闭（模板与 mixin 保持不动，不会报错、不占位）
-->
<template>
  <aside
    class="home-right-panel"
    :class="{
      'home-right-panel--wide': wide,
      'home-right-panel--focus': !!activeWord,
    }"
  >
    <!-- 大箭头：高度铺满本栏、宽度自适应，随面板一起定位 -->
    <img class="home-right-panel__arrow" :src="arrow" alt="" />

    <header class="home-right-panel__head">
      <p class="root-home-panel-title">场景驱动</p>
      <p class="root-home-panel-subtitle">Scene-driven</p>
    </header>

    <ul class="home-right-panel__list">
      <li
        v-for="item in items"
        :key="item.key"
        class="home-right-panel__card"
        :class="{ 'is-actionable': !!item.desc, 'is-focus': isWordActive(item) }"
        :tabindex="item.desc ? 0 : -1"
        v-on="wordEvents(item)"
      >
        <img class="home-right-panel__icon" :src="item.icon" alt="" />
        <span class="home-right-panel__label">{{ item.label }}</span>

        <!-- 词条卡片：贴在条目左侧，从左向右渐入；关闭方式见文件头注释 -->
        <word-card
          :visible="isWordActive(item)"
          :item="item"
          direction="left"
          :anchor-style="wordCardStyle"
          class="home-right-panel__wordcard"
        />
      </li>
    </ul>
  </aside>
</template>

<script>
import iconZhengce from "@/asset/images/home/right-zhengce.png";
import iconTouzi from "@/asset/images/home/right-touzi.png";
import iconShichang from "@/asset/images/home/right-shichang.png";
import iconGuihua from "@/asset/images/home/right-guihua.png";
import iconFengxian from "@/asset/images/home/right-fengxian.png";
import iconYetai from "@/asset/images/home/right-yetai.png";
import iconDiantan from "@/asset/images/home/right-diantan.png";
import arrow from "@/asset/images/home/arrow-right.png";
import WordCard from "./WordCard.vue";
import wordCard from "../mixins/wordCard";

export default {
  name: "HomeRightPanel",
  components: { WordCard },
  mixins: [wordCard],
  props: {
    // 2880 宽屏布局（与另外两个栏保持一致的模式切换）
    wide: { type: Boolean, default: false },
  },
  data() {
    return {
      arrow,
      // 文案待设计稿确认，先按图标命名占位
      items: [
        {
          key: "zhengce",
          label: "重大政策",
          icon: iconZhengce,
          // ↓↓↓ 词条演示：不需要时注释掉下面 en / desc 两行即可 ↓↓↓
          en: "Major Policies",
          desc:
            "汇聚国家与地方能源电力领域的政策法规、规划文件与监管要求，按发布主体、效力层级、" +
            "适用范围做结构化拆解，实时跟踪政策出台、修订与废止动态，量化研判其对投资布局、" +
            "市场交易与经营策略的影响路径，为政策解读、合规研判与前瞻决策提供依据。",
          // ↑↑↑ 词条演示 ↑↑↑
        },
        { key: "guihua", label: "重大规划", icon: iconGuihua },
        { key: "touzi", label: "重大投资", icon: iconTouzi },
        { key: "shichang", label: "市场机制", icon: iconShichang },
        { key: "yetai", label: "新型业态", icon: iconYetai },
        { key: "diantan", label: "电碳价值", icon: iconDiantan },
        { key: "fengxian", label: "重大风险", icon: iconFengxian },
      ],
    };
  },
  computed: {
    // 右栏 region 带 overflow: hidden auto，卡片锚在条目外侧会被裁掉，
    // 所以用 fixed + 条目的视口矩形定位（离场时沿用 wordRect，动画位置不跳）
    wordCardStyle() {
      const rect = this.wordRect;
      if (!rect) return {};
      const gap = 14;
      return {
        position: "fixed",
        left: "auto",
        right: `${window.innerWidth - rect.left + gap}px`,
        top: `${rect.top + rect.height / 2}px`,
        transform: "translateY(-50%)",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.home-right-panel {
  // 1920 → 235px（235 / 0.6667 ≈ 352，统一用 --home-s 表达）
  --right-w: 270;
  --right-icon: 47;
  --right-font: 24;
  --right-pad-x: 14;
  --right-pad-y: 16;
  // 箭头右边缘探进面板的比例（相对面板宽度）
  // 1920 → 100%（即 right: 0，右边缘与面板右边缘齐平），2880 → 75%
  --right-arrow-inset: 100%;
  // ---- 词条卡片（设计稿 px）----
  --wordcard-w: 420;
  --wordcard-pad: 16;
  --wordcard-title-font: 18;
  --wordcard-en-font: 11;
  --wordcard-body-font: 13;

  // 大箭头锚在面板上，需要定位上下文 + 独立层叠
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  // 宽度由 index.vue 按页宽写入：1920 → 235px，2880 → 270px
  // （字号固定后，面板不能再按 --home-s 缩，否则卡片比文字还矮）
  width: var(--home-right-panel-w, calc(var(--right-w) * var(--home-s) * 1px));
  // 侧边边框切图 498 × 1320 @2x（逻辑 249 × 660），高度跟随内容
  min-height: 0;
  padding: calc(var(--right-pad-y) * var(--home-s) * 1px)
    calc(var(--right-pad-x) * var(--home-s) * 1px);
  box-sizing: border-box;
  min-width: 0;
  background-image: url("~@/asset/images/home/research-team-frame-side.png");
  background-position: right top;
  background-repeat: no-repeat;
  background-size: 90% 90%;
}

.home-right-panel--wide {
  --right-arrow-inset: 75%;
}

// 大箭头：与左箭头对齐。左模块距内容区顶部 68 * --home-s（区域 padding 18 + margin 50），
// 本栏是 98 * --home-s（区域 padding），差 30 * --home-s，所以这里上移这个差值
.home-right-panel__arrow {
  position: absolute;
  top: calc(-30 * var(--home-s) * 1px); // 1920 → -20px，2880 → -30px
  // 紧凑模式下「主要研究方向」模块被上移，大箭头跟着同量上移，继续对齐
  .root-home--compact & {
    top: calc(-64 * var(--home-s) * 1px); // 1920 → -43px，2880 → -64px
  }
  right: calc(100% - var(--right-arrow-inset));
  z-index: 0;
  width: var(--home-arrow-w);
  height: auto; // 高度按切图比例自适应
  pointer-events: none;
}

// 标题与列表压在箭头之上
.home-right-panel__head,
.home-right-panel__list {
  position: relative;
  z-index: 1;
}

// 标题：右对齐，不加色块装饰
.home-right-panel__head {
  flex: 0 0 auto;
  margin-bottom: calc(14 * var(--home-s) * 1px);
  text-align: right;
}

// 标题/副标题的基础样式见 styles/index.scss 的 .root-home-panel-title / -subtitle

.home-right-panel__list {
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 25px;
  margin: 0;
  padding: 0;
  min-height: 0;
  list-style: none;
}

.home-right-panel__card {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(14 * var(--home-s) * 1px);
  width: 100%;
  padding: 0 calc(14 * var(--home-s) * 1px);
  box-sizing: border-box;
  aspect-ratio: 225 / 66;
  background-image: url("~@/asset/images/home/item-bg-macro-industry-enterprise-economy.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

/* ---------- 词条卡片：定位在条目左侧（fixed 定位由 wordCardStyle 给） ---------- */
.home-right-panel__wordcard {
  z-index: 70;
}

.home-right-panel--focus .home-right-panel__card {
  opacity: 0.45;
}

.home-right-panel__card.is-actionable {
  cursor: pointer;
}

.home-right-panel__card.is-focus {
  opacity: 1;
}

.home-right-panel__card {
  transition: opacity 0.3s ease;
}

.home-right-panel__icon {
  flex: 0 0 auto;
  // 字号已固定，图标同步固定，不再乘 --home-s
  width: calc(var(--right-icon) * 1px);
  height: auto;
  object-fit: contain;
}

.home-right-panel__label {
  overflow: hidden;
  color: #f2feff;
  font-size: calc(var(--right-font) * 1px);
  letter-spacing: calc(1 * var(--home-s) * 1px);
  text-overflow: ellipsis;
  text-shadow: calc(2 * var(--home-s) * 1px) calc(2 * var(--home-s) * 1px)
    calc(8 * var(--home-s) * 1px) rgba(93, 158, 195, 0.6);
  white-space: nowrap;
}
</style>
