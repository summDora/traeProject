<template>
  <section class="centralized-review">
    <xuqiu-page-header
      title="集中评审"
      :sub-title="headerSubTitle"
      @back="goBack"
    />

    <div class="review-layout">
      <div class="review-left">
        <div class="xuqiu-section-title">需求信息</div>
        <el-tabs v-model="activeTab" class="review-tabs">
          <el-tab-pane
            v-for="tab in reviewTabs"
            :key="tab.key"
            :label="tab.label"
            :name="tab.key"
          >
            <div class="tab-panel-body">
              <component
                :is="tab.component"
                :data="detail"
                @search="onBaselineSearch"
                @reset="onBaselineReset"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="review-right">
        <div class="review-form-title">评审意见</div>
        <div class="review-form-body">
          <div class="opinion-label">
            <span>我的意见：</span>
            <span class="optional-tip">非必填</span>
          </div>
          <el-input
            v-model="reviewOpinion"
            type="textarea"
            :rows="12"
            placeholder="请输入评审意见"
            resize="none"
          />
        </div>
        <div class="review-form-actions">
          <el-button @click="goBack">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确定</el-button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  demandInfoTabs,
  demandInfoTabComponents
} from '../components/demandInfoTabs';
import {
  getCentralizedReviewDetail,
  submitCentralizedReview
} from './mockData.js';

export default {
  name: 'centralizedReview',

  components: {
    ...demandInfoTabComponents
  },

  props: {
    demandId: {
      type: String,
      default: ''
    },
    batchContext: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      activeTab: 'baseline',
      reviewTabs: demandInfoTabs,
      detail: {},
      reviewOpinion: ''
    };
  },

  computed: {
    headerSubTitle() {
      const batch = this.detail.batchName || '';
      const code = this.detail.demandCode || '';
      return `${batch} 申报编号${code}`.trim();
    }
  },

  mounted() {
    this.initPage();
  },

  watch: {
    demandId() {
      this.initPage();
    }
  },

  methods: {
    initPage() {
      this.activeTab = 'baseline';
      this.reviewOpinion = '';
      this.detail = getCentralizedReviewDetail(this.demandId, this.batchContext);
    },

    onBaselineSearch() {
      this.$message.success('查询成功（模拟）');
    },

    onBaselineReset() {},

    handleConfirm() {
      submitCentralizedReview(this.demandId, { opinion: this.reviewOpinion });
      this.$message.success('集中评审提交成功（模拟）');
      this.$emit('saved');
    },

    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style scoped>
.centralized-review {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 72px);
  min-height: 560px;
  box-sizing: border-box;
}
.review-layout {
  flex: 1;
  display: flex;
  gap: 12px;
  min-height: 0;
  padding: 0 4px 12px;
  box-sizing: border-box;
}
.review-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;
  background: #fff;
  overflow: hidden;
}
.review-left .xuqiu-section-title {
  flex-shrink: 0;
}
.review-tabs {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding: 0 12px 12px;
  box-sizing: border-box;
}
.review-tabs >>> .el-tabs__header {
  margin-bottom: 8px;
}
.review-tabs >>> .el-tabs__content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
.review-tabs >>> .el-tab-pane {
  height: 100%;
}
.tab-panel-body {
  height: 100%;
  overflow: auto;
  padding-right: 4px;
}
.review-right {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid #e4e7ed;
  background: #fff;
  box-sizing: border-box;
}
.review-form-title {
  padding: 12px 16px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}
.review-form-body {
  flex: 1;
  min-height: 0;
  padding: 16px;
  display: flex;
  flex-direction: column;
}
.opinion-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  color: #303133;
}
.optional-tip {
  color: #f56c6c;
  font-size: 12px;
}
.review-form-body >>> .el-textarea,
.review-form-body >>> .el-textarea__inner {
  flex: 1;
  min-height: 200px;
}
.review-form-actions {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px 16px;
  border-top: 1px solid #ebeef5;
}
</style>
