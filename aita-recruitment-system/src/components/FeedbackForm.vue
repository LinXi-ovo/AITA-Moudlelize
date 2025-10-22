<template>
  <div class="feedback-form">
    <h2>用户反馈</h2>
    
    <form @submit.prevent="submitFeedback">
      <div class="form-group">
        <label for="category">反馈类型:</label>
        <select id="category" v-model="form.category" required>
          <option value="">请选择反馈类型</option>
          <option 
            v-for="category in feedbackCategories" 
            :key="category.id" 
            :value="category.name"
          >
            {{ category.name }} - {{ category.description }}
          </option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="title">标题:</label>
        <input type="text" id="title" v-model="form.title" required>
      </div>
      
      <div class="form-group">
        <label for="content">反馈内容:</label>
        <textarea 
          id="content" 
          v-model="form.content" 
          rows="6" 
          placeholder="请详细描述您的反馈或建议..."
          required
        ></textarea>
      </div>
      
      <div class="form-group">
        <label for="contact">联系方式 (可选):</label>
        <input type="text" id="contact" v-model="form.contact" placeholder="邮箱或电话">
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交反馈' }}
        </button>
        <button type="button" class="btn btn-secondary" @click="resetForm" :disabled="submitting">
          重置
        </button>
      </div>
    </form>
    
    <div v-if="submitResult" class="submit-result" :class="submitResult.type">
      <p>{{ submitResult.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackForm',
  data() {
    return {
      form: {
        category: '',
        title: '',
        content: '',
        contact: ''
      },
      submitting: false,
      submitResult: null
    }
  },
  computed: {
    feedbackCategories() {
      return this.$store.getters['feedback/getFeedbackCategories']
    },
    currentUser() {
      return this.$store.state.auth.currentUser
    }
  },
  methods: {
    async submitFeedback() {
      if (this.submitting) return
      
      this.submitting = true
      this.submitResult = null
      
      try {
        const feedbackData = {
          ...this.form,
          userId: this.currentUser ? this.currentUser.id : null,
          userName: this.currentUser ? this.currentUser.username : '匿名用户'
        }
        
        const result = await this.$store.dispatch('feedback/submitFeedback', feedbackData)
        
        this.submitResult = {
          type: 'success',
          message: result.message
        }
        
        // 重置表单
        this.resetForm()
      } catch (error) {
        console.error('提交反馈失败:', error)
        this.submitResult = {
          type: 'error',
          message: '提交反馈失败，请稍后重试'
        }
      } finally {
        this.submitting = false
      }
    },
    
    resetForm() {
      this.form = {
        category: '',
        title: '',
        content: '',
        contact: ''
      }
    }
  }
}
</script>

<style scoped>
.feedback-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: inherit;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-result {
  margin-top: 20px;
  padding: 15px;
  border-radius: 4px;
  text-align: center;
}

.submit-result.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.submit-result.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>