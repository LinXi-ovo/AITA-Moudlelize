<template>
  <div class="file-upload">
    <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop">
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFileSelect" 
        :multiple="multiple"
        :accept="accept"
        style="display: none"
      >
      
      <div class="upload-content" @click="triggerFileSelect">
        <div class="upload-icon">📁</div>
        <p>点击选择文件或拖拽文件到此处</p>
        <p class="upload-hint" v-if="hint">{{ hint }}</p>
      </div>
    </div>
    
    <div class="file-list" v-if="files.length > 0">
      <div 
        v-for="file in files" 
        :key="file.id || file.name"
        class="file-item"
      >
        <div class="file-info">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
        </div>
        <div class="file-actions">
          <button 
            @click="removeFile(file)" 
            class="btn btn-small btn-danger"
          >
            删除
          </button>
        </div>
      </div>
    </div>
    
    <div class="upload-actions" v-if="files.length > 0">
      <button 
        @click="uploadFiles" 
        class="btn btn-primary"
        :disabled="uploading"
      >
        {{ uploading ? '上传中...' : '上传文件' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FileUpload',
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    autoUpload: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      files: [],
      uploading: false
    }
  },
  methods: {
    triggerFileSelect() {
      this.$refs.fileInput.click()
    },
    
    handleFileSelect(event) {
      const selectedFiles = Array.from(event.target.files)
      this.addFiles(selectedFiles)
    },
    
    handleDrop(event) {
      const droppedFiles = Array.from(event.dataTransfer.files)
      this.addFiles(droppedFiles)
    },
    
    addFiles(files) {
      if (!this.multiple && files.length > 0) {
        // 单文件模式，只保留第一个文件
        this.files = [files[0]]
      } else {
        // 多文件模式，添加所有文件
        this.files = [...this.files, ...files]
      }
      
      // 如果是自动上传模式，立即上传
      if (this.autoUpload) {
        this.uploadFiles()
      }
    },
    
    removeFile(file) {
      this.files = this.files.filter(f => f !== file)
    },
    
    async uploadFiles() {
      if (this.files.length === 0) return
      
      this.uploading = true
      
      try {
        const uploadPromises = this.files.map(file => {
          return this.$store.dispatch('file/uploadFile', file)
        })
        
        const results = await Promise.all(uploadPromises)
        
        // 上传成功后清空文件列表
        this.files = []
        
        // 触发上传成功事件
        this.$emit('upload-success', results)
      } catch (error) {
        console.error('文件上传失败:', error)
        this.$emit('upload-error', error)
      } finally {
        this.uploading = false
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
.file-upload {
  width: 100%;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  margin-bottom: 20px;
}

.upload-area:hover {
  border-color: #42b983;
}

.upload-content {
  color: #666;
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}

.file-list {
  margin-bottom: 20px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
}

.file-info {
  flex: 1;
}

.file-name {
  font-weight: bold;
  margin-right: 10px;
}

.file-size {
  color: #999;
  font-size: 14px;
}

.file-actions {
  flex-shrink: 0;
}

.btn {
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-actions {
  text-align: center;
}
</style>