<template>
  <section>
    <xuqiu-page-header
      v-if="showBack"
      :title="pageTitle"
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
      <hyNewButtons
        :buttonsData="buttonsConfig"
        @selectButtons="selectButtons"
        style="padding: 10px; box-sizing: border-box; justify-content: flex-start; flex-wrap: wrap;"
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
        <template slot="functionCompareResult" slot-scope="{ data }">
          <el-button
            v-if="data.functionCompareResult === '已完成'"
            type="text"
            @click.stop="viewReport(data)"
          >{{ data.functionCompareResult }}</el-button>
          <span v-else>{{ data.functionCompareResult }}</span>
        </template>
        <template slot="relevanceReviewResult" slot-scope="{ data }">
          <el-button
            v-if="data.relevanceReviewResult === '已完成'"
            type="text"
            @click.stop="viewReport(data)"
          >{{ data.relevanceReviewResult }}</el-button>
          <span v-else>{{ data.relevanceReviewResult }}</span>
        </template>
        <template slot="preliminaryStatus" slot-scope="{ data }">
          <span :class="{ 'status-pending': data.preliminaryStatus === '待初审' || data.preliminaryStatus === '初审中' }">
            {{ data.preliminaryStatus }}
          </span>
        </template>
        <template slot="operation" slot-scope="{ data }">
          <el-button type="text" @click.stop="goBlueprint(data)">蓝图</el-button>
          <el-button
            v-if="isPendingReview(data)"
            type="text"
            @click.stop="goReview(data)"
          >初审</el-button>
          <el-button
            v-if="isProcessed(data)"
            type="text"
            @click.stop="goDetail(data)"
          >详情</el-button>
          <el-button
            v-if="data.hasReport"
            type="text"
            @click.stop="viewReport(data)"
          >查看报告</el-button>
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

    <review-report-modal
      :visible="reportVisible"
      :demand-id="currentDemandId"
      @close="reportVisible = false"
    />
  </section>
</template>

<script>
import reviewReportModal from './reviewReportModal.vue';
import {
  listSearchConfig,
  listSearchData,
  listTableColumn,
  mainButtonsConfig,
  classifyButtonsConfig
} from './config.js';
import {
  filterDemandList,
  paginateList,
  runFunctionCompare,
  runRelevanceReview
} from './mockData.js';

export default {
  name: 'preliminaryReviewList',

  components: {
    reviewReportModal
  },

  props: {
    showBack: {
      type: Boolean,
      default: true
    },
    pageTitle: {
      type: String,
      default: '初审列表'
    },
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

  data() {
    const searchObj = this.m_copy(listSearchData);
    if (this.batchCode) searchObj.batchCode = this.batchCode;
    if (this.planYear) searchObj.planYear = this.planYear;

    return {
      searchConfig: listSearchConfig,
      searchObj,
      tableColumn: listTableColumn,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      selectData: [],
      reportVisible: false,
      currentDemandId: ''
    };
  },

  computed: {
    buttonsConfig() {
      return this.showBack ? classifyButtonsConfig : mainButtonsConfig;
    },
    displaySubTitle() {
      if (this.batchName) return `${this.planYear || ''} ${this.batchName}`.trim();
      return '全部批次';
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
    goBack() {
      this.$emit('back');
    },

    isPendingReview(row) {
      return row.preliminaryStatus === '待初审';
    },

    isProcessed(row) {
      return ['已通过', '已初审', '已驳回'].includes(row.preliminaryStatus);
    },

    loadTableData() {
      const filtered = filterDemandList(this.searchObj);
      const pageData = paginateList(filtered, this.searchObj.page, this.searchObj.rows);
      this.tableData = pageData.rows;
      this.tableTotal = pageData.total;
    },

    onSearch() {
      this.searchObj.page = 1;
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(listSearchData);
      if (this.batchCode) this.searchObj.batchCode = this.batchCode;
      if (this.planYear) this.searchObj.planYear = this.planYear;
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

    requireSelection(tip) {
      if (!this.selectData.length) {
        this.$message.warning(tip || '请先选择需求');
        return false;
      }
      return true;
    },

    selectButtons({ id }) {
      if (!this.showBack && id === 0) {
        this.$emit('go-classify-list');
        return;
      }

      const actionId = this.showBack ? id : id - 1;

      if (actionId === 0) {
        if (!this.requireSelection('请先选择待初审需求')) return;
        const pending = this.selectData.filter((item) => item.preliminaryStatus === '待初审');
        if (!pending.length) {
          this.$message.warning('所选需求中没有待初审数据');
          return;
        }
        this.$emit('batch-review', pending);
        return;
      }
      if (actionId === 1) {
        if (!this.requireSelection('请先选择需要功能比对的需求')) return;
        runFunctionCompare(this.selectData.map((item) => item.id));
        this.$message.success('一键功能比对完成（模拟）');
        this.loadTableData();
        return;
      }
      if (actionId === 2) {
        if (!this.requireSelection('请先选择需要关联性审查的需求')) return;
        runRelevanceReview(this.selectData.map((item) => item.id));
        this.$message.success('一键关联性审查完成（模拟）');
        this.loadTableData();
        return;
      }
      if (actionId === 3) {
        const filtered = filterDemandList(this.searchObj);
        this.$message.success(`已按当前筛选条件导出 ${filtered.length} 条初审列表数据（模拟）`);
      }
    },

    goReview(row) {
      this.$emit('review', row);
    },

    goDetail(row) {
      this.$emit('detail', row);
    },

    goBlueprint(row) {
      this.$emit('blueprint', row);
    },

    viewReport(row) {
      this.currentDemandId = row.id;
      this.reportVisible = true;
    },

    getTableClientHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const searchH = this.$refs.pageSearch ? this.$refs.pageSearch.clientHeight : 0;
        this.tableHeight = offsetH - 72 - 48 - 40 - (this.showBack ? 56 : 0) - searchH - 36 - 30 - 3;
      });
    }
  }
};
</script>

<style scoped>
.status-pending {
  color: #e6a23c;
}
</style>
