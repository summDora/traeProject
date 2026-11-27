/**
 * 全应用场景（实验室大屏）mock 数据
 * 骨架阶段页面只消费这里的数据；真实接口与静态素材后续替换本文件即可
 */

import iconChongdian from "@/asset/images/qyycj/chongdian.png";
import iconChongdianliang from "@/asset/images/qyycj/chongdianliang.png";
import iconMubiao from "@/asset/images/qyycj/mubiao.png";
import iconXiangyingcishu from "@/asset/images/qyycj/xiangyingcishu.png";
import iconXiangyingdianliang from "@/asset/images/qyycj/xiangyingdianliang.png";
import iconChuneng from "@/asset/images/qyycj/chuneng.png";
import iconBeian from "@/asset/images/qyycj/beian.png";
import iconJiacha from "@/asset/images/qyycj/jiacha.png";
import iconNote from "@/asset/images/qyycj/note.png";
import iconYitihua from "@/asset/images/qyycj/yitihua.png";
import iconDecoration from "@/asset/images/jyzbyc/subtitle-decoration.png";
import iconShenpi from "@/asset/images/qyycj/shenpi.png";
import iconXinnengyuan from "@/asset/images/qyycj/xinnengyuan.png";
import iconZifa from "@/asset/images/qyycj/zifaziyong.png";
import iconLingtan from "@/asset/images/qyycj/lingtan.png";
import iconTanpaifang from "@/asset/images/qyycj/tanpaifang.png";
import iconLvdianzhigong from "@/asset/images/qyycj/lvdianzhigong.png";
import iconDotCyan from "@/asset/images/jyzbyc/dot-cyan.png";

export const ICONS = {
  note: iconNote,
  yitihua: iconYitihua,
  decoration: iconDecoration,
  dotCyan: iconDotCyan,
};

export const pageIntro = {
  title: "四类典型场景，一屏算清经济账",
  descPrefix: "本模块以",
  descHighlight: "经济性测算评价",
  descSuffix:
    "为核心，围绕园区、充电桩、虚拟电厂、用户侧储能四类场景，测算投资成本、收益构成、度电成本、回收周期与 IRR，并做关键参数敏感性分析。",
};

export const parkScenes = [
  {
    key: "green-direct",
    title: "绿电直连",
    icon: iconDecoration,
    tag: "经济效益测算主线",
    stats: [
      { label: "已完成审批项目", value: "105", unit: "个", icon: iconShenpi },
      { label: "对应新能源总装机", value: "3,470", unit: "万 kW", icon: iconXinnengyuan },
      { label: "自发自用比例约束", value: "≥60", unit: "%", icon: iconZifa },
    ],
    mapTitle: "绿电直连公示项目 · 省份分布（123 个 / 15 省）",
    mapLabel: "绿电直连省份分布地图占位",
    badges: [
      { name: "内蒙古", value: 96 },
      { name: "新疆", value: 8 },
      { name: "青海", value: 2 },
      { name: "甘肃", value: 4 },
      { name: "宁夏", value: 1 },
      { name: "陕西", value: 1 },
      { name: "山西", value: 4 },
      { name: "河北", value: 7 },
      { name: "山东", value: 6 },
      { name: "江苏", value: 5 },
      { name: "浙江", value: 9 },
      { name: "福建", value: 3 },
      { name: "广东", value: 6 },
      { name: "辽宁", value: 2 },
      { name: "黑龙江", value: 1 },
    ],
  },
  {
    key: "zero-carbon-park",
    title: "零碳园区",
    icon: iconDecoration,
    tag: "经济效益测算主线",
    stats: [
      { label: "首批国家级零碳园区", value: "52", unit: "个", icon: iconLingtan },
      { label: "建成后单位能耗碳排放", value: "0.25", unit: "吨/吨标煤", icon: iconTanpaifang },
      { label: "绿电直供比例引导值", value: "≥50", unit: "%", icon: iconLvdianzhigong },
    ],
    mapTitle: "首批 52 个国家级零碳园区 · 省份分布",
    mapLabel: "零碳园区省份分布地图占位",
    badges: [
      { name: "江苏", value: 9 },
      { name: "浙江", value: 6 },
      { name: "广东", value: 5 },
      { name: "山东", value: 4 },
      { name: "河北", value: 4 },
      { name: "内蒙古", value: 3 },
      { name: "新疆", value: 3 },
      { name: "山西", value: 3 },
      { name: "陕西", value: 2 },
      { name: "甘肃", value: 2 },
      { name: "福建", value: 2 },
      { name: "四川", value: 2 },
      { name: "青海", value: 1 },
      { name: "宁夏", value: 1 },
      { name: "辽宁", value: 1 },
    ],
  },
];

export const policyBoundaries = {
  title: "650 号文关键比例约束",
  tag: "政策边界",
  rows: [
    {
      label: "自发自用 / 总可用发电量",
      note: "项目流入的绿电下降",
      limit: "≥60%",
      progress: 78,
    },
    {
      label: "自发自用 / 总用电量",
      note: "2030 年前不低于 35%",
      limit: "≥30% → 35%",
      progress: 44,
    },
    {
      label: "上网电量 / 总可用发电量",
      note: "上网电量由省级主管部门确定",
      limit: "≤20%",
      progress: 26,
    },
  ],
};

