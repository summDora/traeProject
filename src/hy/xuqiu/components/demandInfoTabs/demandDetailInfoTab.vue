<template>
  <div class="demand-info-panel demand-detail-info-tab">
    <div class="detail-main-title">详情信息</div>

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

    <div
      v-for="section in gridSections"
      :key="section.title"
      class="detail-sub-section"
    >
      <div class="xuqiu-section-title">{{ section.title }}</div>
      <div class="info-grid">
        <div
          v-for="field in section.fields"
          :key="field.key"
          class="info-row"
        >
          <span class="label">{{ field.label }}</span>
          <span class="value">{{ data[field.key] || '—' }}</span>
        </div>
      </div>
      <div
        v-if="section.fullWidthField"
        class="info-row desc-row full-width-row"
      >
        <span class="label">{{ section.fullWidthField.label }}</span>
        <span class="value">{{ data[section.fullWidthField.key] || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const descFields = [
  { key: 'demandBasis', label: '需求依据' },
  { key: 'businessPoints', label: '业务需求分点描述' },
  { key: 'businessStatus', label: '需求业务现状描述' },
  { key: 'feasibility', label: '建设可行性' },
  { key: 'applicationScope', label: '应用范围' },
  { key: 'implementationDesc', label: '本期实施功能描述' }
];

const gridSections = [
  {
    title: '前期项目情况',
    fields: [
      { key: 'previousProjectCode', label: '前期项目编码' },
      { key: 'previousProjectName', label: '前期项目名称' }
    ]
  },
  {
    title: '申报费用',
    fields: [
      { key: 'costFee', label: '成本性申报费用（万元）' },
      { key: 'capitalFee', label: '资本性申报费用（万元）' }
    ]
  },
  {
    title: '任务需求团队',
    fields: [
      { key: 'teamUnit', label: '单位（部门）名称' },
      { key: 'submitter', label: '提出人' }
    ]
  },
  {
    title: '拟承担单位',
    fields: [
      { key: 'undertakeUnit', label: '单位（部门）名称' },
      { key: 'undertakeLeader', label: '负责人' }
    ],
    fullWidthField: { key: 'teamMembers', label: '团队成员' }
  }
];

export default {
  name: 'demandDetailInfoTab',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      descFields,
      gridSections
    };
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';

.demand-detail-info-tab {
  .detail-main-title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }

  .value {
    color: #303133;
    flex: 1;
    min-width: 0;
  }

  .desc-section {
    margin-bottom: 4px;
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

  .detail-sub-section {
    margin-top: 12px;
  }

  .detail-sub-section .xuqiu-section-title {
    margin-bottom: 8px;
  }

  .detail-sub-section .info-grid {
    padding: 0 4px;
  }

  .full-width-row {
    padding: 4px 4px 0;
  }
}
</style>
