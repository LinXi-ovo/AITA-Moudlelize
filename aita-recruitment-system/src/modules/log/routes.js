// 日志管理模块 - 路由
export default [
  {
    path: '/logs',
    name: 'LogManagement',
    component: () => import('@/views/LogManagement.vue'),
    meta: { requiresAuth: true, permission: 'log.manage' }
  }
]