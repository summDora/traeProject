<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="自定义校核"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="720px"
    @closeHandle="handleClose"
  >
    <div class="modal-body">
      <div class="section-title">需求信息</div>
      <div class="info-grid">
        <div v-for="item in infoItems" :key="item.label" class="info-item">
          <span class="info-label">{{ item.label }}：</span>
          <span class="info-value">{{ item.value }}</span>
        </div>
      </div>

      <div class="table-block">
        <newTable
          :tableData="agentList"
          :column="agentColumn"
          :ifHaveIndex="true"
          :ifHaveCheckBox="true"
          height="180"
          @handleSelectionChange="handleSelectionChange"
        />
      </div>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { customAiCheckAgentColumn, customAiCheckAgents } from './config.js';

export default {
  name: 'customAiCheckModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    demandInfo: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      agentColumn: customAiCheckAgentColumn,
      agentList: customAiCheckAgents.slice(),
      selectedAgents: []
    };
  },

  computed: {
    infoItems() {
      const info = this.demandInfo || {};
      return [
        { label: '申报编号', value: info.demandCode || '—' },
        { label: '需求名称', value: info.demandName || '—' },
        { label: '投资渠道', value: info.investmentChannel || '—' },
        { label: '项目分类', value: info.projectCategory || '—' }
      ];
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.selectedAgents = [];
      }
    }
  },

  methods: {
    handleSelectionChange(val) {
      this.selectedAgents = val;
    },

    handleConfirm() {
      if (!this.selectedAgents.length) {
        this.$message.warning('请至少选择一种智能体类型');
        return;
      }
      this.$emit('confirmed', this.selectedAgents.map((item) => item.id));
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-body {
  padding: 0 8px 8px;
}
.section-title {
  color: #298bf5;
  font-weight: bold;
  margin-bottom: 12px;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  margin-bottom: 16px;
}
.info-item {
  display: flex;
  line-height: 22px;
}
.info-label {
  color: #909399;
  flex-shrink: 0;
}
.info-value {
  color: #303133;
}
.table-block {
  margin-top: 4px;
}
</style>
