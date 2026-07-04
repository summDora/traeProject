<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="意见汇总"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="960px"
    :append-to-body="true"
    :modal-append-to-body="true"
    @closeHandle="handleClose"
  >
    <div class="summary-modal-body">
      <div class="demand-info-grid">
        <div class="info-item">
          <span class="label">申报编码</span>
          <span class="value">{{ formData.demandCode || '—' }}</span>
        </div>
        <div class="info-item full-width">
          <span class="label">需求名称</span>
          <span class="value">{{ formData.demandName || '—' }}</span>
        </div>
      </div>

      <div class="content-box">
        <div class="progress-header">
          <div class="section-title">评审进度</div>
          <div class="progress-legend">
            <span class="legend-item legend-opinion">仅完成意见评审</span>
            <span class="legend-item legend-done">完成评审</span>
            <span class="legend-item legend-pending">未完成评审</span>
          </div>
        </div>
        <div class="expert-progress-list">
          <span
            v-for="(expert, index) in formData.experts"
            :key="index"
            class="expert-tag"
            :class="expertStatusClass(expert.status)"
          >{{ expert.name }}</span>
        </div>

        <el-collapse v-model="activeGroups" class="group-collapse">
          <el-collapse-item
            v-for="group in formData.groups"
            :key="group.key"
            :name="group.key"
            :title="group.name"
          >
            <div class="group-section">
              <div class="section-title">评审意见</div>
              <div class="expert-opinion-list">
                <div
                  v-for="(item, index) in group.expertOpinions"
                  :key="index"
                  class="expert-opinion-row"
                >
                  <span class="expert-label">{{ item.expertName }}：</span>
                  <span class="expert-content">{{ item.opinionDesc || '—' }}</span>
                </div>
              </div>

              <div class="section-title">意见汇总</div>
              <el-input
                v-model="group.summaryOpinion"
                type="textarea"
                :rows="4"
                placeholder="请输入意见汇总"
              />

              <div class="section-title">结论</div>
              <el-radio-group v-model="group.conclusion" class="conclusion-group">
                <el-radio label="同意">同意</el-radio>
                <el-radio label="退回拆分">退回拆分</el-radio>
                <el-radio label="退回合并">退回合并</el-radio>
                <el-radio label="不同意">不同意</el-radio>
              </el-radio-group>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { getOpinionSummaryDetail, saveOpinionSummary } from './mockData.js';

export default {
  name: 'opinionSummaryModal',

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
      formData: {
        demandCode: '',
        demandName: '',
        experts: [],
        groups: []
      },
      activeGroups: []
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
      const detail = getOpinionSummaryDetail(this.demandId);
      this.formData = {
        demandCode: detail.demandCode,
        demandName: detail.demandName,
        experts: (detail.experts || []).map((item) => ({ ...item })),
        groups: (detail.groups || []).map((item) => ({ ...item }))
      };
      this.activeGroups = this.formData.groups
        .filter((item) => item.expanded !== false)
        .map((item) => item.key);
    },

    expertStatusClass(status) {
      if (status === 'completed') return 'status-done';
      if (status === 'opinionOnly') return 'status-opinion';
      return 'status-pending';
    },

    handleConfirm() {
      const emptyGroup = this.formData.groups.find((item) => !item.conclusion);
      if (emptyGroup) {
        this.$message.warning(`请选择【${emptyGroup.name}】的结论`);
        return;
      }
      saveOpinionSummary(this.demandId, this.formData.groups);
      this.$message.success('意见汇总已保存（模拟）');
      this.$emit('saved');
      this.handleClose();
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.summary-modal-body {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0 4px;
}
.demand-info-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin-bottom: 14px;
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
.content-box {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 12px 16px 4px;
}
.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.section-title {
  margin: 12px 0 8px;
  padding-left: 10px;
  border-left: 3px solid #007873;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.progress-header .section-title {
  margin: 0;
}
.progress-legend {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
}
.legend-item::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  vertical-align: middle;
}
.legend-opinion {
  color: #e6a23c;
}
.legend-opinion::before {
  background: #e6a23c;
}
.legend-done {
  color: #67c23a;
}
.legend-done::before {
  background: #67c23a;
}
.legend-pending {
  color: #303133;
}
.legend-pending::before {
  background: #303133;
}
.expert-progress-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 12px;
  padding: 0 4px;
}
.expert-tag {
  font-size: 13px;
  font-weight: 500;
}
.expert-tag.status-done {
  color: #67c23a;
}
.expert-tag.status-opinion {
  color: #e6a23c;
}
.expert-tag.status-pending {
  color: #303133;
}
.group-collapse {
  border: none;
}
.group-collapse >>> .el-collapse-item__header {
  border-bottom: 1px solid #ebeef5;
  font-size: 14px;
  font-weight: 600;
  color: #007873;
  height: 44px;
  line-height: 44px;
}
.group-collapse >>> .el-collapse-item__wrap {
  border-bottom: 1px solid #ebeef5;
}
.group-section {
  padding: 4px 0 12px;
}
.expert-opinion-list {
  margin-bottom: 4px;
}
.expert-opinion-row {
  margin-bottom: 10px;
  font-size: 13px;
  line-height: 1.7;
  color: #303133;
}
.expert-label {
  font-weight: 600;
}
.expert-content {
  white-space: pre-wrap;
  word-break: break-word;
}
.conclusion-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  padding: 4px 0 8px;
}
</style>
