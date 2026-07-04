<template>
  <section>
    <template v-if="activeView === 'list'">
      <div ref="splitContainer" class="split-container" :style="{ height: containerHeight + 'px' }">
        <div class="split-panel split-panel-top" :style="{ height: topPanelHeight + 'px' }">
          <div ref="meetingSearch" class="panel-search">
            <div class="hy-new-search-box">
              <hyProjectForm
                :formConfig="meetingSearchConfig"
                :formData="meetingSearchObj"
                :ifSearch="true"
                :isReset="true"
                @onSearch="onMeetingSearch"
                @onReset="onMeetingReset"
              />
            </div>
          </div>
          <div class="total-content_table-content-info hy-table_content panel-table">
            <newTable
              ref="meetingTable"
              v-if="topPanelHeight"
              :height="meetingTableHeight"
              :tableData="meetingTableData"
              :column="meetingTableColumn"
              :ifHaveIndex="true"
              :ifHaveCheckBox="false"
              :highlightCurrentRow="true"
              :page="meetingSearchObj.page"
              :pageSize="meetingSearchObj.rows"
              @rowClick="handleMeetingRowClick"
            >
              <template slot="expert" slot-scope="{ data }">
                <el-button type="text" @click.stop="viewExperts(data)">查看专家</el-button>
              </template>
              <template slot="meetingMaterials" slot-scope="{ data }">
                <el-button
                  type="text"
                  icon="el-icon-download"
                  @click.stop="downloadMeetingMaterials(data)"
                />
              </template>
              <template slot="meetingStatus" slot-scope="{ data }">
                <span :class="meetingStatusClass(data.meetingStatus)">{{ data.meetingStatus }}</span>
              </template>
            </newTable>
            <div class="hy_two_pageBox">
              <el-pagination
                @size-change="handleMeetingSizeChange"
                @current-change="handleMeetingCurrentChange"
                :current-page="meetingSearchObj.page"
                :page-size="meetingSearchObj.rows"
                :total="meetingTableTotal"
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
            <div class="total-content_table-content-message">
              <hyNewButtons
                :buttonsData="toolbarButtonsConfig"
                @selectButtons="selectButtons"
                style="padding: 10px"
              />
            </div>
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
              <template slot="reviewProgress" slot-scope="{ data }">
                <el-button type="text" @click.stop="goOpinionSummary(data)">意见汇总</el-button>
                <el-button
                  type="text"
                  :disabled="data.reviewSubmitted"
                  @click.stop="submitReview(data)"
                >提交</el-button>
              </template>
              <template slot="demandStatus" slot-scope="{ data }">
                <span :class="{ 'status-pending': data.demandStatus === '评审中' }">
                  {{ data.demandStatus }}
                </span>
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

      <expert-view-modal
        :visible="expertViewVisible"
        :meeting-id="currentMeetingId"
        @close="expertViewVisible = false"
      />

      <opinion-summary-modal
        :visible="opinionSummaryVisible"
        :demand-id="summaryDemandId"
        @close="opinionSummaryVisible = false"
        @saved="loadDemandData"
      />
    </template>

    <review-record-list
      v-else-if="activeView === 'reviewRecord'"
      :context-demands="reviewRecordContext"
      :meeting-context="selectedMeeting"
      @back="handleBackToList"
    />
  </section>
</template>

<script>
import expertViewModal from '../demandReviewMeeting/expertViewModal.vue';
import opinionSummaryModal from './opinionSummaryModal.vue';
import reviewRecordList from './reviewRecordList.vue';
import {
  meetingSearchConfig,
  meetingSearchData,
  meetingTableColumn,
  demandSearchConfig,
  demandSearchData,
  demandTableColumn,
  toolbarButtonsConfig
} from './config.js';
import {
  filterMeetingList,
  filterDemandList,
  paginateList,
  batchSubmitDemands,
  submitDemandReview
} from './mockData.js';

