import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isInternet: false,
    fusionVersion: false,
    userId: 'mock-user-id'
  }
})
