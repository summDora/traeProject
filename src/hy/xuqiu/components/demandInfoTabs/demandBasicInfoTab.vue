<template>
  <div class="demand-info-panel demand-basic-info-tab">
    <div class="info-grid">
      <div class="info-row">
        <span class="label">申报编号</span>
        <span class="value">{{ data.demandCode || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">需求名称</span>
        <span class="value">{{ data.demandName || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">需求来源</span>
        <span class="value">{{ data.demandSource || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">需求优先级</span>
        <span class="value">{{ data.demandPriority || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">专业分类</span>
        <span class="value">{{ data.professionalCategory || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">业务主管部门</span>
        <span class="value">{{ data.businessDepartment || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">专业大类</span>
        <span class="value">{{ data.majorCategory || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">专业小类</span>
        <span class="value">{{ data.minorCategory || '—' }}</span>
      </div>
    </div>

    <div class="desc-section">
      <div
        v-for="item in descFields"
        :key="item.key"
        class="info-row desc-row"
      >
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ data[item.key] || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const descFields = [
  { key: 'currentIssues', label: '目前存在的问题' },
  { key: 'mainWork', label: '本期主要开展工作' },
  { key: 'expectedResults', label: '预期成效' }
];

export default {
  name: 'demandBasicInfoTab',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      descFields
    };
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';

.demand-basic-info-tab {
  .value {
    color: #303133;
    flex: 1;
    min-width: 0;
  }

  .desc-section {
    margin-top: 8px;
    padding-top: 4px;
    border-top: 1px solid #ebeef5;
  }

  .desc-row {
    align-items: flex-start;
    line-height: 1.6;
    padding: 8px 0;

    .label {
      line-height: 1.6;
    }

    .value {
      line-height: 1.6;
      white-space: pre-wrap;
    }
  }
}
</style>
