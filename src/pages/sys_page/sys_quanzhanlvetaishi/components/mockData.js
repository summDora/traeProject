/**
 * 全战略态势大屏 —— 首期 mock 数据
 * 后续接真数据时，替换此处即可（结构保持）
 */
import iconZhengce from "@/asset/images/qzlts/zhengce.png";
import iconQuanguo from "@/asset/images/qzlts/quanguo.png";
import iconShengfen from "@/asset/images/qzlts/shengfen.png";
import iconChangguinengyuan from "@/asset/images/qzlts/changguinengyuan.png";
import iconXinengyuan from "@/asset/images/qzlts/xinengyuan.png";
import iconXinyetai from "@/asset/images/qzlts/xinyetai.png";
import iconTan from "@/asset/images/qzlts/tan.png";
import iconDianlishichang from "@/asset/images/qzlts/dianlishichang.png";
import iconDianjia from "@/asset/images/qzlts/dianjia.png";
import iconGoalTotal from "@/asset/images/qzlts/goal-total.png";
import iconGoalConstraint from "@/asset/images/qzlts/goal-constraint.png";
import iconGoalExpected from "@/asset/images/qzlts/goal-expected.png";

/** 左上「政策统计」左侧 KPI（对应设计稿三块，首个默认高亮） */
export const statsCategories = [
  { key: "policy", title: "政策数量", value: 116, unit: "条", icon: iconZhengce },
  { key: "national", title: "全国政策数量", value: 45, unit: "条", icon: iconQuanguo },
  { key: "province", title: "省份政策数量", value: 62, unit: "条", icon: iconShengfen },
];

/** 左上「政策统计」右侧分类列表：按左侧 KPI 的 key 绑定不同数据源 */
export const statsDetailMap = {
  policy: [
    { name: "常规电源与调节性电源", count: 24, icon: iconChangguinengyuan },
    { name: "新能源发展", count: 23, icon: iconXinengyuan },
    { name: "新业态与灵活性资源", count: 15, icon: iconXinyetai },
    { name: "碳与绿色转型", count: 19, icon: iconTan },
    { name: "电力市场改革", count: 12, icon: iconDianlishichang },
    { name: "电价与价格机制", count: 13, icon: iconDianjia },
  ],
  national: [
    { name: "国家能源战略与规划", count: 18, icon: iconChangguinengyuan },
    { name: "电力体制改革", count: 9, icon: iconDianlishichang },
    { name: "可再生能源政策", count: 8, icon: iconXinengyuan },
    { name: "储能与氢能", count: 6, icon: iconXinyetai },
    { name: "碳市场机制", count: 7, icon: iconTan },
    { name: "价格与补贴", count: 5, icon: iconDianjia },
  ],
  province: [
    { name: "省级能源规划", count: 16, icon: iconChangguinengyuan },
    { name: "新能源消纳", count: 12, icon: iconXinengyuan },
    { name: "新型储能示范", count: 11, icon: iconXinyetai },
    { name: "电力市场建设", count: 9, icon: iconDianlishichang },
    { name: "绿色低碳转型", count: 8, icon: iconTan },
    { name: "电价补贴机制", count: 6, icon: iconDianjia },
  ],
};

/**
 * 中间·政策画像：气泡数据
 * 气泡尺寸按 count 比例缩放，count 最大者居中，其余随机分布在周边
 * 接接口时替换为后端返回的 [{ key, name, count, tone }]（数量不固定）
 */
