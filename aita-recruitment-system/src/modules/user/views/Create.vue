<template>
  <div class="user-create">
    <h2>创建用户</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="form.username" required>
      </div>
      
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="form.email" required>
      </div>
      
      <div class="form-group">
        <label for="role">角色:</label>
        <select id="role" v-model="form.role" required>
          <option value="admin">管理员</option>
          <option value="applicant">申请人</option>
          <option value="interviewer">面试官</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="form.password" required>
      </div>
      
      <div class="actions">
        <button type="submit" class="btn btn-primary">创建</button>
        <router-link to="/users" class="btn btn-secondary">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserCreate',
  data() {
    return {
      form: {
        username: '',
        email: '',
        role: 'applicant',
        password: ''
      }
    }
  },
  methods: {
    async handleSubmit() {
      try {
        await this.$store.dispatch('user/createUser', this.form)
        this.$router.push('/users')
      } catch (error) {
        console.error('创建用户失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.user-create {
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

input, select {
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