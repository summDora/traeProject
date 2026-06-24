<template>
  <hyNewModal 
    v-dialogDrag1
    v-if="dialogVisible" 
    :dialogVisible='dialogVisible' 
    @closeHandle="closeHandle" 
    :title='title' 
    :ifThird="true" 
    :ifHearder="true"
    :showClose="true" 
    :ifSure="false" 
    :ifCancle="false" 
    :width='width' 
    :appendToBody="true" 
    :modalAppendToBody="true"
    :fullscreen="fullscreen"
  >
    <div v-if="hasSnapshot" style="text-align: right; margin-right: 30px;">
      <el-button type="primary" @click.stop="snapshotHandleClick">项目快照</el-button>
    </div>
    <hyNewForm v-if="formConfig.length" class="form-box" :ref="formRef" :formConfig='formConfig' :formData='formObj' :rules='formRules' :ifInLine='ifInLine' :ifSearch2="false" :disabled="disabled" @formSelectchange="formSelectchange" @inputChange="inputChange">
      <template slot="participationListStr">
        <div style="width:968px;position: relative;top: -25px">
          <div><span style="color:red">*</span> 项目参与人员相关信息</div>
          <hyNewTable
            :ifHaveIndex="true"
            :column="participationColumn"
            :height="300"
            :tableData="participationTableData"
          >
            <!--项目参与人员-->
            <template slot="userName" slot-scope="scope">
              <el-input style="width:99%" size="mini" :disabled="disabled" v-model="scope.data.userName"></el-input>
            </template> 
            <!--项目人员涉及部门或单位-->
            <template slot="referOrgName" slot-scope="scope">
              <el-autocomplete
                style="width:99%"
                :disabled="disabled"
                v-model="scope.data.referOrgName"
                size="mini"
                :fetch-suggestions="querySearch"
                @select="orgNameSelect(scope.data,$event)"
                @blur="orgNameBlur(scope.data,$event)"
              ></el-autocomplete>
            </template> 
            <!--识别单位-->
            <template slot="compId" slot-scope="scope">
              <el-select style="width:99%" :disabled="disabled" v-model="scope.data.compId" filterable clearable size="mini">
                <el-option v-for="item in orgNameOption" :key="item.orgId" :label="item.orgShortName" :value="item.orgId">
                </el-option>
              </el-select>
            </template> 
            <!--是否为外部单位-->
            <template slot="type" slot-scope="scope">
              <el-select style="width:99%" :disabled="disabled" v-model="scope.data.type" filterable size="mini">
                <el-option v-for="item in [{value:'1',label:'是'},{value:'0',label:'否'}]" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </template>
            <!--操作-->
            <template slot="operation" slot-scope="scope">
              <el-tooltip v-if="!disabled" effect="dark" content="向下添加一行" placement="top">
                <i style="color:#298bf5;font-size: 17px;font-weight: 700;cursor:pointer" class="icon iconfont iconzhankai" @click="insertRow(scope.index,scope.data)"></i>
              </el-tooltip>
              <el-tooltip v-if="(scope.index!==0||participationTableData.length>1)&&!disabled" effect="dark" content="删除" placement="top">
                <i style="color:#298bf5;cursor:pointer;margin-right:15px;font-size: 14px;" class="icon iconfont iconshanchu" @click="delTableRow(scope.index,scope.data)"></i>
              </el-tooltip>
            </template>
          </hyNewTable>
        </div>
      </template>
      <el-button slot="btn" style="margin-left:30px" @click="goDemandCorrelation">关联</el-button>
    </hyNewForm>
    <!-- {{zscqdkhzb}} -->
    <template  slot="footer">
       <div v-if="btnShow" style="text-align:center">
          <el-button style="width:150px" v-if="submitBtnShow" size="medium" @click="closeHandle">取消</el-button>
          <el-button style="width:150px" v-if="submitBtnShow" size="medium" type="primary" @click="sureHandle">保存</el-button>
          <el-button style="width:150px" @click="closeHandle" size="medium" v-if="!submitBtnShow" >关闭</el-button>
       </div>
    </template>
  </hyNewModal>
