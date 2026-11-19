<template>
  <section
    ref="rootHome"
    class="root-home"
    :class="[
      `root-home--${layoutMode}`,
      { 'root-home--deduction': deductionActive },
    ]"
  >
    <sys-lab-header />
    <div class="root-home__backdrop" aria-hidden="true"></div>
    <div class="root-home__ambient" aria-hidden="true"></div>

    <div ref="stage" class="root-home__stage">
      <div class="root-home__world">
        <div
          v-if="layoutMode === 'wide'"
          class="root-home__wide-decorations"
          aria-hidden="true"
        >
          <img
            class="root-home__parenthesis root-home__parenthesis--left"
            :src="parenthesesLeft"
            alt=""
          />
          <img
            class="root-home__parenthesis root-home__parenthesis--right"
            :src="parenthesesRight"
            alt=""
          />
        </div>
        <main class="root-home__content">
          <div ref="layout" class="root-home__layout" aria-label="首页内容布局">
            <section class="root-home__region root-home__region--center">
              <home-center-platform
                class="root-home__center"
                :wide="layoutMode === 'wide'"
                :deduction-entry="enableDeduction"
                @open-deduction="openDeduction"
              />
            </section>
            <div class="root-home__region root-home__region--left">
              <div class="root-home__left-stack">
                <home-search-bar
                  class="root-home__search"
                  @search="handleSearch"
                />
                <home-left-panel
                  class="root-home__left-body"
                  :wide="layoutMode === 'wide'"
                />
              </div>
              <home-research-directions
                class="root-home__directions"
                :wide="layoutMode === 'wide'"
              />
            </div>
            <section class="root-home__region root-home__region--right">
              <home-right-panel :wide="layoutMode === 'wide'" />
            </section>

            <!-- ===== 新需求：战略联合推演中枢问答 start ===== -->
            <home-deduction-chat
              v-if="enableDeduction && deductionActive"
              class="root-home__deduction"
              @back="closeDeduction"
              @submit="handleDeductionSubmit"
            />
            <!-- ===== 新需求：战略联合推演中枢问答 end ===== -->
          </div>
        </main>
        <div class="root-home__tips" aria-live="polite"></div>
      </div>
    </div>
  </section>
</template>

<script>
import SysLabHeader from "../SysLabHeader.vue";
import HomeCenterPlatform from "./components/HomeCenterPlatform.vue";
import HomeLeftPanel from "./components/HomeLeftPanel.vue";
import HomeResearchDirections from "./components/HomeResearchDirections.vue";
import HomeRightPanel from "./components/HomeRightPanel.vue";
import HomeSearchBar from "./components/HomeSearchBar.vue";
// 新需求：战略联合推演中枢问答（去掉时连同下方 data/methods/样式一起删）
import HomeDeductionChat from "./components/HomeDeductionChat.vue";
import parenthesesLeft from "@/asset/images/home/parentheses-left.png";
import parenthesesRight from "@/asset/images/home/parentheses-right.png";
import "./styles/index.scss";

// 设计稿给定的三栏宽度（不含大箭头）：1980 / 2880 两个基准之间线性插值
const COLUMNS = [
  { width: 1980, left: 712, center: 1063, right: 280 },
  { width: 2880, left: 1012, center: 1780, right: 370 },
];

// 内容区左右 padding：1920 → 28px，2880 → 140px
const PADDINGS = [
  { width: 1920, value: 28 },
  { width: 2880, value: 140 },
];

// 左侧三块卡片的宽度：1920 → 409px，2880 → 488px
const LEFT_CARDS = [
  { width: 1920, value: 409 },
  { width: 2880, value: 488 },
];

// 左栏「左侧三张卡片」与右侧内容块之间的间距：1920 → 32px，2880 → 60px
const LEFT_GAPS = [
  { width: 1920, value: 32 },
  { width: 2880, value: 60 },
];

// 检索框宽度：直接按两张设计稿量到的实际尺寸给锚点
// （≈ 整页宽度的 11%，所以中间任何页宽插值出来都是对的）
const SEARCH_W = [
  { width: 1920, value: 215 },
  { width: 2880, value: 315 },
];

// 「主要研究方向」宽度：1920 → 252px，2880 → 373px
const DIRECTIONS_W = [
  { width: 1920, value: 252 },
  { width: 2880, value: 373 },
];

