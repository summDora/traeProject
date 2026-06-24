<template>
  <hyModal :dialogVisible="dialogVisible" :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" width="65%"
    styleSelf="min-width: 870px;" @closeHandle="closeHandle">
    <viewMaterial v-if="showViewMaterial" :ifNeedUpload="isMaterialUpload" :hasCKGSS="hasCKGSS" :showCheckbox="true"
      :hasSignatureState="hasSignatureState" :clblx="clblx" :rowData="rowData" :treeProps="treeProp"
      :treeData="treeData" :control="control" @checkChange="checkChange" @beforeUpload="beforeUpload"
      @downloadMore="downloadMore" @downloadOne="downloadOne" @fileHandleDbClick="fileHandleDbClick"
      @rowDbClick="rowDbClick" @uploadFile="uploadFile" @deleteFile="deleteFile" @editFile="editFile"
      @refreshFile="refreshFile" @onWatchClick="onWatchClick" @openCustomSignature="openCustomSignature"
      @badgeClick="badgeClick"  @batchImport="batchImport"
    ></viewMaterial>
    <estimationBook v-if="estimationBookModalShow" :dialogVisible="estimationBookModalShow" :rowData="rowData"
      :getGusEmptyTableByXmid="getGusEmptyTableByXmid" :getDwsb4SuanData="getDwsb4SuanData"
      @closeHandle="estimationBookModalShow = false"></estimationBook> 

    <!-- 专家自定义签章 -->
    <el-dialog class="iframe-dialog" v-if='customSignature' title="电子印章" :visible.sync="customSignature"
      :close-on-click-modal="false" :append-to-body="true" width="90%" :before-close="customSignatureCloseHandle">
      <iframe id="header-iframe" :src="iframeUrl" width="100%" :height="iframeHeight" frameborder=0 border=0
        marginheight=0 marginwidth=0 scrolling="no"></iframe>
    </el-dialog>

      <!--批量上传-->
    <batchImportModal
      ref="batchImportModalRef"
      v-if="batchImportModelShow" 
      :batchImportModelShow='batchImportModelShow' 
      :apiParams="apiParams"
      :batchRowData="batchImportRowData"
      :batchFileList="batchFileList"
      @batchImportModelClose="batchImportModelClose"
      :businessType="rowData.businessType"
      :projectType="rowData.projectType"
    >
    </batchImportModal>
    <!--批量上传(有上传任务)-->
    <hyNewModal :smallModel="true" :modalTop="'360px'" v-if="batchImportTaskModelShow" :dialogVisible='batchImportTaskModelShow' title='批量上传' :showClose="true" @closeHandle="batchImportTaskModelShow=false" :ifSure="false" :ifCancle="false" width='35%' :modalAppendToBody="true" :appendToBody="true">
      <div style="margin:15px 0 30px;">当前有{{batchImportTaskNum}}个批量上传任务正在匹配,是否继续进行批量上传?</div>
      <div style="text-align:center;margin:15px 0;display:flex;justify-content: center;">
        <el-button style="width:150px;" @click="batchImportTaskModelShow=false">取消</el-button>
        <el-button style="width:150px;" type="primary" @click="nextTask">继续</el-button>
        <el-button style="width:150px;" type="primary" @click="readTask">查看详情</el-button>
      </div>
    </hyNewModal>
    <!--批量上传队列弹窗-->
    <hyNewModal v-if="batchImportQueueModelShow" :dialogVisible='batchImportQueueModelShow' title='批量上传队列' :showClose="true" @closeHandle="batchImportQueueModelShowClose" :ifSure="false" :ifCancle="false" width='70%' :modalAppendToBody="true" :appendToBody="true">
      <div class="importBlock">
        <div v-if="batchImportQueueList.length">
          <div
            class="filsListBlock"
            v-for="(item, index) in batchImportQueueList"
            :key="index"
          >
            <div style="display: flex;width: 100%;">
              <div class="fileListIcon">
                <i
                  style="font-size: 50px"
                  class="icon iconfont iconcailiaoshangchuan"
                ></i>
              </div>
              <div class="fileListBody">
                <div class="fileListBodyClose">
                  <div
                    :style="{
                      color:
                        item.statusName === '等待匹配'
                          ? '#409eff'
                          : item.statusName === '上传完成'
                          ? '#67C23A'
                          : '#F56C6C',
                    }"
                  >
                    {{ item.statusName }}
                  </div>
                  <div style="margin-left: 8px">
                    <i
                      style="cursor: pointer; font-size: 16px"
                      class="el-icon-circle-close"
                      @click="delQueueList(item, index)"
                    ></i>
                  </div>
                </div>
                <div>
                  <div><span>{{ item.materialName }}</span><span style="display:inline-block;margin-left:10px">上传时间:{{ item.create_date }}</span></div>
                </div>
              </div>
            </div>
            <div v-if="item.statusName === '上传完成'" class="successBlock">
              <div>匹配上传结果说明:</div>
              <div>本次上传材料{{item.total}}个,匹配成功{{item.successNum}}个,未匹配{{item.noMatchNum}}个,上传失败{{item.failNum}}个,点击查看详情可查看上传文件的错误原因</div>
              <div style="text-align:center;margin:15px 0;display:flex;justify-content: center;">
                <el-button size="mini" style="width:150px;" @click="batchImportQueueSubmit(item)">确认</el-button>
                <el-button size="mini" style="width:150px;" type="primary" @click="readQueueDetail(item)">查看详情</el-button>
              </div>
            </div>
          </div>
        </div>
        <div>暂无数据</div>
      </div>
    </hyNewModal>


    <template slot="footer">
      <div v-if="isMaterialUpload && clblx !== 'IPHONEDIY_HY' && clblx !== 'IPHONEDIY_GZSK'">
        <el-button v-if="cancelBtnShow" size="medium" @click="closeHandle">取消</el-button>
        <el-button v-if="isSaveBtn" size="medium" type="primary" @click="saveHandle">保存</el-button>
        <el-button v-if="submitBtnShow" size="medium" type="primary" @click="sureHandle">提交</el-button>
      </div>
      <div v-if="isSubmitBtn">
        <el-button size="medium" @click="closeHandle">取消</el-button>
        <el-button v-if="isSaveBtn" size="medium" type="primary" @click="saveHandle">保存</el-button>
        <el-button size="medium" type="primary" @click="onSubmit">提交</el-button>
      </div>
    </template>
  </hyModal>
