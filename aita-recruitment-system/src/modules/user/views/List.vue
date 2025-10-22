<template>
  <div class="user-list">
    <h2>用户管理</h2>
    
    <div class="filters">
      <div class="filter-row">
        <div class="filter-group">
          <label for="search">搜索:</label>
          <input 
            type="text" 
            id="search" 
            v-model="filters.search" 
            placeholder="用户名或邮箱"
            @input="handleSearch"
          >
        </div>
        
        <div class="filter-group">
          <label for="role">角色:</label>
          <select id="role" v-model="filters.role" @change="handleFilter">
            <option value="">全部角色</option>
            <option value="admin">管理员</option>
            <option value="interviewer">面试官</option>
            <option value="applicant">申请人</option>
          </select>
        </div>
        
        <div class="filter-actions">
          <button @click="resetFilters" class="btn btn-secondary">重置</button>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <router-link to="/users/create" class="btn btn-primary">添加用户</router-link>
      <DataExport 
        :data="filteredUsersForExport"
        filename="用户列表"
        title="用户列表"
        v-if="filteredUsers.length > 0"
      />
    </div>
    
    <div class="user-table">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('id')" class="sortable">
              ID
              <span v-if="sort.field === 'id'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('username')" class="sortable">
              用户名
              <span v-if="sort.field === 'username'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('email')" class="sortable">
              邮箱
              <span v-if="sort.field === 'email'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('role')" class="sortable">
              角色
              <span v-if="sort.field === 'role'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ getUserRoleDisplayName(user.role) }}</td>
            <td>
              <router-link :to="`/users/${user.id}/edit`" class="btn btn-sm btn-secondary">编辑</router-link>
              <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger">删除</button>
              <router-link :to="`/users/${user.id}`" class="btn btn-sm btn-info">详情</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredUsers.length === 0" class="no-results">
        <p>没有找到匹配的用户</p>
      </div>
    </div>
    
    <div class="pagination" v-if="totalPages > 1">
      <button 
        @click="changePage(currentPage - 1)" 
        :disabled="currentPage === 1"
        class="btn btn-secondary"
      >
        上一页
      </button>
      
      <span class="page-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页 (共 {{ filteredUsers.length }} 条记录)
      </span>
      
      <button 
        @click="changePage(currentPage + 1)" 
        :disabled="currentPage === totalPages"
        class="btn btn-secondary"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script>
import DataExport from '@/components/DataExport.vue'

export default {
  name: 'UserList',
  components: {
    DataExport
  },
  data() {
    return {
      users: [],
      filters: {
        search: '',
        role: ''
      },
      sort: {
        field: 'id',
        direction: 'asc'
      },
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    filteredUsers() {
      let filtered = [...this.users]
      
      // 应用搜索过滤
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(user => 
          user.username.toLowerCase().includes(search) || 
          user.email.toLowerCase().includes(search)
        )
      }
      
      // 应用角色过滤
      if (this.filters.role) {
        filtered = filtered.filter(user => user.role === this.filters.role)
      }
      
      // 应用排序
      filtered.sort((a, b) => {
        const aVal = a[this.sort.field]
        const bVal = b[this.sort.field]
        
        if (aVal < bVal) {
          return this.sort.direction === 'asc' ? -1 : 1
        }
        if (aVal > bVal) {
          return this.sort.direction === 'asc' ? 1 : -1
        }
        return 0
      })
      
      return filtered
    },
    filteredUsersForExport() {
      // 为导出准备数据，只包含需要的字段
      return this.filteredUsers.map(user => ({
        ID: user.id,
        用户名: user.username,
        邮箱: user.email,
        角色: this.getUserRoleDisplayName(user.role)
      }))
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.pageSize)
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredUsers.slice(start, end)
    }
  },
  async mounted() {
    await this.loadUsers()
  },
  methods: {
    async loadUsers() {
      try {
        // 从store获取用户列表
        await this.$store.dispatch('user/fetchUsers')
        this.users = this.$store.state.user.users
      } catch (error) {
        console.error('加载用户列表失败:', error)
      }
    },
    async deleteUser(userId) {
      if (confirm('确定要删除这个用户吗？')) {
        try {
          await this.$store.dispatch('user/deleteUser', userId)
          await this.loadUsers() // 重新加载用户列表
        } catch (error) {
          console.error('删除用户失败:', error)
        }
      }
    },
    handleSearch() {
      this.currentPage = 1
    },
    handleFilter() {
      this.currentPage = 1
    },
    resetFilters() {
      this.filters.search = ''
      this.filters.role = ''
      this.currentPage = 1
    },
    sortBy(field) {
      if (this.sort.field === field) {
        this.sort.direction = this.sort.direction === 'asc' ? 'desc' : 'asc'
      } else {
        this.sort.field = field
        this.sort.direction = 'asc'
      }
    },
    changePage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },
    getUserRoleDisplayName(role) {
      const roleMap = {
        'admin': '管理员',
        'interviewer': '面试官',
        'applicant': '申请人'
      }
      return roleMap[role] || role
    }
  }
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.filters {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 15px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
}

.filter-group label {
  font-weight: bold;
  margin-bottom: 5px;
}

.filter-group input,
.filter-group select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-actions {
  margin-bottom: 8px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
  margin-right: 5px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-table {
  overflow-x: auto;
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  cursor: pointer;
  user-select: none;
}

th:hover {
  background-color: #e9ecef;
}

.sortable {
  position: relative;
}

.sort-indicator {
  position: absolute;
  right: 5px;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #999;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.page-info {
  font-weight: bold;
  white-space: nowrap;
}
</style>