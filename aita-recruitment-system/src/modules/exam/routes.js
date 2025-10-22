// 笔试管理模块 - 路由
export default [
  {
    path: '/exams',
    name: 'Exams',
    component: () => import('@/modules/exam/views/List.vue'),
    meta: { requiresAuth: true, permission: 'exam.manage' }
  },
  {
    path: '/exams/create',
    name: 'CreateExam',
    component: () => import('@/modules/exam/views/Create.vue'),
    meta: { requiresAuth: true, permission: 'exam.manage' }
  },
  {
    path: '/exams/:id',
    name: 'ExamDetail',
    component: () => import('@/modules/exam/views/Detail.vue'),
    meta: { requiresAuth: true, permission: 'exam.manage' }
  },
  {
    path: '/exams/:id/edit',
    name: 'EditExam',
    component: () => import('@/modules/exam/views/Edit.vue'),
    meta: { requiresAuth: true, permission: 'exam.manage' }
  },
  {
    path: '/exams/:id/take',
    name: 'TakeExam',
    component: () => import('@/modules/exam/views/Take.vue'),
    meta: { requiresAuth: true, permission: 'exam.take' }
  }
]