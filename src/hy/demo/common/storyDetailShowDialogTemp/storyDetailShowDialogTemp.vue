<template>
	<div>
   <hyNewModal v-if="storyDetailModalShow" :dialogVisible='storyDetailModalShow' :title='title'  :showClose="true" :ifSure="false" :ifCancle="false" width='1048px' @closeHandle="storyDetailModalCancle" :modalAppendToBody="true" :appendToBody="true">
       	<hyNewForm 
             id="elFromCss" 
            :ref="EditRef" 
            :formConfig='EditConfig' 
            :ifInLine='false' 
            :formData='EditData' 
            @onCancle="onCancle"
        ></hyNewForm>
   </hyNewModal>
	</div>
</template>
<script>
import { 
  jsEditConfig,
  jsEditData,
  jsEditRules,
  ywEditConfig,
  ywEditData,
  ywEditRules, } from "./config.js";

export default {
  name: "storyDetailShowDialogTemp", // 需求详情
  components: {
    
  },
  
  data() {
    return {
      EditRef: "EditRef",
      EditConfig:"",
      EditData:"",
      EditRules:"",
      selectTreeData:[],
      storyDetailModalShow: false,
      title: '',
      popType: '',
      popFormData: {}
    
    };
  },
  created() {
    // if(this.popFormData.professionalType==="0"){
      //建设类
      this.EditConfig=this.m_copy(jsEditConfig)
      this.EditData=this.m_copy(jsEditData)
      this.EditRules=jsEditRules
      //如果是综合计划
    //   if(this.popFormData.investmentChannel==="1"){
    //     this.EditConfig.splice(
    //       this.EditConfig.findIndex(item => item.key === "previousProjectName"),
    //       2,
    //     );
    //     // this.EditConfig.splice(8,2)
    //   }else{
    //     this.EditConfig=this.m_copy(jsEditConfig)
    //   }
    // }else{
    //   //运维类
    //   this.EditConfig=this.m_copy(ywEditConfig)
    //   this.EditData=this.m_copy(ywEditData)
    //   this.EditRules=ywEditRules
    // }
    for(let item of this.EditConfig){
      item.disabled=true
    }
    
  },
  mounted() {
    
  },
  methods: {
    open(val) {
      this.storyDetailModalShow = val.storyDetailModalShow
      this.title = val.popTitle
      this.popType = val.popType
      this.popFormData = Object.assign(val.popFormData)
      this.EditData = Object.assign(val.popFormData)
    },

    //弹框关闭
    storyDetailModalCancle(){
      this.storyDetailModalShow=false
      this.$emit("storyDetailModalCancle")
    },
    
    onCancle() {
      this.storyDetailModalShow=false
      this.$emit("storyDetailModalCancle")
    }
   
  }
};
</script>
<style lang="less" scoped>
 @import "../../../styles/page.css";

#elFromCss{
  // padding:20px 0px 0px 0px;
  // height: 650px;
  // overflow-y: auto;
  overflow-x: hidden;
}
#elFromCss /deep/ .el-form-item--small.el-form-item{
    display: inline-block;
    position: relative;
    margin:10px 10px;
  }
#elFromCss /deep/ .submitFoot{
    text-align: center;
    width: 100%;
  }
</style>