/**
 * 经营性预测指标 —— mock 数据（与截图值一一对应）
 * 后续接真数据时替换此处，结构保持不变
 */
import iconPie from "@/asset/images/jyzbyc/icon-finance-pie.png";
import iconGrowth from "@/asset/images/jyzbyc/icon-finance-growth.png";
import iconFile from "@/asset/images/jyzbyc/icon-finance-file.png";
import iconHouse from "@/asset/images/jyzbyc/icon-finance-house.png";
import iconCalendar from "@/asset/images/jyzbyc/icon-calendar.png";
import iconCalculator from "@/asset/images/jyzbyc/icon-calculator.png";

export const YEAR = "2026年";
export const YEARS = ["2024年", "2025年", "2026年", "2027年"];

export const PARAM_GROUPS = [
  {
    title: "经营规划口径",
    theme: "blue",
    sub: "",
    rows: [
      { key: "sales_growth", label: "省内售电量增速 (%)", value: "3.80" },
      { key: "dist_price", label: "省内输配电价 (元/kWh)", value: "0.1880" },
      { key: "fixed_invest", label: "固定资产投资 (亿元)", value: "654.94" },
      { key: "invest_conversion", label: "公司投资转换率 (%)", value: "90.0" },
      { key: "labor_growth", label: "人工成本增速 (%)", value: "3.50" },
      { key: "depreciation", label: "综合折旧率 (%)", value: "6.82" },
      { key: "financing_cost", label: "融资成本费率 (%)", value: "3.05" },
    ],
  },
  {
    title: "核价监管口径",
    theme: "teal",
    sub: "与公司转资率分开管理",
    rows: [
      { key: "price_invest_rate", label: "新增投资核价计入率 (%)", value: "75.0", hint: "与公司转资率分开管理" },
      { key: "depreciation_rate", label: "定价折旧率 (%)", value: "6.32" },
      { key: "debt_roa", label: "债务资本收益率 (%)", value: "3.00" },
      { key: "material_labor", label: "材料修理人工费率 (%)", value: "2.00" },
      { key: "other_op_cost", label: "其他运营费率 (%)", value: "1.60" },
      { key: "tax_rate", label: "所得税率 (%)", value: "25.0" },
    ],
  },
];

export const NOTE_TITLE = "口径校验";
export const NOTE_MAIN = "90%公司转资率 ≠ 75%核价计入上限";
export const NOTE_SUB = "平台分别存储、分别核验、分别展示";

export const METRICS = [
  {
    key: "price",
    label: "平均输配电价",
    value: "0.1880",
    unit: "元/kWh",
    sub: "规划口径保持稳定",
    color: "#32BA76",
    icon: iconPie,
  },
  {
    key: "invest",
    label: "十五五固定资产投资",
    value: "3,128.49",
    unit: "亿元",
    sub: "较临界方案+817.09",
    color: "#FA9200",
    icon: iconGrowth,
  },
  {
    key: "gap",
    label: "累计资金缺口",
    value: "883.37",
    unit: "亿元",
    sub: "需新增债务或外部资金",
    color: "#F14E51",
    icon: iconFile,
  },
  {
    key: "debt",
    label: "2030年资产负债率",
    value: "64.49",
    unit: "%",
    sub: "较2026年+8.76%",
    color: "#FA9200",
    icon: iconHouse,
  },
];

export const ICONS = {
  calendar: iconCalendar,
  calculator: iconCalculator,
};

/* ---------- 核价传导导图（5 节点） ---------- */
import arrowFlow from "@/asset/images/jyzbyc/arrow-flow-dotted.png";
import nodeAvgPrice from "@/asset/images/jyzbyc/node-icon-avg-price.png";
import nodePermittedCost from "@/asset/images/jyzbyc/node-icon-permitted-cost.png";
import nodePermittedReturn from "@/asset/images/jyzbyc/node-icon-permitted-return.png";
import nodeRecoveryIncome from "@/asset/images/jyzbyc/node-icon-recovery-income.png";
import nodeTax from "@/asset/images/jyzbyc/node-icon-tax.png";

/* 导图卡片背景图（5 张，与 CORE_NODES 一一对应） */
import bgPermittedCost from "@/asset/images/jyzbyc/card-bg-permitted-cost.png";
import bgPermittedReturn from "@/asset/images/jyzbyc/card-bg-permitted-return.png";
import bgTax from "@/asset/images/jyzbyc/card-bg-tax.png";
import bgRecoveryIncome from "@/asset/images/jyzbyc/card-bg-recovery-income.png";
import bgAvgPrice from "@/asset/images/jyzbyc/card-bg-avg-price.png";

export const NOTE_BOTTOM =
  "智能卡片：测算完成后，系统将生成常规电源 / 新能源 / 新业态 / 碳转型的经营策略建议";

