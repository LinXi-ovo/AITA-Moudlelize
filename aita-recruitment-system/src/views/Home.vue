<template>
  <div class="home">
    <h1>AITA招新笔面试系统</h1>
    <p>欢迎使用AITA社团招新笔面试系统</p>
    
    <div v-if="$store.getters['auth/isLoggedIn']" class="user-info">
      <p>您好，{{ $store.state.auth.currentUser.username }} ({{ roleDisplayName }})</p>
      <button @click="handleLogout" class="btn btn-secondary">退出登录</button>
    </div>
    <div v-else class="guest-info">
      <p>请先登录以使用系统功能</p>
      <router-link to="/login" class="btn btn-primary">用户登录</router-link>
      <router-link to="/register" class="btn btn-secondary">用户注册</router-link>
    </div>
    
    <div v-if="$store.getters['auth/isLoggedIn']" class="navigation">
      <h2>功能导航</h2>
      <ul>
        <li><router-link to="/profile">个人资料</router-link></li>
        <li><router-link to="/files">文件管理</router-link></li>
        
        <li v-if="$store.getters['auth/hasPermission']('recruitment.manage')">
          <router-link to="/recruitments">招新管理</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('exam.manage')">
          <router-link to="/exams">笔试管理</router-link>
        </li>
        <li v-else-if="$store.getters['auth/hasPermission']('exam.take')">
          <router-link to="/exams">我的笔试</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('interview.manage')">
          <router-link to="/interviews">面试管理</router-link>
        </li>
        <li v-else-if="$store.getters['auth/hasPermission']('interview.view')">
          <router-link to="/interviews">我的面试</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('evaluation.manage')">
          <router-link to="/evaluations">评价管理</router-link>
        </li>
        <li v-else-if="$store.getters['auth/hasPermission']('evaluation.create')">
          <router-link to="/evaluations">添加评价</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('statistics.view')">
          <router-link to="/statistics">数据统计</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('user.manage')">
          <router-link to="/users">用户管理</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('feedback.manage')">
          <router-link to="/feedback">反馈管理</router-link>
        </li>
        
        <li v-if="$store.getters['auth/hasPermission']('log.manage')">
          <router-link to="/logs">系统日志</router-link>
        </li>
      </ul>
    </div>
    
    <div v-if="$store.getters['auth/isLoggedIn']" class="feedback-section">
      <h3>意见反馈</h3>
      <p>如果您有任何建议或问题，请告诉我们：</p>
      <FeedbackForm />
    </div>
  </div>
</template>

<script>
import FeedbackForm from '@/components/FeedbackForm.vue'

export default {
  name: 'Home',
  components: {
    FeedbackForm
  },
  computed: {
    roleDisplayName() {
      const role = this.$store.getters['auth/currentUserRole']
      const roleMap = {
        'admin': '管理员',
        'interviewer': '面试官',
        'applicant': '申请人'
      }
      return roleMap[role] || role
    }
  },
  methods: {
    async handleLogout() {
      try {
        await this.$store.dispatch('auth/logout')
        this.$router.push('/')
      } catch (error) {
        console.error('登出失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.user-info {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.guest-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
  text-align: center;
}

.guest-info .btn {
  margin: 0 10px;
}

.btn {
  padding: 8px 12px;
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

.navigation {
  margin-top: 30px;
}

.navigation ul {
  list-style-type: none;
  padding: 0;
}

.navigation li {
  margin: 10px 0;
}

.navigation a {
  text-decoration: none;
  color: #42b983;
  font-size: 18px;
}

.navigation a:hover {
  text-decoration: underline;
}

.feedback-section {
  margin-top: 30px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.feedback-section h3 {
  margin-top: 0;
}
</style>