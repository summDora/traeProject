<template>
  <div class="page13-container">
    <div class="card top-table-card">
      <div class="section-title">特征相关系数</div>
      <el-table :data="correlationTableData" border style="width: 100%">
        <el-table-column label="特征" prop="feature" width="150" fixed />
        <el-table-column
          v-for="(col, index) in features"
          :key="col"
          :label="col"
          :prop="'col' + index"
          align="center"
          min-width="120"
        />
      </el-table>
    </div>
    <div class="split-layout">
      <div class="panel panel-left">
        <div class="card table-card">
          <div class="table-scroll">
            <el-table
              :data="tableData"
              :span-method="objectSpanMethod"
              border
              style="width: 100%"
            >
              <el-table-column label="维度" prop="dimension" />
              <el-table-column label="分类标签" prop="label" />
              <el-table-column label="量化范围" prop="range" />
            </el-table>
          </div>
        </div>
      </div>
      <div class="panel panel-right">
        <div class="card chart-card">
          <div ref="heatmapChart" class="heatmap-chart" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

const FEATURES = ["充电开始时间", "充电持续时间", "充电起始SOC", "电池容量"];

const CORRELATION_MATRIX = [
  [1.0, -0.041, -0.02, -0.019],
  [-0.041, 1.0, -0.431, 0.55],
  [-0.02, -0.431, 1.0, -0.56],
  [-0.019, 0.55, -0.56, 1.0],
];

const HEATMAP_GRID = {
  left: 100,
  right: 88,
  top: 56,
  bottom: 88,
};

// continuous：-1 红橙 → 0 薄荷绿 → 1 深蓝
const HEATMAP_COLOR_STOPS = [
  "#E8574A",
  "#EF7644",
  "#F5A623",
  "#F7D86E",
  "#B8E6C8",
  "#7ADCE8",
  "#4AB8F5",
  "#2196F3",
];

