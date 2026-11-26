<!--
 * 中心卡片 V2 · 顶部三张指标卡（首页与「量化目标」页共用）
 * - 点击任意一张都进入量化目标明细（标题统一为「量化目标」）
 * - 只吃父容器宽度，尺寸按 --qzlt-s 缩放
-->
<template>
  <div class="qcv2-stats">
    <button
      v-for="item in items"
      :key="item.key"
      type="button"
      class="qcv2-stat"
      @click="$emit('pick', item)"
    >
      <span class="qcv2-stat__icon">
        <img :src="item.icon" alt="" />
      </span>
      <span class="qcv2-stat__text">
        <span class="qcv2-stat__label">{{ item.label }}</span>
        <span class="qcv2-stat__value">
          {{ display(item.value) }}<em class="qcv2-stat__unit">{{ item.unit }}</em>
        </span>
      </span>
    </button>
  </div>
</template>

<script>
export default {
  name: "V2StatCards",
  props: {
    /** [{ key, label, value, unit, icon }] */
    items: { type: Array, default: () => [] },
  },
  methods: {
    display(value) {
      if (typeof value !== "number") return value;
      return value.toLocaleString("en-US");
    },
  },
};
</script>

<style lang="scss" scoped>
.qcv2-stats {
  display: flex;
  gap: calc(24px * var(--qzlt-s, 1));
  flex: none;
}

.qcv2-stat {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: calc(22px * var(--qzlt-s, 1));
  height: calc(148px * var(--qzlt-s, 1));
  padding: 0 calc(26px * var(--qzlt-s, 1));
  font: inherit;
  text-align: left;
  border: 1px solid rgba(64, 176, 224, 0.42);
  border-radius: calc(10px * var(--qzlt-s, 1));
  background: linear-gradient(
    180deg,
    rgba(9, 40, 70, 0.72) 0%,
    rgba(4, 20, 38, 0.72) 100%
  );
  box-shadow: inset 0 0 calc(26px * var(--qzlt-s, 1)) rgba(0, 120, 180, 0.16);
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;

  &:hover {
    border-color: rgba(90, 210, 255, 0.85);
    box-shadow: inset 0 0 calc(30px * var(--qzlt-s, 1)) rgba(0, 160, 220, 0.32),
      0 0 calc(16px * var(--qzlt-s, 1)) rgba(40, 170, 235, 0.28);
    transform: translateY(calc(-2px * var(--qzlt-s, 1)));
  }

  &__icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(84px * var(--qzlt-s, 1));
    height: calc(84px * var(--qzlt-s, 1));
    border-radius: 50%;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: calc(6px * var(--qzlt-s, 1));
    min-width: 0;
  }

  &__label {
    font-size: clamp(13px, calc(23px * var(--qzlt-s, 1)), 25px);
    color: #dcefff;
    letter-spacing: calc(1px * var(--qzlt-s, 1));
    white-space: nowrap;
  }

  &__value {
    font-family: "DIN Alternate", "Bebas Neue", "Microsoft YaHei", sans-serif;
    font-size: clamp(22px, calc(42px * var(--qzlt-s, 1)), 46px);
    font-weight: 700;
    line-height: 1;
    color: #ffffff;
    text-shadow: 0 0 calc(14px * var(--qzlt-s, 1)) rgba(90, 200, 255, 0.55);
    white-space: nowrap;
  }

  &__unit {
    margin-left: calc(6px * var(--qzlt-s, 1));
    font-size: clamp(12px, calc(18px * var(--qzlt-s, 1)), 20px);
    font-style: normal;
    font-weight: 400;
    color: #b9dcf5;
  }
}
</style>
