<template>
  <section class="template-edit-page">
    <xuqiu-page-header
      :title="pageTitle"
      :sub-title="subTitle"
      @back="goBack"
    />

    <div class="edit-layout" :style="layoutStyle">
      <div class="edit-left" :style="panelStyle">
        <div class="panel-title">字段配置</div>
        <div class="base-form-wrap">
          <hyNewForm
            ref="baseForm"
            :formConfig="baseFormConfig"
            :formData="baseFormData"
            :ifInLine="false"
            :ifSearch2="false"
            label-position="right"
            label-width="110px"
          />
        </div>

        <div v-if="!readOnly" class="select-template-row">
          <el-button type="primary" size="small" @click="openSelectTemplate">选择模板</el-button>
        </div>

        <div ref="fieldTableWrap" class="field-table-wrap">
          <newTable
            v-if="fieldTableHeight"
            :height="fieldTableHeight"
            :tableData="fieldList"
            :column="fieldTableColumn"
            :ifHaveIndex="true"
            :ifHaveCheckBox="false"
            :page="1"
            :pageSize="fieldList.length || 10"
          >
            <template slot="listDisplay" slot-scope="{ data }">
              <i v-if="data.locked" class="el-icon-lock lock-icon" title="固定显示" />
              <el-switch
                v-else
                v-model="data.listDisplay"
                :disabled="readOnly"
                active-color="#13c2c2"
              />
            </template>
          </newTable>
        </div>

        <div v-if="!readOnly" class="edit-actions">
          <el-button type="text" @click="restoreDefault">恢复默认</el-button>
          <el-button type="primary" @click="saveConfig">保存配置</el-button>
        </div>
      </div>

      <div class="edit-right" :style="panelStyle">
        <div class="panel-title">字段预览</div>
        <div class="preview-form">
          <el-form label-position="right" label-width="120px" size="small">
            <el-row :gutter="16">
              <el-col
                v-for="field in fieldList"
                :key="field.id"
                :span="field.previewSpan || 24"
              >
                <el-form-item :required="field.required">
                  <span slot="label">{{ field.fieldName }}</span>
                  <el-input
                    v-if="field.fieldType === '单行文本'"
                    :placeholder="`请输入${field.fieldName}`"
                    disabled
                  />
                  <el-select
                    v-else-if="field.fieldType === '下拉选择'"
                    :placeholder="`请选择${field.fieldName}`"
                    disabled
                    style="width: 100%"
                  />
                  <el-input
                    v-else
                    type="textarea"
                    :rows="3"
                    :placeholder="`请输入${field.fieldName}`"
                    disabled
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </div>

    <select-template-modal
      :visible="selectModalVisible"
      @confirm="handleTemplateSelected"
      @close="selectModalVisible = false"
    />
  </section>
</template>

<script>
import selectTemplateModal from './selectTemplateModal.vue';
import {
  templateBaseFormConfig,
  templateBaseFormData,
  fieldTableColumn
} from './config.js';
import {
  defaultFieldList,
  getTemplateDetail,
  getTemplatePoolItem,
  saveTemplate
} from './mockData.js';