export const portraitBubbles = [
  { key: "charging", name: "充电桩", count: 78, tone: "green" },
  { key: "compute", name: "算力中心", count: 52, tone: "blue" },
  { key: "pv", name: "光伏", count: 48, tone: "cyan" },
  { key: "market", name: "电能量市场", count: 44, tone: "blue" },
  { key: "storage", name: "新型储能", count: 40, tone: "purple" },
  { key: "tou", name: "峰谷分时电价", count: 34, tone: "orange" },
  { key: "wind", name: "风电", count: 33, tone: "orange" },
  { key: "hydro", name: "水电", count: 30, tone: "amber" },
  { key: "carbon", name: "碳考核和碳核算", count: 28, tone: "blue" },
  { key: "vpp", name: "虚拟电厂", count: 26, tone: "olive" },
  { key: "green-direct", name: "绿电直连和零碳园区", count: 22, tone: "green" },
  { key: "coal", name: "煤电", count: 20, tone: "teal" },
  { key: "dr", name: "需求响应", count: 16, tone: "teal" },
  { key: "green-cert", name: "绿电绿证交易", count: 13, tone: "green" },
  { key: "aux", name: "辅助服务市场", count: 14, tone: "olive" },
  { key: "price", name: "工商业电价", count: 12, tone: "orange" },
  { key: "microgrid", name: "微电网", count: 10, tone: "purple" },
  { key: "residential", name: "居民农业电价", count: 9, tone: "amber" },
];

/** 右侧固定三张卡片的类型（顺序即展示顺序） */
const PORTRAIT_TYPES = [
  { key: "incentive", title: "激励型" },
  { key: "constraint", title: "约束型" },
  { key: "mixed", title: "混合型" },
];

const PORTRAIT_PROVINCES = [
  "上海", "安徽", "广东", "青海", "湖北", "江西", "湖南", "海南",
  "内蒙古", "河北", "河南", "黑龙江", "天津", "陕西", "四川", "吉林",
  "江苏", "山西", "甘肃", "云南", "北京", "浙江", "山东", "福建",
  "重庆", "贵州", "广西", "宁夏", "新疆", "辽宁",
];

const hashStr = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** 根据气泡 key 生成稳定的 mock 卡片（省份数即卡片内条目数，卡片高度随之变化） */
const buildPortraitCards = (seed) => {
  let cursor = hashStr(seed) || 1;
  return PORTRAIT_TYPES.map((type) => {
    cursor = (cursor * 1103515245 + 12345) % 2147483647;
    const size = 4 + (cursor % 9);
    const pool = PORTRAIT_PROVINCES.slice();
    const provinces = [];
    for (let i = 0; i < size && pool.length; i++) {
      cursor = (cursor * 1103515245 + 12345) % 2147483647;
      const name = pool.splice(cursor % pool.length, 1)[0];
      const score = 28 + ((cursor >> 7) % 73);
      provinces.push({ name, score });
    }
    return { ...type, provinces };
  });
};

/** 充电桩：按设计稿写死的示例数据，其余方向用稳定 mock 生成 */
const chargingCards = [
  {
    key: "incentive",
    title: "激励型",
    provinces: [
      { name: "上海", score: 100 },
      { name: "安徽", score: 100 },
      { name: "广东", score: 100 },
      { name: "青海", score: 89 },
      { name: "湖北", score: 75 },
      { name: "江西", score: 60 },
      { name: "湖南", score: 54 },
      { name: "海南", score: 37 },
    ],
  },
  {
    key: "constraint",
    title: "约束型",
    provinces: [
      { name: "内蒙古", score: 100 },
      { name: "河北", score: 100 },
      { name: "河南", score: 89 },
      { name: "黑龙江", score: 65 },
      { name: "天津", score: 48 },
    ],
  },
  {
    key: "mixed",
    title: "混合型",
    provinces: [
      { name: "陕西", score: 95 },
      { name: "四川", score: 91 },
      { name: "吉林", score: 89 },
      { name: "江苏", score: 75 },
      { name: "山西", score: 49 },
      { name: "甘肃", score: 48 },
      { name: "云南", score: 37 },
    ],
  },
];

export const portraitCardMap = portraitBubbles.reduce((map, item) => {
  map[item.key] = item.key === "charging" ? chargingCards : buildPortraitCards(item.key);
  return map;
}, {});

