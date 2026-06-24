import Vue from 'vue'
import VueRouter from 'vue-router'
import TableWithExplanation from '../components/TableWithExplanation.vue'

Vue.use(VueRouter)

const xcyPages = [
  { path: '/xcy/page4', name: 'Page4', component: () => import('../hy/page4.vue'), meta: { title: '页面 4' } },
  { path: '/xcy/page6', name: 'Page6', component: () => import('../hy/page6.vue'), meta: { title: '页面 6' } },
  { path: '/xcy/page10', name: 'Page10', component: () => import('../hy/page10.vue'), meta: { title: '页面 10' } },
  { path: '/xcy/page11', name: 'Page11', component: () => import('../hy/page11.vue'), meta: { title: '页面 11' } },
  { path: '/xcy/page12', name: 'Page12', component: () => import('../hy/page12.vue'), meta: { title: '页面 12' } }
]

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: 'UserBehavior',
      component: TableWithExplanation,
      meta: { title: '用户行为分析' }
    },
    ...xcyPages,
    {
      path: '/multi-table/page13',
      name: 'Page13',
      component: () => import('../hy/page13.vue'),
      meta: { title: '页面 13' }
    },
    {
      path: '/multi-table/time-link-cursor',
      name: 'TimeLinkCursor',
      component: () => import('../hy/pageTimeLinkCursor.vue'),
      meta: { title: '时间联动-curosr' }
    },
    {
      path: '/multi-table/time-link',
      name: 'TimeLink',
      component: () => import('../hy/pageTimeLink.vue'),
      meta: { title: '时间联动' }
    },
    {
      path: '/multi-table/market-price',
      name: 'MarketPrice',
      component: () => import('../hy/marketPrice/pageMarketPrice.vue'),
      meta: { title: '市场价格预测' }
    },
    {
      path: '/multi-table/async-task',
      name: 'AsyncTaskMonitor',
      component: () => import('../hy/asyncTask/pageAsyncTaskMonitor.vue'),
      meta: { title: '异步任务监控' }
    },
    {
      path: '/policy-graph',
      name: 'PolicyGraph',
      component: () => import('../hy/policyHome/pagePolicyHome.vue'),
      meta: { title: '政策图谱首页' }
    },
    {
      path: '/policy-graph/graph',
      name: 'PolicyGraphDetail',
      component: () => import('../hy/pageZC.vue'),
      meta: { title: '政策图谱' }
    },
    {
      path: '/brain-map',
      name: 'BrainMap',
      component: () => import('../hy/pageBrain.vue'),
      meta: { title: '脑图维护' }
    },
    {
      path: '/effectiveness',
      name: 'Effectiveness',
      component: () => import('../hy/pageEffectiveness.vue'),
      meta: { title: '成效概览' }
    },
    {
      path: '/project-info',
      name: 'ProjectInfo',
      component: () => import('../hy/pageProjectInfo.vue'),
      meta: { title: '项目信息分析' }
    },
    {
      path: '/pre-reserve',
      name: 'PreReserveList',
      component: () => import('../hy/preReserve/pagePreReserveList.vue'),
      meta: { title: '预储备提报' }
    },
    {
      path: '/pre-reserve/add',
      name: 'PreReserveAdd',
      component: () => import('../hy/preReserve/pagePreReserveForm.vue'),
      meta: { title: '预储备需求新增' }
    },
    {
      path: '/demo/csProjectInternalAudit/csProjectInternalAudit',
      name: 'CsProjectInternalAudit',
      component: () => import('../hy/demo/csProjectInternalAudit/csProjectInternalAudit.vue'),
      meta: { title: 'CS项目内审' }
    },
    {
      path: '/demo/szhProjectManagement/szhProjectManagement',
      name: 'SzhProjectManagement',
      component: () => import('../hy/demo/szhProjectManagement/szhProjectManagement.vue'),
      meta: { title: '数字化项目管理' }
    },
    {
      path: '/demo/xuqiu/demandCoordination',
      name: 'DemandCoordination',
      component: () => import('../hy/xuqiu/demandCoordination/demandCoordination.vue'),
      meta: { title: '需求统筹' }
    },
    {
      path: '/demo/xuqiu/demandClosing',
      name: 'DemandClosing',
      component: () => import('../hy/xuqiu/demandClosing/demandClosing.vue'),
      meta: { title: '需求收口' }
    },
    {
      path: '/demo/xuqiu/demandReservePool',
      name: 'DemandReservePool',
      component: () => import('../hy/xuqiu/demandReservePool/demandReservePool.vue'),
      meta: { title: '需求储备库' }
    },
    {
      path: '/demo/xuqiu/demandReportManagement',
      name: 'DemandReportManagement',
      component: () => import('../hy/xuqiu/demandReportManagement/demandReportManagement.vue'),
      meta: { title: '需求报表管理' }
    },
    {
      path: '/demo/xuqiu/demandPreliminaryReview',
      name: 'DemandPreliminaryReview',
      component: () => import('../hy/xuqiu/demandPreliminaryReview/demandPreliminaryReview.vue'),
      meta: { title: '需求初审' }
    },
    {
      path: '/demo/xuqiu/demandPreReservePool',
      name: 'DemandPreReservePool',
      component: () => import('../hy/xuqiu/demandPreReservePool/demandPreReservePool.vue'),
      meta: { title: '预储备库' }
    },
    {
      path: '/demo/xuqiu/demandDeclaration',
      name: 'DemandDeclaration',
      component: () => import('../hy/xuqiu/demandDeclaration/demandDeclaration.vue'),
      meta: { title: '需求申报' }
    },
    {
      path: '/demo/xuqiu/demandReviewMeeting',
      name: 'DemandReviewMeeting',
      component: () => import('../hy/xuqiu/demandReviewMeeting/demandReviewMeeting.vue'),
      meta: { title: '需求评审会议安排' }
    },
    {
      path: '/demo/xuqiu/expertReviewArrangement',
      name: 'ExpertReviewArrangement',
      component: () => import('../hy/xuqiu/expertReviewArrangement/expertReviewArrangement.vue'),
      meta: { title: '专家评审安排' }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

export default router

export const navMenus = [
  { path: "/", title: "用户行为分析" },
  {
    title: "xcy",
    children: xcyPages.map((route) => ({
      path: route.path,
      title: route.meta.title,
    })),
  },
  {
    title: "多表格",
    children: [
      { path: "/multi-table/page13", title: "页面 13" },
      { path: "/brain-map", title: "脑图维护" },
      { path: "/multi-table/time-link-cursor", title: "时间联动-curosr" },
      { path: "/multi-table/time-link", title: "时间联动" },
      { path: "/multi-table/market-price", title: "市场价格预测" },
      { path: "/multi-table/async-task", title: "异步任务监控" },
    ],
  },

  {
    title: "政策图谱",
    children: [
      { path: "/policy-graph", title: "政策图谱首页" },
      { path: "/policy-graph/graph", title: "政策图谱" },
    ],
  },
  {
    title: "成效页面",
    children: [
      { path: "/effectiveness", title: "成效概览" },
      { path: "/project-info", title: "项目信息分析" },
      { path: "/pre-reserve", title: "预储备提报" },
      { path: "/demo/csProjectInternalAudit/csProjectInternalAudit", title: "CS项目内审" },
      { path: "/demo/szhProjectManagement/szhProjectManagement", title: "数字化项目管理" },
      { path: "/demo/xuqiu/demandCoordination", title: "需求统筹" },
      { path: "/demo/xuqiu/demandClosing", title: "需求收口" },
      { path: "/demo/xuqiu/demandReservePool", title: "需求储备库" },
      { path: "/demo/xuqiu/demandReportManagement", title: "需求报表管理" },
      { path: "/demo/xuqiu/demandPreliminaryReview", title: "需求初审" },
      { path: "/demo/xuqiu/demandPreReservePool", title: "预储备库" },
      { path: "/demo/xuqiu/demandDeclaration", title: "需求申报" },
      { path: "/demo/xuqiu/demandReviewMeeting", title: "需求评审会议安排" },
      { path: "/demo/xuqiu/expertReviewArrangement", title: "专家评审安排" },
    ],
  },
];
