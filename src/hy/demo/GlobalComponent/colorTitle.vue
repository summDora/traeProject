

<template>
  <div class="page-header-bar" v-if="normal">
    <div class="page-header-bar-title">
      <span></span>
      <h2>{{ colortext }}<b></b><b id="peddingEle"></b></h2>
    </div>
  </div>
  <div v-else class="page-header-bar1">
    <h2>{{ colortext }}</h2>
  </div>
</template>
  <script>
export default {
  name: 'colorTitle',
  props: {
    colortext: {
      type: String,
      default: () => '',
    },
    normal: {
      type: Boolean,
      default: () => true,
    },
  },
  data() {
    return {}
  },

  created() {},
  methods: {},
}
</script>
  <style scoped lang="less">
.page-header-bar1 h2 {
  font-size: 16px;
  color: #007873;
  line-height: 32px;
  font-weight: bold;
}
.page-header-bar {
  margin: -12px;
  margin-bottom: 12px;
  padding: 12px 12px 12px 12px;
  border-bottom: 1px solid #e6e6e6;
}
.page-header-bar-title {
  font-size: 14px;
}
.page-header-bar-title > span {
  float: left;
  display: block;
  width: 4px;
  height: 24px;
  margin-right: 10px;
  margin-top: 4px;
  background-color: #007873;
}
.page-header-bar-title h2 {
  font-size: 20px;
  color: #007873;
  line-height: 32px;
  font-weight: bold;
}
.page-header-bar-title h2 b {
  color: #555;
  font-size: 12px;
  font-weight: 400;
  margin-left: 12px;
}
</style>
  