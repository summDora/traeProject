import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
const componentsContext = require.context('../components', true, /\index.vue$/) //index.vue为组件入口
// const componentsContext1 = require.context('../newComponents', true, /\.vue$/) //index.vue为组件入口
// console.log(componentsContext1.keys(), 'componentsContext1')
// console.log(componentsContext.keys(), 'componentsContext1')

componentsContext.keys().forEach(fileName => {
  // 获取组件配置
  const componentConfig = componentsContext(fileName)
  /**
   * 兼容 import export 和 require module.export 两种规范
   */
  // 获取组件的 PascalCase 命名
  const ctrl = componentConfig.default || componentConfig
  const componentName = upperFirst(
    camelCase(
      // 获取组件注册名
      ctrl.name
        .split('/')
        .pop()
        .replace(/\.\w+$/, '')
    )
  )
  Vue.component(componentName, ctrl)
})