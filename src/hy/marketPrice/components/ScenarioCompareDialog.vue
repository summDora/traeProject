<template>
  <el-dialog
    :visible="visible"
    width="960px"
    append-to-body
    :show-close="true"
    custom-class="scenario-compare-dialog"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div slot="title" class="dialog-title">方案对比</div>

    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th class="label-col">序号</th>
            <th
              v-for="item in compareList"
              :key="'head-' + item.id"
              class="data-col"
            >
              {{ item.index }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rowDefs" :key="row.key">
            <td class="label-col">{{ row.label }}</td>
            <td
              v-for="item in compareList"
              :key="row.key + '-' + item.id"
              class="data-col"
            >
              <a
                v-if="row.key === 'curve'"
                href="javascript:;"
                class="detail-link"
                @click.prevent="showCurveDetail(item)"
              >
                详情
              </a>
              <span v-else>{{ item[row.key] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 96点曲线详情 -->
    <el-dialog
      :visible="curveDetailVisible"
      width="800px"
      append-to-body
      :title="curveDetailTitle"
      @close="closeCurveDetail"
    >
      <div ref="curveChart" class="curve-chart"></div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import * as echarts from "echarts";
import {
  buildCompareDetails,
  buildSingleCurveOption,
} from "../utils/scenarioCompare";

export default {
  name: "ScenarioCompareDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    scenarios: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      compareList: [],
      curveDetailVisible: false,
      curveDetailTitle: "",
      curveChart: null,
      rowDefs: [
        { key: "name", label: "场景名称" },
        { key: "forecastType", label: "预测类型" },
        { key: "dimension", label: "预测周期维度" },
        { key: "version", label: "版本号" },
        { key: "createTime", label: "创建时间" },
        { key: "avg", label: "平均值" },
        { key: "max", label: "最大值" },
        { key: "min", label: "最小值" },
        { key: "curve", label: "96点预测曲线" },
      ],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.compareList = buildCompareDetails(this.scenarios);
      } else {
        this.closeCurveDetail();
      }
    },
    scenarios: {
      deep: true,
      handler(val) {
        if (this.visible) {
          this.compareList = buildCompareDetails(val);
        }
      },
    },
  },
  beforeDestroy() {
    this.disposeCurveChart();
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    handleDialogClose() {
      if (this.visible) {
        this.closeDialog();
      }
    },
    showCurveDetail(item) {
      this.curveDetailTitle = `${item.name} - 96点预测曲线`;
      this.curveDetailVisible = true;
      this.$nextTick(() => {
        this.renderCurveChart(item);
      });
    },
    closeCurveDetail() {
      this.curveDetailVisible = false;
      this.disposeCurveChart();
    },
    disposeCurveChart() {
      if (this.curveChart) {
        this.curveChart.dispose();
        this.curveChart = null;
      }
    },
    renderCurveChart(item) {
      const el = this.$refs.curveChart;
      if (!el) return;

      this.disposeCurveChart();
      this.curveChart = echarts.init(el);
      this.curveChart.setOption(buildSingleCurveOption(item), true);
      this.curveChart.resize();
    },
  },
};
</script>

<style scoped>
.dialog-title {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
}

.compare-table-wrap {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 14px;
  color: #303133;
}

.compare-table th,
.compare-table td {
  border: 1px solid #dcdfe6;
  padding: 12px 8px;
  text-align: center;
  vertical-align: middle;
  word-break: break-all;
}

.compare-table thead th {
  background: #f5f7fa;
  font-weight: 600;
}

.label-col {
  width: 130px;
  background: #f5f7fa;
  font-weight: 500;
}

.data-col {
  min-width: 140px;
}

.detail-link {
  color: #409eff;
  text-decoration: none;
  cursor: pointer;
}

.detail-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}

.curve-chart {
  width: 100%;
  height: 360px;
}
</style>

<style>
.scenario-compare-dialog .el-dialog__header {
  background: #409eff;
  padding: 14px 20px;
  margin-right: 0;
}

.scenario-compare-dialog .el-dialog__headerbtn {
  top: 14px;
  right: 16px;
}

.scenario-compare-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
  font-size: 18px;
}

.scenario-compare-dialog .el-dialog__headerbtn .el-dialog__close:hover {
  color: #ecf5ff;
}

.scenario-compare-dialog .el-dialog__body {
  padding: 0;
}

.scenario-compare-dialog .compare-table-wrap {
  padding: 0;
}
</style>
