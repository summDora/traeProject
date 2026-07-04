<template>
  <div class="demand-info-panel relevance-review-panel">
    <div class="info-row level-row">
      <span class="label">关联性等级</span>
      <div class="level-tags">
        <span
          v-for="item in levelOptions"
          :key="item"
          class="level-tag"
          :class="[levelClassMap[item], { active: review.level === item }]"
        >{{ item }}</span>
      </div>
    </div>

    <div class="info-grid meta-grid">
      <div class="info-row">
        <span class="label">项目编号</span>
        <span class="value">{{ review.projectCode || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">项目名称</span>
        <span class="value">{{ review.projectName || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">前期项目编号</span>
        <span class="value">{{ review.previousProjectCode || '—' }}</span>
      </div>
      <div class="info-row">
        <span class="label">前期项目名称</span>
        <span class="value">{{ review.previousProjectName || '—' }}</span>
      </div>
    </div>

    <div
      v-for="item in compareFields"
      :key="item.key"
      class="info-row desc-row"
    >
      <span class="label">{{ item.label }}</span>
      <span class="value">{{ review[item.key] || '—' }}</span>
    </div>
  </div>
</template>

<script>
const levelOptions = ['极高', '高', '中', '无'];

const levelClassMap = {
  极高: 'level-extreme',
  高: 'level-high',
  中: 'level-medium',
  无: 'level-none'
};

const compareFields = [
  { key: 'mainArguments', label: '主要论据' },
  { key: 'contentSimilarity', label: '内容相似度' },
  { key: 'systemOverlap', label: '系统重合度' },
  { key: 'teamOverlap', label: '团队重叠性' },
  { key: 'functionSimilarity', label: '功能相似性' }
];

export default {
  name: 'demandRelevanceTab',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      levelOptions,
      levelClassMap,
      compareFields
    };
  },

  computed: {
    review() {
      return this.data.relevanceReview || {};
    }
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';

.relevance-review-panel {
  .level-row {
    margin-bottom: 12px;
  }

  .level-tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .level-tag {
    min-width: 48px;
    padding: 4px 14px;
    border-radius: 2px;
    text-align: center;
    font-size: 13px;
    color: #fff;
    opacity: 0.45;
  }

  .level-tag.active {
    opacity: 1;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  }

  .level-extreme {
    background: #8b1a1a;
  }

  .level-high {
    background: #f56c6c;
  }

  .level-medium {
    background: #e6a23c;
  }

  .level-none {
    background: #95d475;
    color: #fff;
  }

  .meta-grid {
    margin-bottom: 8px;
  }

  .desc-row {
    align-items: flex-start;
    line-height: 1.6;
    padding: 8px 0;

    .value {
      white-space: pre-wrap;
    }
  }
}
</style>
