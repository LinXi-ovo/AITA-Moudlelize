<template>
  <div>
    <slot v-if="hasPermission"></slot>
    <div v-else class="no-permission">
      <p>您没有权限访问此功能</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PermissionCheck',
  props: {
    permission: {
      type: String,
      required: true
    }
  },
  computed: {
    hasPermission() {
      return this.$store.getters['auth/hasPermission'](this.permission)
    }
  }
}
</script>

<style scoped>
.no-permission {
  padding: 20px;
  text-align: center;
  color: #6c757d;
}
</style>