<template>
  <div class="compare-content">
    <div class="text-block">
      <div class="block-label">目前存在的问题</div>
      <div class="block-value">{{ content.currentProblems || '—' }}</div>
    </div>
    <div class="text-block">
      <div class="block-label">本期主要开展工作</div>
      <div class="block-value">{{ content.mainWork || '—' }}</div>
    </div>
    <div class="text-block">
      <div class="block-label">预期成效</div>
      <div class="block-value">{{ content.expectedResults || '—' }}</div>
    </div>
    <div class="meta-row">
      <span class="meta-label">对应业务蓝图：</span>
      <span>{{ content.businessBlueprint || '—' }}</span>
    </div>
    <div class="meta-row">
      <span class="meta-label">对应标准功能基线库：</span>
    </div>
    <div class="meta-sub-row">
      <span>微应用：{{ content.microApp || '—' }}</span>
      <span>一级功能：{{ content.level1Function || '—' }}</span>
    </div>

    <div class="table-block">
      <newTable
        :tableData="functionRows"
        :column="functionColumn"
        :ifHaveIndex="true"
        :ifHaveCheckBox="showCheckbox"
        height="220"
      />
    </div>

    <div class="meta-row personnel-row">
      <span class="meta-label">项目人员：</span>
      <span>{{ content.projectPersonnel || '—' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'aiCheckCompareContent',

  props: {
    content: {
      type: Object,
      default: () => ({})
    },
    functionRows: {
      type: Array,
      default: () => []
    },
    functionColumn: {
      type: Array,
      default: () => []
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.compare-content {
  padding: 12px;
}
.text-block {
  margin-bottom: 12px;
}
.block-label {
  color: #606266;
  font-weight: bold;
  margin-bottom: 4px;
}
.block-value {
  color: #303133;
  line-height: 22px;
  white-space: pre-wrap;
}
.meta-row {
  line-height: 28px;
  color: #303133;
}
.meta-label {
  color: #606266;
}
.meta-sub-row {
  display: flex;
  gap: 24px;
  padding-left: 12px;
  line-height: 28px;
  color: #303133;
  margin-bottom: 8px;
}
.table-block {
  margin: 8px 0 12px;
}
.personnel-row {
  border-top: 1px solid #ebeef5;
  padding-top: 8px;
}
</style>
