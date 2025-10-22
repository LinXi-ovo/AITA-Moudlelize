<template>
  <div class="exam-detail">
    <h2>笔试详情</h2>
    
    <div v-if="exam">
      <div class="exam-info">
        <p><strong>ID:</strong> {{ exam.id }}</p>
        <p><strong>标题:</strong> {{ exam.title }}</p>
        <p><strong>描述:</strong> {{ exam.description }}</p>
        <p><strong>时长:</strong> {{ exam.duration }} 分钟</p>
        <p><strong>开始时间:</strong> {{ formatDateTime(exam.startTime) }}</p>
        <p><strong>结束时间:</strong> {{ formatDateTime(exam.endTime) }}</p>
        <p>
          <strong>状态:</strong>
          <span :class="['status-badge', exam.status]">
            {{ getStatusText(exam.status) }}
          </span>
        </p>
      </div>
      
      <div class="questions-section" v-if="exam.questions && exam.questions.length">
        <h3>题目列表</h3>
        <div class="question" v-for="question in exam.questions" :key="question.id">
          <p><strong>题目:</strong> {{ question.question }}</p>
          <p><strong>类型:</strong> {{ getQuestionTypeText(question.type) }}</p>
          <div v-if="question.options && question.options.length">
            <p><strong>选项:</strong></p>
            <ul>
              <li v-for="(option, index) in question.options" :key="index">
                {{ String.fromCharCode(65 + index) }}. {{ option }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <router-link :to="`/exams/${exam.id}/edit`" class="btn btn-primary">编辑</router-link>
        <router-link :to="`/exams/${exam.id}/take`" class="btn btn-success">参加考试</router-link>
        <router-link to="/exams" class="btn btn-secondary">返回列表</router-link>
      </div>
    </div>
    
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExamDetail',
  data() {
    return {
      exam: null
    }
  },
  async mounted() {
    await this.loadExam()
  },
  methods: {
    async loadExam() {
      try {
        const examId = this.$route.params.id
        await this.$store.dispatch('exam/fetchExamById', examId)
        this.exam = this.$store.state.exam.examDetail
      } catch (error) {
        console.error('加载笔试详情失败:', error)
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
    getQuestionTypeText(type) {
      const typeMap = {
        'multiple-choice': '选择题',
        'short-answer': '简答题',
        'programming': '编程题'
      }
      return typeMap[type] || type
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.exam-detail {
  padding: 20px;
}

.exam-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.exam-info p {
  margin: 10px 0;
}

.questions-section {
  margin-bottom: 20px;
}

.question {
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.question p {
  margin: 5px 0;
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

.btn-success {
  background-color: #28a745;
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

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.finished {
  background-color: #f8d7da;
  color: #721c24;
}
</style>