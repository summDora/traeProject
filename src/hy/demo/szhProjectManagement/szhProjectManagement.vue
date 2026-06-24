<template>
  <section>
    <div ref="projectSearch">
      <div class="hy-new-search-box">
        <hyProjectForm :formConfig="projectSearchConfig" :formData="projectSearchObj" @onSearch="projectOnSearch" @onReset="projectOnReset" :ifSearch="true" :isReset="true" @formSelectChange="formSelectChange">
        </hyProjectForm>
      </div>
      <hyNewButtons :buttonsData="buttonsConfig" @selectButtons="selectButtons" style="padding: 10px; box-sizing: border-box; justify-content: flex-end; border: 1px solid rgba(34, 39, 52, 0.15); border-top: none; border-bottom: none; background: transparent linear-gradient(0deg,#fff 0%,#f2f3f6 100%) 0% 0% no-repeat padding-box;">
      </hyNewButtons>
    </div>
    <div class="total-content_table-content-info hy-table_content"  :style="{height:projectTableHeight}">
      <newTable v-if="projectTableHeight" :height="projectTableHeight" :tableData="projectTableData" :column="titleColumn" :ifHaveIndex="true" :ifHaveCheckBox="true" @handleSelectionChange="handleSelectionChange" @rowDblclick="rowDblclick" :page="projectSearchObj.page" :pageSize="projectSearchObj.rows">
        <!-- 关联需求编号 -->
        <template slot="demandCode" slot-scope="scope">
          <el-tag class="tag" v-if="scope.data.demandCode" style="cursor: pointer;" @click.stop="checkXqbm(scope.data)">
            <span class="tagSpan">{{ scope.data.demandCode }}</span>
          </el-tag>
          <span v-else>--</span>
        </template>
        <!-- 关联可研编号 -->
        <template slot="feasibilityCode" slot-scope="scope">
          <el-tag class="tag" v-if="scope.data.feasibilityCode" style="cursor: pointer;" @click.stop="readKybhClick(scope.data,'2')">
            <span class="tagSpan">{{ scope.data.feasibilityCode }}</span>
          </el-tag>
          <span v-else>--</span>
        </template>
        <!-- 关联概设编号 -->
        <template slot="initialOutlineCode" slot-scope="scope">
          <el-tag  class="tag" v-if="scope.data.initialOutlineCode" style="cursor: pointer;" @click.stop="readKybhClick(scope.data,'3')">
            <span class="tagSpan">{{ scope.data.initialOutlineCode }}</span>
          </el-tag>
          <span v-else>--</span>
        </template>
        <!-- 安全防护编号 -->
        <template slot="safetyCode" slot-scope="scope">
          <el-tag  class="tag" v-if="scope.data.safetyCode" style="cursor: pointer;" @click.stop="readKybhClick(scope.data,'4')">
            <span class="tagSpan">{{ scope.data.safetyCode }}</span
          ></el-tag>
          <span v-else>--</span>
        </template>
        <template slot="opinionsFileName" slot-scope="{data}">
          <el-tag v-if="data.opinionsFileId" class="tag" @click.stop="psyjFileHandleClick(data)" style="cursor: pointer;">
            <span class="tagSpan">{{ data.opinionsFileName }}</span>
          </el-tag>
          <span v-else>--</span>
        </template>
        <template slot="replyFileName" slot-scope="{data}">
          <el-tag  v-if="data.replyFileId" class="tag" @click.stop="pfyjFileHandleClick(data)" style="cursor: pointer;">
            <span class="tagSpan">{{ data.replyFileName }}</span>
          </el-tag>
          <span v-else>--</span>
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
        <template slot="yjck" slot-scope="{data}">
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
          <el-tooltip effect="dark" content="度量结果" placement="top">
            <i style="color:#409eff" class="icon iconfont iconjiesuan" @click.stop="dljgCLick(scope.data)"></i>
          </el-tooltip>
        </template>
      </newTable>
      <div class="hy_two_pageBox">
        <el-pagination @size-change="projectTableHandleSizeChange" @current-change="projectTableHandleCurrentChange" :current-page="projectSearchObj.page" :page-size="projectSearchObj.rows" :total="projectTabletTotal" :page-sizes="[20, 40, 60, 100]" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>

    <materialUploadModal v-if="materialUploadDialogShow" :dialogVisible="materialUploadDialogShow" title="材料查看" :rowData="projectRowData" :isMaterialUpload="false" :clblx="clblx" :getCommonCltjbTree="getCommonCltjbTree" :downloadFile="downloadFile" :downloadFiles="downloadFiles" @closeHandle="closeMaterialUploadModal">
    </materialUploadModal>

    <checkOpinionsModal v-if="checkOpinionsModalDialogShow" :apiParams="apiParams" :dialogVisible="checkOpinionsModalDialogShow" :rowData="projectRowData" :title="checkOpinionsModalTitle" :yjlx="checkOpinionsModalYjlx" :getPsqyj="getProjectBeforeOpinion" :getPsyj="revisedSuggestions" :projectType="projectType" :businessType="businessType" @closeHandle="checkOpinionsHandleClose">
    </checkOpinionsModal>

    <!-- 项目 -->
    <projectEdit v-if="projectInfoDialogVisible" :dialogVisible="projectInfoDialogVisible" :disabled="true" :apiParams="apiParams" title="项目详情" :batchData="projectRowData" :formData="projectRowData" @closeHandle="projectInfoDialogVisible=false">
    </projectEdit>

    <!-- 导入 -->
    <hyNewModal
      :smallModel="true"
      :modalTop="'300px'"
      v-if="uploadModalShow"
      :dialogVisible='uploadModalShow'
      :title="exportFileModalTitle"
      :showClose="true"
      @closeHandle="closeHandle"
      :ifSure="false"
      :ifCancle="false"
      width='450px'>
      <div class="exportSelect">
        <div class="exportSelectName"><span>*</span> 专业类型：</div>
        <el-select class="exportSelectBox" v-model="exportProfessionalType">
          <el-option
            v-for="(item,index) in exportProfessionalTypeOption"
            :key="index"
            :label="item.dataLabel"
            :value="item.dataVal"
          ></el-option>
        </el-select>
      </div>
      <uploadFile 
        :fileName="fileName"
        :fileList="uploadFileList"
        @beforeUpload="beforeUpload"
        @uploadFile="uploadFile"
      ></uploadFile>
    </hyNewModal>
    

    <!--导出-->
		<hyModal 
      v-if="downloadModalShow" 
      :dialogVisible='downloadModalShow' 
      :smallModel="false"
      title='导出' 
      @closeHandle="downloadCloseHandle" 
      @sureHandle="downloadModelSure" 
      :ifSure="true" 
      :ifCancle="true" 
      width='467px'
    >
      <hyNewForm 
        :formConfig='downloadFormConfig' 
        :formData='downloadFormData' 
        :ifInLine='false' 
        :ifSearch2="false"
      ></hyNewForm>
    </hyModal>

    <!-- 查看关联需求 -->
    <newRelateStoryDialogTemp
    v-if="newRelateStoryDialogTemp" ref="newRelateStoryDialogTemp" 
    :projectType="'PROJECTTYPE_XXH'" :businessType="'BUSINESSTYPE_XQ'" 
    :queryXmxq="getRelationalProjectList" :deleteXmxq="deleteRelationalProject" 
    @relateStoryModalCancle="relateStoryModalCancle"
    ></newRelateStoryDialogTemp>

    <!--查看可研/概设/安全编号-->
    <readAssociationNumber 
      v-if="readAssociationNumberShow" :dialogVisible="readAssociationNumberShow"  
      :title="readAssociationTitle"
      :apiParams="readAssociationApiParams"
      :batchRowData="readAssociatioRowData"
      :readAssociationRelationType="readAssociationRelationType"
      :readAssociationModelType="readAssociationModelType"
      :pageTypeTable="pageTypeTable" :businessType="businessType" 
      :rowData="readAssociatioRowData"
      @readAssociationSumbit="readAssociationSumbit"
      @readAssociationClose="readAssociationNumberShow=false"
    ></readAssociationNumber>
    <!-- finalWorkload 组件未接入，暂注释
    <finalWorkload
      v-if="finalWorkloadModalShow"
      :finalWorkloadModalShow="finalWorkloadModalShow"
      :rowData="projectRowData"
      @finalWorkloadModalCancle="finalWorkloadModalShow=false"
    ></finalWorkload>
    -->
 
  </section>
