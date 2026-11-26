<!--
 * 中心卡片 V2 · 待接入场景占位
 * 心形图上的标签除「省域政策对比 / 政策领域对比」外，其余先占位，
 * 需求确认后在同目录新增视图，并在 CenterPanelV2 的 SCENE_VIEWS 里登记即可。
-->
<template>
  <div class="qcv2-empty">
    <div class="qcv2-empty__box">
      <span class="qcv2-empty__icon" />
      <p class="qcv2-empty__title">{{ label }}</p>
      <p class="qcv2-empty__desc">图表待接入，等待需求与数据口径确认</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "V2PlaceholderView",
  props: {
    label: { type: String, default: "" },
  },
};
</script>

<style lang="scss" scoped>
.qcv2-empty {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &__box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(14px * var(--qzlt-s, 1));
    padding: calc(50px * var(--qzlt-s, 1)) calc(70px * var(--qzlt-s, 1));
    border: 1px dashed rgba(70, 170, 210, 0.45);
    border-radius: calc(8px * var(--qzlt-s, 1));
    background: rgba(6, 30, 50, 0.35);
  }

  &__icon {
    width: calc(48px * var(--qzlt-s, 1));
    height: calc(48px * var(--qzlt-s, 1));
    border: 2px solid rgba(90, 200, 255, 0.65);
    border-radius: calc(6px * var(--qzlt-s, 1));
    background: linear-gradient(
      135deg,
      rgba(70, 200, 255, 0.35) 0%,
      rgba(10, 50, 80, 0.2) 100%
    );
  }

  &__title {
    margin: 0;
    font-size: clamp(14px, calc(24px * var(--qzlt-s, 1)), 26px);
    color: #d9f1ff;
    letter-spacing: calc(1px * var(--qzlt-s, 1));
  }

  &__desc {
    margin: 0;
    font-size: clamp(12px, calc(18px * var(--qzlt-s, 1)), 20px);
    color: rgba(170, 210, 235, 0.7);
  }
}
</style>
