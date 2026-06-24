<template>
  <!-- 专家评审 -->
  <hyNewModal v-if="expertReviewShow" :dialogVisible="expertReviewShow" :title="expertReviewTitle" :ifThird="true" :showClose="true" width="80%" @closeHandle="expertReviewclose">
    <!-- 信息 -->
    <div class="info-box" :style="{height: dialogHeight}">
      <!-- 左边 -->
      <div class="left-box">
        <div class="left-box-item" v-for="(item, i) in leftList" :key="i">
          <div class="item-title-box">
            <div class="item-title">{{ item.text }}</div>
            <el-button v-if="i === 0" :disabled="isDownloadDisabled" type="primary" size="small" @click.stop="download">下载</el-button>
          </div>
          <el-checkbox-group class="item-children-box" v-model="fileCheckList">
            <div class="children-item" v-for="(sub, j) in item.children" :key="j">
              <div class="children-title-box">
                <div class="children-title-sign" v-if="sub.sfbx === '01'">*</div>
                <div class="children-title">{{ sub.text }}</div>
              </div>
              <div class="file-box" v-for="(iteration, k) in sub.children" :key="k">
                <div class="file-name-box">
                  <el-checkbox :label="iteration">&nbsp;</el-checkbox>
                  <i class="el-icon-document file-icon"></i>
                  <div class="file-name" @dblclick="fileHandleDbClick(iteration)">{{ iteration.text }}</div>
                </div>
                <div class="upload-icon">
                  <i class="el-icon-download" style="cursor:pointer" @click.stop="downloadFile(iteration)"></i>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="divide"></div>
      <!-- 右边 -->
      <div class="right-box" style="overflow: auto;">
        <div style="border-left: 4px solid #298bf5; margin: 10px 0;">
          <span style="padding-left: 8px; color: #222734; font-size: 16px; font-weight: bold;">意见填写</span>
        </div>
        <div class="examineInputDiv">
          <el-input placeholder="请输入" class="examineInput" v-model="examineOpinion" :maxlength="800" size="small" type="textarea" :autosize="{ minRows: 6, maxRows:9  }"></el-input>
        </div>
        <div>
          <div style="border-left: 4px solid #298bf5; margin: 10px 0;">
            <span style="padding-left: 8px; color: #222734; font-size: 16px; font-weight: bold;">基本信息{{businessType==='BUSINESSTYPE_CS'?'(概要设计)':'(安全)'}}</span>
          </div>
          <projectEditPage
            ref="projectEditPage"
            :apiParams="apiParams"
            :title="projectInfoModalTitle"
            :needProjectData="needProjectData"
            :onlyNeedcsxx="'1'"
            :disabled="false"
            :formData="expertReviewData"
            :batchData="batchRowData"
            :submitBtnShow="submitBtnShow"
            @sureHandle="projectEditPageSureHandle"
            :btnShow="false"
            page="yxProjectDeclaration"
            >
          </projectEditPage>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div>
        <div class="btn-box" style="text-align: center;">
          <el-button style="width: 200px;" @click.stop="expertReviewclose">取消</el-button>
          <el-button style="width: 200px;" type="danger" @click.stop="materialScienceExamineBtn('no')">驳回</el-button>
          <el-button style="width: 200px;" type="primary" @click.stop="materialScienceExamineBtn('save')">保存</el-button>
          <el-button style="width: 200px;" type="primary" @click.stop="materialScienceExamineBtn('yes')">通过</el-button>
        </div>
      </div>
    </template>
  </hyNewModal>
