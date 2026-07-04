<template>
  <div class="demand-info-panel">
    <div class="info-block">
      <div class="info-row">
        <span class="label">对应业务蓝图</span>
        <span class="value">{{ data.blueprintName || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">对应标准功能基线库</span>
        <span class="value">{{ data.baselineName || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demandBlueprintTab',

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

.demand-info-panel .value {
  color: #303133;
  flex: 1;
  min-width: 0;
}
</style>
