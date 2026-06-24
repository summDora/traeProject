<template>
  <el-dialog v-bind="$attrs" v-on="$listeners" ref="drawer" class="hy-drawer" :visible.sync="drawer" :show-close="false" :width="drawerSize" :before-close="beforeClose" :direction="direction" :fullscreen="fullscreen" :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape" :destroy-on-close="destroyOnClose" @opened="opened">
    <template #title>
      <div class="title-box">
        <slot name="title">
          <h1 class="title">{{ title }}</h1>
        </slot>
        <div class="icons">
          <span>{{ rightTitle }}</span>
          <i class="iconfont icon-tool_full full" v-if="isFull" @click="handleToogleFull"></i>
          <i v-if="showClose" class="iconfont icon-tool_close2" @click="close"></i>
        </div>
      </div>
    </template>
    <template v-if="destroyOnClose">
      <slot v-if="show"></slot>
    </template>
    <slot v-else></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'HyDialog',
  props: {
    isFull: {
      // 是否默认全屏
      type: Boolean,
      default: false
    },
    showClose: {
      // 是否显示右上角X
      type: Boolean,
      default: true
    },
    size: {
      // 大小 isFull=true时不生效
      type: [String, Number],
      default: '75%'
    },
    show: {
      // 显示/隐藏
      type: Boolean,
      default: true
    },
    title: {
      // 标题
      type: String
    },
    beforeClose: {
      // 关闭弹框前的回调
      type: Function
      /*default (done) {
          if (!this.$parent.isIntercept) {
            return done()
          }
          this.$confirm('关闭后内容不会保存，是否关闭？')
            .then(_ => {
              done()
            })
            .catch(_ => {})
        }*/
    },
    destroyOnClose: {
      // 控制是否在关闭 Drawer 之后将子元素全部销毁
      type: Boolean,
      default: true
    },
    direction: {
      // 打开的方向
      type: String,
      default: 'rtl'
    },
    rightTitle: {
      // 标题
      type: String
    },
    showRT: {
      // 是否显示右侧副title
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: false
    },
    closeOnClickModal: {
      // 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawer: true,
      isIntercept: true,
      drawerSize: this.size,
      fullscreen: this.isFull
    };
  },
  watch: {
    show: {
      handler(bool) {
        this.drawer = bool;
      },
      immediate: true
    },
    drawer(bool) {
      this.$emit('update:show', bool);
    }
  },
  methods: {
    opened() {
      this.$emit('opened');
    },
    closeDrawer() {
      // this.$refs.drawer.closeDrawer()
      this.$emit('update:show', false);
    },
    close() {
      this.isIntercept = false;
      this.closeDrawer();
      this.isIntercept = true;
    },
    handleToogleFull() {
      this.fullscreen = !this.fullscreen;
      this.$emit('full-change');
    }
  }
};
</script>

<style scoped lang="scss">
.hy-drawer {
  & >>> .el-dialog {
    resize: both;
    overflow: auto;
    min-width: 300px;
    min-height: 300px;
    background: #f5f5f7;
  }

  & >>> .el-dialog__header {
    padding: 15px;

    & i {
      font-size: 20px;
      color: var(--text-color-5);
    }
  }

  & >>> .el-dialog__body {
    padding: 34px 20px 50px;
  }

  & .scrollBox {
    padding-bottom: 20px;
    box-sizing: border-box;
  }

  & >>> :focus {
    outline: 0;
  }

  & .title-box {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & .icons {
      & > i {
        margin-left: 25px;
        cursor: pointer;
        font-size: 12px;
        color: var(--text-color-5);
      }
      & .icon-tool_close2 {
        font-size: 23px;
      }
    }

    & h1.title {
      display: inline-block;
      font-size: 28px;
      font-weight: 600;
      color: var(--text-color);
      margin: 2%;
    }
  }
}
</style>
