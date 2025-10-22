<template>
  <div class="exam-edit">
    <h2>编辑笔试</h2>
    
    <div v-if="form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">标题:</label>
          <input type="text" id="title" v-model="form.title" required>
        </div>
        
        <div class="form-group">
          <label for="description">描述:</label>
          <textarea id="description" v-model="form.description" rows="4"></textarea>
        </div>
        
        <div class="form-group">
          <label for="duration">时长(分钟):</label>
          <input type="number" id="duration" v-model.number="form.duration" min="1" required>
        </div>
        
        <div class="form-group">
          <label for="startTime">开始时间:</label>
          <input type="datetime-local" id="startTime" v-model="form.startTime" required>
        </div>
        
        <div class="form-group">
          <label for="endTime">结束时间:</label>
          <input type="datetime-local" id="endTime" v-model="form.endTime" required>
        </div>
        
        <div class="form-group">
          <label for="status">状态:</label>
          <select id="status" v-model="form.status" required>
            <option value="scheduled">已安排</option>
            <option value="active">进行中</option>
            <option value="finished">已结束</option>
          </select>
        </div>
        
        <div class="actions">
          <button type="submit" class="btn btn-primary">更新</button>
          <router-link :to="`/exams/${examId}`" class="btn btn-secondary">取消</router-link>
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
  name: 'EditExam',
  data() {
    return {
      examId: null,
      form: null
    }
  },
  async mounted() {
    this.examId = this.$route.params.id
    await this.loadExam()
  },
  methods: {
    async loadExam() {
      try {
        // 先获取笔试详情
        await this.$store.dispatch('exam/fetchExamById', this.examId)
        const exam = this.$store.state.exam.examDetail
        // 复制数据到表单
        this.form = { ...exam }
      } catch (error) {
        console.error('加载笔试详情失败:', error)
      }
    },
    async handleSubmit() {
      try {
        await this.$store.dispatch('exam/updateExam', {
          id: this.examId,
          examData: this.form
        })
        this.$router.push(`/exams/${this.examId}`)
      } catch (error) {
        console.error('更新笔试失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.exam-edit {
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