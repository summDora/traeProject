<template>
  <div style="margin: 1rem; border: 2px solid #6faea8; border-radius: 3px">
    <div style="width: 100%; min-height: 9rem">
      <el-row :gutter="20" style="width: 100%">
        <el-col :span="8" class="mainCard">
          <div class="textPin" style="background: linear-gradient(90deg, #009a961f 0%, #009a960a 100%)">
            <!-- tu -->
            <!-- <img src="../../images/yijizb.png" alt="" style="width: 6rem" /> -->
            <!--  -->
            <div class="one">
              <div>
                <span style="color: #000000" class="four"> {{ colortext[0].countNum }}</span>
                <span class="two">个</span>
              </div>
              <div class="three">一级指标数量</div>
            </div>
            <div class="one" style="display: none;">
              <div>
                <span style="color: #3086f3" class="four"> {{ colortext[0].usedNum }}</span>
                <span class="two">个</span>
              </div>
              <div class="three">引用数量</div>
            </div>
            <div class="one">
              <div>
                <span style="color: #46aea9" class="four"> {{ colortext[0].activeNum }}</span>
              </div>
              <div class="three">启用数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" class="mainCard">
          <div class="textPin" style="background: linear-gradient(90deg, #ff8f2e2e 0%, #ff8f2e0f 100%)">
            <!-- tu -->
            <!-- <img src="../../images/erjizb.png" alt="" style="width: 6rem" /> -->
            <!--  -->
            <div class="one">
              <div>
                <span style="color: #000000" class="four"> {{ colortext[1].countNum }}</span>
                <span class="two">个</span>
              </div>
              <div class="three">二级指标数量</div>
            </div>
            <div class="one" style="display: none;">
              <div>
                <span style="color: #3086f3" class="four"> {{ colortext[1].usedNum }}</span>
                <span class="two">个</span>
              </div>
              <div class="three">引用数量</div>
            </div>
            <div class="one">
              <div>
                <span style="color: #46aea9" class="four"> {{ colortext[1].activeNum }}</span>
              </div>
              <div class="three">启用数量</div>
            </div>
          </div>
        </el-col>
        <el-col :span="8" class="mainCard">
          <div class="textPin" style="background: linear-gradient(90deg, #4fb2e54d 0%, #4fb2e51a 100%)">
            <!-- tu -->
            <!-- <img src="../../images/sanjizb.png" alt="" style="width: 6rem" /> -->
            <!--  -->
            <div class="one">
              <div>
                <span style="color: #000000" class="four"> {{ colortext[2].countNum }}</span>
                <span class="two">个</span>
              </div>
              <div class="three">三级指标数量</div>
            </div>
            <div class="one" style="display: none;">
              <div>
                <span style="color: #3086f3" class="four"> {{ colortext[2].usedNum }}</span>
                <span class="two">个</span>
              </div>
              <div class="three">引用数量</div>
            </div>
            <div class="one">
              <div>
                <span style="color: #46aea9" class="four"> {{ colortext[2].activeNum }}</span>
              </div>
              <div class="three">启用数量</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- </el-collapse-item>
    </el-collapse> -->
  </div>
</template>
<script>
export default {
  name: 'colorZhibiao',
  props: {
    colortext: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  data() {
    return {}
  },
  created() { },
  methods: {},
}
</script>
<style scoped lang="less">
/deep/ .el-collapse-item__header {
  background-color: #f5f7fa;
  // background-image: url('../../images/mxgl2.jpg');
}

/deep/ .el-collapse-item__content {
  background-color: #f5f7fa;
  // background-image: url('../../images/mxgl2.jpg');
}

.one {
  width: 33%;
  text-align: center;
  padding-top: 12px;
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

.textPin {
  display: flex;
  width: 95%;
  height: 6rem;
  bottom: 0.5rem;
  border-radius: 6px;
}

.mainCard {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>