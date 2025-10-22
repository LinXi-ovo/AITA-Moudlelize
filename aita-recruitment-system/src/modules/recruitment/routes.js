// 招新管理模块 - 路由
export default [
  {
    path: '/recruitments',
    name: 'Recruitments',
    component: () => import('@/modules/recruitment/views/List.vue'),
    meta: { requiresAuth: true, permission: 'recruitment.manage' }
  },
  {
    path: '/recruitments/create',
    name: 'CreateRecruitment',
    component: () => import('@/modules/recruitment/views/Create.vue'),
    meta: { requiresAuth: true, permission: 'recruitment.manage' }
  },
  {
    path: '/recruitments/:id',
    name: 'RecruitmentDetail',
    component: () => import('@/modules/recruitment/views/Detail.vue'),
    meta: { requiresAuth: true, permission: 'recruitment.manage' }
  },
  {
    path: '/recruitments/:id/edit',
    name: 'EditRecruitment',
    component: () => import('@/modules/recruitment/views/Edit.vue'),
    meta: { requiresAuth: true, permission: 'recruitment.manage' }
  }
]