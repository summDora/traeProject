<template>
  <div class="page-pre-reserve">
    <!-- 查询区 -->
    <div class="card search-card">
      <el-form :inline="true" :model="queryForm" class="search-form" size="small">
        <el-form-item label="申报编号">
          <el-input v-model="queryForm.declarationNo" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="需求名称">
          <el-input v-model="queryForm.requirementName" placeholder="请输入" clearable />
        </el-form-item>
        <el-form-item label="项目类型">
          <el-select v-model="queryForm.projectType" placeholder="请选择" clearable>
            <el-option
              v-for="item in projectTypes"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="需求提出部门">
          <el-select v-model="queryForm.department" placeholder="请选择" clearable>
            <el-option
              v-for="item in departments"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryForm.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="search-actions">
          <el-button type="primary" class="btn-teal" @click="handleSearch">查询</el-button>
          <el-button class="btn-reset" @click="handleReset">重置</el-button>
          <el-button type="text" class="link-advanced">高级查询 -></el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <el-button icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button icon="el-icon-close" @click="handleDelete">删除</el-button>
      <el-button icon="el-icon-upload2" @click="handleExport">导出</el-button>
      <el-button type="primary" class="btn-teal" @click="handleDuplicateCheck">一键查重</el-button>
    </div>

    <!-- 表格 -->
    <div class="card table-card">
      <el-table
        ref="table"
        v-loading="tableLoading"
        :data="pagedData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="48" align="center" />
        <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">
            {{ (currentPage - 1) * pageSize + scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column prop="declarationNo" label="申报编号" min-width="140" show-overflow-tooltip />
        <el-table-column prop="requirementName" label="需求名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="projectType" label="项目类型" min-width="180" show-overflow-tooltip />
        <el-table-column prop="coreSystem" label="核心系统" min-width="120" show-overflow-tooltip />
        <el-table-column prop="plannedInvestment" label="计划总投资（万元）" width="150" align="right" />
        <el-table-column prop="department" label="需求提出部门" min-width="120" show-overflow-tooltip />
        <el-table-column prop="personInCharge" label="需求负责人" width="110" />
        <el-table-column label="查重结果" width="100" align="center">
          <template slot-scope="scope">
            <span
              v-if="isClickableDup(scope.row)"
              class="dup-link"
              @click="openDupDetail(scope.row)"
            >{{ scope.row.duplicateResult }}</span>
            <span v-else>{{ scope.row.duplicateResult }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span :class="['status-tag', statusClass(scope.row.status)]">
              {{ scope.row.status }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="op-link" @click="handleDetail(scope.row)">详情</el-button>
            <el-button
              v-if="canEdit(scope.row.status)"
              type="text"
              class="op-link"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              v-if="scope.row.status === '暂存'"
              type="text"
              class="op-link"
              @click="handleSubmit(scope.row)"
            >提交</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <duplicate-detail-dialog
      :visible.sync="dupDialogVisible"
      :details="dupDialogDetails"
    />
  </div>
</template>

<script>
import DuplicateDetailDialog from './components/DuplicateDetailDialog.vue';
import {
  PROJECT_TYPES,
  STATUS_OPTIONS,
  DEPARTMENTS,
  formatDate,
  queryList,
  deleteRecords,
  canDelete,
  exportFields,
  toExportRow,
  runDuplicateCheck,
  updateRecord,
  refreshCache,
} from './utils/preReserveStore';

export default {
  name: 'PagePreReserveList',
  components: { DuplicateDetailDialog },
  data() {
    return {
      projectTypes: PROJECT_TYPES,
      statusOptions: STATUS_OPTIONS,
      departments: DEPARTMENTS,
      queryForm: {
        declarationNo: '',
        requirementName: '',
        projectType: '',
        department: '',
        status: '',
      },
      activeQuery: {},
      filteredList: [],
      selectedRows: [],
      currentPage: 1,
      pageSize: 20,
      tableLoading: false,
      dupDialogVisible: false,
      dupDialogDetails: [],
      dupCheckTimer: null,
    };
  },
  computed: {
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    $route(to) {
      if (to.name === 'PreReserveList') {
        this.loadData();
      }
    },
  },
  beforeDestroy() {
    if (this.dupCheckTimer) {
      clearInterval(this.dupCheckTimer);
    }
  },
  methods: {
    loadData() {
      refreshCache();
      this.filteredList = queryList(this.activeQuery);
    },
    handleSearch() {
      this.activeQuery = { ...this.queryForm };
      this.currentPage = 1;
      this.loadData();
    },
    handleReset() {
      this.queryForm = {
        declarationNo: '',
        requirementName: '',
        projectType: '',
        department: '',
        status: '',
      };
      this.activeQuery = {};
      this.currentPage = 1;
      this.loadData();
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows;
    },
    handleAdd() {
      this.$router.push({ name: 'PreReserveAdd' });
    },
    handleDetail(row) {
      this.$router.push({ name: 'PreReserveAdd', query: { id: row.id, mode: 'detail' } });
    },
    handleEdit(row) {
      this.$router.push({ name: 'PreReserveAdd', query: { id: row.id, mode: 'edit' } });
    },
    handleSubmit(row) {
      this.$confirm('确认提交该需求？提交后将进入审核流程。', '提交确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
      }).then(() => {
        updateRecord(row.id, { status: '审核中' });
        this.$message.success('提交成功！');
        this.loadData();
      }).catch(() => {});
    },
    handleDelete() {
      if (!this.selectedRows.length) {
        this.$message.warning('请先选择需要删除的数据');
        return;
      }
      const invalid = this.selectedRows.filter((r) => !canDelete(r.status));
      if (invalid.length) {
        this.$message.warning('仅暂存状态的数据允许删除！');
        return;
      }
      this.$confirm('确认删除所选数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        deleteRecords(this.selectedRows.map((r) => r.id));
        this.$message.success('删除成功！');
        this.selectedRows = [];
        this.loadData();
      }).catch(() => {});
    },
    handleExport() {
      const list = queryList(this.activeQuery);
      if (!list.length) {
        this.$message.warning('暂无可导出的数据！');
        return;
      }
      const fields = exportFields();
      const header = fields.map((f) => f.label).join(',');
      const rows = list.map((record) => {
        const row = toExportRow(record);
        return fields.map((f) => {
          const val = String(row[f.key] || '').replace(/"/g, '""');
          return `"${val}"`;
        }).join(',');
      });
      const bom = '\uFEFF';
      const csv = bom + [header, ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `预储备提报列表_${formatDate()}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      this.$message.success('导出成功');
    },
    handleDuplicateCheck() {
      if (!this.selectedRows.length) {
        this.$message.warning('请先选择需要查重的数据');
        return;
      }
      const ids = this.selectedRows.map((r) => r.id);
      this.tableLoading = true;
      runDuplicateCheck(ids, { isCityUser: true })
        .then((res) => {
          this.tableLoading = false;
          if (!res.ok) {
            this.$message.warning(res.message || '查重失败，请稍后重试！');
            this.loadData();
            return;
          }
          this.$message.success('查重完成！');
          this.loadData();
          this.startDupPolling();
        })
        .catch(() => {
          this.tableLoading = false;
          this.$message.error('查重失败，请稍后重试！');
        });
    },
    startDupPolling() {
      if (this.dupCheckTimer) clearInterval(this.dupCheckTimer);
      let count = 0;
      this.dupCheckTimer = setInterval(() => {
        this.loadData();
        count += 1;
        const checking = this.filteredList.some((r) => r.duplicateResult === '查重中');
        if (!checking || count > 10) {
          clearInterval(this.dupCheckTimer);
          this.dupCheckTimer = null;
        }
      }, 500);
    },
    isClickableDup(row) {
      return row.duplicatePercent != null && row.duplicateResult !== '未查重' && row.duplicateResult !== '查重中';
    },
    openDupDetail(row) {
      this.dupDialogDetails = row.duplicateDetails || [];
      this.dupDialogVisible = true;
    },
    canEdit(status) {
      return ['驳回', '需求合并', '需求拆分', '暂存'].includes(status);
    },
    statusClass(status) {
      const map = {
        已储备: 'status-reserved',
        审核中: 'status-review',
        驳回: 'status-reject',
        暂存: 'status-draft',
      };
      return map[status] || 'status-default';
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.currentPage = 1;
    },
    handleCurrentChange(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.page-pre-reserve {
  min-height: calc(100vh - 96px);
}

.card {
  background: #fff;
  border-radius: 4px;
  padding: 16px 20px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.search-card {
  margin-bottom: 12px;
}

.search-form >>> .el-form-item {
  margin-bottom: 8px;
  margin-right: 16px;
}

.search-form >>> .el-input,
.search-form >>> .el-select {
  width: 160px;
}

.search-actions {
  float: right;
  margin-right: 0 !important;
}

.btn-teal {
  background-color: #00796b !important;
  border-color: #00796b !important;
}

.btn-teal:hover,
.btn-teal:focus {
  background-color: #00695c !important;
  border-color: #00695c !important;
}

.btn-reset {
  color: #00796b;
  border-color: #00796b;
}

.link-advanced {
  color: #00796b;
  margin-left: 8px;
}

.toolbar {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.table-card {
  padding-bottom: 8px;
}

.dup-link {
  color: #00796b;
  cursor: pointer;
  text-decoration: underline;
}

.dup-link:hover {
  color: #00695c;
}

.op-link {
  color: #00796b !important;
  padding: 0 4px;
}

.status-tag {
  font-size: 13px;
}

.status-reserved { color: #67c23a; }
.status-review { color: #409eff; }
.status-reject { color: #f56c6c; }
.status-draft { color: #909399; }
.status-default { color: #606266; }

.pagination-wrap {
  margin-top: 16px;
  text-align: right;
}
</style>
