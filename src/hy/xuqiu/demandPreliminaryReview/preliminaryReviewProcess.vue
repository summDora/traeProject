<template>
  <section>
    <xuqiu-page-header
      :title="readonly ? '初审详情' : '初审审核'"
      :sub-title="`${detail.demandCode || ''} ${detail.demandName || ''}`.trim() || '—'"
      @back="goBack"
    />

    <div class="section-title">基础信息</div>
    <div class="info-section">
      <div class="info-row"><span class="label">需求名称：</span><span>{{ detail.demandName || '—' }}</span></div>
      <div class="info-row"><span class="label">项目类型：</span><span>{{ detail.projectType || '—' }}</span></div>
      <div class="info-row"><span class="label">申报批次：</span><span>{{ detail.batchName || '—' }}</span></div>
      <div class="info-row"><span class="label">计划总投资：</span><span>{{ detail.totalInvestment ? `${detail.totalInvestment} 万元` : '—' }}</span></div>
      <div class="info-row"><span class="label">需求提出单位：</span><span>{{ detail.demandUnit || '—' }}</span></div>
      <div class="info-row"><span class="label">业务主管部门：</span><span>{{ detail.businessDepartment || '—' }}</span></div>
    </div>

    <div class="section-title">申报材料</div>
    <div class="info-section">
      <div v-for="item in detail.materials || []" :key="item.name" class="info-row">
        <span class="label">{{ item.name }}：</span>
        <span>{{ item.status }}</span>
      </div>
    </div>

    <div class="section-title">功能比对结果</div>
    <div class="info-section">
      <div class="info-row"><span class="label">比对状态：</span><span>{{ detail.functionCompareResult || '—' }}</span></div>
      <div class="info-row block-row"><span class="label">比对报告：</span><span>{{ detail.functionCompareReport || '暂无报告' }}</span></div>
    </div>

    <div class="section-title">关联性审查结果</div>
    <div class="info-section">
      <div class="info-row"><span class="label">审查状态：</span><span>{{ detail.relevanceReviewResult || '—' }}</span></div>
      <div class="info-row block-row"><span class="label">审查报告：</span><span>{{ detail.relevanceReviewReport || '暂无报告' }}</span></div>
    </div>

    <template v-if="!readonly">
      <div class="section-title">初审结论</div>
      <div class="form-section">
        <hyNewForm
          :formConfig="reviewFormConfig"
          :formData="formData"
          :ifInLine="false"
          :ifSearch2="false"
        />
      </div>
      <div class="footer-actions">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="submitReview">提交</el-button>
      </div>
    </template>
  </section>
</template>

<script>
import { reviewFormConfig, reviewFormData } from './config.js';
import { getDemandDetail, updatePreliminaryReview } from './mockData.js';

export default {
  name: 'preliminaryReviewProcess',

  props: {
    demandId: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      detail: {},
      reviewFormConfig,
      formData: this.m_copy(reviewFormData)
    };
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
      this.detail = getDemandDetail(this.demandId);
      this.formData = {
        preliminaryConclusion: this.detail.preliminaryConclusion || '',
        preliminaryOpinion: this.detail.preliminaryOpinion || ''
      };
    },

    submitReview() {
      if (!this.formData.preliminaryConclusion) {
        this.$message.warning('请选择初审结论');
        return;
      }
      if (this.formData.preliminaryConclusion === '驳回' && !this.formData.preliminaryOpinion.trim()) {
        this.$message.warning('驳回时需填写初审意见');
        return;
      }
      updatePreliminaryReview(this.detail.id, this.formData);
      this.$message.success('初审提交成功（模拟）');
      this.$emit('saved');
    },

    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style scoped>
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
.form-section {
  padding: 8px 12px;
}
.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}
</style>
