// 数据统计模块 - 路由
export default [
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('@/modules/statistics/views/Dashboard.vue'),
    meta: { requiresAuth: true, permission: 'statistics.view' }
  },
  {
    path: '/statistics/reports',
    name: 'Reports',
    component: () => import('@/modules/statistics/views/Reports.vue'),
    meta: { requiresAuth: true, permission: 'statistics.view' }
  }
]