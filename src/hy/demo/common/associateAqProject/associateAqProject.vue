<template>
  <div>
    <hyModal v-if="modalShow" :dialogVisible='modalShow' :title='title' :ifSure="true" :ifCancle="true" width='80%' @closeHandle="modalCloseHandle" @sureHandle="sureHandle">

      <div class="hy-new-search-box">
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

      <projectReport v-if="reportDialogVisible" :dialogVisible="reportDialogVisible" title="项目详情" :formData="projectRowData" :type="batchZylx" :disabled="true" :getDictTreeApi="getDictTree" :queryOrgByUserOrgApi="queryOrgByUserOrg" :getAllDeptListApi="getAllDeptList" :queryProjectInfoForYwApi="queryProjectInfoForYw" :pageName="pageName" @closeHandle="reportCloseHandle"></projectReport>

      <materialUploadModal v-if="materialUploadDialogShow" :dialogVisible="materialUploadDialogShow" title="材料查看" :rowData="projectRowData" :isMaterialUpload="false" :clblx="clblx" :getCommonCltjbTree="getCommonCltjbTree" :downloadFile="downloadFile" :downloadFiles="downloadFiles" @closeHandle="closeMaterialUploadModal"></materialUploadModal>

      <checkOpinionsModal v-if="checkOpinionsModalDialogShow" :dialogVisible="checkOpinionsModalDialogShow" :ywlx="ywlx" :rowData="projectRowData" :xmbh="projectRowData.xmbh" :projectName="projectRowData.projectName" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" :queryPsyj="queryPsyj" :getXmPsqyj="getXmPsqyj" @closeHandle="checkOpinionsHandleClose"></checkOpinionsModal>
    </hyModal>
  </div>
</template>
<script>
import { searchConfig, searchData, tableColumn } from "./config.js";
import projectReport from "@/pages/common/aqProjectReport/aqProjectReport.vue";
import materialUpload from "@/pages/common/materialUpload/materialUpload.vue";
import checkOpinions from "@/pages/common/checkOpinions/checkOpinions.vue";
import {
  getDictTree,
  queryOrgByUserOrg,
  getAllDeptList,
  queryProjectInfoForYw,
  queryProjectListInPage,
  saveXmAq,
  saveXmKy
} from "@/api/materialDeclaration.js";

import {
  getCommonCltjbTree,
  downloadFile,
  downloadFiles,
  queryProjectById
} from "@/api/common.js";

export default {
  name: "associateAqProject", // 关联安全

  components: {
    projectReport,
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
      default: "关联安全防护"
    },
    rowData: {
      type: Object,
      default: {}
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
      checkOpinionsModalDialogShow: false
    };
  },

  mounted() {
    this.getSearchList();
    this.getOrgByUserOrg();

    this.getTableData();
  },

  methods: {
    getSearchList() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY",
        batchYear: this.searchObj.batchYear
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
              iterator.data = res.result;
            }
          }
        })
        .catch(err => {});
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
      let param = {};
      param = Object.assign(param, this.searchObj, {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: this.ywlx,
        sbdws: this.searchObj.sbdws.join(","),
        pageType: "qForCsAqgl"
      });
      this.m_apiFn(queryProjectListInPage, param)
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

      this.m_apiFn(saveXmKy, param)
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