/** 中间·量化目标 目标地图 */
export const goalMapData = [
  { name: "北京", value: 82 },
  { name: "天津", value: 63 },
  { name: "河北", value: 71 },
  { name: "山西", value: 58 },
  { name: "内蒙古", value: 76 },
  { name: "辽宁", value: 61 },
  { name: "吉林", value: 49 },
  { name: "黑龙江", value: 52 },
  { name: "上海", value: 88 },
  { name: "江苏", value: 91 },
  { name: "浙江", value: 89 },
  { name: "安徽", value: 66 },
  { name: "福建", value: 73 },
  { name: "江西", value: 57 },
  { name: "山东", value: 85 },
  { name: "河南", value: 68 },
  { name: "湖北", value: 64 },
  { name: "湖南", value: 60 },
  { name: "广东", value: 94 },
  { name: "广西", value: 55 },
  { name: "海南", value: 47 },
  { name: "重庆", value: 62 },
  { name: "四川", value: 70 },
  { name: "贵州", value: 51 },
  { name: "云南", value: 54 },
  { name: "陕西", value: 59 },
  { name: "甘肃", value: 45 },
  { name: "青海", value: 48 },
  { name: "宁夏", value: 42 },
  { name: "新疆", value: 50 },
];

/** 中间·量化目标 排名列表 */
export const goalRankData = [
  { name: "广东", value: 94 },
  { name: "江苏", value: 91 },
  { name: "浙江", value: 89 },
  { name: "上海", value: 88 },
  { name: "山东", value: 85 },
  { name: "北京", value: 82 },
  { name: "内蒙古", value: 76 },
  { name: "福建", value: 73 },
  { name: "河北", value: 71 },
  { name: "四川", value: 70 },
  { name: "河南", value: 68 },
  { name: "安徽", value: 66 },
];

/** 中间·量化目标 发布情况 */
export const goalReleaseData = [
  { name: "1月", value: 42 },
  { name: "2月", value: 38 },
  { name: "3月", value: 55 },
  { name: "4月", value: 61 },
  { name: "5月", value: 49 },
  { name: "6月", value: 72 },
  { name: "7月", value: 68 },
  { name: "8月", value: 57 },
  { name: "9月", value: 80 },
  { name: "10月", value: 74 },
];

/** 中间·量化目标 左侧三块固定统计（设计稿：量化目标总数 / 约束性目标 / 预期性目标） */
export const goalSummary = [
  { key: "total", label: "量化目标总数", value: 1796, unit: "条", icon: iconGoalTotal },
  { key: "constraint", label: "约束性目标", value: 1027, unit: "条", icon: iconGoalConstraint },
  { key: "expected", label: "预期性目标", value: 769, unit: "条", icon: iconGoalExpected },
];

const scaleBy = (arr, k) =>
  arr.map((d) => ({ ...d, value: Math.round(d.value * k) }));

/** 中间·量化目标：点击左侧三块统计切换图表数据源 */
export const goalDataSets = {
  total: { map: goalMapData, rank: goalRankData, release: goalReleaseData },
  constraint: {
    map: scaleBy(goalMapData, 0.62),
    rank: scaleBy(goalRankData, 0.58),
    release: scaleBy(goalReleaseData, 0.6),
  },
  expected: {
    map: scaleBy(goalMapData, 0.42),
    rank: scaleBy(goalRankData, 0.36),
    release: scaleBy(goalReleaseData, 0.34),
  },
};

/** 中国全部省级行政区（方向热力 x 轴固定为这一份清单） */
export const chinaProvinces = [
  "上海", "内蒙古", "吉林", "天津", "安徽", "山西", "广西", "江苏",
  "河北", "浙江", "湖北", "甘肃", "西藏", "辽宁", "陕西", "黑龙江",
  "北京", "广东", "福建", "江西", "山东", "河南", "湖南", "海南",
  "重庆", "四川", "贵州", "云南", "青海", "宁夏", "新疆", "台湾",
  "香港", "澳门",
];

/** 方向热力行（y 轴，固定顺序） */
export const directionRows = [
  "容量电价机制", "碳关税与碳金融", "微电网", "辅配电价机制", "绿电直连和零碳园区",
  "需求响应", "辅助服务市场", "工商业电价", "绿电绿证交易", "核电",
  "碳市场（配额+CCER）", "虚拟电厂", "居民农业电价", "抽水蓄能", "碳核算与碳足迹",
  "新型储能", "风电", "气电", "煤电", "水电", "光伏",
  "电能量市场", "算力中心", "峰谷分时电价", "充电桩", "光伏产业",
  "光伏消纳", "光伏开发建设", "光伏电价机制",
];

