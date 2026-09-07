<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    :title="modalTitle"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="920px"
    :append-to-body="true"
    :modal-append-to-body="true"
    @closeHandle="handleClose"
  >
    <div class="select-func-body">
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
  level1SelectSearchConfig,
  level1SelectSearchData,
  level1SelectTableColumn,
  level2SelectSearchConfig,
  level2SelectSearchData,
  level2SelectTableColumn
} from './config.js';
import { filterLevel1Pool, filterLevel2Pool } from './blueprintMockData.js';

export default {
  name: 'selectBaselineFunctionModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selectType: {
      type: String,
      default: 'level1'
    },
    level1PoolId: {
      type: String,
      default: ''
    },
    excludePoolIds: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      searchObj: this.m_copy(level1SelectSearchData),
      tableData: [],
      selectData: []
    };
  },

  computed: {
    modalTitle() {
      return this.selectType === 'level1' ? '选择一级功能' : '选择二级功能';
    },
    searchConfig() {
      return this.selectType === 'level1' ? level1SelectSearchConfig : level2SelectSearchConfig;
    },
    tableColumn() {
      return this.selectType === 'level1' ? level1SelectTableColumn : level2SelectTableColumn;
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.resetSearch();
        this.selectData = [];
        this.loadTableData();
      }
    }
  },

  methods: {
    resetSearch() {
      this.searchObj = this.m_copy(
        this.selectType === 'level1' ? level1SelectSearchData : level2SelectSearchData
      );
    },

    loadTableData() {
      if (this.selectType === 'level1') {
        this.tableData = filterLevel1Pool(this.searchObj, this.excludePoolIds);
        return;
      }
      this.tableData = filterLevel2Pool(
        this.level1PoolId,
        this.searchObj,
        this.excludePoolIds
      );
    },

    onSearch() {
      this.loadTableData();
    },

    onReset() {
      this.resetSearch();
      this.loadTableData();
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleConfirm() {
      if (!this.selectData.length) {
        this.$message.warning('请至少选择一条数据');
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

<style scoped>
.select-func-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
