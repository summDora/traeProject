<!--
 * 全应用场景 —— 小标题
 * 视觉与柱状图标题一致（dot-cyan 图标 + 白色文字），可带右侧描边角标
-->
<template>
  <div class="qy-subtitle">
    <img v-if="icon" :src="icon" alt="" class="qy-subtitle__icon">
    <span class="qy-subtitle__text">{{ title }}</span>
    <span v-if="tag" class="qy-subtitle__tag">{{ tag }}</span>
  </div>
</template>

<script>
export default {
  name: "QySubtitle",
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: "" },
    tag: { type: String, default: "" },
  },
};
</script>
