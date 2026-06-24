<template>
  <section>
    <template v-if="activeView === 'list'">
      <div ref="splitContainer" class="split-container" :style="{ height: containerHeight + 'px' }">
        <div class="split-panel split-panel-top" :style="{ height: topPanelHeight + 'px' }">
          <div ref="batchSearch" class="panel-search">
            <div class="hy-new-search-box">
              <hyProjectForm
                :formConfig="batchSearchConfig"
                :formData="batchSearchObj"
                :ifSearch="true"
                :isReset="true"
                @onSearch="onBatchSearch"
                @onReset="onBatchReset"
              />
            </div>
          </div>
          <div class="total-content_table-content-info hy-table_content panel-table">
            <newTable
              ref="batchTable"
              v-if="topPanelHeight"
              :height="batchTableHeight"
              :tableData="batchTableData"
              :column="batchTableColumn"
              :ifHaveIndex="true"
              :ifHaveCheckBox="false"
              :highlightCurrentRow="true"
              :page="batchSearchObj.page"
              :pageSize="batchSearchObj.rows"
              @rowClick="handleBatchRowClick"
            />
            <div class="hy_two_pageBox">
              <el-pagination
                @size-change="handleBatchSizeChange"
                @current-change="handleBatchCurrentChange"
                :current-page="batchSearchObj.page"
                :page-size="batchSearchObj.rows"
                :total="batchTableTotal"
                :page-sizes="[10, 20, 30, 40]"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </div>
        </div>

        <div
          class="split-divider"
          :class="{ 'is-dragging': dragging }"
          @mousedown="startDrag"
        >
          <span class="split-divider-grip"></span>
          <span class="split-divider-text">拖拽调整上下区域高度</span>
          <span class="split-divider-grip"></span>
        </div>

        <div class="split-panel split-panel-bottom" :style="{ height: bottomPanelHeight + 'px' }">
          <div ref="demandSearch" class="panel-search">
            <div class="hy-new-search-box">
              <hyProjectForm
                :formConfig="demandSearchConfig"
                :formData="demandSearchObj"
                :ifSearch="true"
                :isReset="true"
                @onSearch="onDemandSearch"
                @onReset="onDemandReset"
              />
            </div>
            <hyNewButtons
              :buttonsData="buttonsConfig"
              @selectButtons="selectButtons"
              style="padding: 10px; box-sizing: border-box; justify-content: flex-start; flex-wrap: wrap;"
            />
          </div>
          <div class="total-content_table-content-info hy-table_content panel-table">
            <newTable
              v-if="bottomPanelHeight"
              :height="demandTableHeight"
              :tableData="demandTableData"
              :column="demandTableColumn"
              :ifHaveIndex="true"
              :ifHaveCheckBox="true"
              :page="demandSearchObj.page"
              :pageSize="demandSearchObj.rows"
              @handleSelectionChange="handleDemandSelectionChange"
            >
              <template slot="selfReviewResult" slot-scope="{ data }">
                <span :class="{ 'status-warning': data.selfReviewResult === '存在风险' }">
                  {{ data.selfReviewResult }}
                </span>
              </template>
              <template slot="demandStatus" slot-scope="{ data }">
                <span :class="{ 'status-pending': data.demandStatus === '暂存' || data.demandStatus === '驳回' }">
                  {{ data.demandStatus }}
                </span>
              </template>
              <template slot="operation" slot-scope="{ data }">
                <el-button type="text" @click.stop="goEdit(data)">编辑</el-button>
                <el-button
                  v-if="canSubmitRow(data)"
                  type="text"
                  @click.stop="submitRow(data)"
                >提交</el-button>
              </template>
            </newTable>
            <div class="hy_two_pageBox">
              <el-pagination
                @size-change="handleDemandSizeChange"
                @current-change="handleDemandCurrentChange"
                :current-page="demandSearchObj.page"
                :page-size="demandSearchObj.rows"
                :total="demandTableTotal"
                :page-sizes="[10, 20, 30, 40]"
                layout="total, sizes, prev, pager, next, jumper"
              />
            </div>
          </div>
        </div>
      </div>

      <select-pre-reserve-modal
        :visible="preReserveVisible"
        :batch-context="selectedBatch"
        @confirm="handlePreReserveConfirm"
        @close="preReserveVisible = false"
      />
    </template>

    <declaration-edit
      v-else-if="activeView === 'edit'"
      :key="`edit-${pageContext.demandId || 'new'}`"
      :demand-id="pageContext.demandId"
      :batch-context="selectedBatch"
      :is-new="pageContext.isNew"
      @back="handleBackToList"
      @saved="handleEditSaved"
    />
  </section>
