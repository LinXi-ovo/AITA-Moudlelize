// 用户管理模块 - store
const state = {
  currentUser: null,
  users: [],
  userDetail: null
}

const mutations = {
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  SET_USERS(state, users) {
    state.users = users
  },
  SET_USER_DETAIL(state, user) {
    state.userDetail = user
  },
  ADD_USER(state, user) {
    state.users.push(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(user => user.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter(user => user.id !== userId)
  }
}

const actions = {
  async fetchUsers({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const users = [
        { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' },
        { id: 2, username: 'user1', email: 'user1@example.com', role: 'applicant' }
      ]
      commit('SET_USERS', users)
      return users
    } catch (error) {
      console.error('获取用户列表失败:', error)
      throw error
    }
  },
  
  async fetchUserById({ commit }, userId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const user = { id: userId, username: 'testuser', email: 'test@example.com', role: 'applicant' }
      commit('SET_USER_DETAIL', user)
      return user
    } catch (error) {
      console.error('获取用户详情失败:', error)
      throw error
    }
  },
  
  async createUser({ commit }, userData) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const newUser = { 
        id: Date.now(), // 模拟ID生成
        ...userData 
      }
      commit('ADD_USER', newUser)
      return newUser
    } catch (error) {
      console.error('创建用户失败:', error)
      throw error
    }
  },
  
  async updateUser({ commit }, { id, userData }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const updatedUser = { id, ...userData }
      commit('UPDATE_USER', updatedUser)
      return updatedUser
    } catch (error) {
      console.error('更新用户失败:', error)
      throw error
    }
  },
  
  async deleteUser({ commit }, userId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      commit('REMOVE_USER', userId)
      return userId
    } catch (error) {
      console.error('删除用户失败:', error)
      throw error
    }
  },
  
  login({ commit }, userData) {
    // 登录逻辑
    commit('SET_CURRENT_USER', userData)
  },
  
  logout({ commit }) {
    // 登出逻辑
    commit('SET_CURRENT_USER', null)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}