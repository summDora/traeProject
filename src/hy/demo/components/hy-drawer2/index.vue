<template>
  <el-dialog
    v-bind="$attrs"
    v-on="$listeners"
    ref="drawer"
    class="hy-drawer"
    :visible.sync="drawer"
    :show-close="false"
    :width="drawerSize"
    :before-close="beforeClose"
    :direction="direction"
    :fullscreen="fullscreen"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    @opened="opened"
  >
    <template #title>
      <div class="title-box">
        <slot name="title">
          <h1 class="title">{{ title }}</h1>
        </slot>
        <div class="icons">
          <i class="iconfont icon-tool_full full" @click="fullscreen = !fullscreen"></i>
          <i v-if="showClose" class="iconfont icon-tool_close2 close" @click="close"></i>
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
  name: 'HyDrawer2',
  props: {
    isFull: {
      // 是否铺满内容区
      type: Boolean,
      default: true
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
      fullscreen: false
    }
  },
  watch: {
    show: {
      handler(bool) {
        this.drawer = bool
      },
      immediate: true
    },
    drawer(bool) {
      this.$emit('update:show', bool)
    }
  },
  methods: {
    opened() {
      this.$emit('opened')
    },
    closeDrawer() {
      this.$emit('update:show', false)
    },
    close() {
      this.isIntercept = false
      this.closeDrawer()
      this.isIntercept = true
    }
  }
}
</script>

<style scoped lang="scss">
.hy-drawer {
  & >>> .el-dialog {
    resize: both;
    overflow: auto;
    min-height: 300px;
    /* background-color: #ffffff; */
    position: relative;

    &.is-fullscreen {
      & .senior-query-types-scroll {
        height: inherit;
      }
    }
  }

  & >>> .el-dialog__header {
    padding: 15px;

    & i {
      font-size: 20px;
      color: rgba(67, 66, 93, 0.5);
    }
  }

  & >>> .el-dialog__body {
    padding: 34px 70px 50px;
  }

  & >>> .senior-query-types-scroll {
    height: 400px;
  }

  & .scrollBox {
    padding-bottom: 20px;
    box-sizing: border-box;
  }

  & >>> :focus {
    outline: 0;
  }

  & .title-box {
    & .icons {
      position: absolute;
      top: 15px;
      right: 15px;

      & > i {
        margin-left: 25px;
        cursor: pointer;
        font-size: 12px;
        color: rgba(67, 66, 93, 0.5);

        &.close {
          font-size: 22px;
        }
      }
    }

    & h1.title {
      color: rgba(67, 66, 93, 1);
      font-size: 22px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 1;

      &.center {
        text-align: center;
      }
    }
  }
}
</style>

<style lang="scss">
/* 大留白弹框22 */
.blank-drawer {
  & .el-dialog {
    padding: 0 60px 60px;

    & .el-dialog__header {
      padding: 60px 20px 50px;
    }

    & .el-dialog__body {
      padding: 0;
    }
  }
}
</style>
