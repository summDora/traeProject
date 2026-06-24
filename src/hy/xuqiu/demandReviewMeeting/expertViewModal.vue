<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="专家查看"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="960px"
    @closeHandle="handleClose"
  >
    <expert-selected-panel
      :experts.sync="expertList"
      :show-toolbar="false"
      :table-height="420"
    />

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import expertSelectedPanel from './expertSelectedPanel.vue';
import { getAssignedExperts, saveAssignedExperts } from './mockData.js';

export default {
  name: 'expertViewModal',

  components: {
    expertSelectedPanel
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    meetingId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      expertList: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.expertList = getAssignedExperts(this.meetingId).map((item) => ({ ...item }));
      }
    }
  },

  methods: {
    handleConfirm() {
      if (!this.expertList.length) {
        this.$message.warning('当前会议暂无专家信息');
        return;
      }
      const invalid = this.expertList.find((item) => !item.reviewRole || !item.expertType);
      if (invalid) {
        this.$message.warning('请完善专家的评审角色和专家类型');
        return;
      }
      saveAssignedExperts(this.meetingId, this.expertList);
      this.$message.success('专家信息保存成功（模拟）');
      this.$emit('saved');
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>
