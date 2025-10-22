// 文件管理模块 - store
const state = {
  files: [],
  uploadedFiles: []
}

const mutations = {
  ADD_FILE(state, file) {
    state.files.push(file)
  },
  SET_UPLOADED_FILES(state, files) {
    state.uploadedFiles = files
  },
  REMOVE_FILE(state, fileId) {
    state.files = state.files.filter(f => f.id !== fileId)
  }
}

const actions = {
  async uploadFile({ commit }, fileData) {
    // 模拟文件上传
    try {
      // 这里应该调用实际的文件上传API
      const uploadedFile = {
        id: Date.now(),
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        url: URL.createObjectURL(fileData),
        uploadTime: new Date().toISOString()
      }
      
      commit('ADD_FILE', uploadedFile)
      return uploadedFile
    } catch (error) {
      console.error('文件上传失败:', error)
      throw error
    }
  },
  
  async fetchUploadedFiles({ commit }) {
    // 模拟获取已上传文件列表
    try {
      // 这里应该调用实际的API
      const files = [
        { id: 1, name: '简历.pdf', size: 102400, type: 'application/pdf', url: '#', uploadTime: '2025-03-15T10:00:00' },
        { id: 2, name: '作品集.zip', size: 204800, type: 'application/zip', url: '#', uploadTime: '2025-03-15T11:00:00' }
      ]
      commit('SET_UPLOADED_FILES', files)
      return files
    } catch (error) {
      console.error('获取文件列表失败:', error)
      throw error
    }
  },
  
  async deleteFile({ commit }, fileId) {
    // 模拟删除文件
    try {
      // 这里应该调用实际的API
      commit('REMOVE_FILE', fileId)
      return fileId
    } catch (error) {
      console.error('删除文件失败:', error)
      throw error
    }
  }
}

const getters = {
  getFileById: (state) => (id) => {
    return state.files.find(f => f.id === id)
  },
  getFilesByType: (state) => (type) => {
    return state.files.filter(f => f.type.includes(type))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}