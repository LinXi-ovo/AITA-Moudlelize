<template>
  <div class="evaluation-edit">
    <h2>编辑评价</h2>
    
    <div v-if="form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="applicantName">申请人姓名:</label>
          <input type="text" id="applicantName" v-model="form.applicantName" required>
        </div>
        
        <div class="form-group">
          <label for="evaluatorName">评价人姓名:</label>
          <input type="text" id="evaluatorName" v-model="form.evaluatorName" required>
        </div>
        
        <div class="form-group">
          <label for="type">评价类型:</label>
          <select id="type" v-model="form.type" required>
            <option value="interview">面试</option>
            <option value="exam">笔试</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="score">分数:</label>
          <input type="number" id="score" v-model.number="form.score" min="0" max="100" required>
        </div>
        
        <div class="form-group">
          <label for="content">评价内容:</label>
          <textarea id="content" v-model="form.content" rows="6" required></textarea>
        </div>
        
        <div class="actions">
          <button type="submit" class="btn btn-primary">更新</button>
          <router-link :to="`/evaluations/${evaluationId}`" class="btn btn-secondary">取消</router-link>
        </div>
      </form>
    </div>
    
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditEvaluation',
  data() {
    return {
      evaluationId: null,
      form: null
    }
  },
  async mounted() {
    this.evaluationId = this.$route.params.id
    await this.loadEvaluation()
  },
  methods: {
    async loadEvaluation() {
      try {
        // 先获取评价详情
        await this.$store.dispatch('evaluation/fetchEvaluationById', this.evaluationId)
        const evaluation = this.$store.state.evaluation.evaluationDetail
        // 复制数据到表单
        this.form = { ...evaluation }
      } catch (error) {
        console.error('加载评价详情失败:', error)
      }
    },
    async handleSubmit() {
      try {
        await this.$store.dispatch('evaluation/updateEvaluation', {
          id: this.evaluationId,
          evaluationData: this.form
        })
        this.$router.push(`/evaluations/${this.evaluationId}`)
      } catch (error) {
        console.error('更新评价失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.evaluation-edit {
  padding: 20px;
  max-width: 600px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, select, textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.actions {
  margin-top: 20px;
}

.btn {
  padding: 10px 15px;
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