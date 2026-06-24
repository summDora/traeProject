<template>
  <section class="ai-check-detail">
    <xuqiu-page-header title="智能校核详情" @back="goBack" />

    <div class="section-header-row">
      <div class="section-title">需求信息</div>
      <hyNewButtons
        :buttonsData="headerButtons"
        @selectButtons="handleHeaderAction"
      />
    </div>
    <div class="info-grid">
      <div v-for="item in demandInfoItems" :key="item.label" class="info-item">
        <span class="info-label">{{ item.label }}：</span>
        <span class="info-value">{{ item.value }}</span>
      </div>
    </div>

    <div class="check-tabs">
      <div
        v-for="tab in checkTabs"
        :key="tab.key"
        class="check-tab"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <span class="tab-status" :class="statusClassMap[tab.status]">{{ tab.statusText }}</span>
      </div>
    </div>

    <div class="compare-wrap">
      <div class="compare-panel">
        <div class="panel-title">需求信息</div>
        <compare-content
          :content="systemInfo"
          :function-rows="functionRows"
          :function-column="functionColumn"
          :show-checkbox="true"
        />
      </div>
      <div class="compare-panel">
        <div class="panel-title">需求文档提取信息</div>
        <compare-content
          :content="documentInfo"
          :function-rows="documentFunctionRows"
          :function-column="functionColumn"
          :show-checkbox="false"
        />
      </div>
    </div>

    <div class="footer-actions">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </div>

    <custom-ai-check-modal
      :visible="customModalVisible"
      :demand-info="demandBrief"
      @close="customModalVisible = false"
      @confirmed="onCustomCheckConfirmed"
    />
  </section>
</template>

<script>
import customAiCheckModal from './customAiCheckModal.vue';
import compareContent from './aiCheckCompareContent.vue';
import {
  aiCheckHeaderButtons,
  aiCheckStatusClassMap,
  aiCheckFunctionColumn
} from './config.js';
import {
  getAiCheckDetail,
  runCustomAiCheck,
  runAllAiCheck
} from './mockData.js';

export default {
  name: 'aiCheckDetail',

  components: {
    customAiCheckModal,
    compareContent
  },

  props: {
    demandId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      headerButtons: aiCheckHeaderButtons,
      statusClassMap: aiCheckStatusClassMap,
      functionColumn: aiCheckFunctionColumn,
      activeTab: 'functionMapping',
      customModalVisible: false,
      demandBrief: {},
      checkTabs: [],
      systemInfo: {},
      documentInfo: {},
      functionRows: [],
      documentFunctionRows: []
    };
  },

  computed: {
    demandInfoItems() {
      return [
        { label: '申报编号', value: this.demandBrief.demandCode || '—' },
        { label: '需求名称', value: this.demandBrief.demandName || '—' },
        { label: '投资渠道', value: this.demandBrief.investmentChannel || '—' },
        { label: '项目分类', value: this.demandBrief.projectCategory || '—' }
      ];
    }
  },

  mounted() {
    this.initPage();
  },

  methods: {
    initPage() {
      const data = getAiCheckDetail(this.demandId);
      this.demandBrief = {
        demandCode: data.demandCode,
        demandName: data.demandName,
        investmentChannel: data.investmentChannel,
        projectCategory: data.projectCategory
      };
      this.checkTabs = data.checkTabs.slice();
      this.systemInfo = data.systemInfo;
      this.documentInfo = data.documentInfo;
      this.functionRows = data.functionRows.slice();
      this.documentFunctionRows = data.documentFunctionRows.slice();
      this.activeTab = 'functionMapping';
    },

    handleHeaderAction({ id }) {
      if (id === 0) {
        this.customModalVisible = true;
        return;
      }
      if (id === 1) {
        runAllAiCheck(this.demandId);
        this.checkTabs = this.checkTabs.map((tab) => ({
          ...tab,
          status: 'completed',
          statusText: '已完成'
        }));
        this.$message.success('全部校核完成（模拟）');
      }
    },

    onCustomCheckConfirmed(agentIds) {
      runCustomAiCheck(this.demandId, agentIds);
      this.customModalVisible = false;
      this.checkTabs = this.checkTabs.map((tab) => {
        if (agentIds.includes(tab.key)) {
          return { ...tab, status: 'processing', statusText: '校核中' };
        }
        return tab;
      });
      this.$message.success('自定义校核已提交（模拟）');
    },

    handleConfirm() {
      this.$message.success('智能校核确认成功（模拟）');
      this.$emit('saved');
    },

    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style scoped>
.ai-check-detail {
  padding-bottom: 24px;
}
.section-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0 0;
  padding-right: 12px;
}
.section-title {
  background: #e6f3f1;
  padding: 8px 12px;
  font-weight: bold;
  flex-shrink: 0;
}
.section-header-row /deep/ .new-buttons,
.section-header-row /deep/ .fusionButtons {
  justify-content: flex-end;
  padding: 0;
}
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
  padding: 0 12px 12px;
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
.check-tabs {
  display: flex;
  border: 1px solid #dcdfe6;
  margin: 0 12px 12px;
}
.check-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  cursor: pointer;
  border-right: 1px solid #dcdfe6;
  background: #fafafa;
}
.check-tab:last-child {
  border-right: none;
}
.check-tab.active {
  background: #fff;
  font-weight: bold;
}
.tab-label {
  color: #303133;
}
.tab-status {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 18px;
  color: #fff;
}
.status-completed {
  background: #67c23a;
}
.status-processing {
  background: #298bf5;
}
.status-pending-tab {
  background: #909399;
}
.compare-wrap {
  display: flex;
  gap: 12px;
  padding: 0 12px;
  align-items: flex-start;
}
.compare-panel {
  flex: 1;
  min-width: 0;
  border: 1px solid #dcdfe6;
}
.panel-title {
  background: #e6f3f1;
  padding: 8px 12px;
  font-weight: bold;
  text-align: center;
}
.footer-actions {
  margin-top: 24px;
  text-align: center;
}
</style>