</template>
<script>
import viewMaterial from "@/pages/public/viewMaterial.vue";
import estimationBook from "@/pages/common/estimationBook/estimationBook.vue"; //查看估算书
import {
  getCommonCltjbTree,
  uploadTreeFiles,
  downloadFile,
  downloadFiles,
  deleteFileById,
  commonPassFlow,
  closePass,
  doCheckFileByProject,
  getPageOfficeFileType,
  uploadSystemFileCheckCommon,
  checkFileState,
  uploadSystemFile,
} from "@/api/common.js";
import { 
  queryUploadSortNumber,queryUploadWorkList,confirmUploadWork,getMaterialFileId,judgeHasUploadProject
 } from "@/api/szhApi/szhProjectDeclaration.js";
import { GATEWAY } from '@/api/serverName'
import { submitSsFiles } from "@/api/materialDeclaration.js";
import { submitProject } from "@/api/pwApi/pwProjectDeclaration.js";
import { expertStampCreateSignFile } from "@/api/electronicSignatureManagement";
import { POBrowser } from "@/utils/pageoffice.js";
import { submitProjectUrl } from "@/api/szhApi/szhProjectDeclaration.js";
import batchImportModal from "@/pages/szh_base/cs_base/csSzhProjectDeclaration/batchImportModal/batchImportModal.vue";
import { config } from "@/config";
export default {
  name: "materialUpload",

  components: {
    viewMaterial,
    estimationBook,
    batchImportModal
  },

  /**
   * @param clblx IPHONEDIY_SB：申报材料，IPHONEDIY_SK：收口材料，IPHONEDIY_GZSK：盖章收口材料，IPHONEDIY_HY：会议材料  IPHONEDIY_KY:可研
   */
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    rowData: {
      type: Object,
      default: () => { }
    },
    apiParams: {
      type: Object,
      default: () => { }
    },
    isMaterialUpload: {
      type: Boolean,
      default: () => false
    },
    cancelBtnShow: {
      type: Boolean,
      default: () => true
    },
    submitBtnShow: {
      type: Boolean,
      default: () => true
    },
    isSubmitBtn: {
      type: Boolean,
      default: () => false
    },
    isSaveBtn: {
      type: Boolean,
      default: () => false
    },
    clblx: {
      type: String,
      default: () => ""
    },
    title: {
      type: String,
      default: () => ""
    },
    getCommonCltjbTree: {
      type: Function,
      default: () => null
    },
    uploadTreeFiles: {
      type: Function,
      default: () => null
    },
    downloadFile: {
      type: Function,
      default: () => null
    },
    downloadFiles: {
      type: Function,
      default: () => null
    },
    deleteFileById: {
      type: Function,
      default: () => null
    },
    getGusEmptyTableByXmid: {
      type: Function,
      default: () => null
    },
    getDwsb4SuanData: {
      type: Function,
      default: () => null
    },
    uploadSystemFileCheck: {
          type: String,
          default: () => "/common/uploadSystemFileCheck"
    },
    control: {
      type: String,
      default: ""
    },
    hasCKGSS: {
      type: Boolean,
      default: () => false
    },
    isJXYW: {
      type: Boolean,
      default: () => false
    },
    isCommon: {
      type: Boolean,
      default: () => false
    },
    hasSignatureState: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      treeProp: {
        label: "text",
        children: "children"
      },
      treeData: [],
      professionalType: this.rowData.professionalType,
      xmlx: this.rowData.xmlx ? this.rowData.xmlx : "PROJECTTYPE_XXH",
      ywlx: this.rowData.ywlx ? this.rowData.ywlx : "BUSINESSTYPE_KY",
      showViewMaterial: false,
      estimationBookModalShow: false,
      checkData: [],
      clbInfo: {},
      baseURL: config.baseURL,
      customSignature: false,
      iframeUrl: "",
      iframeHeight: 0,
      checkFlag:false,//校验必传材料是否未传
      //批量上传弹框
      batchFileList:[],
      batchImportModelShow:false,
      batchImportRowData:{},
      //批量上传(有上传任务时)
      batchImportTaskModelShow:false,
      batchImportTaskNum:0,
      //批量上传队列弹窗
      batchImportQueueModelShow:false,
      batchImportQueueList:[],
      materialId:"",

    };
  },

  mounted() {
    // console.log("isMaterialUpload", this.isMaterialUpload);
    // console.log("cancelBtnShow", this.cancelBtnShow);
    // console.log("submitBtnShow", this.submitBtnShow);
    // console.log("clblx", this.clblx);
    console.log("rowData", this.rowData);

    this._getCltjbTree();

    // 监听iframe返回事件
    window.addEventListener("message", e => {
      console.log("message", e);
      if (e.data == "close") {
        this.customSignatureCloseHandle();
      }
    });
  },

  methods: {
   async _getCltjbTree() {
    console.log(this.rowData,'this.rowData')
      const param = {
        xmlx: this.xmlx,
        ywlx: this.rowData.businessType ? this.rowData.businessType : this.rowData.ywlx,
        clblx: this.clblx,
        zylx: this.professionalType ? this.professionalType : this.rowData.professionalType,
        xmfl: this.rowData.projectClassify || this.rowData.projectClassify,
        isMeasure: this.rowData.isMeasure,
        // xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh
        xmbh: this.rowData.xmbh ? this.rowData.xmbh : this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh
      };
      let res=await this.m_apiFn(this.getCommonCltjbTree)(param)
          if (res && res.result && res.result.length > 0) {
            if (this.clblx === "IPHONEDIY_HY" && !this.isMaterialUpload) {
              this.treeData = [];
              for (const iterator of res.result) {
                const i = this.m_copy(iterator);
                i.children = [];
                if (iterator.children && iterator.children.length > 0) {
                  for (const item of iterator.children) {
                    if (
                      this.control === "peerReview" ||
                      this.control === "closeUpExamine"
                    ) {
                      if (item.text !== "单位材料") {
                        i.children.push(item);
                      }
                    } else {
                      if (i.text !== "专家材料") {
                        i.children.push(item);
                      }
                    }
                  }
                }
                this.treeData.push(i);
              }
            } else {
              this.treeData = res.result;
            }
          } else {
            this.treeData = [];
          }
          this.checkData = [];
          this.showViewMaterial = true;
    },

    closeHandle(val) {
      this.$emit("closeHandle", val);
    },

    checkChange(data) {
      // console.log(data);
      const index = this.checkData.findIndex(item => item.id === data.id);
      if (index > -1) {
        this.checkData.splice(index, 1);
      } else {
        this.checkData.push(data);
      }
    },

   async beforeUpload(file) {
      console.log("beforeUpload............",this.clbInfo)
      if (this.clblx == "IPHONEDIY_HY" && !this.clbInfo.text.includes("其他材料")) {
        // 会议资料只能上传pdf文件
        const allowPost = new RegExp(/.pdf/);
        const fileSuffix = file.name
          .substr(file.name.lastIndexOf("."))
          .toLowerCase();

        if (!allowPost.test(fileSuffix)) {
          this.$message.warning("请将文件转换成PDF格式后再上传！");
          return false;
        }
      }
      const fileData = new FormData();
      fileData.append("files", file);
      fileData.append("xmbh", this.rowData.xmbh);
      fileData.append("uploadFileTypeName", this.clbInfo.text);
      fileData.append("projectCode", this.rowData.projectCode);
      fileData.append("trpId", this.rowData.trpId);
      fileData.append("projectName", this.rowData.projectName);
      fileData.append("clblx", this.rowData.clblx);
      fileData.append("xmlx", this.rowData.xmlx);
      fileData.append("ywlx", this.rowData.ywlx);
      fileData.append("projectCompany", this.rowData.projectCompany);
      let res=await this.m_apiFn(uploadSystemFile)(fileData)
      if(res.statusCode==="200"){
        let param = {
          xmlx: this.xmlx,
          ywlx: this.ywlx,
          clids: res.result,
          xmbh: this.rowData.xmbh ? this.rowData.xmbh : this.rowData.hybh,
          clnr: this.clbInfo.id,
          clb: this.clbInfo.parentId
        };
        this._uploadFile(param)
      }
      return false;
    },
    async _uploadFile(params){
      let res=await this.m_apiFn(this.uploadTreeFiles)(params)
       this._getCltjbTree();
     },
    uploadFile(data) {
      this.clbInfo = data;
    },

   async downloadMore() {
      // 下载
      let dataList = [];
      for (const iterator of this.checkData) {
        if (iterator.isfile === "1") {
          dataList.push(iterator);
        }
      }

      console.log("dataList", dataList);

      let clid = "",
        clids = [];
      if (dataList.length === 0) {
        console.log("downloadFiles 1", {
          clb: this.treeData[0].id,
          xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh,
          clblx: this.clblx,
          zylx:this.rowData.professionalType
        });
        let res=await this.m_apiFn(this.downloadFiles)({
          clb: this.treeData[0].id,
          xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.xmbh,
          clblx: this.clblx,
          zylx:this.rowData.professionalType
        })
        // this.m_apiFn(this.downloadFiles, {
        //   clb: this.treeData[0].id,
        //   xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh,
        //   clblx: this.clblx,
        //   professionalType:this.rowData.professionalType
        // })
        //   .then(res => { })
        //   .catch(err => {
        //     this._getCltjbTree();
        //   });
      } else if (dataList.length === 1) {
        clid = dataList[0].id;
      let res=await this.m_apiFn(this.downloadFile)({ clid: clid,zylx:this.rowData.professionalType })
        // this.m_apiFn(this.downloadFile, { clid: clid,professionalType:this.rowData.professionalType })
        //   .then(res => { })
        //   .catch(err => {
        //     this._getCltjbTree();
        //   });
      } else {
        for (const iterator of dataList) {
          clids.push(iterator.id);
        }

        console.log("downloadFiles 2", {
          clids: clids,
          xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh,
          clblx: this.clblx,
          zylx:this.rowData.professionalType
        });
   
        let res=await this.m_apiFn(this.downloadFiles)({
          clids: clids,
          xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh,
          clblx: this.clblx,
          zylx:this.rowData.professionalType
        })
        // this.m_apiFn(this.downloadFiles, {
        //   clids: clids,
        //   xmbh: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh,
        //   clblx: this.clblx,
        //   professionalType:this.rowData.professionalType
        // })
        //   .then(res => { })
        //   .catch(err => {
        //     this._getCltjbTree();
        //   });
      }
    },

   async downloadOne(data) {
    let res=await this.m_apiFn(this.downloadFile)( { clid: data.id,zylx:this.rowData.professionalType })
      // this.m_apiFn(this.downloadFile, { clid: data.id,professionalType:this.rowData.professionalType })
      //   .then(res => { })
      //   .catch(err => {
      //     this._getCltjbTree();
      //   });
    },

    async fileHandleDbClick(data) {
      console.log("fileHandleDbClick", data);
      // let result = true;
      // if (this.$store.state.isInternet) {
      //   result = await this.m_apiFn(checkFileState)({ fileKey: data.uuid,zylx:this.rowData.professionalType })
      //       if (res && res.statusCode === "200") {
      //         return true;
      //       }
      // }
      // if (!result) {
      //   return false;
      // }

      const fileTypeList = data.text.split(".");
      const fileType = fileTypeList[fileTypeList.length - 1];
      let res=await this.m_apiFn(getPageOfficeFileType)({})
          if (res && res.result && res.result.includes(fileType)) {
            // this.$message.warning(
            //   "由于系统升级，PageOffice插件需更新，请先通过“计算机→卸载或更改程序”卸载”PageOffice 客户端软件5.1“以下的版本插件，再安装最新插件！"
            // );
            let officePage="0"
            let str=`fileKey=${data.uuid}&officePage=${officePage}`
            if(this.isMaterialUpload){
              if(data.dictid === "3"){
                officePage="2"
                str=`fileKey=${data.uuid}&officePage=${officePage}&projectType=${this.xmlx}&businessType=${this.ywlx}&projectCode=${this.rowData.projectCode}&fileType=${this.clblx}`
              }else{
                officePage="1"
              }
              
            }
            console.log(process.env.VUE_APP_BASE_OFFICEURL,"process.env.VUE_APP_BASE_OFFICEURL")
            window.open(`${process.env.VUE_APP_BASE_OFFICEURL}PsIndex?${str}`,'newwindow',
              `height=800,width=800,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no`
            )



            // if (this.isMaterialUpload) {
            //   if (data.dictid === "3") {
            //     POBrowser.openWindowModeless(
            //       `${this.baseURL
            //       }/commons/pageoffice/goPsyjClOnlinePage?fileKey=${data.uuid
            //       }&xmbh=${this.rowData.projectCode}&clblx=${this.clblx}&zylx=${this.professionalType
            //       }&ywlx=${this.ywlx}`,
            //       "width=1300px;height=800px;"
            //     );
            //   } else {
            //     POBrowser.openWindowModeless(
            //       `${this.baseURL
            //       }/commons/pageoffice/goOnlineFileEditPage?fileKey=${data.uuid
            //       }`,
            //       "width=1300px;height=800px;"
            //     );
            //   }
            // } else {
            //   POBrowser.openWindowModeless(
            //     `${this.baseURL
            //     }/commons/pageoffice/goOnlineFileReadOnly?fileKey=${data.uuid}`,
            //     "width=1300px;height=800px;"
            //   );
            // }
          } else {
            this.$message.warning("该类型文件暂不支持在线阅读");
          }
    },

    //双击列
    rowDbClick(row) {
      this.$emit("rowDbClick", row);
    },

    deleteFile(data) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      })
        .then(() => {
          this._deleteFile({ clids: [data.id] })
        })
        .catch(() => { });
    },
  async _deleteFile(params){
    let res=await this.m_apiFn(this.deleteFileById)(params)
      if (res.statusCode === "200") {
                this.$message.success(res.result);
              }
              this._getCltjbTree();
  },
    async editFile(data) {
      // let result = true;
      // if (this.$store.state.isInternet) {
      //   result = await this.m_apiFn(checkFileState)( { fileKey: data.uuid })
      //       if (res && res.statusCode === "200") {
      //         return true;
      //       }
      // }
      // if (!result) {
      //   return false;
      // }

      this.$message.warning(
        "由于系统升级，PageOffice插件需更新，请先通过“计算机→卸载或更改程序”卸载”PageOffice 客户端软件5.1“以下的版本插件，再安装最新插件！"
      );
      POBrowser.openWindowModeless(
        `${this.baseURL}/commons/pageoffice/goPsyjClOnlinePage?fileKey=${data.uuid
        }&xmbh=${this.rowData.projectCode}&clblx=${this.clblx}&zylx=${this.professionalType
        }&ywlx=${this.ywlx}`,
        "width=1300px;height=800px;"
      );
    },

   async refreshFile(data) {
      // 可研报告解析
      const param = {
        xmlx: this.xmlx,
        ywlx: this.ywlx,
        zylx: this.professionalType,
        xmfl: this.rowData.projectClassify,
        xmbh: this.rowData.projectCode,
        clblx: this.clblx
      };
      let res=await this.m_apiFn(doCheckFileByProject)(param)
          if (res && res.statusCode == "200") {
            this.$message.success("可研报告解析成功");
          }
    },

  async sureHandle() {
    this.checkSubmit(this.treeData)
      if(this.checkFlag){
        this.$message.warning('请上传必传材料')
        return 
      }
      // 提交
      let params = {};
      if (this.isCommon) {
        params = {
          projectType: this.xmlx,
          businessType: this.ywlx,
          projectCode: this.rowData.projectCode,
          projectStatus: this.rowData.projectStatus,
          clblx: this.clblx,
          control: this.control
        };
      }else if(this.clblx == "IPHONEDIY_SK"){
        params = {
          projectCode:this.rowData.projectCode,
          projectStatus:this.rowData.projectStatus, 
          clblx:this.clblx, 
          xmfl:this.rowData.projectClassfiy,
          isForceType:this.rowData.isForceType
        }
      } else {
        params = {
          projectType: this.xmlx,
          businessType: this.ywlx,
          projectCode: this.rowData.projectCode ? this.rowData.projectCode : this.rowData.hybh,
          professionalType: this.professionalType,
          projectClassify: this.rowData.projectClassify,
          projectStatus: this.rowData.projectStatus,
          clblx: this.clblx,
          control: this.control
        };
      }
      // console.log(this.rowData,'rowData')
      // console.log(this.clblx,'clblx')
      // console.log(params,'p')
      console.log(this.rowData.declareIntelligentProjectClassify,'declareIntelligentProjectClassify')
      console.log(this.rowData.projectClassify,'projectClassify')
      let res=await this.m_apiFn(this.isCommon ? submitProject : this.clblx == "IPHONEDIY_SK" ? submitProjectUrl : submitSsFiles)(params)
          //  console.log(this.rowData.fromPage ,'this.rowData.fromPage')
          //  console.log(this.rowData.clblx ,'this.rowData.clblx')
          if(res.statusCode=='200'){
            if(this.rowData.fromPage=='项目申报'){
              // this.commonPassFlow()
              if(this.rowData.declareIntelligentStatus && this.rowData.declareIntelligentStatus == '1' && this.rowData.declareIntelligentProjectClassify && this.rowData.declareIntelligentProjectClassify.includes(this.rowData.projectClassify)){
                this.$confirm('材料信息提取校核中，请稍候!', '提示', {
                  confirmButtonText: '关闭至后台运行',
                  type: 'warning',
                  showCancelButton:false,
                  customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
                }).then(() => {
                  this.closeHandle("sureHandle");
                })
              }else{
                this.$message.success(res.result);
                this.closeHandle("sureHandle");


              }
              
              
            }else if(this.rowData.fromPage=='收口材料上传'){
              // this.closePass()
              if(this.rowData.closeupIntelligentStatus && this.rowData.closeupIntelligentStatus == '1' && this.rowData.closeupIntelligentProjectClassify && this.rowData.closeupIntelligentProjectClassify.includes(this.rowData.projectClassify)){
                this.$confirm('材料信息提取校核中，请稍候!', '提示', {
                  confirmButtonText: '关闭至后台运行',
                  type: 'warning',
                  showCancelButton:false,
                  customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
                }).then(() => {
                  this.closeHandle("sureHandle");
                })
              }else{
                this.$message.success(res.result);
                this.closeHandle("sureHandle");

              }

              
            }else{
              this.$message.success(res.result);
              this.closeHandle("sureHandle");
            }
          }else{
            // this.closeHandle("sureHandle");
          }
  },
   checkSubmit(arr){
    arr.map(item=>{
      if((item.sfbx&&item.sfbx=='01')&&(item.children&&item.children.length==0)){
         this.checkFlag=true
      }else if((item.sfbx&&item.sfbx=='01')&&(item.children&&item.children.length!=0)){
         this.checkFlag=false
      }
      if(item.children){
        this.checkSubmit(item.children)
      }
    })
   },
    //评审准备审批 
  async commonPassFlow(){
    let params={
      // processInstId:this.rowData.processPreInstId,
      projectCode:this.rowData.projectCode
    }
    // console.log(this.rowData.processInstId,'this.rowData.processInstId')
    let res=await this.m_apiFn(commonPassFlow)(params)
    if(res.statusCode==="200"){
      this.$message.success(res.result);
    }
  },
  //项目收口材料审批
  async closePass(){
    let params={
      projectCode:this.rowData.projectCode
    }
    // console.log(this.rowData.processInstId,'this.rowData.processInstId')
    let res=await this.m_apiFn(closePass)(params)
    if(res.statusCode==="200"){
      this.$message.success(res.result);
    }
  },

    saveHandle() {
      console.log(1111)
    },

    onSubmit() {
      this.$emit("onSubmit");
    },

    // 查看预估书
    onWatchClick() {
      this.estimationBookModalShow = true;
    },

    // 电子签章
   async openCustomSignature(data) {
    let res=await this.m_apiFn(expertStampCreateSignFile)({ fileIds: data.id })
          if (res && res.statusCode && res.statusCode == "200") {
            this.iframeUrl = res.result;
            const offsetHeight = document.body.offsetHeight;
            this.iframeHeight = offsetHeight * 0.9;
            this.customSignature = true;
          }
    },

    customSignatureCloseHandle() {
      let iframe = document.getElementById("header-iframe");
      iframe.contentWindow.postMessage("windowClose", "*");
      setTimeout(() => {
        this.iframeUrl = "";
        this.customSignature = false;
        this._getCltjbTree();
      }, 0);
    },

    //气泡点击
    badgeClick(item){
      console.log(item)
      this.batchImportRowData = {...item}
      this.batchImportRowData.checkList=[{...item}]
      if(this.batchImportRowData.uploadNum>1){
        this.batchImportTaskModelShow=false
        this.batchImportQueueModelShow=true
        this.getWorkList()
      }else{
        //如果只有1的情况,弹进度弹框
        this.m_apiFn(queryUploadWorkList)({materialId:this.batchImportRowData.materialId,batchCode:this.batchImportRowData.batchCode}).then(res=>{
          if(res.statusCode==="200"){
            this.batchImportModelShow=true
            this.batchFileList=res.result
          }
        })
      }
    },
     //批量上传
    async batchImport(item){
      let judgeHasUploadRes=await this.m_apiFn(judgeHasUploadProject)({batchCode:item.batchCode,clblx:this.clblx,trpIdStr:this.rowData.trpId,businessType:this.ywlx})
      if(judgeHasUploadRes.statusCode==="200"){
        this.batchFileList=[]
        let res=await this.m_apiFn(queryUploadSortNumber)({isMySelf:'1'})
        this.batchImportRowData = {...item}
        this.batchImportRowData.checkList=[{...item}]
        if (res.result===0) {
          this.batchImportModelShow=true
        } else {
          this.batchImportTaskNum=res.result
          this.batchImportTaskModelShow=true
        }
      }
      
    },
    //批量上传(有任务时)继续按钮
    nextTask(){
      this.batchImportTaskModelShow=false
      this.batchImportModelShow=true
    },
    //批量上传(有任务时)查看详情
    readTask(){
      this.batchImportTaskModelShow=false
      this.batchImportQueueModelShow=true
      this.m_apiFn(queryUploadWorkList)({isMySelf:"1"}).then(res=>{
        if(res.statusCode==="200"){
          this.batchImportQueueList=res.result
        }
      })
    },
    batchImportModelClose(){
      this._getCltjbTree();
      this.batchImportModelShow=false
    },
     //批量上传队列弹窗删除文件
    delQueueList(item){
      // 上传完成”状态的显示该按钮，点击按钮后，本条批量上传记录不会在显示再批量上传队列弹窗中。
      this.m_apiFn(confirmUploadWork)({materialId:item.materialId}).then(res=>{
        if(res.statusCode==="200"){
          this.$message.success("确认成功")
          this.getWorkList()
        }
      })
    },
    //队列弹窗确认
    batchImportQueueSubmit(item){
      this.m_apiFn(confirmUploadWork)({materialId:item.materialId}).then(res=>{
        if(res.statusCode==="200"){
          this.$message.success("确认成功")
          this.getWorkList()
        }
      })
      // 上传完成”状态的显示该按钮，点击按钮后，本条批量上传记录不会在显示再批量上传队列弹窗中。
    },
    //队列弹窗查看详情
    readQueueDetail(item){
      this.materialId=item.materialId
      this.reviewRecordModalShow=true
    },
    //队列弹窗关闭
    batchImportQueueModelShowClose(){
      this.batchImportQueueModelShow=false
      this.getTableData()
    },
    //获取队列数据
    getWorkList(){
      this.m_apiFn(queryUploadWorkList)({batchCode:this.rowData.batchCode}).then(res=>{
        if(res.statusCode==="200"){
          this.batchImportQueueList=res.result
        }
      })
    },

    //批量上传气泡
    badgeClick(item){
      console.log(item)
      this.batchImportRowData = {...this.rowData}
      this.batchImportRowData.checkList=[{...this.rowData}]
      if(this.batchImportRowData.uploadNum>1){
        this.batchImportTaskModelShow=false
        this.batchImportQueueModelShow=true
        this.getWorkList()
      }else{
        //如果只有1的情况,弹进度弹框
        this.m_apiFn(queryUploadWorkList)({materialId:this.batchImportRowData.materialId,batchCode:this.batchImportRowData.batchCode}).then(res=>{
          if(res.statusCode==="200"){
            this.batchImportModelShow=true
            this.batchFileList=res.result
          }
        })
      }
      
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
    top: 122px !important;
    .el-dialog__body {
      padding: 0px 20px 10px;
      box-sizing: border-box;
      max-height: 600px;
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
.importBlock {
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 15px;
  margin: 30px 0 5px;
  box-sizing: border-box;
  width: 100%;
  .importBody {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .importContent {
      line-height: 45px;
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
  .filsListBlock {
    box-sizing: border-box;
    width: 100%;
    margin: 12px 0;
    padding: 5px 9px;
    border-radius: 3px;
    border: 1px solid #409eff;
    display: flex;
    flex-wrap: wrap;
    .fileListIcon {
      border-right: 1px solid #1874d7;
    }
    .fileListBody {
      width: calc(100% - 80px);
      padding: 0 15px 6px;
      box-sizing: border-box;
      .fileListBodyClose {
        display: flex;
        justify-content: flex-end;
      }
    }
    .successBlock{
      width: 100%;
      border-top: 1px solid #409eff;
      margin-top: 10px;
      padding-top: 10px;
    }
  }
}
</style>