// ===== 新需求：战略联合推演中枢（上线时间未定）=====
// 整段下线只需把这里改成 false，页面会回到「无入口、无问答页」的原始状态
const ENABLE_DEDUCTION = true;

// 版面最小宽度：设计稿基准 1920，视口只窄一点点时允许吸收，避免凭空出横向滚动条
const DESIGN_MIN_W = 1920;
const WIDTH_TOLERANCE = 40;
// 布局页面与视口底部预留的空隙，避免四舍五入 1px 越界而意外出滚动条
const LAYOUT_SLACK = 6;
// 中间底座允许超出可用高度的比例：底图按设计本来就裁掉底部，
// 这里多裁一点换取更大的宽度（919 视口下 1.09 ≈ 900 宽）
const CENTER_H_OVERFLOW = 1.09;

// 宽屏（2880 版式）的最小宽度：1920 屏被地址栏压扁后宽高比也会超过 2.05，
// 只用比例判定会把它误判成宽屏版式，所以再加一道宽度门槛
const WIDE_MIN_WIDTH = 2400;

// 纵向适配：视口高低于它就出纵向滚动条；不低于则靠「收窄中间底座 + 紧凑间距」放下
const MIN_VIEWPORT_H = 900;
// 可用高度（= 视口高 - 头部）低于它时启用紧凑间距
const COMPACT_BELOW = 820;

// 两侧大箭头的宽度：1920 → 390，2880 → 360（切图 760 × 1526 @2x → 逻辑 380 × 763，高度按比例自适应）
// 竖直位置不用 token：左箭头 top: 0，右栏比左模块多 30 * --home-s 的 padding，右箭头减掉即可对齐
const ARROW_W = [
  { width: 1920, value: 390 },
  { width: 2880, value: 360 },
];

// 方向卡图标尺寸：1920 → 81 × 85，2880 → 90 × 94.5
const DIR_ICON = [
  { width: 1920, w: 81, h: 85 },
  { width: 2880, w: 90, h: 94.5 },
];

// 方向卡之间的缝隙：1920 → 8px，2880 → 31px
const DIR_CARD_GAP = [
  { width: 1920, value: 8 },
  { width: 2880, value: 31 },
];

// 右栏「场景驱动」宽度：1920 → 235px，2880 → 270px
// （字号已固定，面板再按 --home-s 缩会缩到 180，卡片比字还矮）
const RIGHT_PANEL_W = [
  { width: 1920, value: 235 },
  { width: 2880, value: 270 },
];

const lerp = (from, to, t) => from + (to - from) * t;

// 按 1920 / 2880 两个基准线性插值，两端外按最近基准等比缩放
function interpolate(stops, width, key = "value") {
  const [small, large] = stops;
  if (width <= small.width) return (small[key] * width) / small.width;
  if (width >= large.width) return (large[key] * width) / large.width;
  const t = (width - small.width) / (large.width - small.width);
  return lerp(small[key], large[key], t);
}