</template>
<script>
import regex from "@/utils/regex";
import { queryOrgByUserOrg,getCydwList, getDictTree,queryTableTitle,queryTableById,addTable,updateTable } from '@/api/common'
import {queryKjOrgTree,getXQSBaddDemandBacthDWList} from'@/api/demandBatchManagement'
import {getAllDepartList} from'@/api/feasibilityReport'
import {
  xqxmFormData,
  xqxmFormRules,
  participationColumn
} from "./config.js";
const requiredTrim = (rule, value, callback) => {
  if (!value) {
    callback(new Error('此为必填项'))
  }else if(!value.toString().trim()){
    callback(new Error('内容为空'))
  }else{
    callback()
  }
}
const arrayCheckTrim = (rule, value, callback) => {
  if (!value&&!value.length) {
    callback(new Error('此为必填项'))
  }else{
    callback()
  }
}
//数字，两位必填项
const numCheckTrim = (rule, value, callback) => {
  if (!value) {
    callback(new Error('此为必填项'))
  }else{
    let reg = /^(0|[1-9]+[0-9]*)(\.[0-9]{1,2})?$/;
    if(reg.test(value)){
      callback()
    }else{
      callback(new Error('请输入数字且不能输入空格'));
    }
  }
}
//数字，两位必填项
const numCheck = (rule, value, callback) => {
  if (!value) {
    callback()
  } else if(!value.toString().trim()) {
    callback(new Error('请输入数字且不能输入空格'));
  } else {
    let reg = /^(0|[1-9]+[0-9]*)(\.[0-9]{1,2})?$/;
    if(reg.test(value)){
      callback()
    }else{
      callback(new Error('请输入数字且不能输入空格'));
    }
  }
}

