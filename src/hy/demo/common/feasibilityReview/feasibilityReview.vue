<template>
  <section>
    <el-dialog :class="['hyModal', {'feasibilityReviewDialogStyle': fullscreen}]" v-dialogDrag1 :title="title" v-if='dialogVisible' :visible.sync="dialogVisible" :close-on-click-modal="false" :width="width" :before-close="closeHandle" :append-to-body="true" :fullscreen="fullscreen">
      <div class="fullscreen-box">
        <i class="iconfont iconquanping" v-if="!fullscreen" @click.stop="fullscreenHandleClick"></i>
        <i v-else class="iconfont icontuichuquanping" @click.stop="fullscreenHandleClick"></i>
      </div>
      <!-- 信息 -->
      <div class="info-box" :style="{height: dialogHeight}">
      <!-- 左边 -->
      <div class="left-box">
          <div class="left-box-item" v-for="(item, i) in leftList" :key="i">
          <div class="item-title-box">
              <div class="item-title">{{ item.text }}</div>
              <el-button type="primary" size="small" @click.stop="download">下载</el-button>
          </div>
          <el-checkbox-group class="item-children-box" v-model="fileCheckList">
              <div class="children-item" v-for="(sub, j) in item.children" :key="j">
              <div class="children-title-box">
                  <div class="children-title-sign" v-if="sub.sfbx === '01'">*</div>
                  <div class="children-title">{{ sub.text }}</div>
              </div>
              <div class="file-box" v-for="(iteration, k) in sub.children" :key="k" style="cursor:pointer">
                  <div class="file-name-box">
                    <el-checkbox :label="iteration"></el-checkbox>
                    <i class="el-icon-document file-icon"></i>
                    <div class="file-name" @dblclick="fileHandleDbClick(iteration)">{{ iteration.text }}</div>
                  </div>

                  <div v-if="isInternet" class="upload-icon" style="padding:10px 2px">
                    <div style="flex: 1;font-size: 14px;color: #222734;padding: 0 5px;">{{ iteration.state ? stateList[iteration.state] : '--' }}</div>
                  </div>

                  <div class="upload-icon" style="cursor:pointer">
                    <i class="el-icon-download" @click.stop="downloadFile(iteration)"></i>
                  </div>
              </div>
              </div>
          </el-checkbox-group>
          </div>
      </div>
      <!-- 分割线 -->
      <div class="divide"></div>
      <!-- 右边 -->
      <div class="right-box">
          <div class="options-box" id="options-box">
          <div class="options-top">
              <div class="title">{{rightList.title}}</div>
          </div>
          <div style="margin-top: 10px;" v-if="rowData.meetingType=='3'">
            <span style="color:red">*</span>认定成果等级：
            <el-select size="mini" style="width:312px" v-model="rdcgdj">
              <el-option v-for="item in rdcgdjOption" :key="item.dataLabel" :label="item.dataLabel" :value="item.dataVal">
              </el-option>
            </el-select>
          </div>
          <!-- 主审专家评审 -->
          <div class="right-from-box" v-if="isHavePSJLSelect">
              <hyNewForm 
                  v-if="rowData.meetingType!=='3'"
                  class="newForm-content"
                  ref="zszjRef" 
                  :ifInLine="false" 
                  :formData="formData"
                  :rules="rules"
                  :formConfig="formConfig" 
                  :ifSearch2="false"
                  :disabled="disabled" 
                  @formSelectchange="formSelectChanged"
                  >
              </hyNewForm>
              <div class="input-box"  v-for='item in labelList' :key='item.kpsId'>
                <div class="input-label">{{item.title}}</div>
                <el-input type="textarea" v-if="!item.content&&rowData.meetingType==='3'" :disabled="disabled"  :autosize="{minRows:12,maxRows:20}" v-model="item.opinion" ></el-input>
                <el-input type="textarea" v-if="!item.content&&rowData.meetingType!=='3'" :disabled="disabled"  :autosize="{minRows:4,maxRows:6}" v-model="item.opinion" ></el-input>
                <!-- 特殊处理  onkeyup='this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9#;；（）、/,，.。:：%‘’“”!！ ]/g, "")' -->
                <div v-if="item.content && item.shortName == 'zcjsqk'" style="margin-top:20px">
                  <el-select v-model="item.opinion" style="width:100%" :disabled="disabled" multiple ref="zcjsqkRef">
                    <el-option v-for="item in zcjsqkList" :key="item.value" :label="item.dataLabel" :value="item.dataVal"></el-option>
                  </el-select>
                </div>
                <div v-else-if="item.content" style="margin-top:20px">
                  <el-form :inline="true" :model="from" label-width="100px" label-position="right">
                    <el-form-item :label="item.content|getFName">
                      <el-select v-model="from.sfhb" style="width:200px" :disabled="disabled" ref="sfhbRef">
                          <el-option v-for="item in sfbrlist" 
                            :key="item.value" :label="item.dataLabel" :value="item.dataVal"></el-option>
                      </el-select>
                    </el-form-item><br/>
                    <el-form-item :label="item.content|getLName">
                      <el-input v-model="from.hbbh" style="width:200px"  maxlength="1000"  disabled></el-input>
                      <el-button v-if="from.sfhb!=0&&from.sfhb"  @click="openCorrelation" :disabled="disabled" style="color:#409eff;border-color:#409eff;margin-left:10px;padding:10px">选择可研编号</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
          </div>
          <!-- 技经专家评审 -->
          <div class="right-from-box" v-if="isHaveJJYJJLInput">
              <div class="input-box"  v-for='item in labelList' :key='item.kpsId'>
                <div class="input-label">{{item.title}}</div>
                <el-input type="textarea"  maxlength="1000" v-if="!item.content" :disabled="disabled" :autosize="{minRows:4,maxRows:6}" v-model="item.opinion" ></el-input>
                <!-- 特殊处理 -->
                <div v-if="item.content" style="padding-top:20px;border-radius:0 0 5px 5px;border:1px solid #ccc;border-top:0">
                  <el-form :inline="true" :model="from" label-width="140px" label-position="right">
                    <el-form-item :label="item.content|getFName">
                    <!-- <el-input  type="number" onkeyup='this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9#;, "")'  v-model="from.proposalFee" style="width:200px" :disabled="disabled" ></el-input> -->
                    <el-input-number :disabled="disabled"  v-model="from.proposalFee" :precision="2" :controls="false" style="width:200px;height:100%"></el-input-number>万元
                    </el-form-item>
                  </el-form>
                </div>
              </div>
          </div>
          <!-- 财务专家评审 -->
          <div class="right-from-box" v-if="isHaveCWZJInput">
                <div class="input-box"  v-for='item in labelList' :key='item.kpsId'>
                  <div class="input-label">{{item.title}}</div>
                  <el-input type="textarea"  maxlength="1000"  v-if="!item.content" :disabled="disabled"  :autosize="{minRows:4,maxRows:15}" v-model="item.opinion" ></el-input>
                </div>
              </div>
              <div class="options-bottom" v-if="!isZJPS">
                <div class="options-bottom-item">
                <div class="title-box" v-if="isHaveBox">
                    <i class="el-icon-caret-bottom"></i>
                    <div style="margin-bottom: 5px;">我的意见</div>
                </div>
                <el-input type="textarea"  v-model="perOpinion" placeholder="请输入" :rows="20" :maxlength='500' show-word-limit></el-input>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="footer">
        <div v-if="!isZJPS">
          <el-button size="medium" @click="materialScienceExamineBtn('close')">取消</el-button>
          <el-button type="primary" size="medium" @click="materialScienceExamineBtn('yes')">通过</el-button>
          <el-button type="danger" size="medium" @click="materialScienceExamineBtn('no')">驳回</el-button>
        </div>
        <div v-if="isZJPS">
          <el-button size="medium" @click="materialScienceExamineBtn('close')">取消</el-button>
          <el-button type="primary" size="medium" :disabled="disabled" @click="expertReview()">保存</el-button>
        </div>
      </div>
    </el-dialog>
    <!--新增、修改、删除-->
    <kjProjectInfoModal  ref="editProject" v-if="projectInfoDialogVisible" type="xm" :apiParams="apiParams" :dialogVisible="projectInfoDialogVisible" 
    :title="projectInfoModalTitle" :disabled="true" :formData="rowData" @closeHandle="projectInfoDialogVisible=false"
     :ifCancle="false"  :btnShow="true"  :submitBtnShow="false"  :ifSure="false"  ></kjProjectInfoModal>
  </section>
