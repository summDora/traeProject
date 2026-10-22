<template>
  <div class="center-view portrait-view">
    <div ref="stage" class="portrait-view__stage">
      <button
        v-for="item in layout"
        :key="item.key"
        type="button"
        class="portrait-bubble"
        :class="{ 'is-center': item.isCenter, 'is-active': item.key === activeKey }"
        :style="bubbleStyle(item)"
        :title="item.name"
        @click="activeKey = item.key"
      >
        <span class="portrait-bubble__name">{{ item.name }}</span>
      </button>
    </div>
    <!-- CARDS -->
  </div>
</template>

<script>
export default {
  name: "PortraitView",
};
</script>
