<template>
  <hyModal :dialogVisible="dialogVisible" v-if="dialogVisible" :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" :width="width" @closeHandle="closeHandle">
    <!-- <hyNewForm v-if="formConfig.length" class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled">
      <el-button :disabled="disabled" slot="btn" style="margin-left:30px" @click="goDemandCorrelation">关联</el-button>
    </hyNewForm> -->
    <!-- <div style="position: absolute;right: 40px;cursor: pointer;"> -->
    <!-- </div> -->
    <div v-if="VformJson">
      <v-form-render :form-json="VformJson" :form-data="VformData" :option-data="optionData" ref="vFormRef">
      </v-form-render>
    </div>
    <template slot="footer">
      <div v-if="btnShow">
        <el-button v-if="submitBtnShow" size="medium" @click="closeHandle">取消</el-button>
        <el-button v-if="submitBtnShow" size="medium" type="primary" @click="sureHandle">保存</el-button>
        <el-button @click="closeHandle" size="medium" v-if="!submitBtnShow">关闭</el-button>
        <el-button v-if="xqlskz" size="medium" type="primary" @click="xqSnapshotHandler">需求历史快照</el-button>

      </div>
    </template>

    <!--查看可研/概设/安全编号-->
    <readAssociationNumber 
      v-if="readAssociationNumberShow" :dialogVisible="readAssociationNumberShow"  
      :isProjectForm="true"
      :title="readAssociationTitle"
      :apiParams="readAssociationApiParams"
      :batchRowData="{}"
      :readAssociationRelationType="readAssociationRelationType"
      :readAssociationModelType="readAssociationModelType"
      :pageTypeTable="apiParams.pageTypeTable" :businessType="apiParams.businessType" 
      :rowData="readAssociatioRowData"
      @readAssociationSumbit="readAssociationSumbit"
      @readAssociationClose="readAssociationNumberShow=false"
    ></readAssociationNumber>

  </hyModal>

  
</template>
<script>
import regex from "@/utils/regex";
import {
  getCydwList,
  queryDictTree,
  queryTableTitle,
  queryTableById,
  queryDemandProjectInfoById,
  queryTableFrom,
  addTable,
  updateTable,
  queryOrgByUserId,
  xqQueryOrgByUserId,
  commonQueryOrgByUserOrg,
  queryDemandGuide,
  getDemandProjectDetail
} from "@/api/common";

import readAssociationNumber from "@/pages/common/readAssociationNumber/readAssociationNumber.vue";
import common from "./common.js";
const requiredTrim = (rule, value, callback) => {
  if (!value) {
    callback(new Error("此为必填项"));
  } else if (!value.toString().trim()) {
    callback(new Error("内容为空"));
  } else {
    callback();
  }
};

// 数字，两位必填项
const numCheckTrim = (rule, value, callback) => {
  if (!value) {
    callback(new Error("此为必填项"));
  } else {
    let reg = /^(0|[1-9]+[0-9]*)(\.[0-9]{1,2})?$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入数字且不能输入空格"));
    }
  }
};

// 数字，两位必填项
const numCheck = (rule, value, callback) => {
  if (!value) {
    callback();
  } else if (!value.toString().trim()) {
    callback(new Error("请输入数字且不能输入空格"));
  } else {
    let reg = /^(0|[1-9]+[0-9]*)(\.[0-9]{1,2})?$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入数字且不能输入空格"));
    }
  }
};

