<template>
	<div>
    <hyNewModal id="modalCss" 
      v-if="materialUploadModalShow" :dialogVisible='materialUploadModalShow' 
      title='材料上传' :ifThird="true"  :showClose="true" :ifSure="false" :ifCancle="false" width='80%' 
      @closeHandle="materialUploadModalShowCancle" :modalAppendToBody="true" :appendToBody="true">
      <div style="display: flex;flex-direction: row;width:100%;margin-top: 30px;height:550px;content-visibility: auto;contain-intrinsic-size:600px">
        <div class="leftBlock">
          <div class="content_leftBlock">
            <div style="direction: ltr;">
              <!-- <div class="content_leftTopBlock"></div> -->
              <el-tree class="leftTree" 
                ref="leftTree"
                icon-class="el-icon-arrow-right"
                :data="treeData" 
                :props="defaultProps" 
                :highlight-current="true" 
                :node-key="nodeKey" 
                :default-checked-keys="defaultCheckedKeys" 
                :current-node-key="currentNodeKey"
                default-expand-all 
                :expand-on-click-node="false" 
                @node-click="handleNodeClick">
              </el-tree>
            </div>
          </div>
        </div>
        <div class="rightBlock" ref="rightBlock">
          <!-- 项目新增/修改弹框 -->
          <div id="one">
            <div :class="currentNodeKey==='one'?'checkTitle':'rightBlockTitle'">一.项目信息填报</div>
            <projectEditPage
              v-if="projectInfoDialogVisible"
              :apiParams="apiParams"
              :title="projectInfoModalTitle"
              :needProjectData="needProjectData"
              :disabled="projectInfoDisabled"
              :formData="projectRowData"
              :batchData="batchRowData"
              :submitBtnShow="submitBtnShow"
              :btnShow="true"
              page="yxProjectDeclaration"
              @sureHandle="sureHandle">
            </projectEditPage>
          </div>
          <div id="two" style="margin-top:10px;">
            <div :class="currentNodeKey==='two'?'checkTitle':'rightBlockTitle'">二.材料上传</div>
            <div class="fileBlock">
              <div class="fileBody" v-for="(item,index) in uploadFileList" :key="index">
                <div class="fileTop">
                  <div class="fileTitle">
                    <span style="color:red" v-if="item.isbt==='1'">*</span>{{item.name}}
                  </div>
                  <div class="fileTopBtn">
                    <el-button type="primary" size="mini" icon="el-icon-upload2">上传文件</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-refresh">自动生成</el-button>
                  </div>
                </div>
                <div v-if="!item.fileName" class="uploadBlock">
                  <div><i style="font-size:35px;color:#dcdfe6" class="el-icon-upload"></i></div>
                  <div style="width:100%;text-align:center;margin-top:10px;display: flex;justify-content: center;}">
                    点击进行
                    <el-upload
                      class="uploadBtn"
                      ref="upload"
                      action=""
                      :show-file-list="false"
                      :file-list="item.fileList"
                      :auto-upload="true"
                      :before-upload="batchImportBeforeUpload"
                      :multiple="false"
                    >
                      <span slot="trigger" class="clickFont" @click="fileUploadClick(item)">文件上传</span>
                    </el-upload> ,或<span class="clickFont">下载模板</span>
                  </div>
                </div>
                <div  class="uploadBlock" style="color:#409eff" v-if="item.fileName">{{item.fileName}}</div>
              </div>
            </div>
          </div>
        </div>
       </div>
       <div style="text-align:center;padding:10px 0">
        <el-button style="width:200px" @click="materialUploadModalShowCancle">取消</el-button>
        <el-button style="width:200px" type="primary" @click="saveTable">提交</el-button>
       </div>
      
    </hyNewModal>
    
	</div>
