// 用户反馈模块 - store
const state = {
  feedbacks: [],
  feedbackCategories: [
    { id: 1, name: '功能建议', description: '对系统功能的改进建议' },
    { id: 2, name: '问题报告', description: '报告系统中的问题或错误' },
    { id: 3, name: '用户体验', description: '对用户界面和体验的反馈' },
    { id: 4, name: '其他', description: '其他类型的反馈' }
  ]
}

const mutations = {
  ADD_FEEDBACK(state, feedback) {
    state.feedbacks.push({
      id: Date.now(),
      ...feedback,
      status: 'pending',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString()
    })
  },
  UPDATE_FEEDBACK_STATUS(state, { feedbackId, status }) {
    const feedback = state.feedbacks.find(f => f.id === feedbackId)
    if (feedback) {
      feedback.status = status
      feedback.updateTime = new Date().toISOString()
    }
  },
  SET_FEEDBACKS(state, feedbacks) {
    state.feedbacks = feedbacks
  }
}

const actions = {
  async submitFeedback({ commit }, feedbackData) {
    try {
      // 模拟提交反馈
      // 在实际应用中，这里应该调用API将反馈保存到数据库
      
      const feedback = {
        ...feedbackData,
        userId: feedbackData.userId || null,
        userName: feedbackData.userName || '匿名用户'
      }
      
      commit('ADD_FEEDBACK', feedback)
      
      // 模拟成功响应
      return {
        success: true,
        message: '反馈提交成功，感谢您的意见！'
      }
    } catch (error) {
      console.error('提交反馈失败:', error)
      throw error
    }
  },
  
  async fetchFeedbacks({ commit }) {
    try {
      // 模拟获取反馈列表
      // 在实际应用中，这里应该调用API获取反馈数据
      
      const feedbacks = [
        {
          id: 1,
          userId: 1,
          userName: '张三',
          category: '功能建议',
          title: '建议增加批量操作功能',
          content: '希望能在用户管理页面增加批量删除和批量导出功能',
          status: 'pending',
          createTime: '2025-03-15T10:00:00',
          updateTime: '2025-03-15T10:00:00'
        },
        {
          id: 2,
          userId: 2,
          userName: '李四',
          category: '问题报告',
          title: '导出功能偶尔失败',
          content: '在导出大量数据时，有时会出现导出失败的情况',
          status: 'processing',
          createTime: '2025-03-16T14:00:00',
          updateTime: '2025-03-16T15:00:00'
        }
      ]
      
      commit('SET_FEEDBACKS', feedbacks)
      return feedbacks
    } catch (error) {
      console.error('获取反馈列表失败:', error)
      throw error
    }
  },
  
  async updateFeedbackStatus({ commit }, { feedbackId, status }) {
    try {
      // 模拟更新反馈状态
      // 在实际应用中，这里应该调用API更新反馈状态
      
      commit('UPDATE_FEEDBACK_STATUS', { feedbackId, status })
      
      return {
        success: true,
        message: '反馈状态更新成功'
      }
    } catch (error) {
      console.error('更新反馈状态失败:', error)
      throw error
    }
  }
}

const getters = {
  getFeedbacks: (state) => state.feedbacks,
  getFeedbackById: (state) => (id) => {
    return state.feedbacks.find(f => f.id === id)
  },
  getFeedbacksByStatus: (state) => (status) => {
    return state.feedbacks.filter(f => f.status === status)
  },
  getFeedbackCategories: (state) => state.feedbackCategories
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}