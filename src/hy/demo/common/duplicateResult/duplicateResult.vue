<template>
	<div>
   <hyNewModal id="modalCss" :dialogVisible='dialogVisible' :title='title'  :showClose="true" :ifSure="ifSure" :ifCancle="ifCancle" width='1580px' @closeHandle="meetSchemeModalCancle" :modalAppendToBody="true" :appendToBody="true">
        <div v-if="isProject" class="project-content">
            <div>项目名称：{{ rowData.projectName }}</div>
            <div>可研编号：{{ rowData.xmbh }}</div>
        </div>
        <div class="total-content_table-content-title" ref="searchRef">
          <hyProjectForm 
            style="position:relative"
            id="elFromCss" 
            :ref="EditRef" 
            :ifInLine="true" 
            :formData="searchData"
            :rules="rules"
            :formConfig="isProject?FormConfig:ccjgFormConfig" 
            :ifSearch="true"
            :isReset="true"
            class="elfrom"
            @onSearch="onSearch"
            @onReset="onReset"
            @formSelectchange="formSelectChanged"
            >
      <div style="position: absolute;top: 0px;right: 501px;width: 7px;height: 2px;background: black;"></div>
          </hyProjectForm>
        </div>
        <div class="total-content_table-content-message">
              <div>
                <hyNewButtons
                  :buttonsData="buttonsData"
                  @selectButtons="selectButtons"
                >
                </hyNewButtons>
              </div>
            </div>
          <div class="total-content_table-content-info hy-table_content ">
              <hyNewTable
                :ifFixed="true"
                :ifHaveIndex="true"
                :column="isProject?newColumn:columnConfig"
                :height="390"
                :tableData="tableData"
                :ifHaveCheckBox="true"
                @handleSelectionChange="handleSelectionChange"
                @cellClick="handleCellClick"
                :page="searchData.page"
                :pageSize="searchData.rows"
              >
              <!-- 项目名称 -->
              <template slot="projectName" slot-scope="scope">
                <el-tooltip placement="top" trigger="hover" class="popperClass">
                    <div slot='content' class="tooltipContent" v-html='scope.data.projectName'> </div> 
                    <div v-html='scope.data.projectName'></div>
                </el-tooltip>
              </template>
              <!-- 历史项目名称 -->
              <template slot="cxmmc" slot-scope="scope">
                <el-tooltip placement="top" trigger="hover" class="popperClass">
                    <div slot='content' class="tooltipContent" v-html='scope.data.cxmmc'> </div> 
                    <div v-html='scope.data.cxmmc'></div>
                </el-tooltip>
              </template>
              <!-- 项目研究内容 -->
              <template slot="jsnr" slot-scope="scope">
                <el-tooltip placement="top" trigger="hover" class="popperClass">
                    <div slot='content' class="tooltipContent" v-html='scope.data.jsnr'> </div> 
                    <div v-html='scope.data.jsnr'></div>
                </el-tooltip>
              </template>
              <!-- 历史研究内容 -->
              <template slot="cjsnr" slot-scope="scope">
                <el-tooltip placement="top" trigger="hover" class="popperClass">
                    <div slot='content' class="tooltipContent" v-html='scope.data.cjsnr'> </div> 
                    <div v-html='scope.data.cjsnr'></div>
                </el-tooltip>
              </template>

              <!-- 名称重复率 -->
                <template slot="cxqbh" slot-scope="scope">
                    <span style="cursor:pointer;color:#409eff" @click="goCxqbh(scope.data.cxqbh)">
                       {{scope.data.cxqbh}}
                    </span>
                </template>
              	<!-- 名称重复率 -->
                <template slot="sxmmc" slot-scope="scope">
                    <span style>
                       {{Number(scope.data.sxmmc).toFixed(2)}}%
                    </span>
                </template>
                <!-- 内容重复率 -->
                <template slot="sjsnr" slot-scope="scope">
                    <span style="">
                       {{Number(scope.data.sjsnr).toFixed(2)}}%
                    </span>
                </template>
                <!-- 总重复率 -->
                <template slot="ccjg" slot-scope="scope">
                    <span >
                       {{Number(scope.data.ccjg).toFixed(2)}}%
                    </span>
                </template>

              </hyNewTable>
              <div class="hy_two_pageBox">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :current-page="searchData.page"
                  :page-sizes="[20, 40, 60, 100]"
                  :page-size="searchData.rows"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total"
                ></el-pagination>
              </div>
            </div>
   </hyNewModal>
       <!--新增、修改、删除-->
     <kjProjectInfoModal  ref="editProject" v-if="projectInfoDialogVisible" type="xm" :dialogVisible="projectInfoDialogVisible" 
    :title="projectInfoModalTitle" :disabled="true" :formData="projectInfoRowData" @closeHandle="projectInfoDialogVisible=false"
     :ifCancle="false"  :btnShow="true"  :submitBtnShow="false"  :ifSure="false"  ></kjProjectInfoModal>
	</div>
</template>
<script>
// import {
//   getKindList,
//   getHyXmxx,
//   updateHyxm,
//   getSelectZj,
//   getUnSelectZj,
//   removeHyXmxx,
//   updateHyxx,
//   deleteHyxmGroup,
//   importHyxmGroup,
//   exportHyxmGroup,
//   addHyxmZj,
//   delHyxmZj,
//   querySysOrgTree,
//   meetManage,
//   getMapGroupTree,
//   setZjRole
// } from "@/api/meetManage";
import kjProjectInfo from "@/pages/common/kjProjectInfo/kjProjectInfo";
import {  getList} from "@/api/feasibilityReport";

