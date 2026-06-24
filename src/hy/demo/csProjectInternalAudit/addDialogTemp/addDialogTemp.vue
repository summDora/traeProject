<template>
	<div>
   <hyNewModal id="modalCss" v-if="creatProjrctModalShow" :dialogVisible='creatProjrctModalShow' :title='title' :ifThird="true" :showClose="true" :ifSure="false" :ifCancle="false" width='80%' @closeHandle="projrctModalCancle" :modalAppendToBody="true" :appendToBody="true">
        <hyProjectForm 
            class="batchCreatProject_projectFrom"
            :ifInLine="true" 
            :formData="searchData" 
            size="middle" 
            labelPosition="left" 
            :formConfig="searchConfig" 
            :ifSearch="ifSearch" 
            :isReset="isReset" 
            @formSelectChange="formSelectChange"
            @onSearch="onSearch"
            @onReset="onReset">
        </hyProjectForm>
        <div class="total-content_table-content-info hy-table_content ">
            <hyNewTable
              :emptyText="emptyText"
              :ifHaveIndex="true"
              :column="columnConfig"
              v-if="tableHeight"
              :height="500"
              :tableData="tableData"
              :ifHaveCheckBox="true"
              @handleSelectionChange="handleSelectionChange"
               @rowDblclick="rowDblclick"
              :page="searchObj.page"
              :pageSize="searchObj.rows"
            >
              <!-- 确认状态 -->
              <template slot="isYesStatus" slot-scope="{data}">
                <span>{{ data.isYesStatus ? isYesStatusList[Number(data.isYesStatus)] : "--" }}</span>
              </template>
            </hyNewTable>
            <div class="hy_two_pageBox">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchObj.page"
                :page-sizes="[20, 40, 60, 100]"
                :page-size="searchObj.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <template slot="footer">
            <el-button size="medium" @click="onCancle">取消</el-button>
            <el-button size="medium" v-if="businessType!=='BUSINESSTYPE_KY'" @click="noRelevance">暂不关联</el-button>
            <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
          </template>
          <!-- 项目新增/修改弹框 -->
          <projectEdit
            v-if="projectInfoDialogVisible"
            :dialogVisible="projectInfoDialogVisible"
            :apiParams="apiParams"
            :title="projectInfoModalTitle"
            :needProjectData="needProjectData"
            :disabled="projectInfoDisabled"
            :formData="projectInfoRowData"
            :batchData="popFormData"
            :submitBtnShow="submitBtnShow"
            :btnShow="true"
            page="szhProjectDeclaration"
            @closeHandle="projrctModalCancle"
            @sureHandle="sureHandle">
          </projectEdit>
   </hyNewModal>
	</div>
