<template>
  <div class="table-box">
    <el-table v-bind="{ ...$attrs, ...omit($props, 'headers') }" v-on="$listeners" ref="table" class="hyTableList" header-cell-class-name="header" @selection-change="handleSelectionChange">
      <el-table-column v-if="multiSelection" type="selection" width="55"> </el-table-column>
      <el-table-column v-for="item in headers" v-bind="omit(item, 'slot')" :key="item.id">
        <template v-if="item.slot" #default="scope">
          <slot :name="item.slot" v-bind="scope"></slot>
          <!--   -->
        </template>
      </el-table-column>
      <el-table-column v-if="showStatusTypes || showTestTypes || showUse" label="操作" :width="hadnlerWidth">
        <template slot-scope="scope">
          <el-button type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import omit from 'lodash/omit';
export default {
  name: 'hyTableList',
  props: {
    data: Array, //表格数据
    headers: Array, //表头数据
    stripe: {
      type: Boolean,
      default: true
    }, //是否为斑马纹 table
    showStatusTypes: {
      type: Boolean,
      default: false
    }, //是否根据状态是否显示操作按钮（上线、下线、撤销下线、编辑 等按钮·····）
    showTestTypes: {
      type: Boolean,
      default: false
    }, //是否根据状态是否显示操作按钮（测试按钮···）
    showUse: {
      type: Boolean,
      default: false
    }, //是否显示使用按钮
    size: {
      type: String
    },
    multiSelection: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    hadnlerWidth() {
      const s = this.data.map(v => v.status);
      if (s.includes('OFFLINED')) return '210px';
    }
  },
  methods: {
    toggleRowExpansion(...args) {
      this.$refs.table.toggleRowExpansion(...args);
    },
    /* 移除别的 */
    omit,
    /* 根据状态来显示展示哪个操作 */
    statusOf(index, type) {
      //
      return this.data[index].status === type;
    },
    /* 下线 */
    down(row, index) {
      this.$emit('down', row, index);
    },
    /* 撤销下线 */
    cancelDown(row, index) {
      this.$emit('cancelDown', row, index);
    },
    /* 上线 */
    up(row, index) {
      this.$emit('up', row, index);
    },
    /* 编辑 */
    edit(row, index) {
      this.$emit('edit', row, index);
    },
    /* 删除 */
    del(row, index) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      })
        .then(() => {
          this.$emit('del', row, index);
        })
        .catch(() => {});
    },
    /* 测试 */
    test(row, index) {
      this.$emit('test', row, index);
    },
    /* 使用 */
    toUse(row, index) {
      this.$emit('toUse', row, index);
    },
    handleSelectionChange(val) {
      this.$emit('SelectionChange', val);
    }
  }
};
</script>

<style scoped lang="scss">
.up {
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: var(--text-color-35);
  cursor: pointer;
}
.test {
  width: 46px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background-color: var(--text-color-05);
  font-size: 13px;
  font-weight: 400;
  color: var(--text-color-5);
  cursor: pointer;
}
.goup {
  display: inline-block;
  &:nth-of-type(1),
  &:nth-of-type(2) {
    margin-right: 15px;
  }
}
.table-box {
  padding: 30px;
  background-color: #fff;
  margin-bottom: 3%;
}
.hyTableList {
  & >>> .header {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    background-color: var(--text-color-05);
  }

  & >>> th,
  & >>> tr {
    background-color: var(--content-bg);
    color: var(--text-color);
    font-size: 13px;
    font-weight: 400;
    & td {
      padding: 4px 0;
      & .el-button--text {
        & i {
          margin-right: 6px;
        }
      }
    }
  }

  &.el-table--enable-row-transition >>> .el-table__body td {
    background-color: var(--content-bg);
  }

  &.el-table--striped >>> .el-table__body tr.el-table__row--striped td {
    background-color: var(--text-color-05);
    font-size: 13px;
    font-weight: 400;
    color: var(--text-color-07);
  }

  &.el-table--enable-row-hover >>> .el-table__body tr:hover > td {
    background-color: var(--text-color-05);
    font-size: 13px;
    font-weight: 400;
    color: var(--text-color-07);
  }
  &.el-table__row el-table__row--striped >>> .expanded {
    background-color: var(--text-color-05);
  }

  &.el-table--mini >>> td,
  &.el-table--mini >>> th {
    padding: 3px 0;
  }
}
</style>
