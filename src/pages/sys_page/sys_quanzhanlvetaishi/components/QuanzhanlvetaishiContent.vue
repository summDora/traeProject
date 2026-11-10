<!--
 * 全战略态势大屏「内容区」
 * 方案 C：三栏弹性布局 + CSS 变量受控缩放（ResizeObserver 只跟父容器宽度走）
 * - 对外只认父容器：width/height 100%，不写死 100vh，方便移植
 * - 设计基准 2880，scale = clamp(宽/2880, 0.67, 1)
-->
<template>
  <div ref="root" class="qzlt-content">
    <div class="qzlt-cols">
      <left-panel class="qzlt-col qzlt-col--left"  />
      <center-panel class="qzlt-col qzlt-col--center"  />
      <right-panel class="qzlt-col qzlt-col--right"  />
    </div>
  </div>
</template>

<script>
import LeftPanel from "./LeftPanel.vue";
import CenterPanel from "./CenterPanel.vue";
import RightPanel from "./RightPanel.vue";

const DESIGN_W = 2880;
const MIN_SCALE = 0.67;
const MAX_SCALE = 1;

export default {
  name: "QuanzhanlvetaishiContent",
  components: { LeftPanel, CenterPanel, RightPanel },
  data() {
    return {
      scale: 1,
    };
  },
  mounted() {
    this.applyScale();
    if (typeof ResizeObserver !== "undefined") {
      this._ro = new ResizeObserver(() => this.applyScale());
      this._ro.observe(this.$refs.root);
    }
    // F11 / 全屏 / resize 兜底刷新（防个别浏览器 RO 时机不准）
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
    // 只按父容器宽度算比例；高度变化只交给 flex 填满，避免全屏字号乱跳
    applyScale() {
      const el = this.$refs.root;
      if (!el) return;
      const w = el.clientWidth || window.innerWidth;
      const s = Math.min(MAX_SCALE, Math.max(MIN_SCALE, w / DESIGN_W));
      if (Math.abs(s - this.scale) < 0.0005) return;
      this.scale = s;
      this.writeVars(el, s);
    },
    writeVars(el, s) {
      const px = (n) => `${n}px`;
      const scalePx = (base, floor) => Math.max(floor, Math.round(base * s));
      const vars = {
        "--qzlt-s": s,
        "--qzlt-col-gap": px(Math.max(8, Math.round(16 * s))),
        "--qzlt-v-pad": px(Math.max(10, Math.round(18 * s))),
        "--qzlt-gap": px(Math.max(8, Math.round(14 * s))),
        "--qzlt-radius": px(Math.max(4, Math.round(10 * s))),
        "--qzlt-font-xs": px(scalePx(12, 10)),
        "--qzlt-font-sm": px(scalePx(14, 11)),
        "--qzlt-font-md": px(scalePx(17, 13)),
        "--qzlt-font-lg": px(scalePx(22, 16)),
        "--qzlt-font-xl": px(scalePx(30, 20)),
      };
      Object.keys(vars).forEach((k) => el.style.setProperty(k, vars[k]));
    },
  },
};
</script>
