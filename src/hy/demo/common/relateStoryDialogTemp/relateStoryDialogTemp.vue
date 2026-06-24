<template>
  <div>
    <hyNewModal id="modalCss" v-if="relateStoryModalShow" :dialogVisible='relateStoryModalShow' :title='title' :showClose="true" :ifSure="false" :ifCancle="false" width='80%' @closeHandle="relateStoryModalCancle" :modalAppendToBody="true" :appendToBody="true">
      <hyProjectForm v-if="hasRemove" :ifInLine="true" size="middle" labelPosition="left">
        <el-button type="danger" size="medium" class="mr20" @click="onMove">移除</el-button>
      </hyProjectForm>
      <!-- <div class="zw" style="height:20px"></div> -->
      <div class="total-content_table-content-info hy-table_content">
        <hyNewTable :ifHaveIndex="true" :column="columnConfig" v-if="tableHeight" :height="500" :tableData="tableData" :ifHaveCheckBox="true" @handleSelectionChange="handleSelectionChange" @rowDblclick="rowDblclick" :page="searchObj.page"  :pageSize="searchObj.rows">
          <!-- 确认状态 -->
          <template slot="isYesStatus" slot-scope="{data}">
            <span>{{ data.isYesStatus ? isYesStatusList[Number(data.isYesStatus)] : "--" }}</span>
          </template>

          <template slot="psyjwh" slot-scope="{data}">
            <span v-if="popType === 'peerReview'" style="color: #298bf5; cursor: pointer;" @click="downloadpsyjwh(data)">{{ data.psyjwh }}</span>
            <span v-else>{{ data.psyjwh }}</span>
          </template>

          <template slot="pfyjwh" slot-scope="{data}">
            <span v-if="popType === 'peerReview'" style="color: #298bf5; cursor: pointer;" @click="downloadpfyjwh(data)">{{ data.pfwh }}</span>
            <span v-else>{{ data.pfwh }}</span>
          </template>

          <template slot="clck" slot-scope="{data}">
            <el-tooltip effect="dark" content="申报材料查看" placement="top">
              <i class="icon iconfont iconshenbaocailiaochakan" @click.stop="materialCheck(data, 'IPHONEDIY_SB')" style="color: rgb(41, 139, 245)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="收口材料查看" placement="top">
              <i class="icon iconfont iconshoukoucailiaochakan" @click.stop="materialCheck(data, 'IPHONEDIY_SK')" style="color: rgb(41, 139, 245)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="盖章材料查看" placement="top">
              <i class="icon iconfont icongaizhangcailiaochakan" @click.stop="materialCheck(data, 'IPHONEDIY_GZSK')" style="color: rgb(41, 139, 245)"></i>
            </el-tooltip>
          </template>
          <template slot="ckyj" slot-scope="{data}">
            <el-tooltip effect="dark" content="评审前意见" placement="top">
              <i class="icon iconfont iconpingshenqianyijian" @click.stop="checkOpinions('', data)" style="color: rgb(41, 139, 245)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改意见" placement="top">
              <i class="icon iconfont iconxiugaiyijian" @click.stop="checkOpinions('0', data)" style="color: rgb(41, 139, 245)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="收口意见" placement="top">
              <i class="icon iconfont iconshoukouyijianchakan" @click.stop="checkOpinions('1', data)" style="color: rgb(41, 139, 245)"></i>
            </el-tooltip>
          </template>
          <template slot="operation" slot-scope="scope">
            <!-- 材料查看 -->
            <el-tooltip effect="dark" content="申报材料查看" placement="top">
              <i class="iconfont iconshenbaocailiaochakan" style="cursor: pointer;" @click="matericlView(scope.data)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="收口材料查看" placement="top">
              <i style="color:#409eff"  class="icon iconfont iconshoukoucailiaochakan" @click.stop="skMaterialScienceRead(scope.data)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="评审前意见" placement="top">
              <i class="iconfont iconpingshenqianyijian" style="cursor: pointer;" @click="xqyjck('',scope.data)"></i>
            </el-tooltip>
            <el-tooltip effect="dark" content="修改意见" placement="top">
              <i class="iconfont iconxiugaiyijian" style="cursor: pointer;" @click="xqyjck('0',scope.data)"></i>
            </el-tooltip>
          </template>

        </hyNewTable>
        <div class="hy_two_pageBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchObj.page" :page-sizes="[20, 40, 60, 100]" :page-size="searchObj.rows" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>



      <!-- 需求详情 -->
      <storyDetailShowDialogTemp ref="storyDetailShowDialogTemp" v-if="storyDetailShow" @storyDetailModalCancle="storyDetailShow=false"></storyDetailShowDialogTemp>
       <!-- 项目新增/修改弹框 -->
      <xqProjectEdit
        v-if="projectInfoDialogVisible"
        :dialogVisible="projectInfoDialogVisible"
        :apiParams="xqApiParams"
        :title="projectInfoModalTitle"
        :needProjectData="needProjectData"
        :disabled="projectInfoDisabled"
        :formData="projectInfoRowData"
        :batchData="projectInfoRowData"
        :submitBtnShow="false"
        :btnShow="true"
        page="yxProjectDeclaration"
        @closeHandle="projectInfoDialogVisible=false"
      >
      </xqProjectEdit>
      <!--需求新增/修改弹框-->
      <demandAddEditModal
        v-if="demandAddEditModalShow"
        :modalAppendToBody="true"
        :appendToBody="true"
        ref="demandModalRef"
        :demandType="'查看'"
        :demandSelectDatas="demandSelectDatas"
        :batchData="''"
        :batchRowData="demandSelectDatas[0]"
        :demandAddEditModalShow="demandAddEditModalShow"
        demandModelTitle="需求信息查看"
        @demandAddEditModalOnSubmit="demandAddEditModalCancle"
        @demandAddEditModalCancle="demandAddEditModalCancle"
      ></demandAddEditModal>
      <projectReport v-if="reportDialogVisible" :dialogVisible="reportDialogVisible" title="项目详情" :formData="projectRowData" :type="batchZylx" :disabled="true" :getDictTreeApi="queryDictTree" :queryOrgByUserOrgApi="queryOrgByUserOrg" :getAllDeptListApi="getAllDeptList" :queryProjectInfoForYwApi="queryProjectInfoForYw" :pageName="pageName" @closeHandle="reportCloseHandle"></projectReport>

      <materialUploadModal v-if="materialUploadDialogShow" :dialogVisible="materialUploadDialogShow" title="材料查看" :rowData="projectRowData" :isMaterialUpload="false" :clblx="clblx" :getCommonCltjbTree="getCommonCltjbTree" :downloadFile="downloadFile" :downloadFiles="downloadFiles" @closeHandle="closeMaterialUploadModal"></materialUploadModal>

      <checkOpinionsModal v-if="checkOpinionsModalDialogShow" :dialogVisible="checkOpinionsModalDialogShow" :rowData="projectRowData" :ywlx="ywlx" :xmbh="projectRowData.projectCode" :projectName="projectRowData.projectName" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" :queryPsyj="queryPsyj" :getXmPsqyj="getXmPsqyj" @closeHandle="checkOpinionsHandleClose"></checkOpinionsModal>

      <!-- 需求查看意见 -->
      <xqCheckOpinions v-if="xqCheckOpinionsModalDialogShow" :dialogVisible="xqCheckOpinionsModalDialogShow" :rowData="projectRowData" :ywlx="ywlx" :xmbh="projectRowData.projectCode" :projectName="projectRowData.projectName" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" @closeHandle="xqCheckOpinionsModalDialogShow=false"></xqCheckOpinions>

    </hyNewModal>
  </div>
