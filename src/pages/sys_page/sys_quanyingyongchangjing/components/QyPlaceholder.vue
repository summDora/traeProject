<!--
 * 全应用场景 —— 素材占位块
 * 骨架阶段替代地图/图表/头图，静态素材到位后直接替换本组件用法即可
-->
<template>
  <div class="qy-placeholder" :class="`qy-placeholder--${variant}`">
    <span class="qy-placeholder__text">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: "QyPlaceholder",
  props: {
    label: { type: String, default: "素材占位" },
    // map：地图区；chart：图表区
    variant: { type: String, default: "chart" },
  },
};
</script>
