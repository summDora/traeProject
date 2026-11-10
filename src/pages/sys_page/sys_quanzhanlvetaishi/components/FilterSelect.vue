<!--
    大屏风格下拉（本页筛选用）
    - v-model：value / input，options: [{ key, label }]
    - 点击组件外部自动收起；视觉样式见 sys_quanzhanlvetaishi/styles/index.scss 的 .qzlt-select
    - 下拉面板用 position: fixed 脱离父级裁剪（overflow:hidden）与图表层级，避免选不中选项
-->
<template>
  <div
    ref="root"
    class="qzlt-select"
    :class="{ 'is-open': open, 'is-disabled': disabled }"
  >
    <button
      type="button"
      class="qzlt-select__trigger"
      aria-haspopup="listbox"
      :aria-expanded="String(open)"
      :disabled="disabled"
      @click="toggle"
      @keydown.esc="close"
    >
      <span class="qzlt-select__value">{{ currentLabel }}</span>
      <span class="qzlt-select__arrow" />
    </button>
    <transition name="qzlt-select-drop">
      <ul
        v-show="open"
        class="qzlt-select__panel"
        role="listbox"
        :style="panelStyle"
      >
        <li
          v-for="opt in options"
          :key="opt.key"
          class="qzlt-select__option"
          :class="{ 'is-active': opt.key === value }"
          role="option"
          :aria-selected="String(opt.key === value)"
          @click="pick(opt)"
        >
          {{ opt.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
export default {
  name: "FilterSelect",
  props: {
    value: { type: [String, Number], default: "" },
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: "请选择" },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      open: false,
      panelStyle: {},
    };
  },
  computed: {
    currentLabel() {
      const hit = this.options.find((o) => o.key === this.value);
      return hit ? hit.label : this.placeholder;
    },
  },
  watch: {
    disabled(val) {
      if (val) this.close();
    },
    options() {
      if (this.open) this.positionPanel();
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.onDocMouseDown);
    window.addEventListener("resize", this.onReposition);
    window.addEventListener("scroll", this.onReposition, true);
  },
  beforeDestroy() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
    window.removeEventListener("resize", this.onReposition);
    window.removeEventListener("scroll", this.onReposition, true);
  },
  methods: {
    toggle() {
      if (this.disabled) return;
      if (this.open) {
        this.close();
      } else {
        this.open = true;
        this.positionPanel();
      }
    },
    close() {
      this.open = false;
    },
    pick(opt) {
      this.close();
      if (opt.key !== this.value) this.$emit("input", opt.key);
    },
    /**
     * 面板按触发器位置绝对定位（fixed），脱离父级 overflow 裁剪与图表层级
     */
    positionPanel() {
      const trigger = this.$el && this.$el.querySelector(".qzlt-select__trigger");
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      // --qzlt-s 定义在 .qzlt-content 上，会继承到触发器，这里就近读取
      const scale =
        parseFloat(getComputedStyle(trigger).getPropertyValue("--qzlt-s")) || 1;
      const gap = Math.round(6 * scale);
      const minWidth = Math.round(rect.width);
      const maxWidth = Math.round(Math.max(minWidth, 220 * scale));

      let left = rect.left;
      // 贴近右边缘时改为右对齐，避免面板超出视口
      if (left + maxWidth > window.innerWidth - 8) {
        left = Math.max(8, rect.right - maxWidth);
      }
      let top = rect.bottom + gap;
      // 下方空间不足时改为向上弹出
      const panelHeight = Math.min(
        Math.round(320 * scale),
        Math.max(0, window.innerHeight - top - 8)
      );
      if (panelHeight < Math.round(120 * scale)) {
        const upTop = rect.top - gap - Math.round(320 * scale);
        if (upTop > 8) top = upTop;
      }

      this.panelStyle = {
        position: "fixed",
        left: `${left}px`,
        top: `${top}px`,
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${Math.round(320 * scale)}px`,
      };
    },
    onReposition() {
      if (this.open) this.positionPanel();
    },
    onDocMouseDown(e) {
      if (!this.open) return;
      const root = this.$refs.root;
      if (root && root.contains(e.target)) return;
      this.close();
    },
  },
};
</script>
