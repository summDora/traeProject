<template>
	<div>
   <hyNewModal id="modalCss" v-if="dialogVisible" :dialogVisible='dialogVisible' :title='title' :ifThird="true" :showClose="true" :ifSure="false" :ifCancle="false" width='80%' @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
        <hyProjectForm 
            v-if="readAssociationModelType==='关联'"
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
              :emptyText="'请输入项目名称或编号手动查询'"
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
              <template slot="opinionsFileName" slot-scope="{data}">
                <div class="tagDiv" v-if="data.opinionsFileName"  style="display:flex;align-items:center;width:100%">
                  <!-- <el-tag class="tag" @click.stop="pfyjFileHandleClick(data,'opinionsFileName')" style="cursor: pointer;">
                    <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:100%">{{ data.opinionsFileName }}</span>
                  </el-tag> -->
                  <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:100%">{{ data.opinionsFileName }}</span>
                </div>
                <span v-else>--</span>
              </template>
              <template slot="replyFileName" slot-scope="{data}">
                <div class="tagDiv" v-if="data.replyFileName"  style="display:flex;align-items:center;width:100%">
                  <!-- <el-tag class="tag" @click.stop="pfyjFileHandleClick(data,'replyFileName')" style="cursor: pointer;">
                    <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:100%">{{ data.replyFileName }}</span>
                  </el-tag> -->
                  <span style="overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block;width:100%">{{ data.replyFileName }}</span>
                </div>
                <span v-else>--</span>
              </template>
              <!-- 材料查看 -->
              <template slot="clck" slot-scope="scope">
                  <span class="icon">
                      <!-- 申报材料查看 -->
                      <span @click="sbclHandleClick(scope.data)" >
                          <el-tooltip effect="dark" content="申报材料" placement="top">
                             <i class="iconfont iconshenbaocailiaochakan" style="color: rgb(41, 139, 245)"></i>
                          </el-tooltip>
                      </span>
                      <!-- 收口材料查看 -->
                      <span  @click="skclHandleClick(scope.data)" >
                          <el-tooltip effect="dark" content="收口材料" placement="top">
                              <i class="iconfont iconshoukoucailiaochakan" style="color: rgb(41, 139, 245)"></i>
                          </el-tooltip>
                      </span>
                      <!-- 盖章收口材料查看 -->
                      <span  @click="gzskclHandleClick(scope.data)" >
                          <el-tooltip effect="dark" content="盖章收口材料" placement="top">
                              <i class="iconfont icongaizhangcailiaochakan" style="color: rgb(41, 139, 245)"></i>
                          </el-tooltip>
                      </span>
                  </span>
              </template>
               <!-- 意见查看 -->
               <template slot="yjck" slot-scope="scope">
                  <span class="icon">
                      <!-- 评审前意见查看 -->
                      <span  @click="checkOpinions('', scope.data)" >
                          <el-tooltip effect="dark" content="评审前意见" placement="top">
                               <i class="iconfont iconpingshenqianyijian" style="color: rgb(41, 139, 245)"></i>
                          </el-tooltip>
                      </span>
                      <!-- 修改意见查看 -->
                      <span  @click="checkOpinions('0', scope.data)" >
                          <el-tooltip effect="dark" content="修改意见" placement="top">
                               <i class="iconfont iconxiugaiyijian" style="color: rgb(41, 139, 245)"></i>
                          </el-tooltip>
                      </span>
                      <!-- 收口意见查看 -->
                      <span  @click="checkOpinions('1', scope.data)" >
                          <el-tooltip effect="dark" content="收口意见" placement="top">
                               <i class="iconfont iconshoukouyijianchakan" style="color: rgb(41, 139, 245)"></i>
                          </el-tooltip>
                      </span>
                  </span>
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
          <template slot="footer" v-if="readAssociationModelType==='关联'">
            <el-button size="medium" @click="closeHandle">取消</el-button>
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
            :batchData="projectEditBatchRowData"
            :submitBtnShow="submitBtnShow"
            :btnShow="true"
            page="szhProjectDeclaration"
            @closeHandle="projectInfoDialogVisible=false"
            @sureHandle="sureHandle">
          </projectEdit>


         <!-- 意见查看 -->
         <checkOpinions
            v-if="checkOpinionsModalDialogShow"
            :dialogVisible="checkOpinionsModalDialogShow"
            :rowData="projectRowData"
            :title="checkOpinionsModalTitle"
            :yjlx="checkOpinionsModalYjlx"
            :getPsqyj="getProjectBeforeOpinion"
            :getPsyj="revisedSuggestions"
            :businessType="apiParams.businessType"
            @closeHandle="checkOpinionsModalDialogShow=false"
          ></checkOpinions>
         <!-- 材料查看 -->
	       <materialUpload 
           v-if="materialUploadDialogShow" 
           :dialogVisible="materialUploadDialogShow" 
           :rowData="projectRowData" 
           :title="sbclTitle" 
           :isMaterialUpload="isMaterialUpload" 
           :clblx="clblx" @closeHandle="materialUploadDialogShow=false"
           :getCommonCltjbTree="getCommonCltjbTree" 
           :downloadFile="downloadFile"
           :downloadFiles="downloadFiles"
         ></materialUpload>
   </hyNewModal>
	</div>
