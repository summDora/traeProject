<!--
 * 中心卡片 V2 · 下拉筛选
 * - 与 V1 的 FilterSelect 互不影响：样式写在组件内（scoped），不依赖本页 styles/index.scss 的 .qzlt-select
 * - v-model：value / input；options: [{ key, label }]
 * - 面板 position: fixed 定位，脱离父级 overflow 裁剪与图表层级；点击组件外部自动收起
 * - 尺寸统一按 --qzlt-s 缩放（该变量由 QuanzhanlvetaishiContent 写在 .qzlt-content 上，会继承下来）
-->
<template>
  <div
    ref="root"
    class="qcv2-select"
    :class="{ 'is-open': open, 'is-disabled': disabled }"
  >
    <button
      type="button"
      class="qcv2-select__trigger"
      aria-haspopup="listbox"
      :aria-expanded="String(open)"
      :disabled="disabled"
      @click="toggle"
      @keydown.esc="close"
    >
      <span class="qcv2-select__value">{{ currentLabel }}</span>
      <span class="qcv2-select__arrow" />
    </button>
    <transition name="qcv2-drop">
      <ul
        v-show="open"
        class="qcv2-select__panel"
        role="listbox"
        :style="panelStyle"
      >
        <li
          v-for="opt in options"
          :key="opt.key"
          class="qcv2-select__option"
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
  name: "V2Select",
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
    /** 面板按触发器位置绝对定位（fixed），避免被父级 overflow 裁掉 */
    positionPanel() {
      const trigger = this.$el && this.$el.querySelector(".qcv2-select__trigger");
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      const scale =
        parseFloat(getComputedStyle(trigger).getPropertyValue("--qzlt-s")) || 1;
      const gap = Math.round(6 * scale);
      const maxPanelHeight = Math.round(320 * scale);
      const minWidth = Math.round(rect.width);
      const maxWidth = Math.round(Math.max(minWidth, 220 * scale));

      let left = rect.left;
      if (left + maxWidth > window.innerWidth - 8) {
        left = Math.max(8, rect.right - maxWidth);
      }

      let top = rect.bottom + gap;
      const restHeight = window.innerHeight - top - 8;
      if (restHeight < Math.round(120 * scale)) {
        const upTop = rect.top - gap - maxPanelHeight;
        if (upTop > 8) top = upTop;
      }

      this.panelStyle = {
        position: "fixed",
        left: `${left}px`,
        top: `${top}px`,
        minWidth: `${minWidth}px`,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxPanelHeight}px`,
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

<style lang="scss" scoped>
.qcv2-select {
  display: flex;
  font-size: clamp(12px, calc(16px * var(--qzlt-s, 1)), 17px);

  &__trigger {
    display: flex;
    align-items: center;
    gap: calc(10px * var(--qzlt-s, 1));
    width: 100%;
    height: calc(34px * var(--qzlt-s, 1));
    padding: 0 calc(12px * var(--qzlt-s, 1));
    font: inherit;
    text-align: left;
    color: #d6ecff;
    border: 1px solid rgba(50, 152, 190, 0.55);
    border-radius: calc(4px * var(--qzlt-s, 1));
    background: linear-gradient(
      180deg,
      rgba(12, 48, 82, 0.85),
      rgba(5, 24, 44, 0.9)
    );
    box-shadow: inset 0 0 calc(12px * var(--qzlt-s, 1)) rgba(0, 120, 180, 0.18);
    cursor: pointer;
    transition: color 0.18s, border-color 0.18s, box-shadow 0.18s;

    &:hover {
      color: #ffffff;
      border-color: rgba(79, 200, 255, 0.8);
    }
  }

  &__value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  &__arrow {
    flex: none;
    width: calc(7px * var(--qzlt-s, 1));
    height: calc(7px * var(--qzlt-s, 1));
    border-right: 1.5px solid #63d3ff;
    border-bottom: 1.5px solid #63d3ff;
    transform: rotate(45deg);
    transition: transform 0.2s;
  }

  &.is-open {
    .qcv2-select__trigger {
      color: #ffffff;
      border-color: #4fc8ff;
      box-shadow: inset 0 0 calc(14px * var(--qzlt-s, 1)) rgba(40, 170, 235, 0.35),
        0 0 calc(10px * var(--qzlt-s, 1)) rgba(40, 170, 235, 0.28);
    }
    .qcv2-select__arrow {
      transform: rotate(-135deg);
    }
  }

  &.is-disabled .qcv2-select__trigger {
    color: rgba(160, 200, 230, 0.4);
    border-color: rgba(50, 152, 190, 0.25);
    background: rgba(6, 24, 42, 0.55);
    box-shadow: none;
    cursor: not-allowed;
  }

  &__panel {
    position: fixed;
    z-index: 2000;
    min-width: 100%;
    overflow-y: auto;
    margin: 0;
    padding: calc(5px * var(--qzlt-s, 1));
    list-style: none;
    border: 1px solid rgba(56, 168, 210, 0.7);
    border-radius: calc(4px * var(--qzlt-s, 1));
    background: linear-gradient(180deg, #062641 0%, #03131f 100%);
    box-shadow: 0 calc(8px * var(--qzlt-s, 1)) calc(20px * var(--qzlt-s, 1))
        rgba(0, 0, 0, 0.55),
      inset 0 0 calc(18px * var(--qzlt-s, 1)) rgba(0, 120, 180, 0.22);
  }

  &__option {
    display: flex;
    align-items: center;
    height: calc(34px * var(--qzlt-s, 1));
    padding: 0 calc(12px * var(--qzlt-s, 1));
    color: rgba(206, 234, 255, 0.82);
    white-space: nowrap;
    border-radius: calc(3px * var(--qzlt-s, 1));
    cursor: pointer;
    transition: color 0.15s, background 0.15s;

    & + & {
      margin-top: calc(2px * var(--qzlt-s, 1));
    }
    &:hover {
      color: #ffffff;
      background: rgba(40, 150, 200, 0.2);
    }
    &.is-active {
      color: #6fe0ff;
      background: rgba(30, 140, 200, 0.24);
      box-shadow: inset 2px 0 0 #4fc8ff;
    }
  }
}

.qcv2-drop-enter-active,
.qcv2-drop-leave-active {
  transition: opacity 0.16s, transform 0.16s;
}
.qcv2-drop-enter,
.qcv2-drop-leave-to {
  opacity: 0;
  transform: translateY(calc(-4px * var(--qzlt-s, 1)));
}
</style>
