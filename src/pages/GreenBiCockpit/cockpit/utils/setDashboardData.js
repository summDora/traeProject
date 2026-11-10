/**
 * 将接口返回的驾驶舱 JSON 拆分为左右面板数据
 * 数据结构参考 dashboardData.json（模块 desc + xAxisData/seriesData/list）
 */

function normalizeMapProvinceData(raw) {
  if (Array.isArray(raw)) {
    return raw.map(item => ({
      name: item.name,
      value: item.value,
      coordinate: item.coordinate
    }))
  }
  if (raw && Array.isArray(raw.list)) {
    return raw.list.map(item => ({
      name: item.name,
      value: item.value,
      coordinate: item.coordinate
    }))
  }
  return []
}

export function setDashboardData(raw = {}) {
  return {
    leftPanelData: {
      globalPatentStock: raw.globalPatentStock || {},
      globalValidPatentTrend: raw.globalValidPatentTrend || {},
      globalApplyTrend: raw.globalApplyTrend || {},
      globalTechRadar: raw.globalTechRadar || {},
      domesticRegionRanking: raw.domesticRegionRanking || {},
      granteeRanking: raw.granteeRanking || {},
      mapProvinceData: normalizeMapProvinceData(raw.mapProvinceData)
    },
    rightPanelData: {
      chinaPatentSummary: raw.chinaPatentSummary || {},
      chinaPatentTrend: raw.chinaPatentTrend || {},
      chinaTop50Ranking: raw.chinaTop50Ranking || {},
      chinaTechFieldDistribution: raw.chinaTechFieldDistribution || {}
    }
  }
}

export function createEmptyDashboardState() {
  return setDashboardData({})
}
