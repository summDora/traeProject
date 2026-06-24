<template>
  <el-dialog
    :visible="visible"
    width="720px"
    append-to-body
    :close-on-click-modal="false"
    custom-class="task-detail-dialog"
    @close="handleClose"
  >
    <div slot="title" class="dialog-title">任务详情</div>

    <div v-if="task" class="detail-body">
      <div class="detail-section">
        <div class="section-label">基本信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">任务编号</span>
            <span class="value mono">{{ task.taskId }}</span>
          </div>
          <div class="info-item">
            <span class="label">任务名称</span>
            <span class="value">{{ task.taskName }}</span>
          </div>
          <div class="info-item">
            <span class="label">任务类型</span>
            <span class="value">{{ task.taskTypeLabel }}</span>
          </div>
          <div class="info-item">
            <span class="label">来源模块</span>
            <span class="value">{{ task.sourceModule }}</span>
          </div>
          <div class="info-item">
            <span class="label">提交人</span>
            <span class="value">{{ task.submitter }}</span>
          </div>
          <div class="info-item">
            <span class="label">重试次数</span>
            <span class="value">{{ task.retryCount || 0 }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-label">执行状态</div>
        <div class="status-row">
          <span :class="['status-tag', statusClass(task.status)]">{{ task.statusLabel }}</span>
          <el-progress
            v-if="task.status === 'running' || task.status === 'pending'"
            :percentage="task.progress || 0"
            :stroke-width="10"
            style="flex: 1; max-width: 320px;"
          />
          <span v-else class="progress-text">{{ task.progress }}%</span>
        </div>
        <div v-if="task.failReason" class="fail-box">
          <div class="fail-title">失败原因</div>
          <div class="fail-reason">{{ task.failReason }}</div>
          <div v-if="task.errorCode" class="error-code">错误码：{{ task.errorCode }}</div>
        </div>
        <div v-if="task.resultSummary && task.status === 'success'" class="success-box">
          <div class="success-title">执行结果</div>
          <div>{{ task.resultSummary }}</div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-label">时间信息</div>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">提交时间</span>
            <span class="value">{{ task.createdAtText }}</span>
          </div>
          <div class="info-item">
            <span class="label">开始时间</span>
            <span class="value">{{ task.startedAtText }}</span>
          </div>
          <div class="info-item">
            <span class="label">结束时间</span>
            <span class="value">{{ task.finishedAtText }}</span>
          </div>
          <div class="info-item">
            <span class="label">耗时</span>
            <span class="value">{{ task.durationText }}</span>
          </div>
        </div>
      </div>

      <div class="detail-section">
        <div class="section-label">请求与接口</div>
        <div class="info-grid single-col">
          <div class="info-item">
            <span class="label">请求摘要</span>
            <span class="value">{{ task.requestSummary || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="label">状态查询接口</span>
            <span class="value mono">{{ task.pollUrl || '-' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button v-if="task && task.canRetry" type="warning" plain @click="$emit('retry', task)">
        重试
      </el-button>
      <el-button v-if="task && task.canCancel" type="danger" plain @click="$emit('cancel', task)">
        取消任务
      </el-button>
      <el-button @click="handleClose">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'TaskDetailDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Object,
      default: null,
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false);
    },
    statusClass(status) {
      const map = {
        pending: 'status-pending',
        running: 'status-running',
        success: 'status-success',
        failed: 'status-failed',
        cancelled: 'status-cancelled',
        timeout: 'status-timeout',
      };
      return map[status] || 'status-default';
    },
  },
};
</script>

<style scoped>
.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #667eea;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.info-grid.single-col {
  grid-template-columns: 1fr;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #909399;
}

.info-item .value {
  font-size: 14px;
  color: #303133;
  word-break: break-all;
}

.mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 13px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.progress-text {
  font-size: 14px;
  color: #606266;
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.status-pending { background: #fdf6ec; color: #e6a23c; }
.status-running { background: #ecf5ff; color: #409eff; }
.status-success { background: #f0f9eb; color: #67c23a; }
.status-failed { background: #fef0f0; color: #f56c6c; }
.status-cancelled { background: #f4f4f5; color: #909399; }
.status-timeout { background: #fef0f0; color: #f56c6c; }
.status-default { background: #f4f4f5; color: #606266; }

.fail-box {
  margin-top: 12px;
  padding: 12px;
  background: #fef0f0;
  border-radius: 6px;
  border-left: 3px solid #f56c6c;
}

.fail-title,
.success-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.fail-reason {
  font-size: 14px;
  color: #f56c6c;
  line-height: 1.6;
}

.error-code {
  margin-top: 6px;
  font-size: 12px;
  color: #909399;
  font-family: 'SFMono-Regular', Consolas, monospace;
}

.success-box {
  margin-top: 12px;
  padding: 12px;
  background: #f0f9eb;
  border-radius: 6px;
  border-left: 3px solid #67c23a;
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}
</style>