/**
 * 中间·方向热力矩阵：行=方向，列=省份
 * 语义区分：null = 无数据（露出默认底色、不显示数字）；0 = 有数据且为 0（红色格子、显示 0）
 * values 为确定性 mock，接真数据时整体替换即可
 */
export const directionHeatmapData = {
  rows: directionRows,
  cols: chinaProvinces,
  values: directionRows.map((name, r) =>
    chinaProvinces.map((prov, c) => {
      const seed = (r * 41 + c * 67 + name.length * 7 + prov.length * 13) % 100;
      if (seed < 58) return null;
      if (seed < 64) return 0;
      return ((seed * 7) % 70) + 5;
    })
  ),
};

/** 右栏「外部动态」·顶部圆标 Tab（日 / 周 / 月 / 季 / 年） */
export const externalTabs = [
  { key: "day", short: "日", label: "每日要情", tone: "cyan", range: "2026/08/19 – 2026/08/25" },
  { key: "week", short: "周", label: "政策速递", tone: "blue", range: "2026/08/17 – 2026/08/23" },
  { key: "month", short: "月", label: "经研观察", tone: "purple", range: "2026/08/01 – 2026/08/31" },
  { key: "season", short: "季", label: "战略研判", tone: "orange", range: "2026/07/01 – 2026/09/30" },
  { key: "year", short: "年", label: "机制画像", tone: "green", range: "2026/01/01 – 2026/12/31" },
];

const feedItem = (title, tag, tagTone, desc, date, org) => ({
  title,
  tag,
  tagTone,
  desc,
  date,
  org,
});

/**
 * 右栏「外部动态」·按 Tab 分组的内容
 * 每组 = 国内动态 / 国外动态；卡片字段：title / tag / tagTone / desc / date / org
 */
