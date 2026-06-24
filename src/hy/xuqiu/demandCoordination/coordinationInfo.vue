<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="统筹信息"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="720px"
    @closeHandle="handleClose"
  >
    <div class="coordination-info-body">
      <div class="info-section">
        <div class="info-row"><span class="label">评审会结论：</span><span>{{ info.reviewConclusion || '—' }}</span></div>
        <div class="info-row"><span class="label">专家评分：</span><span>{{ info.expertScore || '—' }}</span></div>
        <div class="info-row"><span class="label">数字化部统筹分：</span><span>{{ info.digitalScore || '—' }}</span></div>
        <div class="info-row"><span class="label">统筹总分：</span><span>{{ info.totalScore || '—' }}</span></div>
        <div class="info-row"><span class="label">统筹等级：</span><span>{{ info.coordinationGrade || '—' }}</span></div>
        <div class="info-row"><span class="label">拟是否进入可研：</span><span>{{ info.proposedFeasibility || '—' }}</span></div>
      </div>

      <div class="section-title">国网统筹</div>
      <div class="info-section">
        <div class="info-row"><span class="label">统筹结果：</span><span>{{ info.gridResult || '—' }}</span></div>
        <div class="info-row"><span class="label">纳入统筹项目情况：</span><span>{{ info.gridProjectStatus || '—' }}</span></div>
        <div class="info-row"><span class="label">统筹情况说明：</span><span>{{ info.gridDescription || '—' }}</span></div>
        <div class="info-row"><span class="label">备注：</span><span>{{ info.remark || '—' }}</span></div>
      </div>

      <div class="section-title">调整记录</div>
      <div class="info-section empty-block">暂无调整记录</div>
    </div>

    <template slot="footer">
      <el-button type="primary" @click="handleClose">返回</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { getCoordinationInfo } from './mockData.js';

export default {
  name: 'coordinationInfoModal',

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
      info: {}
    };
  },

  watch: {
    visible(val) {
      if (val && this.demandId) {
        this.loadInfo();
      }
    },
    demandId(val) {
      if (val && this.visible) {
        this.loadInfo();
      }
    }
  },

  methods: {
    loadInfo() {
      this.info = getCoordinationInfo(this.demandId);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.coordination-info-body {
  padding: 0 4px;
}
.section-title {
  background: #e6f3f1;
  padding: 8px 12px;
  margin: 16px 0 8px;
  font-weight: bold;
}
.info-section {
  padding: 8px 12px;
}
.info-row {
  display: flex;
  line-height: 32px;
}
.label {
  width: 160px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}
.empty-block {
  color: #909399;
}
</style>