</template>
<script>
// getCommonCltjbTree
import { getCommonCltjbTree} from '@/api/common.js'
import { buttonData, zszjFormConfig } from "./config"
const {formConfig, formData, rules} = zszjFormConfig
import { getDictTree  } from "@/api/common.js";
import kjProjectInfo from "@/pages/common/kjProjectEdit/kjProjectEdit";
export default {
  name: "feasibilityReview", // 可研评审
  components: {
      kjProjectInfoModal:kjProjectInfo,
  },
  /**
   * @param fileListApiFn 文件接口
   * @param scheduleApiFn 进度接口
   * @param opinionsApiFn 意见接口
   * @param role 角色——主审专家：ZSZJ，组长：ZZ，评审秘书：PSMS，技经专家JJZJ，财务专家CWZJ
   * @param rowData 行数据
   */
  props: {
    ywlx: {
      type: String,
      default: "BUSINESSTYPE_KY"
    },
    dialogVisible: {
      required: true,
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => "专家评审"
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    apiParams: {
      type: Object,
      default: () => {}
    },
    rightList: {
      type: Object,
      default: () => {}
    },
    isAudit:{
      type: Boolean,
      default: () => false
    },
    width: {
      type: String,
      default: () => "1060px"
    },
    role:{//角色
      type: String,
      default: () => ""
    },
    getCommonTree:{
         type: Function,
      default: () => getCommonCltjbTree
    },
    isHaveBox: {
        type: Boolean,
        default: () => true
    },
    isHavePSJLSelect: {//主审
        type: Boolean,
        default: () => false
    },
    isHaveJJYJJLInput: {//技术专家
        type: Boolean,
        default: () => false
    },
    isHaveCWZJInput:{//财务专家
        type: Boolean,
        default: () => false
    },
    getProblem:{//专家评审问题列表
      type: Function,
      default: null
    },
    isZJPS:{//是否专家评审
        type: Boolean,
      default: () => false
    },
     saveReview:{//专家评审问题列表
      type: Function,
      default: () => null
    },
    disabled:{
      type: Boolean,
      default: () => false
    }
  },
  filters:{
    getFName:function(value){
      return value.split('@')[0]
    },
    getLName:function(value){
      return value.split('@')[1]
    }
  },
  data() {
    return {
      dialogHeight:"580px",

      perOpinion: '',
      shjg: '0',
      buttonData,
      fileCheckList: [],
      leftList: [],
      labelList:[],
      formConfig,
      formData,
      rules,
      sfbrlist:[],
      zcjsqkList: [],
      from:{

      },
      dataList:[],
      projectInfoDialogVisible: false,
      projectInfoModalTitle: "项目查看",
      isInternet: this.$store.state.isInternet,
      stateList: {
        "1": "未同步",
        "2": "同步中",
        "3": "同步完成",
        "4": "同步失败"
      },
      timer: null,
      fullscreen: false,
      rdcgdj:"",
      rdcgdjOption:[],
    };
  },
  destroyed() {
    clearInterval(this.timer);
    this.timer = null;
  },
  mounted () {
    this._getCommonCltjbTree()
    if(this.getProblem!=null){
      this.getProblomList()
    }
    if(this.isHavePSJLSelect){
      // 评审结论 APP_KJ_PSJL  是否合并APP_KJ_SFHB  支撑情况APP_KJ_ZCJSQK
      this.getDict("APP_KJ_PSJL");
      this.getDict("APP_KJ_SFHB");
      this.getDict("APP_KJ_ZCJSQK");
    }
    if(this.rowData.meetingType==='3'){
      // 认定成果等级
      this.getDict("APP_KJ_KY_RDCGDJ");
    }

    if(this.isZJPS && !this.disabled) {
      this.timer = setInterval(() => {
        console.log(new Date().getTime());
        this.expertReview(true);
      }, 300000);
      // 300000
    }

    const _that = this;
    this.$nextTick(() => {
      document.getElementById("options-box").onscroll = function() {
        if(_that && _that.$refs && _that.$refs.zszjRef && _that.$refs.zszjRef.$refs && _that.$refs.zszjRef.$refs.elSelect && _that.$refs.zszjRef.$refs.elSelect.length) {
          _that.$refs.zszjRef.$refs.elSelect[0].blur();
        }
        if(_that && _that.$refs && _that.$refs.zcjsqkRef && _that.$refs.zcjsqkRef.length) {
          _that.$refs.zcjsqkRef[0].blur();
        }
        if(_that && _that.$refs && _that.$refs.sfhbRef.length) {
          _that.$refs.sfhbRef[0].blur();
        }
      };
    });
  },
  watch:{
    'from.sfhb'(){
      if(this.from.sfhb==0){
        this.from.hbbh=''
      }
    },
    "$store.state.dialogHeight":{
      handler:function(newVal,oldVal){
        console.log(newVal,"newVal")
        this.dialogHeight=newVal?`${newVal-20}px`:'580px'
      }
    }

  },
  methods: {
    fullscreenHandleClick() {
      this.fullscreen = !this.fullscreen;
    },
    // 批量下载
    download() {
      if(!this.fileCheckList.length){
        this.findisfile(this.leftList)
        this.$emit("download", this.dataList,this.rowData.xmbh,this.leftList[0].id);
      }else{
        this.$emit("download", this.fileCheckList,this.rowData.xmbh)
      }
    },
    findisfile(list){
      for (const iterator of list) {
        if (iterator.isfile === "1") {
          this.dataList.push(iterator);
        }
        if(iterator.children){
          this.findisfile(iterator.children)
        }
      }
    },
    // 单个文件下载
    downloadFile(row) {
      this.$emit("singleFileDownload", row);
    },

    // 专家修改意见
    // editOpinion() {
    //   this.$emit("editOpinion", this.rowData);
    // },
    _getCommonCltjbTree () {
      let params = {
        ...this.rowData,
        xmlx:this.rowData.xmlx?this.rowData.xmlx:'PROJECTTYPE_XXH',
        ywlx:this.rowData.ywlx?this.rowData.ywlx: 'BUSINESSTYPE_KY',
        hyid:this.rowData.hyid?this.rowData.hyid: '',
        clblx:this.rowData.clblx?this.rowData.clblx: 'IPHONEDIY_SB',
        xmbh: this.rowData.xmbh,
        professionalType: this.rowData.professionalType,
        jhlx: this.rowData.jhlx
        }
  
      this.m_apiFn(this.getCommonTree, params).then(res => {
        if (res && res.result) {
          this.leftList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getDict(dataVal) {
      this.m_apiFn(getDictTree, dataVal).then(resp => {
        if (resp.result.children && resp.result.children.length > 0) {
          for (const iterator of this.EditConfig) {
            if (dataVal === "FUND_WAY" && iterator.key === "tzqd") {
              iterator.options = resp.result.children;
            }
            if (dataVal === "APP_KJ_PCLX" && iterator.key === "type") {
              iterator.options = resp.result.children;
            }
          }
          
        }
      });
    },
    getProblomList(){
      let params = {  
        xmbh: this.rowData.xmbh,
        meetingType:this.rowData.meetingType,
        ywlx:this.rowData.ywlx?this.rowData.ywlx: 'BUSINESSTYPE_KY',
        hyid:this.rowData.hyid?this.rowData.hyid: '',
      }
      this.m_apiFn(this.getProblem, params).then(res => {
          if (res && res.result) {
            this.labelList = res.result.opinion
            if(this.rowData.meetingType==='3'){
              this.rdcgdj=res.result.rdcgdj
            }
            for (const iterator of this.labelList) {
              if(iterator.shortName == 'zcjsqk' && iterator.opinion) {
                iterator.opinion = iterator.opinion.split(",")
              }
            }
            delete res.result.opinion
            this.from=res.result
            this.formData.psjl=res.result.psjl
          } else {
            this.$message.error(res.message)
          }

          this.$nextTick(() => {
            if(this && this.$refs && this.$refs.zszjRef && this.$refs.zszjRef.$refs && this.$refs.zszjRef.$refs.form) {
              this.$refs.zszjRef.$refs.form.clearValidate();
            }
          });
        })
    },
    getDict(dataVal){
      this.m_apiFn(getDictTree, dataVal)
        .then(res => {
          if (
            res &&
            res.result &&
            res.result.children &&
            res.result.children.length > 0
          ) {
            if(dataVal=='APP_KJ_SFHB'){
              this.sfbrlist=res.result.children
            }else if (dataVal=="APP_KJ_ZCJSQK"){
              this.zcjsqkList=res.result.children
            }else {
              console.log(this.rowData.feasibilityReviewPSJLvalue)
              if(this.rowData.feasibilityReviewPSJLvalue){
                this.formConfig[0].options=res.result.children.filter(item=>{
                  if(this.rowData.feasibilityReviewPSJLvalue.includes(item.dataVal)){
                    return item 
                  }
                })
              }else{
                this.formConfig[0].options=res.result.children
              }
              

            }
            if (dataVal === "APP_KJ_KY_RDCGDJ") {
              this.rdcgdjOption = res.result.children;
              console.log(this.rdcgdjOption)
            }

          }
        })
    },

    fileHandleDbClick(data) {
      if(data.clnr==="项目简表"){
        this.projectInfoDialogVisible=true
      }else{
        this.m_pageoffice(data);
      }
    },

    // 编号回显
    getParams(val){
      // this.$nextTick(()=>{
        this.from.hbbh = val;
        this.$forceUpdate()
      // })
    },
    // 打开关联界面
    openCorrelation(){
      this.$emit('demandCorrelation',this.rowData,this.from.hbbh )
    },
    //操作按钮组
    materialScienceExamineBtn(e) {
      switch (e) {
        case 'yes':
          this.shjg = '0'
          if(!this.isAudit){
            this.zjysPassOrRefuse()
          }else{
            this.projectAudit(2)
          }
          break
        case 'no':
          this.shjg = '1'
          if(!this.isAudit){
            this.zjysPassOrRefuse()
          }else{
            this.projectAudit(0)
          }
          break
        case 'close':
          this.$emit('closeHandle')
          break
      }
    },
    projectAudit(val){
      let params = {
        ...this.rowData,
        xmlx:this.rowData.xmlx?this.rowData.xmlx:'PROJECTTYPE_XXH',
        ywlx:this.rowData.ywlx?this.rowData.ywlx: 'BUSINESSTYPE_KY',
        hyid:this.rowData.hyid?this.rowData.hyid: '',
        clblx:this.rowData.clblx?this.rowData.clblx: 'IPHONEDIY_SB',
        xmbh: this.rowData.xmbh,
        shyj: this.perOpinion,
        projectStatus: val,
      }
      this.$emit("successSubmit",params)

    },
    zjysPassOrRefuse () {
      let params = {
        // ...this.rowData,
        xmlx: 'PROJECTTYPE_XXH',
        ywlx: this.rowData.ywlx?this.rowData.ywlx: 'BUSINESSTYPE_KY',
        hyid:this.rowData.hyid?this.rowData.hyid: '',
        xmbh: this.rowData.xmbh,
        shyj: this.perOpinion,
        shjg: this.shjg,
      }
      this.m_apiFn(zjysPassOrRefuse, params).then(res => {
        if (res && res.message === '成功!') {
          this.$message.success(res.result)
          this.$emit("successSubmit")
        } else {
          this.$message.error(res.message)
        }
      })
    },
    //评审结论下拉change事件
    formSelectChanged(k,v) {

    },
    // 
    expertReview(isTimer){
      if(this.role.includes('ZSZJ')){
        if(!isTimer) {
          if((this.from.sfhb==1||this.from.sfhb==2)&&!this.from.hbbh){
            this.$message.warning('合并编号不能为空')
            return
          }
        }
        if(this.from.sfhb==0){
          this.from.hbbh==''
        }
        this.from.xmbh=this.rowData.xmbh
        this.from=Object.assign(this.from,this.formData)

        if(this.rowData.meetingType!=='3'){
          let validResult;
          this.$refs.zszjRef.$refs.form.validate(valid => {
            validResult = valid;
          });
          if(!isTimer) {
            if(!validResult) {
              this.$message.warning('评审结论不能为空')
              return
            }
          }
        }
        
        let copyList = this.m_copy(this.labelList);
        for (const iterator of copyList) {
          if(iterator.shortName == 'zcjsqk' && iterator.opinion && typeof iterator.opinion == 'object') {
            iterator.opinion = iterator.opinion.join(",")
          }
        }
        let params={...this.from,opinion:copyList}
        if(this.rowData.meetingType==='3'){
          if(!this.rdcgdj){
            this.$message.warning('认定成果等级不能为空')
            return
          }
          params.rdcgdj=this.rdcgdj
        }
        params.ywlx=this.rowData.ywlx?this.rowData.ywlx: 'BUSINESSTYPE_KY'
        params.hyid=this.rowData.hyid?this.rowData.hyid: '',
        this.m_apiFn(this.saveReview, params).then(res => {
          if (res && res.message === '成功!') {
            this.$message.success(res.result)
            if(!isTimer) {
              this.$emit("successSubmit")
            }
          } else {
            this.$message.error(res.message)
          }
        });
        return
      }
      this.from.xmbh=this.rowData.xmbh
      let params={...this.from,opinion:this.labelList}
      params.ywlx=this.rowData.ywlx?this.rowData.ywlx: 'BUSINESSTYPE_KY'
      params.hyid=this.rowData.hyid?this.rowData.hyid: '',
      this.m_apiFn(this.saveReview, params).then(res => {
        if (res && res.message === '成功!') {
          this.$message.success(res.result)
          if(!isTimer) {
            this.$emit("successSubmit")
          }
        } else {
          this.$message.error(res.message)
        }
      })
      return

    },
    closeHandle() {
        this.$emit('closeHandle')
    }
  }
};
</script>
<style lang="less" scoped>
@import "./review.less";
.right-from-box {
    max-width: 100% !important;
    margin-top: 25px;
}
.newForm-content{
  width: 100%;
  // height:60px;
  display: flex; 
  flex-wrap: wrap;
  /deep/ .el-form-item{
    margin-bottom:18px!important;
        margin-left: 10px;
  }
}

.newForm-content /deep/ .el-form-item {
  display: flex; 
  padding-right: 4px;
  padding-left: 12px;
}

.newForm-content /deep/ .el-form-item__label {
    margin-right: 10px
}

.btn-box {
  text-align: center;
}

.right-box {
  /deep/ .el-input.is-disabled .el-input__inner,
  /deep/ .el-textarea.is-disabled .el-textarea__inner {
    color: #9a9a9a;
  }
}

.hyModal {
  /deep/ .el-dialog {
    margin: 0 auto !important;
    position: absolute !important;
    left: 50%;
    transform: translateX(-50%);
    top: 122px !important;
    .el-dialog__body {
      padding: 0px 20px 10px;
      box-sizing: border-box;
      position: relative;
    }

    .footer {
      text-align: center;
      margin-top: 10px;

      button {
        width: 200px;
      }
    }
  }
}

.feasibilityReviewDialogStyle {
  overflow: hidden;

  /deep/ .el-dialog {
    top: 0;
  }

  /deep/ .el-dialog__body {
    height: calc(100% - 76px);
    display: flex;
    flex-direction: column;
  }

  .info-box {
    flex: 1 0 0;
    overflow-y: auto;
  }
}

.fullscreen-box {
  position: absolute;
  top: -34px;
  right: 44px;
  cursor: pointer;
}
</style>