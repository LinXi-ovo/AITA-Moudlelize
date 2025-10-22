<template>
  <div class="reports-view">
    <h2>统计报告</h2>
    
    <div class="actions">
      <button @click="generateReport" class="btn btn-primary">生成报告</button>
    </div>
    
    <div class="reports-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>标题</th>
            <th>类型</th>
            <th>创建时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.id }}</td>
            <td>{{ report.title }}</td>
            <td>{{ getTypeText(report.type) }}</td>
            <td>{{ formatDateTime(report.createTime) }}</td>
            <td>
              <button @click="viewReport(report.id)" class="btn btn-sm btn-info">查看</button>
              <button @click="deleteReport(report.id)" class="btn btn-sm btn-danger">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="currentReport" class="report-detail">
      <h3>{{ currentReport.title }}</h3>
      <div class="report-content">
        <p>{{ currentReport.content }}</p>
      </div>
      <div class="actions">
        <button @click="closeReport" class="btn btn-secondary">关闭</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsView',
  data() {
    return {
      reports: [],
      currentReport: null
    }
  },
  async mounted() {
    await this.loadReports()
  },
  methods: {
    async loadReports() {
      try {
        await this.$store.dispatch('statistics/fetchReports')
        this.reports = this.$store.state.statistics.reports
      } catch (error) {
        console.error('加载报告列表失败:', error)
      }
    },
    async generateReport() {
      const reportData = {
        title: '新生成的统计报告',
        type: 'general',
        content: '这是新生成的统计报告内容...'
      }
      
      try {
        await this.$store.dispatch('statistics/generateReport', reportData)
        await this.loadReports() // 重新加载报告列表
      } catch (error) {
        console.error('生成报告失败:', error)
      }
    },
    async viewReport(reportId) {
      try {
        await this.$store.dispatch('statistics/fetchReportById', reportId)
        this.currentReport = this.$store.state.statistics.currentReport
      } catch (error) {
        console.error('查看报告失败:', error)
      }
    },
    closeReport() {
      this.currentReport = null
    },
    async deleteReport(reportId) {
      if (confirm('确定要删除这个报告吗？')) {
        // 这里应该调用删除报告的API
        this.reports = this.reports.filter(r => r.id !== reportId)
      }
    },
    getTypeText(type) {
      const typeMap = {
        'recruitment': '招新统计',
        'exam': '笔试分析',
        'interview': '面试分析',
        'general': '综合报告',
        'detailed': '详细报告'
      }
      return typeMap[type] || type
    },
    formatDateTime(dateTime) {
      return new Date(dateTime).toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.reports-view {
  padding: 20px;
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

.reports-table {
  overflow-x: auto;
  margin-bottom: 30px;
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

.report-detail {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-top: 20px;
}

.report-detail h3 {
  margin-top: 0;
}

.report-content {
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.report-content p {
  margin: 0;
  white-space: pre-wrap;
}
</style>