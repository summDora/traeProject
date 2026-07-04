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
          <template slot="batchName" slot-scope="{ data }">
            <span :class="{ 'status-pending': data.batchName === '待分配' }">{{ data.batchName }}</span>
          </template>
          <template slot="materialUploadStatus" slot-scope="{ data }">
            <span :class="{ 'status-pending': data.materialUploadStatus === '待上传' }">
              {{ data.materialUploadStatus }}
            </span>
          </template>
          <template slot="duplicateResult" slot-scope="{ data }">
            <el-button
              v-if="data.duplicatePercent != null"
              type="text"
              @click.stop="viewDuplicateReport(data)"
            >{{ data.duplicateResult }}</el-button>
            <span v-else>{{ data.duplicateResult }}</span>
          </template>
          <template slot="operation" slot-scope="{ data }">
            <el-button type="text" @click.stop="goDetail(data)">详情</el-button>
            <el-button type="text" @click.stop="goEdit(data)">编辑</el-button>
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

      <assign-batch-modal
        :visible="assignBatchVisible"
        :investment-channel="assignContext.investmentChannel"
        :project-type="assignContext.projectType"
        @confirm="handleAssignConfirm"
        @close="assignBatchVisible = false"
      />

      <upload-summary-modal
        :visible="uploadSummaryVisible"
        @uploaded="handleUploadConfirm"
        @close="uploadSummaryVisible = false"
      />
    </template>

    <pre-reserve-detail
      v-else-if="activeView === 'detail'"
      :key="`detail-${pageContext.demandId}`"
      :demand-id="pageContext.demandId"
      @back="handleBackToList"
    />

    <pre-reserve-edit
      v-else-if="activeView === 'edit'"
      :key="`edit-${pageContext.demandId}`"
      :demand-id="pageContext.demandId"
      @back="handleBackToList"
      @saved="handleEditSaved"
    />
  </section>
</template>

<script>
import assignBatchModal from './assignBatchModal.vue';
import uploadSummaryModal from './uploadSummaryModal.vue';
import preReserveDetail from './preReserveDetail.vue';
import preReserveEdit from './preReserveEdit.vue';
import {
  searchConfig,
  searchData,
  tableColumn,
  buttonsConfig
} from './config.js';
import {
  filterPreReserveList,
  paginateList,
  assignBatch,
  uploadStampedSummary,
  deletePreReserve,
  formatExportDate
} from './mockData.js';

export default {
  name: 'demandPreReservePool',

  components: {
    assignBatchModal,
    uploadSummaryModal,
    preReserveDetail,
    preReserveEdit
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
      selectData: [],
      assignBatchVisible: false,
      uploadSummaryVisible: false,
      assignContext: {
        investmentChannel: '',
        projectType: ''
      },
      pendingAssignIds: [],
      pendingUploadIds: []
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
      const filtered = filterPreReserveList(this.searchObj);
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

    requireSelection() {
      if (!this.selectData.length) {
        this.$message.warning('请选择至少一条数据！');
        return false;
      }
      return true;
    },

    validateSameChannelAndType(rows) {
      const channel = rows[0].investmentChannel;
      const type = rows[0].projectType;
      const invalid = rows.some(
        (item) => item.investmentChannel !== channel || item.projectType !== type
      );
      if (invalid) {
        this.$message.warning('所选数据投资渠道或项目类型不一致，无法批量分配批次');
        return false;
      }
      return true;
    },

    validateSameBatch(rows) {
      const assigned = rows.filter((item) => item.batchCode);
      if (!assigned.length) {
        this.$message.warning('请先为所选需求分配批次后再上传盖章版汇总需求表');
        return false;
      }
      const batchCode = assigned[0].batchCode;
      const invalid = assigned.some((item) => item.batchCode !== batchCode);
      if (invalid) {
        this.$message.warning('仅可对分配于同一批次的需求上传盖章版汇总需求表');
        return false;
      }
      return true;
    },

    selectButtons({ id }) {
      if (id === 0) {
        if (!this.requireSelection()) return;
        if (!this.validateSameChannelAndType(this.selectData)) return;
        this.pendingAssignIds = this.selectData.map((item) => item.id);
        this.assignContext = {
          investmentChannel: this.selectData[0].investmentChannel,
          projectType: this.selectData[0].projectType
        };
        this.assignBatchVisible = true;
        return;
      }

      if (id === 1) {
        if (!this.requireSelection()) return;
        if (!this.validateSameBatch(this.selectData)) return;
        this.pendingUploadIds = this.selectData.map((item) => item.id);
        this.uploadSummaryVisible = true;
        return;
      }

      if (id === 2) {
        if (!this.requireSelection()) return;
        const exportable = this.selectData.filter((item) => item.hasStampedSummaryFile);
        if (!exportable.length) {
          this.$message.warning('暂无可导出的盖章版汇总需求表！');
          return;
        }
        this.$message.success(`已生成并下载 盖章版汇总需求表_${formatExportDate()}（模拟，共 ${exportable.length} 条）`);
        return;
      }

      if (id === 3) {
        if (!this.requireSelection()) return;
        this.$confirm('确认删除所选数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePreReserve(this.selectData.map((item) => item.id));
          this.$message.success('删除成功！');
          this.selectData = [];
          this.loadTableData();
        }).catch(() => {});
      }
    },

    handleAssignConfirm(batch) {
      assignBatch(this.pendingAssignIds, batch);
      this.assignBatchVisible = false;
      this.pendingAssignIds = [];
      this.$message.success('分配成功！');
      this.loadTableData();
    },

    handleUploadConfirm(fileName) {
      uploadStampedSummary(this.pendingUploadIds, fileName);
      this.uploadSummaryVisible = false;
      this.pendingUploadIds = [];
      this.$message.success('上传成功！');
      this.loadTableData();
    },

    viewDuplicateReport(row) {
      this.$message.info(`查重结果 ${row.duplicateResult}，报告：${row.duplicateReportName || '暂无'}（模拟）`);
    },

    goDetail(row) {
      this.pageContext = { demandId: row.id };
      this.activeView = 'detail';
    },

    goEdit(row) {
      this.pageContext = { demandId: row.id };
      this.activeView = 'edit';
    },

    handleBackToList() {
      this.activeView = 'list';
      this.pageContext = {};
      this.$nextTick(() => {
        this.loadTableData();
        this.getTableClientHeight();
      });
    },

    handleEditSaved() {
      this.handleBackToList();
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

<style scoped>
.status-pending {
  color: #e6a23c;
}
</style>
