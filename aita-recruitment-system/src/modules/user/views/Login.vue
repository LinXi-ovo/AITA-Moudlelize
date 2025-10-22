<template>
  <div class="login">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="loginForm.username" required>
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="loginForm.password" required>
      </div>
      <button type="submit">登录</button>
    </form>
    
    <div class="demo-users">
      <h3>演示账户</h3>
      <p>管理员: admin / admin123</p>
      <p>面试官: interviewer / interview123</p>
      <p>申请人: applicant / apply123</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      try {
        // 使用新的权限管理模块进行登录
        const user = await this.$store.dispatch('auth/login', this.loginForm)
        
        // 记录登录日志
        await this.$store.dispatch('log/logUserLogin', {
          userId: user.id,
          userName: user.username,
          ip: this.getClientIP()
        })
        
        // 登录成功后重定向到首页
        this.$router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
        
        // 记录登录失败日志
        await this.$store.dispatch('log/logSecurityEvent', {
          event: '登录失败',
          details: {
            username: this.loginForm.username,
            error: error.message
          },
          ip: this.getClientIP()
        })
        
        alert('登录失败，请检查用户名和密码')
      }
    },
    
    getClientIP() {
      // 在实际应用中，应该从服务器获取真实IP地址
      // 这里返回一个模拟IP
      return '127.0.0.1'
    }
  }
}
</script>

<style scoped>
.login {
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

.demo-users {
  margin-top: 30px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.demo-users h3 {
  margin-top: 0;
}
</style>