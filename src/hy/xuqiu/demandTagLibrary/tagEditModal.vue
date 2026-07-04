<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    :title="modalTitle"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="680px"
    :append-to-body="true"
    :modal-append-to-body="true"
    @closeHandle="handleClose"
  >
    <div class="tag-form-section">
      <hyNewForm
        ref="tagForm"
        :formConfig="formConfig"
        :formData="formData"
        :rules="tagFormRules"
        :ifInLine="false"
        :ifSearch2="false"
        label-position="right"
        label-width="100px"
      />
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { buildTagFormConfig, tagFormData, tagFormRules } from './config.js';
import { getTagDetail, getParentTagOptions, saveTag } from './mockData.js';

export default {
  name: 'tagEditModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tagId: {
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
      tagFormRules,
      formConfig: buildTagFormConfig([]),
      formData: this.m_copy(tagFormData)
    };
  },

  computed: {
    modalTitle() {
      return this.mode === 'edit' ? '编辑标签' : '新增标签';
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.initForm();
      }
    }
  },

  methods: {
    initForm() {
      this.formConfig = buildTagFormConfig(getParentTagOptions(this.mode === 'edit' ? this.tagId : ''));
      if (this.mode === 'edit' && this.tagId) {
        const detail = getTagDetail(this.tagId);
        this.formData = detail
          ? this.m_copy(detail)
          : this.m_copy(tagFormData);
        return;
      }
      this.formData = this.m_copy(tagFormData);
    },

    handleConfirm() {
      this.$refs.tagForm.$refs.form.validate((valid) => {
        if (!valid) return;
        const result = saveTag(this.m_copy(this.formData), this.mode === 'edit' ? this.tagId : '');
        if (!result.success) {
          this.$message.warning(result.message);
          return;
        }
        this.$message.success(this.mode === 'edit' ? '标签修改成功（模拟）' : '标签新增成功（模拟）');
        this.$emit('saved');
        this.handleClose();
      });
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.tag-form-section {
  padding: 0 8px;
}
.tag-form-section >>> .el-form-item__label {
  white-space: nowrap;
}
</style>
