<!--
 * 中间：五全五库（一核 + 五全 + 五库）
 * - 坐标父级 = 底座切图盒子（aspect-ratio 与切图 1:1），所有元素用百分比定位
 * - 十项坐标直接写百分比（QUAN_POINTS / KU_POINTS），注释里保留设计稿原始 px
 * - 当前 y 已在设计稿值上统一 +2%（配合 1063/884、1780/912 的裁剪比例微调）
 * - 图标、底板一律按静态资源原始尺寸渲染，quan-bg / ku-bg 只是文字底板
 * - 词条卡片：hover / focus 带 desc 的条目时，从下往上渐入，其余条目压暗
-->
<template>
  <div
    class="home-center"
    :class="{ 'home-center--wide': wide, 'home-center--focus': !!activeWord }"
  >
    <ul class="home-center__ring">
      <li
        v-for="item in quanItems"
        :key="item.key"
        class="home-center__item home-center__item--quan"
        :class="{
          'is-actionable': !!item.desc,
          'is-focus': isWordActive(item),
        }"
        :style="pointStyle(item)"
        :tabindex="item.desc ? 0 : -1"
        v-on="wordEvents(item)"
      >
        <img class="home-center__icon" :src="item.icon" alt="" />
        <span class="home-center__label home-center__label--quan">
          {{ item.text }}
        </span>
      </li>
    </ul>

    <ul class="home-center__ring">
      <li
        v-for="item in kuItems"
        :key="item.key"
        class="home-center__item home-center__item--ku"
        :style="pointStyle(item)"
      >
        <img class="home-center__icon" :src="item.icon" alt="" />
        <span class="home-center__label home-center__label--ku">
          {{ item.text }}
        </span>
      </li>
    </ul>

    <!-- ===== 新需求：战略联合推演中枢入口 start ===== -->
    <!-- 文案烤在底图里，这里叠一个透明热区承接点击；hover 时透出高亮 -->
    <button
      v-if="deductionEntry"
      type="button"
      class="home-center__deduction-entry"
      title="进入战略联合推演中枢"
      aria-label="进入战略联合推演中枢"
      @click="$emit('open-deduction')"
    ></button>
    <!-- ===== 新需求：战略联合推演中枢入口 end ===== -->

    <!-- 词条卡片：贴在有 desc 的条目上方，从下往上渐入 -->
    <word-card
      :visible="!!activeWord"
      :item="wordCardItem"
      :anchor-style="wordCardStyle"
      class="home-center__wordcard"
    />
  </div>
</template>

<script>
import quanZhanlve from "@/asset/images/home/quan-zhanlve.png";
import quanJingji from "@/asset/images/home/quan-jingji.png";
import quanShichang from "@/asset/images/home/quan-shichang.png";
import quanQiye from "@/asset/images/home/quan-qiye.png";
import quanYingyong from "@/asset/images/home/quan-yingyong.png";
import kuShuju from "@/asset/images/home/ku-shuju.png";
import kuZhengce from "@/asset/images/home/ku-zhengce.png";
import kuGongju from "@/asset/images/home/ku-gongju.png";
import kuAnli from "@/asset/images/home/ku-anli.png";
import kuChenguo from "@/asset/images/home/ku-chenguo.png";
import WordCard from "./WordCard.vue";
import wordCard from "../mixins/wordCard";

