<template>
  <div class="page-async-task">
    <!-- 统计卡片 -->
    <div class="stats-row">
      <div
        v-for="card in statCards"
        :key="card.key"
        :class="['stat-card', { active: activeStat === card.key }]"
        @click="handleStatClick(card.key)"
      >
        <div class="stat-value">{{ card.value }}</div>
        <div class="stat-label">{{ card.label }}</div>
      </div>
    </div>

    <!-- 查询区 -->
    <div class="card filter-card">
      <el-form :inline="true" :model="searchObj" size="small" @submit.native.prevent>
        <el-form-item label="关键词">
          <el-input
            v-model="searchObj.keyword"
            placeholder="任务名称 / 编号 / 提交人"
            clearable
            style="width: 220px"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select
            v-model="searchObj.bizType"
            placeholder="全部"
            clearable
            style="width: 120px"
            @change="searchObj.bizStatus = ''"
          >
            <el-option
              v-for="item in bizTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="业务状态">
          <el-select
            v-model="searchObj.bizStatus"
            placeholder="全部"
            clearable
            :disabled="!searchObj.bizType"
            style="width: 140px"
          >
            <el-option
              v-for="item in bizStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提交时间">
          <el-date-picker
            v-model="searchObj.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            style="width: 260px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <div class="toolbar">
        <div class="toolbar-left">
          <el-button type="primary" plain size="small" :loading="tableLoading" @click="handleRefresh">
            刷新
          </el-button>
          <el-switch
            v-model="autoPoll"
            active-text="自动轮询"
            inactive-text=""
            style="margin-left: 16px"
          />
          <span v-if="hasRunningTasks && autoPoll" class="poll-tip">
            <i class="el-icon-loading" /> 有 {{ runningCount }} 个任务执行中，每 {{ pollInterval / 1000 }}s 自动刷新
          </span>
        </div>
        <div class="toolbar-right">
          <el-button type="success" plain size="small" @click="handleSimulateTask">
            模拟提交任务
          </el-button>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="card table-card">
      <el-table
        v-loading="tableLoading"
        :data="pagedData"
        border
        stripe
        style="width: 100%"
        row-key="taskId"
      >
        <el-table-column prop="taskId" label="任务编号" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="mono">{{ scope.row.taskId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskName" label="任务名称" min-width="180" show-overflow-tooltip />
        <el-table-column prop="bizTypeLabel" label="业务类型" width="100" align="center">
          <template slot-scope="scope">
            <el-tag size="small" type="info">{{ scope.row.bizTypeLabel || '-' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sourceModule" label="来源模块" width="130" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template slot-scope="scope">
            <span :class="['status-tag', statusClass(scope.row.status)]">
              {{ scope.row.statusLabel }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="进度" width="160" align="center">
          <template slot-scope="scope">
            <el-progress
              v-if="scope.row.status === 'running' || scope.row.status === 'pending'"
              :percentage="scope.row.progress || 0"
              :stroke-width="8"
              :show-text="true"
            />
            <span v-else>{{ scope.row.progress }}%</span>
          </template>
        </el-table-column>
        <el-table-column prop="failReason" label="失败原因" min-width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.failReason" class="fail-text">{{ scope.row.failReason }}</span>
            <span v-else class="text-muted">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="submitter" label="提交人" width="90" align="center" />
        <el-table-column prop="createdAtText" label="提交时间" width="170" align="center" />
        <el-table-column prop="durationText" label="耗时" width="100" align="center" />
        <el-table-column label="操作" width="200" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button type="text" class="op-link" @click="openDetail(scope.row)">详情</el-button>
            <el-button
              v-if="!scope.row.isTerminal"
              type="text"
              class="op-link"
              @click="refreshSingle(scope.row)"
            >刷新</el-button>
            <el-button
              v-if="scope.row.canRetry"
              type="text"
              class="op-link warn"
              @click="handleRetry(scope.row)"
            >重试</el-button>
            <el-button
              v-if="scope.row.canCancel"
              type="text"
              class="op-link danger"
              @click="handleCancel(scope.row)"
            >取消</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrap">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="[10, 20, 50]"
          :page-size="pageSize"
          :total="filteredList.length"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <task-detail-dialog
      :visible.sync="detailVisible"
      :task="detailTask"
      @retry="handleRetryFromDetail"
      @cancel="handleCancelFromDetail"
    />
  </div>
</template>

<script>
import TaskDetailDialog from './components/TaskDetailDialog.vue';
import { searchFormData } from './config.js';
import {
  fetchSearchOptions,
  getBizTypeOptions,
  getBizStatusOptions,
} from './utils/bizSearchOptions';
import {
  queryTaskList,
  queryTaskStatus,
  pollRunningTasks,
  retryTask,
  cancelTask,
  registerAsyncTask,
  enrichTaskList,
} from './utils/asyncTaskStore';

const POLL_INTERVAL = 3000;

export default {
  name: 'PageAsyncTaskMonitor',
  components: { TaskDetailDialog },
  data() {
    return {
      /** 后端返回的扁平搜索条件 [{ label, value, status }] */
      searchOptionList: [],
      searchObj: this.m_copy(searchFormData),
      activeQuery: {},
      activeStat: 'all',
      stats: {
        total: 0,
        pending: 0,
        running: 0,
        success: 0,
        failed: 0,
        cancelled: 0,
        timeout: 0,
      },
      filteredList: [],
      currentPage: 1,
      pageSize: 20,
      tableLoading: false,
      autoPoll: true,
      pollTimer: null,
      pollInterval: POLL_INTERVAL,
      detailVisible: false,
      detailTask: null,
    };
  },
  computed: {
    bizTypeOptions() {
      return getBizTypeOptions(this.searchOptionList);
    },
    bizStatusOptions() {
      return getBizStatusOptions(this.searchOptionList, this.searchObj.bizType);
    },
    statCards() {
      return [
        { key: 'all', label: '全部', value: this.stats.total },
        { key: 'running', label: '执行中', value: this.stats.running + this.stats.pending },
        { key: 'success', label: '成功', value: this.stats.success },
        { key: 'failed', label: '失败/超时', value: this.stats.failed + this.stats.timeout },
        { key: 'cancelled', label: '已取消', value: this.stats.cancelled },
      ];
    },
    pagedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredList.slice(start, start + this.pageSize);
    },
    hasRunningTasks() {
      return this.stats.pending > 0 || this.stats.running > 0;
    },
    runningCount() {
      return this.stats.pending + this.stats.running;
    },
  },
  mounted() {
    this.loadSearchOptions();
    this.loadData();
    this.startPolling();
  },
  beforeDestroy() {
    this.stopPolling();
  },
  watch: {
    autoPoll(val) {
      if (val && this.hasRunningTasks) {
        this.startPolling();
      } else {
        this.stopPolling();
      }
    },
    hasRunningTasks(val) {
      if (val && this.autoPoll) {
        this.startPolling();
      } else if (!val) {
        this.stopPolling();
      }
    },
  },
  methods: {
    loadSearchOptions() {
      fetchSearchOptions().then((res) => {
        if (!res.ok) return;
        this.searchOptionList = res.list || [];
      });
    },
    loadData(options = {}) {
      const { silent = false } = options;
      if (!silent) this.tableLoading = true;

      return queryTaskList(this.activeQuery)
        .then((res) => {
          if (!silent) this.tableLoading = false;
          if (!res.ok) return;
          this.stats = res.stats;
          this.filteredList = enrichTaskList(res.list);
        })
        .catch(() => {
          if (!silent) {
            this.tableLoading = false;
            this.$message.error('加载任务列表失败');
          }
        });
    },
    handleSearch() {
      this.activeQuery = { ...this.searchObj };
      this.applyStatFilter();
      this.currentPage = 1;
      this.loadData();
    },
    handleReset() {
      this.searchObj = this.m_copy(searchFormData);
      this.activeStat = 'all';
      this.handleSearch();
    },
    handleStatClick(key) {
      this.activeStat = key;
      this.applyStatFilter();
      this.currentPage = 1;
      this.loadData();
    },
    applyStatFilter() {
      const base = { ...this.searchObj, statusIn: [], status: '' };
      if (this.activeStat === 'running') {
        base.statusIn = ['pending', 'running'];
      } else if (this.activeStat === 'failed') {
        base.statusIn = ['failed', 'timeout'];
      } else if (this.activeStat !== 'all') {
        base.status = this.activeStat;
      }
      this.activeQuery = base;
    },
    handleRefresh() {
      pollRunningTasks().then(() => this.loadData());
    },
    refreshSingle(row) {
      queryTaskStatus(row.taskId).then((res) => {
        if (res.ok) {
          this.loadData({ silent: true });
          this.$message.success('状态已更新');
        }
      });
    },
    openDetail(row) {
      this.detailTask = { ...row };
      this.detailVisible = true;
    },
    handleRetry(row) {
      this.$confirm('确认重试该任务？', '提示', { type: 'warning' })
        .then(() => retryTask(row.taskId))
        .then((res) => {
          if (!res.ok) {
            this.$message.warning(res.message);
            return;
          }
          this.$message.success(res.message);
          this.loadData();
        })
        .catch(() => {});
    },
    handleCancel(row) {
      this.$confirm('确认取消该任务？取消后不可恢复。', '提示', { type: 'warning' })
        .then(() => cancelTask(row.taskId))
        .then((res) => {
          if (!res.ok) {
            this.$message.warning(res.message);
            return;
          }
          this.$message.success(res.message);
          this.loadData();
        })
        .catch(() => {});
    },
    handleRetryFromDetail(task) {
      this.detailVisible = false;
      this.handleRetry(task);
    },
    handleCancelFromDetail(task) {
      this.detailVisible = false;
      this.handleCancel(task);
    },
    handleSimulateTask() {
      const bizTypes = this.bizTypeOptions;
      if (!bizTypes.length) {
        this.$message.warning('搜索条件未加载');
        return;
      }
      const picked = bizTypes[Math.floor(Math.random() * bizTypes.length)];
      registerAsyncTask({
        taskName: `模拟${picked.label}任务-${Date.now().toString().slice(-4)}`,
        bizType: picked.value,
        requestSummary: '演示用模拟任务，用于测试轮询与状态展示',
      });
      this.$message.success('已提交模拟任务');
      this.activeStat = 'all';
      this.handleSearch();
    },
    startPolling() {
      if (this.pollTimer) return;
      this.pollTimer = setInterval(() => {
        if (!this.autoPoll || !this.hasRunningTasks) return;
        pollRunningTasks().then(() => this.loadData({ silent: true }));
      }, this.pollInterval);
    },
    stopPolling() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    },
    statusClass(status) {
      const map = {
        pending: 'status-pending',
        running: 'status-running',
        success: 'status-success',
        failed: 'status-failed',
        cancelled: 'status-cancelled',
        timeout: 'status-timeout',
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
.page-async-task {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.stat-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #f8f9ff 0%, #fff 100%);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 20px 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid #ebeef5;
}

.toolbar-left {
  display: flex;
  align-items: center;
}

.poll-tip {
  margin-left: 12px;
  font-size: 13px;
  color: #409eff;
}

.mono {
  font-family: 'SFMono-Regular', Consolas, monospace;
  font-size: 12px;
}

.status-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-pending { background: #fdf6ec; color: #e6a23c; }
.status-running { background: #ecf5ff; color: #409eff; }
.status-success { background: #f0f9eb; color: #67c23a; }
.status-failed { background: #fef0f0; color: #f56c6c; }
.status-cancelled { background: #f4f4f5; color: #909399; }
.status-timeout { background: #fef0f0; color: #f56c6c; }
.status-default { background: #f4f4f5; color: #606266; }

.fail-text {
  color: #f56c6c;
  font-size: 13px;
}

.text-muted {
  color: #c0c4cc;
}

.op-link {
  padding: 0 4px;
}

.op-link.warn {
  color: #e6a23c;
}

.op-link.danger {
  color: #f56c6c;
}

.pagination-wrap {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
