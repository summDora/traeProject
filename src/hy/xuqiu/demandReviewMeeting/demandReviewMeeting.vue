<template>
  <section>
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
      <div class="toolbar-wrap">
        <hyNewButtons
          :buttonsData="buttonsConfig"
          @selectButtons="selectButtons"
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
        <template slot="expert" slot-scope="{ data }">
          <el-button type="text" @click.stop="assignExperts(data)">专家指派</el-button>
          <el-button type="text" @click.stop="viewExperts(data)">专家查看</el-button>
        </template>
        <template slot="statusEnabled" slot-scope="{ data }">
          <el-switch
            :value="data.statusEnabled"
            @change="(val) => toggleStatus(data, 'statusEnabled', val)"
          />
        </template>
        <template slot="externalTransmit" slot-scope="{ data }">
          <el-switch
            :value="data.externalTransmit"
            @change="(val) => toggleStatus(data, 'externalTransmit', val)"
          />
        </template>
        <template slot="operation" slot-scope="{ data }">
          <el-button type="text" @click.stop="openEditModal(data)">维护评审需求</el-button>
          <el-button type="text" @click.stop="selectTags(data)">选择需求标签</el-button>
        </template>
      </newTable>
      <div class="hy_two_pageBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchObj.page"
          :page-size="searchObj.rows"
          :total="tableTotal"
          :page-sizes="[10, 20, 30]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>

    <meeting-edit-modal
      :visible="meetingModalVisible"
      :meeting-id="currentMeetingId"
      :mode="meetingModalMode"
      @close="meetingModalVisible = false"
      @saved="onMeetingSaved"
    />

    <expert-assign-modal
      :visible="expertAssignVisible"
      :meeting-id="currentMeetingId"
      @close="expertAssignVisible = false"
      @saved="onExpertAssignSaved"
    />

    <expert-view-modal
      :visible="expertViewVisible"
      :meeting-id="currentMeetingId"
      @close="expertViewVisible = false"
      @saved="onExpertViewSaved"
    />
  </section>
</template>

<script>
import meetingEditModal from './meetingEditModal.vue';
import expertAssignModal from './expertAssignModal.vue';
import expertViewModal from './expertViewModal.vue';
import {
  searchConfig,
  searchData,
  tableColumn,
  buttonsConfig
} from './config.js';
import {
  filterMeetingList,
  paginateList,
  deleteMeetings,
  toggleMeetingField
} from './mockData.js';

export default {
  name: 'demandReviewMeeting',

  components: {
    meetingEditModal,
    expertAssignModal,
    expertViewModal
  },

  data() {
    return {
      searchConfig,
      searchObj: this.m_copy(searchData),
      tableColumn,
      buttonsConfig,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      selectData: [],
      meetingModalVisible: false,
      meetingModalMode: 'create',
      currentMeetingId: '',
      expertAssignVisible: false,
      expertViewVisible: false
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
      const filtered = filterMeetingList(this.searchObj);
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

    requireSelection(tip, count = 1) {
      if (this.selectData.length < count) {
        this.$message.warning(tip || '请先选择会议');
        return false;
      }
      return true;
    },

    openCreateModal() {
      this.meetingModalMode = 'create';
      this.currentMeetingId = '';
      this.meetingModalVisible = true;
    },

    openEditModal(row) {
      this.meetingModalMode = 'edit';
      this.currentMeetingId = row ? row.id : '';
      this.meetingModalVisible = true;
    },

    selectButtons({ id }) {
      if (id === 0) {
        this.openCreateModal();
        return;
      }
      if (id === 1) {
        if (!this.requireSelection('请先选择一条需要修改的会议', 1)) return;
        if (this.selectData.length > 1) {
          this.$message.warning('一次仅可修改一条会议');
          return;
        }
        this.openEditModal(this.selectData[0]);
        return;
      }
      if (id === 2) {
        if (!this.requireSelection('请先选择需要删除的会议')) return;
        this.$confirm(`确认删除选中的 ${this.selectData.length} 条会议？`, '提示', {
          type: 'warning'
        }).then(() => {
          deleteMeetings(this.selectData.map((item) => item.id));
          this.$message.success('删除成功（模拟）');
          this.selectData = [];
          this.loadTableData();
        }).catch(() => {});
      }
    },

    toggleStatus(row, field, value) {
      toggleMeetingField(row.id, field, value);
      row[field] = value;
    },

    selectTags(row) {
      this.$message.info(`选择【${row.meetingName}】需求标签（待开发）`);
    },

    assignExperts(row) {
      this.currentMeetingId = row.id;
      this.expertAssignVisible = true;
    },

    viewExperts(row) {
      this.currentMeetingId = row.id;
      this.expertViewVisible = true;
    },

    onMeetingSaved() {
      this.meetingModalVisible = false;
      this.loadTableData();
    },

    onExpertAssignSaved() {
      this.expertAssignVisible = false;
      this.loadTableData();
    },

    onExpertViewSaved() {
      this.expertViewVisible = false;
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

