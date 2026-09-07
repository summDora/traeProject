<template>
  <!-- 大标题 -->
  <div v-if="!sub" class="section-title">
    <span class="section-title__text">{{ title }}</span>
    <a v-if="more" class="section-title__more" href="javascript:;">更多 &gt;</a>
  </div>
  <!-- 小标题：文字 + dot + line -->
  <div v-else class="section-title section-title--sub">
    <div class="section-title__row">
      <span class="section-title__text">{{ title }}</span>
      <span class="section-title__dot" />
    </div>
    <div class="section-title__line" />
  </div>
</template>

<script>
export default {
  name: 'CockpitSectionTitle',
  props: {
    title: { type: String, required: true },
    more: { type: Boolean, default: false },
    sub: { type: Boolean, default: false }
  }
}
</script>

<style scoped lang="scss">
@import './styles/section-title.scss';
</style>
