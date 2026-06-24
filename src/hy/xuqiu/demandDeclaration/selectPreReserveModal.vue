<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="选择预储备库需求"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="900px"
    @closeHandle="handleClose"
  >
    <div class="modal-tip">只能选择和本批次相同投资渠道、项目分类的预储备需求</div>
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
    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import {
  preReserveSearchConfig,
  preReserveSearchData,
  preReserveTableColumn
} from './config.js';
import { filterPreReserveSelect } from './mockData.js';

export default {
  name: 'selectPreReserveModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    batchContext: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      searchConfig: preReserveSearchConfig,
      searchObj: this.m_copy(preReserveSearchData),
      tableColumn: preReserveTableColumn,
      tableData: [],
      selectData: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.searchObj = this.m_copy(preReserveSearchData);
        this.loadTableData();
      }
    }
  },

  methods: {
    loadTableData() {
      this.tableData = filterPreReserveSelect(this.searchObj, this.batchContext);
    },

    onSearch() {
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(preReserveSearchData);
      this.loadTableData();
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleConfirm() {
      if (!this.selectData.length) {
        this.$message.warning('请选择预储备库需求');
        return;
      }
      this.$emit('confirm', this.selectData);
      this.handleClose();
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
  margin-bottom: 10px;
  font-size: 13px;
}
</style>
