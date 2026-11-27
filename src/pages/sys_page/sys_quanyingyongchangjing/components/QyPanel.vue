<!--
 * 全应用场景 —— 通用面板骨架
 * 标题与参数控制台一致（青色竖条 + 青色标题），尺寸用真实像素
 * 支持传入 icon 用静态图标替代竖条；后续场景内的筛选/切换放进 #extra 插槽
-->
<template>
  <section class="qy-panel">
    <qy-p-title
      v-if="!hideHeader"
      :title="title" :icon="icon" :tag="tag" class="qy-panel__head">
      <template #extra>
        <slot name="extra" />
      </template>
    </qy-p-title>
    <div class="qy-panel__body">
      <slot />
    </div>
  </section>
</template>

<script>
import QyPTitle from "./QyPTitle.vue";

export default {
  name: "QyPanel",
  components: { QyPTitle },
  props: {
    title: { type: String, required: true },
    icon: { type: String, default: "" },
    hideHeader: { type: Boolean, default: false },
    tag: { type: String, default: "" },
  },
};
</script>