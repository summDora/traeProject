<template>
  <el-dialog
    :visible="visible"
    width="960px"
    append-to-body
    :show-close="true"
    custom-class="predict-result-dialog"
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div slot="title" class="dialog-title">预测结果</div>

    <div class="result-content">
      <div class="info-row">
        <div class="info-item">
          <span class="info-label">场景名称：</span>
          <span class="info-value">{{ resultData.scenarioName }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">预测类型：</span>
          <span class="info-value">{{ resultData.forecastType }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">预测周期维度：</span>
          <span class="info-value">{{ resultData.dimension }}</span>
        </div>
      </div>

      <div class="chart-section">
        <div class="section-header">
          <span class="section-label">出力值（万千瓦）</span>
        </div>
        <div ref="resultChart" class="result-chart"></div>
      </div>

      <div class="stats-section">
        <div class="stat-card">
          <div class="stat-icon avg-icon">
            <span class="icon-text">avg</span>
          </div>
          <div class="stat-info">
            <div class="stat-label">平均值</div>
            <div class="stat-value">{{ resultData.avg }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon max-icon">
            <span class="icon-text">max</span>
          </div>
          <div class="stat-info">
            <div class="stat-label">最大值</div>
            <div class="stat-value">{{ resultData.max }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon min-icon">
            <span class="icon-text">min</span>
          </div>
          <div class="stat-info">
            <div class="stat-label">最小值</div>
            <div class="stat-value">{{ resultData.min }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import * as echarts from "echarts";
import { getTimePointLabels, generatePriceSeries } from "../utils/marketPrice";

export default {
  name: "PredictResultDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      chart: null,
      resultData: {
        scenarioName: "2026年负荷预测",
        forecastType: "2026年负荷预测",
        dimension: "冬季",
        avg: "7833.00",
        max: "11500.00",
        min: "6200.00",
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.$nextTick(() => {
          this.renderChart();
        });
      } else {
        this.disposeChart();
      }
    },
  },
  beforeDestroy() {
    this.disposeChart();
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
    disposeChart() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
    renderChart() {
      const el = this.$refs.resultChart;
      if (!el) return;

      this.disposeChart();
      this.chart = echarts.init(el);

      const xLabels = getTimePointLabels();
      const data = generatePriceSeries("predict_result");

      const option = {
        color: ["#409eff"],
        tooltip: {
          trigger: "axis",
          confine: true,
          formatter(params) {
            if (!params || !params.length) return "";
            const pointNum = params[0].axisValue.replace("时点", "");
            return `时点: ${pointNum}<br/>出力值: ${params[0].value}`;
          },
        },
        grid: {
          left: 50,
          right: 30,
          top: 40,
          bottom: 50,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xLabels,
          name: "时点",
          nameLocation: "middle",
          nameGap: 32,
          axisLabel: {
            interval: 8,
            fontSize: 11,
          },
          axisLine: {
            lineStyle: {
              color: "#dcdfe6",
            },
          },
        },
        yAxis: {
          type: "value",
          name: "出力值（万千瓦）",
          nameLocation: "end",
          nameGap: 40,
          min: 5000,
          max: 15000,
          interval: 1000,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#dcdfe6",
            },
          },
          splitLine: {
            lineStyle: {
              color: "#ebeef5",
              type: "dashed",
            },
          },
        },
        series: [
          {
            name: "出力值",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: {
              width: 2,
            },
            itemStyle: {
              color: "#409eff",
            },
            data: data.map((val) => Math.round(val * 25)),
          },
        ],
      };

      this.chart.setOption(option, true);
      this.chart.resize();
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

.result-content {
  padding: 16px 0;
}

.info-row {
  display: flex;
  gap: 32px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-label {
  font-size: 14px;
  color: #606266;
  margin-right: 8px;
}

.info-value {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
  padding: 4px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.chart-section {
  margin-bottom: 24px;
}

.section-header {
  margin-bottom: 12px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.result-chart {
  width: 100%;
  height: 380px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.stats-section {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  background: #fafafa;
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avg-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.max-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.min-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.icon-text {
  font-size: 11px;
  color: #fff;
  font-weight: 600;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.stat-value {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
}
</style>

<style>
.predict-result-dialog .el-dialog__header {
  background: #409eff;
  padding: 14px 20px;
  margin-right: 0;
}

.predict-result-dialog .el-dialog__headerbtn {
  top: 14px;
  right: 16px;
}

.predict-result-dialog .el-dialog__headerbtn .el-dialog__close {
  color: #fff;
  font-size: 18px;
}

.predict-result-dialog .el-dialog__headerbtn .el-dialog__close:hover {
  color: #ecf5ff;
}
</style>