export default {
  name: 'reviewSummary',

  components: {
    expertViewModal,
    opinionSummaryModal,
    reviewRecordList
  },

  data() {
    return {
      activeView: 'list',
      reviewRecordContext: [],
      summaryDemandId: '',
      meetingSearchConfig,
      meetingSearchObj: this.m_copy(meetingSearchData),
      meetingTableColumn,
      meetingTableData: [],
      meetingTableTotal: 0,
      demandSearchConfig,
      demandSearchObj: this.m_copy(demandSearchData),
      demandTableColumn,
      toolbarButtonsConfig,
      demandTableData: [],
      demandTableTotal: 0,
      demandSelectData: [],
      selectedMeeting: {},
      selectedMeetingId: '',
      expertViewVisible: false,
      opinionSummaryVisible: false,
      currentMeetingId: '',
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
    meetingTableHeight() {
      return Math.max(120, this.topPanelHeight - 110);
    },
    demandTableHeight() {
      const searchH = this.$refs.demandSearch ? this.$refs.demandSearch.clientHeight : 160;
      return Math.max(120, this.bottomPanelHeight - searchH - 48);
    }
  },

  mounted() {
    this.calcContainerHeight();
    this.loadMeetingData();
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

    loadMeetingData() {
      const filtered = filterMeetingList(this.meetingSearchObj);
      const pageData = paginateList(filtered, this.meetingSearchObj.page, this.meetingSearchObj.rows);
      this.meetingTableData = pageData.rows;
      this.meetingTableTotal = pageData.total;
      this.$nextTick(() => {
        this.setMeetingCurrentRow();
      });
    },

    setMeetingCurrentRow() {
      const tableRef = this.$refs.meetingTable && this.$refs.meetingTable.$refs.table;
      if (!tableRef) return;
      if (!this.selectedMeetingId) {
        tableRef.setCurrentRow();
        return;
      }
      const currentRow = this.meetingTableData.find((item) => item.id === this.selectedMeetingId);
      tableRef.setCurrentRow(currentRow || null);
    },

    loadDemandData() {
      const filtered = filterDemandList(this.demandSearchObj);
      const pageData = paginateList(filtered, this.demandSearchObj.page, this.demandSearchObj.rows);
      this.demandTableData = pageData.rows;
      this.demandTableTotal = pageData.total;
    },

    onMeetingSearch() {
      this.meetingSearchObj.page = 1;
      this.loadMeetingData();
    },

    onMeetingReset() {
      this.meetingSearchObj = this.m_copy(meetingSearchData);
      this.selectedMeeting = {};
      this.selectedMeetingId = '';
      this.demandSearchObj.selectedMeetingId = '';
      this.loadMeetingData();
      this.loadDemandData();
    },

    handleMeetingSizeChange(size) {
      this.meetingSearchObj.page = 1;
      this.meetingSearchObj.rows = size;
      this.loadMeetingData();
    },

    handleMeetingCurrentChange(page) {
      this.meetingSearchObj.page = page;
      this.loadMeetingData();
    },

    handleMeetingRowClick(row) {
      this.selectedMeeting = { ...row };
      this.selectedMeetingId = row.id;
      this.demandSearchObj.selectedMeetingId = row.id;
      this.demandSearchObj.page = 1;
      this.$nextTick(() => {
        this.setMeetingCurrentRow();
      });
      this.loadDemandData();
    },

    onDemandSearch() {
      this.demandSearchObj.page = 1;
      this.loadDemandData();
    },

    onDemandReset() {
      const selectedMeetingId = this.demandSearchObj.selectedMeetingId;
      this.demandSearchObj = this.m_copy(demandSearchData);
      this.demandSearchObj.selectedMeetingId = selectedMeetingId;
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
        if (!this.requireSelection('请先选择需要查看评审记录的需求')) return;
        this.reviewRecordContext = this.demandSelectData.map((item) => ({ ...item }));
        this.activeView = 'reviewRecord';
        return;
      }
      if (id === 1) {
        if (!this.requireSelection('请先选择需要批量提交的需求')) return;
        const result = batchSubmitDemands(this.demandSelectData.map((item) => item.id));
        this.$message.success(`批量提交完成，共 ${result.count} 条（模拟）`);
        this.loadDemandData();
        return;
      }
      if (id === 2) {
        if (!this.requireSelection('请先选择需要导出材料的需求')) return;
        this.$message.success(`材料导出任务已提交，共 ${this.demandSelectData.length} 条（模拟）`);
        return;
      }
      if (id === 3) {
        this.$message.success('导出任务已提交（模拟）');
      }
    },

    meetingStatusClass(status) {
      if (status === '已开启') return 'status-open';
      if (status === '已结束') return 'status-ended';
      return '';
    },

    viewExperts(row) {
      this.currentMeetingId = row.id;
      this.expertViewVisible = true;
    },

    downloadMeetingMaterials(row) {
      this.$message.success(`正在下载：${row.materialFileName || '会议资料'}（模拟）`);
    },

    goOpinionSummary(row) {
      this.summaryDemandId = row.id;
      this.opinionSummaryVisible = true;
    },

    submitReview(row) {
      this.$confirm(`确认提交需求【${row.demandCode}】的评审汇总？`, '提示', { type: 'warning' })
        .then(() => {
          const result = submitDemandReview(row.id);
          if (!result.success) {
            this.$message.warning(result.message);
            return;
          }
          this.$message.success('提交成功（模拟）');
          this.loadDemandData();
        })
        .catch(() => {});
    },

    handleBackToList() {
      this.activeView = 'list';
      this.reviewRecordContext = [];
      this.summaryDemandId = '';
      this.$nextTick(() => {
        this.calcContainerHeight();
        this.loadMeetingData();
        this.loadDemandData();
      });
    }
  }
};
</script>

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
.status-open {
  color: #007873;
}
.status-ended {
  color: #909399;
}
.status-pending {
  color: #e6a23c;
}
</style>
