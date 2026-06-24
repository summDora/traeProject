<template>
  <el-select
    v-model="value"
    v-bind="bindProps"
    v-on="events"
    class="hy-select"
  >
    <el-option
      v-for="(item, idx) in opts"
      v-bind="getItemProps(item)"
      :key="idx"
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
      opts: Array, // 选项列表
      props:  Object, // 数据选项别名
      multiple: { // 是否多选
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        value: '', // 值
        unwatch: null, //取消监听器
      }
    },
    watch: {
      value (value) {
        this.watchValueSyncModel(value)
      },
    },
    created () {
      this.initWatched()
      this.unwatch = this.$watch(
        () => this.model[this.prop],
        value => {
          if (this.multiple) {
            this.value = this.getStrValue(value)
          } else {
            this.value = value
          }
        },
        { immediate: true }
      )
    },
    beforeDestroy() {
      this.unwatch && this.unwatch()
    }
  }
</script>

<style scoped>
  .hy-select {
    width: 100%;
  }
</style>
