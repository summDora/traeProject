/**
 * 按需注册 demo 页面使用的全局组件
 */
import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import hyProjectForm from './components/hyProjectForm/index.vue'
import hyNewButtons from './components/hyNewButtons/index.vue'
import newTable from './components/newTable.vue/index.vue'
import hyNewModal from './components/hyNewModal/index.vue'
import hyModal from './components/hyModal/index.vue'
import hyNewTable from './components/hyNewTable/index.vue'
import hyNewForm from './components/hyNewForm/index.vue'
import hySelectTree from './components/hySelectTree/index.vue'
import hyTree from './components/hyTree/index.vue'
import globalHyModal from './GlobalComponent/hyModal.vue'
import ThePagination from './GlobalComponent/ThePagination.vue'
import colorTitle from './GlobalComponent/colorTitle.vue'
import xuqiuPageHeader from '../xuqiu/components/xuqiuPageHeader.vue'

const components = [
  hyProjectForm,
  hyNewButtons,
  newTable,
  hyNewModal,
  hyModal,
  hyNewTable,
  hyNewForm,
  hySelectTree,
  hyTree,
  globalHyModal,
  ThePagination,
  colorTitle,
  xuqiuPageHeader
]

components.forEach((ctrl) => {
  if (!ctrl || !ctrl.name) return
  const componentName = upperFirst(
    camelCase(ctrl.name.split('/').pop().replace(/\.\w+$/, ''))
  )
  Vue.component(componentName, ctrl)
})
