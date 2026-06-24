<template>
  <section>
    <xuqiu-page-header
      title="预储备需求编辑"
      :sub-title="`${detail.demandCode || ''} ${detail.demandName || ''}`.trim() || '—'"
      @back="goBack"
    />

    <div class="section-title">需求申报内容</div>
    <div class="sub-section-title">基础信息</div>
    <div class="info-section info-grid">
      <div class="info-row"><span class="label">需求名称：</span><span>{{ detail.demandName || '—' }}</span></div>
      <div class="info-row"><span class="label">业务主管部门：</span><span>{{ detail.businessDepartment || '—' }}</span></div>
      <div class="info-row"><span class="label">预储备计划批次：</span><span>{{ detail.preReserveBatch || '—' }}</span></div>
      <div class="info-row"><span class="label">需求优先级(部门)：</span><span>{{ detail.deptPriority || '—' }}</span></div>
      <div class="info-row"><span class="label">业务需求类别：</span><span>{{ detail.businessCategory || '—' }}</span></div>
    </div>

    <div class="sub-section-title">需求详情信息</div>
    <div class="info-section info-grid">
      <div class="info-row"><span class="label">计划总投资(万元)：</span><span>{{ detail.totalInvestment || '—' }}</span></div>
      <div class="info-row"><span class="label">需求负责人：</span><span>{{ detail.demandLeader || '—' }}</span></div>
      <div class="info-row"><span class="label">需求提出部门：</span><span>{{ detail.demandDepartment || '—' }}</span></div>
      <div class="info-row full-row"><span class="label">备注：</span><span>{{ detail.remark || '—' }}</span></div>
      <div class="info-row full-row block-row"><span class="label">业务需求描述：</span><span>{{ detail.requirementDesc || '—' }}</span></div>
      <div class="info-row full-row block-row"><span class="label">预期目标及成效：</span><span class="pre-line">{{ detail.expectedGoals || '—' }}</span></div>
    </div>

    <div class="section-title">关联项目情况</div>
    <div class="table-section">
      <el-table :data="detail.relatedProjects || []" border size="small">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="projectCode" label="项目编号" min-width="120" />
        <el-table-column prop="projectName" label="项目名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="constructionUnit" label="建设单位" min-width="120" />
        <el-table-column label="项目状态" width="100" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.statusClass">{{ scope.row.projectStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成效评价结果" width="120" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.effectClass">{{ scope.row.effectResult }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="section-title">查重结果</div>
    <div class="info-section dup-section">
      <span class="dup-value">{{ detail.duplicateResult || '—' }}</span>
    </div>

    <div class="section-title">编辑操作</div>
    <div class="form-section">
      <hyNewForm
        :formConfig="editFormConfig"
        :formData="formData"
        :ifInLine="false"
        :ifSearch2="false"
      />
      <div class="tag-row">
        <span class="label">需求标签：</span>
        <el-tag
          v-for="tag in formData.tags"
          :key="tag"
          closable
          size="small"
          @close="removeTag(tag)"
        >{{ tag }}</el-tag>
        <el-select
          v-model="newTag"
          placeholder="添加标签"
          size="small"
          clearable
          style="width: 160px"
          @change="addTag"
        >
          <el-option
            v-for="item in availableTags"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </div>
    </div>

    <div class="footer-actions">
      <el-button type="danger" @click="handleInvalidate">移除作废</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </section>
</template>

<script>
import { editFormConfig, editFormData } from './config.js';
import { getPreReserveDetail, updatePreReserveEdit, invalidatePreReserve, tagOptions } from './mockData.js';

export default {
  name: 'preReserveEdit',

  props: {
    demandId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      detail: {},
      editFormConfig,
      formData: this.m_copy(editFormData),
      newTag: '',
      tagOptions
    };
  },

  computed: {
    availableTags() {
      return this.tagOptions.filter((tag) => !this.formData.tags.includes(tag));
    }
  },

  mounted() {
    this.loadDetail();
  },

  watch: {
    demandId() {
      this.loadDetail();
    }
  },

  methods: {
    loadDetail() {
      this.detail = getPreReserveDetail(this.demandId);
      this.formData = {
        editRemark: this.detail.editRemark || '',
        priority: this.detail.priority || '1',
        tags: [...(this.detail.tags || [])]
      };
    },

    addTag(tag) {
      if (!tag || this.formData.tags.includes(tag)) {
        this.newTag = '';
        return;
      }
      this.formData.tags.push(tag);
      this.newTag = '';
    },

    removeTag(tag) {
      this.formData.tags = this.formData.tags.filter((item) => item !== tag);
    },

    handleSave() {
      updatePreReserveEdit(this.detail.id, {
        editRemark: this.formData.editRemark,
        priority: this.formData.priority,
        tags: [...this.formData.tags]
      });
      this.$message.success('保存成功！');
      this.$emit('saved');
    },

    handleInvalidate() {
      this.$confirm('确认移除作废该预储备需求？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        invalidatePreReserve(this.detail.id);
        this.$message.success('已移除作废');
        this.$emit('saved');
      }).catch(() => {});
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
.sub-section-title {
  padding: 4px 12px;
  color: #606266;
  font-weight: bold;
}
.info-section,
.form-section,
.table-section {
  padding: 8px 12px;
}
.info-grid {
  display: flex;
  flex-wrap: wrap;
}
.info-row {
  display: flex;
  width: 33.33%;
  line-height: 32px;
  min-width: 280px;
}
.full-row {
  width: 100%;
}
.block-row {
  align-items: flex-start;
}
.label {
  width: 140px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}
.pre-line {
  white-space: pre-line;
}
.dup-section {
  display: flex;
  align-items: center;
}
.dup-value {
  font-weight: bold;
  font-size: 16px;
}
.tag-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-left: 12px;
}
.status-review { color: #409eff; }
.status-build { color: #e6a23c; }
.status-done { color: #67c23a; }
.footer-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 24px 0;
}
</style>
