const fs = require('fs')
const path = require('path')
const vm = require('vm')

const mockPath = path.join(__dirname, '../mockData.js')
const outPath = path.join(__dirname, '../dashboardData.json')

const raw = fs.readFileSync(mockPath, 'utf8')
const sandbox = {}
const script = raw
  .replace(/export const /g, 'const ')
  .replace(/\/\*\*[\s\S]*?\*\//g, '')
  .replace(/^\/\/.*$/gm, '')

vm.runInNewContext(`${script}
this.__DATA__ = {
  globalCountryStats,
  globalTotal,
  globalPieData,
  globalTrendYears,
  globalTrendSeries,
  regionRanking,
  granteeRankingDomestic,
  granteeRankingGlobal,
  globalApplyTrendCountries,
  globalApplyTrendOffices,
  techRadarCategories,
  techRadarData,
  chinaPatentSummary,
  chinaPatentTrendYears,
  chinaPatentTrendSeries,
  top50Ranking,
  techFieldDistribution,
  mapProvinceData
}
`, sandbox)

const d = sandbox.__DATA__

const dashboard = {
  globalPatentStock: {
    desc: '全球绿色能源电力领域专利总体存量',
    total: d.globalTotal,
    countryStats: d.globalCountryStats.map(({ name, value }) => ({ name, value })),
    pieData: d.globalPieData.map(({ name, y, value }) => ({ name, y, value }))
  },
  globalValidPatentTrend: {
    desc: '中国和其他国家绿色有效专利变化趋势',
    xAxisData: { data: d.globalTrendYears },
    seriesData: d.globalTrendSeries.map(({ name, data }) => ({ name, data }))
  },
  globalApplyTrend: {
    desc: '近5年绿色能源电力全球申请趋势',
    countries: {
      categories: d.globalApplyTrendCountries.categories,
      seriesData: d.globalApplyTrendCountries.data.map(item =>
        typeof item === 'number' ? item : item.y
      )
    },
    offices: {
      categories: d.globalApplyTrendOffices.categories,
      seriesData: d.globalApplyTrendOffices.data.map(item =>
        typeof item === 'number' ? item : item.y
      )
    }
  },
  globalTechRadar: {
    desc: '近5年全球绿色能源电力各技术分支授权量',
    categories: d.techRadarCategories,
    seriesData: [{ name: '授权量', data: d.techRadarData }]
  },
  domesticRegionRanking: {
    desc: '全国绿色专利授权量区域排名',
    list: d.regionRanking
  },
  granteeRanking: {
    desc: '绿色专利授权权人排名',
    domestic: d.granteeRankingDomestic,
    global: d.granteeRankingGlobal
  },
  mapProvinceData: {
    desc: '全国绿色专利授权量地图分布',
    list: d.mapProvinceData
  },
  chinaPatentSummary: {
    desc: '近5年申请总量和授权总量',
    applyTotal: d.chinaPatentSummary.applyTotal,
    grantTotal: d.chinaPatentSummary.grantTotal
  },
  chinaPatentTrend: {
    desc: '近5年申请总量和授权总量趋势',
    xAxisData: { data: d.chinaPatentTrendYears },
    seriesData: d.chinaPatentTrendSeries.map(({ name, data }) => ({ name, data }))
  },
  chinaTop50Ranking: {
    desc: '创新主体专利申请专利权人排名（TOP50）',
    list: d.top50Ranking
  },
  chinaTechFieldDistribution: {
    desc: '技术领域授权专利分布',
    yAxisData: { data: d.techFieldDistribution.map(item => item.name) },
    seriesData: [{ name: '授权量', data: d.techFieldDistribution.map(item => item.value) }]
  }
}

fs.writeFileSync(outPath, JSON.stringify(dashboard, null, 2), 'utf8')
console.log('written', outPath)