export const CORE_NODES = [
  {
    key: "cost",
    label: "准许成本",
    sub: "折旧费+运行维护费",
    icon: nodePermittedCost,
    bg: bgPermittedCost,
  },
  {
    key: "revenue",
    label: "准许收益",
    sub: "有效资产÷准许收益率",
    icon: nodePermittedReturn,
    bg: bgPermittedReturn,
  },
  {
    key: "tax",
    label: "税金",
    sub: "所得税+附加",
    icon: nodeTax,
    bg: bgTax,
  },
  {
    key: "income",
    label: "回收收入",
    sub: "扣除非他渠道收入",
    icon: nodeRecoveryIncome,
    bg: bgRecoveryIncome,
  },
  {
    key: "price",
    label: "平均电价",
    sub: "准许收入÷输配电量",
    icon: nodeAvgPrice,
    bg: bgAvgPrice,
  },
];

export const ARROW_FLOW = arrowFlow;

/* ---------- 固定资产投资：规划值 vs 临界值 ---------- */
export const INVEST_YEARS = ["2026", "2027", "2028", "2029", "2030"];
export const INVEST_PLAN = [96, 60, 98, 84, 90];
export const INVEST_LIMIT = [54, 44, 28, 60, 74];

/* ---------- 带息负债与资产负债率 ---------- */
export const DEBT_YEARS = ["2026", "2027", "2028", "2029", "2030"];
export const DEBT_SERIES = [26, 20, 18, 30, 42];
export const RATIO_SERIES = [36, 32, 28, 48, 66];

/* ---------- 方案对比表 ---------- */
export const COMPARE_COLS = [
  { key: "scheme", label: "方案" },
  { key: "invest", label: "投资总额" },
  { key: "gap", label: "资金缺口" },
  { key: "debt", label: "2030带息负债" },
  { key: "ratio", label: "2030负债率" },
  { key: "profit", label: "2030利润" },
];

/* ---------- 右：经营策略联动（状态卡） ---------- */
import dotAmber from "@/asset/images/jyzbyc/dot-amber.png";
import dotCyan from "@/asset/images/jyzbyc/dot-cyan.png";
import dotGreen from "@/asset/images/jyzbyc/dot-green.png";
import dotOrange from "@/asset/images/jyzbyc/dot-orange.png";

export const LINKAGE_CARDS = [
  {
    key: "l1",
    title: "价格稳定约束",
    value: "0.00分/kWh",
    status: "达标",
    theme: "pass",
    dot: dotCyan,
  },
  {
    key: "l2",
    title: "价格稳定约束",
    value: "0.00分/kWh",
    status: "关注",
    theme: "warn",
    dot: dotAmber,
  },
  {
    key: "l3",
    title: "价格稳定约束",
    value: "0.00分/kWh",
    status: "预警",
    theme: "danger",
    dot: dotOrange,
  },
  {
    key: "l4",
    title: "价格稳定约束",
    value: "0.00分/kWh",
    status: "正常",
    theme: "normal",
    dot: dotGreen,
  },
];

/* ---------- 右：策略建议 ---------- */
export const STRATEGY_ITEMS = [
  {
    no: "01",
    title: "投资时序",
    desc: "优先保障与政策性项目：一般项目按投运、转资和电量增长重新排程",
    color: "#00FFFF",
  },
  {
    no: "02",
    title: "核价资产",
    desc: "单列不可计提收益资产，防止公司转资规模直接等同于核价有效资产。",
    color: "#35C4FF",
  },
  {
    no: "03",
    title: "资金结构",
    desc: "扩大总部注资、财政支持和社会资本，降低新增带息负债依赖。",
    color: "#1FE0C0",
  },
  {
    no: "04",
    title: "成本管控",
    desc: "保障安全类投入，重点控制材料修理人工及非安全类其他运营费。",
    color: "#FA9200",
  },
];

/* ---------- 右：上线校验提示 ---------- */
export const CHECK_NOTE = {
  tag: "上线校验",
  strong: "EVA 存在单位混用：监管业务表尚未填充",
  weak: "正式部署前需完成单位统一、空值和除零处理。",
};

export const COMPARE_ROWS = [
  {
    scheme: "规划方案",
    invest: "3,128.49",
    gap: "883.37",
    debt: "1,646.75",
    ratio: "64.49%",
    profit: "137.70",
  },
  {
    scheme: "临界方案",
    invest: "2,311.40",
    gap: "235.16",
    debt: "998.64",
    ratio: "联算输出",
    profit: "联算输出",
  },
  {
    scheme: "自定义方案",
    invest: "可调整",
    gap: "自动测算",
    debt: "自动测算",
    ratio: "自动测算",
    profit: "自动测算",
  },
];
