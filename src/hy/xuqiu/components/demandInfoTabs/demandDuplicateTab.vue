<template>
  <div class="demand-info-panel duplicate-compare-panel">
    <table class="duplicate-compare-table">
      <thead>
        <tr>
          <th class="col-index">序号</th>
          <th class="col-group"></th>
          <th class="col-field">显示字段名称</th>
          <th class="col-current">查重需求</th>
          <th class="col-similar">
            相似需求top1
            <span class="similar-rate">{{ compare.top1Rate }}</span>
          </th>
          <th class="col-similar">
            相似需求top2
            <span class="similar-rate">{{ compare.top2Rate }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="group in compare.groups">
          <tr
            v-for="(row, rowIndex) in group.rows"
            :key="`${group.name}-${row.field}`"
          >
            <td class="col-index">{{ rowIndex + 1 }}</td>
            <td
              v-if="rowIndex === 0"
              class="col-group group-name"
              :rowspan="group.rows.length"
            >{{ group.name }}</td>
            <td class="col-field">{{ row.field }}</td>
            <td class="col-current">
              <el-button
                v-if="row.currentLink"
                type="text"
                @click="openLink(row.current)"
              >{{ row.current }}</el-button>
              <span v-else>{{ row.current || '' }}</span>
            </td>
            <td class="col-similar">
              <el-button
                v-if="row.top1Link"
                type="text"
                @click="openLink(row.top1)"
              >{{ row.top1 }}</el-button>
              <span v-else>{{ row.top1 || '' }}</span>
            </td>
            <td class="col-similar">
              <el-button
                v-if="row.top2Link"
                type="text"
                @click="openLink(row.top2)"
              >{{ row.top2 }}</el-button>
              <span v-else>{{ row.top2 || '' }}</span>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'demandDuplicateTab',

  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    compare() {
      return this.data.duplicateCompare || { top1Rate: '', top2Rate: '', groups: [] };
    }
  },

  methods: {
    openLink(text) {
      if (!text) return;
      this.$message.info(`查看 ${text}（模拟）`);
    }
  }
};
</script>

<style lang="less">
@import './demandInfoPanel.less';

.duplicate-compare-panel {
  overflow: auto;
}

.duplicate-compare-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #303133;

  th,
  td {
    border: 1px solid #dfe6ec;
    padding: 10px 12px;
    text-align: left;
    vertical-align: middle;
    line-height: 1.5;
  }

  thead th {
    background: #e6f3f1;
    font-weight: 600;
    white-space: nowrap;
  }

  .col-index {
    width: 56px;
    text-align: center;
  }

  .col-group {
    width: 88px;
    text-align: center;
    background: #fafbfc;
  }

  .col-field {
    width: 140px;
    white-space: nowrap;
  }

  .group-name {
    font-weight: 600;
    color: #303133;
  }

  .similar-rate {
    color: #f56c6c;
    margin-left: 4px;
    font-weight: 600;
  }

  .el-button--text {
    padding: 0;
  }
}
</style>
