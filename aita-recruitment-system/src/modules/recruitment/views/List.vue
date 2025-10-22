<template>
  <div class="recruitment-list">
    <h2>招新管理</h2>
    
    <div class="filters">
      <div class="filter-row">
        <div class="filter-group">
          <label for="search">搜索:</label>
          <input 
            type="text" 
            id="search" 
            v-model="filters.search" 
            placeholder="标题"
            @input="handleSearch"
          >
        </div>
        
        <div class="filter-group">
          <label for="status">状态:</label>
          <select id="status" v-model="filters.status" @change="handleFilter">
            <option value="">全部状态</option>
            <option value="planned">计划中</option>
            <option value="active">进行中</option>
            <option value="finished">已结束</option>
          </select>
        </div>
        
        <div class="filter-actions">
          <button @click="resetFilters" class="btn btn-secondary">重置</button>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <router-link to="/recruitments/create" class="btn btn-primary">创建招新活动</router-link>
    </div>
    
    <div class="recruitment-table">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('id')" class="sortable">
              ID
              <span v-if="sort.field === 'id'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('title')" class="sortable">
              标题
              <span v-if="sort.field === 'title'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('startDate')" class="sortable">
              开始日期
              <span v-if="sort.field === 'startDate'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('endDate')" class="sortable">
              结束日期
              <span v-if="sort.field === 'endDate'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('status')" class="sortable">
              状态
              <span v-if="sort.field === 'status'" class="sort-indicator">
                {{ sort.direction === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="recruitment in filteredRecruitments" :key="recruitment.id">
            <td>{{ recruitment.id }}</td>
            <td>{{ recruitment.title }}</td>
            <td>{{ recruitment.startDate }}</td>
            <td>{{ recruitment.endDate }}</td>
            <td>
              <span :class="['status-badge', recruitment.status]">
                {{ getStatusText(recruitment.status) }}
              </span>
            </td>
            <td>
              <router-link :to="`/recruitments/${recruitment.id}/edit`" class="btn btn-sm btn-secondary">编辑</router-link>
              <button @click="deleteRecruitment(recruitment.id)" class="btn btn-sm btn-danger">删除</button>
              <router-link :to="`/recruitments/${recruitment.id}`" class="btn btn-sm btn-info">详情</router-link>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredRecruitments.length === 0" class="no-results">
        <p>没有找到匹配的招新活动</p>
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
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
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
export default {
  name: 'RecruitmentList',
  data() {
    return {
      recruitments: [],
      filters: {
        search: '',
        status: ''
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
    filteredRecruitments() {
      let filtered = [...this.recruitments]
      
      // 应用搜索过滤
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(recruitment => 
          recruitment.title.toLowerCase().includes(search)
        )
      }
      
      // 应用状态过滤
      if (this.filters.status) {
        filtered = filtered.filter(recruitment => recruitment.status === this.filters.status)
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
    totalPages() {
      return Math.ceil(this.filteredRecruitments.length / this.pageSize)
    },
    paginatedRecruitments() {
      const start = (this.currentPage - 1) * this.pageSize
      const end = start + this.pageSize
      return this.filteredRecruitments.slice(start, end)
    }
  },
  async mounted() {
    await this.loadRecruitments()
  },
  methods: {
    async loadRecruitments() {
      try {
        // 从store获取招新活动列表
        await this.$store.dispatch('recruitment/fetchRecruitments')
        this.recruitments = this.$store.state.recruitment.recruitments
      } catch (error) {
        console.error('加载招新活动列表失败:', error)
      }
    },
    async deleteRecruitment(recruitmentId) {
      if (confirm('确定要删除这个招新活动吗？')) {
        try {
          await this.$store.dispatch('recruitment/deleteRecruitment', recruitmentId)
          await this.loadRecruitments() // 重新加载列表
        } catch (error) {
          console.error('删除招新活动失败:', error)
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
      this.filters.status = ''
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
    getStatusText(status) {
      const statusMap = {
        'active': '进行中',
        'planned': '计划中',
        'finished': '已结束'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.recruitment-list {
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
  margin-bottom: 20px;
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

.recruitment-table {
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

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.status-badge.active {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.planned {
  background-color: #d1ecf1;
  color: #0c5460;
}

.status-badge.finished {
  background-color: #f8d7da;
  color: #721c24;
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
}

.page-info {
  font-weight: bold;
}
</style>