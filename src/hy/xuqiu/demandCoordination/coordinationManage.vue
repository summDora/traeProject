<template>
  <section>
    <xuqiu-page-header
      title="需求统筹列表"
      :sub-title="displaySubTitle"
      @back="goBack"
    />

    <div ref="pageSearch">
      <hyNewButtons
        :buttonsData="buttonsConfig"
        @selectButtons="selectButtons"
        style="padding: 10px; box-sizing: border-box; justify-content: flex-start;"
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
        @handleSelectionChange="handleSelectionChange"
      >
        <template slot="operation" slot-scope="{ data }">
          <el-button type="text" @click.stop="cancelFeasibility(data)">取消进入可研</el-button>
        </template>
      </newTable>
    </div>
  </section>
</template>

<script>
import { manageButtonsConfig, manageTableColumn } from './config.js';
import { getManageList } from './mockData.js';

export default {
  name: 'coordinationManage',

  props: {
    batchCode: {
      type: String,
      default: ''
    },
    batchName: {
      type: String,
      default: ''
    },
    planYear: {
      type: [String, Number],
      default: ''
    }
  },

  data() {
    return {
      buttonsConfig: manageButtonsConfig,
      tableColumn: manageTableColumn,
      tableData: [],
      tableHeight: 0,
      selectData: []
    };
  },

  computed: {
    displaySubTitle() {
      return this.planYear ? `${this.planYear}${this.batchName}` : this.batchName;
    }
  },

  mounted() {
    this.tableData = getManageList(this.batchName, this.batchCode);
    this.getTableClientHeight();
    window.addEventListener('resize', this.getTableClientHeight);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.getTableClientHeight);
  },

  methods: {
    selectButtons({ id, text }) {
      const map = {
        0: '统筹推荐生成',
        1: '统筹存档',
        2: '统筹结果导出'
      };
      this.$message.success(`${map[id] || text}操作成功（模拟）`);
    },

    handleSelectionChange(val) {
      this.selectData = val;
    },

    cancelFeasibility(row) {
      this.$message.success(`已取消【${row.unitName}】进入可研（模拟）`);
    },

    goBack() {
      this.$emit('back');
    },

    getTableClientHeight() {
      this.$nextTick(() => {
        const offsetH = document.body.offsetHeight;
        const searchH = this.$refs.pageSearch ? this.$refs.pageSearch.clientHeight : 0;
        this.tableHeight = offsetH - 72 - 48 - 40 - 56 - searchH - 20;
      });
    }
  }
};
</script>

