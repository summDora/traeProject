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


      <!-- 需求评审前意见 -->
      <xqCheckOpinions v-if="xqCheckOpinionsModalDialogShow" :dialogVisible="xqCheckOpinionsModalDialogShow" :rowData="projectRowData" :ywlx="ywlx" :xmbh="projectRowData.projectCode" :xmmc="projectRowData.projectName" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" @closeHandle="xqCheckOpinionsModalDialogShow=false"></xqCheckOpinions>
      <!-- 需求修改意见 -->
      <xqXgCheckOpinions v-if="xqXgCheckOpinionsModalDialogShow" :dialogVisible="xqXgCheckOpinionsModalDialogShow" :rowData="projectRowData" :ywlx="ywlx" :xmbh="projectRowData.projectCode" :xmmc="projectRowData.projectName" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" :queryPsyj="queryPsyj" :getXmPsqyj="getXmPsqyj" @closeHandle="xqXgCheckOpinionsModalDialogShow=false"></xqXgCheckOpinions>
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
        @xqSnapshotHandler="xqSnapshotHandler"
        :xqlskz="xqlskz"
        page="yxProjectDeclaration"
        @closeHandle="projectInfoDialogVisible=false"
      >
      </xqProjectEdit>
      <xqProjectEditSnapshot
        v-if="projectInfoDialogSnapshotVisible"
        :dialogVisible="projectInfoDialogSnapshotVisible"
        :apiParams="xqApiParams"
        :title="projectInfoModalSnapshotTitle"
        :needProjectData="needProjectSnapshotData"
        :disabled="projectInfoSnapshotDisabled"
        :formData="projectInfoRowSnapshotData"
        :kyformData="popFormData"
        :batchData="projectInfoRowSnapshotData"
        :submitBtnShow="false"
        :btnShow="true"
        page="yxProjectDeclaration"
        @closeHandle="projectInfoDialogSnapshotVisible=false"
      >
      </xqProjectEditSnapshot>

    </hyNewModal>
  </div>
</template>
<script>
import { columnConfig } from "./config.js";
import storyDetailShowDialogTemp from "@/pages/common/storyDetailShowDialogTemp/storyDetailShowDialogTemp";
import demandAddEditModal from "@/pages/zhny_base/requirementBatchMangement/demandAddEditModal.vue";
import projectReport from "@/pages/common/projectReport/projectReport.vue";
import materialUpload from "@/pages/common/materialUpload/materialUpload.vue";
import xqCheckOpinions from "@/pages/common/xqCheckOpinions/xqCheckOpinions.vue";
import xqXgCheckOpinions from "@/pages/common/xqCheckOpinions/xqXgCheckOpinions.vue";

import xqProjectEdit from "@/pages/common/xqProjectEdit/xqProjectEdit.vue";
import xqProjectEditSnapshot from "@/pages/common/xqProjectEditSnapshot/xqProjectEditSnapshot.vue";

import {
  // getDictTree,
  queryOrgByUserOrg,
  getAllDeptList,
  queryProjectInfoForYw
} from "@/api/materialDeclaration.js";
import {queryDictTree} from "@/api/common.js";
import {
  getDemandTableData,    //获取需求详情
} from "@/api/requirementBatchMangement";
import {
  getCommonCltjbTree,
  downloadFile,
  downloadFiles,
  queryPsyj,
  getXmPsqyj
} from "@/api/common.js";

export default {
  name: "relateStoryDialogTemp", // 关联需求

  components: {
    storyDetailShowDialogTemp,
    projectReport,
    materialUploadModal: materialUpload,
    demandAddEditModal,
    xqCheckOpinions,
    xqXgCheckOpinions,
    xqProjectEdit,
    xqProjectEditSnapshot,
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
      default: () => ""
    },
    xqlskz: {
      type: Boolean,
      default: () => false
    },
    businessType: {
      type: String,
      default: () => ""
    }
  },

  data() {
    return {
      searchObj: { page: 1, rows: 20 },
      columnConfig,
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
      projectRowData: {},
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
      xqXgCheckOpinionsModalDialogShow:false,
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

      //需求快照
      projectInfoDialogSnapshotVisible:false,
      projectInfoModalSnapshotTitle:'',
      needProjectSnapshotData:true,
      projectInfoSnapshotDisabled:false,
      projectInfoRowSnapshotData:{},




    };
  },

  created() {},

  mounted() {},

  methods: {
    open(val) {
      this.relateStoryModalShow = val.relateStoryModalShow;
      this.title = val.popTitle;
      this.popType = val.popType;
      // console.log("popType", this.popType);
      console.log(val,'val111')
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
        pageType: "qForCsglyc"
      };
      if (this.pageName === "cs") {
        params = Object.assign(params, {
          zylx: "0",
          ywlx: "BUSINESSTYPE_KY"
        });
      }
      params.relationStatus='1'
      params.businessType=this.businessType
      params.projectCode=this.popFormData.projectCode
      params.professionalType=this.popFormData.professionalType
      params.investmentChannel=this.popFormData.investmentChannel
      params.projectType=this.projectType
      console.log(this.popFormData,'this.popFormData111')
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
                return item.serialNumber;
              } else {
                return item.serialNumber;
              }
            }).toString(),
          };

          const rowData = this.selectDatas[0];
          params.relationType='1'

          this._deleteXmxq(params)
        })
        .catch(() => {});
    },
    async _deleteXmxq(params){
      let resp=await this.m_apiFn(this.deleteXmxq)(params)
      if (resp.statusCode === "200") {
        this.$message.success("移除成功！");
        await this._queryXmxq();
        console.log(this.tableData,'this.tableData')
        if(this.tableData.length == 0){
          this.relateStoryModalCancle("refresh");
        }
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
    },
    xqSnapshotHandler(e){
      // console.log('111111111111111')
      this.projectInfoSnapshotDisabled=true
      this.needProjectSnapshotData=true
      this.projectInfoModalSnapshotTitle="查看"
      this.projectInfoRowSnapshotData={...e}
      this.projectInfoDialogSnapshotVisible = true
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


    // 关闭申报材料上传弹窗
    closeMaterialUploadModal() {
      this.materialUploadDialogShow = false;
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
      this.projectRowData.xmfl = this.projectRowData.demandCategory;
      this.projectRowData.xmlx = "PROJECTTYPE_XQ";
      this.materialUploadDialogShow = true;
    },

    // 需求收口材料查看
		skMaterialScienceRead(row){
      this.projectRowData = row;
      this.projectRowData.xmbh = this.projectRowData.projectCode;
      this.projectRowData.ywlx = "BUSINESSTYPE_XQ";
      this.projectRowData.xmfl = this.projectRowData.demandCategory;
      this.clblx = "IPHONEDIY_SK";
      this.projectRowData.xmlx = "PROJECTTYPE_XQ";
      this.materialUploadDialogShow = true;
    },

    // 需求意见查看
    xqyjck(yjlx,row) {
      this.projectRowData = row;
      this.projectRowData.xmbh = row.projectCode;
      this.projectRowData.xmmc = row.projectName;
      this.checkOpinionsModalYjlx = yjlx;
      switch (yjlx) {
        case "":
          this.checkOpinionsModalTitle = "评审前意见";
          this.xqCheckOpinionsModalDialogShow = true;
          break;
        case "0":
          this.checkOpinionsModalTitle = "修改意见";
          this.xqXgCheckOpinionsModalDialogShow=true
          break;
        default:
          break;
      }
      
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