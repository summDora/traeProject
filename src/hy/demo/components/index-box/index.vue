<template>
  <div class="indexBox">
    <div class="title">
      <span class="left-title">{{ title }}</span>
      <span class="view-more" @click="handleRightClick">{{ righttitle }}</span>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'indexBox',
  props: {
    //传入代码
    title: {
      type: String,
      default: ''
    },
    //传入代码
    righttitle: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleRightClick() {
      this.$emit('rightClick');
    }
  }
};
</script>

<style lang="scss" scoped>
.indexBox {
  font-family: Source Han Sans CN;
  margin-bottom: 60px;
  & .content {
    background: #ffffff;
    box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.07);
    border-radius: 4px;
    margin-top: 20px;
    padding: 32px 20px 28px 32px;
  }
}
.title {
  display: flex;
  justify-content: space-between;
}

.left-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 27px;
  color: #43425d;
}
.left-title::before {
  content: '';
  width: 3px;
  height: 18px;
  border-left: 3px solid #43a0ff;
  margin-right: 10px;
}
.view-more {
  font-size: 14px;
  font-weight: bold;
  line-height: 30px;
  color: #43a0ff;
  cursor: pointer;
}
</style>