export default {
  name: "kjProjectEdit", // 项目填报

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
   * @param pageType 页面
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
      default: () => {}
    },
    apiParams:{
      type: Object,
      default: () => null
    },
    //是否需要项目参与人员相关信息列表
    isPeopleTable:{
      type: Boolean,
      default: () => true
    },
    queryProjectInfoForYwApi: {
      type: Function,
      default: () => null
    },
    hasSnapshot: {
      type: Boolean,
      default: false
    },
    batchType: {
      type: String,
      default: () => ""
    },
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
      formObj:{},
      formRules: {
        // ...xqxmFormRules,
        declareStartDate: [{ required: true, message: "请填写开始时间", trigger: "blur" },
        { validator: checkTime, trigger: "blur"  }]
      },
      formConfig:[],

      //项目参与人员相关信息
      participationColumn,
      participationTableData:[],
      addParticipationTableDataData:{
        userName:"",
        referOrgName:"",
        compId:"",
        type:"",
      },
      orgNameOption:[],
      // zscqdkhzb:'',
      fullscreen: false,
    };
  },
  
  computed:{
    zscqdkhzb:{
       get:function (){
          return `${this.formObj.zscqkhzb?'':''}发明专利${this.formObj.fmzl?this.formObj.fmzl:""}项，发表核心期刊及以上论文${this.formObj.fblw?this.formObj.fblw:""}篇，申请软件著作权${this.formObj.sqrz?this.formObj.sqrz:""}项`
        },
    }

  },
  created(){

  },
  watch:{
    'zscqdkhzb'(){
        this.$set(this.formObj,'zscqkhzb',this.zscqdkhzb)
    },
    'formObj.declareEndDate'(){
      if(this.formObj.declareEndDate){
        this.$nextTick(()=>{
          this.$refs[this.formRef].$refs.form.validateField('declareStartDate')
        })
      }
    }
  },
  async mounted() {
    await this.getTableTitle()
    // APP_PROJECTCLASSIFY 项目分类-建设
    // APP_XXH_XMFL_YW 项目分类-运维
    // APP_XXH_YYWD 应用维度
    // APP_SZH_XMFL 项目属性
    // APP_KJ_XQJSLY技术领域
    //APP_KJ_XQZYFX  专业方向
    //APP_KJ_XMLB 项目类别
    // APP_KJ_SYSMC实验室
    // APP_KJ_CXTDMC科研创新团队
    await this.getAllDepartList()
    this.getDict("APP_XXH_YYWD");
      
      if (this.type === "js") {
        this.getDict("APP_PROJECTCLASSIFY");
        this.getDict("APP_SZH_XMFL");
      } else if(this.type === "yw") {
        this.getDict("APP_XXH_XMFL_YW");
      }
      // 业务部门
      // this._getAllDeptList();
      this.getOrgByUserOrgXmcddw();// 项目单位
      this.getOrgByUserOrgCydw();//参与单位

      if(this.title == "项目新增"&&this.isPeopleTable) {
        this.participationTableData.push(this.m_copy(this.addParticipationTableDataData))
      }
      // 修改查看
      if (this.formData) {
        //获取参与人员列表
        if(this.isPeopleTable){
          await this.queryParticipationList()
        }
        console.log(this.formObj)
        if (this.type === "yw") {
          this.getProjectInfoForYw();
        }
        // 获取数据
        this.getTableData()
      }
    
    
  },

  methods: {
    inputChange(value,key){
      this.$set(this.formData,key,value)
      this.$forceUpdate()
      // console.log(value,key)
    },
    // 下拉选择
    formSelectchange(val, e) {
      console.log(val,e)
      // this.$set(this.formData,e,val)
      // this.$forceUpdate()
      this.$emit("formSelectchange", val, e);
    },
    //获取参与人员列表
    async queryParticipationList(){
      await this.m_apiFn(queryParticipationList, {xmbh:this.formData.xmbh}).then(res => {
        if (res.statusCode==200) {
          if(res.result&&res.result.length){
            this.participationTableData=res.result
            for(let item of this.participationTableData){
              if(!item.type){
                item.type="0"
              }
              for(let org of this.orgNameOption){
                if(item.referOrgName==org.orgName||item.referOrgName==org.orgShortName){
                  item.compId=org.orgId
                  item.compIdCopy=org.orgId
                }
              }
            }
          }else{
            this.participationTableData.push(this.m_copy(this.addParticipationTableDataData))
          }
        }
      })
    },
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
                (dataVal === "APP_KJ_SYSMC" && iterator.key === "sysmc") 
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
    // 获取下拉数据
    getCommonTree(dataVal,keyCode){
      this.m_apiFn(getDictTree, dataVal)
        .then(res => {
          if (res &&res.result &&res.result.children && res.result.children.length > 0) {
            // this.Options[key]=res.result.children
             for (const iterator of this.formConfig) {
               if(iterator.key==keyCode){
                  iterator.options = res.result.children;
               }
             }
          }
        })
    },
    //获取列表标题
    async getTableTitle() {
      let param = {
        ...this.apiParams,
        showType:'1',
        batchType:this.batchType||this.formData.batchType
      }
      await this.m_apiFn(queryTableTitle,param).then(resp => {
        if (resp.result&&resp.result.length) {
          this.formConfig=resp.result.map(item=>{
            item.key=item.keyCode
            item.maxlength=item.fieldLength
            item.clearable=true
            item.width=(item.formWidthType==0||item.formWidthType==3)?473:968
            item.disabled=(item.iskbj==1?false:true)
            // this.formObj[item.keyCode]=''
            this.$set(this.formObj,item.key,'')
           if(item.isbt==1&&(item.fieldType=='1'||item.fieldType=='2'||item.fieldType=='4')){
             if(item.key!='declareStartDate'){
                let rules= [{ required: true, message:`请${item.fieldType=='1'||item.fieldType=='2'||item.fieldType=='4'?'选择':'填写'}${item.label}`, 
                trigger:(item.fieldType=='1'||item.fieldType=='2'||item.fieldType=='4'?"change":"blur") }]
                this.$set(this.formRules,item.key,rules)
              }
            }
            if(item.formWidthType==2||item.formWidthType==3){
               item.kind="textarea"
               item.autosize = {minRows: 3}
               item.showWordLimit= true
            }
            if(item.key=='xqbh'){
              item.showGlxqBtn=true
              item.width=384
              item.disabled=true
            }
            
            if(item.key=='xmlxrtel'){
              let telrules= [
              { required: true, message: "请填写项目联系人联系方式", trigger: "blur" },
              { validator: regex.checkPhone, trigger: "blur" }]
              this.$set(this.formRules,item.key,telrules)
            }
            if(item.key=='xmbh'||item.key=='projectStatus'||item.key=='xqpcbh'){
              item.disabled=true
            }
            switch (item.fieldType) {
              case '0':
              if(item.formWidthType==2||item.formWidthType==3){
                  item.type='textarea'
                  item.autosize = {minRows: 3}
              }else{
                item.type='input'
                if(item.unit){
                  item.inputName=item.unit
                }
              }
              if(item.isbt==1){
                let inputrules= [{ required: true, validator:requiredTrim,trigger:(item.fieldType=='1'||item.fieldType=='2'||item.fieldType=='4'?"change":"blur") }]
                this.$set(this.formRules,item.key,inputrules)
              }
              break
              case '1':
              this.getCommonTree(item.dictheadId,item.key)
              item.type='select'
              item.options=[]
              item.labelName= "dataLabel"
              item.labeKey="dataVal"
              break
              case '2':
              item.type='datepicker'
              item.valFormat=(item.dateType=='0'?"yyyy-MM":item.dateType=='1'?"yyyy-MM-dd":item.dateType=='2'?"yyyy-MM-dd HH:mm":"yyyy-MM-dd HH:mm:ss")
              item.dateType=(item.dateType=='0'?"month":item.dateType=='1'?'date':'datetime')
              item.placeholder=["请选择"]
              item.width=item.width+'px'
              break
              case '3':
              item.type='input';
              item.inputName=item.unit
              if(item.isbt==1){
                let btrules= [{ required: true, validator:numCheckTrim,trigger:"blur"}]
                this.$set(this.formRules,item.key,btrules)
              }else{
                let norules= [{ required: false, validator:numCheck,trigger:"blur"}]
                this.$set(this.formRules,item.key,norules)
              }
              break
              case '4':
              item.type='cascader';
              item.props={
                expandTrigger: "hover",
                multiple: false,
                value: "orgId",
                label: "orgName",
                children: "children"
              }
              break
              case '5':
              item.type='input'
              break
              case '6':
              // 文本框
              item.type='input'
              break
              case '7':
              item.type='input'
              break
            }

            if(item.isUpdate && item.isUpdate == "1") {
              item.disabled = true
            }
            return item
          })
          if(this.isPeopleTable){
            this.formObj.participationListrules=this.participationListrules
            this.formConfig.push({
              baseWidth:"1000",
              label: ' ',
              isSlot:true,
              key:"participationListStr",
              slotName:"participationListStr",
            })
          }
          // let participationListrules= [{ required: true}]
          // this.$set(this.formRules,"participationListStr",participationListrules)
          
          console.log("formConfig", this.formConfig);
          
          this.$nextTick(()=>{
            let copyData=this.m_copy(xqxmFormData)
            this.formObj.xqpcbh=this.sbpc
            
            this.$set(this.formObj,"zscqkhzb",`发明专利${this.formObj.fmzl?this.formObj.fmzl:""}项，发表核心期刊及以上论文${this.formObj.fblw?this.formObj.fblw:""}篇，申请软件著作权${this.formObj.sqrz?this.formObj.sqrz:""}项`)
          })
        }
      }).catch(err=>{
        // console.log(err)
      })
    },
    // 获取数据
    getTableData(){
      let params={
        ...this.apiParams,
        id:this.formData.id,
        xmbh: this.formData.xmbh
      }
      if(this.title == "项目快照查看") {
        params.snapshot = 1;
        delete params.id
      }
      this.m_apiFn(queryTableById,params )
        .then(res => {
          if (res &&res.result ) {
            this.formObj=Object.assign({},this.formData,res.result)
            console.log(this.formObj,res.result,this.$refs)
            // this.Options[key]=res.result.children
            //  console.log(res.result)
          }
        })
    },
    // 新增数据
    addTableData(obj){
      let params={
        ...obj,
        ...this.apiParams,
        showType:'1'
      }
      this.m_apiFn(addTable,params).then(resp => {
        if(resp.statusCode==200){
          this.$message.success(resp.result?resp.result:'成功')
          this.$emit("sureHandle", {type:'add'});
          return;
        }else {
            this.$message.warning(resp.message)
            return
        }
      }); 
    },
    // 关闭
    closeHandle() {
      if(this.title == "项目快照查看") {
        this.$emit("closeHandle", "snapshotBack");
      } else {
        this.$emit("closeHandle");
      }
    },
    // 保存
    sureHandle() {  
      this.$refs[this.formRef].$refs.form.validate(valid => {
        if (valid) {
          let formObj=JSON.parse(JSON.stringify(this.formObj))
          formObj.xqpcbh=this.sbpc
          // 级联处理
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
          //项目参与人员相关信息列表
          if(this.isPeopleTable){
            this.participationTableData.forEach((item,index)=>{
              if(!item.userName||!item.referOrgName){
                this.$message.warning(`项目参与人员相关信息第${index+1}条请完善项目参与人员相关信息列表！`)
                throw Error();
              }
              if(item.type==="1"&&item.compId){
                this.$message.warning(`项目参与人员相关信息第${index+1}条存在识别单位，请确认是否为内部单位！`)
                throw Error();
              }
              if(item.type==="0"&&!item.compId){
                this.$message.warning(`项目参与人员相关信息第${index+1}条请选择识别单位！`)
                throw Error();
              }
            })
            for(let item of this.participationTableData){
              for(let org of this.orgNameOption){
                if(item.compIdCopy==org.orgId||item.compId==org.orgId){
                  item.compName=org.orgName
                }
              }
            }
            formObj.participationListStr=JSON.stringify(this.participationTableData)
            console.log(formObj.participationListStr)
          }
          let params={
            ...formObj,
            ...this.apiParams,
            showType:'1',
          }

          if(this.formData){
             this.m_apiFn(updateTable,params).then(resp => {
              if(resp.statusCode==200){
                this.$message.success(resp.result?resp.result:resp.message)
                this.$emit("sureHandle");
                return;
              }else {
                 this.$message.warning(resp.message)
                 return
              }
            });        
          }else{
            // this.$emit("sureHandle", {...obj,type:'add'});
            this.addTableData(formObj)
          }
          
        }else {
          this.$message.warning("请检查必填信息是否填写完整。");
        }
      });
    },



    goDemandCorrelation(){
      this.$emit('demandCorrelation')
    },
    getParams(val){
      xqxmFormData.xqbh=val
      this.formObj.xqbh=val;
      this.$set(this.formObj,'xqbh',val)
      console.log(this.formObj.xqbh)
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
      let url=""
      if(this.apiParams&&this.apiParams.pageTypeTable==="feasibilityReport"||
        this.apiParams&&this.apiParams.pageTypeTable==="feasibleInternalAudit"||
        this.apiParams&&this.apiParams.pageTypeTable==="closedMaterialUpload"||
        this.apiParams&&this.apiParams.pageTypeTable==="internalAuditOfProjectClosure"
      ){
        url=getXQSBaddDemandBacthDWList
      }else{ 
        url=queryKjOrgTree
      }
      if(
        this.apiParams&&this.apiParams.pageTypeTable==="internalAuditOfProjectClosure"
      ){
        url=getXmcddwList
      }
      //queryOrgByUserOrg
      this.m_apiFn(url, param)
        .then(res => {
          for (const iterator of this.formConfig) {
            if (iterator.key === "xmcddw") {
              iterator.options = res.result
              this.$forceUpdate()
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

    

    // 需求快照
    snapshotHandleClick() {
      this.$emit('snapshotHandleClick')
    },



    //项目人员相关信息列表
    //删除行
    delTableRow(index,row){
      this.participationTableData.splice(index,1)
    },
    //行向下插入
    insertRow(index,row){
      this.participationTableData.splice(index+1,0,this.m_copy(this.addParticipationTableDataData))
    },
    //获取列表项目人员设计部门或单位
    async getAllDepartList(){
      await this.m_apiFn(getAllDepartList, {}).then(res => {
        this.orgNameOption=res.result
        for(let item of this.orgNameOption){
          item.value=item.orgShortName
        }
      }).catch(err => {});
    },
    querySearch(queryString,cb){
      // console.log(queryString,this.orgNameOption)
      var orgNameOption=this.orgNameOption
      var results=queryString?orgNameOption.filter(this.createFilter(queryString)) : orgNameOption;
      // var results= orgNameOption;
      cb(results)
    },
    createFilter(queryString){
      return (orgNameOption)=>{
        return(orgNameOption.value.toLowerCase().includes(queryString.toLowerCase()))
      }
    },
    orgNameSelect(row,event){
      console.log(row,event)
      row.compId=event.value
      row.compIdCopy=event.value
      row.type="0"
      for(let item of this.orgNameOption){
        if(item.orgName===event.value||item.orgShortName===event.value){
          row.compId=item.orgId
          row.compIdCopy=item.orgId
        }
      }
      console.log(row)
    },
    orgNameBlur(row,event){
      console.log(row,event)
      if(!row.referOrgName){
        row.type=""
        row.compId=""
        row.compIdCopy=""
        return
      }
      let findName=this.orgNameOption.filter((item)=>{
        if(item.value===row.referOrgName||item.orgShortName===row.referOrgName){
          return item
        }
      })
      console.log(findName)
      if(findName.length){
        row.compId=findName[0].orgId
        row.compIdCopy=findName[0].orgId
        row.type="0"
        for(let item of this.orgNameOption){
          if(item.orgName===row.referOrgName||item.orgShortName===row.referOrgName){
            row.compId=item.orgId
            row.compIdCopy=item.orgId
          }
        }
      }else{
        row.type="1"
        row.compId=""
        row.compIdCopy=""
      }
      
    },
    

  }
};
</script>
<style lang="less" scoped>
// .hyModal /deep/ .el-form  {
//     height: 600px !important;
//     overflow: auto !important;
// }

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



.scoringDialogStyle {
  overflow: hidden;

  /deep/ .el-dialog {
    top: 0;
    height: 100% !important;
  }

  /deep/ .el-dialog__body {
    height: calc(100% - 76px);
    display: flex;
    flex-direction: column;
  }

  .parent-table {
    flex: 1 0 0;
    overflow-y: auto;
  }
}

.fullscreen-box {
  position: absolute;
  // top: -34px;
  right: 44px;
  cursor: pointer;
}

  /* 设置客户管理模块的高度和固定位置 */

.hyModal {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  overflow: hidden !important;
  /deep/.el-dialog {
      margin: 0 auto !important;
      height: 90%;
      overflow: hidden !important;
      .el-dialog__body {
        height: 85% ;
        position: relative !important;
        left: 0 !important;
        top: 0px !important;
        bottom: 0 !important;
        right: 0 !important;
        padding: 0px 20px 15px;
        overflow: hidden !important;
        overflow-y: auto !important;
      }
  }
}

</style>