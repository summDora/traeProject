/**
 * sys_page 图表统一 ECharts 入口 —— 固定 4.9.0
 * 项目主体仍是 echarts 5.x；这里通过 npm 别名 `echarts4` 并存引入（package.json: "echarts4": "npm:echarts@4.9.0"），
 * 两个版本各自带独立 zrender，互不影响其它页面。
 * 4.x 是 UMD/CJS 包且不带类型声明，这里用 require 取模块本身。
 */
// eslint-disable-next-line
const echarts = require("echarts4");

export default echarts;
