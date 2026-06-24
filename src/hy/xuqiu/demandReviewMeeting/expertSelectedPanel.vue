<template>
  <div class="expert-selected-panel">
    <div class="hy-new-search-box panel-search">
      <hyProjectForm
        :formConfig="searchConfig"
        :formData="searchObj"
        :ifSearch="true"
        :isReset="true"
        @onSearch="filterList"
        @onReset="onReset"
      />
    </div>
    <div v-if="showToolbar" class="toolbar-wrap panel-toolbar">
      <hyNewButtons
        :buttonsData="toolbarButtons"
        @selectButtons="handleToolbarAction"
      />
    </div>
    <newTable
      :tableData="displayList"
      :column="tableColumn"
      :ifHaveIndex="true"
      :ifHaveCheckBox="true"
      :height="tableHeight"
      @handleSelectionChange="handleSelectionChange"
    >
      <template slot="reviewRole" slot-scope="{ data }">
        <el-select
          v-model="data.reviewRole"
          size="small"
          placeholder="请选择"
          @change="updateExpertField(data)"
        >
          <el-option
            v-for="item in reviewRoleOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </template>
      <template slot="expertType" slot-scope="{ data }">
        <el-select
          v-model="data.expertType"
          size="small"
          placeholder="请选择"
          @change="updateExpertField(data)"
        >
          <el-option
            v-for="item in expertTypeOptions"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </template>
    </newTable>
  </div>
</template>

<script>
import {
  expertSearchConfig,
  expertSearchData,
  expertSelectedColumn,
  expertSelectedButtonsConfig
} from './config.js';
import { reviewRoleOptions, expertTypeOptions } from './mockData.js';

export default {
  name: 'expertSelectedPanel',

  props: {
    experts: {
      type: Array,
      default: () => []
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    tableHeight: {
      type: [Number, String],
      default: 360
    }
  },

  data() {
    return {
      searchConfig: expertSearchConfig,
      searchObj: this.m_copy(expertSearchData),
      tableColumn: expertSelectedColumn,
      toolbarButtons: expertSelectedButtonsConfig,
      reviewRoleOptions,
      expertTypeOptions,
      displayList: [],
      selectData: []
    };
  },

  watch: {
    experts: {
      immediate: true,
      handler() {
        this.filterList();
      }
    }
  },

  methods: {
    filterList() {
      let list = this.experts.slice();
      if (this.searchObj.expertName) {
        list = list.filter((item) => item.expertName.includes(this.searchObj.expertName.trim()));
      }
      if (this.searchObj.unit) {
        list = list.filter((item) => item.unit.includes(this.searchObj.unit.trim()));
      }
      this.displayList = list;
    },

    onReset() {
      this.searchObj = this.m_copy(expertSearchData);
      this.filterList();
    },

    handleSelectionChange(val) {
      this.selectData = val;
      this.$emit('selection-change', val);
    },

    handleToolbarAction({ id, text }) {
      if (id === 2) {
        if (!this.selectData.length) {
          this.$message.warning('请先选择需要删除的专家');
          return;
        }
        const ids = this.selectData.map((item) => item.id);
        const nextList = this.experts.filter((item) => !ids.includes(item.id));
        this.selectData = [];
        this.emitExpertsChange(nextList);
        return;
      }
      this.$message.success(`${text}操作成功（模拟）`);
    },

    updateExpertField(row) {
      const nextList = this.experts.map((item) => (
        item.id === row.id
          ? { ...item, reviewRole: row.reviewRole, expertType: row.expertType }
          : item
      ));
      this.emitExpertsChange(nextList, false);
    },

    emitExpertsChange(nextList, refilter = true) {
      this.$emit('update:experts', nextList);
      this.$emit('change', nextList);
      if (refilter) {
        this.$nextTick(() => {
          this.filterList();
        });
      }
    }
  }
};
</script>

<style scoped>
.panel-search {
  margin-bottom: 0;
}
.panel-toolbar {
  border-top: none;
}
</style>
