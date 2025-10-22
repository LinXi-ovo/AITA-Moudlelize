<template>
  <div class="recruitment-edit">
    <h2>编辑招新活动</h2>
    
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
          <label for="startDate">开始日期:</label>
          <input type="date" id="startDate" v-model="form.startDate" required>
        </div>
        
        <div class="form-group">
          <label for="endDate">结束日期:</label>
          <input type="date" id="endDate" v-model="form.endDate" required>
        </div>
        
        <div class="form-group">
          <label for="status">状态:</label>
          <select id="status" v-model="form.status" required>
            <option value="planned">计划中</option>
            <option value="active">进行中</option>
            <option value="finished">已结束</option>
          </select>
        </div>
        
        <div class="actions">
          <button type="submit" class="btn btn-primary">更新</button>
          <router-link :to="`/recruitments/${recruitmentId}`" class="btn btn-secondary">取消</router-link>
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
  name: 'EditRecruitment',
  data() {
    return {
      recruitmentId: null,
      form: null
    }
  },
  async mounted() {
    this.recruitmentId = this.$route.params.id
    await this.loadRecruitment()
  },
  methods: {
    async loadRecruitment() {
      try {
        // 先获取招新活动详情
        await this.$store.dispatch('recruitment/fetchRecruitmentById', this.recruitmentId)
        const recruitment = this.$store.state.recruitment.recruitmentDetail
        // 复制数据到表单
        this.form = { ...recruitment }
      } catch (error) {
        console.error('加载招新活动详情失败:', error)
      }
    },
    async handleSubmit() {
      try {
        await this.$store.dispatch('recruitment/updateRecruitment', {
          id: this.recruitmentId,
          recruitmentData: this.form
        })
        this.$router.push(`/recruitments/${this.recruitmentId}`)
      } catch (error) {
        console.error('更新招新活动失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.recruitment-edit {
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