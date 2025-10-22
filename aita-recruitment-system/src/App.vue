<template>
  <div id="app">
    <header class="header">
      <div class="header-content">
        <h1 class="logo">AITA招新笔面试系统</h1>
        <div class="header-right">
          <NotificationBell v-if="$store.getters['auth/isLoggedIn']" />
          <div v-if="$store.getters['auth/isLoggedIn']" class="user-info">
            <span>欢迎，{{ $store.state.auth.currentUser.username }}</span>
            <button @click="handleLogout" class="btn btn-small btn-secondary">退出</button>
          </div>
        </div>
      </div>
    </header>
    
    <main class="main-content">
      <router-view/>
    </main>
  </div>
</template>

<script>
import NotificationBell from '@/components/NotificationBell.vue'

export default {
  name: 'App',
  components: {
    NotificationBell
  },
  methods: {
    async handleLogout() {
      try {
        // 获取当前用户信息用于日志记录
        const currentUser = this.$store.state.auth.currentUser
        
        // 执行登出操作
        await this.$store.dispatch('auth/logout')
        
        // 记录登出日志
        if (currentUser) {
          await this.$store.dispatch('log/logUserLogout', {
            userId: currentUser.id,
            userName: currentUser.username,
            ip: this.getClientIP()
          })
        }
        
        this.$router.push('/')
      } catch (error) {
        console.error('登出失败:', error)
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #42b983;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
}

.logo {
  margin: 0;
  font-size: 18px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
</style>