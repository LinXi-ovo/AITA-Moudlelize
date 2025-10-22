<template>
  <div class="data-export">
    <div class="export-options">
      <button 
        @click="exportData('excel')" 
        class="btn btn-primary"
        :disabled="exporting"
      >
        导出Excel
      </button>
      <button 
        @click="exportData('csv')" 
        class="btn btn-secondary"
        :disabled="exporting"
      >
        导出CSV
      </button>
      <button 
        @click="exportData('pdf')" 
        class="btn btn-info"
        :disabled="exporting"
      >
        导出PDF
      </button>
    </div>
    
    <div v-if="exporting" class="export-progress">
      <p>正在导出数据，请稍候...</p>
    </div>
    
    <div v-if="exportResult" class="export-result" :class="{ success: exportResult.status === 'success', error: exportResult.status === 'failed' }">
      <p>{{ exportResult.message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataExport',
  props: {
    data: {
      type: Array,
      required: true
    },
    filename: {
      type: String,
      default: 'export'
    },
    title: {
      type: String,
      default: '导出数据'
    }
  },
  data() {
    return {
      exporting: false,
      exportResult: null
    }
  },
  methods: {
    async exportData(format) {
      if (this.exporting) return
      
      this.exporting = true
      this.exportResult = null
      
      try {
        let result
        
        switch (format) {
          case 'excel':
            result = await this.$store.dispatch('export/exportToExcel', {
              data: this.data,
              filename: `${this.filename}.xlsx`
            })
            break
          case 'csv':
            result = await this.$store.dispatch('export/exportToCSV', {
              data: this.data,
              filename: `${this.filename}.csv`
            })
            break
          case 'pdf':
            result = await this.$store.dispatch('export/exportToPDF', {
              data: this.data,
              filename: `${this.filename}.pdf`,
              title: this.title
            })
            break
          default:
            throw new Error('不支持的导出格式')
        }
        
        this.exportResult = {
          status: result.status,
          message: result.status === 'success' ? '导出成功！' : '导出失败，请重试'
        }
      } catch (error) {
        console.error('导出失败:', error)
        this.exportResult = {
          status: 'failed',
          message: `导出失败: ${error.message}`
        }
      } finally {
        this.exporting = false
      }
    }
  }
}
</script>

<style scoped>
.data-export {
  margin: 20px 0;
}

.export-options {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 10px;
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

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.export-progress {
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-align: center;
}

.export-result {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.export-result.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.export-result.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>