export default {
  name: "Page13",
  data() {
    return {
      chart: null,
      tableData: [
        { dimension: "充电开始时间", label: "日间型", range: "6:00-18:00" },
        { dimension: "", label: "日间型", range: "6:00-18:00" },
        { dimension: "", label: "夜间型", range: "18:00-6:00" },
        { dimension: "结束时间", label: "缓降续航", range: "<10:00" },
        { dimension: "", label: "中等续航", range: "10:00-22:00" },
        { dimension: "", label: "长降续航", range: ">22:00（含跨日）" },
        { dimension: "充电SOC", label: "低续航电量", range: "0%-25%" },
        { dimension: "", label: "中续航电量", range: "25%-55%" },
        { dimension: "", label: "高续航电量", range: "55%-100%" },
        { dimension: "充电容量", label: "低续航电量", range: "<6 kWh（估算）" },
        { dimension: "", label: "中续航电量", range: "6-15 kWh（估算）" },
        { dimension: "", label: "高续航电量", range: ">15 kWh（估算）" },
        { dimension: "电池容量", label: "小电池型", range: "≤ 40 kWh" },
        { dimension: "", label: "中电池型", range: "40-50 kWh" },
        { dimension: "", label: "大电池型", range: "> 50 kWh" },
        { dimension: "充电持续时间", label: "缓降续航", range: "< 120 min" },
        { dimension: "", label: "中等续航", range: "120-200 min" },
        { dimension: "", label: "长降续航", range: "> 200 min" },
      ],
      mergeSpan: [3, 3, 3, 3, 3, 3],
      features: FEATURES,
    };
  },
  computed: {
    correlationTableData() {
      return FEATURES.map((name, rowIndex) => {
        const row = { feature: name };
        FEATURES.forEach((_, colIndex) => {
          row[`col${colIndex}`] =
            CORRELATION_MATRIX[rowIndex][colIndex].toFixed(3);
        });
        return row;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    getHeatmapBodyHeight() {
      const el = this.$refs.heatmapChart;
      const chartHeight = (el && el.clientHeight) || 520;
      return chartHeight - HEATMAP_GRID.top - HEATMAP_GRID.bottom;
    },
    buildHeatmapData() {
      const data = [];
      for (let i = 0; i < FEATURES.length; i++) {
        for (let j = 0; j < FEATURES.length; j++) {
          data.push([j, i, CORRELATION_MATRIX[i][j]]);
        }
      }
      return data;
    },
    buildChartOption() {
      const bodyHeight = this.getHeatmapBodyHeight();

      return {
        title: {
          text: "特征相关性热力图",
          left: "center",
          top: 8,
          textStyle: {
            fontSize: 16,
            fontWeight: 600,
            color: "#303133",
          },
        },
        tooltip: {
          position: "top",
          formatter(params) {
            const data = params.data || params.value;
            const xIdx = data[0];
            const yIdx = data[1];
            const val = data[2];
            const colFeature = FEATURES[xIdx];
            const rowFeature = FEATURES[FEATURES.length - 1 - yIdx];
            return [
              `行：${rowFeature}`,
              `列：${colFeature}`,
              `相关系数：${val.toFixed(3)}`,
            ].join("<br/>");
          },
        },
        grid: { ...HEATMAP_GRID },
        xAxis: {
          type: "category",
          data: FEATURES,
          splitArea: { show: true },
          axisLabel: {
            interval: 0,
            rotate: 25,
            fontSize: 12,
          },
        },
        yAxis: {
          type: "category",
          data: FEATURES.slice().reverse(),
          splitArea: { show: true },
          axisLabel: {
            fontSize: 12,
          },
        },
        visualMap: {
          type: "continuous",
          min: -1,
          max: 1,
          calculable: false,
          orient: "vertical",
          right: 38,
          top: HEATMAP_GRID.top,
          itemHeight: bodyHeight,
          itemWidth: 16,
          splitNumber: 8,
          precision: 2,
          text: ["1.00", "-1.00"],
          textStyle: {
            fontSize: 11,
            color: "#909399",
          },
          inRange: {
            color: HEATMAP_COLOR_STOPS,
          },
        },
        series: [
          {
            name: "相关系数",
            type: "heatmap",
            data: this.buildHeatmapData().map((item) => [
              item[0],
              FEATURES.length - 1 - item[1],
              item[2],
            ]),
            label: {
              show: true,
              formatter: (params) => params.data[2].toFixed(3),
              fontSize: 11,
              color: "#ffffff",
              textBorderColor: "rgba(0, 0, 0, 0.2)",
              textBorderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 8,
                shadowColor: "rgba(0, 0, 0, 0.25)",
              },
            },
          },
        ],
      };
    },
    initChart() {
      const el = this.$refs.heatmapChart;
      if (!el) return;

      this.chart = echarts.init(el);
      this.setChartOption();
    },
    setChartOption() {
      if (!this.chart) return;
      this.chart.setOption(this.buildChartOption(), true);
    },
    handleResize() {
      if (!this.chart) return;
      this.chart.resize();
      this.setChartOption();
    },
    objectSpanMethod({ rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        let count = 0;
        let index = 0;
        let sum = 0;
        for (let i = 0; i < this.mergeSpan.length; i++) {
          sum += this.mergeSpan[i];
          if (rowIndex < sum) {
            count = this.mergeSpan[i];
            index = i;
            break;
          }
        }
        const startIndex = this.mergeSpan
          .slice(0, index)
          .reduce((a, b) => a + b, 0);
        if (rowIndex === startIndex) {
          return {
            rowspan: count,
            colspan: 1,
          };
        }
        return {
          rowspan: 0,
          colspan: 0,
        };
      }
    },
  },
};
</script>

<style scoped>
.page13-container {
  padding: 0;
  --content-height: 520px;
}

.top-table-card {
  margin-bottom: 16px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 12px;
}

.split-layout {
  display: flex;
  gap: 16px;
  align-items: stretch;
}

.panel {
  flex: 1;
  min-width: 0;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.table-card,
.chart-card {
  display: flex;
  flex-direction: column;
  height: calc(var(--content-height) + 40px);
}

.table-scroll {
  height: var(--content-height);
  overflow-y: auto;
  overflow-x: hidden;
  flex-shrink: 0;
}

.table-scroll::-webkit-scrollbar {
  width: 6px;
}

.table-scroll::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.table-scroll::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
}

.heatmap-chart {
  width: 100%;
  height: var(--content-height);
  flex-shrink: 0;
}

@media (max-width: 1200px) {
  .page13-container {
    --content-height: 460px;
  }

  .split-layout {
    flex-direction: column;
  }
}
</style>
