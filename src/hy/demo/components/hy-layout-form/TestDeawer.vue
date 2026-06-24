<template>
  <div class="test-deawer">
    <hy-layout-form ref="form" :model="formData" :config="config" :rules="rules"></hy-layout-form>
    <div v-if="showRenewBtn" class="renew-test">
      <el-button type="primary" @click="handleRenewTest">测试</el-button>
    </div>
    <div class="result" :style="{ textAlign: textCenter ? 'center' : 'left' }">
      <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" readonly="readonly" :value="valueStr"> </el-input>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
export default {
  name: 'TestDeawer',
  props: {
    model: Object, // 表单数据对象
    list: Array, // 入参列表
    listProp: String, // 列表key名， list为null时生效，使用this.model[listProp]
    showRenewBtn: Boolean, // 是否显示重新测试按钮
    props: Object, // 键名
    onClick: Function, // 值名
    result: null, // 是否必填
    resultTitle: {
      type: String,
      default: '测试结果：'
    },
    textCenter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      rules: {},
      resultMsg: ''
    };
  },
  computed: {
    valueStr() {
      let { resultTitle, result } = this;
      result = typeof result === 'object' ? JSON.stringify(result) : result;
      return `${resultTitle}${result}`;
    },
    _list() {
      const { list } = this;
      const arr = list == null ? this.model[this.listProp] : list;
      const data = arr ? cloneDeep(arr) : [];
      return data;
    },
    data() {
      const data = this._list;
      this.initFormData(data);
      this.initRules(data);
      return data;
    },
    config() {
      const { name } = this.props;
      return this.data.map(v => ({
        cols: [
          {
            span: 24,
            type: 'input',
            prop: v[name],
            label: `入参：${v[name]}=`
          }
        ]
      }));
    }
  },
  watch: {
    formData: {
      handler(form) {
        const { name, example } = this.props;
        Object.entries(form).forEach(([key, value]) => {
          let item = this._list.find(val => val[name] === key);
          this.$set(item, example, value);
        });
      },
      deep: true
    }
  },
  methods: {
    // 初始化form
    initFormData(data) {
      const { name, example } = this.props;
      this.formData = data.reduce((prev, curr) => {
        prev[curr[name]] = curr[example];
        return prev;
      }, {});
    },
    // 初始化rules
    initRules(data) {
      const { name, required } = this.props;
      this.rules = data.reduce((prev, curr) => {
        prev[curr[name]] = [
          {
            required: curr[required],
            message: `请输入${curr[name]}`,
            trigger: 'blur'
          }
          // { min: 0, max: 400, message: '长度在 0 到 400 个字符', trigger: 'change' }
        ];
        return prev;
      }, {});
    },
    // 重新测试
    handleRenewTest() {
      this.$refs.form
        .validate()
        .then(() => {
          this.onClick && this.onClick(this._list, this.formData);
        })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="scss">
.test-deawer {
  & .renew-test {
    margin: 40px 0 30px;
    text-align: center;
  }

  & .result {
    font-size: 16px;
    line-height: 1.2;
    color: var(--primary-color);
    white-space: pre;
  }
}
</style>
