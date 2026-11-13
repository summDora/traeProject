<!--
 * 经营性预测指标大屏「内容区」
 * 设计基准 1920；ResizeObserver 只按父容器宽度算 --jy-s，宽屏等比放大，窄屏下限 0.72
 * 不使用 transform，保证清晰度；布局用 flex 比例填充
-->
<template>
  <div ref="root" class="jy-content">
    <!-- 标题行（底图 subtitle-underline.png，纯色文字） -->
    <div class="jy-titlebar">
      <span class="jy-titlebar__title">经营指标预测</span>
      <div class="jy-titlebar__actions">
        <button type="button" class="jy-btn">
          <img :src="iconSave" alt="" /> 保存方案
        </button>
        <button type="button" class="jy-btn">
          <img :src="iconCalc" alt="" /> 运行测算
        </button>
      </div>
    </div>

    <!-- 三栏主区：左 440 / 中 960 / 右 440 -->
    <div class="jy-cols">
      <jy-left-panel class="jy-col jy-col--left" />
      <jy-center-panel class="jy-col jy-col--center" />
      <jy-right-panel class="jy-col jy-col--right" />
    </div>
  </div>
</template>

<script>
import JyLeftPanel from "./JyLeftPanel.vue";
import JyCenterPanel from "./JyCenterPanel.vue";
import JyRightPanel from "./JyRightPanel.vue";
import iconSave from "@/asset/images/jyzbyc/icon-file.png";
import iconCalc from "@/asset/images/jyzbyc/icon-calculator.png";

const DESIGN_W = 1920;
const MIN_SCALE = 0.72;
const MAX_SCALE = 2.2;

export default {
  name: "JingyingxingyuceContent",
  components: { JyLeftPanel, JyCenterPanel, JyRightPanel },
  data() {
    return {
      scale: 1,
      iconSave,
      iconCalc,
    };
  },
  mounted() {
    this.applyScale();
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => this.applyScale());
      this._ro.observe(this.$refs.root);
    }
    window.addEventListener("resize", this.applyScale);
    document.addEventListener("fullscreenchange", this.applyScale);
  },
  beforeDestroy() {
    if (this._ro) {
      this._ro.disconnect();
      this._ro = null;
    }
    window.removeEventListener("resize", this.applyScale);
    document.removeEventListener("fullscreenchange", this.applyScale);
  },
  methods: {
    applyScale() {
      const el = this.$refs.root;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, w / DESIGN_W));
      if (Math.abs(s - this.scale) < 0.0005) return;
      this.scale = s;
      el.style.setProperty("--jy-s", s);
    },
  },
};
</script>
