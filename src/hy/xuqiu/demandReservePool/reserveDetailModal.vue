<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="需求详情"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="760px"
    @closeHandle="handleClose"
  >
    <div class="detail-body">
      <div class="section-title">基本信息</div>
      <div class="info-section">
        <div class="info-row"><span class="label">需求编号：</span><span>{{ detail.demandCode || '—' }}</span></div>
        <div class="info-row"><span class="label">需求名称：</span><span>{{ detail.demandName || '—' }}</span></div>
        <div class="info-row"><span class="label">申报批次：</span><span>{{ detail.batchName || '—' }}</span></div>
        <div class="info-row"><span class="label">项目类型：</span><span>{{ detail.projectType || '—' }}</span></div>
        <div class="info-row"><span class="label">需求提出单位：</span><span>{{ detail.demandUnit || '—' }}</span></div>
        <div class="info-row"><span class="label">计划总投资：</span><span>{{ detail.totalInvestment ? `${detail.totalInvestment} 万元` : '—' }}</span></div>
        <div class="info-row"><span class="label">全流程节点：</span><span>{{ flowText }}</span></div>
      </div>

      <div class="section-title">材料清单</div>
      <div class="info-section">
        <div v-for="item in detail.materials || []" :key="item.name" class="info-row">
          <span class="label">{{ item.name }}：</span>
          <span>{{ item.status }}</span>
        </div>
        <div v-if="!(detail.materials || []).length" class="empty-block">暂无材料信息</div>
      </div>

      <div class="section-title">审查意见</div>
      <div class="info-section">
        <div class="info-row"><span class="label">评审结论：</span><span>{{ detail.reviewConclusion || '—' }}</span></div>
        <div class="info-row block-row"><span class="label">审查意见：</span><span>{{ detail.reviewOpinion || '—' }}</span></div>
      </div>

      <div class="section-title">收口结果</div>
      <div class="info-section">
        <div class="info-row"><span class="label">收口结论：</span><span>{{ detail.closingConclusion || '—' }}</span></div>
        <div class="info-row"><span class="label">统筹结果：</span><span>{{ detail.coordinationResult || '—' }}</span></div>
        <div class="info-row"><span class="label">收口时间：</span><span>{{ detail.closingTime || '—' }}</span></div>
        <div class="info-row"><span class="label">储备状态：</span><span>{{ detail.reserveStatus || '—' }}</span></div>
        <div class="info-row block-row"><span class="label">收口意见：</span><span>{{ detail.closingOpinion || '—' }}</span></div>
      </div>
    </div>

    <template slot="footer">
      <el-button type="primary" @click="handleClose">返回</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { getReserveDetail } from './mockData.js';

export default {
  name: 'reserveDetailModal',

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

  computed: {
    flowText() {
      const steps = this.detail.flowSteps || [];
      return steps.length ? steps.join(' → ') : '—';
    }
  },

  watch: {
    visible(val) {
      if (val && this.demandId) {
        this.loadDetail();
      }
    },
    demandId(val) {
      if (val && this.visible) {
        this.loadDetail();
      }
    }
  },

  methods: {
    loadDetail() {
      this.detail = getReserveDetail(this.demandId);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.detail-body {
  padding: 0 4px;
}
.section-title {
  background: #e6f3f1;
  padding: 8px 12px;
  margin: 16px 0 8px;
  font-weight: bold;
}
.section-title:first-child {
  margin-top: 0;
}
.info-section {
  padding: 8px 12px;
}
.info-row {
  display: flex;
  line-height: 32px;
}
.block-row {
  align-items: flex-start;
}
.label {
  width: 120px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}
.empty-block {
  color: #909399;
}
</style>
