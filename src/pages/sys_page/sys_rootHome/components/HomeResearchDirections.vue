<!--
 * 首页中间偏左：主要研究方向
 * - 标题：module-title-frame.png + 左右色块 title-dots-left/right.png
 * - 三块方向卡：1920 用 background-1920-decoration.png，2880 用
 *   item-bg-macro-industry-enterprise-economy.png
 * - 宽度由 index.vue 写入 --home-directions-w：1920 → 252px，2880 → 373px
 * - 大箭头 arrow-left.png 作为本模块的相对定位装饰（不参与独立定位，
 *   F11 只改高度时不会跟着漂移）
-->
<template>
  <section
    class="home-directions"
    :class="{
      'home-directions--wide': wide,
      'home-directions--focus': !!activeWord,
    }"
  >
    <img class="home-directions__arrow" :src="arrow" alt="" />

    <header class="home-directions__head">
      <img class="home-directions__dots" :src="dotsLeft" alt="" />
      <h2 class="home-directions__title">主要研究方向</h2>
      <img class="home-directions__dots" :src="dotsRight" alt="" />
    </header>

    <div class="home-directions__goal">
      <p class="home-directions__goal-title">建设目标</p>
      <p class="home-directions__goal-text">
        建设电力经济研究的学术高地、政策智库和人才摇篮，打造支撑政府精准施策、服务公司卓越运营、引领行业创新发展的核心研究力量。
      </p>
    </div>

    <ul class="home-directions__list">
      <li
        v-for="item in items"
        :key="item.key"
        class="home-directions__card"
        :class="{
          'is-actionable': !!item.desc,
          'is-focus': isWordActive(item),
        }"
        :tabindex="item.desc ? 0 : -1"
        v-on="wordEvents(item)"
      >
        <img class="home-directions__icon" :src="item.icon" alt="" />
        <p class="home-directions__card-title">{{ item.title }}</p>

        <!-- 词条卡片：贴在卡片右侧，从右往左渐入 -->
        <word-card
          :visible="isWordActive(item)"
          :item="item"
          direction="right"
          class="home-directions__wordcard"
        />
      </li>
    </ul>
  </section>
</template>

<script>
import dotsLeft from "@/asset/images/home/title-dots-left.png";
import dotsRight from "@/asset/images/home/title-dots-right.png";
import arrow from "@/asset/images/home/arrow-left.png";
// TODO 图标切图待确认，先用同风格图标占位
import iconMacro from "@/asset/images/home/jingji.png";
import iconInvest from "@/asset/images/home/yunying.png";
import iconTech from "@/asset/images/home/xietong.png";
import WordCard from "./WordCard.vue";
import wordCard from "../mixins/wordCard";

