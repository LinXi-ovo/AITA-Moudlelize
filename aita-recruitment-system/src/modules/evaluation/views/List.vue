<template>
  <div class="evaluation-list">
    <h2>评价管理</h2>
    
    <div class="actions">
      <router-link to="/evaluations/create" class="btn btn-primary">添加评价</router-link>
    </div>
    
    <div class="evaluation-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>申请人</th>
            <th>评价人</th>
            <th>类型</th>
            <th>分数</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evaluation in evaluations" :key="evaluation.id">
            <td>{{ evaluation.id }}</td>
            <td>{{ evaluation.applicantName }}</td>
            <td>{{ evaluation.evaluatorName }}</td>
            <td>{{ getTypeText(evaluation.type) }}</td>
            <td>{{ evaluation.score }}</td>
            <td>{{ formatDateTime(evaluation.createTime) }}</td>
            <td>
              <router-link :to="`/evaluations/${evaluation.id}/edit`" class="btn btn-sm btn-secondary">编辑</router-link>
              <button @click="deleteEvaluation(evaluation.id)" class="btn btn-sm btn-danger">删除</button>
              <router-link :to="`/evaluations/${evaluation.id}`" class="btn btn-sm btn-info">详情</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EvaluationList',
  data() {
    return {
      evaluations: []
    }
  },
  async mounted() {
    await this.loadEvaluations()
  },
  methods: {
    async loadEvaluations() {
      try {
        // 从store获取评价列表
        await this.$store.dispatch('evaluation/fetchEvaluations')
        this.evaluations = this.$store.state.evaluation.evaluations
      } catch (error) {
        console.error('加载评价列表失败:', error)
      }
    },
    async deleteEvaluation(evaluationId) {
      if (confirm('确定要删除这个评价吗？')) {
        try {
          await this.$store.dispatch('evaluation/deleteEvaluation', evaluationId)
          await this.loadEvaluations() // 重新加载列表
        } catch (error) {
          console.error('删除评价失败:', error)
        }
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
.evaluation-list {
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

.evaluation-table {
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
</style>