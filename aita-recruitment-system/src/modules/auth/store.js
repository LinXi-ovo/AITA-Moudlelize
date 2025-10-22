// 权限管理模块 - store
const state = {
  currentUser: null,
  permissions: [],
  roles: []
}

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  SET_PERMISSIONS(state, permissions) {
    state.permissions = permissions
  },
  SET_ROLES(state, roles) {
    state.roles = roles
  }
}

const actions = {
  async login({ commit }, credentials) {
    // 模拟登录
    try {
      // 这里应该调用实际的API
      const user = {
        id: 1,
        username: credentials.username,
        role: credentials.username === 'admin' ? 'admin' : 
              credentials.username === 'interviewer' ? 'interviewer' : 'applicant',
        permissions: []
      }
      
      // 根据角色设置权限
      if (user.role === 'admin') {
        user.permissions = ['user.manage', 'recruitment.manage', 'exam.manage', 'interview.manage', 'evaluation.manage', 'statistics.view', 'feedback.manage', 'log.manage']
      } else if (user.role === 'interviewer') {
        user.permissions = ['interview.view', 'interview.manage', 'evaluation.create', 'feedback.submit']
      } else {
        user.permissions = ['profile.view', 'exam.take', 'interview.view', 'feedback.submit']
      }
      
      commit('SET_CURRENT_USER', user)
      commit('SET_PERMISSIONS', user.permissions)
      return user
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  },
  
  async logout({ commit }) {
    // 模拟登出
    try {
      commit('SET_CURRENT_USER', null)
      commit('SET_PERMISSIONS', [])
    } catch (error) {
      console.error('登出失败:', error)
      throw error
    }
  },
  
  async fetchRoles({ commit }) {
    // 模拟获取角色列表
    try {
      const roles = [
        { id: 1, name: 'admin', description: '管理员' },
        { id: 2, name: 'interviewer', description: '面试官' },
        { id: 3, name: 'applicant', description: '申请人' }
      ]
      commit('SET_ROLES', roles)
      return roles
    } catch (error) {
      console.error('获取角色列表失败:', error)
      throw error
    }
  }
}

const getters = {
  isLoggedIn: (state) => !!state.currentUser,
  currentUserRole: (state) => state.currentUser ? state.currentUser.role : null,
  hasPermission: (state) => (permission) => {
    return state.currentUser && state.currentUser.permissions.includes(permission)
  },
  isAdmin: (state) => state.currentUser && state.currentUser.role === 'admin',
  isInterviewer: (state) => state.currentUser && state.currentUser.role === 'interviewer',
  isApplicant: (state) => state.currentUser && state.currentUser.role === 'applicant'
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}