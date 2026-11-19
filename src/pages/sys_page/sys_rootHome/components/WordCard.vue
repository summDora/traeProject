<!--
 * 词条卡片（通用）：只负责「面板视觉 + 进出场动画」
 * - 定位交给调用方：外部给 class / style（.wordcard 是绝对定位的空壳）
 * - 显示隐藏交给 visible，过渡动画在组件内部，保证离场动画不被 v-if 掐断
 * - direction: 词条从哪一侧进入，四向通用
 *     bottom（默认，从下向上） / top（从上向下）
 *     left（从左向右） / right（从右向左）
 * - 尺寸与字号读取调用方的 --wordcard-* 变量，未定义时用默认值
-->
<template>
  <div class="wordcard" :class="directionClass" :style="anchorStyle">
    <transition name="wordcard">
      <div v-if="visible" class="wordcard__panel">
        <header class="wordcard__head">
          <span class="wordcard__title">{{ title }}</span>
          <span v-if="en" class="wordcard__en">{{ en }}</span>
        </header>
        <p class="wordcard__body">{{ desc }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
// 方向 → 修饰类；bottom 是默认方向，不需要修饰类
const DIRECTION_CLASS = {
  bottom: "",
  top: "wordcard--from-top",
  left: "wordcard--from-left",
  right: "wordcard--from-right",
};

export default {
  name: "WordCard",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    // 数据项：按 wordTitle / text、en、desc 取值，缺省不渲染对应部分
    item: {
      type: Object,
      default: () => ({}),
    },
    // 进入方向：bottom 从下向上（默认）/ top 从上向下 / left 从左向右 / right 从右向左
    direction: {
      type: String,
      default: "bottom",
      validator: (value) =>
        ["bottom", "top", "left", "right", "up"].includes(value),
    },
    anchorStyle: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    title() {
      return this.item.wordTitle || this.item.text || "";
    },
    en() {
      return this.item.en || "";
    },
    desc() {
      return this.item.desc || "";
    },
    directionClass() {
      // up 是旧写法，等价于 bottom
      const direction = this.direction === "up" ? "bottom" : this.direction;
      return DIRECTION_CLASS[direction] || "";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../styles/wordcard.scss";
</style>
