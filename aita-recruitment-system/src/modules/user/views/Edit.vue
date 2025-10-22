<template>
  <div class="user-edit">
    <h2>编辑用户</h2>
    
    <div v-if="form">
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
          <label for="password">密码 (留空则不修改):</label>
          <input type="password" id="password" v-model="form.password">
        </div>
        
        <div class="actions">
          <button type="submit" class="btn btn-primary">更新</button>
          <router-link :to="`/users/${userId}`" class="btn btn-secondary">取消</router-link>
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
  name: 'UserEdit',
  data() {
    return {
      userId: null,
      form: null
    }
  },
  async mounted() {
    this.userId = this.$route.params.id
    await this.loadUser()
  },
  methods: {
    async loadUser() {
      try {
        // 先获取用户详情
        await this.$store.dispatch('user/fetchUserById', this.userId)
        const user = this.$store.state.user.userDetail
        // 复制用户数据到表单，但不包含密码字段
        this.form = {
          username: user.username,
          email: user.email,
          role: user.role,
          password: ''
        }
      } catch (error) {
        console.error('加载用户详情失败:', error)
      }
    },
    async handleSubmit() {
      try {
        const userData = { ...this.form }
        // 如果密码为空，则不包含在更新数据中
        if (!userData.password) {
          delete userData.password
        }
        
        await this.$store.dispatch('user/updateUser', {
          id: this.userId,
          userData
        })
        this.$router.push(`/users/${this.userId}`)
      } catch (error) {
        console.error('更新用户失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.user-edit {
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