/**
 * sys_page 可复用图表 —— dark / light 主题色板
 * 图表组件通过 props.theme("dark" | "light")切换；dark 用于大屏深色底，light 用于白底浅色页
 */
const THEMES = {
  dark: {
    name: "dark",
    text: "rgba(190, 226, 255, 0.9)",
    textDim: "rgba(150, 196, 235, 0.65)",
    textStrong: "#eaf6ff",
    axisLine: "rgba(70, 170, 255, 0.35)",
    splitLine: "rgba(70, 170, 255, 0.14)",
    axisTick: "rgba(70, 170, 255, 0.35)",
    accent: "#22d3ee",
    accentSoft: "rgba(34, 211, 238, 0.25)",
    series: ["#22d3ee", "#4f8cff", "#34d399", "#f5b942", "#f472b6", "#a78bfa"],
    tipBg: "rgba(6, 20, 40, 0.94)",
    tipBorder: "rgba(34, 211, 238, 0.45)",
    tipText: "#eaf6ff",
    vmColor: ["rgba(20,60,110,1)", "#22d3ee"],
    vmText: "rgba(150,196,235,0.75)",
    /* 方向热力连续色阶：0（红）→ 橙 → 黄 → 黄绿 → 绿 → 棕绿（不走蓝色系，整体明度压暗一档） */
    heatColors: [
      "#D32F2F",
      "#E2501B",
      "#F47902",
      "#F89817",
      "#D2A127",
      "#94962B",
      "#648E2E",
    ],
    heatLabel: "#0C1E2A",
    heatBorder: "#031a2a",
    heatEmpty: "#174655",
    mapArea: "rgba(24, 70, 120, 0.85)",
    mapBorder: "rgba(120, 210, 255, 0.55)",
    mapBg: "transparent",
    barGradEnd: "rgba(79, 140, 255, 0.05)",
  },
  light: {
    name: "light",
    text: "#334155",
    textDim: "#64748b",
    textStrong: "#0f172a",
    axisLine: "rgba(148, 163, 184, 0.6)",
    splitLine: "rgba(148, 163, 184, 0.28)",
    axisTick: "rgba(148, 163, 184, 0.6)",
    accent: "#0ea5e9",
    accentSoft: "rgba(14, 165, 233, 0.2)",
    series: ["#0ea5e9", "#2563eb", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"],
    tipBg: "rgba(255, 255, 255, 0.96)",
    tipBorder: "rgba(148, 163, 184, 0.55)",
    tipText: "#0f172a",
    vmColor: ["#e0f2fe", "#0284c7"],
    vmText: "#475569",
    heatColors: [
      "#D32F2F",
      "#E2501B",
      "#F47902",
      "#F89817",
      "#D2A127",
      "#94962B",
      "#648E2E",
    ],
    heatLabel: "#1F2937",
    heatBorder: "#ffffff",
    heatEmpty: "#DCE9EC",
    mapArea: "#dbeafe",
    mapBorder: "rgba(2, 100, 180, 0.5)",
    mapBg: "#f8fafc",
    barGradEnd: "rgba(37, 99, 235, 0.05)",
  },
};

/** 取主题色板；未知 theme 回落 dark */
export function getTheme(theme) {
  return THEMES[theme] || THEMES.dark;
}

/** 统一 tooltip 样式（各图表复用） */
export function buildTooltip(p) {
  return {
    trigger: "axis",
    backgroundColor: p.tipBg,
    borderColor: p.tipBorder,
    borderWidth: 1,
    textStyle: { color: p.tipText, fontSize: 13 },
    extraCssText: "box-shadow:0 6px 18px rgba(0,0,0,0.25);",
  };
}

export default THEMES;