</template>
<script>
import { getDictTree,querySysOrgTree,
getCommonCltjbTree,downloadFile,downloadFiles
} from "@/api/common.js";
import { getProjectBeforeOpinion, revisedSuggestions } from "@/api/szhApi/common.js";
import { getRelationalProjectList,getBatchListOption,saveRelationalProject} from '@/api/szhApi/szhBatchManage'
import { 
  kyFormConfig, kyColumnConfig,
  csColumnConfig,
  cjsbrFormConfig,cjsbrColumnConfig, 
} from "./config.js";
const { kySearchConfig, kySearchData } = kyFormConfig;
const { cjsbrSearchConfig, cjsbrSearchData } = cjsbrFormConfig;
// import projectEdit from "@/pages/common/projectEdit/projectEdit.vue";
import checkOpinions from "@/pages/public/checkOpinions/checkOpinions.vue";
import materialUpload from "@/pages/common/materialUpload/materialUpload.vue";
export default {
  name: "readAssociationNumber", // 可研安全初概设查看编号
    /**
   * @param zjqd 投资渠道——1：综合计划，2：省公司可控费用，3：自筹费用
   * @param professionalType 0：建设，1：运维
   */
  props:{
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => "查看关联编号"
    },
    pageTypeTable: {
      type: String,
      default: () => "szhProjectDeclaration"
    },
    businessType: {
      type: String,
      default: () => "BUSINESSTYPE_KY"
    },
    readAssociationRelationType: {  //区分可研/概设/安全（2：可研；3：初设; 4：安全）
      type: String,
      default: () => ""
    },
    readAssociationModelType: {   //弹框的类型(查看关联编号/添加关联编号)
      type: String,
      default: () => ""
    },
    isProjectForm: {   //是否是表单上的关联编号
      type: Boolean,
      default: () => false
    },
    batchRowData: {
      type: Object,
      default: () => {}
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    apiParams: {
      type: Object,
      default: () => {}
    },
    searchShow: {  //控制是否展示搜索栏
      type: Boolean,  
      default: () => true
    },
  },
  components:{
    projectEdit: () => import('@/pages/common/projectEdit/projectEdit.vue'),
    checkOpinions,
    materialUpload,
  },
  data() {
    return {
      searchConfig: this.m_copy(kySearchConfig),
      searchData: this.m_copy(kySearchData),
      searchObj: { page: 1, rows: 20 },
      columnConfig:[],
      ifSearch: true,
      isReset: true,
      selectList: [],
      tableHeight: 0,
      tableData: [],
      total: 0,
      professionalType: '',
      investmentChannel: '',
      isYesStatusList: ["未确认", "已确认"],
      addModalType:"",
      relationStatus:"",
      projectCode:"",
      projectInfoDialogVisible:false,
      projectInfoModalTitle:"",
      projectInfoDisabled: false,
      projectInfoRowData: {},
      needProjectData:true,
      submitBtnShow: false,
      projectEditBatchRowData:{},
      //意见查看
      checkOpinionsModalDialogShow: false,
      checkOpinionsModalTitle: "",
      checkOpinionsModalYjlx: "",
      projectRowData: {},
      getProjectBeforeOpinion,
      revisedSuggestions,
      //材料查看
      materialUploadDialogShow: false,
      isMaterialUpload: false,
      sbclTitle:'',
      clblx: '',
      getCommonCltjbTree,
      downloadFile,
      downloadFiles,

    };
  },
  created() {
    // switch(this.readAssociationRelationType){
    //   //初设
    //   case '3':
    //   this.searchConfig=csCreatProjectDialogTempSearchConfig
    //   this.searchData=this.m_copy(csCreatProjectDialogTempSearchData)
    //   this.columnConfig=csCreatProjectDialogTempColumnConfig
    //   break

    // }
    console.log(this.businessType,'this.businessType')
    console.log(this.readAssociationRelationType,'this.readAssociationRelationType')
    if(this.businessType==="BUSINESSTYPE_KY"){
      this.columnConfig = this.m_copy(kyColumnConfig)
    }else{
      this.columnConfig = this.m_copy(csColumnConfig)
      //初概设和安全模块 批次管理、专家预审、专家评审、评审汇总、收口审核、收口材料上传、项目对照表页面关联可研弹窗上，需要增加【评审意见文号】和【批复意见文号】字段；
      //项目申报、收口审核、项目管理页面的查看关联可研弹窗上，需要增加【评审意见文号】和【批复意见文号】字段，隐藏【评审意见】和【批复意见】 sb
      let pushList = new Set(['csSzhBatchManage','aqSzhBatchManage','csSzhProjectDeclaration','aqSzhProjectDeclaration','csSzhExpertsPreliminary','aqSzhExpertsPreliminary',
      'csSzhPeerReview','aqSzhPeerReview','csSzhGroupLeaderSummary','aqSzhGroupLeaderSummary','csSzhCloseUpMaterialDeclaration','aqSzhCloseUpMaterialDeclaration',
      'csSzhCloseUpExamine','aqSzhCloseUpExamine','csSzhProjectManagement','aqSzhProjectManagement',
      'csSzhProjectRequirementsComparisonTable','aqSzhProjectRequirementsComparisonTable'])
      if(pushList.has(this.pageTypeTable)){
         this.columnConfig.splice(
          this.columnConfig.findIndex(item => item.key === "professionalTypeName"),
          0,
          {
            key: "opinionsNumber",
            label: "评审意见文号",
            baseWidth: 200
          },
          {
            key: "replyNumber",
            label: "批复意见文号",
            baseWidth: 200
          },
        );
      }

      let delList = new Set(['csSzhProjectDeclaration','csSzhCloseUpExamine','aqSzhCloseUpExamine','csSzhProjectManagement',
      'aqSzhProjectManagement','csSzhCloseUpMaterialDeclaration','aqSzhCloseUpMaterialDeclaration'])
      if(delList.has(this.pageTypeTable)){
         this.columnConfig.splice(
          this.columnConfig.findIndex(item => item.key === "opinionsFileName"),
          2
        );
      }

    }

    if(this.readAssociationRelationType==="3"){
      for(let item of this.columnConfig){
        if(item.label==="项目编号"){
          item.key="erpProjectCode"
        }
      }
      this.columnConfig.splice(
        this.columnConfig.findIndex(item=>item.key==="investmentChannelName"),1
      )
    }
    if(this.readAssociationRelationType==="4"){
      this.columnConfig.splice(
        this.columnConfig.findIndex(item=>item.key==="professionalTypeName"),2
      )
    }
    if(this.readAssociationModelType==="查看"){
      this.columnConfig.push(
        {
          key: "clck",
          label: "材料查看",
          isSlot: "true",
          slotName: "clck",
          baseWidth: 180,
          fixed: true,
          isLastSlot: true
        },{
          key: "yjck",
          label: "意见查看",
          isSlot: "true",
          slotName: "yjck",
          baseWidth: 180,
          fixed: true,
          isLastSlot: true
        },
      );
    }

    //承建申报人的判断
    console.log(this.apiParams.businessType,this.rowData.isCjsb,"this.apiParams.businessType")
    if(this.apiParams.businessType==="BUSINESSTYPE_KY"||this.apiParams.businessType==="BUSINESSTYPE_CS"||this.apiParams.businessType==="BUSINESSTYPE_AQ"){
      if(this.rowData.isCjsb==="1"){
        //关联可研||关联安全是承建申报人
        this.searchConfig= this.m_copy(cjsbrSearchConfig),
        this.searchData= this.m_copy(cjsbrSearchData),
        this.columnConfig = this.m_copy(cjsbrColumnConfig)
        if(this.readAssociationModelType==="查看"){
          this.getTableData();
        }
      }else{
        this.getTableData();
      }
    }



  },
  mounted() {
    if(this.apiParams.businessType==="BUSINESSTYPE_CS"){
      this.getTableData();
    }
    this.getTableClientHeight();
    this._getDictTree();
    this.getOrgByUserOrg()
    this.getSearchList()
  },
  methods: {

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


    //获取可研批次
   async getSearchList() {
      const param = {
        projectType: "PROJECTTYPE_XXH",
        businessType:this.apiParams.businessType,
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
      if (key === "batchYear") {
        this.searchData.batchCodeStr = [""];
        this.getSearchList();
      } 
    },


    // 获取列表数据
   async getTableData() {
    console.log(this.rowData,'rowData')
     let params = this.m_copy(this.searchData);
      params = Object.assign(params, this.searchObj,this.apiParams,{
        professionalType: this.batchRowData.professionalType,
        investmentChannel: this.batchRowData.investmentChannel,
        relationBusinessType:this.rowData.businessType,
      });
      // if(this.batchRowData.pclx === "2") {
      //   params = Object.assign(params, {
      //     userId: this.batchRowData.cjr
      //   });
      // }
      if(this.readAssociationModelType==="查看"){
        params.relationStatus="1"
      }else{
        params.relationStatus="0"
      }
      params.projectCode=this.rowData.projectCode
      params.relationType=this.readAssociationRelationType
      for(let key in params){
        if(Array.isArray(params[key])){
          params[key]=params[key].toString()
        }
      }
      let resp=await this.m_apiFn(getRelationalProjectList)(params)
          if (resp && resp.result && resp.result.rows && resp.result.rows.length > 0) {
            this.tableData = resp.result.rows;
            this.total = resp.result.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
    },
   
    //弹框关闭
    closeHandle(){
      this.$emit("readAssociationClose")
    },
    // 查询
    onSearch() {
      //承建申报人的判断
      this.searchObj.page = 1;
      this.searchObj = Object.assign(this.searchObj);
      if(this.apiParams.businessType==="BUSINESSTYPE_KY"||this.apiParams.businessType==="BUSINESSTYPE_AQ"){
        if(this.rowData.isCjsb==="1"){
          //关联可研||关联安全是承建申报人
          this.searchObj.isCjsb=this.rowData.isCjsb
          if(this.readAssociationModelType==="查看"){
            this.getTableData();
          }else{
            if(!this.searchData.projectQuery){
              this.$message.warning("请输入项目查询!")
              return
            }
            this.getTableData();
          } 
        }else{
          this.getTableData();
        }
      }
      if(this.apiParams.businessType==="BUSINESSTYPE_CS"){
        this.getTableData();
      }
    },
    // 重置
    onReset() {
      
      if(this.apiParams.businessType==="BUSINESSTYPE_KY"||this.apiParams.businessType==="BUSINESSTYPE_AQ"){
        if(this.rowData.isCjsb==="1"){
          //关联可研||关联安全是承建申报人
          this.searchObj.isCjsb=this.rowData.isCjsb
          this.searchData.projectQuery=""
          this.searchObj.page = 1;
          this.searchObj.rows = 20;
          this.total = 0;
          this.tableData=[]
        }else{
          this.searchData = this.m_copy(kySearchData);
          this.getTableData();
        }
      }
      if(this.apiParams.businessType==="BUSINESSTYPE_CS"){
        this.searchData = this.m_copy(kySearchData);
        this.getTableData();
      }
    },
 
    //多选事件
    handleSelectionChange(val) {
      this.selectList = val
    },

    // 下载批复意见文件
    async pfyjFileHandleClick(data,flag) {
      const param = {
        clid: ''
      };
      if(flag == 'opinionsFileName'){
        param.clid = data.opinionsFileId
      }
      if(flag == 'replyFileName'){
        param.clid = data.replyFileId
      }
      let res=await this.m_apiFn(downloadFile)(param)
      if(!res){
        this.$message.error(res.message);
      }
    },

    // 申报材料
    sbclHandleClick(row) {
      this.sbclTitle = '申报材料查看'
      this.clblx = "IPHONEDIY_SB"
      this.projectRowData = row;
      this.materialUploadDialogShow = true;
    },

    // 收口材料
    skclHandleClick(row) {
      this.sbclTitle = '收口材料查看'
      this.clblx = "IPHONEDIY_SK"
      this.projectRowData = row;
      this.materialUploadDialogShow = true;
    },

    // 盖章收口材料
    gzskclHandleClick(row) {
      this.sbclTitle = '盖章收口材料查看'
      this.clblx = "IPHONEDIY_GZSK"
      this.projectRowData = row;
      this.materialUploadDialogShow = true;
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

    //双击事件
    async rowDblclick(row){
      if(this.rowData.isCjsb==="1"){
        //承建申报人点击不了
        return
      }
      if(this.isProjectForm){
        this.$emit('readAssociationSumbit',row)
      }else{
        this.projectInfoRowData= {...row}
        this.projectEditBatchRowData= {...row}
        this.needProjectData=true
        this.projectInfoDisabled=true
        this.submitBtnShow=false
        this.projectInfoModalTitle="项目查看"
        this.projectInfoDialogVisible = true
      }
      
    },

    //新增修改弹窗确认
    sureHandle(){
      this.projectInfoDialogVisible = false
    },

    // 确定
    async onSubmit() {
      if(!this.selectList.length) {
        this.$message.error('请选择要添加的数据!')
        return
      }
      if(this.selectList.length>1) {
          this.$message.error('只能选择一条数据!')
          return
        }
      if(this.isProjectForm){
        if(this.selectList.length>1) {
          this.$message.error('只能选择一条数据!')
          return
        }
        this.$emit('readAssociationSumbit',this.selectList[0])
      }else{
        let params = {
          projectCode: this.rowData.projectCode,
          relationProjectCodeStr: this.selectList.map(item => {
            return item.projectCode
          }).toString(),
          relationType:this.readAssociationRelationType,
          ...this.apiParams,
          relationBusinessType:this.rowData.businessType,
        }
        let resp=await this.m_apiFn(saveRelationalProject)( params)
        if(resp.statusCode === '200') {
          this.$message.success(resp.message)
          this.$emit("readAssociationSumbit")
          return;
        }else {
          this.$message.error(resp.message)
          return;
        }
      }
        

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
 .tag /deep/ .el-icon-close{
       top: -10px !important;
       right: 15px !important;
  }
  .tagDiv /deep/ .el-tag{
    width: 100% !important;
  }
</style>