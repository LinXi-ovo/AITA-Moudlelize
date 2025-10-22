// 反馈管理模块 - 路由
export default [
  {
    path: '/feedback',
    name: 'FeedbackManagement',
    component: () => import('@/views/FeedbackManagement.vue'),
    meta: { requiresAuth: true, permission: 'feedback.manage' }
  }
]