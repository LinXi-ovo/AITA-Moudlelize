// 文件管理模块 - 路由
export default [
  {
    path: '/files',
    name: 'FileManagement',
    component: () => import('@/views/FileManagement.vue'),
    meta: { requiresAuth: true }
  }
]