</template>
<script>
import { getDictTree, selectBatchList,querySysOrgTree,queryTableById} from "@/api/common.js";
import { getRelationalProjectList,getProjectData,getBatchListOption} from '@/api/szhApi/szhBatchManage'
import { 
  formConfig, columnConfig,
  cjsbrFormConfig,cjsbrColumnConfig, 
} from "./config.js";
const { searchConfig, searchData } = formConfig;
const { cjsbrSearchConfig, cjsbrSearchData } = cjsbrFormConfig;
import projectEdit from "../../common/projectEdit/projectEdit.vue";
//初设概设添加项目接口
import { getAddProjectTableData } from '@/api/csBatchManage'
//初设概设表单列表
import { csCreatProjectDialogTempFormConfig, csCreatProjectDialogTempColumnConfig} from "@/pages/szh_base/cs_base/csSzhBatchManage/csSzhBatchManage.js";
const { csCreatProjectDialogTempSearchConfig, csCreatProjectDialogTempSearchData } = csCreatProjectDialogTempFormConfig;
//安全防护表单列表
import { aqCreatProjectDialogTempFormConfig, aqCreatProjectDialogTempColumnConfig} from "@/pages/szh_base/aq_base/aqSzhBatchManage/aqSzhBatchManage.js";
const { aqCreatProjectDialogTempSearchConfig, aqCreatProjectDialogTempSearchData } = aqCreatProjectDialogTempFormConfig;
export default {
  name: "creatProjectDialogTemp", // 添加项目
    /**
   * @param zjqd 投资渠道——1：综合计划，2：省公司可控费用，3：自筹费用
   * @param professionalType 0：建设，1：运维
   */
  props:{
    businessType: {
      type: String,
      default: () => "BUSINESSTYPE_KY"
    },
  },
  components:{
    projectEdit
  },
  data() {
    return {
      searchConfig,
      searchData: this.m_copy(searchData),
      searchObj: { page: 1, rows: 20 },
      columnConfig,
      ifSearch: true,
      isReset: true,
      title: "",
      creatProjrctModalShow: false,
      popType: "",
      popFormData:{},
      selectList: [],
      tableHeight: 0,
      tableData: [],
      total: 0,
      isYesStatus: '',
      professionalType: '',
      investmentChannel: '',
      isYesStatusList: ["未确认", "已确认"],
      relationStatus:"",
      projectCode:"",
      pageTypeTable:"",
      //项目弹窗
      apiParams: {
        pageTypeTable: this.pageTypeTable,
        projectType: "PROJECTTYPE_XXH",
        businessType: this.businessType,
        configType: "1",
      },
      projectInfoDialogVisible:false,
      projectInfoDisabled: false,
      projectInfoRowData: {},
      needProjectData:true,
      submitBtnShow: false,
      emptyText:"暂无数据",
    };
  },
  created() {
    console.log(this.pageTypeTable)
    switch(this.businessType){
      //初设概设-批次管理页面
      case 'BUSINESSTYPE_CS':
      this.searchConfig=csCreatProjectDialogTempSearchConfig
      this.searchData=this.m_copy(csCreatProjectDialogTempSearchData)
      this.columnConfig=csCreatProjectDialogTempColumnConfig
      break
      //安全防护-批次管理页面
      case 'BUSINESSTYPE_AQ':
      this.searchConfig=aqCreatProjectDialogTempSearchConfig
      this.searchData=this.m_copy(aqCreatProjectDialogTempSearchData)
      this.columnConfig=aqCreatProjectDialogTempColumnConfig
      break
    }
  },
  mounted() {
    this.getTableClientHeight();
  },
  methods: {
    async open(val) {
      console.log(val)
      this.selectList=[]
      this.creatProjrctModalShow = val.creatProjrctModalShow
      this.title = val.popTitle
      this.popType = val.popType
      this.popFormData = val.popFormData
      this.professionalType = this.popFormData.professionalType
      this.investmentChannel = this.popFormData.investmentChannel
      this.pageTypeTable=val.pageTypeTable
      this.apiParams.pageTypeTable=val.pageTypeTable
      this.apiParams.pageType=val.pageType
      console.log( this.pageTypeTable)
      this._getDictTree();
      // await this.getTableData();
      switch(this.businessType){
        case 'BUSINESSTYPE_KY':
          await this._selectBatchList()
        break
        //初设概设-批次管理页面
        case 'BUSINESSTYPE_CS':
        case 'BUSINESSTYPE_AQ':
          await this.getSearchList()
          await this.getOrgByUserOrg()
        break
      }
      //承建申报人的判断
      if(this.popFormData.isCjsb==="1"){
        //是承建申报人
        this.searchConfig= this.m_copy(cjsbrSearchConfig),
        this.searchData= this.m_copy(cjsbrSearchData),
        this.columnConfig = this.m_copy(cjsbrColumnConfig)
        this.emptyText="请输入项目名称或编号手动查询"
      }else{
        this.getTableData();
      }
    },

     // 获取业务部门
    async _getDictTree() {
      let resp=await this.m_apiFn(getDictTree)("APP_SZH_YWBM")
      if(resp.statusCode === '200') {
        if (resp && resp.result && resp.result.length > 0) {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "businessCompanyStr") {
              iterator.options = resp.result;
              iterator.options.unshift({ dataLabel: "全部", dataVal: "" });
            }
          }
        }
      }
    },

    // 获取需求批次
    async _selectBatchList() {
      let resp=await this.m_apiFn(selectBatchList)()
      if(resp.statusCode === '200') {
        if (resp && resp.result && resp.result.length > 0) {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "batchCodeStr") {
              iterator.options = resp.result;
              iterator.options.unshift({ batchName: "全部", batchCode: "" });
            }
          }
        }
      }
    },

    //获取可研批次
   async getSearchList() {
      const param = {
        projectType: "PROJECTTYPE_XXH",
        businessType: "BUSINESSTYPE_KY",
        batchYear: this.searchData.batchYear
      };
      let res=await this.m_apiFn(getBatchListOption)(param)
        if (res && res.result) {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "batchCodeStr") {
              iterator.options = res.result;
              iterator.options.unshift({ batchName: "全部", batchCode: "" });
            }
          }
        }
    },

    // 查找项目单位
   async getOrgByUserOrg() {
      let res=await this.m_apiFn(querySysOrgTree)({})
        for (const iterator of this.searchConfig) {
          if (iterator.key === "projectCompanyStr") {
            iterator.data = res.result;
          }
        }
    },

    formSelectChange(key, v) {
      switch(this.businessType){
        //初设概设-批次管理页面
        case 'BUSINESSTYPE_CS':
        case 'BUSINESSTYPE_AQ':
        if (key === "batchYear") {
          this.searchData.batchCodeStr = [""];
          this.getSearchList();
        } 
        break
      }
    },


    // 获取列表数据
   async getTableData() {
     let params = this.m_copy(this.searchData);
      params = Object.assign(params, this.searchObj,{
        professionalType: this.professionalType,
        investmentChannel: this.investmentChannel,
        relationStatus:"0",
        relationBusinessType:this.businessType,
        isCjsb:this.popFormData.isCjsb
      });
      // if(this.popFormData.pclx === "2") {
      //   params = Object.assign(params, {
      //     userId: this.popFormData.cjr
      //   });
      // }
      
      switch(this.businessType){
        case 'BUSINESSTYPE_KY':   //查看关联可研
        break
        //初设概设-批次管理页面
        case 'BUSINESSTYPE_CS':
        case 'BUSINESSTYPE_AQ':
        params.professionalType = '0'
        break
      }

      if(this.pageTypeTable==="szhProjectDeclaration"){
        params.pageType="xmsb"
      }
      console.log(params)
      for(let key in params){
        if(Array.isArray(params[key])){
          params[key]=params[key].toString()
        }
      }
      let resp=await this.m_apiFn(getRelationalProjectList)( params)
          if (resp && resp.result && resp.result.rows && resp.result.rows.length > 0) {
            this.tableData = resp.result.rows;
            this.total = resp.result.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
    },
   
    //弹框关闭
    projrctModalCancle(){
      switch(this.businessType){
        case 'BUSINESSTYPE_KY':
        this.searchData = this.m_copy(searchData);
        break
        //初设概设-批次管理页面
        case 'BUSINESSTYPE_CS':
        this.searchData = this.m_copy(csCreatProjectDialogTempSearchData);
        break
        //安全防护-批次管理页面
        case 'BUSINESSTYPE_AQ':
        this.searchData = this.m_copy(aqCreatProjectDialogTempSearchData);
        break
      }
      if(this.popFormData.isCjsb==="1"){
        //是承建申报人
        this.searchData = this.m_copy(cjsbrSearchData);
      }
      
      
      this.projectInfoDialogVisible=false
      this.creatProjrctModalShow=false
    },
    // 查询
    onSearch() {
      this.searchObj.page = 1;
      this.searchObj = Object.assign(this.searchObj);
      if(this.popFormData.isCjsb==="1"){
        //是承建申报人
        console.log(this.searchData)
        if(!this.searchData.projectQuery){
          this.$message.warning("请输入项目查询!")
          return
        }
        this.getTableData();
      }else{
        this.getTableData();
      }
    },
    // 重置
    onReset() {
      switch(this.businessType){
        case 'BUSINESSTYPE_KY':
        this.searchData = this.m_copy(searchData);
        break
        //初设概设-批次管理页面
        case 'BUSINESSTYPE_CS':
        this.searchData = this.m_copy(csCreatProjectDialogTempSearchData);
        this.getSearchList();
        break
        //安全防护-批次管理页面
        case 'BUSINESSTYPE_AQ':
        this.searchData = this.m_copy(aqCreatProjectDialogTempSearchData);
        break
      }
      if(this.popFormData.isCjsb==="1"){
        //是承建申报人
        this.searchData = this.m_copy(cjsbrSearchData);
        this.tableData=[]
        this.searchObj.page = 1;
        this.searchObj.rows = 20;
        this.total = 0;
      }else{
        this.getTableData();
      }
    },
 
    //多选事件
    handleSelectionChange(val) {
      this.selectList = val
    },

    //双击事件
    async rowDblclick(row){
      if(this.rowData.isCjsb==="1"){
        //承建申报人点击不了
        return
      }
      this.submitFun(row)
    },

    //新增修改弹窗确认
    sureHandle(){
      this.projectInfoDialogVisible = false
      this.creatProjrctModalShow = false
      this.$emit('addSuccessSumbit')
    },

    //暂不关联
    noRelevance(){
      this.projectInfoRowData=null
      this.projectInfoDisabled=false
      this.submitBtnShow=true
      this.projectInfoModalTitle="项目填报"
      this.projectInfoDialogVisible = true
    },

    // 确定
    async onSubmit() {
      console.log(this.apiParams,'this.apiParams')
      if(!this.selectList.length) {
        this.$message.warning('请选择要添加的数据')
        return
      }
      if(this.businessType !=="BUSINESSTYPE_KY" && this.selectList.length > 1) {
        this.$message.warning('只能选择一条数据')
        return
      }
      this.submitFun(this.selectList[0])
        
    },

    async submitFun(row){
      let url=""
      if(row.businessType==="BUSINESSTYPE_XQ"){
        url=getProjectData
      }else{
        url=queryTableById
      }
      let params = {
        ...this.apiParams,
        // id: this.formData?this.formData.trpId?this.formData.trpId:'':'',
        trpId: row.trpId,
        id: row.trpId,
        configType: "1"
      };
      if(row.businessType==="BUSINESSTYPE_KY"){
        params.pageTypeTable="szhProjectDeclaration"
      }else if(row.businessType==="BUSINESSTYPE_CS"&&this.pageTypeTable!=='csSzhBatchManage'){
        params.pageTypeTable="csSzhProjectDeclaration"
      }else if(row.businessType==="BUSINESSTYPE_AQ"&&this.pageTypeTable!=='aqSzhBatchManage'){
        params.pageTypeTable="aqSzhProjectDeclaration"
      }
      params.businessType=row.businessType
      let res=await this.m_apiFn(url)(params)
      console.log(this.selectList,'this.selectList')
      if(res.statusCode==="200"){
        console.log(11,'222')
        let e = {...res.result}
        console.log(e,this.pageTypeTable,"res.resultres.resultres.result")
        if(this.pageTypeTable==="szhProjectDeclaration"){
          if (row.professionalType === "0") {
            this.projectInfoRowData = {
              projectCompany: e.constructionUnit,
              projectClassify: e.projectClassify,
              businessCompany: e.businessCompany,
              projectName: e.projectName,
              professionalCategories: e.category,
              professionalSubcategory: e.subcategory,
              implementRange: e.applicationRange,
            };
          } else {
            this.projectInfoRowData = {
              projectCompany: e.operationsDeptUnit,
              projectClassify: e.projectClassify,
              businessCompany: e.businessCompany,
              projectName: e.projectName,
              implementRange: e.applicationRange,
              investmentTotal: e.investmentTotal,
              costOne: e.oneLineCostSum,
              costTwo: e.twoLineCostSum,
              costThree: e.threeLineCostSum,
              softwareLicense: e.softwareLicenseServiceFeeSum,
              repairParts: e.repairAccessoriesCostSum,
              consumablesCost: e.consumableCostSum,
              businessCompany: e.businessCompany,
            };
          }
          console.log(e,'e')
          this.projectInfoRowData.investmentChannelName = row.investmentChannelName;
          this.projectInfoRowData.relationProjectCodeStr = e.projectCode;
          
        }else if(this.pageTypeTable==="csSzhProjectDeclaration"||this.pageTypeTable==='csSzhBatchManage'){
          this.projectInfoRowData = {
            feasibilityCode: e.projectCode,
            projectNature: e.issuedProjectProperties,
            projectCompany: e.projectCompany,
            projectName: e.projectName,
            projectProperties: e.projectProperties,
            whetherInternet: e.whetherInternet,
            whetherContainDevelop: e.whetherContainDevelop,
            businessCompany: e.businessCompany,
            applyDimensions: e.applyDimension,
            implementRange: e.implementRange,
            projectContent: e.projectContent,
            professionalCategories: e.professionalCategories,
            professionalSubcategory: e.professionalSubcategory,
          };
          this.projectInfoRowData.erpProjectCode=""
          if(e.costIssuedErpCode){
            this.projectInfoRowData.erpProjectCode=e.costIssuedErpCode
          }
          if(e.capitalIssuedErpCode){
            this.projectInfoRowData.erpProjectCode=e.capitalIssuedErpCode
          }
        }else if(this.pageTypeTable==="aqSzhProjectDeclaration"||this.pageTypeTable==='aqSzhBatchManage'){
          this.projectInfoRowData = {
            projectCode: e.projectCode,
            projectName: e.projectName,
            businessCompany: e.businessCompany,
            businessCompanyUser: e.businessCompanyUser,
            businessCompanyTel: e.businessCompanyTel,
            projectCompany: e.projectCompany,
            projectCompanyUser: e.projectCompanyUser,
            projectCompanyTel: e.projectCompanyTel,
            // xmjl: e.xmjl,
            // xmgk: e.xmgk,
            remake: e.remake,
          };
        }
        if(this.projectInfoRowData.projectCode){
          this.projectInfoRowData.projectCode=""
        }
        this.projectInfoRowData.feasibilityCode=e.projectCode
        if(this.businessType == 'BUSINESSTYPE_KY'){
          this.projectInfoRowData.relationProjectCodeStr=this.selectList.map(item => {
            return item.serialNumber
          }).toString()
          let arr=[]
          for(let item of this.selectList){
            arr.push(`${item.serialNumber},${item.projectName}`)
          }
          this.projectInfoRowData.relationProject=arr.join(';')
        }else{
          this.projectInfoRowData.relationProjectCodeStr=this.selectList.map(item => {
            return item.projectCode
          }).toString()
          let arr=[]
          for(let item of this.selectList){
            arr.push(`${item.serialNumber},${item.projectName}`)
          }
          this.projectInfoRowData.relationProject=arr.join(';')
        }
        
        console.log(this.projectInfoRowData,"projectInfoRowDataprojectInfoRowData")
        this.needProjectData=false
        this.projectInfoDisabled=false
        this.submitBtnShow=true
        this.projectInfoModalTitle="项目填报"
        this.projectInfoDialogVisible = true

        this.tableData=[]
        this.searchObj.page = 1;
        this.searchObj.rows = 20;
        this.total = 0;
      }
    },
    
    // 取消
    onCancle() {
      this.selectList = []
      this.tableData=[]
      this.searchObj.page = 1;
      this.searchObj.rows = 20;
      this.total = 0;
      switch(this.businessType){
        case 'BUSINESSTYPE_KY':
        this.searchData = this.m_copy(searchData);
        break
        //初设概设-批次管理页面
        case 'BUSINESSTYPE_CS':
        this.searchData = this.m_copy(csCreatProjectDialogTempSearchData);
        break
        //安全防护-批次管理页面
        case 'BUSINESSTYPE_AQ':
        this.searchData = this.m_copy(aqCreatProjectDialogTempSearchData);
        break
      }
      this.creatProjrctModalShow = false
    },
    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.page = 1;
      this.searchObj.rows = e;
      this.getTableData();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this.getTableData();
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
  #modalCss /deep/  .el-form--label-top .el-form-item__label{
    width: 114px;
    text-align: right;
  }
  
#elFromCss {
  display: flex;
  flex-wrap: wrap;
  padding: 0 103px;
}
#elFromCss /deep/ .el-form-item {
  flex: 1 0 0;
  flex-basis: 50%;
  padding: 0 0;
  display: flex;
  justify-content: flex-start;
}
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
.text {
    color:#3477DE;
}
/* .batchCreatProject_projectFrom >>> .el-select-dropdown__item {
    max-width: 300px;
    overflow: auto;
    display: -webkit-inline-box;
} */

</style>