</template>
<script>
import {
  projectSearchConfig,
  projectSearchData,
  projectTableColumn,
  buttonsConfig
} from "./config.js";
// 初设概设-项目管理页面
import {
  csProjectSearchConfig,
  csProjectSearchData,
  csProjectButtonsConfig
} from "@/pages/szh_base/cs_base/csSzhProjectManagement/csSzhProjectManagement.js";
// 安全防护-项目管理页面
import {
  aqProjectSearchConfig,
  aqProjectSearchData,
  aqProjectButtonsConfig
} from "@/pages/szh_base/aq_base/aqSzhProjectManagement/aqSzhProjectManagement.js";
import {
  queryTableTitle,
  getSBDWList,
  queryDictTree,
  getCommonCltjbTree,
  downloadFile,
  downloadFiles,
  getUserRole,
} from "@/api/common.js";
import {
  getProjectBeforeOpinion,
  revisedSuggestions,
  queryHymcTree,
  queryPcbhmcByYear
} from "@/api/szhApi/common.js";
import {
  queryProjectManageList,
  exportProjectManage,
  importInProject
} from "@/api/szhApi/szhProjectManagement.js";
import { getRelationalProjectList,deleteRelationalProject} from '@/api/szhApi/szhBatchManage'
// import finalWorkload from "../szhGroupLeaderSummary/finalWorkload/finalWorkload.vue";
import materialUpload from "../common/materialUpload/materialUpload.vue";
import checkOpinions from "../common/checkOpinions/checkOpinions.vue";
import projectEdit from "../common/projectEdit/projectEdit.vue";
import newRelateStoryDialogTemp from "../common/newRelateStoryDialogTemp/newRelateStoryDialogTemp";
import readAssociationNumber from "../common/readAssociationNumber/readAssociationNumber.vue";
import uploadFile from "@/pages/public/uploadFile.vue";
import { mapState } from "vuex";

