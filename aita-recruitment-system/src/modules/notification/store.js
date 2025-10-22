// 通知模块 - store
const state = {
  notifications: [],
  unreadCount: 0
}

const mutations = {
  ADD_NOTIFICATION(state, notification) {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      timestamp: new Date().toISOString()
    }
    state.notifications.unshift(newNotification)
    state.unreadCount++
  },
  MARK_AS_READ(state, notificationId) {
    const notification = state.notifications.find(n => n.id === notificationId)
    if (notification && !notification.read) {
      notification.read = true
      state.unreadCount--
    }
  },
  MARK_ALL_AS_READ(state) {
    state.notifications.forEach(notification => {
      if (!notification.read) {
        notification.read = true
      }
    })
    state.unreadCount = 0
  },
  REMOVE_NOTIFICATION(state, notificationId) {
    const index = state.notifications.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      const notification = state.notifications[index]
      state.notifications.splice(index, 1)
      if (!notification.read) {
        state.unreadCount--
      }
    }
  }
}

const actions = {
  showNotification({ commit }, notificationData) {
    commit('ADD_NOTIFICATION', notificationData)
  },
  
  markAsRead({ commit }, notificationId) {
    commit('MARK_AS_READ', notificationId)
  },
  
  markAllAsRead({ commit }) {
    commit('MARK_ALL_AS_READ')
  },
  
  removeNotification({ commit }, notificationId) {
    commit('REMOVE_NOTIFICATION', notificationId)
  },
  
  // 创建面试通知
  createInterviewNotification({ commit }, interviewData) {
    const notification = {
      title: '面试安排通知',
      message: `您有一个面试安排: ${interviewData.applicantName} (${interviewData.scheduledTime})`,
      type: 'info',
      data: {
        interviewId: interviewData.id,
        type: 'interview'
      }
    }
    commit('ADD_NOTIFICATION', notification)
  },
  
  // 创建考试通知
  createExamNotification({ commit }, examData) {
    const notification = {
      title: '笔试安排通知',
      message: `您有一个笔试安排: ${examData.title} (${examData.startTime})`,
      type: 'info',
      data: {
        examId: examData.id,
        type: 'exam'
      }
    }
    commit('ADD_NOTIFICATION', notification)
  },
  
  // 创建评价通知
  createEvaluationNotification({ commit }, evaluationData) {
    const notification = {
      title: '评价通知',
      message: `您的申请已收到评价: ${evaluationData.applicantName} (${evaluationData.score}分)`,
      type: 'success',
      data: {
        evaluationId: evaluationData.id,
        type: 'evaluation'
      }
    }
    commit('ADD_NOTIFICATION', notification)
  }
}

const getters = {
  unreadNotifications: (state) => state.notifications.filter(n => !n.read),
  allNotifications: (state) => state.notifications
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}