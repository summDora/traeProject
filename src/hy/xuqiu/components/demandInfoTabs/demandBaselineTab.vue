<template>
  <div class="demand-info-panel">
    <div class="hy-new-search-box tab-search">
      <hyProjectForm
        :formConfig="searchConfig"
        :formData="searchObj"
        :ifSearch="true"
        :isReset="true"
        @onSearch="onSearch"
        @onReset="onReset"
      />
    </div>
    <div class="baseline-tree-wrap">
      <baseline-tree-node
        v-for="node in baselineTree"
        :key="node.label"
        :node="node"
      />
    </div>
  </div>
</template>

<script>
import baselineTreeNode from './baselineTreeNode.vue';
import { baselineSearchConfig, baselineSearchData } from './config.js';

export default {
  name: 'demandBaselineTab',

  components: {
    baselineTreeNode
  },

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      searchConfig: baselineSearchConfig,
      searchObj: this.m_copy(baselineSearchData)
    };
  },

  computed: {
    baselineTree() {
      return this.data.baselineTree || [];
    }
  },

  methods: {
    onSearch() {
      this.$emit('search', { ...this.searchObj });
    },

    onReset() {
      this.searchObj = this.m_copy(baselineSearchData);
      this.$emit('reset');
    }
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';
</style>