export const externalFeedMap = {
  day: {
    groups: [
      {
        key: "domestic",
        title: "国内动态",
        items: [
          feedItem(
            "《石油天然气发展“十五五”规划》正式印发",
            "政策",
            "cyan",
            "对重点行业用电、外贸订单、物流活跃度进行综合监测，研判外贸景气走势。",
            "2025-08-19",
            "国家发改委"
          ),
          feedItem(
            "国家能源局召开可再生能源电力开发建设推进会",
            "会议",
            "purple",
            "基于“电力看经济”模型，对浙江GDP、工业产值与全社会用电量关联关系进行月度研判。",
            "2025-06-23",
            "国家能源局"
          ),
          feedItem(
            "服务宏观经济研判",
            "战略",
            "orange",
            "结合宏观运行、产业结构与能源消费数据，形成经济形势分析报告，服务重大政策研究。",
            "2025-08-19",
            "国网总部"
          ),
        ],
      },
      {
        key: "overseas",
        title: "国外动态",
        items: [
          feedItem(
            "欧盟碳边境调节机制",
            "机制",
            "green",
            "对重点行业用电、外贸订单、物流活跃度进行综合监测，研判外贸景气走势。",
            "2025-08-19",
            "欧盟委员会"
          ),
          feedItem(
            "美国加州分布式储能并网新规生效",
            "要情",
            "blue",
            "量化上游能源价格波动对中下游制造业用电成本、产出及碳排放的传导效应。",
            "2025-08-19",
            "欧盟委员会"
          ),
          feedItem(
            "《石油天然气发展“十五五”规划》正式印发",
            "政策",
            "cyan",
            "对重点行业用电、外贸订单、物流活跃度进行综合监测，研判外贸景气走势。",
            "2025-08-19",
            "欧盟委员会"
          ),
        ],
      },
    ],
  },
  week: {
    groups: [
      {
        key: "domestic",
        title: "国内动态",
        items: [
          feedItem(
            "国家发改委发布《新型储能规模化建设专项行动方案》",
            "政策",
            "cyan",
            "明确 2027 年新型储能装机规模目标，提出容量补偿与调用机制配套要求。",
            "2025-08-21",
            "国家发改委"
          ),
          feedItem(
            "工信部召开新能源装备产业链供需对接会",
            "会议",
            "purple",
            "围绕光伏、风电装备产能利用率与出口订单变化，研判产业链供需平衡态势。",
            "2025-08-20",
            "工业和信息化部"
          ),
          feedItem(
            "全国统一电力市场建设推进会召开",
            "战略",
            "orange",
            "部署省间现货市场连续运行、绿电绿证交易衔接等重点任务。",
            "2025-08-19",
            "国家能源局"
          ),
        ],
      },
      {
        key: "overseas",
        title: "国外动态",
        items: [
          feedItem(
            "欧盟发布《净零工业法案》实施细则",
            "机制",
            "green",
            "细化本土制造比例与拍卖韧性标准，跟踪对国内新能源装备出口的影响。",
            "2025-08-21",
            "欧盟委员会"
          ),
          feedItem(
            "美国能源部启动电网韧性升级计划",
            "要情",
            "blue",
            "首批资金投向输配电网改造与极端天气应对，量化对储能与需求侧资源的需求增量。",
            "2025-08-20",
            "美国能源部"
          ),
          feedItem(
            "日本修订《能源基本计划》",
            "政策",
            "cyan",
            "提高核电与可再生能源占比目标，跟踪对区域电力成本与产业链的传导。",
            "2025-08-18",
            "日本经济产业省"
          ),
        ],
      },
    ],
  },
  month: {
    groups: [
      {
        key: "domestic",
        title: "国内动态",
        items: [
          feedItem(
            "8月全社会用电量同比增长 6.8%",
            "要情",
            "blue",
            "二产用电增速回升、三产延续高增，结合高温天气与工业开工率做归因分析。",
            "2025-08-31",
            "国家能源局"
          ),
          feedItem(
            "全国碳市场月度成交额创新高",
            "机制",
            "green",
            "配额收紧与履约周期临近推动量价齐升，研判对重点排放行业用电成本的影响。",
            "2025-08-28",
            "生态环境部"
          ),
          feedItem(
            "多省出台分时电价优化方案",
            "战略",
            "orange",
            "峰谷时段与浮动比例调整，评估对工商业用能行为与储能收益空间的引导作用。",
            "2025-08-25",
            "国家发改委"
          ),
        ],
      },
      {
        key: "overseas",
        title: "国外动态",
        items: [
          feedItem(
            "IEA 发布《全球能源投资月度追踪》",
            "要情",
            "blue",
            "电网与储能投资增速领先，跟踪全球清洁能源资本开支结构变化。",
            "2025-08-29",
            "国际能源署"
          ),
          feedItem(
            "欧洲天然气期货价格震荡回落",
            "机制",
            "green",
            "库存高位与需求偏弱主导价格走势，量化对欧洲工业电价与产能转移的影响。",
            "2025-08-27",
            "欧盟委员会"
          ),
          feedItem(
            "美国加州分布式储能并网新规生效",
            "政策",
            "cyan",
            "简化并网流程并引入快速通道，跟踪对户用光伏与储能装机的拉动效应。",
            "2025-08-19",
            "加州公共事业委员会"
          ),
        ],
      },
    ],
  },
  season: {
    groups: [
      {
        key: "domestic",
        title: "国内动态",
        items: [
          feedItem(
            "“十五五”能源电力规划中期评估启动",
            "战略",
            "orange",
            "围绕目标完成度、项目落地率与投资强度开展季度评估，形成规划调整建议。",
            "2025-09-15",
            "国网总部"
          ),
          feedItem(
            "新型电力系统建设三年行动方案编制完成",
            "战略",
            "orange",
            "聚焦调节能力、配网承载与数字化支撑，梳理重点工程与配套政策清单。",
            "2025-08-30",
            "国家能源局"
          ),
          feedItem(
            "电力现货市场转入正式运行",
            "机制",
            "green",
            "现货价格信号对机组出力与用户负荷的引导作用显现，季度复盘市场运行成效。",
            "2025-07-10",
            "国家发改委"
          ),
        ],
      },
      {
        key: "overseas",
        title: "国外动态",
        items: [
          feedItem(
            "欧盟碳边境调节机制过渡期复盘",
            "机制",
            "green",
            "梳理申报数据与行业覆盖范围调整动向，评估对出口型制造业的合规成本。",
            "2025-09-20",
            "欧盟委员会"
          ),
          feedItem(
            "全球核电装机迎新一轮扩张周期",
            "要情",
            "blue",
            "多国重启核电项目审批，跟踪对铀资源、装备制造与电力结构的中长期影响。",
            "2025-09-08",
            "国际能源署"
          ),
          feedItem(
            "主要经济体氢能战略对比研判",
            "战略",
            "orange",
            "对比欧盟、日韩、中东氢能路线与补贴机制，提炼对国内产业布局的启示。",
            "2025-08-12",
            "国网经研院"
          ),
        ],
      },
    ],
  },
  year: {
    groups: [
      {
        key: "domestic",
        title: "国内动态",
        items: [
          feedItem(
            "电力中长期交易机制年度运行画像",
            "机制",
            "green",
            "签约比例、价格区间与偏差考核执行情况年度汇总，识别机制运行堵点。",
            "2025-12-20",
            "国家能源局"
          ),
          feedItem(
            "容量电价机制全覆盖成效评估",
            "机制",
            "green",
            "煤电容量电价执行满一年，评估对机组固定成本回收与调节能力保持的作用。",
            "2025-11-28",
            "国家发改委"
          ),
          feedItem(
            "绿电绿证交易机制年度总结",
            "战略",
            "orange",
            "绿证核发与交易规模持续扩大，研判与碳市场衔接路径及消费侧认证需求。",
            "2025-12-05",
            "国家能源局"
          ),
        ],
      },
      {
        key: "overseas",
        title: "国外动态",
        items: [
          feedItem(
            "欧盟电力市场设计改革年度观察",
            "机制",
            "green",
            "差价合约与容量机制改革落地进展，跟踪对成员电价波动与投资预期的影响。",
            "2025-12-10",
            "欧盟委员会"
          ),
          feedItem(
            "美国 IRA 政策两年成效画像",
            "政策",
            "cyan",
            "清洁能源投资与制造产能落地情况年度统计，评估政策不确定性风险。",
            "2025-11-15",
            "美国能源部"
          ),
          feedItem(
            "全球碳定价机制年度图谱",
            "要情",
            "blue",
            "碳税、碳市场与碳信用机制覆盖范围年度盘点，研判碳成本传导趋势。",
            "2025-10-30",
            "世界银行"
          ),
        ],
      },
    ],
  },
};

