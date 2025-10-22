import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'

// 按需导入模块路由
import userRoutes from '@/modules/user/routes'
import recruitmentRoutes from '@/modules/recruitment/routes'
import examRoutes from '@/modules/exam/routes'
import interviewRoutes from '@/modules/interview/routes'
import evaluationRoutes from '@/modules/evaluation/routes'
import statisticsRoutes from '@/modules/statistics/routes'
import fileRoutes from '@/modules/file/routes'
import feedbackRoutes from '@/modules/feedback/routes'
import logRoutes from '@/modules/log/routes'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  ...userRoutes,
  ...recruitmentRoutes,
  ...examRoutes,
  ...interviewRoutes,
  ...evaluationRoutes,
  ...statisticsRoutes,
  ...fileRoutes,
  ...feedbackRoutes,
  ...logRoutes
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 检查是否需要权限
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredPermission = to.meta.permission
  
  // 获取当前用户
  const currentUser = router.app.$store.state.auth.currentUser
  
  if (requiresAuth && !currentUser) {
    // 需要登录但未登录，重定向到登录页
    next('/login')
  } else if (requiredPermission && currentUser) {
    // 需要特定权限，检查用户是否有该权限
    const hasPermission = router.app.$store.getters['auth/hasPermission'](requiredPermission)
    if (hasPermission) {
      next()
    } else {
      // 没有权限，重定向到首页或无权限页面
      next('/')
    }
  } else {
    next()
  }
})

export default router