export default {
  name: "SysRootHome",
  components: {
    SysLabHeader,
    HomeCenterPlatform,
    HomeLeftPanel,
    HomeResearchDirections,
    HomeRightPanel,
    HomeSearchBar,
    HomeDeductionChat,
  },
  data() {
    return {
      parenthesesLeft,
      parenthesesRight,
      layoutMode: "standard",
      resizeObserver: null,
      // 新需求：是否处于「战略联合推演中枢」问答页
      deductionActive: false,
      enableDeduction: ENABLE_DEDUCTION,
    };
  },
  mounted() {
    this.observeStage();
  },
  beforeDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    window.removeEventListener("resize", this.updateLayout);
  },
  methods: {
    // ===== 新需求：战略联合推演中枢 start =====
    openDeduction() {
      if (!ENABLE_DEDUCTION) return;
      this.deductionActive = true;
    },
    closeDeduction() {
      this.deductionActive = false;
    },
    handleDeductionSubmit(topic) {
      // 业务接口待定：先把议题抛出去，接入时在这里调推演接口
      if (!topic) return;
      this.$emit("deduction-submit", topic);
    },
    // ===== 新需求：战略联合推演中枢 end =====

    handleSearch(keyword) {
      this.$emit("search", keyword);
    },
    observeStage() {
      this.updateLayout();

      if (window.ResizeObserver) {
        this.resizeObserver = new window.ResizeObserver(this.updateLayout);
        this.resizeObserver.observe(this.$refs.stage);
        return;
      }

      window.addEventListener("resize", this.updateLayout);
    },
    updateLayout() {
      const stage = this.$refs.stage;
      if (!stage) return;

      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;

      const rootHome = this.$refs.rootHome;
      // 元素宽会被 min-width:1920 撑大，只能用来算缩放和分栏
      const layoutWidth = rootHome ? rootHome.clientWidth : width;
      // 布局模式按「真实视口」判定，否则 1440×900 会因被撑到 1920 而误判成 wide
      // 同时要求够宽 + 够扁：1920×919 的比例是 2.089，够扁但不够宽 → 标准版式
      const screenWidth = document.documentElement.clientWidth || width;
      const screenHeight = document.documentElement.clientHeight || height;
      const isWide =
        screenWidth >= WIDE_MIN_WIDTH && screenWidth / screenHeight >= 2.05;
      const nextMode = isWide ? "wide" : "standard";
      this.layoutMode = nextMode;

      this.applyScale(layoutWidth);
      this.applyColumns();
      this.$nextTick(this.syncVerticalFit);
    },
    // 只写间距/字号 token（2880 为基准，1920 约 0.67），不对内容做 transform 缩放
    applyScale(containerWidth) {
      const rootHome = this.$refs.rootHome;
      if (!rootHome) return;
      const scale = Math.min(1, Math.max(0.66, containerWidth / 2880));
      rootHome.style.setProperty("--home-s", scale.toFixed(3));
    },
    getColumnWidths(containerWidth) {
      const [small, large] = COLUMNS;
      const key = ["left", "center", "right"];

      if (containerWidth <= small.width) {
        const ratio = containerWidth / small.width;
        return key.map((k) => small[k] * ratio);
      }
      if (containerWidth >= large.width) {
        const ratio = containerWidth / large.width;
        return key.map((k) => large[k] * ratio);
      }

      const t = (containerWidth - small.width) / (large.width - small.width);
      return key.map((k) => lerp(small[k], large[k], t));
    },
    applyColumns() {
      const rootHome = this.$refs.rootHome;
      const layout = this.$refs.layout;
      if (!rootHome || !layout) return;

      const layoutWidth = layout.clientWidth;
      const scroller = rootHome.parentElement;
      const availW = (scroller && scroller.clientWidth) || layoutWidth;
      if (!availW) return;

      // 可用宽度只比 1920 窄十几像素（滚动条、窗口边框挤占）时，让版面吃掉这点差距，
      // 免得为了 15px 凭空出现横向滚动条；窄得多才锁定 1920 用横向滚动保设计尺寸
      const minW =
        availW < DESIGN_MIN_W && availW >= DESIGN_MIN_W - WIDTH_TOLERANCE
          ? availW
          : DESIGN_MIN_W;
      rootHome.style.setProperty("--home-min-w", `${minW}px`);

      const pageWidth = Math.max(availW, minW);

      // 设计稿的三栏规格（1980: 712/1063/280，2880: 1012/1780/370）是按整页宽度给的，
      // 用整页宽度插值，2880 下中间栏才等于底座切图原始宽 1780
      const [left, center, right] = this.getColumnWidths(pageWidth);
      // 三栏总宽大于容器宽：左右两栏各压住中间背景的一部分（对称重叠）
      const overlap = Math.max(0, (left + center + right - layoutWidth) / 2);
      const centerX = left - overlap;

      rootHome.style.setProperty("--home-left-w", `${left.toFixed(2)}px`);
      rootHome.style.setProperty("--home-center-w", `${center.toFixed(2)}px`);
      rootHome.style.setProperty("--home-center-x", `${centerX.toFixed(2)}px`);
      rootHome.style.setProperty("--home-right-w", `${right.toFixed(2)}px`);

      // 左右 padding 与左栏卡片宽度按整页宽度取 1920 / 2880 基准值
      rootHome.style.setProperty(
        "--home-pad-x",
        `${interpolate(PADDINGS, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-left-card-w",
        `${interpolate(LEFT_CARDS, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-left-gap",
        `${interpolate(LEFT_GAPS, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-search-w",
        `${interpolate(SEARCH_W, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-directions-w",
        `${interpolate(DIRECTIONS_W, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-right-panel-w",
        `${interpolate(RIGHT_PANEL_W, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-dir-gap",
        `${interpolate(DIR_CARD_GAP, pageWidth).toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-dir-icon-w",
        `${interpolate(DIR_ICON, pageWidth, "w").toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-dir-icon-h",
        `${interpolate(DIR_ICON, pageWidth, "h").toFixed(2)}px`,
      );
      rootHome.style.setProperty(
        "--home-arrow-w",
        `${interpolate(ARROW_W, pageWidth).toFixed(2)}px`,
      );
    },
    // 纵向适配：纯布局手段，不做任何缩放，字号与切图比例保持不变
    // 1) 视口高 < MIN_VIEWPORT_H：布局锁定在 900 那一版，由外层出纵向滚动条
    // 2) 900 ~ 1080：中间底座按可用高度等比收窄（不变形、保持居中）
    // 3) 更矮时收紧留白（左栏组内边距、方向卡缝隙/行高/上间距）
    syncVerticalFit() {
      const rootHome = this.$refs.rootHome;
      if (!rootHome) return;

      const regions = rootHome.querySelectorAll(".root-home__region");
      if (!regions.length) return;

      const header = rootHome.querySelector(".lab-header");
      const headerH = header ? header.offsetHeight : 0;
      const scroller = rootHome.parentElement;
      const clientH = scroller ? scroller.clientHeight : window.innerHeight;
      const availH = Math.max(0, clientH - headerH);
      // 低于 900 视口后不再继续压缩布局，锁定 900 这一版
      const layoutH = Math.max(availH, MIN_VIEWPORT_H - headerH);

      // 1) 中间底座：高度 = 宽度 × 盒子比例 + 上间距；比例必须与组件的 aspect-ratio 一致
      //    standard 1063/940，wide 1780/907
      const style = getComputedStyle(rootHome);
      const baseCenterW = parseFloat(style.getPropertyValue("--home-center-w")) || 0;
      const baseCenterX = parseFloat(style.getPropertyValue("--home-center-x")) || 0;
      const topGap = this.layoutMode === "wide" ? 0 : 20;
      const aspect = this.layoutMode === "wide" ? 907 / 1780 : 940 / 1063;
      // 底图底部本就是裁着用的，允许超出可用高度一部分换取更宽的底座；
      // 再减固定空隙，避免四舍五入 1px 越界而意外出现滚动条
      const maxCenterH = layoutH * CENTER_H_OVERFLOW;
      const maxCenterW = Math.max(0, (maxCenterH - topGap - LAYOUT_SLACK) / aspect);

      if (baseCenterW > maxCenterW) {
        rootHome.style.setProperty("--home-center-w", `${maxCenterW.toFixed(2)}px`);
        // 收窄后左移一半，视觉上保持居中
        rootHome.style.setProperty(
          "--home-center-x",
          `${(baseCenterX + (baseCenterW - maxCenterW) / 2).toFixed(2)}px`,
        );
      }

      // 2) 紧凑间距
      rootHome.classList.toggle("root-home--compact", layoutH < COMPACT_BELOW);

      // 3) 左栏「研究团队」的 7 个组在矮屏下会放不下：按实测溢出量收紧组内 padding
      //    先用常规值量一次，再由溢出量反推该用多少，避免来回抖动
      const stack = rootHome.querySelector(".root-home__left-stack");
      const leftRegion = rootHome.querySelector(".root-home__region--left");
      if (stack && leftRegion) {
        const groups =
          stack.querySelectorAll(".home-left-panel__group").length || 1;
        rootHome.style.setProperty("--home-group-pad", "12px");
        // stack 被 bottom: 0 钉在区域底，用 scrollHeight 量内容真实占用
        const overflow = Math.max(0, stack.scrollHeight - leftRegion.clientHeight);
        const pad = Math.max(
          2,
          Math.min(12, 12 - Math.ceil(overflow / (groups * 2))),
        );
        rootHome.style.setProperty("--home-group-pad", `${pad}px`);
      }

    },
  },
};
</script>
