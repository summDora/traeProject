<template>
  <div>
    <hyModal v-if="modalShow" :dialogVisible='modalShow' :title='title' :ifThird="true" :ifSure="false" :ifCancle="false" width='80%' @closeHandle="modalCloseHandle">

      <div class="hy-new-search-box" v-if="title === '关联概设项目'">
        <hyProjectForm :formConfig="searchConfig" :formData="searchObj" @onSearch="onSearch" @onReset="onReset" :ifSearch="true" :isReset="true" @formSelectChange="formSelectChange">
        </hyProjectForm>
      </div>

      <div class="total-content_table-content-info hy-table_content">
        <hyNewTable :ifHaveIndex="true" :column="columnConfig" :height="500" :tableData="tableData" :ifHaveCheckBox="true" @handleSelectionChange="handleSelectionChange" @rowDblclick="rowDblclick" :page="searchObj.page" :pageSize="searchObj.rows">
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

        </hyNewTable>
        <div class="hy_two_pageBox">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchObj.page" :page-sizes="[20, 40, 60, 100]" :page-size="searchObj.rows" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>

      <component :is="projectReport"  v-if="reportDialogVisible" :dialogVisible="reportDialogVisible" title="项目详情" :formData="projectRowData" :type="batchZylx" :disabled="true" :getDictTreeApi="getDictTree" :queryOrgByUserOrgApi="queryOrgByUserOrg" :getAllDeptListApi="getAllDeptList" :queryProjectInfoForYwApi="queryProjectInfoForYw" :pageName="pageName" @closeHandle="reportCloseHandle"></component>

      <materialUploadModal v-if="materialUploadDialogShow" :dialogVisible="materialUploadDialogShow" title="材料查看" :rowData="projectRowData" :isMaterialUpload="false" :clblx="clblx" :getCommonCltjbTree="getCommonCltjbTree" :downloadFile="downloadFile" :downloadFiles="downloadFiles" @closeHandle="closeMaterialUploadModal"></materialUploadModal>

      <checkOpinionsModal v-if="checkOpinionsModalDialogShow" :dialogVisible="checkOpinionsModalDialogShow" :ywlx="ywlx" :rowData="projectRowData" :xmbh="projectRowData.xmbh" :projectName="projectRowData.projectName" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" :queryPsyj="queryPsyj" :getXmPsqyj="getXmPsqyj" @closeHandle="checkOpinionsHandleClose"></checkOpinionsModal>

      <template slot="footer">
        <div v-if="title === '关联概设项目'">
          <el-button size="medium" @click="modalCloseHandle">取消</el-button>
          <el-button size="medium" type="primary" @click="sureHandle">确认</el-button>
        </div>
      </template>
    </hyModal>
  </div>
</template>
<script>
import { searchConfig, searchData, tableColumn } from "./config.js";
import csProjectReport from "@/pages/common/csProjectReport/csProjectReport.vue";
import kyProjectReport from "@/pages/common/projectReport/projectReport.vue";
import materialUpload from "@/pages/common/materialUpload/materialUpload.vue";
import checkOpinions from "@/pages/common/checkOpinions/checkOpinions.vue";
import {
  getDictTree,
  queryOrgByUserOrg,
  getAllDeptList,
  queryProjectInfoForYw,
  queryProjectListInPage,
  saveXmAq
} from "@/api/materialDeclaration.js";

import {
  getCommonCltjbTree,
  downloadFile,
  downloadFiles,
  queryPsyj,
  getXmPsqyj,
  queryPcbhmcByYear,
  queryProjectById
} from "@/api/projectManagement.js";

