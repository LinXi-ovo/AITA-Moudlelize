// 面试管理模块 - 路由
export default [
  {
    path: '/interviews',
    name: 'Interviews',
    component: () => import('@/modules/interview/views/List.vue'),
    meta: { requiresAuth: true, permission: 'interview.manage' }
  },
  {
    path: '/interviews/schedule',
    name: 'ScheduleInterview',
    component: () => import('@/modules/interview/views/Schedule.vue'),
    meta: { requiresAuth: true, permission: 'interview.manage' }
  },
  {
    path: '/interviews/:id',
    name: 'InterviewDetail',
    component: () => import('@/modules/interview/views/Detail.vue'),
    meta: { requiresAuth: true, permission: 'interview.view' }
  },
  {
    path: '/interviews/:id/edit',
    name: 'EditInterview',
    component: () => import('@/modules/interview/views/Edit.vue'),
    meta: { requiresAuth: true, permission: 'interview.manage' }
  }
]