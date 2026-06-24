<template>
  <div class="xuqiu-page-header">
    <div class="xuqiu-page-header-left">
      <colorTitle :colortext="title" />
      <div v-if="subTitle" class="xuqiu-page-sub-title">{{ subTitle }}</div>
    </div>
    <div v-if="showBack" class="xuqiu-page-header-action">
      <slot name="action">
        <el-button size="small" @click="$emit('back')">返回</el-button>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'xuqiuPageHeader',

  props: {
    title: {
      type: String,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    showBack: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="less">
.xuqiu-page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.xuqiu-page-header-left {
  flex: 1;
  min-width: 0;
}

.xuqiu-page-sub-title {
  margin: -4px 0 0 14px;
  padding: 0 12px 12px;
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

.xuqiu-page-header-action {
  flex-shrink: 0;
  padding: 12px 12px 0 0;
}
</style>
