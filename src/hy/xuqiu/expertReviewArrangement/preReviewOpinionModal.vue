<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="评审前意见查看"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="900px"
    :append-to-body="true"
    :modal-append-to-body="true"
    @closeHandle="handleClose"
  >
    <div class="opinion-modal-body">
      <div class="demand-info-grid">
        <div class="info-item">
          <span class="label">申报编号</span>
          <span class="value">{{ detail.demandCode || '—' }}</span>
        </div>
        <div class="info-item full-width">
          <span class="label">需求名称</span>
          <span class="value">{{ detail.demandName || '—' }}</span>
        </div>
      </div>

      <div class="section-title">初审意见</div>
      <div class="review-block">
        <div class="review-row">
          <span class="label">封面</span>
          <span class="value">{{ detail.preliminary.cover || '—' }}</span>
        </div>
        <div class="review-row">
          <span class="label">文档模板</span>
          <span class="value">{{ detail.preliminary.template || '—' }}</span>
        </div>
        <div class="review-row">
          <span class="label">文档内容</span>
          <span class="value">{{ detail.preliminary.content || '—' }}</span>
        </div>
        <div class="review-row block-row">
          <span class="label">意见说明</span>
          <span class="value opinion-text">{{ detail.preliminary.opinionDesc || '暂无初审意见' }}</span>
        </div>
      </div>

      <div class="section-title">专业审查意见</div>
      <div v-if="detail.professionalList && detail.professionalList.length" class="professional-list">
        <div
          v-for="(item, index) in detail.professionalList"
          :key="index"
          class="professional-item"
        >
          <div class="reviewer-name">{{ item.reviewer || '—' }}</div>
          <div class="review-row">
            <span class="label">意见</span>
            <span class="value" :class="{ 'opinion-agree': item.opinion === '同意', 'opinion-disagree': item.opinion === '不同意' }">
              {{ item.opinion || '—' }}
            </span>
          </div>
          <div class="review-row">
            <span class="label">优先级</span>
            <span class="value">{{ item.priority || '—' }}</span>
          </div>
          <div class="review-row block-row">
            <span class="label">意见说明</span>
            <span class="value opinion-text">{{ item.opinionDesc || '—' }}</span>
          </div>
        </div>
      </div>
      <div v-else class="empty-tip">暂无专业审查意见</div>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">返回</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { getPreReviewOpinions } from './mockData.js';

export default {
  name: 'preReviewOpinionModal',

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
      detail: {
        demandCode: '',
        demandName: '',
        preliminary: {},
        professionalList: []
      }
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.loadDetail();
      }
    },
    demandId() {
      if (this.visible) {
        this.loadDetail();
      }
    }
  },

  methods: {
    loadDetail() {
      this.detail = getPreReviewOpinions(this.demandId);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.opinion-modal-body {
  max-height: 68vh;
  overflow-y: auto;
  padding: 0 4px;
}
.demand-info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin-bottom: 16px;
  padding: 12px 14px;
  background: #f7f8fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}
.info-item {
  display: flex;
  align-items: flex-start;
  font-size: 13px;
  line-height: 1.6;
}
.info-item.full-width {
  width: 100%;
}
.info-item .label {
  flex-shrink: 0;
  min-width: 72px;
  color: #606266;
  white-space: nowrap;
}
.info-item .value {
  color: #303133;
  word-break: break-all;
}
.section-title {
  margin: 16px 0 10px;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.review-block,
.professional-item {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px 16px;
  background: #fff;
}
.professional-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.professional-item {
  padding-top: 10px;
}
.reviewer-name {
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
}
.review-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 1.6;
}
.review-row:last-child {
  margin-bottom: 0;
}
.review-row .label {
  flex-shrink: 0;
  min-width: 72px;
  color: #606266;
  white-space: nowrap;
}
.review-row .value {
  flex: 1;
  color: #303133;
  word-break: break-word;
}
.block-row {
  align-items: flex-start;
}
.opinion-text {
  white-space: pre-wrap;
}
.opinion-agree {
  color: #007873;
}
.opinion-disagree {
  color: #f56c6c;
}
.empty-tip {
  padding: 20px 0;
  text-align: center;
  font-size: 13px;
  color: #909399;
}
</style>
