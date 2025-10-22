<template>
  <div class="interview-list">
    <h2>面试管理</h2>
    
    <div class="actions">
      <router-link to="/interviews/schedule" class="btn btn-primary">安排面试</router-link>
    </div>
    
    <div class="interview-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>申请人</th>
            <th>面试官</th>
            <th>时间</th>
            <th>地点</th>
            <th>时长(分钟)</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="interview in interviews" :key="interview.id">
            <td>{{ interview.id }}</td>
            <td>{{ interview.applicantName }}</td>
            <td>{{ interview.interviewerName }}</td>
            <td>{{ formatDateTime(interview.scheduledTime) }}</td>
            <td>{{ interview.location }}</td>
            <td>{{ interview.duration }}</td>
            <td>
              <span :class="['status-badge', interview.status]">
                {{ getStatusText(interview.status) }}
              </span>
            </td>
            <td>
              <router-link :to="`/interviews/${interview.id}/edit`" class="btn btn-sm btn-secondary">编辑</router-link>
              <button @click="deleteInterview(interview.id)" class="btn btn-sm btn-danger">删除</button>
              <router-link :to="`/interviews/${interview.id}`" class="btn btn-sm btn-info">详情</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InterviewList',
  data() {
    return {
      interviews: []
    }
  },
  async mounted() {
    await this.loadInterviews()
  },
  methods: {
    async loadInterviews() {
      try {
        // 从store获取面试列表
        await this.$store.dispatch('interview/fetchInterviews')
        this.interviews = this.$store.state.interview.interviews
      } catch (error) {
        console.error('加载面试列表失败:', error)
      }
    },
    async deleteInterview(interviewId) {
      if (confirm('确定要删除这个面试安排吗？')) {
        try {
          await this.$store.dispatch('interview/deleteInterview', interviewId)
          await this.loadInterviews() // 重新加载列表
        } catch (error) {
          console.error('删除面试失败:', error)
        }
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
.interview-list {
  padding: 20px;
}

.actions {
  margin-bottom: 20px;
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

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.interview-table {
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