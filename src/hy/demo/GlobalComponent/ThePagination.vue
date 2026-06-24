<!--
 * @author SHUF
 * @date 2023-03-14 17:54:06
 * @Description  分页组件(全局注册)
-->
<template>
  <div class="table-pagination">
    <el-pagination layout="slot" :total="total">
      <div v-if="isTotal" class="totals">共&nbsp;{{ total || 0 }}&nbsp;项数据</div>
    </el-pagination>
    <el-pagination
      background
      :current-page="pageNumber"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      :pager-count="pageCount"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <div class="pagination-line junmper">
        <div style="padding: 0 8px 0 16px">跳至</div>
        <div class="junmper-pages">
          <el-input
            v-filter-input
            v-model="pageNum"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @keyup.native.enter="$event.target.blur()"
            @change="changePageNum"
          />
          <div class="pages-total">/&nbsp;{{ pages || 1 }}&nbsp;页</div>
        </div>
      </div>
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: 'ThePagination',
  props: {
    layout: {
      type: String,
      default: 'sizes, prev, pager, next, slot',
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageNumber: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    isTotal: {
      type: Boolean,
      default: true,
    },
    pageCount: {
      type: Number,
      default: 7,
    },
  },
  computed: {
    pages() {
      return Math.ceil(this.total / this.pageSize)
    },
  },
  watch: {
    pageNumber(val) {
      this.pageNum = Number(val)
    },
  },
  data() {
    return {
      pageNum: 1,
    }
  },
  methods: {
    // 改变每页显示数量
    handleSizeChange(val) {
      this.$emit('handleSize', val)
      this.$emit('update:pageSize', val)
      this.$emit('refreshList')
    },

    // 改变当前页码
    handleCurrentChange(val) {
      this.pageNum = val
      this.$emit('handleCurrent', val)
      this.$emit('update:pageNumber', val)
      this.$emit('refreshList')
    },
    // 手动输入页码
    changePageNum() {
      if (!this.pageNum) {
        this.pageNum = 1
      }
      if (this.pageNum >= this.pages) {
        this.pageNum = this.pages ? Number(this.pages) : 1
      }
      this.$emit('handleCurrent', Number(this.pageNum))
      this.$emit('update:pageNumber', Number(this.pageNum))
      this.$emit('refreshList')
    },
  },
}
</script>
<style lang="less" scoped>
.table-pagination {
  // border: 1px solid #ebeef5;
  border-top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  // padding: 16px 0 0 0;
  box-sizing: border-box;
  padding: 16px 24px;
  border: 1px solid #e7ebf2;
  border-top: 0;
  overflow: auto;
  .el-pagination {
    padding: 0;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    color: var(--hi-txt-tb1);
  }
  /deep/ .el-pagination__sizes,
  /deep/ .el-input--mini .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  /deep/ .el-pagination.is-background .btn-next,
  /deep/ .el-pagination.is-background .btn-prev,
  /deep/ .el-pagination.is-background .el-pager li {
    background-color: transparent;
    border: 1px solid var(--hi-line-l3);
    min-width: 32px;
    height: 32px;
    line-height: 32px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .el-pagination.is-background .el-pager {
    display: flex;
  }
  /deep/ .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: var(--hi-primary-p6);
    border: 0;
  }
  .pagination-line {
    display: flex;
    align-items: center;
  }
  .totals {
    color: var(--hi-txt-tb2);
  }
  .junmper {
    .junmper-pages {
      display: flex;
      height: 32px;
      line-height: 32px;
      border: 1px solid var(--hi-line-l3);
      border-radius: 3px;
      box-sizing: border-box;

      /deep/ .el-input {
        display: flex;
      }
      /deep/ .el-input__inner {
        border: 0;
        width: 60px;
        height: 100%;
        padding: 0 8px;
      }
    }
    .pages-total {
      display: flex;
      padding: 0 12px;
      border-left: 1px solid var(--hi-line-l3);
      background-color: var(--hi-fill-f4);
    }
  }
}
</style>
