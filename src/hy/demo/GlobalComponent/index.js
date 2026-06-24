/**
 * @author SHUF
 * @date 2025-04-28 14:39:58
 * @Description 注册全局组件
 */

import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
const componentsContext = require.context('./', true, /\.vue$/) //index.vue为组件入口
const componentsContextNew = require.context('../components', true, /\index.vue$/) //index.vue为组件入口


componentsContext.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = componentsContext(fileName)
  //!  兼容 import export 和 require module.export 两种规范
  // 获取组件的 PascalCase 命名
  const ctrl = componentConfig.default || componentConfig
  const componentName = upperFirst(
    camelCase(
      ctrl.name
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(componentName, ctrl)
})

componentsContextNew.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = componentsContextNew(fileName)
  //!  兼容 import export 和 require module.export 两种规范
  // 获取组件的 PascalCase 命名
  const ctrl = componentConfig.default || componentConfig
  const componentName = upperFirst(
    camelCase(
      ctrl.name
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(componentName, ctrl)
})