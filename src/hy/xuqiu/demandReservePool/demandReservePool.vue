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
        <template slot="reserveStatus" slot-scope="{ data }">
          <span :class="{ 'status-frozen': data.reserveStatus === '冻结' }">
            {{ data.reserveStatus }}
          </span>
        </template>
        <template slot="operation" slot-scope="{ data }">
          <el-button type="text" @click.stop="viewDetail(data)">详情</el-button>
          <el-button type="text" @click.stop="maintainTags(data)">标签维护</el-button>
          <el-button type="text" @click.stop="exportRow(data)">导出</el-button>
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

    <reserve-detail-modal
      :visible="detailVisible"
      :demand-id="currentDemandId"
      @close="detailVisible = false"
    />

    <tag-maintain-modal
      :visible="tagVisible"
      :demand-id="currentDemandId"
      :demand-code="currentDemandCode"
      @close="tagVisible = false"
      @saved="onTagSaved"
    />
  </section>
</template>

<script>
import reserveDetailModal from './reserveDetailModal.vue';
import tagMaintainModal from './tagMaintainModal.vue';
import {
  searchConfig,
  searchData,
  tableColumn
} from './config.js';
import {
  filterReserveList,
  paginateList
} from './mockData.js';

export default {
  name: 'demandReservePool',

  components: {
    reserveDetailModal,
    tagMaintainModal
  },

  data() {
    return {
      searchConfig,
      searchObj: this.m_copy(searchData),
      tableColumn,
      tableData: [],
      tableTotal: 0,
      tableHeight: 0,
      detailVisible: false,
      tagVisible: false,
      currentDemandId: '',
      currentDemandCode: ''
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
      const filtered = filterReserveList(this.searchObj);
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

    exportRow() {
      const filtered = filterReserveList(this.searchObj);
      this.$message.success(`已按当前筛选条件导出 ${filtered.length} 条需求储备库数据（模拟）`);
    },

    viewDetail(row) {
      this.currentDemandId = row.id;
      this.detailVisible = true;
    },

    maintainTags(row) {
      this.currentDemandId = row.id;
      this.currentDemandCode = row.demandCode;
      this.tagVisible = true;
    },

    onTagSaved() {
      this.$message.success('标签维护成功（模拟）');
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

<style scoped>
.status-frozen {
  color: #e6a23c;
}
</style>
