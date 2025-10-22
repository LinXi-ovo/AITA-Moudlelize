<template>
  <div class="exam-list">
    <h2>笔试管理</h2>
    
    <div class="actions">
      <router-link to="/exams/create" class="btn btn-primary">创建笔试</router-link>
    </div>
    
    <div class="exam-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>时长(分钟)</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="exam in exams" :key="exam.id">
            <td>{{ exam.id }}</td>
            <td>{{ exam.title }}</td>
            <td>{{ exam.duration }}</td>
            <td>{{ formatDateTime(exam.startTime) }}</td>
            <td>{{ formatDateTime(exam.endTime) }}</td>
            <td>
              <span :class="['status-badge', exam.status]">
                {{ getStatusText(exam.status) }}
              </span>
            </td>
            <td>
              <router-link :to="`/exams/${exam.id}/edit`" class="btn btn-sm btn-secondary">编辑</router-link>
              <button @click="deleteExam(exam.id)" class="btn btn-sm btn-danger">删除</button>
              <router-link :to="`/exams/${exam.id}`" class="btn btn-sm btn-info">详情</router-link>
              <router-link :to="`/exams/${exam.id}/take`" class="btn btn-sm btn-success">参加考试</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamList',
  data() {
    return {
      exams: []
    }
  },
  async mounted() {
    await this.loadExams()
  },
  methods: {
    async loadExams() {
      try {
        // 从store获取笔试列表
        await this.$store.dispatch('exam/fetchExams')
        this.exams = this.$store.state.exam.exams
      } catch (error) {
        console.error('加载笔试列表失败:', error)
      }
    },
    async deleteExam(examId) {
      if (confirm('确定要删除这个笔试吗？')) {
        try {
          await this.$store.dispatch('exam/deleteExam', examId)
          await this.loadExams() // 重新加载列表
        } catch (error) {
          console.error('删除笔试失败:', error)
        }
      }
    },
    getStatusText(status) {
      const statusMap = {
        'scheduled': '已安排',
        'active': '进行中',
        'finished': '已结束'
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
.exam-list {
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

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.exam-table {
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

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.finished {
  background-color: #f8d7da;
  color: #721c24;
}
</style>