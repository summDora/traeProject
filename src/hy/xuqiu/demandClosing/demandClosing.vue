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
        <div class="toolbar-wrap">
          <hyNewButtons
            :buttonsData="toolbarButtonsConfig"
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
          <template slot="closingStatus" slot-scope="{ data }">
            <span :class="{ 'status-pending': data.closingStatus === '待收口' }">
              {{ data.closingStatus }}
            </span>
          </template>
          <template slot="operation" slot-scope="{ data }">
            <el-button type="text" @click.stop="goEdit(data)">编辑</el-button>
            <el-button type="text" @click.stop="uploadStampedCover(data)">上传盖章封面</el-button>
            <el-button type="text" @click.stop="uploadClosingMaterial(data)">上传收口材料</el-button>
            <el-button type="text" @click.stop="viewMaterials(data)">查看收口材料</el-button>
            <el-button type="text" @click.stop="viewVersionRecord(data)">版本记录</el-button>
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

      <uploadMaterialModal
        :visible="uploadModalVisible"
        :demandIds="uploadDemandIds"
        :mode="uploadModalMode"
        @close="uploadModalVisible = false"
        @uploaded="onMaterialUploaded"
      />

      <upload-stamped-cover-modal
        :visible="stampedCoverVisible"
        :demand-id="currentDemandId"
        @close="stampedCoverVisible = false"
        @confirmed="onStampedCoverConfirmed"
      />
    </template>

    <closing-process
      v-else-if="activeView === 'process'"
      :key="`process-${pageContext.demandId}`"
      :demand-id="pageContext.demandId"
      @back="handleBack"
      @saved="handleBack"
    />

    <hq-coordination-list
      v-else-if="activeView === 'hqList'"
      @back="handleBack"
    />

    <ai-check-detail
      v-else-if="activeView === 'aiCheck'"
      :key="`aiCheck-${pageContext.demandId}`"
      :demand-id="pageContext.demandId"
      @back="handleBack"
      @saved="handleBack"
    />
  </section>
</template>

<script>
import closingProcess from './closingProcess.vue';
import hqCoordinationList from './hqCoordinationList.vue';
import aiCheckDetail from './aiCheckDetail.vue';
import {
  searchConfig,
  searchData,
  tableColumn,
  toolbarButtonsConfig
} from './config.js';
import {
  filterClosingList,
  paginateList,
  submitClosing
} from './mockData.js';
import uploadMaterialModal from './uploadMaterialModal.vue';
import uploadStampedCoverModal from './uploadStampedCoverModal.vue';

export default {
  name: 'demandClosing',

  components: {
    closingProcess,
    hqCoordinationList,
    aiCheckDetail,
    uploadMaterialModal,
    uploadStampedCoverModal
  },

  data() {
    return {
      activeView: 'list',
      pageContext: {},
      searchConfig,
      searchObj: this.m_copy(searchData),
      tableColumn,
      toolbarButtonsConfig,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      selectData: [],
      uploadModalVisible: false,
      uploadDemandIds: [],
      uploadModalMode: 'upload',
      stampedCoverVisible: false,
      currentDemandId: ''
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
      const filtered = filterClosingList(this.searchObj);
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

    requireSelection(tip) {
      if (!this.selectData.length) {
        this.$message.warning(tip || '请先选择需求');
        return false;
      }
      return true;
    },

    selectButtons({ id, text }) {
      if (id === 0) {
        if (!this.requireSelection('请先选择需要上传材料的需求')) return;
        this.uploadDemandIds = this.selectData.map((item) => item.id);
        this.uploadModalMode = 'upload';
        this.uploadModalVisible = true;
        return;
      }
      if (id === 3) {
        if (!this.requireSelection('请先选择需要收口的需求')) return;
        this.goClosingProcess(this.selectData[0]);
        return;
      }
      if (id === 4) {
        const filtered = filterClosingList(this.searchObj);
        submitClosing(filtered.map((item) => item.id));
        this.$message.success('全部收口成功（模拟）');
        this.loadTableData();
        return;
      }
      if (id === 9) {
        const filtered = filterClosingList(this.searchObj);
        this.$message.success(`已按当前筛选条件导出 ${filtered.length} 条数据（模拟）`);
        return;
      }
      if (id === 10) {
        const filtered = filterClosingList(this.searchObj);
        this.$message.success(`全部导出 ${filtered.length} 条数据（模拟）`);
        return;
      }
      if (id === 11) {
        if (!this.requireSelection('请先选择需要校核的需求')) return;
        this.pageContext = {
          demandId: this.selectData[0].id,
          demandCode: this.selectData[0].demandCode
        };
        this.activeView = 'aiCheck';
        return;
      }
      if ([6].includes(id) && !this.requireSelection('请先选择需求')) return;
      this.$message.success(`${text}操作成功（模拟）`);
    },

    goClosingProcess(row) {
      this.pageContext = {
        demandId: row.id,
        demandCode: row.demandCode
      };
      this.activeView = 'process';
    },

    goEdit(row) {
      this.goClosingProcess(row);
    },

    uploadStampedCover(row) {
      this.currentDemandId = row.id;
      this.stampedCoverVisible = true;
    },

    uploadClosingMaterial(row) {
      this.uploadDemandIds = [row.id];
      this.uploadModalMode = 'upload';
      this.uploadModalVisible = true;
    },

    viewMaterials(row) {
      this.uploadDemandIds = [row.id];
      this.uploadModalMode = 'view';
      this.uploadModalVisible = true;
    },

    viewVersionRecord(row) {
      this.$message.info(`查看【${row.demandCode}】版本记录（模拟）`);
    },

    onMaterialUploaded() {
      this.uploadModalVisible = false;
      this.$message.success('收口材料上传成功（模拟）');
      this.loadTableData();
    },

    onStampedCoverConfirmed() {
      this.stampedCoverVisible = false;
      this.$message.success('盖章封面上传确认成功（模拟）');
      this.loadTableData();
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

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.status-pending {
  color: #f56c6c;
}
</style>