</template>
<script>
import {                          
  getWorkMeasurementData,  
  getInitialAmountToleranceTableHead,
  addInitialAmountToleranceTableHead,
  delInitialAmountToleranceTableHead,
  initialAmountToleranceAddCompany,
  initialAmountToleranceDelCompany,
  initialAmountToleranceTableHead,      // 保存实施任务表头
  saveWorkRowData,                      //保存初步工作度量
  processProjectMeasure,
  addYwyyModule,
} from '@/api/workCalculate';

import { getDictTree, selectBatchList} from "@/api/common.js";
import projectEditPage from "../../common/projectEditPage/projectEditPage.vue";
// import {  columnConfig } from "./config.js";
export default {
  name: "materialUpload", // 初步工作量度量
  components: {
    projectEditPage,
  },
  props:{
    apiParams: {
      type: Object,
      default: () => {}
    },
    batchRowData: {
      type: Object,
      default: () => {}
    },
    projectRowData: {
      type: Object,
      default: () => {}
    },
    materialUploadModalShow: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      //树
      treeData: [
        {name:"一.项目信息填报",id:"one"},
        {name:"二.材料上传",id:"two"},
      ],
      selectTreeData:"",
      defaultProps:{
        children:'children',
        label:"name"
      },
      nodeKey:"id",
      defaultCheckedKeys: [],
      currentNodeKey:"one",
      //项目修改/查看
      projectInfoDialogVisible:true,
      projectInfoModalTitle:"修改",
      projectInfoDisabled: false,
      projectInfoRowData: {},
      needProjectData:true,
      submitBtnShow: true,
      //材料上传
      uploadFileList:[
        {name:"概要设计说明书",isbt:"1",fileList:[],},
        {name:"安全防护方案",fileList:[],},
        {name:"评审意见",fileList:[],},
      ],
      fileRow:{},
      
    };
  },

  watch:{
  },
 
  mounted() {
  },
  activated(){
    // this.$nextTick(()=>{
    //   this.tableSummaryQuestion()
    // })
  },
  methods: {
    //树点击
    handleNodeClick(e){
      //找到节点位置
      this.currentNodeKey=e.id
      // console.log(this.currentNodeKey,e.id)
      let target=document.getElementById(e.id)
      this.$forceUpdate()
      //跳转到节点位置
      this.$nextTick(()=>{
        this.$refs.rightBlock.scrollTo(0,target.offsetTop-28)
      })

    },

    fileUploadClick(item){
      this.fileRow=item
      console.log(this.fileRow)
    },

    batchImportBeforeUpload(e){
      console.log(e)
      for(let item of this.uploadFileList){
        if(item.name===this.fileRow.name){
          this.$set(item,"fileName",e.name)
        }
      }
      console.log(this.fileRow)
      return false
    },

    // 修改/新增
    sureHandle(val){

    },

    saveTable(){

    },

    //弹框关闭
    materialUploadModalShowCancle(){
      this.$emit("materialUploadModalShowCancle");
    },

    
  }
};
</script>
<style lang="less" scoped>
.iframe-dialog {
  /deep/ .el-dialog {
    margin: 0 auto !important;
    position: absolute !important;
    left: 50%;
    transform: translateX(-50%) !important;
    top: 30px !important;
    .el-dialog__body {
      padding: 0px 20px 10px;
      box-sizing: border-box;
      max-height: 850px;
      overflow: auto;
    }

    .el-dialog__footer {
      text-align: center;

      button {
        width: 200px;
      }
    }
  }
}
.footerBtn {
    height: 80px;
    margin-top: 18px;
    text-align: center
}
.leftBlock /deep/ ::-webkit-scrollbar-thumb{
  background-color: #298bf5 !important;
  box-shadow: inset 0 0 0px #eaeef1 !important;
  border-radius: 0px !important;
}
.leftBlock /deep/ ::-webkit-scrollbar {
  width: 4px !important;
  height: 4px !important;
}
.leftBlock /deep/ ::-webkit-scrollbar-track-piece{
  background-color: #e8e8ea !important;
}
.leftBlock {
  box-sizing: border-box;
  width: 14%;
  padding: 8px 0;
  border: 1px solid #dedfe1;
  border-right: none;
  overflow: auto;
  .content_leftBlock{
    height:100%;overflow:auto;direction: rtl;
    .content_leftTopBlock{
      background:#f4f9ff;width:100%;height:20px;margin-bottom:15px;
    }
  }

  .leftTree /deep/ .is-current>.el-tree-node__content{
    background-color: #f4f9ff !important;
    color: #298bf5;
    font-weight: 700;
    .el-tree-node__expand-icon{
      color: #298bf5;
    }
    .is-leaf{
      color: transparent;
    }
  }
  .leftTree /deep/ .el-tree-node__content{
    height:40px !important;
  }
}
.rightBlock{
  overflow: auto;
  position: relative;
  box-sizing: border-box;
  padding: 20px;
  width: 86%;
  border: 1px solid #dedfe1;
  .rightBlockTitleBody{
    margin-bottom:20px;
    
    
    .rightBlockContent{
      display: flex;
      justify-content: flex-start;
      flex-flow: row wrap;
      width:100%;
      .rightBlockContentBlock{
        width:19%;
        height: 113px;
        margin-right: 1%;
        margin-bottom: 10px;
        position: relative;
        background-size: 100% 100%;
        .rightBlockContentBlockBody{
          .rightBlockContentBlockIcon{
            position: absolute;
            transform: scale(0.7);
            top: 30px;
            left: 8px;
            width: 107px;
            height: 82px;
          }
          .rightBlockContentBlockFont{
            width: 57%;
            position: absolute;
            top: 48px;
            left: 110px;
            color:#222734;
            font-size:14px;
          }
        }
      }
    }
  }

  .tableBlock{
    margin-bottom:20px;
    .tableTitle{
      height: 44px;
      padding: 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}













.checkTitle{
      background-color: #f4f9ff !important;
      color: #298bf5;
      border-radius:10px;
      padding:4px 10px;
      margin-bottom: 15px;
      font-size: 17px;
      font-weight: 700;
    }
    .rightBlockTitle{
      color: #222734;
      margin-bottom: 15px;
      padding:4px 0;
      font-size: 17px;
      font-weight: 700;
    }

.custom-tree-node {
  display: flex !important;
  width: calc(100% - 24px);
  /* justify-content: space-around; */
}
.base-icon {
  line-height: inherit;
  margin-right: 6px;
}
.folder-icon {
  color: #409eff;
  font-size: 15px;
  font-weight: 700;
}
.file-icon {
  width: 11px;
  height: 11px;
  display: inline-block;
  border-radius: 50%;
  background: #319bff;
}
.node-line {
  font-size:14px;
  width: calc(50% - 9px);
}
.file-date {
  text-align: center;
}

.readonly-input /deep/ .el-textarea__inner {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #606266 !important;
  cursor: default !important;
  padding: 0 !important;
}
.readonly-input {
  vertical-align: middle !important;
}



.fileBlock{
  padding: 10px 18px;
  box-sizing: border-box;
  .fileBody{
    width:100%;
    box-sizing: border-box;
    padding:10px 15px;
    border-radius: 4px;
    background:#f7f7f9;
    margin:15px 0;
    .fileTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .fileTitle::before{
        content: '';
        width: 5px;
        height: 18px;
        border-left: 5px solid #43a0ff;
        margin-right: 7px;
      }
      .fileTopBtn{
        text-align: right;
      }
    }
    .uploadBlock{
      box-sizing: border-box;
      padding: 10px;
      margin: 20px 10px 10px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      background: white;
      border:1px solid #e8e8ea;
      border-radius: 4px;
    }
  }   
  
}

.clickFont{
  text-decoration: underline;color:#409eff;cursor:pointer
}

</style>