export default {
  name: "HomeResearchDirections",
  components: { WordCard },
  mixins: [wordCard],
  props: {
    wide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      arrow,
      dotsLeft,
      dotsRight,
      items: [
        {
          key: "macro",
          title: "宏观-行业-企业\n经济方向",
          icon: iconMacro,
          wordTitle: "宏观-行业-企业 经济方向",
          en: "Macro · Industry · Enterprise",
          // 占位文案，等设计稿确认后替换
          desc:
            "面向能源电力行业的经济研究，贯通宏观、行业、企业三个层面：宏观侧跟踪经济增长、" +
            "产业结构和能源政策走势，行业侧研判供需格局、成本传导与价格机制变化，企业侧分析经营绩效、" +
            "投资能力与风险敞口，形成自上而下的闭环分析链条，为战略规划、经营决策与政策建议提供量化支撑。",
        },
        { key: "invest", title: "投资-成本-价格\n运营研究", icon: iconInvest },
        { key: "tech", title: "技术-市场-政策\n协同仿真研究", icon: iconTech },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.home-directions {
  // ---- 设计稿尺寸（2880 基准，单位 px）----
  --dir-icon-w: 90;
  --dir-icon-h: 94;
  --dir-title-font: 30;
  --dir-goal-title: 17;
  // 设计稿 1920 / 2880 两版字号相同，按固定值处理，不乘 --home-s
  --dir-goal-font: 18;
  --dir-card-font: 22;
  // 大箭头（切图 760 × 1526 @2x，逻辑 380 × 763）：高度铺满模块，宽度自适应
  --dir-arrow-left: 0; // standard：横向起点
  --dir-arrow-left-wide: 46%; // wide：横向起点
  // ---- 词条卡片（设计稿 px）----
  --wordcard-w: 430;
  --wordcard-pad: 16;
  --wordcard-title-font: 18;
  --wordcard-en-font: 11;
  --wordcard-body-font: 13;

  display: flex;
  flex-direction: column;
  // 宽度由 index.vue 按页宽写入：1920 → 252px，2880 → 373px
  width: var(--home-directions-w, calc(373 * var(--home-s) * 1px));
  min-width: 0;
  position: relative;
}

// 大箭头：作为本模块的相对定位装饰，高度铺满模块、宽度按切图比例自适应
// 左右位置都用百分比，直接相对模块自身，不用再叠加 --home-s 换算
.home-directions__arrow {
  position: absolute;
  // 从模块顶部开始，右栏用 -30 * --home-s 与之对齐
  top: 0;
  left: var(--dir-arrow-left);
  z-index: -1; // 压在方向卡下方，不与卡片文字抢层级
  width: var(--home-arrow-w);
  height: auto; // 高度按切图比例自适应
  pointer-events: none;
}

// 宽屏：箭头横向推到 46%（竖直两个箭头共用同一条带，不单独调）
.home-directions--wide .home-directions__arrow {
  left: var(--dir-arrow-left-wide);
}

// 标题：切图 378 × 104，左右色块点缀
.home-directions__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(12 * var(--home-s) * 1px);
  width: 100%;
  aspect-ratio: 378 / 104;
  background-image: url("~@/asset/images/home/module-title-frame.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.home-directions__dots {
  flex: 0 0 auto;
  width: calc(26 * var(--home-s) * 1px);
  height: calc(4 * var(--home-s) * 1px);
  object-fit: contain;
}

.home-directions__title {
  margin: 0;
  color: #f4feff;
  font-size: calc(var(--dir-title-font) * 1px);
  font-weight: 500;
  letter-spacing: calc(4 * var(--home-s) * 1px);
  line-height: 1;
  text-shadow: calc(4 * var(--home-s) * 1px) calc(4 * var(--home-s) * 1px)
      calc(18 * var(--home-s) * 1px) rgba(95, 162, 201, 0.54),
    calc(1 * var(--home-s) * 1px) calc(1 * var(--home-s) * 1px)
      calc(6 * var(--home-s) * 1px) #5d9ec3;
  white-space: nowrap;
}

.home-directions__goal {
  margin-top: calc(16 * var(--home-s) * 1px);
}

.home-directions__goal-title {
  margin: 0 0 calc(8 * var(--home-s) * 1px);
  color: #f0a53c;
  font-size: calc(var(--dir-goal-title) * 1px);
  letter-spacing: calc(1 * var(--home-s) * 1px);
}

.root-home--compact .home-directions__list {
  gap: 2px;
  margin-top: calc(6px * var(--home-s));
}

.root-home--compact .home-directions__goal-text {
  line-height: 26px;
}

.home-directions__goal-text {
  text-align: justify;
  color: #ffffff;
  font-size: calc(var(--dir-goal-font) * 1px);
  font-style: normal;
  font-weight: 400;
  line-height: 30px;
}

.home-directions__list {
  display: flex;
  flex-direction: column;
  // 缝隙由 index.vue 按页宽写入：1920 → 8px，2880 → 31px
  gap: var(--home-dir-gap, calc(33 * var(--home-s) * 1px));
  margin: calc(18 * var(--home-s) * 1px) 0 0;
  padding: 0;
  list-style: none;
}

.home-directions__card {
  position: relative;
  display: flex;
  align-items: center;
  gap: calc(20 * var(--home-s) * 1px);
  width: 100%;
  padding: 0 calc(22 * var(--home-s) * 1px);
  box-sizing: border-box;
  // 2880：item-bg 切图 225 × 66 的比例
  aspect-ratio: 225 / 66;
  background-image: url("~@/asset/images/home/item-bg-macro-industry-enterprise-economy.png");
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

// 1920：background-1920-decoration 切图 248 × 148 的比例
.home-directions:not(.home-directions--wide) .home-directions__card {
  aspect-ratio: 248 / 148;
  background-image: url("~@/asset/images/home/background-1920-decoration.png");
  padding: 0 calc(18 * var(--home-s) * 1px) 0 0;
  gap: 0;
}

.home-directions__icon {
  flex: 0 0 auto;
  // 尺寸由 index.vue 按页宽写入：1920 → 81 × 85，2880 → 90 × 94.5
  width: var(--home-dir-icon-w, calc(var(--dir-icon-w) * var(--home-s) * 1px));
  height: var(--home-dir-icon-h, calc(var(--dir-icon-h) * var(--home-s) * 1px));
  object-fit: contain;
}

/* ---------- 词条卡片：定位在卡片右侧，从右往左渐入 ---------- */
.home-directions__wordcard {
  top: 50%;
  left: 100%;
  margin-left: calc(18 * var(--home-s) * 1px);
  transform: translateY(-50%);
}

.home-directions--focus .home-directions__card {
  opacity: 0.45;
}

.home-directions__card.is-actionable {
  cursor: pointer;
}

.home-directions__card.is-focus {
  opacity: 1;
}

.home-directions__card {
  transition: opacity 0.3s ease;
}

.home-directions__card-title {
  font-size: calc(var(--dir-card-font) * 1px);
  line-height: 1.6;
  // 设计稿是「宏观-行业-企业 / 经济方向」两行
  white-space: pre-line;
  font-weight: 600;
  font-style: normal;
  font-weight: 95 ExtraBold;
  line-height: 33px;
}
</style>
