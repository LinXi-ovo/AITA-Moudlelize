// 系统日志模块 - store
const state = {
  logs: [],
  logLevels: ['debug', 'info', 'warn', 'error'],
  logCategories: ['user', 'system', 'security', 'audit']
}

const mutations = {
  ADD_LOG(state, log) {
    state.logs.push({
      id: Date.now(),
      ...log,
      timestamp: new Date().toISOString()
    })
    
    // 限制日志数量，只保留最新的1000条
    if (state.logs.length > 1000) {
      state.logs = state.logs.slice(-1000)
    }
  },
  CLEAR_LOGS(state) {
    state.logs = []
  },
  SET_LOGS(state, logs) {
    state.logs = logs
  }
}

const actions = {
  log({ commit }, logData) {
    const log = {
      level: logData.level || 'info',
      category: logData.category || 'system',
      message: logData.message,
      userId: logData.userId || null,
      userName: logData.userName || 'System',
      ip: logData.ip || '127.0.0.1',
      userAgent: logData.userAgent || navigator.userAgent,
      details: logData.details || null
    }
    
    commit('ADD_LOG', log)
    
    // 在控制台输出日志
    const consoleMessage = `[${log.level.toUpperCase()}] [${log.category}] ${log.message}`
    switch (log.level) {
      case 'debug':
        console.debug(consoleMessage)
        break
      case 'info':
        console.info(consoleMessage)
        break
      case 'warn':
        console.warn(consoleMessage)
        break
      case 'error':
        console.error(consoleMessage)
        break
      default:
        console.log(consoleMessage)
    }
    
    return log
  },
  
  async fetchLogs({ commit }, filters = {}) {
    try {
      // 模拟获取日志
      // 在实际应用中，这里应该调用API获取日志数据
      
      // 根据过滤条件筛选日志
      let filteredLogs = [
        {
          id: 1,
          level: 'info',
          category: 'user',
          message: '用户登录成功',
          userId: 1,
          userName: 'admin',
          ip: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          timestamp: '2025-03-15T10:00:00',
          details: null
        },
        {
          id: 2,
          level: 'warn',
          category: 'system',
          message: '系统资源使用率过高',
          userId: null,
          userName: 'System',
          ip: '127.0.0.1',
          userAgent: 'System',
          timestamp: '2025-03-15T11:00:00',
          details: { cpu: '85%', memory: '75%' }
        },
        {
          id: 3,
          level: 'error',
          category: 'security',
          message: '登录失败尝试',
          userId: null,
          userName: 'unknown',
          ip: '192.168.1.200',
          userAgent: 'Mozilla/5.0...',
          timestamp: '2025-03-15T12:00:00',
          details: { username: 'admin', attempts: 3 }
        }
      ]
      
      // 应用过滤条件
      if (filters.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filters.level)
      }
      
      if (filters.category) {
        filteredLogs = filteredLogs.filter(log => log.category === filters.category)
      }
      
      if (filters.userId) {
        filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
      }
      
      if (filters.dateRange) {
        const { start, end } = filters.dateRange
        filteredLogs = filteredLogs.filter(log => {
          const logDate = new Date(log.timestamp)
          return logDate >= start && logDate <= end
        })
      }
      
      commit('SET_LOGS', filteredLogs)
      return filteredLogs
    } catch (error) {
      console.error('获取日志失败:', error)
      throw error
    }
  },
  
  clearLogs({ commit }) {
    commit('CLEAR_LOGS')
  },
  
  // 记录用户登录日志
  logUserLogin({ dispatch }, { userId, userName, ip }) {
    return dispatch('log', {
      level: 'info',
      category: 'user',
      message: '用户登录成功',
      userId,
      userName,
      ip
    })
  },
  
  // 记录用户登出日志
  logUserLogout({ dispatch }, { userId, userName, ip }) {
    return dispatch('log', {
      level: 'info',
      category: 'user',
      message: '用户登出成功',
      userId,
      userName,
      ip
    })
  },
  
  // 记录安全事件日志
  logSecurityEvent({ dispatch }, { event, details, ip }) {
    return dispatch('log', {
      level: 'warn',
      category: 'security',
      message: event,
      details,
      ip
    })
  },
  
  // 记录系统错误日志
  logSystemError({ dispatch }, { error, details }) {
    return dispatch('log', {
      level: 'error',
      category: 'system',
      message: error.message || '系统错误',
      details: {
        ...details,
        stack: error.stack
      }
    })
  }
}

const getters = {
  getLogs: (state) => state.logs,
  getLogsByLevel: (state) => (level) => {
    return state.logs.filter(log => log.level === level)
  },
  getLogsByCategory: (state) => (category) => {
    return state.logs.filter(log => log.category === category)
  },
  getLogLevels: (state) => state.logLevels,
  getLogCategories: (state) => state.logCategories
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}