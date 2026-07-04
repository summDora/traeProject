<template>
  <section>
    <template v-if="activeView === 'list'">
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
      </div>

      <div class="total-content_table-content-info hy-table_content" :style="{ height: tableHeight }">
        <newTable
          v-if="tableHeight"
          :height="tableHeight"
          :tableData="tableData"
          :column="tableColumn"
          :ifHaveIndex="true"
          :ifHaveCheckBox="false"
          :page="searchObj.page"
          :pageSize="searchObj.rows"
        >
          <template slot="operation" slot-scope="{ data }">
            <el-button type="text" @click.stop="goManage(data)">统筹管理</el-button>
            <el-button type="text" @click.stop="goOverview(data)">统筹概览</el-button>
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
    </template>

    <coordination-manage
      v-else-if="activeView === 'manage'"
      :key="`manage-${pageContext.batchCode}`"
      :batch-code="pageContext.batchCode"
      :batch-name="pageContext.batchName"
      :plan-year="pageContext.planYear"
      @back="handleBack"
    />

    <coordination-overview
      v-else-if="activeView === 'overview'"
      :key="`overview-${pageContext.batchCode}`"
      :batch-code="pageContext.batchCode"
      :batch-name="pageContext.batchName"
      :plan-year="pageContext.planYear"
      @back="handleBack"
    />
  </section>
</template>

<script>
import coordinationManage from './coordinationManage.vue';
import coordinationOverview from './coordinationOverview.vue';
import { searchConfig, searchData, tableColumn } from './config.js';
import { filterBatchList, paginateList } from './mockData.js';

export default {
  name: 'demandCoordination',

  components: {
    coordinationManage,
    coordinationOverview
  },

  data() {
    return {
      activeView: 'list',
      pageContext: {},
      searchConfig,
      searchObj: this.m_copy(searchData),
      tableColumn,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0
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
      const filtered = filterBatchList(this.searchObj);
      const pageData = paginateList(filtered, this.searchObj.page, this.searchObj.rows);
      this.tableData = pageData.rows;
      this.tableTotal = pageData.total;
    },

    onSearch() {
      this.searchObj.page = 1;
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(searchData);
      this.loadTableData();
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

    openPage(view, row) {
      this.pageContext = {
        batchCode: row.batchCode,
        batchName: row.batchName,
        planYear: row.planYear
      };
      this.activeView = view;
    },

    goManage(row) {
      this.openPage('manage', row);
    },

    goOverview(row) {
      this.openPage('overview', row);
    },

    handleBack() {
      this.activeView = 'list';
      this.pageContext = {};
      this.$nextTick(() => {
        this.loadTableData();
        this.getTableClientHeight();
      });
    },

    getTableClientHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const searchH = this.$refs.pageSearch ? this.$refs.pageSearch.clientHeight : 0;
        this.tableHeight = offsetH - 72 - 48 - 40 - searchH - 36 - 30 - 3;
      });
    }
  }
};
</script>

