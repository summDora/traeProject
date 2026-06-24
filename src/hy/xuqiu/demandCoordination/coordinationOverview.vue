<template>
  <section>
    <xuqiu-page-header
      title="需求统筹概览"
      :sub-title="displaySubTitle"
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
      <div class="toolbar-row">
        <hyNewButtons :buttonsData="buttonsConfig" @selectButtons="selectButtons" />
        <el-button type="text" @click="exportAll">导出全部</el-button>
      </div>
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
          <el-button type="text" @click.stop="viewCoordination(data)">统筹查看</el-button>
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

    <coordinationInfo
      :visible="infoModalVisible"
      :demandId="currentDemandId"
      @close="infoModalVisible = false"
    />
  </section>
</template>

<script>
import coordinationInfo from './coordinationInfo.vue';
import {
  overviewSearchConfig,
  overviewSearchData,
  overviewButtonsConfig,
  overviewTableColumn
} from './config.js';
import { getOverviewList, paginateList } from './mockData.js';

export default {
  name: 'coordinationOverview',

  props: {
    batchCode: {
      type: String,
      default: ''
    },
    batchName: {
      type: String,
      default: ''
    },
    planYear: {
      type: [String, Number],
      default: ''
    }
  },

  components: {
    coordinationInfo
  },

  data() {
    return {
      searchConfig: overviewSearchConfig,
      searchObj: this.m_copy(overviewSearchData),
      buttonsConfig: overviewButtonsConfig,
      tableColumn: overviewTableColumn,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      selectData: [],
      infoModalVisible: false,
      currentDemandId: ''
    };
  },

  computed: {
    displaySubTitle() {
      return this.planYear ? `${this.planYear}${this.batchName}` : this.batchName;
    }
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
      const filtered = getOverviewList(this.batchCode || this.batchName, this.searchObj);
      const pageData = paginateList(filtered, this.searchObj.page, this.searchObj.rows);
      this.tableData = pageData.rows;
      this.tableTotal = pageData.total;
    },

    onSearch() {
      this.searchObj.page = 1;
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(overviewSearchData);
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
      if (id === 1 && !this.selectData.length) {
        this.$message.warning('请先选择需要调整的需求');
        return;
      }
      this.$message.success(`${text}操作成功（模拟）`);
    },

    exportAll() {
      const filtered = getOverviewList(this.batchCode || this.batchName, this.searchObj);
      this.$message.success(`导出全部 ${filtered.length} 条数据（模拟）`);
    },

    viewCoordination(row) {
      this.currentDemandId = row.id;
      this.infoModalVisible = true;
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

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.toolbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px 10px;
  border: 1px solid rgba(34, 39, 52, 0.15);
  border-top: none;
}
</style>