export const econNotes = [
  {
    key: "econ-invest",
    title: "经济性测算",
    widthRatio: 210,
    desc: "自用率、上网比例与接入电压直接改变过网费与购电成本；1192 号文明确价格机制，688 号文（2026-05）放开多用户模式，需分模式建收益模型。下方省份分布为地方公示口径（15 省 123 个），非官方审批项目分省清单。",
  },
  {
    key: "econ-park",
    title: "经济性测算",
    widthRatio: 900,
    desc: "能碳系统 50–200 万元 / 2–3 年回收、储能约 5 年回收；清洁能源消费 ≥90%、绿电直供 ≥50%、工业固废综合利用率 ≥80%。建成后预计产值 3.54 万亿元为券商测算，不作为官方统计。",
  },
];

export const storageBanner = {
  title: "源网荷储一体化",
  desc: "实现路径 · 就地平衡与自调度，测算数据接入独立页面",
  action: "进入测算",
};

export const sceneCards = [
  {
    key: "charging-pile",
    title: "充电桩",
    tag: "经济效益测算主线",
    more: "浏览更多数据",
    stats: [
      {
        label: "全省充电设施",
        value: "308.07",
        unit: "万个",
        icon: iconChongdian,
        iconSize: "lg",
      },
      {
        label: "1—8 月充电量",
        value: "126.03",
        unit: "亿 kWh",
        delta: "+47.82%",
        icon: iconChongdianliang,
        iconSize: "lg",
      },
      {
        label: "2030重卡标准桩目标",
        value: "12000",
        unit: "个",
        icon: iconMubiao,
        iconSize: "lg",
      },
    ],
    chart: {
      title: "浙江重卡标准充电桩：现状 → 规划",
      labels: ["现状", "2027", "2028", "2030"],
      values: [7951, 10689, 12163, 14269],
      ticks: [20000, 15000, 10000, 5000, 0],
    },
    note: "单位投资 150—300 万元，利用率不足时回收期可超 10 年；公共 27.64 万个 + 私人 280.43 万个，车桩比 1.58:1。",
  },
  {
    key: "virtual-plant",
    title: "虚拟电厂",
    tag: "经济效益测算主线",
    groups: [
      {
        key: "y2025",
        title: "2025 年 · 全年",
        stats: [
          {
            label: "市场化响应次数",
            value: "13",
            unit: "次",
            icon: iconXiangyingcishu,
            iconSize: "sm",
          },
          {
            label: "响应电量",
            value: "1506",
            unit: "万 kWh",
            icon: iconXiangyingdianliang,
            iconSize: "sm",
          },
        ],
      },
      {
        key: "y2026",
        title: "2026 年 · 截至 9 月",
        stats: [
          {
            label: "市场化响应次数",
            value: "9",
            unit: "次",
            icon: iconXiangyingcishu,
            iconSize: "sm",
          },
          {
            label: "响应电量",
            value: "306178",
            unit: "万 kWh",
            icon: iconXiangyingdianliang,
            iconSize: "sm",
          },
        ],
      },
    ],
    note: "响应电量 × 基数补偿基准 → 折算回收收益；2026 累计电量约为 2025 全年的 2.03 倍，但截至 9 月取数，不宜直接同比。",
  },
  {
    key: "user-storage",
    title: "用户侧储能",
    tag: "经济效益测算主线",
    more: "浏览更多数据",
    stats: [
      {
        label: "全省共投运新型储能",
        value: "670",
        unit: "万 kW",
        icon: iconChuneng,
        iconSize: "lg",
      },
      {
        label: "Q1 用户侧备案项目",
        value: "235",
        unit: "个（占 97.1%）",
        icon: iconBeian,
        iconSize: "lg",
      },
      {
        label: "工商业平均峰谷价差",
        value: "0.5",
        unit: "元/kWh",
        icon: iconJiacha,
        iconSize: "lg",
      },
    ],
    chart: {
      title: "浙江 2 小时储能项目静态回收期",
      labels: ["现状", "2027", "2028"],
      values: [5.4, 8, 9.1],
      ticks: [10, 5, 0],
    },
    note: "峰谷价差 × 年充放电次数 → 年化收益；收益率为约定未来三年，叠加容量管理、需求响应等多元收益。",
  },
];

export const mapTooltips = {
  "green-direct": {
    province: "江苏",
    count: 5,
    status: "状态：已公示 / 批复阶段为主（截至 2026-05 底）",
    projects: [
      "江苏常州溧阳高新区 · 江苏时代直连试点",
      "盐城 3 个项目之一",
      "江苏盐城大丰港新能源直连项目",
    ],
    footnotes: [
      "行业统计口径（地方政府公示整理），非国家能源局审定的官方统计。",
      "省份清单代表项目来自《绿电直连项目全量分析》（2026-08）。",
    ],
  },
  "zero-carbon-park": {
    province: "江苏",
    count: 5,
    status: "状态：已公示 / 批复阶段为主（截至 2026-05 底）",
    projects: [
      "江苏常州溧阳高新区 · 国家级零碳园区",
      "盐城 3 个项目之一",
      "江苏盐城大丰港零碳园区试点",
    ],
    footnotes: [
      "行业统计口径（地方政府公示整理），非国家能源局审定的官方统计。",
      "省份清单代表项目来自《首批国家级零碳园区名单》（2026-08）。",
    ],
  },
};
