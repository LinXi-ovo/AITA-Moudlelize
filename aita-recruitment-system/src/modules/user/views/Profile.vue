<template>
  <div class="profile">
    <h2>个人资料</h2>
    
    <div v-if="$store.state.auth.currentUser">
      <div class="user-info">
        <p><strong>用户名:</strong> {{ $store.state.auth.currentUser.username }}</p>
        <p><strong>角色:</strong> {{ roleDisplayName }}</p>
      </div>
      
      <div class="resume-upload">
        <h3>上传简历</h3>
        <FileUpload 
          :multiple="false"
          accept=".pdf,.doc,.docx"
          hint="支持PDF和Word文档，最大5MB"
          @upload-success="handleResumeUpload"
        />
      </div>
      
      <div class="uploaded-resumes" v-if="uploadedFiles.length > 0">
        <h3>已上传简历</h3>
        <div class="files-list">
          <div 
            v-for="file in uploadedFiles" 
            :key="file.id"
            class="file-item"
          >
            <div class="file-info">
              <a :href="file.url" target="_blank" class="file-link">
                {{ file.name }}
              </a>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </div>
            <div class="file-actions">
              <a :href="file.url" target="_blank" class="btn btn-small btn-primary">下载</a>
              <button @click="deleteFile(file.id)" class="btn btn-small btn-danger">删除</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else>
      <p>请先登录</p>
      <router-link to="/login" class="btn btn-primary">用户登录</router-link>
    </div>
  </div>
</template>

<script>
import FileUpload from '@/components/FileUpload.vue'

export default {
  name: 'Profile',
  components: {
    FileUpload
  },
  data() {
    return {
      uploadedFiles: []
    }
  },
  computed: {
    roleDisplayName() {
      const role = this.$store.getters['auth/currentUserRole']
      const roleMap = {
        'admin': '管理员',
        'interviewer': '面试官',
        'applicant': '申请人'
      }
      return roleMap[role] || role
    }
  },
  async mounted() {
    if (this.$store.state.auth.currentUser) {
      await this.loadUploadedFiles()
    }
  },
  methods: {
    async handleResumeUpload(files) {
      alert('简历上传成功！')
      await this.loadUploadedFiles()
    },
    
    async loadUploadedFiles() {
      try {
        await this.$store.dispatch('file/fetchUploadedFiles')
        this.uploadedFiles = this.$store.state.file.uploadedFiles
      } catch (error) {
        console.error('加载文件列表失败:', error)
      }
    },
    
    async deleteFile(fileId) {
      if (confirm('确定要删除这个文件吗？')) {
        try {
          await this.$store.dispatch('file/deleteFile', fileId)
          await this.loadUploadedFiles()
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
    }
  }
}
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.user-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 30px;
}

.user-info p {
  margin: 10px 0;
}

.resume-upload {
  margin-bottom: 30px;
}

.resume-upload h3 {
  margin-bottom: 15px;
}

.uploaded-resumes h3 {
  margin-bottom: 15px;
}

.files-list {
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 10px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.file-item:last-child {
  border-bottom: none;
}

.file-info {
  flex: 1;
}

.file-link {
  color: #42b983;
  text-decoration: none;
  font-weight: bold;
}

.file-link:hover {
  text-decoration: underline;
}

.file-size {
  color: #999;
  font-size: 14px;
  margin-left: 10px;
}

.file-actions {
  flex-shrink: 0;
}

.btn {
  padding: 4px 8px;
  margin-left: 5px;
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
</style>