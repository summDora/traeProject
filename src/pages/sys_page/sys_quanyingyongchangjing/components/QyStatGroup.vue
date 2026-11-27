<!--
 * 全应用场景 —— 指标卡组骨架（园区区块用）
 * 三列固定布局，左侧静态图标 + 标签 / 数值
-->
<template>
  <ul class="qy-stats">
    <li v-for="item in items" :key="item.label" class="qy-stat">
      <img v-if="item.icon" :src="item.icon" alt="" class="qy-stat__icon">
      <div class="qy-stat__meta">
        <p class="qy-stat__label">{{ item.label }}</p>
        <p class="qy-stat__value">
          <em>{{ item.value }}</em>
          <i v-if="item.unit">{{ item.unit }}</i>
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "QyStatGroup",
  props: {
    items: { type: Array, default: () => [] },
  },
};
</script>
