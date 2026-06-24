<template>
  <div class="hy-layout-form">
    <el-form v-bind="{ ...$attrs, ..._omit($props, 'config') }" v-on="$listeners" ref="form" :style="formStyle" @submit.native.prevent>
      <template v-for="(row, rowIdx) in config">
        <el-collapse v-if="row.type === 'arf'" :key="rowIdx" :value="row.title + rowIdx">
          <el-collapse-item :title="row.title" :name="row.title + rowIdx" accordion>
            <el-row v-for="arfItem in row.arr" :key="arfItem.id" class="row arf-row" type="flex" justify="space-between" align="middle">
              <el-col :span="23">
                <hy-layout-form v-bind="_omit(row, ['type', 'title', 'ref', 'rules'])" ref="arfForm" :model="arfItem" :rules="_getRules(row, arfItem)" :clearable="clearable" _isArf :_arfItem="arfItem" @arf-item-change="_arfChangeCb(row)"></hy-layout-form>
              </el-col>
              <i v-if="!row.noDel && (row.min == null || row.arr.length > row.min)" class="add-icon el-icon-close" @click="_handleDelArf(row, arfItem)"></i>
            </el-row>
            <hy-add-button v-if="!row.noAdd && (row.max == null || row.max > row.arr.length)" class="add-btn" @click="_handleAddArf(row)"></hy-add-button>
          </el-collapse-item>
        </el-collapse>
        <el-row v-else v-bind="_omit(row, ['cols', 'className', 'slot'])" :key="rowIdx" class="row" :class="row.className">
          <slot v-if="row.slot" :name="row.slot" :form="model"></slot>
          <el-col v-else v-for="(col, colIdx) in row.cols" v-bind="_omit(col, ['slot', 'className'])" :key="colIdx" :class="col.className">
            <el-form-item v-if="_haveComp(col)" v-bind="_omit(col, ['slot', 'className', 'label'])" v-setMinWidth :class="_getItemClass(col.type)" :label="_getItemLabel(col)" :rules="_getItemRules(col)">
              <slot v-if="col.slot" :name="col.slot" :form="model"></slot>
              <component v-else v-bind="_omit(col, ['slot', 'className'])" :model="model" :is="_getCompName(col.type)" :label="_getItemLabel(col)" :clearable="col.clearable === undefined ? clearable : col.clearable" :placeholder="_getPlaceholder(col)"></component>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <div v-if="cancel || test || confirm" class="handlers">
        <el-button v-if="cancel" class="btn cancel" type="info" @click="_handleCancel">{{ cancelText }}</el-button>
        <el-button v-if="test" class="btn test" type="success" @click="_handleTest">{{ testText }}</el-button>
        <el-button v-if="confirm" class="btn confirm" type="primary" @click="_handleConfirm">{{ confirmText }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
/**
   * @param model {Object} 表单数据对象(必须)
   * @param config {Array} 表单配置对象(必须)
   *  @example config: [
   *      {
   *        className: '', // el-row的class
            gutter: 20, // 行配置对象，支持el-row所有属性
            slot: '', // 作用域插槽名
            cols: [ // 列及表单配置，支持el-col + el-form-item + 表单控件 所有属性
              {
                className: '', // el-col的class
                span: 8,
                type: 'input',
                prop: 'aa',
                label: 'aa',
                suffix: '天'
              },
              {
                span: 8,
                type: 'select',
                prop: 'dd',
                label: 'dd',
                opts: [
                  {value: 'aa', label: 'AA'},
                  {value: 'bb', label: 'BB'}
                ]
              },
              {
                span: 8,
                slot: 'cc', // 作用域插槽名
                prop: 'cc',
                label: 'cc'
              }
            ]
          },
          {
            type: 'arf',// (array-form),可展开、新增、删除的
            title: '入参', // 标题
            arr: this.formData.params, // 表单遍历的数组
            ref: '', // 表单的ref
            // defaultForm: {dd: 1, ee: 2}, // 新增时的默认值，没有则为{}
            // min: 1, // 配置的最少个数，只有当arr.length>min才会显示删除
            config: [
              {
                gutter: 20,
                cols: [
                  {
                    span: 12,
                    type: 'input',
                    labelWidth: '55px',
                    prop: 'bb',
                    label: '参数1',
                  },
                  {
                    span: 12,
                    type: 'input',
                    labelWidth: '55px',
                    prop: 'cc',
                    label: '参数2',
                  }
                ]
              },
              {
                gutter: 20,
                cols: [
                  {
                    span: 12,
                    type: 'radio-group',
                    labelWidth: '55px',
                    prop: 'dd',
                    label: '参数3',
                    opts
                  },
                  {
                    span: 12,
                    type: 'switch',
                    labelWidth: '55px',
                    prop: 'ee',
                    label: '参数4'
                  }
                ]
              }
            ]
          }
   *    ]
   *
   *  @param cancel {boolean} 是否显示关闭按钮
   *  @param test {boolean} 是否显示测试按钮
   *  @param confirm {boolean} 是否显示保存按钮
   *  @param cancelText {string} 关闭按钮文本
   *  @param testText {string} 测试按钮文本
   *  @param confirmText {string} 保存按钮文本
   *
   *
   *  @event cancel {Function} 点击关闭按钮触发，会重置表单
   *  @event test {Function} 点击测试按钮触发
   *  @event confirm {Function} 点击测试按钮,校验通过后触发
   *
   *
   *  @method validate {Function} 对整个表单进行校验的方法
   *  @method validateField {Function} 对部分表单字段进行校验的方法
   *  @method resetFields {Function} 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
   *  @method clearValidate {Function} 移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
   */
import omit from 'lodash/omit';
import components from './formComps';

const testConfig = {
  title: '单元测试', // 标题
  list: null, // 入参列表
  listProp: 'ruleArgsList', // 列表key名， list为null时生效，使用this.model[listProp]
  showRenewBtn: true, // 是否显示重新测试按钮
  props: {
    name: 'name', // 键名
    example: 'example', // 值名
    required: 'required' // 是否必填
  },
  onClick: null, // 点击重新测试调用的方法
  result: '' // 测试结果
};

export default {
  name: 'HyLayoutForm',
  directives: {
    /**设置el-form-item__label最大最小宽，防止flex缩放；以及取消el-form-item__content默认的marginLeft*/
    setMinWidth(el) {
      const label = el.getElementsByClassName('el-form-item__label')[0];
      if (!label) return;
      const w = label.style.width;
      if (w) {
        label.style.minWidth = label.style.maxWidth = w;
        el.getElementsByClassName('el-form-item__content')[0].style.marginLeft = 0;
      }
    }
  },
  components: {
    ...components,
    TestDeawer: () => import('./TestDeawer')
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    config: {
      type: Array,
      required: true
    },
    cancel: {
      type: Boolean,
      default: false
    },
    test: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    cancelText: {
      type: String,
      default: '取 消'
    },
    testText: {
      type: String,
      default: '测 试'
    },
    confirmText: {
      type: String,
      default: '保 存'
    },
    _isArf: {
      // 是否是可展开表单，为真则不设置左右padding
      type: Boolean,
      default: false
    },
    isTestForm: {
      // 是否为入参，为真则会在点击测试时校验规则
      type: Boolean,
      default: false
    },
    testConfig: {
      // 测试弹框配置
      type: Object,
      default: () => testConfig
    },
    clearable: {
      type: Boolean,
      default: true
    },
    resetBeforeCancel: {
      type: Boolean,
      default: false
    },
    clearBeforeCancel: {
      type: Boolean,
      default: true
    },
    _arfItem: Object,
    handleShowTest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      compNames: Object.keys(components).map(v => v.substring(3)),
      testShow: false
    };
  },
  computed: {
    /**
     * 根据行配置中最大的gutter添加左右padding，防止横向滚动条
     * @returns {{paddingRight: string, paddingLeft: string}|null}
     */
    formStyle() {
      if (this._isArf) return {};
      const gutArr = this.config.map(v => v.gutter).filter(v => v);
      const w = Math.max(...gutArr, 0) / 2;
      if (w === 0) return null;
      const p = w + 'px';
      return {
        paddingLeft: p,
        paddingRight: p
      };
    },
    _testConfig() {
      return Object.assign({}, testConfig, this.testConfig);
    }
  },
  watch: {
    _arfItem: {
      handler(_arfItem) {
        this.$emit('arf-item-change', _arfItem);
      },
      deep: true
    }
  },
  methods: {
    _omit: omit,
    // 测试弹框关闭回调
    testClosed() {
      this.$emit('test-closed');
    },
    _arfChangeCb(row) {
      if (row.onChange) {
        row.onChange(row.arr);
      }
    },
    /*获取校验规则*/
    _getRules(row, item) {
      const { rules } = row;
      if (typeof rules === 'function') return rules(item);
      else return rules;
    },
    /** 获取标签 */
    _getItemLabel(col) {
      const { label } = col;
      if (typeof label === 'function') {
        if (this._isArf) return label(this._arfItem, col);
        else return label(model, col);
      } else {
        return label;
      }
    },
    /**获取必填校验文本*/
    _getRequiredItemErrMsg({ type, label, errMsg }) {
      const inpTypes = ['input', 'input-number'];
      if (inpTypes.includes(type)) var startText = '请输入';
      else var startText = '请选择';
      const message = errMsg ? errMsg : `${startText}${label}`;
      return { required: true, message, trigger: 'change' };
    },
    /**获取校验规则*/
    _getItemRules(col) {
      const { rules, required } = col;
      if (rules) return rules;
      if (required) return this._getRequiredItemErrMsg(col);
    },
    /* 获取填入的placeholder值 */
    _getPlaceholder(col) {
      const { placeholder } = col;
      if (typeof placeholder === 'function') return placeholder(this._arfItem);
      else return placeholder;
    },
    /**获取组件名*/
    _getCompName(name) {
      return `hy-${name}`;
    },
    /**根据type生成className*/
    _getItemClass(type) {
      const specificClass = ['input', 'select', 'date-picker', 'cascader'];
      if (specificClass.includes(type)) return 'line';
      else return '';
    },
    /**判断是否有这个组件*/
    _haveComp(col) {
      return col.slot || this.compNames.includes(col.type) || col.type === 'label';
    },
    /**点击取消按钮*/
    _handleCancel() {
      if (this.resetBeforeCancel) this.resetFieldsAll();
      else if (this.clearBeforeCancel) this.clearValidateAll();
      this.$emit('cancel');
    },
    /**点击保存按钮*/
    _handleConfirm() {
      this.validateAll()
        .then(() => {
          this.$emit('confirm');
        })
        .catch(_ => {});
    },
    /**显示测试弹框*/
    _showTestForm() {
      this.testShow = true;
    },
    /**点击测试按钮*/
    _handleTest() {
      this.validateTest()
        .then(() => {
          const { _showTestForm } = this;
          if (!this.handleShowTest) _showTestForm();
          this.$emit('test', _showTestForm);
        })
        .catch(_ => {});
    },
    /**对整个表单(不包括动态表单)进行校验的方法*/
    validate(...args) {
      return this.$refs.form.validate(...args);
    },
    /**对部分表单字段进行校验的方法*/
    validateField(...args) {
      return this.$refs.form.validateField(...args);
    },
    /**对整个表单(不包括动态表单)进行重置，将所有字段值重置为初始值并移除校验结果*/
    resetFields(...args) {
      return this.$refs.form.resetFields(...args);
    },
    /**移除(不包括动态表单)表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果*/
    clearValidate(...args) {
      return this.$refs.form.clearValidate(...args);
    },
    /**校验所有表单(包括动态表单)*/
    validateAll() {
      const arfs = this.$refs.arfForm || [];
      const verifys = arfs.map(f => f.validate());
      verifys.push(this.validate());
      return Promise.all(verifys);
    },
    /**校验测试表单*/
    validateTest() {
      const arfs = this.$refs.arfForm || [];
      const testVerifys = arfs.filter(f => f.isTestForm).map(f => f.validate());
      return Promise.all(testVerifys);
    },
    /**移除(包括动态表单)表单项的校验结果*/
    clearValidateAll() {
      const arfs = this.$refs.arfForm || [];
      const verifys = arfs.map(f => f.clearValidate());
      verifys.push(this.clearValidate());
      return Promise.all(verifys);
    },
    /**对整个表单(包括动态表单)进行重置，将所有字段值重置为初始值并移除校验结果*/
    resetFieldsAll() {
      const arfs = this.$refs.arfForm || [];
      const verifys = arfs.map(f => f.resetFields());
      verifys.push(this.resetFields());
      return Promise.all(verifys);
    },
    /**
     * 添加折叠面板中的一项
     * @param row {Object} 当前行配置信息
     * @private
     */
    _handleAddArf(row) {
      let defaultForm = row.defaultForm || {};
      row.arr.push(defaultForm);
      this.$emit('add-arf-item', row);
    },
    /**
     * 删除折叠面板中的一项
     * @param row 当前行配置
     * @param item 要删除的项
     * @private
     */
    _handleDelArf(row, item) {
      const { arr } = row;
      const idx = arr.findIndex(v => v === item);
      arr.splice(idx, 1);
      this.$emit('del-arf-item', row, item);
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.hy-layout-form {
  & .icontool_close {
    cursor: pointer;
    color: var(--text-color-3);
  }

  & .row {
    margin-bottom: 25px;

    &:last-of-type {
      margin-bottom: 0;
    }

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  & .arf-row {
    margin-top: 15px;
    margin-bottom: 0;
  }

  & .title {
    border-bottom: 1px dashed var(--text-color-2);
    font-size: 18px;
    font-weight: 400;
    color: var(--text-color);
    padding: 8px 0;
  }
  & >>> .el-input--suffix .el-input__inner {
    padding-right: 24px;
  }

  & >>> .el-collapse {
    border-top: none;

    & .el-collapse-item__header {
      background-color: transparent;
      border-bottom: 1px dashed var(--text-color-2);
      font-size: 18px;
      font-weight: 400;
      color: var(--text-color);
    }

    & .el-collapse-item__wrap {
      background-color: transparent;
      padding-right: 10px;
      border-bottom: none;
    }

    & .add-icon {
      font-size: 18px;
      color: var(--text-color-5);
      cursor: pointer;
    }

    & .add-btn {
      margin-top: 25px;
    }
  }

  & >>> .el-form-item {
    display: flex;
    margin: 0;
    width: 100%;

    & .el-form-item__label {
      white-space: nowrap;
      font-size: 14px;
      color: var(--text-color-5);
    }

    & .el-form-item__content {
      flex: 1 1 auto;
      max-width: 100%;

      & * {
        font-size: 14px;
      }

      & .iconfont {
        font-size: 18px;
        color: var(--text-color-5);
      }

      & .el-input__inner {
        background-color: transparent;
        color: var(--text-color);
      }
    }

    &.line {
      border-bottom: 1px solid rgba(225, 225, 229, 1);

      & .el-input__inner {
        border: none;
      }
    }
  }

  & .handlers {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;

    & .btn {
      width: 200px;

      & + .btn {
        margin-left: 30px;
      }

      &.test {
        background-color: #3b86ff;
        border-color: #3b86ff;
      }
    }
  }
}
</style>
