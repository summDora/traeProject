<template>
  <section>
    <xuqiu-page-header
      title="收口处理"
      :sub-title="`${detail.demandCode || ''} ${detail.demandName || ''}`.trim() || '—'"
      @back="goBack"
    />

    <div class="section-title">收口材料</div>
    <div class="info-section">
      <div v-for="item in materialList" :key="item.key" class="info-row">
        <span class="label">{{ item.label }}：</span>
        <span>{{ item.uploaded ? '已上传' : '待上传' }}</span>
        <el-button size="mini" type="text" @click="mockUpload(item.label)">上传</el-button>
      </div>
    </div>

    <div class="section-title">智能校核报告</div>
    <div class="info-section">
      <div v-for="item in aiReportItems" :key="item" class="info-row">
        <span class="label">{{ item }}：</span>
        <span>{{ detail.aiCheckResult || '未校核' }}</span>
      </div>
    </div>

    <div class="section-title">收口结论</div>
    <div class="form-section">
      <hyNewForm
        :formConfig="closingFormConfig"
        :formData="formData"
        :ifInLine="false"
        :ifSearch2="false"
      />
    </div>

    <div class="footer-actions">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="saveClosing">保存</el-button>
    </div>
  </section>
</template>

<script>
import { closingFormConfig, closingFormData, aiReportItems } from './config.js';
import { materialTypes } from './config.js';
import { getClosingDetail, updateClosingDetail } from './mockData.js';

export default {
  name: 'closingProcess',

  props: {
    demandId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      detail: {},
      closingFormConfig,
      formData: this.m_copy(closingFormData),
      aiReportItems,
      materialList: []
    };
  },

  mounted() {
    this.initPage();
  },

  methods: {
    initPage() {
      this.detail = getClosingDetail(this.demandId);
      this.formData = {
        closingConclusion: this.detail.closingConclusion || '',
        closingOpinion: this.detail.closingOpinion || ''
      };
      this.materialList = materialTypes.map((item) => ({
        ...item,
        uploaded: this.detail.materials ? this.detail.materials[item.key] : false
      }));
    },

    mockUpload(label) {
      this.$message.success(`${label}上传成功（模拟）`);
      this.materialList = this.materialList.map((item) => (
        item.label === label ? { ...item, uploaded: true } : item
      ));
    },

    saveClosing() {
      if (!this.formData.closingConclusion) {
        this.$message.warning('请选择收口结论');
        return;
      }
      updateClosingDetail(this.detail.id, this.formData);
      this.$message.success('收口处理保存成功');
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
.info-section,
.form-section {
  padding: 8px 12px;
}
.info-row {
  display: flex;
  align-items: center;
  line-height: 36px;
}
.label {
  width: 180px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}
.footer-actions {
  margin-top: 24px;
  text-align: right;
}
</style>
