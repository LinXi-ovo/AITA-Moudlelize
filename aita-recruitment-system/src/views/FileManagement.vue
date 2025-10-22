<template>
  <div class="file-management">
    <h2>文件管理</h2>
    
    <div class="upload-section">
      <h3>上传文件</h3>
      <FileUpload 
        :multiple="true"
        accept=".pdf,.doc,.docx,.zip,.rar"
        hint="支持PDF、Word文档和压缩包，最大10MB"
        @upload-success="handleUploadSuccess"
      />
    </div>
    
    <div class="files-section">
      <h3>已上传文件</h3>
      
      <div class="files-table">
        <table>
          <thead>
            <tr>
              <th>文件名</th>
              <th>大小</th>
              <th>类型</th>
              <th>上传时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="file in uploadedFiles" :key="file.id">
              <td>
                <a :href="file.url" target="_blank" class="file-link">
                  {{ file.name }}
                </a>
              </td>
              <td>{{ formatFileSize(file.size) }}</td>
              <td>{{ getFileType(file.type) }}</td>
              <td>{{ formatDateTime(file.uploadTime) }}</td>
              <td>
                <a :href="file.url" target="_blank" class="btn btn-small btn-primary">下载</a>
                <button @click="deleteFile(file.id)" class="btn btn-small btn-danger">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="uploadedFiles.length === 0" class="no-files">
        <p>暂无上传文件</p>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: 'FileManagement',
  components: {
    FileUpload
  },
  data() {
    return {
      uploadedFiles: []
    }
  },
  async mounted() {
    await this.loadFiles()
  },
  methods: {
    async loadFiles() {
      try {
        await this.$store.dispatch('file/fetchUploadedFiles')
        this.uploadedFiles = this.$store.state.file.uploadedFiles
      } catch (error) {
        console.error('加载文件列表失败:', error)
      }
    },
    
    handleUploadSuccess(files) {
      // 上传成功后重新加载文件列表
      this.loadFiles()
      alert('文件上传成功！')
    },
    
    async deleteFile(fileId) {
      if (confirm('确定要删除这个文件吗？')) {
        try {
          await this.$store.dispatch('file/deleteFile', fileId)
          await this.loadFiles()
        } catch (error) {
          console.error('删除文件失败:', error)
        }
      }
    },
    
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    
    getFileType(mimeType) {
      const typeMap = {
        'application/pdf': 'PDF文档',
        'application/msword': 'Word文档',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word文档',
        'application/zip': '压缩包',
        'application/x-rar-compressed': '压缩包'
      }
      return typeMap[mimeType] || '未知类型'
    },
    
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.file-management {
  padding: 20px;
}

.upload-section {
  margin-bottom: 30px;
}

.files-section {
  margin-bottom: 30px;
}

.files-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
}

.file-link {
  color: #42b983;
  text-decoration: none;
}

.file-link:hover {
  text-decoration: underline;
}

.btn {
  padding: 4px 8px;
  margin-right: 5px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 12px;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.no-files {
  text-align: center;
  padding: 30px;
  color: #999;
}
</style>