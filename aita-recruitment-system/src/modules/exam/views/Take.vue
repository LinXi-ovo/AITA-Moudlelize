<template>
  <div class="exam-take">
    <h2>参加笔试 - {{ exam ? exam.title : '加载中...' }}</h2>
    
    <div v-if="exam && exam.questions">
      <div class="exam-header">
        <p><strong>考试时长:</strong> {{ exam.duration }} 分钟</p>
        <p><strong>题目数量:</strong> {{ exam.questions.length }} 题</p>
      </div>
      
      <div class="timer">
        <p>剩余时间: {{ formatTime(remainingTime) }}</p>
      </div>
      
      <div class="questions">
        <div 
          class="question" 
          v-for="(question, index) in exam.questions" 
          :key="question.id"
        >
          <h3>第 {{ index + 1 }} 题</h3>
          <p><strong>{{ question.question }}</strong></p>
          
          <div v-if="question.type === 'multiple-choice'" class="options">
            <div 
              v-for="(option, optionIndex) in question.options" 
              :key="optionIndex"
              class="option"
              :class="{ selected: userAnswers[question.id] === optionIndex }"
              @click="selectOption(question.id, optionIndex)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + optionIndex) }}.</span>
              <span class="option-text">{{ option }}</span>
            </div>
          </div>
          
          <div v-else-if="question.type === 'short-answer'" class="short-answer">
            <textarea 
              v-model="userAnswers[question.id]" 
              placeholder="请输入您的答案..."
              rows="4"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="actions">
        <button @click="submitExam" class="btn btn-primary">提交试卷</button>
        <button @click="saveProgress" class="btn btn-secondary">保存进度</button>
      </div>
    </div>
    
    <div v-else-if="loading">
      <p>加载中...</p>
    </div>
    
    <div v-else>
      <p>无法加载考试信息</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TakeExam',
  data() {
    return {
      examId: null,
      exam: null,
      userAnswers: {},
      remainingTime: 0,
      timer: null,
      loading: true
    }
  },
  async mounted() {
    this.examId = this.$route.params.id
    await this.loadExam()
    this.startTimer()
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    async loadExam() {
      try {
        await this.$store.dispatch('exam/fetchExamById', this.examId)
        this.exam = this.$store.state.exam.examDetail
        this.remainingTime = this.exam.duration * 60 // 转换为秒
        this.loading = false
      } catch (error) {
        console.error('加载考试信息失败:', error)
        this.loading = false
      }
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--
        } else {
          this.submitExam()
        }
      }, 1000)
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },
    selectOption(questionId, optionIndex) {
      this.$set(this.userAnswers, questionId, optionIndex)
    },
    saveProgress() {
      // 保存进度逻辑
      alert('进度已保存')
    },
    submitExam() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      
      // 计算得分逻辑
      let score = 0
      if (this.exam && this.exam.questions) {
        this.exam.questions.forEach(question => {
          if (question.type === 'multiple-choice') {
            if (this.userAnswers[question.id] === question.correctAnswer) {
              score++
            }
          }
        })
      }
      
      alert(`考试结束！您的得分: ${score}/${this.exam ? this.exam.questions.length : 0}`)
      this.$router.push('/exams')
    }
  }
}
</script>

<style scoped>
.exam-take {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.exam-header {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.exam-header p {
  margin: 5px 0;
}

.timer {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #dc3545;
}

.questions {
  margin-bottom: 30px;
}

.question {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.question h3 {
  margin-top: 0;
}

.options {
  margin-top: 10px;
}

.option {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.option:hover {
  background-color: #e9ecef;
}

.option.selected {
  background-color: #42b983;
  color: white;
  border-color: #42b983;
}

.option-letter {
  font-weight: bold;
  margin-right: 10px;
}

.short-answer textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: inherit;
}

.actions {
  text-align: center;
}

.btn {
  padding: 10px 20px;
  margin: 0 10px;
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

.btn-secondary {
  background-color: #6c757d;
  color: white;
}
</style>