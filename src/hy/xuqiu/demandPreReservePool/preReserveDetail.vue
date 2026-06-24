<template>
  <section>
    <xuqiu-page-header
      title="需求申报内容"
      :sub-title="`${detail.demandCode || ''} ${detail.demandName || ''}`.trim() || '—'"
      @back="goBack"
    />

    <div class="section-title">基础信息</div>
    <div class="info-section info-grid">
      <div class="info-row"><span class="label">需求名称：</span><span>{{ detail.demandName || '—' }}</span></div>
      <div class="info-row"><span class="label">业务主管部门：</span><span>{{ detail.businessDepartment || '—' }}</span></div>
      <div class="info-row"><span class="label">预储备计划批次：</span><span>{{ detail.preReserveBatch || '—' }}</span></div>
      <div class="info-row"><span class="label">需求优先级(部门)：</span><span>{{ detail.deptPriority || '—' }}</span></div>
      <div class="info-row"><span class="label">业务需求类别：</span><span>{{ detail.businessCategory || '—' }}</span></div>
    </div>

    <div class="section-title">需求详情信息</div>
    <div class="info-section info-grid">
      <div class="info-row"><span class="label">计划总投资(万元)：</span><span>{{ detail.totalInvestment || '—' }}</span></div>
      <div class="info-row"><span class="label">需求负责人：</span><span>{{ detail.demandLeader || '—' }}</span></div>
      <div class="info-row"><span class="label">需求提出部门：</span><span>{{ detail.demandDepartment || '—' }}</span></div>
      <div class="info-row full-row"><span class="label">备注：</span><span>{{ detail.remark || '—' }}</span></div>
      <div class="info-row full-row block-row"><span class="label">业务需求描述：</span><span>{{ detail.requirementDesc || '—' }}</span></div>
      <div class="info-row full-row block-row"><span class="label">预期目标及成效：</span><span class="pre-line">{{ detail.expectedGoals || '—' }}</span></div>
    </div>

    <div class="section-title">关联项目情况</div>
    <div class="table-section">
      <el-table :data="detail.relatedProjects || []" border size="small">
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="projectCode" label="项目编号" min-width="120" />
        <el-table-column prop="projectName" label="项目名称" min-width="220" show-overflow-tooltip />
        <el-table-column prop="constructionUnit" label="建设单位" min-width="120" />
        <el-table-column label="项目状态" width="100" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.statusClass">{{ scope.row.projectStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成效评价结果" width="120" align="center">
          <template slot-scope="scope">
            <span :class="scope.row.effectClass">{{ scope.row.effectResult }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="section-title">查重结果</div>
    <div class="info-section dup-section">
      <span class="dup-value">{{ detail.duplicateResult || '—' }}</span>
      <el-button
        v-if="detail.duplicateReportName"
        type="text"
        icon="el-icon-download"
        @click="downloadReport"
      >下载报告</el-button>
    </div>
  </section>
</template>

<script>
import { getPreReserveDetail } from './mockData.js';

export default {
  name: 'preReserveDetail',

  props: {
    demandId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      detail: {}
    };
  },

  mounted() {
    this.loadDetail();
  },

  watch: {
    demandId() {
      this.loadDetail();
    }
  },

  methods: {
    loadDetail() {
      this.detail = getPreReserveDetail(this.demandId);
    },

    downloadReport() {
      this.$message.success(`已开始下载 ${this.detail.duplicateReportName}（模拟）`);
    },

    goBack() {
      this.$emit('back');
    }
  }
};
</script>

<style scoped>
.section-title {
  background: #e6f3f1;
  padding: 8px 12px;
  margin: 16px 0 8px;
  font-weight: bold;
}
.info-section {
  padding: 8px 12px;
}
.info-grid {
  display: flex;
  flex-wrap: wrap;
}
.info-row {
  display: flex;
  width: 33.33%;
  line-height: 32px;
  min-width: 280px;
}
.full-row {
  width: 100%;
}
.block-row {
  align-items: flex-start;
}
.label {
  width: 140px;
  text-align: right;
  color: #606266;
  margin-right: 12px;
  flex-shrink: 0;
}
.pre-line {
  white-space: pre-line;
}
.table-section {
  padding: 8px 12px;
}
.dup-section {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dup-value {
  font-weight: bold;
  font-size: 16px;
}
.status-review { color: #409eff; }
.status-build { color: #e6a23c; }
.status-done { color: #67c23a; }
</style>
