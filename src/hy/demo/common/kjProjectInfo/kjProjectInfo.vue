<template>
  <hyModal :dialogVisible="dialogVisible"  v-if="dialogVisible" :ifThird="true" :ifCancle="disabled ? false : ifCancle" :ifSure="disabled ? false : ifSure" :title="title" :width="width" @closeHandle="closeHandle" @sureHandle="sureHandle" >
    <hyNewForm class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled" @formSelectchange="formSelectchange">
     <el-button slot="btn" style="margin-left:30px" @click="goDemandCorrelation">关联</el-button>
    </hyNewForm>
    <!-- {{zscqdkhzb}} -->
    <template  slot="footer">
      <div v-if="btnShow">
        <el-button v-if="submitBtnShow" size="medium" @click="closeHandle">取消</el-button>
        <el-button v-if="submitBtnShow" size="medium" type="primary" @click="sureHandle">保存</el-button>
        <el-button @click="closeHandle" size="medium" v-if="!submitBtnShow" >关闭</el-button>
      </div>
    </template>
  </hyModal>
</template>
<script>


import {  queryOrgByUserOrg,getCydwList, getDictTree} from '@/api/common'
import {
  xqxmFormConfig,
  xqxmFormConfigDisable,
  xqxmFormData,
  xqxmFormRules
} from "./config.js";