</template>

<script>
import selectPreReserveModal from './selectPreReserveModal.vue';
import declarationEdit from './declarationEdit.vue';
import {
  batchSearchConfig,
  batchSearchData,
  batchTableColumn,
  demandSearchConfig,
  demandSearchData,
  demandTableColumn,
  buttonsConfig
} from './config.js';
import {
  filterBatchList,
  filterDeclarationList,
  paginateList,
  deleteDeclarations,
  runDuplicateCheck,
  runHistoryRelevanceReview,
  submitDeclarations,
  createDraft
} from './mockData.js';

export default {
  name: 'demandDeclaration',

  components: {
    selectPreReserveModal,
    declarationEdit
  },

  data() {
    return {
      activeView: 'list',
      pageContext: {},
      batchSearchConfig,
      batchSearchObj: this.m_copy(batchSearchData),
      batchTableColumn,
      batchTableData: [],
      batchTableTotal: 0,
      demandSearchConfig,
      demandSearchObj: this.m_copy(demandSearchData),
      demandTableColumn,
      buttonsConfig,
      demandTableData: [],
      demandTableTotal: 0,
      demandSelectData: [],
      selectedBatch: {},
      selectedBatchId: '',
      preReserveVisible: false,
      containerHeight: 600,
      topPanelHeight: 260,
      dragging: false,
      dragStartY: 0,
      dragStartTopHeight: 0
    };
  },

  computed: {
    splitDividerHeight() {
      return 20;
    },
    bottomPanelHeight() {
      return Math.max(200, this.containerHeight - this.topPanelHeight - this.splitDividerHeight);
    },
    batchTableHeight() {
      return Math.max(120, this.topPanelHeight - 110);
    },
    demandTableHeight() {
      const searchH = this.$refs.demandSearch ? this.$refs.demandSearch.clientHeight : 120;
      return Math.max(120, this.bottomPanelHeight - searchH - 48);
    }
  },

  mounted() {
    this.calcContainerHeight();
    this.loadBatchData();
    this.loadDemandData();
    window.addEventListener('resize', this.calcContainerHeight);
    document.addEventListener('mousemove', this.onDrag);
    document.addEventListener('mouseup', this.stopDrag);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.calcContainerHeight);
    document.removeEventListener('mousemove', this.onDrag);
    document.removeEventListener('mouseup', this.stopDrag);
  },

  methods: {
    calcContainerHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        this.containerHeight = offsetH - 72 - 48 - 40 - 20;
        const minTop = 180;
        const maxTop = this.containerHeight - 220;
        if (this.topPanelHeight < minTop) this.topPanelHeight = minTop;
        if (this.topPanelHeight > maxTop) this.topPanelHeight = maxTop;
      });
    },

    startDrag(e) {
      this.dragging = true;
      this.dragStartY = e.clientY;
      this.dragStartTopHeight = this.topPanelHeight;
    },

    onDrag(e) {
      if (!this.dragging) return;
      const delta = e.clientY - this.dragStartY;
      const next = this.dragStartTopHeight + delta;
      const minTop = 160;
      const maxTop = this.containerHeight - 200;
      this.topPanelHeight = Math.min(maxTop, Math.max(minTop, next));
    },

    stopDrag() {
      this.dragging = false;
    },

    loadBatchData() {
      const filtered = filterBatchList(this.batchSearchObj);
      const pageData = paginateList(filtered, this.batchSearchObj.page, this.batchSearchObj.rows);
      this.batchTableData = pageData.rows;
      this.batchTableTotal = pageData.total;
      this.$nextTick(() => {
        this.setBatchCurrentRow();
      });
    },

    setBatchCurrentRow() {
      const tableRef = this.$refs.batchTable && this.$refs.batchTable.$refs.table;
      if (!tableRef) return;
      if (!this.selectedBatchId) {
        tableRef.setCurrentRow();
        return;
      }
      const currentRow = this.batchTableData.find((item) => item.id === this.selectedBatchId);
      tableRef.setCurrentRow(currentRow || null);
    },

    loadDemandData() {
      const filtered = filterDeclarationList(this.demandSearchObj);
      const pageData = paginateList(filtered, this.demandSearchObj.page, this.demandSearchObj.rows);
      this.demandTableData = pageData.rows;
      this.demandTableTotal = pageData.total;
    },

    onBatchSearch() {
      this.batchSearchObj.page = 1;
      this.loadBatchData();
    },

    onBatchReset() {
      this.batchSearchObj = this.m_copy(batchSearchData);
      this.selectedBatch = {};
      this.selectedBatchId = '';
      this.demandSearchObj.selectedBatchCode = '';
      this.loadBatchData();
      this.loadDemandData();
    },

    handleBatchSizeChange(size) {
      this.batchSearchObj.page = 1;
      this.batchSearchObj.rows = size;
      this.loadBatchData();
    },

    handleBatchCurrentChange(page) {
      this.batchSearchObj.page = page;
      this.loadBatchData();
    },

    handleBatchRowClick(row) {
      this.selectedBatch = { ...row };
      this.selectedBatchId = row.id;
      this.demandSearchObj.selectedBatchCode = row.batchCode;
      this.demandSearchObj.batchCode = row.batchCode;
      this.demandSearchObj.planYear = row.planYear;
      this.demandSearchObj.page = 1;
      this.$nextTick(() => {
        this.setBatchCurrentRow();
      });
      this.loadDemandData();
    },

    onDemandSearch() {
      this.demandSearchObj.page = 1;
      this.loadDemandData();
    },

    onDemandReset() {
      const selectedBatchCode = this.demandSearchObj.selectedBatchCode;
      this.demandSearchObj = this.m_copy(demandSearchData);
      this.demandSearchObj.selectedBatchCode = selectedBatchCode;
      if (this.selectedBatch.batchCode) {
        this.demandSearchObj.batchCode = this.selectedBatch.batchCode;
        this.demandSearchObj.planYear = this.selectedBatch.planYear;
      }
      this.loadDemandData();
    },

    handleDemandSelectionChange(val) {
      this.demandSelectData = val;
    },

    handleDemandSizeChange(size) {
      this.demandSearchObj.page = 1;
      this.demandSearchObj.rows = size;
      this.loadDemandData();
    },

    handleDemandCurrentChange(page) {
      this.demandSearchObj.page = page;
      this.loadDemandData();
    },

    requireSelection(tip) {
      if (!this.demandSelectData.length) {
        this.$message.warning(tip || '请先选择需求');
        return false;
      }
      return true;
    },

    selectButtons({ id }) {
      if (id === 0) {
        if (!this.selectedBatch.batchCode) {
          this.$message.warning('请先在上方选择申报批次');
          return;
        }
        this.pageContext = { isNew: true };
        this.activeView = 'edit';
        return;
      }
      if (id === 1) {
        if (!this.selectedBatch.batchCode) {
          this.$message.warning('请先在上方选择申报批次');
          return;
        }
        this.preReserveVisible = true;
        return;
      }
      if (id === 2) {
        if (!this.requireSelection('请先选择需要删除的需求')) return;
        this.$confirm('确认删除所选需求？', '提示', { type: 'warning' }).then(() => {
          const result = deleteDeclarations(this.demandSelectData.map((item) => item.id));
          if (!result.success) {
            this.$message.warning(result.message);
            return;
          }
          this.$message.success('删除成功（模拟）');
          this.loadDemandData();
        }).catch(() => {});
        return;
      }
      if (id === 3) {
        if (!this.requireSelection('请先选择需要查重的需求')) return;
        runDuplicateCheck(this.demandSelectData.map((item) => item.id));
        this.$message.success('查重完成（模拟）');
        this.loadDemandData();
        return;
      }
      if (id === 4) {
        if (!this.requireSelection('请先选择需要历史关联性审查的需求')) return;
        runHistoryRelevanceReview(this.demandSelectData.map((item) => item.id));
        this.$message.success('历史关联性审查完成（模拟）');
        this.loadDemandData();
        return;
      }
      if (id === 5) {
        const ids = this.demandSelectData.length
          ? this.demandSelectData.map((item) => item.id)
          : filterDeclarationList(this.demandSearchObj).map((item) => item.id);
        const result = submitDeclarations(ids);
        if (!result.success) {
          this.$message.warning(result.message);
          return;
        }
        this.$message.success('提交成功（模拟）');
        this.loadDemandData();
        return;
      }
      if (id === 6) {
        const filtered = filterDeclarationList(this.demandSearchObj);
        this.$message.success(`已按当前筛选条件导出 ${filtered.length} 条需求申报数据（模拟）`);
      }
    },

    handlePreReserveConfirm(rows) {
      rows.forEach((row) => {
        createDraft({
          fromPreReserve: true,
          demandCode: row.demandCode,
          demandName: row.demandName,
          reserveCode: row.reserveCode,
          totalInvestment: row.totalInvestment,
          demandDepartment: row.demandDepartment,
          demandLeader: row.demandLeader,
          batchCode: this.selectedBatch.batchCode,
          projectType: this.selectedBatch.projectCategory,
          investmentChannel: this.selectedBatch.investmentChannel
        });
      });
      this.$message.success(`已引入 ${rows.length} 条预储备需求（模拟）`);
      this.loadDemandData();
    },

    canSubmitRow(row) {
      return ['暂存', '驳回'].includes(row.demandStatus);
    },

    submitRow(row) {
      const result = submitDeclarations([row.id]);
      if (!result.success) {
        this.$message.warning(result.message);
        return;
      }
      this.$message.success('提交成功（模拟）');
      this.loadDemandData();
    },

    goEdit(row) {
      this.pageContext = { demandId: row.id, isNew: false };
      this.activeView = 'edit';
    },

    handleBackToList() {
      this.activeView = 'list';
      this.pageContext = {};
      this.$nextTick(() => {
        this.calcContainerHeight();
        this.loadBatchData();
        this.loadDemandData();
      });
    },

    handleEditSaved() {
      this.handleBackToList();
    }
  }
};
</script>

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.split-container {
  display: flex;
  flex-direction: column;
  min-height: 400px;
}
.split-panel {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.panel-search {
  flex-shrink: 0;
}
.panel-table {
  flex: 1;
  min-height: 0;
}
.split-divider {
  height: 20px;
  cursor: row-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-shrink: 0;
  user-select: none;
  background: linear-gradient(180deg, #e8f5f4 0%, #d4eeec 50%, #e8f5f4 100%);
  border-top: 1px solid rgba(0, 120, 115, 0.25);
  border-bottom: 1px solid rgba(0, 120, 115, 0.25);
}
.split-divider.is-dragging {
  background: #c8e8e6;
}
.split-divider-grip {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: #007873;
  box-shadow: 0 0 0 1px rgba(0, 120, 115, 0.15);
}
.split-divider-text {
  font-size: 12px;
  color: #007873;
  letter-spacing: 1px;
  white-space: nowrap;
}
.split-divider:hover .split-divider-grip,
.split-divider.is-dragging .split-divider-grip {
  background: #005f5b;
}
.split-divider:hover .split-divider-text,
.split-divider.is-dragging .split-divider-text {
  color: #005f5b;
  font-weight: 600;
}
.status-pending {
  color: #e6a23c;
}
.status-warning {
  color: #f56c6c;
}
</style>
