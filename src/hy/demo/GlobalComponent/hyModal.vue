<template>
  <div>
    <el-dialog
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :width="width"
      :before-close="closeHandle"
      :top="modalTop"
      :modal-append-to-body="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="appendToBody"
      :class="inClass"
      :style="inStyle"
      :show-close="showClose"
      v-dialogDrag
    >
      <div slot="title" class="dialog-header">
        <div v-text="title" class="dialog-header__title"></div>
        <div class="icon-fangda iconfont el-dialog__enlarge" v-if="enlarge"></div>
      </div>
      <slot></slot>
      <div slot="footer" class="dialog-footer" v-if="ifCancle || ifSure || ifCustom">
        <el-button @click="closeHandle" v-if="ifCancle">取 消</el-button>
        <el-button type="primary" v-if="ifSure" @click="sureHandle">确 定</el-button>
        <el-button type="primary" v-if="ifCustom" @click="customHandle">{{ customText }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 必填
 * @param { dialogVisible } 弹窗是否显示
 * @function closeHandle 关闭事件
 * @function sureHandle 确定事件
 */
/**
 * 选填
 * @param { title } 标题
 */
export default {
  name: 'hyModal',

  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    ifCancle: {
      type: Boolean,
      default: () => false,
    },
    ifSure: {
      type: Boolean,
      default: () => false,
    },
    ifCustom: {
      type: Boolean,
      default: () => false,
    },
    customText: {
      type: String,
      default: () => '',
    },
    title: {
      type: String,
      default: () => '',
    },
    modalTop: {
      type: String,
      default: () => '4rem',
    },
    width: {
      type: String,
      default: () => '600px',
    },
    appendToBody: {
      type: Boolean,
      default: () => true,
    },
    inClass: {
      type: String,
      default: () => '',
    },
    inStyle: {
      type: String,
      default: () => '',
    },
    enlarge: {
      type: Boolean,
      default: () => false,
    },
    showClose: {
      type: Boolean,
      default: () => true,
    },
  },

  data() {
    return {}
  },

  methods: {
    closeHandle() {
      this.$emit('closeHandle')
    },
    sureHandle() {
      this.$emit('sureHandle')
    },
    customHandle() {
      this.$emit('customHandle')
    },
  },
}
</script>

<style scoped lang="less">
/* .dialog-footer {
  margin: 0px auto;
  display: flex;
  justify-content: center;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.dialog-header__title {
  font-size: 20px;
  color: #fff;
}

.el-dialog__enlarge {
  font-size: 13px;
  cursor: pointer;
  color: #ffffff;
  margin: 2px 26px 0 0;
  display: flex;
  align-items: center;
} */
.dialog-header__title {
  font-size: 20px;
  color: #007873;
  line-height: 32px;
  font-weight: bold;
}
.dialog-header {
  margin: -12px;
  margin-bottom: 12px;
  padding: 12px 12px 12px 12px;
  border-bottom: 1px solid #e6e6e6;
  div::before {
    content: '';
    float: left;
    display: block;
    width: 4px;
    height: 24px;
    margin-right: 10px;
    margin-top: 4px;
    background-color: #007873;
  }
}
/deep/ .el-dialog__body {
  max-height: calc(100vh - 240px + 2rem);
  overflow: auto;
}
/* .el-dialog__wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
} */
</style>
