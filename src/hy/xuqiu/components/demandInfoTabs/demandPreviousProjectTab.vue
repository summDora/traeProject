<template>
  <div class="demand-info-panel">
    <div class="info-block">
      <div class="info-row">
        <span class="label">前期项目编码</span>
        <span class="value">{{ data.previousProjectCode || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">前期项目名称</span>
        <span class="value">{{ data.previousProjectName || '—' }}</span>
      </div>
      <div class="info-row block-row">
        <span class="label">情况说明</span>
        <span class="value">{{ data.previousProjectStatus || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'demandPreviousProjectTab',

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
