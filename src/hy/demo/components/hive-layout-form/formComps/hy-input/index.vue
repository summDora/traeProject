<template>
  <el-input v-if="isIntInput" v-bind="bindProps" v-on="events" :value="model[prop] | deseStr(deseFn, isDese)" class="hy-input" :type="inpType" autocomplete="off" :resize="resize" onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )" @input="handleInput">
    <span v-if="prefix" class="prefix" slot="prefix">{{ prefix }}</span>
    <span v-if="suffix" class="suffix" slot="suffix">{{ suffix }}</span>
    <span v-if="prepend" slot="prepend">{{ prepend }}</span>
    <span v-if="append" slot="append">{{ append }}</span>
  </el-input>
  <el-input v-else v-bind="bindProps" v-on="events" :value="model[prop] | deseStr(deseFn, isDese)" class="hy-input" :type="inpType" autocomplete="new-password" :resize="resize" @input="handleInput">
    <span v-if="prefix" class="prefix" slot="prefix">{{ prefix }}</span>
    <span v-if="suffix" class="suffix" slot="suffix">{{ suffix }}</span>
    <span v-if="prepend" slot="prepend">{{ prepend }}</span>
    <span v-if="append" slot="append">{{ append }}</span>
  </el-input>
</template>

<script>
/**
 * @param model {Object} 表单数据对象
 * @param prop {string} 表单域 model 字段
 * @param placeholder {string} 输入框占位文本
 * @param kind {string} 类型, text，textarea 和其他 原生 input 的 type 值
 * @param prefix {string} 输入框头部内容
 * @param suffix {string} 输入框尾部内容
 * @param prepend {string} 输入框前置内容
 * @param append {string} 输入框后置内容
 *
 * 其他属性同element Input Attributes
 * */

import mixin from '../mixin';

export default {
  name: 'HyInput',
  mixins: [mixin],
  props: {
    kind: {
      type: String,
      default: 'text'
    },
    prefix: String,
    suffix: String,
    prepend: String,
    append: String,
    resize: String,
    deseFn: [Function, String]
  },
  data() {
    return {
      inputEvents: [], // 输入事件回调,
      eventTimer: null, // 输入事件防抖延时器
      error: null // 报错信息
    };
  },
  computed: {
    // 是否是限制数字输入框
    isIntInput() {
      const { kind } = this;
      return kind === 'int' || kind === 'intstr';
    },
    // 输入框类型
    inpType() {
      const { kind } = this;
      if (this.isIntInput) return 'text';
      else return kind;
    },
    value() {
      return this.model[this.prop];
    }
  },
  methods: {
    // 输入框输入事件
    handleInput(val) {
      this.setValue(val);
    },
    /**
     * 监听输入框值执行回调函数
     * @param {Function} func 要执行的函数
     * @param {boolean} [useDebounce=true] 是否开启防抖功能
     */
    _onInputEvent(func) {
      this.inputEvents.push(func);
    },
    /**
     * 监听输入框值关闭脱敏状态
     */
    watchDecisionDese() {
      const watcher = this.registeredWatcher(val => {
        if (!val) {
          this.isDese = false;
          watcher();
        }
        return val;
      });
    },
    /**
     * 监听输入框值限制输入数字
     * @param {string} str 当前值
     */
    watchNum() {
      this.registeredWatcher(
        val => {
          if (!val) return;
          const { kind } = this;
          if (kind === 'int') {
            val = parseInt(val);
            if (isNaN(val)) val = '';
          }
          this.setValue(val);
        },
        { immediate: true }
      );
    },
    // 初始化监听所有限制
    initWatcher() {
      if (this.needDese) this.watchDecisionDese();
      if (this.isIntInput) this.watchNum();
    }
  },
  mounted() {
    this.initWatcher();
  }
};
</script>

<style scoped lang="scss">
.prefix {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  white-space: nowrap;
}

.hy-input {
  & >>> .el-input__suffix-inner i {
    position: absolute;
    right: 100%;
  }
}
</style>
