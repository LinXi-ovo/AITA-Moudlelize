<template>
  <div class="recruitment-detail">
    <h2>招新活动详情</h2>
    
    <div v-if="recruitment">
      <div class="recruitment-info">
        <p><strong>ID:</strong> {{ recruitment.id }}</p>
        <p><strong>标题:</strong> {{ recruitment.title }}</p>
        <p><strong>描述:</strong> {{ recruitment.description }}</p>
        <p><strong>开始日期:</strong> {{ recruitment.startDate }}</p>
        <p><strong>结束日期:</strong> {{ recruitment.endDate }}</p>
        <p>
          <strong>状态:</strong>
          <span :class="['status-badge', recruitment.status]">
            {{ getStatusText(recruitment.status) }}
          </span>
        </p>
      </div>
      
      <div class="actions">
        <router-link :to="`/recruitments/${recruitment.id}/edit`" class="btn btn-primary">编辑</router-link>
        <router-link to="/recruitments" class="btn btn-secondary">返回列表</router-link>
      </div>
    </div>
    
    <div v-else>
      <p>加载中...</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecruitmentDetail',
  data() {
    return {
      recruitment: null
    }
  },
  async mounted() {
    await this.loadRecruitment()
  },
  methods: {
    async loadRecruitment() {
      try {
        const recruitmentId = this.$route.params.id
        await this.$store.dispatch('recruitment/fetchRecruitmentById', recruitmentId)
        this.recruitment = this.$store.state.recruitment.recruitmentDetail
      } catch (error) {
        console.error('加载招新活动详情失败:', error)
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
.recruitment-detail {
  padding: 20px;
}

.recruitment-info {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.recruitment-info p {
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
</style>