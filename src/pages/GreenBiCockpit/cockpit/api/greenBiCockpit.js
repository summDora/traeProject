import dashboardData from '../dashboardData.json'

function mockResolve(result = [], extra = {}) {
  return Promise.resolve({
    success: true,
    code: 200,
    result,
    total: Array.isArray(result) ? result.length : 0,
    message: 'mock',
    ...extra
  })
}

/**
 * 获取绿色能源驾驶舱全量数据
 * TODO: 接入真实接口后替换 mockResolve
 */
export function getGreenBiCockpitDashboard() {
  return mockResolve(dashboardData, { message: '获取驾驶舱数据成功' })
}