// 十项最终落位：占底座图的百分比（注释里是设计稿 2880 画布的原始 px）
// 换算基准：底座 frame 原点 (937.13, 130.14)、尺寸 1780 × 952
//   x% = (设计x − 937.13) / 1780      y% = (设计y − 130.14) / 952
// 之后微调直接改这里的百分比即可
const QUAN_POINTS = [
  {
    key: "zhanlve",
    text: "全战略态势研判",
    icon: quanZhanlve,
    x: 26.24,
    y: 33.52,
  }, // (1404.28, 430.19)
  {
    key: "jingji",
    text: "全经济综合分析",
    icon: quanJingji,
    x: 36.28,
    y: 41.62,
  }, // (1582.89, 507.36)
  {
    key: "shichang",
    text: "全市场规划仿真",
    icon: quanShichang,
    x: 50,
    y: 46.0, // (1827.13, 539.50)
    en: "Market Planning Simulation",
    // 占位文案，等设计稿确认后替换
    desc:
      "全市场规划仿真以全市场要素为对象，构建覆盖电力供需、价格机制与竞争格局的多情景推演沙盘。" +
      "可对负荷增长、电源投产、政策调整、极端天气等变量进行组合仿真，量化不同情景下的市场出清价格、" +
      "交易电量与投资回报，为市场规则设计、交易策略制定与经营决策提供可回溯、可对比的量化依据。",
  },
  { key: "qiye", text: "全企业经营推演", icon: quanQiye, x: 64, y: 41.62 }, // (2037.20, 479.99)
  {
    key: "yingyong",
    text: "全应用场景实验",
    icon: quanYingyong,
    x: 73,
    y: 33.52,
  }, // (2216.81, 426.58)
];

// 五库：整条弧线按「模型工具库 = (50%, 72%)」做了刚性平移 (+1.05%, −4.12%)
// 平移量来源：拟合值 (48.95%, 76.12%) → 实测更贴背景弧线 (50%, 72%)
// 原始拟合（设计稿 2880 px）：cx 1816.96 cy 723.00 rx 508.36 ry 131.94
//                            角度 −100.0 / −32.3 / −1.0 / +36.7 / +99.5
const KU_POINTS = [
  { key: "shuju", text: "数据资源库", icon: kuShuju, x: 21.47, y: 64.0 },
  { key: "zhengce", text: "政策规则库", icon: kuZhengce, x: 34, y: 73.0 },
  { key: "gongju", text: "模型工具库", icon: kuGongju, x: 50, y: 77.0 },
  { key: "anli", text: "情景案例库", icon: kuAnli, x: 67, y: 73.0 },
  { key: "chenguo", text: "知识成果库", icon: kuChenguo, x: 78.77, y: 64.0 },
];

