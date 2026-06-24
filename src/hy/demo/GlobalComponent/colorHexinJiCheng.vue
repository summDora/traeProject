<template>
  <div>
    <div class="searchCom" style="margin-bottom: 20px">
      <el-form :inline="true" :model="formInline" label-width="80px" label-position="right">
        <el-form-item label="项目名称">
          <el-input v-model="formInline.projectName" placeholder="请输入" maxlength="25" clearable style="width: 150px" @input="showSearchBar = false" />
        </el-form-item>
        <el-form-item label="系统名称">
          <el-input v-model="formInline.systemName" placeholder="请输入" maxlength="25" clearable style="width: 150px" @input="showSearchBar = false" />
        </el-form-item>
        <el-form-item label="资源集名称">
          <el-input v-model="formInline.ciId" placeholder="请输入" maxlength="25" clearable style="width: 150px" @input="showSearchBar = false" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search" style="border-radius: 8px">查询</el-button>
          <el-button type="info" @click="reset" style="border-radius: 8px">重置</el-button>
        </el-form-item>
      </el-form>
      <slot />
    </div>

    <el-row class="" style="margin: -20px 0px 36px 16px" v-if="showSearchBar">
      <!-- 仅项目名称 -->
      <span v-if="formInline.projectName && !formInline.systemName && !formInline.ciId"
        >项目"{{ formInline.projectName }}"："{{ colortext.systemNum }}"个系统，{{ colortext.ciIdNum }}个资源集</span
      >
      <!-- 仅系统名称 -->
      <span v-if="formInline.systemName && !formInline.projectName && !formInline.ciId"
        >系统"{{ formInline.systemName }}"："{{ pagination.total }}"个项目，{{ colortext.ciIdNum }}个资源集</span
      >
      <!-- 仅资源集 -->
      <span v-if="formInline.ciId && !formInline.systemName && !formInline.projectName"
        >资源集"{{ formInline.ciId }}"："{{ pagination.total }}"个项目，{{ colortext.systemNum }}个系统</span
      >
      <!-- 项目名称+系统 -->
      <span v-if="formInline.projectName && formInline.systemName && !formInline.ciId"
        >项目"{{ formInline.projectName }}"，系统"{{ formInline.systemName }}"：{{ colortext.ciIdNum }}个资源集</span
      >
      <!-- 项目名称+资源集 -->
      <span v-if="formInline.projectName && !formInline.systemName && formInline.ciId"
        >项目"{{ formInline.projectName }}"，资源集"{{ formInline.ciId }}"：{{ colortext.systemNum }}个系统</span
      >
      <!-- 系统名称+资源集 -->
      <span v-if="!formInline.projectName && formInline.systemName && formInline.ciId"
        >系统"{{ formInline.systemName }}"，资源集"{{ formInline.ciId }}"：{{ pagination.total }}个项目</span
      >
      <!-- 全部 -->
      <span v-if="formInline.projectName && formInline.systemName && formInline.ciId"
        >项目"{{ formInline.projectName }}"，系统"{{ formInline.systemName }}"，资源集"{{ formInline.ciId }}"：{{ pagination.total }}条数据</span
      >
    </el-row>

    <el-row class="coler" style="margin: -20px 1rem 1rem; border: 2px solid rgb(111, 174, 168); border-radius: 3px">
      <!-- <el-row class="coler" style="margin: -20px 1rem 1rem; border: 2px solid rgb(111, 174, 168); border-radius: 3px"> -->
      <!-- <el-col :span="9" class="coler">
        <div
          class="coler"
          style="width: 100%; height: 100%; background: var(--Light-Vis-Vg---hi-vis-vg6, linear-gradient(153deg, #49b2bd 16.67%, #3085b5 100%))"
        >
          <el-row class="coler">
            <el-col :span="8" class="coler" style="display: flex">
              <div class="normalOne">
                <!-- <img src="../../images/xiangmu/df.png" alt="" style="width: 3.5rem" /> -->
                <div>
                  <div class="number">{{ colortext.projectAvgScore || 0 }}</div>
                  <div class="text">项目平均分</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="coler" style="display: flex; align-items: center">
              <!-- <img src="../../images/xiangmu/zbkbj.png" alt="" style="position: absolute" /> -->
              <div>
                <div style="margin: 10px">
                  <span class="text"> 一般项目:</span>
                  <span class="text"> {{ colortext.generalProjectAvgScore || 0 }}</span>
                </div>
                <div>
                  <span class="text"> 数据工程项目:</span>
                  <span class="text"> {{ colortext.dataProjectAvgScore || 0 }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="coler" style="display: flex">
              <div class="normalOne">
                <!-- <img src="../../images/xiangmu/bg.png" alt="" style="width: 4.5rem" /> -->
                <div>
                  <div class="number">{{ colortext.appraiseReportNum || 0 }}</div>
                  <div class="text">评价报告总数</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col> -->
      <el-col :span="24" class="coler">
        <el-row class="coler" type="flex" justify="space-around">
          <!-- <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #009a964d 0%, #009a961a 100%)">
              <!-- <img src="../../images/xiangmu/kf.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ (colortext.rdsDiskUsageAvg ? colortext.rdsDiskUsageAvg : 0) + '%' || 0 }}</div>
                <div class="text1">RDS磁盘使用率</div>
              </div>
            </div>
          </el-col> -->
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #ff8f2e4d 0%, #ff8f2e1a 100%)">
              <!-- <img src="../../images/xiangmu/yx.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ (colortext.ecsCpuUsageAvg ? colortext.ecsCpuUsageAvg : 0) + '%' || 0 }}</div>
                <div class="text1">应用服务器CPU平均利用率</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #4fb2e54d 0%, #4fb2e51a 100%)">
              <!-- <img src="../../images/xiangmu/sy.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ (colortext.ecsMemoryUsageAvg ? colortext.ecsMemoryUsageAvg : 0) + '%' || 0 }}</div>
                <div class="text1">应用服务器内存平均利用率</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #6d80ff4d 0%, #6d80ff1a 100%)">
              <!-- <img src="../../images/xiangmu/gx.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ (colortext.rdsCpuUsageAvg ? colortext.rdsCpuUsageAvg : 0) + '%' || 0 }}</div>
                <div class="text1">数据库CPU平均利用率</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #ff6d914d 0%, #ff6d921a 100%)">
              <!-- <img src="../../images/xiangmu/zd.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ (colortext.rdsMemoryUsageAvg ? colortext.rdsMemoryUsageAvg : 0) + '%' || 0 }}</div>
                <div class="text1">数据库内存平均利用率</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <div style="margin: 10px 0px; font-size: 16px; font-weight: bold; color: black">资源运行明细列表</div>
    <div :style="'flex: 1; border-top: 3px solid #6faea8'">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        :style="'min-height:400px'"
        height="100%"
        @selection-change="handleSelectionChange"
        :header-cell-style="headerCellStyle"
        @row-click="rowDbClick"
      >
        <!-- 列表区【选择】【序号】【需求年份】【资源集】【项目编号】【评价计划名称】【项目名称】【应用服务器CPU平均利用率】
         【应用服务器内存平均利用率】【数据库CPU平均利用率】【数据库内存平均利用率】【系统注册用户数】【所属分区】
         【数据热度】【系统数据表总量】【需求提出单位】【项目描述】 -->
        <!-- 【应用服务器CPU平均利用率applicationServerCpuAvgUseRatio】【应用服务器内存平均利用率applicationServerMemoryAvgUseRatio】【数据库CPU平均利用率databaseCpuAvgUseRatio】
         【数据库内存平均利用率databaseMemoryAvgUseRatio】【系统注册用户数businessUserRegNum】【所属分区zone】【数据热度dataHot】【系统数据表总量dbTableNumber】 -->
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column type="index" width="55" align="center" fixed label="序号"> </el-table-column>
        <el-table-column prop="appraiseYear" label="评价年份" fixed> </el-table-column>
        <el-table-column prop="systemName" label="系统名称" fixed> </el-table-column>

        <el-table-column prop="ciId" label="资源集" fixed>
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.ciId }}
              </div>
              <div class="qiPaoStyle">{{ row.ciId }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="projectCode" label="项目编号" fixed>
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.projectCode }}
              </div>
              <div class="qiPaoStyle">{{ row.projectCode }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="appraiseName" width="120" label="评价名称" fixed>
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.appraiseName }}
              </div>
              <div class="qiPaoStyle">{{ row.appraiseName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" width="100" label="项目名称" fixed>
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.projectName }}
              </div>
              <div class="qiPaoStyle">{{ row.projectName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="coreStatus" label="项目状态"> </el-table-column>
        <el-table-column prop="applicationServerCpuAvgUseRatio" label="应用服务器CPU平均利用率"> </el-table-column>
        <el-table-column prop="applicationServerMemoryAvgUseRatio" label="应用服务器内存平均利用率"> </el-table-column>
        <el-table-column prop="databaseCpuAvgUseRatio" label="数据库CPU平均利用率"> </el-table-column>
        <el-table-column prop="databaseMemoryAvgUseRatio" label="数据库内存平均利用率"> </el-table-column>
        <el-table-column prop="businessUserRegNum" label="系统注册用户数"> </el-table-column>
        <!-- <el-table-column prop="zone" label="所属分区">
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.zone }}
              </div>
              <div class="qiPaoStyle">{{ row.zone }}</div>
            </el-tooltip>
          </template>
        </el-table-column> -->
        <el-table-column prop="dataHot" label="数据热度"> </el-table-column>
        <el-table-column prop="dbTableNumber" label="系统数据表总量"> </el-table-column>
        <el-table-column prop="demandReportUnitName" width="200" label="需求提出单位">
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.demandReportUnitName }}
              </div>
              <div class="qiPaoStyle">{{ row.demandReportUnitName }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="projectDescription" width="455" label="项目描述">
          <template slot-scope="{ row }">
            <el-tooltip>
              <div slot="content" style="max-width: 500px">
                {{ row.projectDescription }}
              </div>
              <div class="qiPaoStyle">{{ row.projectDescription }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ThePagination :pageSize.sync="pagination.pageSize" :pageNumber.sync="pagination.pageNumber" :total="pagination.total" @refreshList="query"></ThePagination>
  </div>
</template>
<script>
import {
  projectCoreAvg, // 资源数据统计
} from '/src/api/moXingGuanli.js'
import maxin from '../../vuePlugin/maxin.js'

export default {
  name: 'colorHexinJiCheng',
  mixins: [maxin],

  props: {},

  data() {
    return {
      formInline: {},
      showSearchBar: false,
      pagination: {
        pageNumber: 1,
        pageSize: 20,
        total: 0,
      },
      tableData: [],
      projectName: '',
      colortext: {},
    }
  },
  created() {},
  methods: {
    rowDbClick(e) {},

    reset() {
      this.formInline = {}
      this.showSearchBar = false
      this.query()
    },
    search() {
      if (this.formInline.projectName || this.formInline.systemName || this.formInline.ciId) {
        this.showSearchBar = true
      } else {
        this.showSearchBar = false
      }
      this.query()
    },
    query() {
      let params = Object.assign({}, this.pagination, this.formInline)
      this.m_apiFn(projectCoreAvg, params)
        .then(data => {
          if (data && data.result) {
            this.projectName = this.formInline.projectName
            console.log(data.result)
            this.colortext = data.result
            this.tableData = data.result.projectList.records
            this.pagination.total = data.result.projectList.total
          }
        })
        .catch()
    },
  },
}
</script>
<style scoped lang="less">
.coler {
  height: 10rem;
}
.number {
  font-size: 32px;
  color: white;
  font-family: system-ui;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.text {
  font-size: 15px;
  color: white;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.normalOne {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.number1 {
  font-size: 24px;
  color: black;
  font-family: emoji;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.text1 {
  font-size: 14px;
  color: #00000080;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.normalOne1 {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 95%;
  margin: auto;
  height: 60%;
  border-radius: 5px;
}

.page11-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

.stats-grid {
  display: flex;
  gap: 20px;
}

.stat-card {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
}

.stat-card.green {
  background: linear-gradient(135deg, #e8f5e9 0%, #fff 100%);
  border: 1px solid #4caf50;
}

.stat-card.green .stat-icon-wrap {
  background-color: #81c784;
  color: #fff;
}

.stat-card.green .stat-value {
  color: #4caf50;
}

.stat-card.blue {
  border: 1px solid #64b5f6;
  background: linear-gradient(135deg, #e3f2fd 0%, #fff 100%);
}

.stat-card.blue .stat-icon-wrap {
  background-color: #64b5f6;
  color: #fff;
}

.stat-card.blue .stat-value {
  color: #2196f3;
}

.stat-card.orange {
  border: 1px solid #ffb74d;
  background: linear-gradient(135deg, #fff3e0 0%, #fff 100%);
}

.stat-card.orange .stat-icon-wrap {
  background-color: #ffb74d;
  color: #fff;
}

.stat-card.orange .stat-value {
  color: #ff9800;
}

.stat-card.purple {
  border: 1px solid #ba68c8;
  background: linear-gradient(135deg, #f3e5f5 0%, #fff 100%);
}

.stat-card.purple .stat-icon-wrap {
  background-color: #ba68c8;
  color: #fff;
}

.stat-card.purple .stat-value {
  color: #9c27b0;
}

.stat-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap svg {
  width: 28px;
  height: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-weight: bold;
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}
.page-header-bar {
  margin: 12px -12px -12px -12px;
  margin-bottom: 12px;
  padding: 12px 12px 12px 12px;
  border-bottom: 1px solid #e6e6e6;
}
.page-header-bar-title {
  font-size: 14px;
}
.page-header-bar-title > span {
  float: left;
  display: block;
  width: 4px;
  height: 24px;
  margin-right: 10px;
  margin-top: 4px;
  background-color: #007873;
}
.page-header-bar-title div {
  font-size: 16px;
  color: #007873;
  line-height: 32px;
  font-weight: bold;
}
.page-header-bar-title div b {
  color: #555;
  font-size: 12px;
  font-weight: 400;
  margin-left: 12px;
}
</style>
