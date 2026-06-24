import { omitBy, pickBy, lowerFirst } from 'lodash'

const reg = /on-?([a-zA-Z\-]+)/

export default {
  inheritAttrs: false,
  props: {
    type: String,
    model: Object, // 表单数据对象
    prop: String, // 表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的
    label: [String, Function], // 标签文本
    clearable: { // 是否可清空
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      defaultProps: { // 默认props
        value: 'value',
        label: 'label',
        disabled: 'disabled'
      }
    }
  },
  computed: {
    // 所有标签属性
    aps () {
      return { ...this.$attrs, ...this.$props }
    },
    // 除事件外的其他所有属性，即aps中非on开头的属性
    bindProps () {
      return omitBy(this.aps, this.isEvent)
    },
    // 所有事件，即aps中on开头的属性
    events () {
      let hasOnAps = pickBy(this.aps, this.isEvent)
      let events = {}
      for (let key in hasOnAps) {
        let eventName = key.replace(reg, (_, evtName) => lowerFirst(evtName))
        events[eventName] = hasOnAps[key]
      }
      return events
    },
    // 多选（checkBoxGroup、radioGroup、select）的props
    $_props () {
      return Object.assign({}, this.defaultProps, this.props)
    }
  },
  methods: {
    /**
     * 判断是不是 on 或者 on- +字母组成的字符串
     * @param {string} str 要判断的字符串
     * @returns {boolean}
     */
    isEvent (str) {
      return reg.test(str)
    },
    /**
     * 获取item的props
     * @param {Object} item
     * @param {boolean} v2l 是否将value的值赋给label
     * @returns {Object}
     */
    getItemProps (item, v2l = false) {
      const $_props = this.$_props
      let props = {}
      for(let key in $_props) {
        const val = item[$_props[key]]
        if (v2l && key === 'label') {
          props.label = item[$_props.value]
        } else {
          props[key] = val
        }
      }
      return props
    },
    /**
     * 获取item的value
     * @param item
     * @returns {*}
     */
    getItemValue (item) {
      const { value } = this.$_props
      return item[value]
    }
  }
}
