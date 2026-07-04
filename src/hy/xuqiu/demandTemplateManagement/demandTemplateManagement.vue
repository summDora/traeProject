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
        <div class="total-content_table-content-message">
          <hyNewButtons
            :buttonsData="toolbarButtonsConfig"
            @selectButtons="selectButtons"
            style="padding: 10px"
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
          <template slot="associatedBatches" slot-scope="{ data }">
            <div v-if="data.associatedBatches" class="batch-cell">
              <span :class="{ 'batch-text-collapsed': !isBatchExpanded(data.id) }">
                {{ data.associatedBatches }}
              </span>
              <el-button
                v-if="needBatchToggle(data.associatedBatches)"
                type="text"
                class="batch-toggle-btn"
                @click.stop="toggleBatchExpand(data.id)"
              >{{ isBatchExpanded(data.id) ? '收起' : '展开' }}</el-button>
            </div>
            <span v-else>—</span>
          </template>
          <template slot="operation" slot-scope="{ data }">
            <el-button type="text" @click.stop="goDetail(data)">详情</el-button>
            <el-button
              v-if="!data.batchCount"
              type="text"
              @click.stop="removeTemplate(data)"
            >删除</el-button>
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
    </template>

    <template-edit
      v-else-if="activeView === 'edit'"
      :key="`edit-${pageContext.templateId || 'new'}-${pageContext.mode}`"
      :template-id="pageContext.templateId"
      :mode="pageContext.mode"
      @back="handleBackToList"
      @saved="handleSaved"
    />
  </section>
</template>

<script>
import templateEdit from './templateEdit.vue';
import {
  searchConfig,
  searchData,
  tableColumn,
  toolbarButtonsConfig
} from './config.js';
import {
  filterTemplateList,
  paginateList,
  deleteTemplate
} from './mockData.js';

export default {
  name: 'demandTemplateManagement',

  components: {
    templateEdit
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
      expandedBatchIds: []
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
      const filtered = filterTemplateList(this.searchObj);
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

    selectButtons({ id }) {
      if (id === 0) {
        this.pageContext = { mode: 'add' };
        this.activeView = 'edit';
      }
    },

    goDetail(row) {
      this.pageContext = {
        templateId: row.id,
        mode: row.batchCount > 0 ? 'detail' : 'edit'
      };
      this.activeView = 'edit';
    },

    removeTemplate(row) {
      this.$confirm('确认删除该申报模板？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const result = deleteTemplate(row.id);
        if (!result.success) {
          this.$message.warning(result.message);
          return;
        }
        this.$message.success('删除成功！');
        this.loadTableData();
      }).catch(() => {});
    },

    needBatchToggle(text = '') {
      return text.length > 36;
    },

    isBatchExpanded(id) {
      return this.expandedBatchIds.includes(id);
    },

    toggleBatchExpand(id) {
      const index = this.expandedBatchIds.indexOf(id);
      if (index === -1) {
        this.expandedBatchIds.push(id);
        return;
      }
      this.expandedBatchIds.splice(index, 1);
    },

    handleBackToList() {
      this.activeView = 'list';
      this.pageContext = {};
      this.$nextTick(() => {
        this.loadTableData();
        this.getTableClientHeight();
      });
    },

    handleSaved() {
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
.batch-cell {
  line-height: 1.5;
  word-break: break-all;
}

.batch-text-collapsed {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.batch-toggle-btn {
  padding: 0;
  margin-top: 2px;
}
</style>
