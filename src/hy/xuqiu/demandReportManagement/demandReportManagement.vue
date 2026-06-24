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
          <template slot="reportStatus" slot-scope="{ data }">
            <span :class="{ 'status-pending': data.reportStatus === '待刷新' || data.reportStatus === '生成中' }">
              {{ data.reportStatus }}
            </span>
          </template>
          <template slot="operation" slot-scope="{ data }">
            <el-button type="text" @click.stop="goStatistics(data)">报表统计</el-button>
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

    <report-statistics
      v-else-if="activeView === 'statistics'"
      :key="`statistics-${pageContext.reportId}`"
      :report-id="pageContext.reportId"
      :report-name="pageContext.reportName"
      @back="handleBack"
      @refreshed="onStatisticsRefreshed"
    />
  </section>
</template>

<script>
import reportStatistics from './reportStatistics.vue';
import {
  searchConfig,
  searchData,
  tableColumn,
  buttonsConfig
} from './config.js';
import {
  filterReportList,
  paginateList,
  refreshReportStats
} from './mockData.js';

export default {
  name: 'demandReportManagement',

  components: {
    reportStatistics
  },

  data() {
    return {
      activeView: 'list',
      pageContext: {},
      searchConfig,
      searchObj: this.m_copy(searchData),
      tableColumn,
      buttonsConfig,
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
      const filtered = filterReportList(this.searchObj);
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

    selectButtons({ id }) {
      if (id === 0) {
        const row = this.selectData[0];
        if (!row) {
          this.$message.warning('请先选择需要统计的报表');
          return;
        }
        this.goStatistics(row);
        return;
      }
      if (id === 1) {
        const filtered = filterReportList(this.searchObj);
        this.$message.success(`已按当前筛选条件导出 ${filtered.length} 条报表列表数据（模拟）`);
        return;
      }
      if (id === 2) {
        const ids = this.selectData.length
          ? this.selectData.map((item) => item.id)
          : filterReportList(this.searchObj).map((item) => item.id);
        refreshReportStats(ids);
        this.$message.success(`已刷新 ${ids.length} 份报表统计数据（模拟）`);
        this.loadTableData();
      }
    },

    goStatistics(row) {
      this.pageContext = {
        reportId: row.id,
        reportName: row.reportName
      };
      this.activeView = 'statistics';
    },

    handleBack() {
      this.activeView = 'list';
      this.pageContext = {};
      this.$nextTick(() => {
        this.loadTableData();
        this.getTableClientHeight();
      });
    },

    onStatisticsRefreshed() {
      this.loadTableData();
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

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.status-pending {
  color: #e6a23c;
}
</style>