/** 中栏筛选·年份（示意用，后续接真数据时只替换数组） */
export const yearOptions = [
  { key: "2026", label: "2026年" },
  { key: "2025", label: "2025年" },
  { key: "2024", label: "2024年" },
  { key: "2023", label: "2023年" },
];

/** 中栏筛选·一级分类 → 二级分类（联动：换一级时二级回落到该一级的首项） */
export const categoryTree = [
  {
    key: "energy",
    label: "能源电力",
    children: [
      { key: "new-energy", label: "新能源" },
      { key: "thermal", label: "火电与煤电" },
      { key: "grid", label: "电网与输配" },
      { key: "storage", label: "储能与灵活性资源" },
    ],
  },
  {
    key: "industry",
    label: "工业制造",
    children: [
      { key: "steel", label: "钢铁冶金" },
      { key: "chemical", label: "化工材料" },
      { key: "equipment", label: "装备制造" },
    ],
  },
  {
    key: "transport",
    label: "交通运输",
    children: [
      { key: "road", label: "道路交通" },
      { key: "rail", label: "铁路运输" },
      { key: "shipping", label: "水运与港口" },
      { key: "aviation", label: "航空运输" },
    ],
  },
  {
    key: "building",
    label: "建筑建材",
    children: [
      { key: "green-building", label: "绿色建筑" },
      { key: "cement", label: "水泥建材" },
      { key: "hvac", label: "暖通空调" },
    ],
  },
];
