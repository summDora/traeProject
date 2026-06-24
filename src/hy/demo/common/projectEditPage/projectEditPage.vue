<template>
  <div>
    <!-- <hyNewForm v-if="formConfig.length" class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled">
      <el-button :disabled="disabled" slot="btn" style="margin-left:30px" @click="goDemandCorrelation">关联</el-button>
    </hyNewForm> -->
    <div v-if="VformJson">
      <v-form-render :form-json="VformJson" :form-data="VformData" :option-data="optionData" ref="vFormRef">
      </v-form-render>
    </div>
    <div v-if="btnShow" style="text-align:center">
      <el-button v-if="submitBtnShow" size="medium" @click="closeHandle">取消</el-button>
      <el-button v-if="submitBtnShow" size="medium" type="primary" @click="sureHandle">保存</el-button>
      <el-button @click="closeHandle" size="medium" v-if="!submitBtnShow">关闭</el-button>
    </div>

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
  </div>
</template>
<script>
import regex from "@/utils/regex";
import {
  getCydwList,
  queryDictTree,
  queryTableTitle,
  queryTableById,
  queryTableFrom,
  addTable,
  updateTable,
  queryOrgByUserId,
  commonQueryOrgByUserOrg,
  queryDemandGuide
} from "@/api/common";



import { querySysOrgTree } from "@/api/szhApi/common";
import readAssociationNumber from "@/pages/common/readAssociationNumber/readAssociationNumber.vue";
import common from "@/utils/common";
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
  name: "projectEditPage", // 配网-项目填报

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
    onlyNeedcsxx: {    //是否只需要编辑厂商信息
      type: String,
      default: () => '0'
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
    // console.log(this.batchData)
    window.linkSelect= this.linkSelect
    window.clacValue= this.clacValue
    
    await this.getForm()
    // 修改查看
    if (this.formData && Object.keys(this.formData).length) {
      this.formObj = this.formData;
      console.log(this.formData,'formData,mounted')
      // 获取数据
      // await setTimeout(()=>{
      await this.getFormData()
         
      // },1000)
    }
    
    // if(!this.VformData.investmentChannel&&this.batchData.investmentChannel){
    //   this.VformData.investmentChannel=this.batchData.investmentChannel
    // }
    


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
      let res= await this.m_apiFn(queryTableFrom)({...this.apiParams,professionalType:this.batchData.professionalType})
      // investmentChannel:this.batchData.investmentChannel,
      let obj = {
        widgetList: [],
        formConfig: {}
      }
      // console.log(res.result)
      // let params={...this.apiParams,investmentChannel:this.batchData.investmentChannel,professionalType:this.batchData.professionalType}
      // params.orgList = this.batchData.batchCompany?this.batchData.batchCompany.toString():[];
      let queryOrgParams={
        ...this.apiParams,
        orgList:this.batchData.batchCompany?this.batchData.batchCompany.split(','):[]
      }
      let result = await this.m_apiFn(queryOrgByUserId)(queryOrgParams)
      this.Org = result.result

      //获取指南下拉
      // let guideParams={}
      // if(this.formData){
      //   guideParams.projectCode=this.formData.projectCode
      // }
      // let guideOptionRes = await this.m_apiFn(queryDemandGuide)(guideParams)
      // if(guideOptionRes.result&&guideOptionRes.result.length){
      //   this.guideOption=guideOptionRes.result
        
      // }

      // console.log(common.optionsItems(result.result))
      if(res.result&&res.result.widgetList&&res.result.widgetList.length){
        this.cascadeFormArr=[]
        for(let item of res.result.widgetList){
          if(item.options.fieldType==="7"||item.options.fieldType==="8"||item.options.fieldType==="14"){
            this.cascadeFormArr.push(item.options.fieldCode)
          }
          //赋值给指南对应章节下拉
          // if(item.options.fieldCode==="tdgId"){
          //   item.options.optionItems=this.guideOption
          //   item.options.showAllLevels=true
          //   console.log(item)
          // }

        }
        // console.log(this.cascadeFormArr,"this.cascadeFormArr")
        obj.widgetList = common.pStoVf(res.result.widgetList,result.result,this.title==='查看'||this.disabled?true:false)
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
      // console.log(this.VformJson,"VformJsonVformJson")
    },
    async getFormData(){
      let res = await this.m_apiFn(queryTableById)({
        ...this.apiParams,
        configType: "1",
        id: this.formData.trpId
      })
      // console.log(result.result.list)

      if(res && res.result&&res.result.projectCompany){
        // res.result.projectCompany = res.result.projectCompany.split(',')
        // res.result.projectCompany = common.getParentsById(this.Org,res.result.projectCompany)
      }
      if(this.needProjectData){
        this.VformData = res.result
      }else{
        this.VformData = this.formObj
      }
      // console.log(this.VformJson.widgetList,'this.VformJson.widgetList')
      if (res && res.result) {
        this.VformJson.widgetList.map(item=>{
          if(item.options.fieldType==="2"){
            this.$set(this.VformData,item.options.name,res.result[item.options.name] ? res.result[item.options.name] : item.options.defaultValue?item.options.defaultValue:0)
          }else{

            if(item.type == 'sub-form' && item.options.widgetList.length > 0){
              let arr = {}
              item.options.widgetList.forEach((widgetItem,widgetIndex)=>{
                if(widgetItem.options.widgetList&&widgetItem.options.widgetList.length>0){
                    widgetItem.options.widgetList.forEach((item2,index2)=>{
                      if(item2.options.widgetList&&item2.options.widgetList.length>0){
                        
                      }else{
                        arr[item2.options.fieldCode] = ''
                      }
                    })
                }else{
                  arr[widgetItem.options.fieldCode] = ''
                }
              })
              // console.log(arr,'arr')
              // this.VformData[item.options.name]=this.VformData[item.options.name]?this.VformData[item.options.name]:arr
              this.$set(this.VformData,item.options.name,this.VformData[item.options.name] || this.VformData[item.options.name] == 0 ?this.VformData[item.options.name]:[arr])
            }else{
              this.VformData[item.options.name]=this.VformData[item.options.name] || this.VformData[item.options.name] == 0 ?this.VformData[item.options.name]:''
            }
          }
          // console.log(item)
          // console.log(this.VformData,'this.VformData')
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
    clacValue(){

    },
    linkSelect(code,value){
      // console.log(code,'code')
      // console.log(value,'value')
      // console.log(this.VformJson)
      // console.log(this.m_copy(this.VformJson),'this.VformJson')
      this.VformJson.widgetList.map(async item=> {
        if(item.options.preKey === code){
          if(value&&value!==''){
            let titleList = ['新增','修改','项目填报','项目信息','修改项目信息']
            if(titleList.includes(this.title)&&this.onlyNeedcsxx==='0'){
              item.options.readonly = false
            }
            document.getElementById(`${item.options.fieldCode}`).value = ''
            let res = await this.m_apiFn(queryDictTree)(item.options.dictheadId)
            // console.log(res.result)
            // console.log(item.options.dictLevel)
            await this.changeValue(value,res.result)
            item.options.optionItems = this.option
            // console.log(item.options.optionItems)
            // debugger
          }else {
            item.options.readonly = true
            // if(item.options.widgetList && item.options.widgetList.length>0){
            //   item.options.widgetList.map(item1 => {
            //     item1.options.readonly = true 
            //   })
            // }
          }
        }
      })
      // console.log(this.m_copy(this.VformJson),'thi11111111')
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
    async getDict(dictId) {
      let res = await this.m_apiFn(queryDictTree)(dictId);
      if (res && res.result && res.result.length > 0) {
        for (const iterator of this.formConfig) {
          if (
            (dictId === "APP_XXH_YYWD" && iterator.key === "yywd") ||
            (dictId === "APP_PROJECTCLASSIFY" && iterator.key === "xmsx") ||
            (dictId === "APP_SZH_XMFL" && iterator.key === "xmfl")
          ) {
            iterator.options = res.result.map(item => {
              item.dictName = item.dataLabel;
              item.dictId = item.dataVal;
              return item;
            });
          }
        }
      }
    },

    // 获取下拉数据
    async getCommonTree(dictId, keyCode) {
      let res = await this.m_apiFn(queryDictTree)(dictId);
      if (res && res.result && res.result.length > 0) {
        for (const iterator of this.formConfig) {
          if (iterator.key == keyCode) {
            iterator.options = res.result.map(item => {
              item.dictName = item.dataLabel;
              item.dictId = item.dataVal;
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

    // 保存
    sureHandle() {
      // console.log(this.$refs['vFormRef'])
      this.$refs['vFormRef'].getFormData().then(formData=>{
        // console.log("1111")
        // console.log(formData,'formData000')
        // for(let item in formData){
        //   console.log(item);    //item是对象属性名 name,age,job,hobby
        // }
        
        let formObj = {...this.formData,...formData}
        // console.log(formData)
        for(let item of this.cascadeFormArr){
          if (Array.isArray(formObj[item])&&formObj[item].length) {
            // console.log(formObj[item],"formObj[item]formObj[item]")
            formObj[item] =formObj[item][formObj[item].length - 1];
          }
        }
        // console.log(formObj,"formObjformObjformObj")
          
          let params = {
            ...formObj,
            ...this.apiParams,
            configType: "1",
            batchCode: this.batchData.batchCode
          };
          if(params.feasibilityCode){
            params.relationProjectCodeStr=params.feasibilityCode
          }

          // if(this.guideOption&&this.guideOption.length){
          //   console.log(this.guideOption,"this.guideOptionthis.guideOptionthis.guideOption")
          //   formObj.demandGuideId=this.guideOption[0].demandGuideId
          //   params.demandGuideId=this.guideOption[0].demandGuideId
          // }
          // console.log(this.formData,'this.formData','Object.keys(this.formData).length > 0')
          if (this.formData&&Object.keys(this.formData).length > 0&& this.needProjectData) {
            this._updateTable(params)
          } else {
            this.addTableData(formObj);
          }
      }).catch(err=>{
        // console.log(err)
        this.$message.warning("请检查必填信息是否填写完整。");
      })
    },

    // 查找项目单位
    async getOrgByUserOrgXmcddw() {
      let param = this.apiParam
      // let res=await this.m_apiFn(this.page == "lgBatchManage"
      //     ? lgQuerySysOrgTree
      //     : commonQueryOrgByUserOrg)(param)
    if (this.page == "szhBatchManage" || this.page=='szhProjectDeclaration') {
        param.orgList = this.batchData.batchCompany?this.batchData.batchCompany.split(','):[];
      }
    
     let res=await this.m_apiFn( this.page == "szhBatchManage"||this.page=='szhProjectDeclaration'?queryOrgByUserId:querySysOrgTree)(param)
      for (const iterator of this.formConfig) {
        if (iterator.key === "projectCompany") {
          iterator.options = this.deepComponent(res.result);
          // console.log(this.deepComponent(res.result),'this.deepComponent(res.result)')
        }
      }
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
    //  console.log(obj)
      let params = {
        ...obj,
        ...this.apiParams,
        configType: "1",
        batchCode: this.batchData.batchCode,
        professionalType: this.batchData.professionalType,
        // investmentChannel: this.batchData.investmentChannel,
      };
      // console.log(params,'params')
      // console.log(this.formData,'this.formData')
      if(this.apiParams.businessType == 'BUSINESSTYPE_KY' && this.apiParams.investmentChannel != '3'){
        params.relationProjectCodeStr=this.formData.relationProjectCodeStr
      }
      let resp=await this.m_apiFn(addTable)(params)
        if (resp.statusCode == 200) {
          this.$message.success(resp.result ? resp.result : "成功");
          this.$emit("sureHandle", { type: "add" },params);
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
        params.pageTypeTable="csSzhProjectDeclaration"
      }else if(this.apiParams.businessType==="BUSINESSTYPE_AQ"){
        params.pageTypeTable="aqSzhProjectDeclaration"
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
      console.log(params,'params')
      if(params.businessType == "BUSINESSTYPE_AQ"){
        delete params.batchType
        delete params.batchTypeName
      }
      let resp=await this.m_apiFn(updateTable)(params)
      if (resp.statusCode == 200) {
        this.$message.success(resp.result ? resp.result : resp.message);
        this.$emit("sureHandle",'edit',params);
        return;
      } else {
        // this.$message.warning(resp.message);
        return;
      }
    },
  //   // 查找项目单位
  //  async getOrgByUserOrgXmcddw() {
  //     let param = this.apiParams;
  //     if (this.page == "yxBatchManage") {
  //       param.batchCompany = this.batchData.batchCompany;
  //     }
       
 
  //    let res=await this.m_apiFn( this.page == "yxBatchManage"
  //         ? querySysOrgTree
  //         : queryOrgByUserId)(param)
       
  //         for (const iterator of this.formConfig) { 
  //           if (iterator.keyCode === "projectCompany") {
    
  //             iterator.options = this.deepComponent(res.result);
  //             // console.log(this.deepComponent(res.result),'this.deepComponent(res.result)')
  //           }
  //         }
  //   },

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
  //   // 查找项目参与单位
  //  async getOrgByUserOrgCydw() {
  //     const param = {
  //       isKj: 1
  //     };
  //     let res=await this.m_apiFn(getCydwList)(param)
  //         for (const iterator of this.formConfig) {
  //           if (iterator.key === "cydw") {
  //             iterator.options = res.result;
  //           }
  //         }
  //   }
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