export default {
  name: "szhProjectManagement", // 项目管理

  props: {
    pageTypeTable: {
      type: String,
      default: "szhProjectManagement"
    },
    businessType: {
      type: String,
      default: "BUSINESSTYPE_KY"
    },
    projectType: {
      type: String,
      default: () => "PROJECTTYPE_XXH"
    },
  },

  components: {
    // finalWorkload,
    materialUploadModal: materialUpload,
    checkOpinionsModal: checkOpinions,
    projectEdit,
    newRelateStoryDialogTemp,
    readAssociationNumber,
    uploadFile
  },

  data() {
    return {
      projectSearchConfig,
      projectSearchObj: this.m_copy(projectSearchData),
      projectTableHeight: 0,
      projectTableData: [],
      apiParams: {
        pageTypeTable: this.pageTypeTable,
        configType: "1",
        projectType: this.projectType,
        businessType: this.businessType
      },
      titleColumn: [],
      projectTabletTotal: 0,
      buttonsConfig:this.m_copy(buttonsConfig),
      projectRowData: {},
      materialUploadDialogShow: false,
      clblx: "",
      getCommonCltjbTree,
      downloadFile,
      downloadFiles,
      checkOpinionsModalDialogShow: false,
      checkOpinionsModalTitle: "",
      checkOpinionsModalYjlx: "",
      selectData: [],
      getProjectBeforeOpinion,
      revisedSuggestions,
      projectInfoDialogVisible: false,
      //关联需求
      newRelateStoryDialogTemp: false,
      getRelationalProjectList,
      deleteRelationalProject,
      //查看关联可研/初概设/安全编号
      readAssociationNumberShow:false,
      readAssociationRelationType:"",
      readAssociationTitle:"",
      readAssociatioRowData:{},
      readAssociationApiParams:{},
      // 导入弹框
      exportProfessionalType:"",
      exportProfessionalTypeOption:[],
      uploadModalShow:false,
      exportFileModalTitle:"",
      fileName:"",
      files:"",
      uploadFileList:[],
      //导出弹框
      downloadModalShow:false,
      downloadFormConfig:[
        {
          type: 'select',
          placeholder: '请选择',
          key: 'professionalType',
          clearable:true,
          disabled:false,
          width: 420,
          label: '专业类型',
          options: [],
          labelName: "dataLabel",
          labeKey: "dataVal"
        },
      ],
      downloadFormData:{
        professionalType:"",
      },
      //工作量度量
      finalWorkloadModalShow:false,

    };
  },

  mounted() {
    
    switch (this.businessType) {
      //可研-项目管理页面
      case "BUSINESSTYPE_KY":
        if(this.$store.state.fusionVersion){
          this.buttonsConfig=[{
            id: 2,
            icon: "iconzu1192",
            text: "导出",
            color: "#298BF5"
          }]
        }
      break;
      //初设概设-项目管理页面
      case "BUSINESSTYPE_CS":
        this.projectSearchConfig = csProjectSearchConfig;
        this.projectSearchObj = this.m_copy(csProjectSearchData);
        this.buttonsConfig = csProjectButtonsConfig;
      break;
      //安全防护-项目管理页面
      case "BUSINESSTYPE_AQ":
        this.projectSearchConfig = aqProjectSearchConfig;
        this.projectSearchObj = this.m_copy(aqProjectSearchData);
        this.buttonsConfig = aqProjectButtonsConfig;
      break;
    }
    this.getJurisdiction()
    this.getTableTitle();

    this.getSearchList(queryPcbhmcByYear, "pc");
    this.getSearchList(queryHymcTree, "hy");
    // 项目单位
    this.getOrgByUserOrg();
    // 获取项目状态
    this.getDict("APP_XMZT");
    this.getDict("APP_SZH_YWBM");
    //获取专业类型
    if(this.businessType==="BUSINESSTYPE_CS"){
      this.getDict("APP_SZH_CS_ZYLX");
    }else{
      this.getDict("APP_SHZ_ZYLX");
    }
    
    this.getDict("APP_SZH_XMFL");
    this.getDict("APP_PROJECTCLASSIFY");
    this.getDict("APP_SZH_XDTZQD");
    

    this.getProjectListInPage();
  },

  methods: {
    // 权限控制
    async getJurisdiction(){
      let params={
        projectType:this.projectType
      }
      let res= await this.m_apiFn(getUserRole)(params)
        if (res.result) {
          let arr=[]
          for(let item of res.result){
            // arr.push(item.code)
            arr.push(item.name)
          }

          // if(arr.indexOf("FZR_KY")==-1){
          if(arr.indexOf("数字化可研评审负责人")==-1){
            if(this.buttonsConfig.findIndex(item=>item.text==="导入")!==-1){
              this.buttonsConfig.splice(
                this.buttonsConfig.findIndex(item=>item.text==="导入"),1
              )
            }
          }
        }
    },

    async  getSearchList(api, type) {
      const param = {
        projectType: this.projectType,
        businessType: this.businessType
      };

      if (type === "pc") {
        param.batchYear = this.projectSearchObj.batchYear;
      }
      let res=await this.m_apiFn(api)(param)
          if (res && res.result) {
            if (type === "pc") {
              for (const iterator of this.projectSearchConfig) {
                if (iterator.key === "batchCodeStr") {
                  iterator.options = res.result;
                  iterator.options.unshift({
                    batchName: "全部",
                    batchCode: ""
                  });
                }
              }
            } else if (type === "hy") {
              for (const iterator of this.projectSearchConfig) {
                if (iterator.key === "meetingIdStr") {
                  iterator.options = res.result;
                  iterator.options.unshift({ meetingName: "全部", tdmId: "" });
                }
              }
            }
          }
    },

    // 查找项目单位
   async getOrgByUserOrg() {
      const param = {
        isSearch: "1",
        organizeId: "ZJDL"
      };
      let res=await this.m_apiFn(getSBDWList)(param)
          for (const iterator of this.projectSearchConfig) {
            if (iterator.key === "projectCompanyStr") {
              iterator.data = res.result;
            }
          }
    },

   async getDict(dataVal) {
    let resp=await this.m_apiFn(queryDictTree)(dataVal)
        if (resp.result && resp.result.length > 0) {
          for (const iterator of this.projectSearchConfig) {
            if (
              (dataVal === "APP_XMZT" && iterator.key === "projectStatusStr")||
              (dataVal === "APP_SZH_YWBM" && iterator.key === "businessCompanyStr")||
              ((dataVal === "APP_SHZ_ZYLX"||dataVal === "APP_SZH_CS_ZYLX") && iterator.key === "professionalType")||
              (dataVal === "APP_SZH_XMFL" && iterator.key === "projectClassify")||
              (dataVal === "APP_PROJECTCLASSIFY" && iterator.key === "projectProperties")||
              (dataVal === "APP_SZH_XDTZQD" && iterator.key === "releaseInvestmentChannel")||
              (dataVal === "APP_XXH_XMFL_YW" && iterator.key === "projectClassify")
            ) {
              iterator.options = this.m_copy(resp.result)
              iterator.options.unshift({ dataLabel: "全部", dataVal: "" });
            }
            
          }
          if(dataVal === "APP_SHZ_ZYLX"||dataVal === "APP_SZH_CS_ZYLX"){
            this.exportProfessionalTypeOption=this.m_copy(resp.result)
          }
          for(let item of this.downloadFormConfig){
            if((dataVal === "APP_SHZ_ZYLX"||dataVal === "APP_SZH_CS_ZYLX")&&item.key === "professionalType"){
              item.options = this.m_copy(resp.result)
            }
          }
          
        }
    },

    formSelectChange(key, v) {
      if (key === "batchYear") {
        this.projectSearchObj.batchCodeStr = [""];
        this.getSearchList(queryPcbhmcByYear, "pc");
      } else if (v && key === "professionalType") {
        this.projectSearchObj.projectClassify = "";
        this.projectSearchObj.projectProperties = [""];
        if (v === "0") {
          // 建设类
          for (const iterator of this.projectSearchConfig) {
            if (iterator.key === "projectProperties") {
              this.$set(iterator, "selectEmbedLabel", "项目属性");
              this.$set(iterator, "placeholder", "请选择项目属性");
              this.$set(iterator, "options", []);
            }
          }

          // 项目分类
          this.getDict("APP_SZH_XMFL");
          // 项目属性
          this.getDict("APP_PROJECTCLASSIFY");
        } else if (v === "1") {
          // 运维类
          for (const iterator of this.projectSearchConfig) {
            if (iterator.key === "projectProperties") {
              this.$set(iterator, "selectEmbedLabel", "项目小类");
              this.$set(iterator, "placeholder", "请选择项目小类");
              this.$set(iterator, "options", []);
            }
          }

          // 项目分类
          this.getDict("APP_XXH_XMFL_YW");
        }
      } else if (v && key === "projectClassify") {
        let options = [];
        for (const iterator of this.projectSearchConfig) {
          if (iterator.key === "projectClassify") {
            for (const item of iterator.options) {
              if (item.dataVal === v) {
                options = this.m_copy(item.children);
              }
            }
          }
        }
        for (const iterator of this.projectSearchConfig) {
          if (iterator.key === "projectProperties") {
            iterator.options = options;
            iterator.options.unshift({ dataLabel: "全部", dataVal: "" });
          }
        }
      }
    },

    projectOnSearch(e) {
      this.projectSearchObj = Object.assign(this.projectSearchObj, e, {
        page: 1
      });
      this.getProjectListInPage();
    },

    projectOnReset() {
      this.projectSearchObj = this.m_copy(projectSearchData);
      this.getSearchList(queryPcbhmcByYear, "pc");
      this.getProjectListInPage();
    },  

   async getTableTitle() {
      let param = {
        ...this.apiParams
      };
      let resp=await this.m_apiFn(queryTableTitle)(param)
          if (resp.result && resp.result.length) {
            this.titleColumn = resp.result.map(item => {
            item.key = item.fieldCode;
            item.typeName = item.menuFieldType;
            
            item.label = item.fieldName;
            item.fixed = item.fixed==='1'?true:false;
            item.width = item.fieldWidth;
            if(item.children&&item.children.length>0){
              item.children.map(x=>{
                x.key = x.fieldCode;
                x.typeName = x.menuFieldType;
                
                x.label = x.fieldName;
                x.width = x.fieldWidth;
              })
            }
            let slotArr=new Set(["demandCode","feasibilityCode","initialOutlineCode","safetyCode","opinionsFileName","replyFileName"])
            if ( slotArr.has(item.key) ) {
              item.isSlot = true;
              item.slotName = item.key;
            }
            return item;
          });
            this.titleColumn.push({
              key: "clck",
              label: "材料查看",
              isSlot: true,
              slotName: "clck",
              baseWidth: 120,
              fixed: true,
              isLastSlot: true
            },
            {
              key: "yjck",
              label: "意见查看",
              isSlot: true,
              slotName: "yjck",
              baseWidth: 120,
              fixed: true,
              isLastSlot: true
            });
            if(this.businessType==="BUSINESSTYPE_KY"){
              this.titleColumn.push(
              {
                key: "operation",
                label: "度量结果",
                isSlot: "true",
                slotName: "operation",
                baseWidth: 90,
                fixed: true,
                isLastSlot: true
              });
            }
            
            
          }
          this.getTableClientHeight();
    },

   async getProjectListInPage() {
      this.projectSearchObj = Object.assign(this.projectSearchObj, {
        businessType: this.businessType
      });
      let param = this.m_copy(this.projectSearchObj);
      for(let key in param){
        if(Array.isArray(param[key])){
          param[key]=param[key].toString()
        }
      }
      let res=await this.m_apiFn(queryProjectManageList)( Object.assign({}, this.apiParams, param))
          if (
            res &&
            res.result &&
            res.result.rows &&
            res.result.rows.length > 0
          ) {
            this.projectTableData = res.result.rows;
            for(let item of this.projectTableData){
              if(item.serialNumber){
                item.projectCode=item.serialNumber
              }
            }
            this.projectTabletTotal = res.result.total;
          } else {
            this.projectTableData = [];
            this.projectTabletTotal = 0;
          }
    },

 selectButtons({ id }) {
      switch (id) {
        case 0:
          //建设导入
          this.exportFileModalTitle = "导入";
          this.uploadModalShow = true;
        break;
        case 1:
          //运维导入
          this.exportFileModalTitle = "运维类项目导入";
          this.uploadModalShow = true;
        break;
        case 2:
          // 导出
          if(this.businessType==="BUSINESSTYPE_KY"||this.businessType==="BUSINESSTYPE_CS"){
            this.downloadModalShow=true
            return
          }
          let trpIdList = [];
          for (const iterator of this.selectData) {
            trpIdList.push(iterator.trpId);
          }

          let param = this.m_copy(this.projectSearchObj);
          for(let key in param){
            if(Array.isArray(param[key])){
              param[key]=param[key].toString()
            }
          }

          const params = {
            projectType: this.projectType,
            businessType: this.businessType,
            ids: trpIdList.toString()
          };
         this.exportProjectManage(Object.assign({}, param, params, this.apiParams, {
              configType: "2"
            }))
          break;
        default:
          break;
      }
    },
   async exportProjectManage(params){
    let  res=await this.m_apiFn(exportProjectManage)(params)
    // this. _downFileStream(res,'国网浙江省电力有限公司营销投入项目汇总表.xls')
    // const link = document.createElement('a')
    //      const blob = new Blob([res], { type: 'application/vnd.ms-excel' })
    //      link.style.display = 'none'
    //      link.href = URL.createObjectURL(blob)
    //     //  link.setAttribute('download', decodeURI(res.headers['Content-disposition'].split('=')[1]))
    //     link.setAttribute('download', '国网浙江省电力有限公司营销投入项目汇总表.xls')
    //      document.body.appendChild(link)
    //      link.click()
    //      document.body.removeChild(link)
   },
    handleSelectionChange(val) {
      this.selectData = val;
    },

    rowDblclick(e, i) {
      this.projectRowData = e;
      this.projectInfoDialogVisible = true;
    },

    projectTableHandleSizeChange(e) {
      this.projectSearchObj.page = 1;
      this.projectSearchObj.rows = e;
      this.getProjectListInPage();
    },

    projectTableHandleCurrentChange(e) {
      this.projectSearchObj.page = e;
      this.getProjectListInPage();
    },

    //查看需求编号
    checkXqbm(row) {
      this.newRelateStoryDialogTemp = true;
      this.$nextTick(() => {
        const params = {
          relateStoryModalShow: true,
          popTitle: "查看关联需求",
          popType: "reviewComments",
          popFormData: row,
          apiParams:this.apiParams,
          tableHeight: 500
        };
        this.$refs.newRelateStoryDialogTemp.open(params);
      });
    },

    relateStoryModalCancle() {
      this.newRelateStoryDialogTemp = false;
    },


    //查看关联编号
    readKybhClick(row,type){
       this.readAssociationApiParams= {
        pageTypeTable: this.pageTypeTable,
        projectType: this.projectType,
        businessType: "BUSINESSTYPE_KY",
        configType: "1",
      }
      switch(type){
        case '2':
          this.readAssociationTitle="查看关联可研编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_KY"
          this.readAssociationApiParams.pageTypeTable="szhProjectDeclaration"
        break
        case '3':
          this.readAssociationTitle="查看关联初设编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_CS"
          this.readAssociationApiParams.pageTypeTable="csSzhProjectDeclaration"
        break
        case '4':
          this.readAssociationTitle="查看关联安全编号"
          this.readAssociationApiParams.businessType="BUSINESSTYPE_AQ"
          this.readAssociationApiParams.pageTypeTable="aqSzhProjectDeclaration"
        break
      }
     
      this.readAssociatioRowData={...row}
      this.readAssociationModelType="查看"
      this.readAssociationRelationType=type
      this.readAssociationNumberShow=true
    },


    // 查看评审意见文件
    async psyjFileHandleClick(data) {
      const param = {
        clid: data.opinionsFileId
      };
      await this.m_apiFn(downloadFile)(param)
    },

    // 查看批复意见文件
    async pfyjFileHandleClick(data) {
      const param = {
        clid: data.replyFileId
      };
      let res=await this.m_apiFn(downloadFile)(param)
      if(!res){
        this.$message.error(res.message);
      }
    },


    // 申报材料查看
    materialCheck(data, clblx) {
      this.projectRowData = data;
      this.clblx = clblx;
      this.projectRowData.xmbh = data.projectCode;
      this.projectRowData.xmlx = this.projectType;
      this.projectRowData.ywlx = this.businessType;
      this.materialUploadDialogShow = true;
    },

    // 关闭申报材料上传弹窗
    closeMaterialUploadModal() {
      this.getProjectListInPage();
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


    //度量结果
    dljgCLick(row){
      if(row.measureStatusSs==="1"){
        this.projectRowData={...row}
        this.projectRowData.isMeasure = "0"
        this.finalWorkloadModalShow=true
      }else{
        this.$message.warning("该项目未应用工作量度量")
      }
    },

    // 意见查看弹窗关闭
    checkOpinionsHandleClose() {
      this.checkOpinionsModalDialogShow = false;
    },


    //上传弹框关闭
    closeHandle(){
      this.files=""
      this.fileName=""
      this.exportProfessionalType=""
      this.uploadModalShow=false
    },

    beforeUpload(e){
      this.files=e
      this.fileName=e.name.split('.')[0]
    },

    //上传文件
   async uploadFile(){
     if(!this.exportProfessionalType){
       this.$message.warning("请选择专业类型")
       return
     }
      const fileData = new FormData();
      // let professionalType= this.exportFileModalTitle === "建设类项目导入" ? "0" : "1"
      fileData.append("files", this.files);
      fileData.append("professionalType", this.exportProfessionalType);
      fileData.append("pageTypeTable", this.pageTypeTable);
      fileData.append("projectType", this.projectType);
      fileData.append("businessType", this.businessType);
      fileData.append("configType", "2");
      let res= await this.m_apiFn(importInProject)(fileData)
      if(res.statusCode==="200"){
        this.$message.success(res.message);
        this.closeHandle();
        this.getProjectListInPage();
      }else{
        // this.$message.warning(res.message);
      }
    },

    //导出弹框
    downloadModelSure(){
      if(!this.downloadFormData.professionalType){
        this.$message.warning("请选择专业类型")
        return
      }
      let trpIdList = [];
      for (const iterator of this.selectData) {
        trpIdList.push(iterator.trpId);
      }
      let param = this.m_copy(this.projectSearchObj);
      for(let key in param){
        if(Array.isArray(param[key])){
          param[key]=param[key].toString()
        }
      }
      const params = {
        projectType: this.projectType,
        businessType: this.businessType,
        ids: trpIdList.toString(),
        professionalTypeTemp:this.downloadFormData.professionalType
      };
      this.exportProjectManage(Object.assign({}, param, params, this.apiParams, {
           configType: "2"
         }))
    },
    downloadCloseHandle(){
      this.downloadFormData.professionalType=""
      this.downloadModalShow=false
    },

    getTableClientHeight() {
      const offsetH = document.body.offsetHeight;
      if(this.$store.state.fusionVersion){
        this.$nextTick(() => {
          this.projectSearchH = this.$refs.projectSearch.clientHeight;
          const tableH =
            offsetH - // 页面高度
            // 72 - // logo栏高度 
            // 48 - // 菜单栏高度
            // 40 - // 导航栏高度
            this.projectSearchH - // 搜索栏高度
            36 - // 分页高度
            30 - // padding
            3; // border
          this.projectTableHeight = tableH;
        });
      }else{
        this.$nextTick(() => {
          this.projectSearchH = this.$refs.projectSearch.clientHeight;
          const tableH =
            offsetH - // 页面高度
            72 - // logo栏高度 
            48 - // 菜单栏高度
            40 - // 导航栏高度
            this.projectSearchH - // 搜索栏高度
            36 - // 分页高度
            30 - // padding
            3; // border
          this.projectTableHeight = tableH;
        });

      }
    }
  }
};
</script>
<style lang="less" scoped>
.tag{
    overflow: hidden !important;
    width: 100% !important;
    position: relative !important;
    padding: 0 20px 0 10px !important;
    display: flex !important;
}

.tag /deep/ .el-icon-close{
    position: absolute !important;
    top: 8px !important;
    right: 1px !important;
}

.tagSpan{
    width: 100% !important;
    display: block !important;
    overflow: hidden !important;
}
.exportSelect{
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 13px;
  .exportSelectName{
    width: 25%;
    span{
      color:red
    }
  }
  .exportSelectBox{
    width: 75%;
  }
}
</style>