// 面试管理模块 - store
const state = {
  interviews: [],
  interviewDetail: null
}

const mutations = {
  SET_INTERVIEWS(state, interviews) {
    state.interviews = interviews
  },
  SET_INTERVIEW_DETAIL(state, interview) {
    state.interviewDetail = interview
  },
  ADD_INTERVIEW(state, interview) {
    state.interviews.push(interview)
  },
  UPDATE_INTERVIEW(state, updatedInterview) {
    const index = state.interviews.findIndex(i => i.id === updatedInterview.id)
    if (index !== -1) {
      state.interviews.splice(index, 1, updatedInterview)
    }
  },
  REMOVE_INTERVIEW(state, interviewId) {
    state.interviews = state.interviews.filter(i => i.id !== interviewId)
  }
}

const actions = {
  async fetchInterviews({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const interviews = [
        { 
          id: 1, 
          applicantId: 101,
          applicantName: '张三',
          interviewerId: 201,
          interviewerName: '李四',
          scheduledTime: '2025-03-15T10:00:00',
          duration: 30,
          status: 'scheduled',
          location: '教学楼A101'
        },
        { 
          id: 2, 
          applicantId: 102,
          applicantName: '王五',
          interviewerId: 202,
          interviewerName: '赵六',
          scheduledTime: '2025-03-15T14:00:00',
          duration: 30,
          status: 'scheduled',
          location: '教学楼A102'
        }
      ]
      commit('SET_INTERVIEWS', interviews)
      return interviews
    } catch (error) {
      console.error('获取面试列表失败:', error)
      throw error
    }
  },
  
  async fetchInterviewById({ commit }, interviewId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const interview = { 
        id: interviewId, 
        applicantId: 101,
        applicantName: '张三',
        interviewerId: 201,
        interviewerName: '李四',
        scheduledTime: '2025-03-15T10:00:00',
        duration: 30,
        status: 'scheduled',
        location: '教学楼A101',
        notes: '申请人对编程有浓厚兴趣'
      }
      commit('SET_INTERVIEW_DETAIL', interview)
      return interview
    } catch (error) {
      console.error('获取面试详情失败:', error)
      throw error
    }
  },
  
  async createInterview({ commit }, interviewData) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const newInterview = { 
        id: Date.now(), // 模拟ID生成
        ...interviewData 
      }
      commit('ADD_INTERVIEW', newInterview)
      return newInterview
    } catch (error) {
      console.error('创建面试失败:', error)
      throw error
    }
  },
  
  async updateInterview({ commit }, { id, interviewData }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const updatedInterview = { id, ...interviewData }
      commit('UPDATE_INTERVIEW', updatedInterview)
      return updatedInterview
    } catch (error) {
      console.error('更新面试失败:', error)
      throw error
    }
  },
  
  async deleteInterview({ commit }, interviewId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      commit('REMOVE_INTERVIEW', interviewId)
      return interviewId
    } catch (error) {
      console.error('删除面试失败:', error)
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