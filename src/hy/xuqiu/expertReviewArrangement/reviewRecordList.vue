<template>
  <section>
    <xuqiu-page-header
      title="评审记录"
      :sub-title="subTitle"
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
        <template slot="opinionWithdraw" slot-scope="{ data }">
          <el-button
            v-if="data.canWithdraw"
            type="text"
            @click.stop="withdrawOpinion(data)"
          >撤回</el-button>
          <span v-else class="text-muted">—</span>
        </template>
        <template slot="demandStatus" slot-scope="{ data }">
          <span :class="{ 'status-closed': data.demandStatus === '已收口' }">
            {{ data.demandStatus }}
          </span>
        </template>
        <template slot="operation" slot-scope="{ data }">
          <el-button type="text" @click.stop="viewRecord(data)">查看</el-button>
        </template>
      </newTable>
      <div class="hy_two_pageBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchObj.page"
          :page-size="searchObj.rows"
          :total="tableTotal"
          :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </section>
</template>

<script>
import {
  reviewRecordSearchConfig,
  reviewRecordSearchData,
  reviewRecordTableColumn
} from './config.js';
import {
  filterReviewRecordList,
  buildReviewRecordsFromDemands,
  withdrawReviewOpinion,
  paginateList
} from './mockData.js';

export default {
  name: 'reviewRecordList',

  props: {
    contextDemands: {
      type: Array,
      default: () => []
    },
    batchContext: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      searchConfig: reviewRecordSearchConfig,
      searchObj: this.m_copy(reviewRecordSearchData),
      tableColumn: reviewRecordTableColumn,
      recordSource: [],
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      selectData: []
    };
  },

  computed: {
    subTitle() {
      if (this.batchContext.batchName) {
        return this.batchContext.batchName;
      }
      return '';
    }
  },

  mounted() {
    this.initRecordSource();
    this.loadTableData();
    this.getTableClientHeight();
    window.addEventListener('resize', this.getTableClientHeight);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.getTableClientHeight);
  },

  methods: {
    initRecordSource() {
      this.recordSource = buildReviewRecordsFromDemands(this.contextDemands);
    },

    loadTableData() {
      const filtered = filterReviewRecordList(this.searchObj, this.recordSource);
      const pageData = paginateList(filtered, this.searchObj.page, this.searchObj.rows);
      this.tableData = pageData.rows;
      this.tableTotal = pageData.total;
    },

    onSearch() {
      this.searchObj.page = 1;
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(reviewRecordSearchData);
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

    withdrawOpinion(row) {
      this.$confirm('确认撤回该条评审意见？', '提示', { type: 'warning' }).then(() => {
        const result = withdrawReviewOpinion(row.id, this.recordSource);
        if (!result.success) {
          this.$message.warning(result.message);
          return;
        }
        this.$message.success('意见撤回成功（模拟）');
        this.loadTableData();
      }).catch(() => {});
    },

    viewRecord(row) {
      this.$message.info(`查看【${row.demandCode}】评审记录详情（模拟）`);
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
.status-closed {
  color: #67c23a;
}
.text-muted {
  color: #c0c4cc;
}
</style>
