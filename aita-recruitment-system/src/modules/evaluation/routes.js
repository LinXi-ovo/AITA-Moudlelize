// 评价管理模块 - 路由
export default [
  {
    path: '/evaluations',
    name: 'Evaluations',
    component: () => import('@/modules/evaluation/views/List.vue'),
    meta: { requiresAuth: true, permission: 'evaluation.manage' }
  },
  {
    path: '/evaluations/create',
    name: 'CreateEvaluation',
    component: () => import('@/modules/evaluation/views/Create.vue'),
    meta: { requiresAuth: true, permission: 'evaluation.create' }
  },
  {
    path: '/evaluations/:id',
    name: 'EvaluationDetail',
    component: () => import('@/modules/evaluation/views/Detail.vue'),
    meta: { requiresAuth: true, permission: 'evaluation.view' }
  },
  {
    path: '/evaluations/:id/edit',
    name: 'EditEvaluation',
    component: () => import('@/modules/evaluation/views/Edit.vue'),
    meta: { requiresAuth: true, permission: 'evaluation.manage' }
  }
]