</template>
<script>
import { submitPreAudit } from "@/api/szhApi/szhProjectDeclaration.js";
import projectEditPage from "../common/projectEditPage/projectEditPage.vue";
import {
  downloadFile,
  downloadFiles,
  checkFileState,
  getCommonCltjbTree
} from "@/api/common.js";
import {
  getDemandOpinionsDetail,
} from "@/api/szhApi/szhGroupLeaderSummary";
export default {
  name: "expertReview",
  components: {
    projectEditPage,
  },
  data() {
    return {
      dialogHeight:"580px",

      fileCheckList: [],
      leftList: [],
      isDownloadDisabled: true,
      examineOpinion: "",
      clblx: "IPHONEDIY_SB",
      isInternet: this.$store.state.isInternet,
      //项目修改/查看
      projectInfoModalTitle:"修改",
      projectInfoDisabled: true,
      projectInfoRowData: {},
      needProjectData:true,
      submitBtnShow: false,
      //保存/驳回
      materialType:"",
    };
  },

  watch: {
    "$store.state.dialogHeight":{
      handler:function(newVal,oldVal){
        console.log(newVal,"newVal")
        this.dialogHeight=newVal?`${newVal-20}px`:'580px'
      }
    }
  },

  mounted() {
    this.getCommonCltjbTree();
    if(this.expertReviewData.evaluationOpinions){
      this.examineOpinion=this.expertReviewData.evaluationOpinions
    }
  },

  props: {
    expertReviewShow: {
      type: Boolean,
      default: false
    },
    expertReviewTitle: {
      type: String,
      default: ""
    },
    batchRowData: {
      type: Object,
      default: {}
    },
    apiParams: {
      type: Object,
      default: {}
    },
    expertReviewData: {
      type: Object,
      default: {}
    },
    businessType: {
      type: String,
      default: ""
    },
    projectType: {
      type: String,
      default: ""
    }
  },

  methods: {
    async getCommonCltjbTree() {
      let param;
      param = {
        xmbh: this.expertReviewData.projectCode,
        zylx: this.expertReviewData.professionalType,
        xmlx: this.projectType,
        ywlx: this.businessType,
        xmfl: this.expertReviewData.projectClassify,
        clblx: this.clblx
      };
      let res=await this.m_apiFn(getCommonCltjbTree)(param)
          if (res && res.result) {
            this.leftList = res.result;
            let data = this.initData(this.leftList);
            for (let item of data) {
              for (let i of item.children) {
                if (i.children.length) {
                  this.isDownloadDisabled = false;
                  return;
                }
              }
            }
          }
    },

    initData(data) {
      data.map((item, index) => {
        if (item.children) {
          this.initData(item.children);
        }
      });
      return data;
    },

    fileHandleDbClick(data) {
      this.m_pageoffice(
        data,
        false,
        this.expertReviewData.professionalType,
        this.expertReviewData.xmbh,
        this.clblx
      );
    },

    // 批量下载
   async download() {
      if (this.fileCheckList.length === 0) {
        let res=await this.m_apiFn(downloadFiles)({
          clb: this.leftList[0].id,
          xmbh: this.expertReviewData.projectCode,
          clblx: this.clblx
        })
        //  this._downFileStream(res,'国网浙江省电力有限公司营销投入项目汇总表.xls')
      } else {
        let clids = [];
        for (const iterator of this.fileCheckList) {
          clids.push(iterator.id);
        }
        let res=await this.m_apiFn(downloadFiles)({
          clids: clids,
          xmbh: this.expertReviewData.projectCode,
          clblx: this.clblx
        })
        //  this._downFileStream(res,'国网浙江省电力有限公司营销投入项目汇总表.xls')
      }
    },

    // 单个文件下载
    async downloadFile(row) {
      // let result = true;
      // if (this.$store.state.isInternet) {
      //   result = await this.m_apiFn(checkFileState)({ fileKey: row.id })
      //       if (res && res.statusCode === "200") {
      //         return true;
      //       }
      // }
      // if (!result) {
      //   return false;
      // }
      let res=await this.m_apiFn(downloadFile)({ clid: row.id })
      // this._downFileStream(res,'国网浙江省电力有限公司营销投入项目汇总表.xls')
    },


    // 审核弹框底部按钮操作
   async materialScienceExamineBtn(e) {
      if (!this.examineOpinion) {
        this.$message.warning("请填写意见");
        return;
      }
      this.materialType=e
      this.$refs.projectEditPage.sureHandle()
    },
    //表单信息保存后
    projectEditPageSureHandle(){
      let params = {};
      params.projectCode = this.expertReviewData.projectCode;
      params.clblx = this.clblx;
      params.evaluationOpinions = this.examineOpinion;
      setTimeout(()=>{
        switch (this.materialType) {
          case "save":
            params.isSubmit = "";
            this.submitPreAudit(params)
            break;
          case "yes":
            params.isSubmit = "1";
            this.submitPreAudit(params)
            break;
          case "no":
            params.isSubmit = "0";
            this.submitPreAudit(params)
            break;
        }
      },100)
      
    },
    async submitPreAudit(params){
     let res=await this.m_apiFn(submitPreAudit)(params)
      if (res.statusCode === "200") {
        this.$message.success(res.message);
        this.$emit("expertReviewclose");
      } else {
        this.$message.warning(res.message);
      }
    },
    expertReviewclose() {
      this.$emit("expertReviewclose");
    },
  }
};
</script>

<style scoped lang="less">
@import "./expertReview.less";
.info-box {
  height: 580px;
  overflow: auto;
  box-sizing: border-box;
}

.btn-box{
   /deep/ .el-button {
  width: 200px;
}

}
.examineInputDiv {
  display: flex;
  align-items: center;
  // padding: 10px;
  box-sizing: border-box;
  // height: 100%;
}

.examineInputDiv /deep/ .el-textarea {
  height: 100% !important;
}

.examineInput /deep/ .el-textarea__inner {
  height: 100% !important;
}


.fileTitle::before{
        content: '';
        width: 5px;
        height: 18px;
        border-left: 5px solid #43a0ff;
        margin-right: 7px;
      }
</style>
