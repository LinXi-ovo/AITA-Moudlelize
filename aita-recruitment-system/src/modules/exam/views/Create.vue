<template>
  <div class="exam-create">
    <h2>创建笔试</h2>
    
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
        <button type="submit" class="btn btn-primary">创建</button>
        <router-link to="/exams" class="btn btn-secondary">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateExam',
  data() {
    return {
      form: {
        title: '',
        description: '',
        duration: 90,
        startTime: '',
        endTime: '',
        status: 'scheduled'
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        // 创建笔试
        const result = await this.$store.dispatch('exam/createExam', this.form)
        
        // 发送通知
        await this.$store.dispatch('notification/createExamNotification', {
          id: result.id,
          title: this.form.title,
          startTime: this.form.startTime
        })
        
        this.$router.push('/exams')
      } catch (error) {
        console.error('创建笔试失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.exam-create {
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