import common from "@/utils/common";
import {
    ccjgFormConfig,
    ccjgFormData,
    ccjgFormRules,
    buttonsData,
    columnConfig
} from "./config.js";
import {
     FormConfig,formData,
    newColumn} from "./newconfig.js";

export default {
  name: "duplicateResult", // 查重结果
    components: {
      kjProjectInfoModal:kjProjectInfo
    },
  props: {
    ywlx: {
      type: String,
      default: "BUSINESSTYPE_KY"
    },
    dialogVisible: {
      type: Boolean,
      required: true,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    },
    isProject:{
      type: Boolean,
      required: true,
      default: () => false
    },
    rowData:{
      type: Object,
      default: () => {}
    },
    getHyXmxx:{
       type: Function,
      default: () => null
    },
    exportCheckResult:{
       type: Function,
      default: () => null
    },
    ifSure: {
      type: Boolean,
      default: () => true
    },
    ifCancle: {
      type: Boolean,
      default: () => true
    },
  },
  data() {
    return {
      EditRef: "EditRef",
      searchConfig : this.m_copy(ccjgFormConfig),
      rules: ccjgFormRules,
      searchData: this.m_copy(ccjgFormData),
      columnConfig,
      buttonsData,
      tableHeight: 0,
      tableData: [], // 关联项目列表数据容器
      total: 0,
      selectDatas: [],
      //
      FormConfig,
      formData,
      newColumn,
      // 新增
      projectInfoDialogVisible: false,
      projectInfoModalTitle: "",
      projectInfoDisabled: true,
      projectInfoRowData:{},
      submitBtnShow:false,
    };
  },

  created() {
    if(this.isProject){
      this.searchData=this.m_copy(formData)
    }else{
      this.searchData=this.m_copy(ccjgFormData)
    }
  },

  mounted() {
      this.getTableClientHeight();
      this._getHyXmxx()
  },

  methods: {
    // 获取关联项目列表信息
    _getHyXmxx() {
      const params = Object.assign({}, this.searchData, { xmbh: this.rowData.xmbh,ywlx:this.ywlx });
      this.m_apiFn(this.getHyXmxx, params)
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

    //弹框关闭
    meetSchemeModalCancle() {
      // this.dialogVisible = false;
      this.$emit('closeHandle')
    },
    goCxqbh(xmbh){
      let param={page: 1,
      rows: 20,
      pageType:'kysb'}
      param.xmzts = xmbh
      param.ywlx=this.ywlx
         this.m_apiFn(getList,param).then(resp => {
        if (resp.result) {
          this.projectInfoModalTitle = '项目查看'
          this.projectInfoDialogVisible=true
          this.projectInfoRowData={...resp.result.rows[0]}  
        }
      });

      

    },
    formSelectChanged(){

    },
    onReset(){
      if(this.isProject){
        this.searchData=this.m_copy(formData)
      }else{
        this.searchData=this.m_copy(ccjgFormData)
      }
      this._getHyXmxx()

    },
    onSearch(){
      if(this.searchData.ccjgmin>this.searchData.ccjgmax){
        this.$message.warning('请正确输入查重结果')
      }
      this.searchData.page=1
      this._getHyXmxx()
    },
    handleCellClick(){
      
    },
    // 按钮选择事件
    selectButtons(e) {
      switch (e.text) {
        case "选择评审项目":
          this.onChoosePSProject();
          break;
        case "项目分组":
          this.onPeojectGroup();
          break;
        case "专家指派":
          this.onZJAssgin();
          break;
        case "移除":
          this.onMove();
          break;
        case "导入":
          this.onImport();
          break;
        case "查重结果导出":
          this.onExport();
          break;
      }
    },

    //多选事件
    handleSelectionChange(val) {
      this.selectDatas = val;
    },
    onExport(){
    let xmbhs=this.selectDatas.map(item=>item.cxqbh).toString()
    let params={
      xmbhs,
      xqbh:this.rowData?this.rowData.xmbh:'',
      ...this.searchData,
      ywlx:this.ywlx
    }
    this.m_apiFn(this.exportCheckResult,params)
      .then(resp => {

      })
    },
    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchData.page = 1;
      this.searchData.rows = e;
      this._getHyXmxx();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchData.page = e;
      this._getHyXmxx();
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

   

  }
};
</script>
<style scoped>

#modalCss /deep/ .el-form--label-top .el-form-item__label {
  width: 114px;
  text-align: right;
}

#elFromCss {
  display: flex;
  flex-wrap: wrap;
 
}
/* #elFromCss /deep/ .el-form-item {
  flex: 1 0 0;
  flex-basis: 30%;
  padding: 0 0;
  display: flex;
  justify-content: flex-start;
} */
#elFromCss /deep/ .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  /* flex-basis: 287px !important; */
  text-align: left;
  flex-shrink: 0;
}

.footerBtn {
  height: 80px;
  text-align: center;
  margin-top: 18px;
}
.project-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.text {
  color: #3477de;
}

.tooltipContent{
  overflow: auto;
  max-height: 600px;
}
.popperClass {
  height: 36px;
  line-height: 36px;
}
</style>