import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import mCopy from './utils/mCopy'
import { installMApiFn } from './utils/mApiFn'
import './hy/demo/registerComponents'

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.m_copy = mCopy
installMApiFn(Vue)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
