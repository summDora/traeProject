import echarts from "./echarts";

/**
 * 原子图表通用 mixin
 * - 统一 props：data / theme
 * - 统一 init / resize(ResizeObserver) / dispose 生命周期
 * - 子组件只需实现 buildOption(p), 返回 ECharts option
 * 根节点需带 ref="chartEl"，且宽高 100%
 */
export default {
  props: {
    data: {
      type: [Array, Object],
      default: () => [],
    },
    theme: {
      type: String,
      default: "dark",
    },
  },
  data() {
    return {
      chart: null,
      _ro: null,
    };
  },
  watch: {
    data: {
      deep: true,
      handler() {
        this.renderChart();
      },
    },
    theme() {
      this.renderChart();
    },
  },
  mounted() {
    this.$nextTick(() => this.initChart());
  },
  beforeDestroy() {
    this.teardownChart();
  },
  methods: {
    initChart() {
      const el = this.$refs.chartEl;
      if (!el) return;
      this.chart = echarts.init(el);
      if (typeof ResizeObserver !== "undefined") {
        this._ro = new ResizeObserver(() => {
          if (this.chart) this.chart.resize();
        });
        this._ro.observe(el);
      } else {
        window.addEventListener("resize", this.handleWindowResize);
      }
      this.renderChart();
    },
    handleWindowResize() {
      if (this.chart) this.chart.resize();
    },
    renderChart() {
      if (!this.chart || typeof this.buildOption !== "function") return;
      const option = this.buildOption(this.palette || {});
      if (option) this.chart.setOption(option, true);
    },
    teardownChart() {
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      window.removeEventListener("resize", this.handleWindowResize);
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }
    },
  },
};
