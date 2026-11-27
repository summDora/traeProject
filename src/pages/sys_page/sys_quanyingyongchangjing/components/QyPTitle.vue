<!--
 * 全应用场景 —— 面板标题
 * 默认：青色竖条 + 青色标题文字（同参数控制台 jy-ptitle）
 * 传 icon 时：用静态图标替代竖条（如绿电直连 / 零碳园区）
 * 尺寸使用真实像素，不做 calc 缩放
-->
<template>
  <div class="qy-ptitle" :class="{ 'qy-ptitle--icon': icon }">
    <img v-if="icon" :src="icon" alt="" class="qy-ptitle__icon" />
    <span class="qy-ptitle__text">{{ title }}</span>
    <span v-if="sub" class="qy-ptitle__sub">{{ sub }}</span>
    <span v-if="tag" class="qy-ptitle__tag">{{ tag }}</span>
    <div class="qy-ptitle__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script>
export default {
  name: "QyPTitle",
  props: {
    title: { type: String, required: true },
    // 前置静态图标，传入后替代左侧青色竖条
    icon: { type: String, default: "" },
    // 标题右侧的浅色说明文字
    sub: { type: String, default: "" },
    // 右侧描边角标
    tag: { type: String, default: "" },
  },
};
</script>