export default {
  name: "HomeCenterPlatform",
  components: { WordCard },
  mixins: [wordCard],
  props: {
    wide: {
      type: Boolean,
      default: false,
    },
    // 新需求：是否显示「战略联合推演中枢」入口热区
    deductionEntry: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      quanItems: QUAN_POINTS,
      kuItems: KU_POINTS,
    };
  },
  computed: {
    // 卡片锚定在条目的百分比坐标上；离场动画期间沿用上一条的坐标
    wordCardStyle() {
      const item = this.wordCardItem;
      if (!item.x && item.x !== 0) return {};
      return {
        left: `${item.x}%`,
        top: `${item.y}%`,
      };
    },
  },
  methods: {
    // 把元素中心对齐到表格里的百分比坐标
    pointStyle(item) {
      return {
        left: `${item.x}%`,
        top: `${item.y}%`,
        // 越靠下（越靠前）层级越高
        zIndex: Math.round(10 + item.y),
        transform: "translate(-50%, -50%)",
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.home-center {
  // ---- 设计稿尺寸（2880 基准，单位 px）----
  --quan-icon: 128; // 图标按切图 1:1
  --ku-icon: 188;
  --quan-label-w: 223; // quan-bg.png 逻辑宽
  --quan-label-h: 32;
  --ku-label-w: 146.24; // 设计稿中 ku-bg 的显示宽（切图逻辑 150 × 38）
  --ku-label-h: 36.41;
  --label-font: 18;
  // ---- 词条卡片（设计稿 px）----
  --wordcard-w: 520;
  --wordcard-pad: 18;
  --wordcard-title-font: 20;
  --wordcard-en-font: 12;
  --wordcard-body-font: 14;
  --wordcard-lift: 72; // 卡片底部距图标中心的距离

  position: relative;
  width: 100%;
  background-position: center top;
  background-repeat: no-repeat;
  // 等比缩放，底图不变形；盒子比例与切图比例一致时等价于 100% 100%
  background-size: 100% auto;
}

/* ===== 新需求：战略联合推演中枢入口 start ===== */
// 透明热区，位置按底座盒子百分比对齐底图里的「战略联合推演中枢」文案
.home-center__deduction-entry {
  position: absolute;
  top: 1.2%;
  left: 31%;
  z-index: 30;
  width: 38%;
  height: 7.5%;
  padding: 0;
  border: 0;
  border-radius: calc(10 * var(--home-s) * 1px);
  background: transparent;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;

  &:hover,
  &:focus-visible {
    outline: none;
    background: radial-gradient(
      50% 100% at 50% 50%,
      rgba(46, 192, 255, 0.24),
      rgba(46, 192, 255, 0) 72%
    );
    box-shadow: inset 0 0 calc(26 * var(--home-s) * 1px)
      rgba(46, 192, 255, 0.38);
  }
}
/* ===== 新需求：战略联合推演中枢入口 end ===== */

// 2880 宽屏：切图 1780 × 952，底部 40px 超出画布，按 912 收进来（等比裁剪，不变形）
.home-center--wide {
  aspect-ratio: 1780 / 907;
  background-image: url("~@/asset/images/home/platform-wide.png");
}

// 1920 标准：设计稿画布 1063 × 950，底部 66px 超出画布，按 884 收进来（等比裁剪，不变形）
// 注意：坐标仍按盒高算百分比，底图特征按 950 画，图标会整体偏高约 7%
//      要严格贴合需把 y% 乘以 950/884（1.07466）
.home-center:not(.home-center--wide) {
  aspect-ratio: 1063 / 940;
  background-image: url("~@/asset/images/home/platform-base.png");
}

/* ---------- 条目聚焦 ---------- */
.home-center--focus .home-center__item {
  opacity: 0.4;
}

.home-center__item.is-actionable {
  cursor: pointer;
}

.home-center__item.is-focus {
  opacity: 1;
}

/* ---------- 词条卡片：视觉与动画走公共 styles/wordcard.scss ---------- */
.home-center__wordcard {
  margin-top: calc(var(--wordcard-lift) * var(--home-s) * -1px);
  transform: translate(-50%, -100%);
}

.home-center__ring {
  margin: 0;
  padding: 0;
  list-style: none;
}

.home-center__item {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0; // 图标与文字底板之间不留间距
  transform-origin: center center;
  transition: opacity 0.3s ease;
}

.home-center__icon {
  flex: 0 0 auto;
  object-fit: contain;
}

.home-center__item--quan .home-center__icon {
  width: calc(var(--quan-icon) * var(--home-s) * 1px);
  height: calc(var(--quan-icon) * var(--home-s) * 1px);
}

.home-center__item--ku .home-center__icon {
  width: calc(var(--ku-icon) * var(--home-s) * 1px);
  height: auto;
}

// 文字底板：宽度用底板切图的设计宽，文字居中
.home-center__label {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  color: #eafcff;
  font-size: calc(var(--label-font) * 1px);
  letter-spacing: calc(1 * var(--home-s) * 1px);
  line-height: 1;
  text-shadow: calc(2 * var(--home-s) * 1px) calc(2 * var(--home-s) * 1px)
    calc(8 * var(--home-s) * 1px) rgba(93, 158, 195, 0.75);
  white-space: nowrap;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

// 底板切图按固定尺寸渲染，不随画布缩放（字号同样是固定值）
.home-center__label--quan {
  width: calc(var(--quan-label-w) * 1px);
  height: calc(var(--quan-label-h) * 1px);
  background-image: url("~@/asset/images/home/quan-bg.png");
}

.home-center__label--ku {
  width: calc(var(--ku-label-w) * 1px);
  height: calc(var(--ku-label-h) * 1px);
  background-image: url("~@/asset/images/home/ku-bg.png");
}
</style>
