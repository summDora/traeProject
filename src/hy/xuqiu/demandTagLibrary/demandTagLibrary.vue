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
      <div class="total-content_table-content-message">
        <hyNewButtons
          :buttonsData="toolbarButtonsConfig"
          @selectButtons="selectButtons"
          style="padding: 10px"
        />
      </div>
    </div>

    <div class="total-content_table-content-info hy-table_content tag-table-wrap" :style="{ height: tableHeight + 'px' }">
      <newTable
        v-if="tableHeight"
        :height="tableHeight"
        :tableData="flatTableData"
        :column="tableColumn"
        :ifHaveIndex="false"
        :ifHaveCheckBox="false"
        row-key="id"
      >
        <template slot="displayIndex" slot-scope="{ data }">
          <div class="index-cell">
            <span
              v-if="data.isCategory && data.hasChildren"
              class="expand-trigger"
              @click.stop="toggleExpand(data.id)"
            >
              <i :class="isExpanded(data.id) ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" />
            </span>
            <span v-else-if="data.isCategory" class="expand-placeholder"></span>
            <span v-if="data.isCategory">{{ data.displayIndex }}</span>
          </div>
        </template>
        <template slot="tagName" slot-scope="{ data }">
          <span :class="{ 'tag-name-child': !data.isCategory }">{{ data.tagName || '' }}</span>
        </template>
        <template slot="relatedDemandCount" slot-scope="{ data }">
          <el-button
            v-if="data.relatedDemandCount > 0"
            type="text"
            @click.stop="viewRelatedDemands(data)"
          >{{ data.relatedDemandCount }}</el-button>
          <span v-else>0</span>
        </template>
        <template slot="operation" slot-scope="{ data }">
          <template v-if="!data.isCategory">
            <el-button type="text" @click.stop="openEdit(data)">编辑</el-button>
            <el-button type="text" @click.stop="removeTag(data)">删除</el-button>
            <el-button
              v-if="data.enabled"
              type="text"
              @click.stop="toggleStatus(data, false)"
            >停用</el-button>
            <el-button
              v-else
              type="text"
              @click.stop="toggleStatus(data, true)"
            >启用</el-button>
          </template>
        </template>
      </newTable>
    </div>

    <tag-edit-modal
      :visible="tagModalVisible"
      :tag-id="currentTagId"
      :mode="tagModalMode"
      @close="tagModalVisible = false"
      @saved="loadTableData"
    />
  </section>
</template>

<script>
import tagEditModal from './tagEditModal.vue';
import {
  searchConfig,
  searchData,
  tableColumn,
  toolbarButtonsConfig
} from './config.js';
import {
  filterTagTree,
  deleteTag,
  toggleTagStatus
} from './mockData.js';

export default {
  name: 'demandTagLibrary',

  components: {
    tagEditModal
  },

  data() {
    return {
      searchConfig,
      searchObj: this.m_copy(searchData),
      tableColumn,
      toolbarButtonsConfig,
      categoryTree: [],
      expandedCategoryIds: ['CAT200'],
      tableHeight: 0,
      tagModalVisible: false,
      tagModalMode: 'add',
      currentTagId: ''
    };
  },

  computed: {
    flatTableData() {
      const rows = [];
      let displayIndex = 0;

      this.categoryTree.forEach((category) => {
        displayIndex += 1;
        const hasChildren = !!(category.children && category.children.length);
        rows.push({
          ...category,
          displayIndex,
          hasChildren
        });

        if (hasChildren && this.expandedCategoryIds.includes(category.id)) {
          category.children.forEach((child) => {
            rows.push({
              ...child,
              isCategory: false
            });
          });
        }
      });

      return rows;
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
    loadTableData() {
      this.categoryTree = filterTagTree(this.searchObj);
    },

    isExpanded(categoryId) {
      return this.expandedCategoryIds.includes(categoryId);
    },

    toggleExpand(categoryId) {
      const index = this.expandedCategoryIds.indexOf(categoryId);
      if (index > -1) {
        this.expandedCategoryIds.splice(index, 1);
      } else {
        this.expandedCategoryIds.push(categoryId);
      }
    },

    onSearch() {
      this.loadTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(searchData);
      this.loadTableData();
    },

    selectButtons({ id }) {
      if (id === 0) {
        this.tagModalMode = 'add';
        this.currentTagId = '';
        this.tagModalVisible = true;
      }
    },

    viewRelatedDemands(row) {
      const label = row.isCategory ? row.tagCategory : row.tagName;
      this.$message.info(`查看【${label}】关联需求，共 ${row.relatedDemandCount} 条（模拟）`);
    },

    openEdit(row) {
      this.tagModalMode = 'edit';
      this.currentTagId = row.id;
      this.tagModalVisible = true;
    },

    removeTag(row) {
      this.$confirm(`确认删除标签【${row.tagName}】？`, '提示', { type: 'warning' })
        .then(() => {
          const result = deleteTag(row.id);
          if (!result.success) {
            this.$message.warning(result.message);
            return;
          }
          this.$message.success('删除成功（模拟）');
          this.loadTableData();
        })
        .catch(() => {});
    },

    toggleStatus(row, enabled) {
      const actionText = enabled ? '启用' : '停用';
      this.$confirm(`确认${actionText}标签【${row.tagName}】？`, '提示', { type: 'warning' })
        .then(() => {
          const result = toggleTagStatus(row.id, enabled);
          if (!result.success) {
            this.$message.warning(result.message);
            return;
          }
          this.$message.success(`${actionText}成功（模拟）`);
          this.loadTableData();
        })
        .catch(() => {});
    },

    getTableClientHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const searchH = this.$refs.pageSearch ? this.$refs.pageSearch.clientHeight : 0;
        this.tableHeight = offsetH - 72 - 48 - 40 - searchH - 20;
      });
    }
  }
};
</script>

<style scoped>
.tag-table-wrap {
  overflow: hidden;
}
.index-cell {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
}
.expand-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  margin-right: 2px;
  cursor: pointer;
  color: #606266;
}
.expand-trigger:hover {
  color: #007873;
}
.expand-placeholder {
  display: inline-block;
  width: 18px;
  margin-right: 2px;
}
.tag-name-child {
  display: inline-block;
  padding-left: 20px;
}
</style>