export default {
  name: "projectEdit", // 配网-项目填报

  /**
   * @param dialogVisible 弹窗展示
   * @param ifCancle 取消按钮
   * @param ifSure 确认按钮
   * @param title 弹窗标题
   * @param width 弹窗宽度
   * @param btnShow 按钮显示
   * @param submitBtnShow 提交按钮显示
   * @param formRef form编辑
   * @param ifInLine form格式
   * @param disabled 是否可编辑：false可编辑，true不可编辑
   */
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    },
    width: {
      type: String,
      default: () => "1050px"
    },
    formRef: {
      type: String,
      default: () => "formRef"
    },
    ifInLine: {
      type: Boolean,
      default: () => true
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    btnShow: {
      type: Boolean,
      default: () => false
    },
    submitBtnShow: {
      type: Boolean,
      default: () => false
    },
    formData: {
      type: Object,
      default: () => null
    },
    kyformData: {
      type: Object,
      default: () => {}
    },
    apiParams: {
      type: Object,
      default: () => null
    },
    batchData: {
      type: Object,
      default: {}
    },
    page: {
      type: String,
      default: ""
    },
    needProjectData: {    //是否需要请求接口拿数据
      type: Boolean,
      default: () => true
    },
    xqlskz: {
      type: Boolean,
      default: () => false
    },
  },
  

  data() {
    const checkTime = (rule, value, callback) => {
      if (this.formObj.declareEndDate) {
        if (
          new Date(value).getTime() >= new Date(this.formObj.declareEndDate).getTime()
        ) {
          return callback("开始时间不能大于结束时间");
        } else {
          return callback();
        }
      } else {
        return callback();
      }
    };

    return {
      Org: null,
      VformJson:null,
      VformData:{},
      optionData: {},

      formObj: {},
      formRules: {},
      formConfig: [],
      //查看关联编号
      readAssociationNumberShow:false,
      readAssociationRelationType:"",
      readAssociationTitle:"",
      readAssociatioRowData:{},
      readAssociationApiParams:{},
      //级联下拉框的表单值
      cascadeFormArr:[],
      //指南下拉
      guideOption:[],
    };
  },

  components:{
    readAssociationNumber: () => import('@/pages/common/readAssociationNumber/readAssociationNumber.vue'),
  },

  async mounted() {
    console.log(this.batchData)
    window.clacValue = () =>{}
    window.linkSelect= this.linkSelect
    await this.getForm()
    // 修改查看
    if (this.formData) {
      this.formObj = this.formData;
      console.log(this.formData)
      // 获取数据
      // await setTimeout(()=>{
         await this.getFormData()
      // },1000)
    }
    
    


    // this.$nextTick(()=>{
      await this.setFormValues()
      // this.setSubFormValues()
    // })

    // this.getDict("APP_XXH_YYWD");
    // this.getDict("APP_PROJECTCLASSIFY");
    // this.getDict("APP_SZH_XMFL");

    // this.getOrgByUserOrgCydw(); //参与单位

    
    // this.getDict("APP_XXH_YYWD");
    // this.getDict("APP_PROJECTCLASSIFY");
    // this.getDict("APP_SZH_XMFL");

    // this.getOrgByUserOrgCydw(); //参与单位

    
  },

  methods: {
    async getForm(){
      let res= await this.m_apiFn(queryTableFrom)({...this.apiParams,investmentChannel:this.batchData.investmentChannel,professionalType:this.batchData.professionalType})
      let obj = {
        widgetList: [],
        formConfig: {}
      }
      console.log(res.result)
      // let params={...this.apiParams,investmentChannel:this.batchData.investmentChannel,professionalType:this.batchData.professionalType}
      // params.orgList = this.batchData.batchCompany?this.batchData.batchCompany.toString():[];
      let result = await this.m_apiFn(xqQueryOrgByUserId)(this.apiParams)
      this.Org = result.result
      // this.Org = this.OrgList(result.result)
      console.log(this.Org,"OrgOrgOrgOrg")
      //获取指南下拉
      let guideParams={}
      if(this.formData){
        guideParams.projectCode=this.formData.projectCode
      }
      let guideOptionRes = await this.m_apiFn(queryDemandGuide)(guideParams)
      if(guideOptionRes.result&&guideOptionRes.result.length){
        this.guideOption=guideOptionRes.result
        
      }


      if(res.result&&res.result.widgetList&&res.result.widgetList.length){
        for(let item of res.result.widgetList){
          this.cascadeFormArr=[]
          if((item.options.fieldType==="7"||item.options.fieldType==="8"||item.options.fieldType==="14")&&item.options.fieldCode!=="tdgId"){
            this.cascadeFormArr.push(item.options.fieldCode)
          }
          //赋值给指南对应章节下拉
          if(item.options.fieldCode==="tdgId"){
            item.options.optionItems=this.guideOption
            item.options.showAllLevels=true
            console.log(item)
          }

        }
        this.$nextTick(()=>{
          // obj.widgetList = common.pStoVf(res.result.widgetList,this.Org,this.title==='查看'||this.disabled?true:false)
          obj.widgetList = common.pStoVf(res.result.widgetList,this.Org,true)
        })
        obj.formConfig = {
          projectType: this.projectType,
          businessType: this.businessType,
          formName: res.result.formConfig.formName,
          labelPosition: res.result.formConfig.labelPosition,
          labelAlign: res.result.formConfig.labelAlign,
          labelWidth: res.result.formConfig.labelWidth,
          remark: res.result.formConfig.remark,
          trfcId: res.result.formConfig.trfcId
        }
      }
      this.VformJson = obj
      console.log(this.VformJson,"VformJsonVformJson")
    },

    OrgList(val){
      let arr=val.map(item=>{
        item.label = item.dataLabel?item.dataLabel:item.name,
        item.value = item.dataVal?item.dataVal:item.busCode
        if(item.children){
          this.OrgList(item.children)
        }
        return item;
      })
      return arr
    },



    async getFormData(){
      console.log(this.kyformData,'this.kyformData')
      console.log(getDemandProjectDetail,'getDemandProjectDetail')
      let res = await this.m_apiFn(getDemandProjectDetail)({
        // ...this.apiParams,
        // configType: "1",
        // id: this.formData.trpId
        projectCode: this.kyformData.projectCode,
        demandCode: this.formData.projectCode
      })
      console.log(res.result)
      // console.log(result.result.list)

      if(res && res.result&&res.result.projectCompany){
        // res.result.projectCompany = res.result.projectCompany.split(',')
        // res.result.projectCompany = common.getParentsById(this.Org,res.result.projectCompany)
      }
      if(res && res.result&& res.result.tdgId){
        res.result.tdgId=res.result.tdgId.split(",")
      }
      if(res.result.serialNumber){
        res.result.projectCode=res.result.serialNumber
      }
      this.VformData = res.result
      if (res && res.result) {
        this.VformJson.widgetList.map(item=>{
          this.VformData[item.options.name]=this.VformData[item.options.name]?this.VformData[item.options.name]:''
          console.log(item)
          // if(item.options.fieldCode==='projectCompany'){
          // if(item.options.name==='projectCompany'){
          //   // result.result[item.options.name]=result.result[item.options.name]?result.result[item.options.name].split(","):[]
          //   // item.options.defaultValue = result.result[item.options.fieldCode]?result.result[item.options.fieldCode].split(","):[]
          //   item.options.defaultValue = result.result[item.options.name]?result.result[item.options.name].split(","):[]
          // }
          // else {
          //   // item.options.defaultValue = result.result[item.options.fieldCode]
          //   item.options.defaultValue = result.result[item.options.name]
          // }
        })
      }
    },



    setSubFormValues(){
      this.$refs['vFormRef'].setSubFormValues(
          this.VformData.list
      )
    },

    setFormValues(data){
      this.$refs['vFormRef'].setFormData(
          this.VformData
      )
    },

    linkSelect(code,value){
      // console.log(code)
      // console.log(value)
      // console.log(this.VformJson)
      // console.log(123123123)
      this.VformJson.widgetList.map(async item=> {
        if(item.options.preKey === code){
          if(value&&value!==''){
            console.log(this.title,'title')
            if(this.title !== '查看'){
              item.options.readonly = false
            }
            document.getElementById(`${item.options.fieldCode}`).value = ''
            let res = await this.m_apiFn(queryDictTree)(item.options.dictheadId)
            console.log(res.result)
            console.log(item.options.dictLevel)
            await this.changeValue(value,res.result)
            item.options.optionItems = this.option
            console.log(item.options.optionItems)
            // debugger
          }else {
            item.options.readonly = true
          }
        }
      })
    },

    // 数据转化
    changeValue(value,data){
      // debugger
      data.map(item=>{
        if(item.dataVal === value){
          this.option = common.optionsItem(item.children)
          // debugger
        }else {
          if(item.children){
            this.changeValue(value,item.children)
          }
        }
      })
    },

    // 字典表
    async getDict(dataVal) {
      let res = await this.m_apiFn(queryDictTree)(dataVal);
      if (res && res.result && res.result.length > 0) {
        for (const iterator of this.formConfig) {
          if (
            (dataVal === "APP_XXH_YYWD" && iterator.key === "yywd") ||
            (dataVal === "APP_PROJECTCLASSIFY" && iterator.key === "xmsx") ||
            (dataVal === "APP_SZH_XMFL" && iterator.key === "xmfl")
          ) {
            iterator.options = res.result.map(item => {
              item.dataLabel = item.dataLabel;
              item.dataVal = item.dataVal;
              return item;
            });
          }
        }
      }
    },

    // 获取下拉数据
    async getCommonTree(dataVal, keyCode) {
      let res = await this.m_apiFn(queryDictTree)(dataVal);
      if (res && res.result && res.result.length > 0) {
        for (const iterator of this.formConfig) {
          if (iterator.key == keyCode) {
            iterator.options = res.result.map(item => {
              item.dataLabel = item.dataLabel;
              item.dataVal = item.dataVal;
              return item;
            });
          }
        }
      }
    },


    // 关闭
    closeHandle() {
      this.$emit("closeHandle");
    },
    //需求快照
    xqSnapshotHandler(){
      this.$emit('xqSnapshotHandler',this.formData)
    },

    // 保存
    sureHandle() {
      this.$refs['vFormRef'].getFormData().then(formData=>{
        console.log(formData)
        // for(let item in formData){
        //   console.log(item);    //item是对象属性名 name,age,job,hobby
        // }
        
        let formObj = {...this.formData,...formData}
        console.log(formData)
          // if (
          //   typeof formObj.projectCompany != "string" &&
          //   formObj.projectCompany != null
          // ) {
          //   if (formObj.projectCompany.length != 0) {
          //     formObj.projectCompany =
          //       formObj.projectCompany[formObj.projectCompany.length - 1];
          //   }
          // }
          let params = {
            ...formObj,
            ...this.apiParams,
            configType: "1",
            batchCode: this.batchData.batchCode
          };
          if(params.feasibilityCode){
            params.relationProjectCodeStr=params.feasibilityCode
          }
          
          if (this.formData&&this.needProjectData) {
            this._updateTable(params)
          } else {
            this.addTableData(formObj);
          }
      })
    },

    deepComponent(arr) {
      arr.map(item => {
        item.orgId = item.busCode;
        item.orgName = item.name;
        item.children = item.children
          ? item.children.length == 0
            ? null
            : item.children
          : null;
        if (item.children) {
          this.deepComponent(item.children);
        }
        return item;
      });

      return arr;
    },
    // 查找项目参与单位
    async getOrgByUserOrgCydw() {
      const param = {
        isKj: 1
      };
      let res = await this.m_apiFn(getCydwList)(param);
      for (const iterator of this.formConfig) {
        if (iterator.key === "cydw") {
          iterator.options = res.result;
        }
      }
    },



  //   // 新增数据
   async addTableData(obj) {
     console.log(obj)
      let params = {
        ...obj,
        ...this.apiParams,
        configType: "1",
        batchCode: this.batchData.batchCode
      };
      console.log(params,'params')
      console.log(this.formData,'this.formData')
      if(this.apiParams.businessType == 'BUSINESSTYPE_KY' && this.apiParams.investmentChannel != '3'){
        params.relationProjectCodeStr=this.formData.relationProjectCodeStr
      }
      let resp=await this.m_apiFn(addTable)(params)
        if (resp.statusCode == 200) {
          this.$message.success(resp.result ? resp.result : "成功");
          this.$emit("sureHandle", { type: "add" });
          return;
        } else {
          // this.$message.warning(resp.message);
          return;
        }
    },


  //   //关联编号
    goDemandCorrelation(){
      this.readAssociationApiParams= {
        pageTypeTable: this.apiParams.pageTypeTable,
        projectType: this.apiParams.projectType,
        businessType: "BUSINESSTYPE_KY",
        configType: "1",
      }
      this.readAssociationTitle="关联可研编号"
      this.readAssociationApiParams.businessType="BUSINESSTYPE_KY"
      this.readAssociatioRowData={}
      this.readAssociationModelType="关联"
      this.readAssociationRelationType="2"
      this.readAssociationNumberShow=true
    },

  //   //关联弹框确认
    async readAssociationSumbit(data){
      let params = {
        ...this.apiParams,
        // id: this.formData?this.formData.trpId?this.formData.trpId:'':'',
        trpId: data.trpId,
        id: data.trpId,
        configType: "1"
      };
      if(this.apiParams.businessType==="BUSINESSTYPE_KY"){
        params.pageTypeTable="szhProjectDeclaration"
      }else if(this.apiParams.businessType==="BUSINESSTYPE_CS"){
        params.pageTypeTable="szhCsProjectDeclaration"
      }else if(this.apiParams.businessType==="BUSINESSTYPE_AQ"){
        params.pageTypeTable="szhAqProjectDeclaration"
      }
      params.businessType=this.apiParams.businessType
      let res=await this.m_apiFn(queryTableById)(params)
      if(res.statusCode==="200"){
        this.readAssociationNumberShow=false
        let rowData={...res.result}
        rowData.feasibilityCode=rowData.projectCode
        rowData.projectCode=""
        this.formObj=Object.assign({},this.formObj,rowData)
      }
      
      
    },

    async _updateTable(params){
      let resp=await this.m_apiFn(updateTable)(params)
              if (resp.statusCode == 200) {
                this.$message.success(resp.result ? resp.result : resp.message);
                this.$emit("sureHandle");
                return;
              } else {
                // this.$message.warning(resp.message);
                return;
              }
    },

  //   deepComponent(arr){
  //     arr.map(item => {
  //       item.orgId=item.busCode
  //       item.orgName=item.name
  //       item.children=item.children?item.children.length==0?null:item.children:null
  //       if(item.children){
  //       this.deepComponent(item.children)
  //     }
  //       return item
  //     });
      
  //     return arr
  //   },
  }
};
</script>
<style lang="less" scoped>
.form-box {
  /deep/ .el-form-item__label {
    padding: 0;
    height: 16px;
  }
}

.form-box /deep/ .el-input.is-disabled .el-input__inner,
.form-box /deep/ .el-textarea.is-disabled .el-textarea__inner {
  color: #9a9a9a;
}

.modal-bottom {
  display: flex;
  justify-content: space-between;
  padding: 0 60px;
  box-sizing: border-box;
  margin-top: 26px;

  .modal-bottom-item {
    display: flex;
    flex-direction: column;
    align-items: center;

    .el-form {
      margin-top: 20px;

      /deep/ .el-form-item--small.el-form-item {
        display: flex;
      }

      /deep/ .el-form-item--small .el-form-item__label {
        width: 80px;
        text-align: right;
      }
    }
  }
}
</style>