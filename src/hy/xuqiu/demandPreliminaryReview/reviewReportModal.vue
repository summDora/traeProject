<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="审查报告"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="640px"
    @closeHandle="handleClose"
  >
    <div class="report-body">
      <div class="section-title">功能比对报告</div>
      <div class="report-content">{{ detail.functionCompareReport || '暂无功能比对报告' }}</div>
      <div class="section-title">关联性审查报告</div>
      <div class="report-content">{{ detail.relevanceReviewReport || '暂无关联性审查报告' }}</div>
    </div>
    <template slot="footer">
      <el-button type="primary" @click="handleClose">返回</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { getDemandDetail } from './mockData.js';

export default {
  name: 'reviewReportModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    demandId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      detail: {}
    };
  },

  watch: {
    visible(val) {
      if (val && this.demandId) {
        this.detail = getDemandDetail(this.demandId);
      }
    },
    demandId(val) {
      if (val && this.visible) {
        this.detail = getDemandDetail(this.demandId);
      }
    }
  },

  methods: {
    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.report-body {
  padding: 0 4px;
}
.section-title {
  background: #e6f3f1;
  padding: 8px 12px;
  margin: 12px 0 8px;
  font-weight: bold;
}
.section-title:first-child {
  margin-top: 0;
}
.report-content {
  padding: 8px 12px;
  line-height: 24px;
  color: #606266;
  min-height: 48px;
}
</style>