</template>
<script>
import { columnConfig, csTableColumn } from "./config.js";
import storyDetailShowDialogTemp from "@/pages/common/storyDetailShowDialogTemp/storyDetailShowDialogTemp";
import demandAddEditModal from "@/pages/zhny_base/requirementBatchMangement/demandAddEditModal.vue";
import projectReport from "@/pages/common/projectReport/projectReport.vue";
import materialUpload from "@/pages/common/materialUpload/materialUpload.vue";
import checkOpinions from "@/pages/public/checkOpinions/checkOpinions.vue";
import xqCheckOpinions from "@/pages/common/xqCheckOpinions/xqCheckOpinions.vue";
import xqProjectEdit from "@/pages/common/xqProjectEdit/xqProjectEdit.vue";
import { queryPsyj,getXmPsqyj} from "@/api/projectManagement.js";
import {
  // getDictTree,
  queryOrgByUserOrg,
  getAllDeptList,
  queryProjectInfoForYw
} from "@/api/materialDeclaration.js";
import {queryDictTree} from "@/api/common.js";
import {
  getCommonCltjbTree,
  downloadFile,
  downloadFiles,
} from "@/api/common.js";

export default {
  name: "relateStoryDialogTemp", // 关联需求

  components: {
    storyDetailShowDialogTemp,
    projectReport,
    materialUploadModal: materialUpload,
    checkOpinionsModal: checkOpinions,
    demandAddEditModal,
    xqCheckOpinions,
    xqProjectEdit
  },

  props: {
    queryXmxq: {
      type: Function,
      default: () => null
    },
    deleteXmxq: {
      type: Function,
      default: () => null
    },
    projectType: {
      type: String,
      default: () => "PROJECTTYPE_XXH"
    },
    businessType: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      searchObj: { page: 1, rows: 20 },
      columnConfig: [],
      title: "",
      relateStoryModalShow: false,
      popType: "",
      popFormData: {},
      tableHeight: 0,
      tableData: [],
      total: 0,
      ztNoDeleteList: [],
      selectDatas: [],
      isYesStatus: "",
      isYesStatusList: ["未确认", "已确认"],
      pageName: "",
      reportDialogVisible: false,
      batchZylx: "",
      // getDictTree,
      queryDictTree,
      queryOrgByUserOrg,
      getAllDeptList,
      queryProjectInfoForYw,
      hasRemove: false,
      materialUploadDialogShow: false,
      projectRowData: {},
      clblx: "",
      getCommonCltjbTree,
      downloadFile,
      downloadFiles,
      queryPsyj,
      getXmPsqyj,
      checkOpinionsModalYjlx: "",
      checkOpinionsModalTitle: "",
      ywlx: "",
      checkOpinionsModalDialogShow: false,
      storyDetailShow:false,
      //需求详情
      demandAddEditModalShow: false,
      demandSelectDatas: "",
      xqCheckOpinionsModalDialogShow: false,
      apiParams:{},
      //需求新增弹框
      xqApiParams:{
        pageTypeTable: "xqSzhProjectDeclaration",
        projectType: "PROJECTTYPE_XQ",
        businessType: "BUSINESSTYPE_XQ",
        configType: "1"
      },
      projectInfoDialogVisible:false,
      projectSelectDatas:[],
      projectInfoModalTitle:"",
      projectInfoDisabled: false,
      projectInfoRowData: {},
      needProjectData:true,
    };
  },

  created() {},

  mounted() {},

  methods: {
    open(val) {
      this.relateStoryModalShow = val.relateStoryModalShow;
      this.title = val.popTitle;
      this.popType = val.popType;
      this.apiParams=val.apiParams
      // console.log("popType", this.popType);
      this.popFormData = Object.assign(val.popFormData);
      if (val.tableHeight) {
        this.tableHeight = val.tableHeight;
      } else {
        this.getTableClientHeight();
      }
      if (val.pageName) {
        this.pageName = val.pageName;
      }

      if (val.ywlx) {
        this.ywlx = val.ywlx;
      }

      if (this.pageName === "cs") {
        this.columnConfig = this.m_copy(csTableColumn);
        // this.popType === "construction" || this.popType === "peerReview" 项目申报和专家评审
        if (this.ywlx === "BUSINESSTYPE_CS" || this.ywlx === "BUSINESSTYPE_AQ") {
          // 初设概设和安全防护
          this.columnConfig.splice(
            this.columnConfig.findIndex(item => item.key === "professionalTypeName"),
            0,
            {
              key: "psyjwh",
              label: "评审意见",
              isSlot: true,
              slotName: "psyjwh",
              width: "200"
            },
            {
              key: "pfyjwh",
              label: "可研批复",
              isSlot: true,
              slotName: "pfyjwh",
              width: "200"
            }
          );
        }
      } else {
        this.columnConfig = this.m_copy(columnConfig);
      }

      if (val.hasRemove) {
        this.hasRemove = val.hasRemove;
      }
      this._queryXmxq();
    },

    // 获取需求列表数据
   async _queryXmxq() {
      let params = {
        xmbh:
          this.pageName === "cs"
            ? this.popFormData.kybh
            : this.popFormData.projectCode,
        pageType: "qForCsglyc",
        relationStatus:'1'
      };
      if (this.pageName === "cs") {
        params = Object.assign(params, {
          professionalType: "0",
          ywlx: "BUSINESSTYPE_KY"
        });
      }
      params.relationStatus='1'
      params.businessType=this.businessType
      params.projectCode=this.popFormData.projectCode
       params.professionalType=this.popFormData.professionalType
      params.investmentChannel=this.popFormData.investmentChannel
      params.projectType=this.projectType
      // params.projectType=this.projectType
      let resp=await this.m_apiFn(this.queryXmxq)(Object.assign(this.searchObj, params))
          if (resp.result && resp.result.rows && resp.result.rows.length) {
            this.tableData = resp.result.rows;
            this.total = resp.result.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
    },

    onMove() {
      if (this.selectDatas.length === 0) {
        this.$message.warning("请选择数据");
        return false;
      }

      this.$confirm("确定要移除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      })
        .then(() => {
          let params = {
            projectCode: this.popFormData.projectCode,
            relationProjectCodeStr: this.selectDatas.map(item => {
              if (this.pageName === "cs") {
                return item.projectCode;
              } else {
                return item.projectCode;
              }
            }).toString()
          };

          const rowData = this.selectDatas[0];
          if(rowData.businessType && rowData.businessType === "BUSINESSTYPE_XQ") {
            params.relationType="1"
          } else{
            params.relationType="2"
          } 

          this._deleteXmxq(params)
        })
        .catch(() => {});
    },
    async _deleteXmxq(params){
      let resp=await this.m_apiFn(this.deleteXmxq)(params)
      if (resp.statusCode === "200") {
        this.$message.success("移除成功！");
        this.relateStoryModalCancle("refresh");
        // this._queryXmxq();
        return;
      } else {
        return;
      }
    },
    // 弹框关闭
    relateStoryModalCancle(val) {
      this.relateStoryModalShow = false;
      this.$emit("relateStoryModalCancle", val);
    },

    // 多选事件
    handleSelectionChange(val) {
      this.selectDatas = val;
    },

    // 双击需求编号可查看需求详情
   async rowDblclick(e, i) {
      this.projectInfoDisabled=true
      this.needProjectData=true
      this.projectInfoModalTitle="查看"
      this.projectInfoRowData={...e}
      this.projectInfoDialogVisible = true
      // if (this.pageName === "cs") {
      //   this.projectRowData = this.m_copy(e);
      //   this.batchZylx = e.professionalType === "0" ? "js" : "yw";
      //   this.reportDialogVisible = true;
      // } else {
      //   let res=await this.m_apiFn(getUpdateModelValue)({tdrpId:e.tdrpId})
      //     if(res.statusCode==="200"){
      //       this.demandSelectDatas=[res.result]
      //       //需要需求快照按钮
      //       if(this.title==="查看关联需求"){
      //         this.demandSelectDatas[0].needSnapshot=true
      //         this.demandSelectDatas[0].xmbh=this.popFormData.projectCode
      //       }
      //       if(e.professionalType==="0"){
      //         this.demandAddEditModalShow = true
      //       }else{
      //         this.demandAddEditYWModalShow = true
      //       }
      //     }else{
      //       // this.$message.warning(res.message);
      //     }
        
      // }
    },

    demandAddEditModalCancle() {
      this.demandAddEditModalShow = false;
    },

    reportCloseHandle() {
      this.reportDialogVisible = false;
    },

    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.rows = e;
      this._queryXmxq();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this._queryXmxq();
    },

   async downloadpsyjwh(data) {
    let res=await this.m_apiFn(downloadFile)({ clid: data.psyjclid })
    },

   async downloadpfyjwh(data) {
      let res=await this.m_apiFn(downloadFile)({ clid: data.pfyjclid })
    },

    // 获取表格占高
    getTableClientHeight() {
      // offsetH body高度
      this.tableHeight = 0;
      let offsetH = document.getElementsByClassName("routerView")[0]
        .clientHeight;
      let pageBox = document.getElementsByClassName("hy_two_pageBox")[0]
        .clientHeight;
      this.$nextTick(() => {
        if (offsetH) {
          const tableH = offsetH - pageBox;
          this.tableHeight = tableH;
        }
      });
    },

    // 确定
    onSubmit() {},

    // 取消
    onCancle() {
      this.relateStoryModalShow = false;
    },

    // 申报材料查看
    materialCheck(data, clblx) {
      this.projectRowData = data;
      this.clblx = clblx;
      this.materialUploadDialogShow = true;
    },

    // 关闭申报材料上传弹窗
    closeMaterialUploadModal() {
      this.materialUploadDialogShow = false;
    },

    // 意见查看
    checkOpinions(yjlx, row) {
      this.projectRowData = row;
      this.checkOpinionsModalYjlx = yjlx;
      switch (yjlx) {
        case "":
          this.checkOpinionsModalTitle = "评审前意见";
          break;
        case "0":
          this.checkOpinionsModalTitle = "修改意见";
          break;
        case "1":
          this.checkOpinionsModalTitle = "收口意见";
          break;
        default:
          break;
      }
      this.checkOpinionsModalDialogShow = true;
    },

    // 意见查看弹窗关闭
    checkOpinionsHandleClose() {
      this.checkOpinionsModalDialogShow = false;
    },

    // 需求材料查看弹窗打开
    matericlView(row) {
      this.clblx = "IPHONEDIY_SB";
      this.projectRowData = row;
      this.projectRowData.xmbh = this.projectRowData.projectCode;
      this.projectRowData.ywlx = "BUSINESSTYPE_XQ";
      this.projectRowData.xmlx = "PROJECTTYPE_XQ";
      this.projectRowData.projectClassify = this.projectRowData.demandCategory;
      this.materialUploadDialogShow = true;
    },

    // 需求收口材料查看
		skMaterialScienceRead(row){
      this.projectRowData = row;
      this.projectRowData.xmbh = this.projectRowData.projectCode;
      this.projectRowData.ywlx = "BUSINESSTYPE_XQ";
      this.projectRowData.xmlx = "PROJECTTYPE_XQ";
      this.projectRowData.projectClassify = this.projectRowData.demandCategory;
      this.clblx = "IPHONEDIY_SK";
      this.materialUploadDialogShow = true;
    },

    // 需求意见查看
    xqyjck(yjlx,row) {
      this.projectRowData = row;
      this.projectRowData.xmbh = row.projectCode;
      this.projectRowData.projectName = row.projectName;
      this.checkOpinionsModalYjlx = yjlx;
      switch (yjlx) {
        case "":
          this.checkOpinionsModalTitle = "评审前意见";
          break;
        case "0":
          this.checkOpinionsModalTitle = "修改意见";
          break;
        default:
          break;
      }
      this.xqCheckOpinionsModalDialogShow = true;
    },
  }
};
</script>
<style scoped>
.footerBtn {
  height: 80px;
  margin-top: 18px;
  text-align: center;
}
</style>