export default {
  name: "kjProjectInfo", // 项目填报

  /**
   * @param dialogVisible 弹窗展示
   * @param ifCancle 取消按钮
   * @param ifSure 确认按钮
   * @param title 弹窗标题
   * @param width 弹窗宽度
   * @param sbpc 申报批次
   * @param btnShow 按钮显示
   * @param submitBtnShow 提交按钮显示
   * @param formRef form编辑
   * @param ifInLine form格式
   * @param disabled 是否可编辑：false可编辑，true不可编辑
   * @function getDictTree 数据字典表
   * @function queryOrgByUserOrg 项目单位
   * @function getAllDeptList 业务部门
   * @function queryProjectInfoForYwApi 查询运维类附属数据
   */
  props: {
    dialogVisible: {
      type: Boolean,
      required: true,
      default: () => false
    },
    ifCancle: {
      type: Boolean,
      default: () => true
    },
    ifSure: {
      type: Boolean,
      default: () => true
    },
    title: {
      type: String,
      default: () => ""
    },
    type:{
       type: String,
      default: () => ""
    },
    opearType: {
      type: String,
      default: () => ""
    },
    sbpc:{
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
    page: {
      type: String,
      default: () => ""
    },
    ifInLine: {
      type: Boolean,
      default: () => true
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    btnShow:{
      type: Boolean,
      default: () => false
    },
    submitBtnShow:{
      type: Boolean,
      default: () => false
    },
    formData: {
      type: Object,
      default: () => null
    },
    queryProjectInfoForYwApi: {
      type: Function,
      default: () => null
    }
  },

  data() {
    const checkTime = (rule, value, callback) => {
      if(this.formObj.declareEndDate){
        if(new Date(value).getTime()>=new Date(this.formObj.declareEndDate).getTime() ){
          return callback('开始时间不能大于结束时间');
        }else{
          return callback();
        }
      }else{
        return callback();
      }
    }
    return {
      xqxmFormConfig,
      xqxmFormConfigDisable,
      formObj: this.m_copy(xqxmFormData),
      formRules: {...xqxmFormRules,
        declareStartDate: [{ required: true, message: "请填写开始时间", trigger: "blur" },
        { validator: checkTime, trigger: "blur"  }
        ]
      },
      formConfig: '',
      
    };
  },
  computed:{
    zscqdkhzb:{
       get:function (){
          this.formObj.fblw===null?this.formObj.fblw="":this.formObj.fblw=this.formObj.fblw
          this.formObj.fmzl===null?this.formObj.fmzl="":this.formObj.fmzl=this.formObj.fmzl
          this.formObj.sqrz===null?this.formObj.sqrz="":this.formObj.sqrz=this.formObj.sqrz
          return '发表或录用中文核心期刊或三大检索论文'+this.formObj.fblw+'篇，申请发明专利'+this.formObj.fmzl+'篇、软件著作权'+this.formObj.sqrz+'项'
        }
    }

  },
  created(){
  },
  watch:{
    'zscqdkhzb'(){
      if(!this.formObj.fblw&&!this.formObj.fmzl&&!this.formObj.sqrz){
        this.formObj.yqmbhcgzb=""
      }else{
        this.$set(this.formObj,'yqmbhcgzb',this.zscqdkhzb)
      }
    },
    'formObj.declareEndDate'(){
      this.$nextTick(()=>{
         this.$refs[this.formRef].$refs.form.validateField('declareStartDate')
      })
      
    }
  },
  mounted() {
    if(this.disabled === true ) {
      this.formConfig = this.xqxmFormConfigDisable
       for (const iterator of this.formConfig) {
         if(iterator.key === "xmcddw"||iterator.key === "cydw"){
           iterator.notShow=true
         }else if(iterator.key === "xmcddwName"||iterator.key === "cydwName"){
           iterator.notShow=false

         }
       }
    }else {
      this.formConfig = this.xqxmFormConfig
    }
    // APP_PROJECTCLASSIFY 项目分类-建设
    // APP_XXH_XMFL_YW 项目分类-运维
    // APP_XXH_YYWD 应用维度
    // APP_SZH_XMFL 项目属性
    // APP_KJ_XQJSLY技术领域
    //APP_KJ_XQZYFX  专业方向
    //APP_KJ_XMLB 项目类别
    // APP_KJ_SYSMC实验室
    // APP_KJ_CXTDMC科研创新团队
    // 项目单位
    this.getOrgByUserOrgCydw();
    this.getOrgByUserOrgXmcddw();

    this.getDict("APP_XXH_YYWD");
    if (this.type === "js") {
      this.getDict("APP_PROJECTCLASSIFY");
      this.getDict("APP_SZH_XMFL");
    } else if (this.type === "yw") {
      this.getDict("APP_XXH_XMFL_YW");
    }else if (this.type === "xm") {
      this.getDict("APP_KJ_XQJSLY");
      this.getDict("APP_KJ_XQZYFX");
      this.getDict("APP_KJ_XMLB");
      this.getDict("APP_KJ_CXTDMC");
      this.getDict("APP_KJ_SYSMC");
    }
    //对口业务部门
    this.getDict("APP_XXH_YWBM");
    // 业务部门
    // this._getAllDeptList();
    console.log(this.formConfig[3])
    
    if (this.formData) {
      this.formObj = this.formData;
      this.leftFormObj = this.formData;
      this.centerFormObj = this.formData;
      this.rightFormObj = this.formData;
      if (this.type === "yw") {
        this.getProjectInfoForYw();
      }
      console.log(this.formObj.xmcddw)
    }
  },

  methods: {
    // 字典表
    getDict(dataVal) {
      this.m_apiFn(getDictTree, dataVal)
        .then(res => {
          if (
            res &&
            res.result &&
            res.result.children &&
            res.result.children.length > 0
          ) {
            for (const iterator of this.formConfig) {
              if (
                (dataVal === "APP_XXH_YYWD" && iterator.key === "yywd") ||
                (dataVal === "APP_PROJECTCLASSIFY" && iterator.key === "xmsx") ||
                (dataVal === "APP_SZH_XMFL" && iterator.key === "projectClassify") ||
                (dataVal === "APP_XXH_XMFL_YW" && iterator.key === "projectClassify") ||
                (dataVal === "APP_XXH_YWBM" && iterator.key === "ywubm") ||
                (dataVal === "APP_KJ_XQJSLY" && iterator.key === "jsly") ||
                (dataVal === "APP_KJ_XQZYFX" && iterator.key === "zyfx") ||
                (dataVal === "APP_KJ_XMLB" && iterator.key === "xmlb") ||
                (dataVal === "APP_KJ_CXTDMC" && iterator.key === "kycxtd") ||
                (dataVal === "APP_KJ_SYSMC" && iterator.key === "sysmc") ||
                (dataVal === "APP_XXH_YWBM" && iterator.key === "dkywbm") 
              ) {
                iterator.options = res.result.children;

                if (
                  this.type === "yw" &&
                  dataVal === "APP_XXH_XMFL_YW" &&
                  iterator.key === "projectClassify"
                ) {
                  this.formSelectchange(this.formData.projectClassify, "projectClassify", true);
                }
              }
            }
          }
        })
        .catch(err => {});
    },
    goDemandCorrelation(){
      this.$emit('demandCorrelation')
    },
    getParams(val){
      xqxmFormData.xqbh=val
      this.formObj.xqbh=val;
  
    },
    // 获取业务部门
    _getAllDeptList() {
      this.m_apiFn(getAllDeptList, {})
        .then(resp => {
          if (resp && resp.result && resp.result.length > 0) {
            for (const iterator of this.formConfig) {
              if (iterator.key === "ywubm") {
                iterator.options = resp.result;
                iterator.options.unshift({ orgName: "全部", orgId: "" });
              }
            }
          }
        })
        .catch(err => {});
    },

    // 查找项目单位
    getOrgByUserOrgXmcddw() {
      const param = {
        
      }
      //queryOrgByUserOrg
      let url=""
      if(this.page==="kjProjectManagement"){
        url=queryKjOrgTree
      }else{
        url=getXmcddwList
      }
      
      this.m_apiFn(url, param)
        .then(res => {
          for (const iterator of this.formConfig) {
            if (iterator.key === "xmcddw") {
              iterator.options = res.result
              
            }
          }
          
        })
        .catch(err => {});
    },
    // 查找项目参与单位
    getOrgByUserOrgCydw() {
      const param = {
        isKj:1
      }
      //queryOrgByUserOrg
      this.m_apiFn(getCydwList, param)
        .then(res => {
          for (const iterator of this.formConfig) {
            if (iterator.key === "cydw") {
              iterator.options = res.result
            }
          }
          
        })
        .catch(err => {});
    },
    // 查询运维类附属数据
    getProjectInfoForYw() {
      this.m_apiFn(this.queryProjectInfoForYwApi, { xmbh: this.formData.xmbh })
        .then(res => {
          if (res && res.result) {
            this.formData = Object.assign(this.formData, res.result);
          }
        })
        .catch(err => {});
    },

    closeHandle() {
      this.$emit("closeHandle");
    },

    sureHandle() {  
      this.$refs[this.formRef].$refs.form.validate(valid => {
        if (valid) {
          let formObj=JSON.parse(JSON.stringify(this.formObj))
          formObj.xqpcbh=this.sbpc
          if( typeof formObj.xmcddw!='string'&&formObj.xmcddw!=null){
            if(formObj.xmcddw.length!=0){
              formObj.xmcddw= formObj.xmcddw[formObj.xmcddw.length-1]
            }
          }
           if( typeof formObj.cydw!='string'&&formObj.cydw!=null){
             if(formObj.xmcddw.length!=0){
            formObj.cydw= formObj.cydw[formObj.cydw.length-1]
            }
          }
          const obj = {
            formObj: formObj,
            leftFormObj: this.leftFormObj,
            centerFormObj: this.centerFormObj,
            rightFormObj: this.rightFormObj
          };
          if(this.formData){
             this.m_apiFn(updateDeclare,formObj).then(resp => {
              if(resp.statusCode==200){
                this.$message.success(resp.result)
                this.$emit("sureHandle", obj);
                return;
              }else {
                 this.$message.warning(resp.message)
                 return
              }
            });        
          }else{
            this.$emit("sureHandle", {...obj,type:'add'});
          }
          
        }else {
          this.$message.warning("请检查必填信息是否填写完整。");
        }
      });
    },

    formSelectchange(val, e, clearable) {
      this.$emit("formSelectchange", val, e);
      if (e === "projectClassify") {
        for (const iterator of this.formConfig) {
          if (iterator.key === "projectClassify") {
            for (const item of iterator.options) {
              if (item.dataVal === val) {
                this.$set(this.formObj, "xmflm", item.dataLabel);
              }
            }
          }
        }
      }
      if (e === "projectClassify" && this.type === "yw") {
        let options = [];
        for (const iterator of this.formConfig) {
          if (iterator.key === "projectClassify") {
            for (const item of iterator.options) {
              if (item.dataVal === val) {
                options = item.children;
                this.$refs[this.formRef].$refs.form.clearValidate();
              }
            }
          }
        }
        for (const iterator of this.formConfig) {
          if (iterator.key === "xmxl") {
            iterator.options = options;
            if (!clearable) {
              this.formObj.xmxl = "";
            }
          }
        }
      }
    }
  }
};
</script>
<style lang="less" scoped>

.form-box /deep/ .el-input.is-disabled .el-input__inner,
.form-box /deep/ .el-textarea.is-disabled .el-textarea__inner {
  color: #9a9a9a;
}
.form-box {
  /deep/ .el-form-item__label {
    padding: 0;
    height: 16px;
  }
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