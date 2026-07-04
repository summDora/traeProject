<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="专家指派"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="1280px"
    @closeHandle="handleClose"
  >
    <div class="assign-body">
      <div class="assign-tree">
        <el-tree
          :data="groupTree"
          node-key="id"
          :props="treeProps"
          highlight-current
          default-expand-all
          :current-node-key="activeGroupId"
          @node-click="handleGroupClick"
        />
      </div>

      <div class="assign-panel">
        <colorTitle colortext="筛选专家" :normal="false" />
        <div class="hy-new-search-box panel-search">
          <hyProjectForm
            :formConfig="candidateSearchConfig"
            :formData="candidateSearchObj"
            :ifSearch="true"
            :isReset="true"
            @onSearch="loadCandidateList"
            @onReset="onCandidateReset"
          />
        </div>
        <div class="toolbar-wrap panel-toolbar">
          <hyNewButtons
            :buttonsData="addButtonConfig"
            @selectButtons="addExperts"
          />
        </div>
        <newTable
          :tableData="candidateList"
          :column="candidateColumn"
          :ifHaveIndex="true"
          :ifHaveCheckBox="true"
          height="360"
          @handleSelectionChange="handleCandidateSelection"
        />
      </div>

      <div class="assign-panel">
        <expert-selected-panel
          :experts.sync="selectedList"
          :show-toolbar="true"
          :table-height="360"
          @change="loadCandidateList"
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
import expertSelectedPanel from './expertSelectedPanel.vue';
import {
  expertSearchConfig,
  expertSearchData,
  expertCandidateColumn
} from './config.js';
import {
  expertGroupTree,
  filterExpertPool,
  getAssignedExperts,
  saveAssignedExperts
} from './mockData.js';

export default {
  name: 'expertAssignModal',

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
      groupTree: expertGroupTree,
      treeProps: {
        children: 'children',
        label: 'label'
      },
      activeGroupId: 'all',
      candidateSearchConfig: expertSearchConfig,
      candidateSearchObj: this.m_copy(expertSearchData),
      candidateColumn: expertCandidateColumn,
      addButtonConfig: [{ id: 0, text: '添加', color: '#298BF5' }],
      candidateList: [],
      selectedList: [],
      candidateSelectData: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.initPage();
      }
    }
  },

  methods: {
    initPage() {
      this.activeGroupId = 'all';
      this.candidateSearchObj = this.m_copy(expertSearchData);
      this.candidateSelectData = [];
      this.selectedList = getAssignedExperts(this.meetingId).map((item) => ({ ...item }));
      this.loadCandidateList();
    },

    handleGroupClick(node) {
      this.activeGroupId = node.id;
      this.loadCandidateList();
    },

    loadCandidateList() {
      const selectedIds = this.selectedList.map((item) => item.id);
      this.candidateList = filterExpertPool(
        this.candidateSearchObj,
        this.activeGroupId
      ).filter((item) => !selectedIds.includes(item.id));
    },

    onCandidateReset() {
      this.candidateSearchObj = this.m_copy(expertSearchData);
      this.loadCandidateList();
    },

    handleCandidateSelection(val) {
      this.candidateSelectData = val;
    },

    addExperts() {
      if (!this.candidateSelectData.length) {
        this.$message.warning('请先选择需要添加的专家');
        return;
      }
      const existsIds = this.selectedList.map((item) => item.id);
      const toAdd = this.candidateSelectData
        .filter((item) => !existsIds.includes(item.id))
        .map((item) => ({
          ...item,
          reviewRole: '业务专家',
          expertType: '平台专家'
        }));
      this.selectedList = [...this.selectedList, ...toAdd];
      this.candidateSelectData = [];
      this.loadCandidateList();
    },

    handleConfirm() {
      if (!this.selectedList.length) {
        this.$message.warning('请至少指派一名专家');
        return;
      }
      const invalid = this.selectedList.find((item) => !item.reviewRole || !item.expertType);
      if (invalid) {
        this.$message.warning('请完善已选专家的评审角色和专家类型');
        return;
      }
      saveAssignedExperts(this.meetingId, this.selectedList);
      this.$message.success('专家指派成功（模拟）');
      this.$emit('saved');
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.assign-body {
  display: flex;
  gap: 12px;
  min-height: 520px;
}
.assign-tree {
  width: 180px;
  flex-shrink: 0;
  border: 1px solid #ebeef5;
  padding: 8px;
  overflow: auto;
}
.assign-panel {
  flex: 1;
  min-width: 0;
}
.panel-search {
  margin-bottom: 0;
}
.panel-toolbar {
  border-top: none;
}
</style>
