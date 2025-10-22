<template>
  <div class="statistics-dashboard">
    <h2>数据统计</h2>
    
    <div class="dashboard-actions">
      <DataExport 
        :data="exportData"
        filename="统计数据"
        title="AITA招新统计报告"
      />
    </div>
    
    <div class="stats-cards">
      <div class="card">
        <div class="card-header">总申请人数</div>
        <div class="card-body">{{ statistics.totalApplicants }}</div>
      </div>
      
      <div class="card">
        <div class="card-header">笔试场次</div>
        <div class="card-body">{{ statistics.totalExams }}</div>
      </div>
      
      <div class="card">
        <div class="card-header">面试安排</div>
        <div class="card-body">{{ statistics.totalInterviews }}</div>
      </div>
      
      <div class="card">
        <div class="card-header">评价数量</div>
        <div class="card-body">{{ statistics.totalEvaluations }}</div>
      </div>
    </div>
    
    <div class="charts">
      <div class="chart-section">
        <h3>申请人数趋势</h3>
        <div class="chart-container">
          <div v-for="item in statistics.applicantTrend" :key="item.month" class="bar">
            <div class="bar-label">{{ item.month }}</div>
            <div class="bar-fill" :style="{ height: (item.count / maxTrendCount * 100) + '%' }"></div>
            <div class="bar-value">{{ item.count }}</div>
          </div>
        </div>
      </div>
      
      <div class="chart-section">
        <h3>面试状态统计</h3>
        <div class="pie-chart">
          <div class="pie-segment scheduled" :style="{ width: (statistics.interviewStats.scheduled / totalInterviews * 100) + '%' }">
            已安排 ({{ statistics.interviewStats.scheduled }})
          </div>
          <div class="pie-segment completed" :style="{ width: (statistics.interviewStats.completed / totalInterviews * 100) + '%' }">
            已完成 ({{ statistics.interviewStats.completed }})
          </div>
          <div class="pie-segment cancelled" :style="{ width: (statistics.interviewStats.cancelled / totalInterviews * 100) + '%' }">
            已取消 ({{ statistics.interviewStats.cancelled }})
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions">
      <router-link to="/statistics/reports" class="btn btn-primary">查看报告</router-link>
    </div>
  </div>
</template>

<script>
import DataExport from '@/components/DataExport.vue'

export default {
  name: 'StatisticsDashboard',
  components: {
    DataExport
  },
  data() {
    return {
      statistics: {
        totalApplicants: 0,
        totalExams: 0,
        totalInterviews: 0,
        totalEvaluations: 0,
        applicantTrend: [],
        examScores: [],
        interviewStats: {
          scheduled: 0,
          completed: 0,
          cancelled: 0
        }
      }
    }
  },
  computed: {
    maxTrendCount() {
      if (!this.statistics.applicantTrend.length) return 0
      return Math.max(...this.statistics.applicantTrend.map(item => item.count))
    },
    totalInterviews() {
      const stats = this.statistics.interviewStats
      return stats.scheduled + stats.completed + stats.cancelled
    },
    exportData() {
      // 为导出准备统计数据
      return [{
        '总申请人数': this.statistics.totalApplicants,
        '笔试场次': this.statistics.totalExams,
        '面试安排': this.statistics.totalInterviews,
        '评价数量': this.statistics.totalEvaluations,
        '已安排面试': this.statistics.interviewStats.scheduled,
        '已完成面试': this.statistics.interviewStats.completed,
        '已取消面试': this.statistics.interviewStats.cancelled
      }]
    }
  },
  async mounted() {
    await this.loadStatistics()
  },
  methods: {
    async loadStatistics() {
      try {
        await this.$store.dispatch('statistics/fetchStatistics')
        this.statistics = this.$store.state.statistics.statistics
      } catch (error) {
        console.error('加载统计数据失败:', error)
      }
    }
  }
}
</script>

<style scoped>
.statistics-dashboard {
  padding: 20px;
}

.dashboard-actions {
  margin-bottom: 20px;
  text-align: right;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}

.card-header {
  background-color: #42b983;
  color: white;
  padding: 10px 15px;
  font-weight: bold;
}

.card-body {
  padding: 20px 15px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}

.charts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  margin-bottom: 30px;
}

.chart-section h3 {
  margin-bottom: 15px;
}

.chart-container {
  display: flex;
  align-items: end;
  height: 200px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
}

.bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 5px;
}

.bar-label {
  margin-bottom: 5px;
  font-size: 12px;
}

.bar-fill {
  width: 40px;
  background-color: #42b983;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.bar-value {
  margin-top: 5px;
  font-size: 12px;
}

.pie-chart {
  display: flex;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
}

.pie-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.pie-segment.scheduled {
  background-color: #17a2b8;
}

.pie-segment.completed {
  background-color: #28a745;
}

.pie-segment.cancelled {
  background-color: #dc3545;
}

.actions {
  text-align: center;
}

.btn {
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}
</style>