// 用户管理模块 - 路由
export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/modules/user/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/modules/user/views/Register.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/modules/user/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/modules/user/views/List.vue'),
    meta: { requiresAuth: true, permission: 'user.manage' }
  },
  {
    path: '/users/create',
    name: 'UserCreate',
    component: () => import('@/modules/user/views/Create.vue'),
    meta: { requiresAuth: true, permission: 'user.manage' }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: () => import('@/modules/user/views/Detail.vue'),
    meta: { requiresAuth: true, permission: 'user.manage' }
  },
  {
    path: '/users/:id/edit',
    name: 'UserEdit',
    component: () => import('@/modules/user/views/Edit.vue'),
    meta: { requiresAuth: true, permission: 'user.manage' }
  }
]