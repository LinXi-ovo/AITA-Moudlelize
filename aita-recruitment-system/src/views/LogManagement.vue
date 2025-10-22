<template>
  <div class="log-management">
    <h2>系统日志</h2>
    
    <div class="log-filters">
      <div class="filter-row">
        <div class="filter-group">
          <label for="level">日志级别:</label>
          <select id="level" v-model="filters.level" @change="handleFilter">
            <option value="">全部级别</option>
            <option v-for="level in logLevels" :key="level" :value="level">
              {{ getLevelDisplayName(level) }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="category">日志分类:</label>
          <select id="category" v-model="filters.category" @change="handleFilter">
            <option value="">全部分类</option>
            <option v-for="category in logCategories" :key="category" :value="category">
              {{ getCategoryDisplayName(category) }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label for="date-range">日期范围:</label>
          <input type="date" v-model="filters.dateStart" @change="handleFilter">
          <span>至</span>
          <input type="date" v-model="filters.dateEnd" @change="handleFilter">
        </div>
        
        <div class="filter-actions">
          <button @click="resetFilters" class="btn btn-secondary">重置</button>
          <button @click="refreshLogs" class="btn btn-primary">刷新</button>
        </div>
      </div>
    </div>
    
    <div class="log-actions">
      <button @click="exportLogs" class="btn btn-info">导出日志</button>
      <button @click="clearLogs" class="btn btn-danger">清空日志</button>
    </div>
    
    <div class="log-table">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th>级别</th>
            <th>分类</th>
            <th>用户</th>
            <th>IP地址</th>
            <th>消息</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td>{{ formatDateTime(log.timestamp) }}</td>
            <td>
              <span :class="['level-badge', log.level]">
                {{ getLevelDisplayName(log.level) }}
              </span>
            </td>
            <td>{{ getCategoryDisplayName(log.category) }}</td>
            <td>{{ log.userName }}</td>
            <td>{{ log.ip }}</td>
            <td>{{ log.message }}</td>
            <td>
              <button @click="viewLogDetails(log)" class="btn btn-sm btn-info">详情</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <div v-if="filteredLogs.length === 0" class="no-results">
        <p>没有找到匹配的日志</p>
      </div>
    </div>
    
    <!-- 日志详情弹窗 -->
    <div v-if="selectedLog" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>日志详情</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="log-detail">
            <p><strong>时间:</strong> {{ formatDateTime(selectedLog.timestamp) }}</p>
            <p><strong>级别:</strong> 
              <span :class="['level-badge', selectedLog.level]">
                {{ getLevelDisplayName(selectedLog.level) }}
              </span>
            </p>
            <p><strong>分类:</strong> {{ getCategoryDisplayName(selectedLog.category) }}</p>
            <p><strong>用户:</strong> {{ selectedLog.userName }}</p>
            <p><strong>IP地址:</strong> {{ selectedLog.ip }}</p>
            <p><strong>User-Agent:</strong> {{ selectedLog.userAgent }}</p>
            <p><strong>消息:</strong> {{ selectedLog.message }}</p>
            
            <div v-if="selectedLog.details" class="log-details">
              <strong>详细信息:</strong>
              <pre>{{ formatDetails(selectedLog.details) }}</pre>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeModal" class="btn btn-secondary">关闭</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogManagement',
  data() {
    return {
      logs: [],
      filters: {
        level: '',
        category: '',
        dateStart: '',
        dateEnd: ''
      },
      selectedLog: null
    }
  },
  computed: {
    logLevels() {
      return this.$store.getters['log/getLogLevels']
    },
    logCategories() {
      return this.$store.getters['log/getLogCategories']
    },
    filteredLogs() {
      let filtered = [...this.logs]
      
      // 应用级别过滤
      if (this.filters.level) {
        filtered = filtered.filter(log => log.level === this.filters.level)
      }
      
      // 应用分类过滤
      if (this.filters.category) {
        filtered = filtered.filter(log => log.category === this.filters.category)
      }
      
      // 应用日期范围过滤
      if (this.filters.dateStart) {
        const startDate = new Date(this.filters.dateStart)
        filtered = filtered.filter(log => new Date(log.timestamp) >= startDate)
      }
      
      if (this.filters.dateEnd) {
        const endDate = new Date(this.filters.dateEnd)
        endDate.setHours(23, 59, 59, 999) // 设置为当天最后一毫秒
        filtered = filtered.filter(log => new Date(log.timestamp) <= endDate)
      }
      
      // 按时间倒序排列
      filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      
      return filtered
    }
  },
  async mounted() {
    await this.loadLogs()
  },
  methods: {
    async loadLogs() {
      try {
        // 构造过滤条件
        const filters = {}
        
        if (this.filters.level) {
          filters.level = this.filters.level
        }
        
        if (this.filters.category) {
          filters.category = this.filters.category
        }
        
        if (this.filters.dateStart || this.filters.dateEnd) {
          filters.dateRange = {}
          
          if (this.filters.dateStart) {
            filters.dateRange.start = new Date(this.filters.dateStart)
          }
          
          if (this.filters.dateEnd) {
            const endDate = new Date(this.filters.dateEnd)
            endDate.setHours(23, 59, 59, 999)
            filters.dateRange.end = endDate
          }
        }
        
        await this.$store.dispatch('log/fetchLogs', filters)
        this.logs = this.$store.getters['log/getLogs']
      } catch (error) {
        console.error('加载日志失败:', error)
      }
    },
    
    handleFilter() {
      this.loadLogs()
    },
    
    resetFilters() {
      this.filters = {
        level: '',
        category: '',
        dateStart: '',
        dateEnd: ''
      }
      this.loadLogs()
    },
    
    refreshLogs() {
      this.loadLogs()
    },
    
    async clearLogs() {
      if (confirm('确定要清空所有日志吗？此操作不可恢复。')) {
        try {
          await this.$store.dispatch('log/clearLogs')
          this.logs = []
        } catch (error) {
          console.error('清空日志失败:', error)
        }
      }
    },
    
    async exportLogs() {
      try {
        // 准备导出数据
        const exportData = this.filteredLogs.map(log => ({
          时间: this.formatDateTime(log.timestamp),
          级别: this.getLevelDisplayName(log.level),
          分类: this.getCategoryDisplayName(log.category),
          用户: log.userName,
          IP地址: log.ip,
          消息: log.message
        }))
        
        // 触发导出
        await this.$store.dispatch('export/exportToCSV', {
          data: exportData,
          filename: `系统日志_${new Date().toISOString().slice(0, 10)}.csv`
        })
      } catch (error) {
        console.error('导出日志失败:', error)
      }
    },
    
    viewLogDetails(log) {
      this.selectedLog = { ...log }
    },
    
    closeModal() {
      this.selectedLog = null
    },
    
    getLevelDisplayName(level) {
      const levelMap = {
        'debug': '调试',
        'info': '信息',
        'warn': '警告',
        'error': '错误'
      }
      return levelMap[level] || level
    },
    
    getCategoryDisplayName(category) {
      const categoryMap = {
        'user': '用户',
        'system': '系统',
        'security': '安全',
        'audit': '审计'
      }
      return categoryMap[category] || category
    },
    
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('zh-CN')
    },
    
    formatDetails(details) {
      if (typeof details === 'string') {
        return details
      }
      return JSON.stringify(details, null, 2)
    }
  }
}
</script>

<style scoped>
.log-management {
  padding: 20px;
}

.log-filters {
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

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.filter-actions {
  margin-bottom: 8px;
}

.log-actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.btn {
  padding: 8px 12px;
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

.btn-info {
  background-color: #17a2b8;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-sm {
  padding: 4px 8px;
  font-size: 12px;
}

.log-table {
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
}

.level-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.level-badge.debug {
  background-color: #d1ecf1;
  color: #0c5460;
}

.level-badge.info {
  background-color: #d4edda;
  color: #155724;
}

.level-badge.warn {
  background-color: #fff3cd;
  color: #856404;
}

.level-badge.error {
  background-color: #f8d7da;
  color: #721c24;
}

.no-results {
  text-align: center;
  padding: 30px;
  color: #999;
}

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 90%;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.log-detail p {
  margin: 10px 0;
}

.log-details {
  margin: 15px 0;
}

.log-details pre {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  overflow-x: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #eee;
}
</style>