export default {
  name: 'templateEdit',

  components: {
    selectTemplateModal
  },

  props: {
    templateId: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'add'
    }
  },

  data() {
    return {
      baseFormConfig: templateBaseFormConfig,
      baseFormData: this.m_copy(templateBaseFormData),
      fieldTableColumn,
      fieldList: [],
      selectModalVisible: false,
      layoutHeight: 0,
      fieldTableHeight: 0
    };
  },

  computed: {
    readOnly() {
      return this.mode === 'detail';
    },

    pageTitle() {
      if (this.mode === 'detail') return '模板详情';
      if (this.mode === 'edit') return '模板编辑';
      return '需求模板新建';
    },

    subTitle() {
      return this.baseFormData.templateName || '—';
    },

    layoutStyle() {
      if (!this.layoutHeight) return null;
      return { minHeight: `${this.layoutHeight}px` };
    },

    panelStyle() {
      if (!this.layoutHeight) return null;
      return { minHeight: `${this.layoutHeight}px` };
    }
  },

  watch: {
    fieldList: {
      handler() {
        this.updateLayoutHeight();
      },
      deep: true
    }
  },

  created() {
    this.initPage();
  },

  mounted() {
    this.updateLayoutHeight();
    window.addEventListener('resize', this.updateLayoutHeight);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.updateLayoutHeight);
  },

  methods: {
    updateLayoutHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const topChrome = 72 + 48 + 40 + 36 + 30 + 3;
        const headerEl = this.$el && this.$el.querySelector('.xuqiu-page-header');
        const headerH = headerEl ? headerEl.offsetHeight : 48;
        this.layoutHeight = Math.max(offsetH - topChrome - headerH - 12, 320);
        this.$nextTick(() => {
          const wrap = this.$refs.fieldTableWrap;
          this.fieldTableHeight = wrap ? Math.max(wrap.clientHeight, 160) : 0;
        });
      });
    },
    initPage() {
      if (this.templateId) {
        const detail = getTemplateDetail(this.templateId);
        if (!detail) {
          this.$message.warning('模板不存在');
          this.goBack();
          return;
        }
        this.baseFormData = {
          templateName: detail.templateName,
          investmentChannel: detail.investmentChannel,
          projectCategory: detail.projectCategory
        };
        this.fieldList = this.m_copy(detail.fields || defaultFieldList());
        return;
      }

      this.baseFormData = this.m_copy(templateBaseFormData);
      this.fieldList = this.m_copy(defaultFieldList());
    },

    openSelectTemplate() {
      this.selectModalVisible = true;
    },

    handleTemplateSelected(row) {
      const poolItem = getTemplatePoolItem(row.id);
      if (!poolItem) {
        this.$message.warning('模板数据不存在');
        return;
      }
      this.fieldList = this.m_copy(poolItem.fields || defaultFieldList());
      this.$message.success(`已载入模板「${poolItem.templateName}」的字段配置`);
      this.updateLayoutHeight();
    },

    restoreDefault() {
      this.$confirm('确认恢复为默认字段配置？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fieldList = this.m_copy(defaultFieldList());
        this.$message.success('已恢复默认配置');
        this.updateLayoutHeight();
      }).catch(() => {});
    },

    saveConfig() {
      if (!this.baseFormData.templateName) {
        this.$message.warning('请填写申报模板名称');
        return;
      }
      if (!this.baseFormData.investmentChannel) {
        this.$message.warning('请选择投资渠道');
        return;
      }
      if (!this.baseFormData.projectCategory) {
        this.$message.warning('请选择项目分类');
        return;
      }

      const payload = {
        templateName: this.baseFormData.templateName,
        investmentChannel: this.baseFormData.investmentChannel,
        projectCategory: this.baseFormData.projectCategory,
        fields: this.m_copy(this.fieldList)
      };

      const result = saveTemplate(
        payload,
        this.mode === 'edit' ? this.templateId : ''
      );

      if (!result.success) {
        this.$message.warning(result.message);
        return;
      }

      this.$message.success(this.mode === 'edit' ? '保存成功！' : '新建成功！');
      this.$emit('saved', result.id);
    },

    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style scoped>
.template-edit-page {
  min-height: 100%;
  box-sizing: border-box;
}

.edit-layout {
  display: flex;
  align-items: stretch;
  gap: 16px;
  padding: 0 12px 12px;
  box-sizing: border-box;
}

.edit-left,
.edit-right {
  flex: 1;
  min-width: 0;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.edit-left {
  overflow: hidden;
}

.edit-right {
  overflow: hidden;
}

.panel-title {
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #13c2c2;
}

.base-form-wrap {
  flex-shrink: 0;
  margin-bottom: 8px;
}

.select-template-row {
  flex-shrink: 0;
  margin-bottom: 12px;
}

.field-table-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.lock-icon {
  color: #909399;
  font-size: 16px;
}

.edit-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f0f0f0;
}

.preview-form {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 8px;
}

.preview-form >>> .el-form-item__label::before {
  color: #f56c6c;
}
</style>
