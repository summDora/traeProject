<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="新增评审需求"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="1080px"
    @closeHandle="handleClose"
  >
    <div class="add-demand-body">
      <div class="hy-new-search-box">
        <hyProjectForm
          :formConfig="searchConfig"
          :formData="searchObj"
          :ifSearch="true"
          :isReset="true"
          @onSearch="onSearch"
          @onReset="onReset"
        />
      </div>
      <div class="search-advanced-link">
        <el-button type="text" @click="onAdvancedSearch">高级查询 →</el-button>
      </div>

      <newTable
        :height="360"
        :tableData="tableData"
        :column="tableColumn"
        :ifHaveIndex="true"
        :ifHaveCheckBox="true"
        :page="1"
        :pageSize="tableData.length || 10"
        @handleSelectionChange="handleSelectionChange"
      />
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import {
  addReviewDemandSearchConfig,
  addReviewDemandSearchData,
  addReviewDemandTableColumn
} from './config.js';
import { filterReviewDemandPool } from './mockData.js';

export default {
  name: 'addReviewDemandModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    excludeIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      searchConfig: addReviewDemandSearchConfig,
      searchObj: this.m_copy(addReviewDemandSearchData),
      tableColumn: addReviewDemandTableColumn,
      tableData: [],
      selectData: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.searchObj = this.m_copy(addReviewDemandSearchData);
        this.selectData = [];
        this.loadTableData();
      }
    },
    excludeIds() {
      if (this.visible) {
        this.loadTableData();
      }
    }
  },

  methods: {
    loadTableData() {
      this.tableData = filterReviewDemandPool(this.searchObj, undefined, {
        excludeIds: this.excludeIds
      });
    },

    onSearch() {
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(addReviewDemandSearchData);
      this.loadTableData();
    },

    onAdvancedSearch() {
      this.$message.info('高级查询功能开发中（模拟）');
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleConfirm() {
      if (!this.selectData.length) {
        this.$message.warning('请选择评审需求');
        return;
      }
      this.$emit('confirm', this.selectData.map((item) => ({ ...item })));
      this.handleClose();
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.add-demand-body {
  max-height: 70vh;
  overflow-y: auto;
}
.search-advanced-link {
  padding: 0 10px 8px;
  text-align: right;
  margin-top: -4px;
}
</style>
