<template>
  <div class="register">
    <h2>用户注册</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="registerForm.username" required>
      </div>
      <div class="form-group">
        <label for="email">邮箱:</label>
        <input type="email" id="email" v-model="registerForm.email" required>
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="registerForm.password" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">确认密码:</label>
        <input type="password" id="confirmPassword" v-model="registerForm.confirmPassword" required>
      </div>
      <button type="submit">注册</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    }
  },
  methods: {
    handleRegister() {
      // 注册逻辑
      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        alert('密码不匹配')
        return
      }
      
      // 注册逻辑
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.register {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>