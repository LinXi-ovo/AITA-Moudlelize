<template>
  <div class="user-detail">
    <h2>用户详情</h2>
    
    <div v-if="user">
      <div class="user-info">
        <p><strong>ID:</strong> {{ user.id }}</p>
        <p><strong>用户名:</strong> {{ user.username }}</p>
        <p><strong>邮箱:</strong> {{ user.email }}</p>
        <p><strong>角色:</strong> {{ user.role }}</p>
      </div>
      
      <div class="actions">
        <router-link :to="`/users/${user.id}/edit`" class="btn btn-primary">编辑</router-link>
        <router-link to="/users" class="btn btn-secondary">返回列表</router-link>
      </div>
    </div>
    
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserDetail',
  data() {
    return {
      user: null
    }
  },
  async mounted() {
    await this.loadUser()
  },
  methods: {
    async loadUser() {
      try {
        const userId = this.$route.params.id
        await this.$store.dispatch('user/fetchUserById', userId)
        this.user = this.$store.state.user.userDetail
      } catch (error) {
        console.error('加载用户详情失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.user-detail {
  padding: 20px;
}

.user-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.user-info p {
  margin: 10px 0;
}

.actions {
  margin-top: 20px;
}

.btn {
  padding: 8px 12px;
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