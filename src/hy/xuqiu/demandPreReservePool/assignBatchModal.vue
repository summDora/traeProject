<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="分配批次"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="860px"
    @closeHandle="handleClose"
  >
    <div class="modal-tip">只能选择和本预储备需求相同投资渠道-项目分类的批次</div>

    <div class="hy-new-search-box modal-search">
      <hyProjectForm
        :formConfig="searchConfig"
        :formData="searchObj"
        :ifSearch="true"
        :isReset="true"
        @onSearch="onSearch"
        @onReset="onReset"
      />
    </div>

    <newTable
      :height="320"
      :tableData="tableData"
      :column="tableColumn"
      :ifHaveIndex="true"
      :ifHaveCheckBox="true"
      :page="1"
      :pageSize="tableData.length || 10"
      @handleSelectionChange="handleSelectionChange"
    />

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import {
  assignBatchSearchConfig,
  assignBatchSearchData,
  assignBatchTableColumn
} from './config.js';
import { getAssignableBatches } from './mockData.js';

export default {
  name: 'assignBatchModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    investmentChannel: {
      type: String,
      default: ''
    },
    projectType: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      searchConfig: assignBatchSearchConfig,
      searchObj: this.m_copy(assignBatchSearchData),
      tableColumn: assignBatchTableColumn,
      allRows: [],
      tableData: [],
      selectData: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.searchObj = this.m_copy(assignBatchSearchData);
        this.loadTableData();
      }
    },
    investmentChannel() {
      if (this.visible) this.loadTableData();
    },
    projectType() {
      if (this.visible) this.loadTableData();
    }
  },

  methods: {
    loadTableData() {
      this.allRows = getAssignableBatches(this.investmentChannel, this.projectType);
      this.applyFilter();
    },

    applyFilter() {
      let list = this.allRows.slice();
      if (this.searchObj.batchTitle) {
        list = list.filter((item) => item.batchTitle.includes(this.searchObj.batchTitle.trim()));
      }
      if (this.searchObj.batchCode) {
        list = list.filter((item) => item.batchCode === this.searchObj.batchCode);
      }
      this.tableData = list;
      this.selectData = [];
    },

    onSearch() {
      this.applyFilter();
    },

    onReset() {
      this.searchObj = this.m_copy(assignBatchSearchData);
      this.applyFilter();
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleConfirm() {
      if (!this.selectData.length) {
        this.$message.warning('请选择批次');
        return;
      }
      if (this.selectData.length > 1) {
        this.$message.warning('请仅选择一条批次');
        return;
      }
      this.$emit('confirm', this.selectData[0]);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-tip {
  color: #f56c6c;
  margin-bottom: 12px;
  font-size: 13px;
}
.modal-search {
  margin-bottom: 12px;
}
</style>
