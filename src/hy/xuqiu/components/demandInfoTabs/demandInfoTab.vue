<template>
  <div class="demand-info-panel demand-info-tab">
    <div class="info-section">
      <div class="xuqiu-section-title">基础信息</div>
      <div class="info-grid">
        <div
          v-for="field in basicGridFields"
          :key="field.key"
          class="info-row"
        >
          <span class="label">{{ field.label }}</span>
          <span class="value">{{ data[field.key] || '—' }}</span>
        </div>
      </div>
      <div
        v-for="item in basicDescFields"
        :key="item.key"
        class="info-row desc-row"
      >
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ data[item.key] || '—' }}</span>
      </div>
    </div>

    <div class="info-section">
      <div class="xuqiu-section-title">详情信息</div>
      <div
        v-for="item in detailDescFields"
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
      class="info-section"
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
        class="info-row desc-row"
      >
        <span class="label">{{ section.fullWidthField.label }}</span>
        <span class="value">{{ data[section.fullWidthField.key] || '—' }}</span>
      </div>
    </div>

    <div class="info-section">
      <div class="xuqiu-section-title">所属业务系统情况</div>
      <div class="info-row desc-row">
        <span class="label">系统情况</span>
        <span class="value">{{ data.businessSystemStatus || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
const basicGridFields = [
  { key: 'demandCode', label: '申报编号' },
  { key: 'demandName', label: '需求名称' },
  { key: 'demandSource', label: '需求来源' },
  { key: 'demandPriority', label: '需求优先级' },
  { key: 'professionalCategory', label: '专业分类' },
  { key: 'businessDepartment', label: '业务主管部门' },
  { key: 'majorCategory', label: '专业大类' },
  { key: 'minorCategory', label: '专业小类' }
];

const basicDescFields = [
  { key: 'currentIssues', label: '目前存在的问题' },
  { key: 'mainWork', label: '本期主要开展工作' },
  { key: 'expectedResults', label: '预期成效' }
];

const detailDescFields = [
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
  name: 'demandInfoTab',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      basicGridFields,
      basicDescFields,
      detailDescFields,
      gridSections
    };
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';

.demand-info-tab {
  .info-section + .info-section {
    margin-top: 4px;
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

  .info-section .info-grid {
    padding: 0 4px;
  }
}
</style>
