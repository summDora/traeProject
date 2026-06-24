<template>
  <hyNewModal :dialogVisible="dialogVisible" :showClose="true" :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" :width="width" @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
    <div class="project-content">
      <div>需求编码：{{ rowData.projectCode }}</div>
      <div>需求名称：{{ rowData.projectName }}</div>
    </div>

    <!--yjlx='0':修改意见-->
    <div style="line-height:1;padding:1px 0"> 
    <el-collapse v-if="yjlx === '0'" class="opinion-box" @change="handleChange" v-model="opened">
      <div v-if="!dataList.length" class="opinion-content">暂无</div>

      <el-collapse-item v-else-if="dataList.length" v-for="(item, index) in dataList" :key="index" :name="index">
        <template slot="title">
          <i class="el-icon-caret-bottom" style="color: #298BF5" v-if="item.isActive === true"></i>
          <i class="el-icon-caret-top" style="color: #298BF5" v-else></i>
          <p>{{item.title}}</p>
        </template>

        <!--标题上方输入框展示-->
        <div class="inputBox" v-if="ifNeedInputBox">
          <!--evaluationType:0(技术组);evaluationType:1(财务组)-->
          <div class="opinion-info-box" >
            <div class="info-item" v-if="item.evaluationType==='0'||item.evaluationType==='1'">
              <span style="width: 30%;">专家结论：</span>
              <el-input v-model="item.reviewResult" :disabled="true" size="small" style="width: 70%;"></el-input>
            </div>
            <!--如果是财务组不展示-->
            <div class="info-item" v-if="item.evaluationType==='0'">
              <span style="width: 30%;">建议金额：</span>
              <el-input v-model="item.proposalFee" :disabled="true" size="small" style="width: 70%;"></el-input>
            </div>

            <div class="info-item" v-if="item.evaluationType==='0'||item.evaluationType==='1'">
              <span style="width: 30%;">合并需求编号：</span>
              <el-input v-model="item.mergeCode" :disabled="true" size="small" style="width: 70%;"></el-input>
            </div>
            <!--如果是财务组不展示-->
            <div class="info-item" v-if="item.evaluationType==='0'">
              <span style="width: 30%;">出资建议渠道：</span>
              <el-input v-model="item.suggestChannel" :disabled="true" size="small" style="width: 70%;"></el-input>
            </div>
          </div>
        </div>
        
        <div v-if="!item.list.length" class="opinion-content">暂无</div>
        <div v-else class="opinion-content" v-for="(value, key) in item.list" :key="key">
          <el-input class="readonly-input" v-model="value.evaluationOpinions" type="textarea" disabled :autosize="true" resize="none"></el-input>
          <!-- {{ value.evaluationOpinions }} -->
        </div>
      </el-collapse-item>
    </el-collapse>

    <!--yjlx='1':评审前意见-->
    <el-collapse v-if="yjlx === '1'" class="opinion-box" @change="handleChange" v-model="opened">
      <el-collapse-item v-for="(item, index) in dataList" :key="index" :name="index">
        <template slot="title">
          <i class="el-icon-caret-bottom" style="color: #298BF5" v-if="item.isActive === true"></i>
          <i class="el-icon-caret-top" style="color: #298BF5" v-else></i>
          <p>{{ item.typeName }}</p>
        </template>
        <div class="opinion-content">{{ item.evaluationOpinions ? item.evaluationOpinions : "暂无" }}</div>
      </el-collapse-item>
    </el-collapse>
    </div>
  </hyNewModal>
</template>
<script>
import {getDemandSuggestions,getDemandBeforeOpinion} from "@/api/common.js";
export default {
  name: "checkOpinions", // 意见查看

  /**
   * @param dialogVisible 弹窗展示
   * @param title 弹窗标题
   * @param projectCode 项目编号
   * @param yjlx 意见类型——0：修改意见，1：评审前意见
   * @param width 弹窗宽度
   * @param ifNeedInputBox 是否需要输入框查看项
   */
  props: {
    dialogVisible: {
      required: true,
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => "意见查看"
    },
    ifNeedInputBox: {   
      type: Boolean,
      default: () => false
    },
    yjlx: {
      type: String,
      default: () => ""
    },
    width: {
      type: String,
      default: () => "800px"
    },
    rowData: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      dataList: [],
      jxResult: {},
      jxDataList: [],
      businessType: this.rowData.businessType ? this.rowData.businessType : "BUSINESSTYPE_XQ"
    };
  },

  computed: {
    opened() {
      return this.dataList.map((i, index) => {
        return index;
      });
    }
  },

  mounted() {
    if (this.yjlx === "0") {
      this.getPsyj();
    }else {
      this._getXmPsqyj();
    }
  },

  methods: {
   async getPsyj() {
      const param = {
        projectType: "PROJECTTYPE_XQ",
        businessType: this.businessType,
        projectCode: this.rowData.projectCode,
        type: this.yjlx,
      };
      let res=await this.m_apiFn(getDemandSuggestions)(param)
      if (res && res.result && res.result.opinion) {
        res.result.opinion.forEach(item => {
          this.$set(item, "isActive", true);
        });
        this.dataList = res.result.opinion;
      }
    },

   async _getXmPsqyj() {
      const param = {
        projectType: "PROJECTTYPE_XQ",
        businessType: this.businessType,
        projectCode: this.rowData.projectCode,
        type: this.yjlx,
      };
      let res=await this.m_apiFn(getDemandBeforeOpinion)(param)
      if (res && res.result) {
        res.result.forEach(item => {
          this.$set(item, "isActive", true);
        });
        this.dataList = res.result;
      }
    },

    closeHandle() {
      this.$emit("closeHandle");
    },

    handleChange(arr) {
      // console.log(arr);
      this.dataList.forEach((item, index) => {
        const _index = arr.findIndex(i => {
          return i === index;
        });
        if (_index === -1) {
          item.isActive = false;
        } else {
          item.isActive = true;
        }
      });
      this.$emit("handleChange", arr);
    }
  }
};
</script>
<style lang="less" scoped>
// .opinion-box /deep/ .el-collapse {
//   border-bottom:none 
// }
.opinion-box /deep/ .el-collapse-item__wrap {
  border-bottom-color: #a8b0c3;
}

.opinion-box /deep/ .el-collapse-item__header {
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;
}

.opinion-box /deep/ .el-collapse-item__arrow.is-active {
  display: none;
}

.opinion-box /deep/ .el-collapse-item__arrow {
  display: none;
}

.opinion-content {
  width: 100%;
  min-height: 70px;
  padding: 12px;
  /* padding-left: 20px;
  padding-top: 10px; */
  box-sizing: border-box;
  background-color: #dedee0;
}
.opinion-box {
  max-height: 474px;
  overflow: auto;
  padding:1px 0;
}
.readonly-input /deep/ .el-textarea__inner {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #606266 !important;
  cursor: default !important;
  padding: 0 !important;
}

.project-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.project-content div:nth-child(2) {
  width: 50%;
}

.footerBtn {
  height: 80px;
  text-align: center;
  margin-top: 44px;
}
.opinion-box /deep/ .el-collapse-item__content{
  padding: 0 5px 10px !important;
}
  
.inputBox{
  display:flex;flex-wrap:wrap;width:100%;
  .opinion-info-box {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;  

    .info-item {
      width: 50%;
      display: flex;
      align-items: center;
      padding: 5px 13px;
      box-sizing: border-box;
    }
  }
}
</style>