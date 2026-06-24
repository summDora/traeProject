<template>
  <el-select
    v-model="model[prop]"
    v-bind="bindProps"
    v-on="events"
    class="hy-select"
  >
    <el-option
      v-for="item in opts"
      v-bind="getItemProps(item)"
      :key="getItemValue(item)"
    >
    </el-option>
  </el-select>
</template>

<script>
  /**
   * @param model {Object} 表单数据对象
   * @param prop {string} 表单域 model 字段
   * @param placeholder {string} 输入框占位文本
   * @param opts {Array} Option 选项列表
   * @param props {Object} opts
   */
  
  import mixin from '../mixin'

  // 默认props
  const props = {
    value: 'value',
    label: 'label',
    disabled: 'disabled'
  }
  
  export default {
    name: 'HySelect',
    mixins: [mixin],
    props: {
      opts: Array,
      props:  Object,
      multiple: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: "请选择"
      }
    },
    created () {
      if (this.multiple && !this.model[this.prop]) {
        // this.$set(this.model, this.prop, [])
      }
    }
  }
</script>

<style scoped>
  .hy-select {
    width: 100%;
  }
</style>
