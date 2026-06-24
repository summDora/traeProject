<template>
  <section>
    <xuqiu-page-header
      :title="isNew ? '新增需求' : '编辑需求'"
      :sub-title="headerSubTitle"
      @back="goBack"
    />

    <el-tabs v-model="activeTab">
      <el-tab-pane label="需求信息" name="info">
        <div class="section-title">基础信息</div>
        <div class="form-section">
          <hyNewForm
            :formConfig="editFormConfig"
            :formData="formData"
            :ifInLine="false"
            :ifSearch2="false"
          />
        </div>
        <div class="info-section info-grid">
          <div class="info-row"><span class="label">申报编号：</span><span>{{ detail.demandCode || '—' }}</span></div>
          <div class="info-row"><span class="label">申报批次：</span><span>{{ detail.batchName || '—' }}</span></div>
          <div class="info-row"><span class="label">项目类型：</span><span>{{ detail.projectType || '—' }}</span></div>
          <div class="info-row"><span class="label">需求提出部门：</span><span>{{ detail.demandDepartment || '—' }}</span></div>
          <div class="info-row"><span class="label">需求负责人：</span><span>{{ detail.demandLeader || '—' }}</span></div>
          <div class="info-row"><span class="label">完善状态：</span><span>{{ detail.completionStatus || '—' }}</span></div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="附件" name="attachment">
        <el-table :data="detail.attachments || []" border size="small">
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="文件名" min-width="180">
            <template slot-scope="scope">
              <span v-if="scope.row.required" class="required-mark">*</span>{{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="上传状态" width="120" align="center" />
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.status === '已上传'" type="text" @click="mockUpload(scope.row)">下载</el-button>
              <el-button type="text" @click="mockUpload(scope.row)">{{ scope.row.status === '已上传' ? '重传' : '上传' }}</el-button>
              <el-button v-if="scope.row.status === '已上传'" type="text" @click="mockDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="蓝图及标准功能基线库信息" name="blueprint">
        <div class="info-section">
          <div class="info-row"><span class="label">对应业务蓝图：</span><span>—</span></div>
          <div class="info-row"><span class="label">对应标准功能基线库：</span><span>—</span></div>
          <div class="empty-block">保存需求后可维护蓝图及标准功能基线信息（模拟）</div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="footer-actions">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="saveDraft">保存</el-button>
    </div>
  </section>
</template>

<script>
import { editFormConfig, editFormData } from './config.js';
import { getDeclarationDetail, updateDeclaration, createDraft } from './mockData.js';

export default {
  name: 'declarationEdit',

  props: {
    demandId: {
      type: String,
      default: ''
    },
    batchContext: {
      type: Object,
      default: () => ({})
    },
    isNew: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      activeTab: 'info',
      editFormConfig,
      formData: this.m_copy(editFormData),
      detail: {}
    };
  },

  computed: {
    headerSubTitle() {
      if (this.batchContext.batchTitle) return this.batchContext.batchTitle;
      return `${this.detail.demandCode || ''} ${this.detail.demandName || ''}`.trim() || '—';
    }
  },

  mounted() {
    this.initPage();
  },

  methods: {
    initPage() {
      if (this.isNew) {
        const batch = this.batchContext || {};
        this.detail = {
          demandCode: '保存后生成',
          batchName: batch.batchName || '—',
          projectType: batch.projectCategory || '—',
          demandDepartment: '—',
          demandLeader: '—',
          completionStatus: '待完善',
          attachments: [
            { name: '需求文档', required: true, status: '未上传' },
            { name: '需求提出依据', required: false, status: '未上传' },
            { name: '佐证材料', required: false, status: '未上传' }
          ]
        };
      } else {
        this.detail = getDeclarationDetail(this.demandId) || {};
      }
      this.formData = {
        demandName: this.detail.demandName || '',
        requirementDesc: this.detail.requirementDesc || '',
        expectedGoals: this.detail.expectedGoals || ''
      };
    },

    mockUpload(row) {
      row.status = '已上传';
      this.$message.success(`${row.name}上传成功（模拟）`);
      this.refreshCompletionStatus();
    },

    mockDelete(row) {
      row.status = '未上传';
      this.$message.success(`${row.name}已删除（模拟）`);
      this.refreshCompletionStatus();
    },

    refreshCompletionStatus() {
      const requiredDone = (this.detail.attachments || [])
        .filter((item) => item.required)
        .every((item) => item.status === '已上传');
      const fieldsDone = !!(this.formData.demandName && this.formData.requirementDesc && this.formData.expectedGoals);
      this.detail.completionStatus = requiredDone && fieldsDone ? '已完善' : '待完善';
    },

    saveDraft() {
      if (!this.formData.demandName.trim()) {
        this.$message.warning('请填写需求名称');
        return;
      }
      this.refreshCompletionStatus();
      if (this.isNew) {
        createDraft({
          batchCode: this.batchContext.batchCode,
          projectType: this.batchContext.projectCategory,
          investmentChannel: this.batchContext.investmentChannel,
          demandName: this.formData.demandName,
          requirementDesc: this.formData.requirementDesc,
          expectedGoals: this.formData.expectedGoals,
          completionStatus: this.detail.completionStatus,
          attachments: this.detail.attachments
        });
      } else {
        updateDeclaration(this.detail.id, {
          ...this.formData,
          completionStatus: this.detail.completionStatus,
          attachments: this.detail.attachments,
          demandStatus: '暂存'
        });
      }
      this.$message.success('需求保存成功（模拟）');
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
.form-section,
.info-section {
  padding: 8px 12px;
}
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 24px;
}
.info-row {
  display: flex;
  line-height: 32px;
}
.label {
  width: 120px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}
.required-mark {
  color: #f56c6c;
  margin-right: 4px;
}
.empty-block {
  color: #909399;
  padding: 12px 0;
}
.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 20px 0;
}
</style>
