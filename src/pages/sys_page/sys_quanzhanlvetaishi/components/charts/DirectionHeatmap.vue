<template>
  <div
    class="sys-chart sys-chart--heatmap"
    :class="chartClass"
    style="width: 100%; height: 100%"
  >
    <div class="sys-chart__scroll">
      <div
        ref="chartEl"
        class="sys-chart__el"
        :style="{
          width: 'max(100%, ' + minWidth + 'px)',
          height: 'max(100%, ' + minHeight + 'px)',
        }"
      ></div>
    </div>
  </div>
</template>

<script>
import chartMixin from "./chartMixin";
import { getTheme, buildTooltip } from "./theme";

const CELL_W = 68; // 格子目标宽度（px）
const CELL_H = 18; // 格子目标高度（px）
const CELL_GAP = 2; // 格子之间的缝隙（px）
const CELL_RADIUS = 3; // 圆角大小（px）
const Y_LABEL_AREA = 140; // y 轴文字预留宽度（px），保证 label 完整展示

/** 计算某个格子的圆角矩形（按类目 band 居中，四周各留 CELL_GAP/2 缝隙） */
function cellRect(api) {
  const pt = api.coord([api.value(0), api.value(1)]);
  const band = api.size([1, 1]);
  const w = Math.max(1, band[0] - CELL_GAP);
  const h = Math.max(1, band[1] - CELL_GAP);
  return {
    x: pt[0] - w / 2,
    y: pt[1] - h / 2,
    width: w,
    height: h,
    r: CELL_RADIUS,
  };
}
/**
 * 方向热力矩阵（可复用原子图表）
 * props:
 *  - data: { rows: [..], cols: [..], values: [[..],[..]] }，values[r][c] 为强度
 *  - theme: "dark" | "light"
 * 密图策略：列数多时给 chart 最小宽度，外层横向滚动
 */
export default {
  name: "DirectionHeatmap",
  mixins: [chartMixin],
  computed: {
    palette() {
      return getTheme(this.theme);
    },
    chartClass() {
      return this.theme === "light" ? "is-light" : "is-dark";
    },
    minWidth() {
      const cols = ((this.data || {}).cols || []).length;
      return Math.max(
        360,
        Y_LABEL_AREA + 30 + cols * (CELL_W + CELL_GAP)
      );
    },
    /* 行高按 CELL_H 兜底；超出容器时纵向滚动，y 轴文字优先完整展示 */
    minHeight() {
      const rows = ((this.data || {}).rows || []).length;
      return Math.max(0, rows * (CELL_H + CELL_GAP) + 30);
    },
  },
  methods: {
    buildOption(p) {
      const d = this.data || {};
      const rows = d.rows || [];
      const cols = d.cols || [];
      const values = d.values || [];
      const cells = [];
      const emptyCells = [];
      let max = 1;
      values.forEach((rowArr) => {
        (rowArr || []).forEach((v) => {
          if (v === null || v === undefined || v === "") return;
          if (v > max) max = v;
        });
      });
      values.forEach((rowArr, r) => {
        (rowArr || []).forEach((v, c) => {
          // null / undefined 表示「无数据」：只画底色圆角格子
          if (v === null || v === undefined || v === "") {
            emptyCells.push([c, r, null]);
            return;
          }
          cells.push([c, r, v]);
        });
      });
      // 底层满铺深色，作为格子缝隙
      const baseCells = [];
      rows.forEach((_, r) => {
        cols.forEach((__, c) => {
          baseCells.push([c, r, 0]);
        });
      });
      return {
        tooltip: {
          ...buildTooltip(p),
          trigger: "item",
          formatter: (params) =>
            `${cols[params.value[0]] || ""} / ${
              rows[params.value[1]] || ""
            }<br/>${params.marker || ""}${params.value[2]}`,
        },
        grid: {
          left: 16,
          right: 12,
          top: 8,
          bottom: 44,
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: cols,
          splitArea: { show: false },
          axisLabel: { color: p.text, fontSize: 12, interval: 0 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        yAxis: {
          type: "category",
          data: rows,
          inverse: true,
          axisLabel: { color: p.text, fontSize: 12 },
          axisLine: { lineStyle: { color: p.axisLine } },
          axisTick: { show: false },
        },
        visualMap: {
          type: "continuous",
          show: true,
          orient: "horizontal",
          left: 170,
          bottom: 2,
          min: 0,
          max,
          calculable: true,
          itemWidth: 10,
          itemHeight: 120,
          textStyle: { color: p.vmText, fontSize: 11 },
          inRange: { color: p.heatColors },
          /* 只映射数据层，底层/空数据层保持固定底色 */
          seriesIndex: 2,
        },
        series: [
          {
            /* 底层：满铺深色，作为格子之间的缝隙 */
            name: "缝隙",
            type: "heatmap",
            data: baseCells,
            silent: true,
            z: 1,
            itemStyle: { color: p.heatBorder },
            label: { show: false },
          },
          {
            /* 无数据格子：圆角 + 底色，不显示数字 */
            name: "底色",
            type: "custom",
            data: emptyCells,
            silent: true,
            z: 2,
            // eslint-disable-next-line no-unused-vars
            renderItem: (params, api) => ({
              type: "rect",
              shape: cellRect(api),
              style: { fill: p.heatEmpty },
            }),
          },
          {
            /* 强度格子：ECharts 4.9 的 heatmap 不支持 itemStyle.borderRadius，
               这里用 custom 系列手绘圆角矩形（缝隙/圆角由 CELL_GAP、CELL_RADIUS 控制） */
            name: "强度",
            type: "custom",
            z: 3,
            data: cells,
            // eslint-disable-next-line no-unused-vars
            renderItem: (params, api) => {
              const pt = api.coord([api.value(0), api.value(1)]);
              return {
                type: "group",
                children: [
                  {
                    type: "rect",
                    shape: cellRect(api),
                    style: api.style(),
                    styleEmphasis: api.styleEmphasis(),
                  },
                  {
                    type: "text",
                    silent: true,
                    style: {
                      x: pt[0],
                      y: pt[1],
                      text: String(api.value(2)),
                      textAlign: "center",
                      textVerticalAlign: "middle",
                      textFill: "#FFFFFF",
                      fontSize: 11,
                      fontWeight: 500,
                    },
                  },
                ],
              };
            },
            emphasis: {
              itemStyle: {
                borderColor: "#ffffff",
                borderWidth: 1,
                shadowBlur: 8,
                shadowColor: "rgba(0,0,0,0.35)",
              },
            },
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-chart--heatmap {
  width: 100%;
  height: 100%;

  .sys-chart__scroll {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .sys-chart__el {
    height: 100%;
  }
}
</style>
