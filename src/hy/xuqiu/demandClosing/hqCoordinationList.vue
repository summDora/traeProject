<template>
  <section>
    <xuqiu-page-header
      title="总部统筹清单"
      sub-title="2025综合计划补增批次"
      @back="goBack"
    />

    <div ref="pageSearch">
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
      <hyNewButtons
        :buttonsData="buttonsConfig"
        @selectButtons="selectButtons"
        style="padding: 10px; box-sizing: border-box; justify-content: flex-start;"
      />
    </div>

    <div class="total-content_table-content-info hy-table_content" :style="{ height: tableHeight }">
      <newTable
        v-if="tableHeight"
        :height="tableHeight"
        :tableData="tableData"
        :column="tableColumn"
        :ifHaveIndex="true"
        :ifHaveCheckBox="true"
        :page="searchObj.page"
        :pageSize="searchObj.rows"
        @handleSelectionChange="handleSelectionChange"
      >
        <template slot="operation" slot-scope="{ data }">
          <el-button type="text" @click.stop="syncDemand(data)">同步需求</el-button>
          <el-button type="text" @click.stop="viewChangeRecord(data)">变更记录</el-button>
          <el-button
            v-if="data.status === '待推送'"
            type="text"
            class="danger-btn"
            @click.stop="deleteDemand(data)"
          >删除</el-button>
        </template>
      </newTable>
      <div class="hy_two_pageBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchObj.page"
          :page-size="searchObj.rows"
          :total="tableTotal"
          :page-sizes="[20, 40, 60]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </section>
</template>

<script>
import {
  hqSearchConfig,
  hqSearchData,
  hqButtonsConfig,
  hqTableColumn
} from './config.js';
import { filterHqList, paginateList } from './mockData.js';

export default {
  name: 'hqCoordinationList',

  data() {
    return {
      searchConfig: hqSearchConfig,
      searchObj: this.m_copy(hqSearchData),
      buttonsConfig: hqButtonsConfig,
      tableColumn: hqTableColumn,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      selectData: []
    };
  },

  mounted() {
    this.loadTableData();
    this.getTableClientHeight();
    window.addEventListener('resize', this.getTableClientHeight);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.getTableClientHeight);
  },

  methods: {
    loadTableData() {
      const filtered = filterHqList(this.searchObj);
      const pageData = paginateList(filtered, this.searchObj.page, this.searchObj.rows);
      this.tableData = pageData.rows;
      this.tableTotal = pageData.total;
    },

    onSearch() {
      this.searchObj.page = 1;
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(hqSearchData);
      this.loadTableData();
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    handleSizeChange(size) {
      this.searchObj.page = 1;
      this.searchObj.rows = size;
      this.loadTableData();
    },

    handleCurrentChange(page) {
      this.searchObj.page = page;
      this.loadTableData();
    },

    selectButtons({ id, text }) {
      if (!this.selectData.length) {
        this.$message.warning('请先选择需求');
        return;
      }
      this.$message.success(`${text}操作成功（模拟）`);
    },

    syncDemand(row) {
      this.$message.success(`已同步需求【${row.demandCode}】（模拟）`);
    },

    viewChangeRecord(row) {
      this.$message.info(`查看【${row.demandCode}】变更记录（模拟）`);
    },

    deleteDemand(row) {
      this.$message.success(`已删除需求【${row.demandCode}】（模拟）`);
    },

    goBack() {
      this.$emit('back');
    },

    getTableClientHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const searchH = this.$refs.pageSearch ? this.$refs.pageSearch.clientHeight : 0;
        this.tableHeight = offsetH - 72 - 48 - 40 - 56 - searchH - 36 - 20;
      });
    }
  }
};
</script>

<style scoped>
.danger-btn {
  color: #f56c6c;
}
</style>
