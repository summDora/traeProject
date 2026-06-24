<template>
  <el-drawer
    class="hy-drawer"
    :visible.sync="drawer"
    :show-close="showClose"
    :size="size"
    :title="title"
    :before-close="beforeClose"
    :destroy-on-close="destroyOnClose"
    :direction="direction"
    :wrapperClosable="wrapperClosable"
    @opened="opened"
  >
    <slot name="title" #title></slot>
    <el-scrollbar class="scrollBox">
      <slot></slot>
    </el-scrollbar>
  </el-drawer>
</template>

<script>
export default {
  name: 'HyDrawer',
  props: {
    showClose: {
      type: Boolean,
      default: false
    },
    size: {
      type: [String, Number],
      default: '30%'
    },
    show: {
      type: Boolean,
      default: true
    },
    title: {
      type: String
    },
    beforeClose: Function,
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    wrapperClosable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      drawer: true
    }
  },
  watch: {
    show: {
      handler(bool) {
        // this.$nextTick(() => {
        this.drawer = bool
        // })
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
    }
  }
}
</script>

<style lang="scss">
.hy-drawer {
  & .scrollBox {
    height: calc(100vh - 65px);
    padding-bottom: 20px;
    box-sizing: border-box;
  }
}
</style>
