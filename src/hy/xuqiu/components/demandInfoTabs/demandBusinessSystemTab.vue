<template>
  <div class="demand-info-panel">
    <div class="text-block">
      <div class="block-content">{{ data.businessSystemStatus || '—' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demandBusinessSystemTab',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';
</style>
