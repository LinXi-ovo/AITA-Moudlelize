<template>
  <div class="interview-detail">
    <h2>面试详情</h2>
    
    <div v-if="interview">
      <div class="interview-info">
        <p><strong>ID:</strong> {{ interview.id }}</p>
        <p><strong>申请人:</strong> {{ interview.applicantName }}</p>
        <p><strong>面试官:</strong> {{ interview.interviewerName }}</p>
        <p><strong>预约时间:</strong> {{ formatDateTime(interview.scheduledTime) }}</p>
        <p><strong>地点:</strong> {{ interview.location }}</p>
        <p><strong>时长:</strong> {{ interview.duration }} 分钟</p>
        <p>
          <strong>状态:</strong>
          <span :class="['status-badge', interview.status]">
            {{ getStatusText(interview.status) }}
          </span>
        </p>
        <p v-if="interview.notes"><strong>备注:</strong> {{ interview.notes }}</p>
      </div>
      
      <div class="actions">
        <router-link :to="`/interviews/${interview.id}/edit`" class="btn btn-primary">编辑</router-link>
        <router-link to="/interviews" class="btn btn-secondary">返回列表</router-link>
      </div>
    </div>
    
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterviewDetail',
  data() {
    return {
      interview: null
    }
  },
  async mounted() {
    await this.loadInterview()
  },
  methods: {
    async loadInterview() {
      try {
        const interviewId = this.$route.params.id
        await this.$store.dispatch('interview/fetchInterviewById', interviewId)
        this.interview = this.$store.state.interview.interviewDetail
      } catch (error) {
        console.error('加载面试详情失败:', error)
      }
    },
    getStatusText(status) {
      const statusMap = {
        'scheduled': '已安排',
        'completed': '已完成',
        'cancelled': '已取消'
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
.interview-detail {
  padding: 20px;
}

.interview-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.interview-info p {
  margin: 10px 0;
}

.actions {
  margin-top: 20px;
}

.btn {
  padding: 8px 12px;
  margin-right: 10px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.scheduled {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background-color: #f8d7da;
  color: #721c24;
}
</style>