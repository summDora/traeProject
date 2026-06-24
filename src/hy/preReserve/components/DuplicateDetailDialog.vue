<template>
  <el-dialog
    title="相似需求明细"
    :visible.sync="dialogVisible"
    width="720px"
    append-to-body
    @close="handleClose"
  >
    <el-table :data="details" border size="small" max-height="360">
      <el-table-column prop="declarationNo" label="申报编号" min-width="140" />
      <el-table-column prop="requirementName" label="需求名称" min-width="200" show-overflow-tooltip />
      <el-table-column prop="projectType" label="项目类型" min-width="160" show-overflow-tooltip />
      <el-table-column label="相似度" width="90" align="center">
        <template slot-scope="scope">
          {{ formatSimilarity(scope.row.similarity) }}
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!details.length" class="empty-tip">暂无相似需求数据</div>
    <span slot="footer">
      <el-button type="primary" class="btn-teal" @click="dialogVisible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DuplicateDetailDialog',
  props: {
    visible: { type: Boolean, default: false },
    details: { type: Array, default: () => [] },
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      },
    },
  },
  methods: {
    formatSimilarity(val) {
      if (val == null || val === '') return '-';
      const num = Number(val);
      return Number.isNaN(num) ? val : `${num.toFixed(2)}%`;
    },
    handleClose() {
      this.$emit('update:visible', false);
    },
  },
};
</script>

<style scoped>
.empty-tip {
  text-align: center;
  color: #909399;
  padding: 24px 0;
}

.btn-teal {
  background-color: #00796b;
  border-color: #00796b;
}
</style>
