<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="选择模板"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="760px"
    :append-to-body="true"
    :modal-append-to-body="true"
    @closeHandle="handleClose"
  >
    <div class="select-template-body">
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
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import {
  selectTemplateSearchConfig,
  selectTemplateSearchData,
  selectTemplateTableColumn
} from './config.js';
import { filterTemplatePool } from './mockData.js';

export default {
  name: 'selectTemplateModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchConfig: selectTemplateSearchConfig,
      searchObj: this.m_copy(selectTemplateSearchData),
      tableColumn: selectTemplateTableColumn,
      tableData: [],
      selectData: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.searchObj = this.m_copy(selectTemplateSearchData);
        this.selectData = [];
        this.loadTableData();
      }
    }
  },

  methods: {
    loadTableData() {
      this.tableData = filterTemplatePool(this.searchObj);
    },

    onSearch() {
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(selectTemplateSearchData);
      this.loadTableData();
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleConfirm() {
      if (!this.selectData.length) {
        this.$message.warning('请选择模板');
        return;
      }
      if (this.selectData.length > 1) {
        this.$message.warning('仅可选择一条模板');
        return;
      }
      this.$emit('confirm', { ...this.selectData[0] });
      this.handleClose();
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.select-template-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
