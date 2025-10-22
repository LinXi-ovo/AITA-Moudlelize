<template>
  <div class="evaluation-detail">
    <h2>评价详情</h2>
    
    <div v-if="evaluation">
      <div class="evaluation-info">
        <p><strong>ID:</strong> {{ evaluation.id }}</p>
        <p><strong>申请人:</strong> {{ evaluation.applicantName }}</p>
        <p><strong>评价人:</strong> {{ evaluation.evaluatorName }}</p>
        <p><strong>类型:</strong> {{ getTypeText(evaluation.type) }}</p>
        <p><strong>分数:</strong> {{ evaluation.score }}</p>
        <p><strong>创建时间:</strong> {{ formatDateTime(evaluation.createTime) }}</p>
        <p><strong>评价内容:</strong></p>
        <div class="evaluation-content">
          {{ evaluation.content }}
        </div>
      </div>
      
      <div class="actions">
        <router-link :to="`/evaluations/${evaluation.id}/edit`" class="btn btn-primary">编辑</router-link>
        <router-link to="/evaluations" class="btn btn-secondary">返回列表</router-link>
      </div>
    </div>
    
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EvaluationDetail',
  data() {
    return {
      evaluation: null
    }
  },
  async mounted() {
    await this.loadEvaluation()
  },
  methods: {
    async loadEvaluation() {
      try {
        const evaluationId = this.$route.params.id
        await this.$store.dispatch('evaluation/fetchEvaluationById', evaluationId)
        this.evaluation = this.$store.state.evaluation.evaluationDetail
      } catch (error) {
        console.error('加载评价详情失败:', error)
      }
    },
    getTypeText(type) {
      const typeMap = {
        'interview': '面试',
        'exam': '笔试'
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
.evaluation-detail {
  padding: 20px;
}

.evaluation-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.evaluation-info p {
  margin: 10px 0;
}

.evaluation-content {
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
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
</style>