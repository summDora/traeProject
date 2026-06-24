

<template>
  <div style="height: 10rem">
    <el-row class="coler" style="margin: -20px 1rem 1rem; border: 2px solid rgb(111, 174, 168); border-radius: 3px">
      <el-col :span="9" class="coler">
        <div
          class="coler"
          style="width: 100%; height: 100%; background: var(--Light-Vis-Vg---hi-vis-vg6, linear-gradient(153deg, #49b2bd 16.67%, #3085b5 100%))"
        >
          <el-row class="coler">
            <el-col :span="8" class="coler" style="display: flex">
              <div class="normalOne">
                <!-- <img src="../../images/xiangmu/df.png" alt="" style="width: 3.5rem" /> -->
                <div>
                  <div class="number">{{ colortext.projectAvgScore || 0 }}</div>
                  <div class="text">项目平均分</div>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="coler" style="display: flex; align-items: center">
              <!-- <img src="../../images/xiangmu/zbkbj.png" alt="" style="position: absolute" /> -->
              <div>
                <div style="margin: 10px">
                  <span class="text"> 一般项目:</span>
                  <span class="text"> {{ colortext.generalProjectAvgScore || 0 }}</span>
                </div>
                <div>
                  <span class="text"> 数据工程项目:</span>
                  <span class="text"> {{ colortext.dataProjectAvgScore || 0 }}</span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="coler" style="display: flex">
              <div class="normalOne">
                <!-- <img src="../../images/xiangmu/bg.png" alt="" style="width: 4.5rem" /> -->
                <div>
                  <div class="number">{{ colortext.appraiseReportNum || 0 }}</div>
                  <div class="text">评价报告总数</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="15" class="coler">
        <el-row class="coler" type="flex" justify="space-around">
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #009a964d 0%, #009a961a 100%)">
              <!-- <img src="../../images/xiangmu/kf.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ colortext.developmentQualityScore || 0 }}</div>
                <div class="text1">{{ colortext.scoreColumns.find(i => i.code === 'DEVELOPMENT_QUALITY').name }}</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #ff8f2e4d 0%, #ff8f2e1a 100%)">
              <!-- <img src="../../images/xiangmu/yx.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ colortext.operationStandardScore || 0 }}</div>
                <div class="text1">{{ colortext.scoreColumns.find(i => i.code === 'OPERATION_STANDARD').name }}</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #4fb2e54d 0%, #4fb2e51a 100%)">
              <!-- <img src="../../images/xiangmu/sy.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ colortext.practicalEffectScore || 0 }}</div>
                <div class="text1">{{ colortext.scoreColumns.find(i => i.code === 'PRACTICAL_EFFECT').name }}</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #6d80ff4d 0%, #6d80ff1a 100%)">
              <!-- <img src="../../images/xiangmu/gx.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ colortext.shareBenefitScore || 0 }}</div>
                <div class="text1">{{ colortext.scoreColumns.find(i => i.code === 'SHARE_BENEFIT').name }}</div>
              </div>
            </div>
          </el-col>
          <el-col class="coler" style="display: flex">
            <div class="normalOne1" style="background: linear-gradient(90deg, #ff6d914d 0%, #ff6d921a 100%)">
              <!-- <img src="../../images/xiangmu/zd.png" alt="" style="width: 5rem" /> -->
              <div>
                <div class="number1">{{ colortext.economicBenefitScore || 0 }}</div>
                <div class="text1">{{ colortext.scoreColumns.find(i => i.code === 'ECONOMIC_BENEFIT').name }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
  <script>
export default {
  name: 'colorXiangMu',
  props: {
    colortext: {
      type: Object,
      default: () => {
        return {
          //   "projectAvgScore": 总平均分,
          // "generalProjectAvgScore": 一般项目平均分,
          // "dataProjectAvgScore": 数据工程项目平均分,
          // "appraiseReportNum": 评价报告数量,
          // "developmentQualityScore": 开发质量平均分,
          // "operationStandardScore": 运行水平平均分,
          // "practicalEffectScore": 实用效果平均分,
          // "shareBenefitScore": 共享效益平均分,
          // "economicBenefitScore": 经济效益平均分
          appraiseReportNum: 0,
          dataProjectAvgScore: 0,
          developmentQualityScore: 0,
          economicBenefitScore: 0,
          generalProjectAvgScore: 0,
          operationStandardScore: 0,
          practicalEffectScore: 0,
          projectAvgScore: 0,
          shareBenefitScore: 0,
        }
      },
    },
  },

  data() {
    return {
      activeName: ['1'],
    }
  },
  computed: {
    showContent() {
      return this.activeName.includes('1')
    },
  },
  watch: {
    activeName(val) {
      console.log(this.colortext, 999999999)
    },
  },
  created() {},
  methods: {
    clickcontent() {
      this.activeName = ['2']
    },
  },
}
</script>
  <style scoped lang="less">
.coler {
  height: 100%;
}
.number {
  font-size: 32px;
  color: white;
  font-family: system-ui;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.text {
  font-size: 15px;
  color: white;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.normalOne {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.number1 {
  font-size: 24px;
  color: black;
  font-family: emoji;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}
.text1 {
  font-size: 14px;
  color: #00000080;
  font-family: 'PingFang SC';
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}
.normalOne1 {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 95%;
  margin: auto;
  height: 60%;
  border-radius: 5px;
}
</style>
  