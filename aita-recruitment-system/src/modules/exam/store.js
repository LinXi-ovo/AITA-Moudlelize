// 笔试管理模块 - store
const state = {
  exams: [],
  examDetail: null
}

const mutations = {
  SET_EXAMS(state, exams) {
    state.exams = exams
  },
  SET_EXAM_DETAIL(state, exam) {
    state.examDetail = exam
  },
  ADD_EXAM(state, exam) {
    state.exams.push(exam)
  },
  UPDATE_EXAM(state, updatedExam) {
    const index = state.exams.findIndex(e => e.id === updatedExam.id)
    if (index !== -1) {
      state.exams.splice(index, 1, updatedExam)
    }
  },
  REMOVE_EXAM(state, examId) {
    state.exams = state.exams.filter(e => e.id !== examId)
  }
}

const actions = {
  async fetchExams({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const exams = [
        { 
          id: 1, 
          title: '编程基础笔试', 
          description: '测试编程基础知识', 
          duration: 90,
          startTime: '2025-03-15T09:00:00',
          endTime: '2025-03-15T10:30:00',
          status: 'scheduled'
        },
        { 
          id: 2, 
          title: '算法笔试', 
          description: '测试算法设计能力', 
          duration: 120,
          startTime: '2025-03-16T14:00:00',
          endTime: '2025-03-16T16:00:00',
          status: 'scheduled'
        }
      ]
      commit('SET_EXAMS', exams)
      return exams
    } catch (error) {
      console.error('获取笔试列表失败:', error)
      throw error
    }
  },
  
  async fetchExamById({ commit }, examId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const exam = { 
        id: examId, 
        title: '编程基础笔试', 
        description: '测试编程基础知识', 
        duration: 90,
        startTime: '2025-03-15T09:00:00',
        endTime: '2025-03-15T10:30:00',
        status: 'scheduled',
        questions: [
          {
            id: 1,
            type: 'multiple-choice',
            question: '以下哪个不是编程语言？',
            options: ['Python', 'Java', 'HTML', 'C++'],
            correctAnswer: 2
          }
        ]
      }
      commit('SET_EXAM_DETAIL', exam)
      return exam
    } catch (error) {
      console.error('获取笔试详情失败:', error)
      throw error
    }
  },
  
  async createExam({ commit }, examData) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const newExam = { 
        id: Date.now(), // 模拟ID生成
        ...examData 
      }
      commit('ADD_EXAM', newExam)
      return newExam
    } catch (error) {
      console.error('创建笔试失败:', error)
      throw error
    }
  },
  
  async updateExam({ commit }, { id, examData }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const updatedExam = { id, ...examData }
      commit('UPDATE_EXAM', updatedExam)
      return updatedExam
    } catch (error) {
      console.error('更新笔试失败:', error)
      throw error
    }
  },
  
  async deleteExam({ commit }, examId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      commit('REMOVE_EXAM', examId)
      return examId
    } catch (error) {
      console.error('删除笔试失败:', error)
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