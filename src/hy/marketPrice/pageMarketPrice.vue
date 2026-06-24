<template>
  <div class="page-market-price">
    <!-- 第一部分：时间联动 + 操作按钮 -->
    <div class="card section-top">
      <div class="top-layout">
        <div class="top-left">
          <div class="section-title">预测条件</div>
          <time-link-form @predict="handlePredict" />
        </div>
        <div class="top-right">
          <el-button type="primary" plain @click="handleSimConfig">
            仿真方案参数配置
          </el-button>
          <el-button type="success" plain @click="handleBaseData">
            基础数据
          </el-button>
        </div>
      </div>
    </div>

    <div class="section-compare-action">
      <el-button type="warning" plain @click="handleScenarioCompare">
        多方案对比分析
      </el-button>
      <el-button type="primary" plain @click="handlePredictResult">
        预测结果
      </el-button>
    </div>

    <!-- 第二部分：图形区 -->
    <div class="card section-chart">
      <div class="section-title">价格走势</div>
      <div v-if="!hasResult" class="chart-placeholder">
        请选择预测时间并点击「预测」查看折线图
      </div>
      <div v-show="hasResult" ref="priceChart" class="price-chart" />
    </div>

    <!-- 第三部分：分析区 -->
    <div class="card section-analysis">
      <div class="section-title">分析区</div>

      <div class="analysis-block">
        <div class="block-title">趋势分析</div>
        <div v-if="!hasResult" class="analysis-empty">暂无分析数据</div>
        <div v-else class="trend-text">{{ trendText }}</div>
      </div>

      <div class="analysis-block">
        <div class="block-title">相关性分析</div>
        <el-table
          v-if="hasResult"
          :data="statsTable.rows"
          border
          style="width: 100%"
        >
          <el-table-column
            :label="statsTable.dimensionLabel"
            prop="label"
            min-width="160"
          />
          <el-table-column label="平均值" prop="avg" align="center" />
          <el-table-column label="最小值" prop="min" align="center" />
          <el-table-column label="最大值" prop="max" align="center" />
        </el-table>
        <div v-else class="analysis-empty">暂无分析数据</div>
      </div>
    </div>

    <sim-config-dialog
      :visible.sync="simConfigVisible"
      :config="simConfig"
      @save="handleSimConfigSave"
    />

    <base-data-dialog
      :visible.sync="baseDataVisible"
      :base-data="baseData"
      @save="handleBaseDataSave"
    />

    <scenario-select-dialog
      :visible.sync="scenarioSelectVisible"
      :value="selectedScenarios"
      @compare="handleScenarioCompareConfirm"
    />

    <scenario-compare-dialog
      :visible.sync="scenarioCompareVisible"
      :scenarios="compareScenarios"
    />

    <predict-result-dialog
      :visible.sync="predictResultVisible"
    />
  </div>
</template>

<script>
import * as echarts from "echarts";
import TimeLinkForm from "./components/TimeLinkForm.vue";
import SimConfigDialog from "./components/SimConfigDialog.vue";
import BaseDataDialog from "./components/BaseDataDialog.vue";
import ScenarioSelectDialog from "./components/ScenarioSelectDialog.vue";
import ScenarioCompareDialog from "./components/ScenarioCompareDialog.vue";
import PredictResultDialog from "./components/PredictResultDialog.vue";
import {
  buildChartOption,
  buildStatsTable,
  buildTrendText,
  generatePriceSeries,
} from "./utils/marketPrice";

export default {
  name: "PageMarketPrice",
  components: {
    TimeLinkForm,
    SimConfigDialog,
    BaseDataDialog,
    ScenarioSelectDialog,
    ScenarioCompareDialog,
    PredictResultDialog,
  },
  data() {
    return {
      chart: null,
      simConfigVisible: false,
      baseDataVisible: false,
      scenarioSelectVisible: false,
      scenarioCompareVisible: false,
      predictResultVisible: false,
      selectedScenarios: [],
      compareScenarios: [],
      simConfig: {
        algorithm: "",
        predictYears: [],
        historyYears: [],
      },
      baseData: {
        annualFiles: [],
        conversionFile: null,
        monthMappingFile: null,
      },
      hasResult: false,
      currentDimension: "",
      seriesMap: {},
      selectionItems: [],
      trendText: "",
      statsTable: {
        dimensionLabel: "年份",
        rows: [],
      },
    };
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
  },
  methods: {
    handleSimConfig() {
      this.simConfigVisible = true;
    },
    handleSimConfigSave(config) {
      this.simConfig = config;
      this.$message.success("仿真方案参数配置已保存");
    },
    handleBaseData() {
      this.baseDataVisible = true;
    },
    handleBaseDataSave(data) {
      this.baseData = data;
      this.$message.success("基础数据已保存");
    },
    handleScenarioCompare() {
      this.scenarioSelectVisible = true;
    },
    handlePredictResult() {
      this.predictResultVisible = true;
    },
    handleScenarioCompareConfirm(scenarios) {
      this.selectedScenarios = scenarios.map((item) => item.id);
      this.compareScenarios = scenarios;
      this.scenarioCompareVisible = true;
    },
    handlePredict(payload) {
      const { dimension, items } = payload;
      const seriesMap = {};

      items.forEach((item) => {
        seriesMap[item.key] = generatePriceSeries(item.key);
      });

      this.currentDimension = dimension;
      this.selectionItems = items;
      this.seriesMap = seriesMap;
      this.trendText = buildTrendText(items, seriesMap);
      this.statsTable = buildStatsTable(dimension, items, seriesMap);
      this.hasResult = true;

      this.$nextTick(() => {
        this.renderChart();
        this.$nextTick(() => {
          if (this.chart) {
            this.chart.resize();
          }
        });
      });

      this.$message.success("预测成功");
    },
    renderChart() {
      const el = this.$refs.priceChart;
      if (!el) return;

      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }

      this.chart = echarts.init(el);
      this.chart.setOption(
        buildChartOption(this.selectionItems, this.seriesMap),
        true
      );
      this.chart.resize();
    },
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
  },
};
</script>

<style scoped>
.page-market-price {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}

.top-layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.top-left {
  flex: 1;
  min-width: 0;
}

.top-right {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding-top: 40px;
  white-space: nowrap;
}

.section-compare-action {
  display: flex;
  justify-content: flex-end;
  padding: 0 4px;
}

.price-chart {
  width: 100%;
  min-width: 0;
  height: 460px;
}

.chart-placeholder,
.analysis-empty {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 48px 0;
  background: #fafafa;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
}

.analysis-block + .analysis-block {
  margin-top: 24px;
}

.block-title {
  font-size: 14px;
  font-weight: 600;
  color: #606266;
  margin-bottom: 12px;
}

.trend-text {
  font-size: 14px;
  color: #303133;
  line-height: 1.8;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

@media (max-width: 960px) {
  .top-layout {
    flex-direction: column;
  }

  .top-right {
    padding-top: 0;
  }
}
</style>
