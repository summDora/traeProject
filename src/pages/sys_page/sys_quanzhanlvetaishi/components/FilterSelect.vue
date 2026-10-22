<!--
 * 大屏风格下拉（本页筛选用）
 * - v-model：value / input，options: [{ key, label }]
 * - 点击组件外部自动收起；视觉样式见 sys_quanzhanlvetaishi/styles/index.scss 的 .qzlt-select
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
      <ul v-show="open" class="qzlt-select__panel" role="listbox">
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
    return { open: false };
  },
  computed: {
    currentLabel() {
      const hit = this.options.find((o) => o.key === this.value);
      return hit ? hit.label : this.placeholder;
    },
  },
  watch: {
    disabled(val) {
      if (val) this.open = false;
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.onDocMouseDown);
  },
  beforeDestroy() {
    document.removeEventListener("mousedown", this.onDocMouseDown);
  },
  methods: {
    toggle() {
      if (this.disabled) return;
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
    pick(opt) {
      this.open = false;
      if (opt.key !== this.value) this.$emit("input", opt.key);
    },
    onDocMouseDown(e) {
      if (!this.open) return;
      const root = this.$refs.root;
      if (root && !root.contains(e.target)) this.close();
    },
  },
};
</script>
