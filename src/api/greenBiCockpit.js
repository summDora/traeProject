import { mockResolve } from './mockFactory'
import dashboardData from '@/pages/GreenBiCockpit/dashboardData.json'

/**
 * 获取绿色能源驾驶舱全量数据
 * TODO: 接入真实接口后替换 mockResolve
 */
export function getGreenBiCockpitDashboard() {
  return mockResolve(dashboardData, { message: '获取驾驶舱数据成功' })
}
