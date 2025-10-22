<template>
  <div class="feedback-management">
    <h2>反馈管理</h2>
    
    <div class="feedback-filters">
      <div class="filter-row">
        <div class="filter-group">
          <label for="status">状态:</label>
          <select id="status" v-model="filters.status" @change="handleFilter">
            <option value="">全部状态</option>
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="resolved">已解决</option>
            <option value="closed">已关闭</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="category">类型:</label>
          <select id="category" v-model="filters.category" @change="handleFilter">
            <option value="">全部类型</option>
            <option 
              v-for="category in feedbackCategories" 
              :key="category.id" 
              :value="category.name"
            >
              {{ category.name }}
            </option>
          </select>
        </div>
        
        <div class="filter-actions">
          <button @click="resetFilters" class="btn btn-secondary">重置</button>
        </div>
      </div>
    </div>
    
    <div class="feedback-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>用户</th>
            <th>类型</th>
            <th>标题</th>
            <th>状态</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="feedback in filteredFeedbacks" :key="feedback.id">
            <td>{{ feedback.id }}</td>
            <td>{{ feedback.userName }}</td>
            <td>{{ feedback.category }}</td>
            <td>{{ feedback.title }}</td>
            <td>
              <span :class="['status-badge', feedback.status]">
                {{ getStatusText(feedback.status) }}
              </span>
            </td>
            <td>{{ formatDateTime(feedback.createTime) }}</td>
            <td>
              <button @click="viewFeedback(feedback)" class="btn btn-sm btn-info">查看</button>
              <select 
                v-model="feedback.status" 
                @change="updateFeedbackStatus(feedback)" 
                class="status-select"
              >
                <option value="pending">待处理</option>
                <option value="processing">处理中</option>
                <option value="resolved">已解决</option>
                <option value="closed">已关闭</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredFeedbacks.length === 0" class="no-results">
        <p>没有找到匹配的反馈</p>
      </div>
    </div>
    
    <!-- 反馈详情弹窗 -->
    <div v-if="selectedFeedback" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>反馈详情</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="feedback-detail">
            <p><strong>用户:</strong> {{ selectedFeedback.userName }}</p>
            <p><strong>类型:</strong> {{ selectedFeedback.category }}</p>
            <p><strong>标题:</strong> {{ selectedFeedback.title }}</p>
            <p><strong>状态:</strong> 
              <span :class="['status-badge', selectedFeedback.status]">
                {{ getStatusText(selectedFeedback.status) }}
              </span>
            </p>
            <p><strong>提交时间:</strong> {{ formatDateTime(selectedFeedback.createTime) }}</p>
            <p><strong>更新时间:</strong> {{ formatDateTime(selectedFeedback.updateTime) }}</p>
            <div class="feedback-content">
              <strong>反馈内容:</strong>
              <p>{{ selectedFeedback.content }}</p>
            </div>
            <div v-if="selectedFeedback.contact" class="feedback-contact">
              <strong>联系方式:</strong>
              <p>{{ selectedFeedback.contact }}</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <select 
            v-model="selectedFeedback.status" 
            @change="updateFeedbackStatus(selectedFeedback)" 
            class="status-select"
          >
            <option value="pending">待处理</option>
            <option value="processing">处理中</option>
            <option value="resolved">已解决</option>
            <option value="closed">已关闭</option>
          </select>
          <button @click="closeModal" class="btn btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FeedbackManagement',
  data() {
    return {
      feedbacks: [],
      filters: {
        status: '',
        category: ''
      },
      selectedFeedback: null
    }
  },
  computed: {
    feedbackCategories() {
      return this.$store.getters['feedback/getFeedbackCategories']
    },
    filteredFeedbacks() {
      let filtered = [...this.feedbacks]
      
      // 应用状态过滤
      if (this.filters.status) {
        filtered = filtered.filter(feedback => feedback.status === this.filters.status)
      }
      
      // 应用类型过滤
      if (this.filters.category) {
        filtered = filtered.filter(feedback => feedback.category === this.filters.category)
      }
      
      return filtered
    }
  },
  async mounted() {
    await this.loadFeedbacks()
  },
  methods: {
    async loadFeedbacks() {
      try {
        await this.$store.dispatch('feedback/fetchFeedbacks')
        this.feedbacks = this.$store.getters['feedback/getFeedbacks']
      } catch (error) {
        console.error('加载反馈列表失败:', error)
      }
    },
    
    handleFilter() {
      // 过滤逻辑已在computed中处理
    },
    
    resetFilters() {
      this.filters.status = ''
      this.filters.category = ''
    },
    
    viewFeedback(feedback) {
      this.selectedFeedback = { ...feedback }
    },
    
    closeModal() {
      this.selectedFeedback = null
    },
    
    async updateFeedbackStatus(feedback) {
      try {
        await this.$store.dispatch('feedback/updateFeedbackStatus', {
          feedbackId: feedback.id,
          status: feedback.status
        })
        
        // 更新本地数据
        const localFeedback = this.feedbacks.find(f => f.id === feedback.id)
        if (localFeedback) {
          localFeedback.status = feedback.status
          localFeedback.updateTime = new Date().toISOString()
        }
        
        if (this.selectedFeedback && this.selectedFeedback.id === feedback.id) {
          this.selectedFeedback.status = feedback.status
          this.selectedFeedback.updateTime = new Date().toISOString()
        }
      } catch (error) {
        console.error('更新反馈状态失败:', error)
      }
    },
    
    getStatusText(status) {
      const statusMap = {
        'pending': '待处理',
        'processing': '处理中',
        'resolved': '已解决',
        'closed': '已关闭'
      }
      return statusMap[status] || status
    },
    
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.feedback-management {
  padding: 20px;
}

.feedback-filters {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 15px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.filter-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-actions {
  margin-bottom: 8px;
}

.feedback-table {
  overflow-x: auto;
  margin-bottom: 20px;
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

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.pending {
  background-color: #f8d7da;
  color: #721c24;
}

.status-badge.processing {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.resolved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.closed {
  background-color: #d1d1d1;
  color: #333;
}

.status-select {
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
}

.btn {
  padding: 8px 12px;
  margin-right: 5px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #999;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.feedback-detail p {
  margin: 10px 0;
}

.feedback-content {
  margin: 15px 0;
}

.feedback-content p {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
}

.feedback-contact {
  margin: 15px 0;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-top: 1px solid #eee;
}
</style>