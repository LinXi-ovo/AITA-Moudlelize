// 评价管理模块 - store
const state = {
  evaluations: [],
  evaluationDetail: null
}

const mutations = {
  SET_EVALUATIONS(state, evaluations) {
    state.evaluations = evaluations
  },
  SET_EVALUATION_DETAIL(state, evaluation) {
    state.evaluationDetail = evaluation
  },
  ADD_EVALUATION(state, evaluation) {
    state.evaluations.push(evaluation)
  },
  UPDATE_EVALUATION(state, updatedEvaluation) {
    const index = state.evaluations.findIndex(e => e.id === updatedEvaluation.id)
    if (index !== -1) {
      state.evaluations.splice(index, 1, updatedEvaluation)
    }
  },
  REMOVE_EVALUATION(state, evaluationId) {
    state.evaluations = state.evaluations.filter(e => e.id !== evaluationId)
  }
}

const actions = {
  async fetchEvaluations({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const evaluations = [
        { 
          id: 1, 
          applicantId: 101,
          applicantName: '张三',
          evaluatorId: 201,
          evaluatorName: '李四',
          type: 'interview',
          score: 85,
          content: '表现良好，技术基础扎实',
          createTime: '2025-03-15T11:00:00'
        },
        { 
          id: 2, 
          applicantId: 102,
          applicantName: '王五',
          evaluatorId: 202,
          evaluatorName: '赵六',
          type: 'exam',
          score: 92,
          content: '笔试成绩优秀',
          createTime: '2025-03-15T15:00:00'
        }
      ]
      commit('SET_EVALUATIONS', evaluations)
      return evaluations
    } catch (error) {
      console.error('获取评价列表失败:', error)
      throw error
    }
  },
  
  async fetchEvaluationById({ commit }, evaluationId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const evaluation = { 
        id: evaluationId, 
        applicantId: 101,
        applicantName: '张三',
        evaluatorId: 201,
        evaluatorName: '李四',
        type: 'interview',
        score: 85,
        content: '表现良好，技术基础扎实',
        createTime: '2025-03-15T11:00:00'
      }
      commit('SET_EVALUATION_DETAIL', evaluation)
      return evaluation
    } catch (error) {
      console.error('获取评价详情失败:', error)
      throw error
    }
  },
  
  async createEvaluation({ commit }, evaluationData) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const newEvaluation = { 
        id: Date.now(), // 模拟ID生成
        ...evaluationData 
      }
      commit('ADD_EVALUATION', newEvaluation)
      return newEvaluation
    } catch (error) {
      console.error('创建评价失败:', error)
      throw error
    }
  },
  
  async updateEvaluation({ commit }, { id, evaluationData }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const updatedEvaluation = { id, ...evaluationData }
      commit('UPDATE_EVALUATION', updatedEvaluation)
      return updatedEvaluation
    } catch (error) {
      console.error('更新评价失败:', error)
      throw error
    }
  },
  
  async deleteEvaluation({ commit }, evaluationId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      commit('REMOVE_EVALUATION', evaluationId)
      return evaluationId
    } catch (error) {
      console.error('删除评价失败:', error)
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