export default {
  name: "relatedCsbh", // 关联概设

  components: {
    csProjectReport,
    kyProjectReport,
    materialUploadModal: materialUpload,
    checkOpinionsModal: checkOpinions
  },

  props: {
    modalShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ""
    },
    rowData: {
      type: Object,
      default: {}
    },
    ywlx: {
      type: String,
      default: ""
    }
  },

  data() {
    return {
      searchConfig,
      searchObj: this.m_copy(searchData),
      columnConfig: this.m_copy(tableColumn),
      tableData: [],
      total: 0,
      selectDatas: [],
      reportDialogVisible: false,
      batchZylx: "",
      getDictTree,
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
      ywlx: "BUSINESSTYPE_AQ",
      checkOpinionsModalDialogShow: false,
      projectReport: this.ywlx === "BUSINESSTYPE_KY" ? kyProjectReport : csProjectReport
    };
  },

  mounted() {
    this.getSearchList();
    this.getOrgByUserOrg();
    // 获取专业类型
    this.getDict("APP_SHZ_ZYLX");

    if (this.rowData.page === "demandFeasibilityStudyComparisonTable") {
      this.columnConfig.splice(
        this.columnConfig.findIndex(item => item.key === "erpxmbh"),
        1,
        {
          key: "xmbh",
          label: "项目编码",
          width: "125"
        }
      );
    }

    this.getTableData();
  },

  methods: {
    getSearchList() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY",
        batchYear: this.searchObj.batchYear,
        professionalType: "0"
      };

      this.m_apiFn(queryPcbhmcByYear, param)
        .then(res => {
          if (res && res.result) {
            for (const iterator of this.searchConfig) {
              if (iterator.key === "batchCode") {
                iterator.options = res.result;
                iterator.options.unshift({ PCMC: "全部", PCBH: "" });
              }
            }
          }
        })
        .catch(err => {});
    },

    // 查找项目单位
    getOrgByUserOrg() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: this.ywlx
      };
      this.m_apiFn(queryOrgByUserOrg, param)
        .then(res => {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "sbdws") {
              iterator.options = res.result;
              iterator.options.unshift({ orgName: "全部", orgId: "" });
            }
          }
        })
        .catch(err => {});
    },

    getDict(dataVal) {
      this.m_apiFn(getDictTree, dataVal).then(resp => {
        if (resp.result.children && resp.result.children.length > 0) {
          for (const iterator of this.searchConfig) {
            if (dataVal === "APP_SHZ_ZYLX" && iterator.key === "professionalType") {
              iterator.options = resp.result.children;
              iterator.options.unshift({ dataLabel: "全部", dataVal: "" });
            }
          }
        }
      });
    },

    formSelectChange(key, v) {
      if (key === "batchYear") {
        this.searchObj.batchCode = "";
        this.getSearchList();
      }
    },

    onSearch(e) {
      this.searchObj = Object.assign(this.searchObj, e, {
        page: 1
      });
      this.getTableData();
    },

    onReset() {
      this.searchObj = this.m_copy(searchData);
      this.getTableData();
    },

    getTableData() {
      let param = this.m_copy(this.searchObj);

      if (this.title === "关联概设项目") {
        param = Object.assign(param, {
          xmlx: "PROJECTTYPE_XXH",
          ywlx: "BUSINESSTYPE_CS",
          // professionalType: "0",
          sbdws: param.sbdws.join(","),
          pageType: "qForAqCsgl"
        });

        this.m_apiFn(queryProjectListInPage, param)
          .then(res => {
            if (
              res &&
              res.result &&
              res.result.rows &&
              res.result.rows.length > 0
            ) {
              this.tableData = res.result.rows;
              this.tabletTotal = res.result.total;
            } else {
              this.tableData = [];
              this.tabletTotal = 0;
            }
          })
          .catch(err => {});
      } else {
        param = Object.assign(param, {
          xmbh:
            this.rowData.page === "demandFeasibilityStudyComparisonTable"
              ? this.rowData.kyxmbh
              : this.rowData.csbh,
          // professionalType: "0",
          ywlx:
            this.rowData.page === "demandFeasibilityStudyComparisonTable"
              ? "BUSINESSTYPE_KY"
              : "BUSINESSTYPE_CS",
          sbdws: param.sbdws.join(",")
        });
        if(param.batchYear) {
          delete param.batchYear
        }

        this.m_apiFn(queryProjectById, param)
          .then(resp => {
            if (resp.result && resp.result.rows && resp.result.rows.length) {
              this.tableData = resp.result.rows;
              this.total = resp.result.total;
            } else {
              this.tableData = [];
              this.total = 0;
            }
          })
          .catch();
      }
    },

    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.rows = e;
      this.getTableData();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this.getTableData();
    },

    // 弹框关闭
    modalCloseHandle(val) {
      this.$emit("modalCloseHandle", val);
    },

    // 多选事件
    handleSelectionChange(val) {
      this.selectDatas = val;
    },

    sureHandle() {
      if (this.selectDatas.length === 0) {
        this.$message.warning("请选择数据");
        return false;
      }

      if (this.selectDatas.length > 1) {
        this.$message.warning("请选择一条数据");
        return false;
      }

      let list = [];
      for (const iterator of this.selectDatas) {
        list.push(iterator.xmbh);
      }

      let param = Object.assign(this.rowData, {
        xqbhs: list,
        type: "3"
      });

      this.m_apiFn(saveXmAq, param)
        .then(res => {
          if (res && res.statusCode === "200") {
            this.$message.success("关联成功");
            this.modalCloseHandle("refresh");
          }
        })
        .catch(err => {});
    },

    // 双击需求编号可查看需求详情
    rowDblclick(e, i) {
      this.projectRowData = this.m_copy(e);
      this.batchZylx = e.professionalType === "0" ? "js" : "yw";
      this.reportDialogVisible = true;
    },

    reportCloseHandle() {
      this.reportDialogVisible = false;
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
    }
  }
};
</script>
<style lang="less" scoped>
</style>