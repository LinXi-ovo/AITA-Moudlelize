<template>
  <div class="interview-edit">
    <h2>编辑面试</h2>
    
    <div v-if="form">
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="applicantName">申请人姓名:</label>
          <input type="text" id="applicantName" v-model="form.applicantName" required>
        </div>
        
        <div class="form-group">
          <label for="interviewerName">面试官姓名:</label>
          <input type="text" id="interviewerName" v-model="form.interviewerName" required>
        </div>
        
        <div class="form-group">
          <label for="scheduledTime">预约时间:</label>
          <input type="datetime-local" id="scheduledTime" v-model="form.scheduledTime" required>
        </div>
        
        <div class="form-group">
          <label for="location">地点:</label>
          <input type="text" id="location" v-model="form.location" required>
        </div>
        
        <div class="form-group">
          <label for="duration">时长(分钟):</label>
          <input type="number" id="duration" v-model.number="form.duration" min="1" required>
        </div>
        
        <div class="form-group">
          <label for="status">状态:</label>
          <select id="status" v-model="form.status" required>
            <option value="scheduled">已安排</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="notes">备注:</label>
          <textarea id="notes" v-model="form.notes" rows="4"></textarea>
        </div>
        
        <div class="actions">
          <button type="submit" class="btn btn-primary">更新</button>
          <router-link :to="`/interviews/${interviewId}`" class="btn btn-secondary">取消</router-link>
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
  name: 'EditInterview',
  data() {
    return {
      interviewId: null,
      form: null
    }
  },
  async mounted() {
    this.interviewId = this.$route.params.id
    await this.loadInterview()
  },
  methods: {
    async loadInterview() {
      try {
        // 先获取面试详情
        await this.$store.dispatch('interview/fetchInterviewById', this.interviewId)
        const interview = this.$store.state.interview.interviewDetail
        // 复制数据到表单
        this.form = { ...interview }
      } catch (error) {
        console.error('加载面试详情失败:', error)
      }
    },
    async handleSubmit() {
      try {
        await this.$store.dispatch('interview/updateInterview', {
          id: this.interviewId,
          interviewData: this.form
        })
        this.$router.push(`/interviews/${this.interviewId}`)
      } catch (error) {
        console.error('更新面试失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.interview-edit {
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