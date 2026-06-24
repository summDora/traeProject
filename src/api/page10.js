export function fetchPage10Data() {
  return Promise.resolve({
    code: 200,
    data: {
      personRiskData: [],
      reporterRiskData: [],
      constructionData: [],
      majorData: [],
      systemData: [],
      statsData: {
        totalProjects: 0,
        excellent: 0,
        good: 0,
        normal: 0,
        unknown: 0,
        bad: 0
      },
      causeData: {
        success: [],
        warning: [],
        danger: []
      }
    }
  })
}
