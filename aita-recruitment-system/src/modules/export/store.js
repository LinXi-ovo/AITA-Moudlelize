// 数据导出模块 - store
const state = {
  exportHistory: []
}

const mutations = {
  ADD_EXPORT_RECORD(state, record) {
    state.exportHistory.push({
      id: Date.now(),
      ...record,
      timestamp: new Date().toISOString()
    })
  },
  CLEAR_EXPORT_HISTORY(state) {
    state.exportHistory = []
  }
}

const actions = {
  async exportToExcel({ commit }, { data, filename, sheetName }) {
    try {
      // 模拟导出Excel文件
      // 在实际应用中，这里应该使用xlsx库或其他库来生成Excel文件
      
      const exportRecord = {
        type: 'excel',
        filename: filename || 'export.xlsx',
        sheetName: sheetName || 'Sheet1',
        rowCount: data.length,
        status: 'success'
      }
      
      commit('ADD_EXPORT_RECORD', exportRecord)
      
      // 模拟下载链接
      const blob = new Blob([JSON.stringify(data)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = exportRecord.filename
      link.click()
      
      URL.revokeObjectURL(url)
      
      return exportRecord
    } catch (error) {
      console.error('导出Excel失败:', error)
      
      const exportRecord = {
        type: 'excel',
        filename: filename || 'export.xlsx',
        sheetName: sheetName || 'Sheet1',
        rowCount: 0,
        status: 'failed',
        error: error.message
      }
      
      commit('ADD_EXPORT_RECORD', exportRecord)
      throw error
    }
  },
  
  async exportToCSV({ commit }, { data, filename }) {
    try {
      // 模拟导出CSV文件
      // 在实际应用中，这里应该将数据转换为CSV格式
      
      const exportRecord = {
        type: 'csv',
        filename: filename || 'export.csv',
        rowCount: data.length,
        status: 'success'
      }
      
      commit('ADD_EXPORT_RECORD', exportRecord)
      
      // 模拟下载链接
      const csvContent = "data:text/csv;charset=utf-8," 
        + data.map(row => Object.values(row).join(',')).join('\n')
      const encodedUri = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', encodedUri)
      link.setAttribute('download', exportRecord.filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return exportRecord
    } catch (error) {
      console.error('导出CSV失败:', error)
      
      const exportRecord = {
        type: 'csv',
        filename: filename || 'export.csv',
        rowCount: 0,
        status: 'failed',
        error: error.message
      }
      
      commit('ADD_EXPORT_RECORD', exportRecord)
      throw error
    }
  },
  
  async exportToPDF({ commit }, { data, filename, title }) {
    try {
      // 模拟导出PDF文件
      // 在实际应用中，这里应该使用jspdf或其他库来生成PDF文件
      
      const exportRecord = {
        type: 'pdf',
        filename: filename || 'export.pdf',
        title: title || '导出数据',
        rowCount: data.length,
        status: 'success'
      }
      
      commit('ADD_EXPORT_RECORD', exportRecord)
      
      // 模拟下载链接
      const blob = new Blob([JSON.stringify(data)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = exportRecord.filename
      link.click()
      
      URL.revokeObjectURL(url)
      
      return exportRecord
    } catch (error) {
      console.error('导出PDF失败:', error)
      
      const exportRecord = {
        type: 'pdf',
        filename: filename || 'export.pdf',
        title: title || '导出数据',
        rowCount: 0,
        status: 'failed',
        error: error.message
      }
      
      commit('ADD_EXPORT_RECORD', exportRecord)
      throw error
    }
  },
  
  clearExportHistory({ commit }) {
    commit('CLEAR_EXPORT_HISTORY')
  }
}

const getters = {
  getExportHistory: (state) => state.exportHistory,
  getRecentExports: (state) => {
    return state.exportHistory.slice(-10).reverse()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}