import Vue from 'vue'
import Vuex from 'vuex'
import user from '@/modules/user/store'
import recruitment from '@/modules/recruitment/store'
import exam from '@/modules/exam/store'
import interview from '@/modules/interview/store'
import evaluation from '@/modules/evaluation/store'
import statistics from '@/modules/statistics/store'
import auth from '@/modules/auth/store'
import notification from '@/modules/notification/store'
import file from '@/modules/file/store'
import exportModule from '@/modules/export/store'
import feedback from '@/modules/feedback/store'
import log from '@/modules/log/store'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user,
    recruitment,
    exam,
    interview,
    evaluation,
    statistics,
    auth,
    notification,
    file,
    export: exportModule,
    feedback,
    log
  }
})