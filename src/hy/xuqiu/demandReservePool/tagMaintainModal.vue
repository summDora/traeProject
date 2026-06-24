<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="标签维护"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="520px"
    @closeHandle="handleClose"
  >
    <div class="tag-form-wrap">
      <div class="demand-tip">需求编号：{{ demandCode || '—' }}</div>
      <hyProjectForm
        :formConfig="tagFormConfig"
        :formData="formData"
        :ifInLine="false"
        labelWidth="100px"
      />
    </div>
    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { tagFormConfig, tagFormData } from './config.js';
import { getReserveDetail, updateReserveTags } from './mockData.js';

export default {
  name: 'tagMaintainModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    demandId: {
      type: String,
      default: ''
    },
    demandCode: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      tagFormConfig,
      formData: this.m_copy(tagFormData)
    };
  },

  watch: {
    visible(val) {
      if (val && this.demandId) {
        this.loadForm();
      }
    },
    demandId(val) {
      if (val && this.visible) {
        this.loadForm();
      }
    }
  },

  methods: {
    loadForm() {
      const detail = getReserveDetail(this.demandId);
      this.formData = {
        priority: detail.priority || '',
        tags: detail.tags ? detail.tags.slice() : []
      };
    },

    handleSave() {
      updateReserveTags(this.demandId, {
        priority: this.formData.priority,
        tags: this.formData.tags.slice()
      });
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
.tag-form-wrap {
  padding: 0 8px;
}
.demand-tip {
  margin-bottom: 12px;
  color: #606266;
}
</style>
