// 数据统计模块 - store
const state = {
  statistics: {
    totalApplicants: 0,
    totalExams: 0,
    totalInterviews: 0,
    totalEvaluations: 0,
    applicantTrend: [],
    examScores: [],
    interviewStats: {}
  },
  reports: [],
  currentReport: null
}

const mutations = {
  SET_STATISTICS(state, statistics) {
    state.statistics = statistics
  },
  SET_REPORTS(state, reports) {
    state.reports = reports
  },
  SET_CURRENT_REPORT(state, report) {
    state.currentReport = report
  },
  ADD_REPORT(state, report) {
    state.reports.push(report)
  }
}

const actions = {
  async fetchStatistics({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const statistics = {
        totalApplicants: 120,
        totalExams: 3,
        totalInterviews: 80,
        totalEvaluations: 80,
        applicantTrend: [
          { month: '1月', count: 20 },
          { month: '2月', count: 35 },
          { month: '3月', count: 65 }
        ],
        examScores: [
          { name: '编程基础笔试', average: 78 },
          { name: '算法笔试', average: 65 }
        ],
        interviewStats: {
          scheduled: 80,
          completed: 75,
          cancelled: 5
        }
      }
      commit('SET_STATISTICS', statistics)
      return statistics
    } catch (error) {
      console.error('获取统计数据失败:', error)
      throw error
    }
  },
  
  async fetchReports({ commit }) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const reports = [
        { 
          id: 1, 
          title: '2025年春季招新统计报告', 
          createTime: '2025-04-01T10:00:00',
          type: 'recruitment'
        },
        { 
          id: 2, 
          title: '笔试成绩分析报告', 
          createTime: '2025-03-20T15:00:00',
          type: 'exam'
        }
      ]
      commit('SET_REPORTS', reports)
      return reports
    } catch (error) {
      console.error('获取报告列表失败:', error)
      throw error
    }
  },
  
  async generateReport({ commit }, reportData) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const newReport = { 
        id: Date.now(), // 模拟ID生成
        ...reportData,
        createTime: new Date().toISOString()
      }
      commit('ADD_REPORT', newReport)
      return newReport
    } catch (error) {
      console.error('生成报告失败:', error)
      throw error
    }
  },
  
  async fetchReportById({ commit }, reportId) {
    // 模拟API调用
    try {
      // 这里应该调用实际的API
      const report = { 
        id: reportId, 
        title: '详细统计报告', 
        content: '这是详细的统计报告内容...',
        createTime: '2025-04-01T10:00:00',
        type: 'detailed'
      }
      commit('SET_CURRENT_REPORT', report)
      return report
    } catch (error) {
      console.error('获取报告详情失败:', error)
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