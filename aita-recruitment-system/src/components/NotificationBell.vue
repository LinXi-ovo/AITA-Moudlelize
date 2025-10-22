<template>
  <div class="notification-container">
    <div class="notification-bell" @click="toggleNotifications">
      <span class="bell-icon">🔔</span>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </div>
    
    <div v-if="showNotifications" class="notifications-dropdown">
      <div class="notifications-header">
        <h3>通知</h3>
        <button 
          v-if="unreadCount > 0" 
          @click="markAllAsRead" 
          class="btn btn-small btn-secondary"
        >
          全部标记为已读
        </button>
      </div>
      
      <div class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <div class="notification-meta">
              <span class="timestamp">{{ formatTime(notification.timestamp) }}</span>
              <span :class="['type-badge', notification.type]">
                {{ getTypeText(notification.type) }}
              </span>
            </div>
          </div>
          <button 
            @click.stop="removeNotification(notification.id)"
            class="close-btn"
          >
            ×
          </button>
        </div>
        
        <div v-if="notifications.length === 0" class="no-notifications">
          <p>暂无通知</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationBell',
  data() {
    return {
      showNotifications: false
    }
  },
  computed: {
    notifications() {
      return this.$store.getters['notification/allNotifications']
    },
    unreadCount() {
      return this.$store.state.notification.unreadCount
    }
  },
  methods: {
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
    },
    markAllAsRead() {
      this.$store.dispatch('notification/markAllAsRead')
    },
    removeNotification(notificationId) {
      this.$store.dispatch('notification/removeNotification', notificationId)
    },
    handleNotificationClick(notification) {
      if (!notification.read) {
        this.$store.dispatch('notification/markAsRead', notification.id)
      }
      
      // 根据通知类型跳转到相应页面
      if (notification.data) {
        switch (notification.data.type) {
          case 'interview':
            this.$router.push(`/interviews/${notification.data.interviewId}`)
            break
          case 'exam':
            this.$router.push(`/exams/${notification.data.examId}`)
            break
          case 'evaluation':
            this.$router.push(`/evaluations/${notification.data.evaluationId}`)
            break
        }
      }
      
      this.showNotifications = false
    },
    getTypeText(type) {
      const typeMap = {
        'info': '信息',
        'success': '成功',
        'warning': '警告',
        'error': '错误'
      }
      return typeMap[type] || type
    },
    formatTime(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString('zh-CN')
    }
  }
}
</script>

<style scoped>
.notification-container {
  position: relative;
}

.notification-bell {
  position: relative;
  cursor: pointer;
  padding: 10px;
}

.bell-icon {
  font-size: 20px;
}

.badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #dc3545;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 350px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
  max-height: 400px;
  display: flex;
  flex-direction: column;
}

.notifications-header {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.notifications-header h3 {
  margin: 0;
  font-size: 16px;
}

.btn-small {
  padding: 4px 8px;
  font-size: 12px;
}

.notifications-list {
  overflow-y: auto;
  flex: 1;
}

.notification-item {
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  cursor: pointer;
}

.notification-item:hover {
  background-color: #f8f9fa;
}

.notification-item.unread {
  background-color: #e9f7fe;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.notification-content p {
  margin: 0 0 10px 0;
  font-size: 13px;
  color: #666;
}

.notification-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
}

.type-badge {
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: bold;
}

.type-badge.info {
  background-color: #d1ecf1;
  color: #0c5460;
}

.type-badge.success {
  background-color: #d4edda;
  color: #155724;
}

.type-badge.warning {
  background-color: #fff3cd;
  color: #856404;
}

.type-badge.error {
  background-color: #f8d7da;
  color: #721c24;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  margin-left: 10px;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.no-notifications {
  padding: 30px;
  text-align: center;
  color: #999;
}
</style>