<template>
  <section>
    <xuqiu-page-header
      title="报表统计"
      :sub-title="reportName || '—'"
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

    <div class="dimension-tabs">
      <el-button
        v-for="tab in dimensionTabs"
        :key="tab.key"
        :type="activeDimension === tab.key ? 'primary' : 'default'"
        size="small"
        @click="switchDimension(tab.key)"
      >{{ tab.label }}</el-button>
    </div>

    <div class="field-selector">
      <div v-for="group in fieldGroups" :key="group.key" class="field-group">
        <span class="group-label">{{ group.label }}：</span>
        <el-checkbox-group v-model="selectedFields" class="field-checkboxes">
          <el-checkbox
            v-for="field in group.fields"
            :key="field.key"
            :label="field.key"
          >{{ field.label }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="field-actions">
        <el-button type="primary" size="small" @click="generateReport">生成报表</el-button>
      </div>
    </div>

    <div class="toolbar-row">
      <hyNewButtons
        :buttonsData="buttonsConfig"
        @selectButtons="selectButtons"
        style="padding: 0; box-sizing: border-box; justify-content: flex-start;"
      />
    </div>

    <div class="total-content_table-content-info hy-table_content" :style="{ height: tableHeight }">
      <newTable
        v-if="tableHeight"
        :height="tableHeight"
        :tableData="tableData"
        :column="tableColumn"
        :ifHaveIndex="true"
        :ifHaveCheckBox="false"
        :page="1"
        :pageSize="tableData.length || 20"
      >
        <template slot="dimensionLabel" slot-scope="{ data }">
          <span :class="{ 'summary-text': data._isSummary }">{{ data.dimensionLabel }}</span>
        </template>
      </newTable>
      <div class="hy_two_pageBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-size="rows"
          :total="tableTotal"
          :page-sizes="[20, 40, 60]"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </div>
  </section>
</template>

<script>
import {
  statisticsSearchConfig,
  statisticsSearchData,
  statisticsButtonsConfig,
  statDimensionTabs,
  statFieldGroups,
  defaultSelectedStatFields,
  buildStatisticsTableColumn
} from './config.js';
import {
  buildStatisticsData,
  buildSummaryRow,
  refreshReportStats
} from './mockData.js';

export default {
  name: 'reportStatistics',

  props: {
    reportId: {
      type: String,
      default: ''
    },
    reportName: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      searchConfig: statisticsSearchConfig,
      searchObj: this.m_copy(statisticsSearchData),
      buttonsConfig: statisticsButtonsConfig,
      dimensionTabs: statDimensionTabs,
      fieldGroups: statFieldGroups,
      activeDimension: 'unit',
      selectedFields: defaultSelectedStatFields.slice(),
      rawRows: [],
      tableData: [],
      tableColumn: [],
      tableTotal: 0,
      tableHeight: 0,
      page: 1,
      rows: 20
    };
  },

  mounted() {
    this.generateReport();
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

    switchDimension(key) {
      this.activeDimension = key;
      this.page = 1;
      this.generateReport();
    },

    onSearch() {
      this.page = 1;
      this.generateReport();
    },

    onReset() {
      this.searchObj = this.m_copy(statisticsSearchData);
      this.page = 1;
      this.generateReport();
    },

    generateReport() {
      this.tableColumn = buildStatisticsTableColumn(this.activeDimension, this.selectedFields);
      const rows = buildStatisticsData(this.activeDimension, this.searchObj);
      const summary = buildSummaryRow(rows, this.selectedFields);
      this.rawRows = [summary, ...rows];
      this.applyPagination();
    },

    applyPagination() {
      const summary = this.rawRows.find((row) => row._isSummary);
      const dataRows = this.rawRows.filter((row) => !row._isSummary);
      let start = 0;
      let pageSize = this.rows;

      if (this.page === 1) {
        pageSize = summary ? this.rows - 1 : this.rows;
        start = 0;
      } else {
        start = (this.rows - 1) + (this.page - 2) * this.rows;
      }

      const slice = dataRows.slice(start, start + pageSize);
      this.tableData = this.page === 1 && summary ? [summary, ...slice] : slice;
      this.tableTotal = dataRows.length + (summary ? 1 : 0);
    },

    handleSizeChange(size) {
      this.page = 1;
      this.rows = size;
      this.applyPagination();
    },

    handleCurrentChange(page) {
      this.page = page;
      this.applyPagination();
    },

    selectButtons({ id, text }) {
      if (id === 0) {
        const count = this.rawRows.length > 0 ? this.rawRows.length - 1 : 0;
        this.$message.success(`已导出 ${count} 条统计结果（模拟）`);
        return;
      }
      if (id === 1 && this.reportId) {
        refreshReportStats([this.reportId]);
        this.$message.success('统计数据已重新计算并更新（模拟）');
        this.$emit('refreshed');
        this.generateReport();
      }
    },

    getTableClientHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const searchH = this.$refs.pageSearch ? this.$refs.pageSearch.clientHeight : 0;
        this.tableHeight = offsetH - 72 - 48 - 40 - 56 - searchH - 120 - 36 - 30 - 3;
      });
    }
  }
};
</script>

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.dimension-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px 0;
}
.field-selector {
  border: 1px solid rgba(34, 39, 52, 0.15);
  padding: 12px;
  margin-bottom: 10px;
  background: #fff;
}
.field-group {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}
.field-group:last-of-type {
  margin-bottom: 0;
}
.group-label {
  width: 72px;
  flex-shrink: 0;
  line-height: 32px;
  color: #606266;
}
.field-checkboxes {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}
.field-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
.toolbar-row {
  padding: 0 0 10px;
}
.summary-text {
  color: #298bf5;
  font-weight: bold;
}
</style>
