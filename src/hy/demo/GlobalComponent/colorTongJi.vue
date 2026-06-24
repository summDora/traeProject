

<template>
  <div style="margin: 1rem; border: 2px solid #6faea8; border-radius: 3px; position: relative">
    <div style="width: 100%; min-height: 9rem">
      <div>
        <!-- tu -->
        <!-- <img src="../../images/mxgl.png" alt="" style="width: 6.5rem; position: absolute; bottom: 1rem; left: 3rem" /> -->
        <!--  -->

        <div class="one" style="left: 15rem">
          <div>
            <span style="color: #f1bb4f" class="four"> {{ colortext.countNum }}</span>
            <span class="two">个</span>
          </div>
          <div class="three">模型数量</div>
        </div>
        <div class="one" style="left: 25rem">
          <div>
            <span style="color: #6fd195" class="four"> {{ colortext.activeNum }}</span>
            <span class="two">个</span>
          </div>
          <div class="three">启用</div>
        </div>
        <div class="one" style="left: 35rem">
          <div>
            <span style="color: #f1894f" class="four"> {{ colortext.usedNum }}</span>
            <span class="two">个</span>
          </div>
          <div class="three">模型启用应用次数</div>
        </div>
      </div>
    </div>
    <!-- </el-collapse-item>
    </el-collapse> -->
  </div>
</template>
  <script>
export default {
  name: 'colorTongJi',
  props: {
    colortext: {
      type: Object,
      default: () => {
        return {
          activeNum: 0,
          countNum: 0,
          usedNum: 0,
          //   "countNum": 总数,
          // "activeNum": 启用数量,
          // "usedNum": 引用数量
        }
      },
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
/deep/ .el-collapse-item__header {
  // background-color: #fafafa;
  /* background-image: url('../../images/mxgl2.jpg'); */
}
/deep/ .el-collapse-item__content {
  // background-color: #fafafa;
  /* background-image: url('../../images/mxgl2.jpg'); */
}
.one {
  position: absolute;
  bottom: 2rem;
}
.two {
  font-size: 16px;
  margin-left: 5px;
  font-family: Pingfang SC;
}
.three {
  font-family: Pingfang SC;
  font-size: 16px;
}
.four {
  font-family: Helvetica Neue;
  font-size: 27px;
}
</style>
  