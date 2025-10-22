// 招新管理模块 - store
const state = {
  recruitments: [],
  recruitmentDetail: null
}

const mutations = {
  SET_RECRUITMENTS(state, recruitments) {
    state.recruitments = recruitments
  },
  SET_RECRUITMENT_DETAIL(state, recruitment) {
    state.recruitmentDetail = recruitment
  },
  ADD_RECRUITMENT(state, recruitment) {
    state.recruitments.push(recruitment)
  },
  UPDATE_RECRUITMENT(state, updatedRecruitment) {
    const index = state.recruitments.findIndex(r => r.id === updatedRecruitment.id)
    if (index !== -1) {
      state.recruitments.splice(index, 1, updatedRecruitment)
    }
  },
  REMOVE_RECRUITMENT(state, recruitmentId) {
    state.recruitments = state.recruitments.filter(r => r.id !== recruitmentId)
  }
}

const actions = {
  async fetchRecruitments({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const recruitments = [
        { 
          id: 1, 
          title: '2025年春季招新', 
          description: 'AITA社团2025年春季招新活动', 
          startDate: '2025-03-01', 
          endDate: '2025-03-31',
          status: 'active'
        },
        { 
          id: 2, 
          title: '2025年秋季招新', 
          description: 'AITA社团2025年秋季招新活动', 
          startDate: '2025-09-01', 
          endDate: '2025-09-30',
          status: 'planned'
        }
      ]
      commit('SET_RECRUITMENTS', recruitments)
      return recruitments
    } catch (error) {
      console.error('获取招新活动列表失败:', error)
      throw error
    }
  },
  
  async fetchRecruitmentById({ commit }, recruitmentId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const recruitment = { 
        id: recruitmentId, 
        title: '2025年春季招新', 
        description: 'AITA社团2025年春季招新活动', 
        startDate: '2025-03-01', 
        endDate: '2025-03-31',
        status: 'active'
      }
      commit('SET_RECRUITMENT_DETAIL', recruitment)
      return recruitment
    } catch (error) {
      console.error('获取招新活动详情失败:', error)
      throw error
    }
  },
  
  async createRecruitment({ commit }, recruitmentData) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const newRecruitment = { 
        id: Date.now(), // 模拟ID生成
        ...recruitmentData 
      }
      commit('ADD_RECRUITMENT', newRecruitment)
      return newRecruitment
    } catch (error) {
      console.error('创建招新活动失败:', error)
      throw error
    }
  },
  
  async updateRecruitment({ commit }, { id, recruitmentData }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const updatedRecruitment = { id, ...recruitmentData }
      commit('UPDATE_RECRUITMENT', updatedRecruitment)
      return updatedRecruitment
    } catch (error) {
      console.error('更新招新活动失败:', error)
      throw error
    }
  },
  
  async deleteRecruitment({ commit }, recruitmentId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      commit('REMOVE_RECRUITMENT', recruitmentId)
      return recruitmentId
    } catch (error) {
      console.error('删除招新活动失败:', error)
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}