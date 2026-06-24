<template>
  <hyNewModal
      :showClose="true"
      v-if="uploadModalShow"
      :dialogVisible='uploadModalShow'
      :title='title'
      :ifSure="false"
      :ifCancle="false"
      width='90%'
      class="commonModal"
      :modalAppendToBody="modalAppendToBody" 
      :appendToBody="appendToBody"
      @closeHandle="closeHandle">
    <commonTree
        v-if="hasCommonTreeShow"
        class="commonTree"
        :treeData="fileList"
        :defaultTreeProps="defaultTreeProps"
        @handleNodeClick="handleNodeClick">
    </commonTree>
    <tableTransfer
        class="tableTransfer"
        :style="{width:this.width}"
        :nodeObj="nodeObj"
        :tableOneConfig="tableOneConfig"
        :tableTwoConfig="tableTwoConfig"
        :tableOneFn="tableOneFn"
        :tableTwoFn="tableTwoFn"
        :apiFn1="apiFn1"
        :apiFn2="apiFn2"
        :params1="params1"
        :params2="params2"
        :hasFooterBtn="hasFooterBtn"
        :hasKJFooterBtn="hasKJFooterBtn"
        :ifHaveZZ="ifHaveZZ"
        :ifHavePSFZR="ifHavePSFZR"
        :isZyObj="isZyObj"
        :PCisZyObj="PCisZyObj"
        :isKJmeetObj="isKJmeetObj"
        @handleClickZZ="handleClickZZ"
        @handleClickPSFZR="handleClickPSFZR"
        @handleClickDXTZ="handleClickDXTZ"
        @successSubmit="successSubmit"
        @onReset1="onReset1"
        @onReset2="onReset2"
        @toLeft="toLeft"
        @toRight="toRight"
        :toRightSuccess="toRightSuccess"
        :toLeftSuccess="toLeftSuccess"
        :text="text"
        :ifHaveDXTZ="ifHaveDXTZ"
        :dxType="assignType"
        :zzApiFn="zzApiFn"
        >
    </tableTransfer>
  </hyNewModal>
</template>

<script>
  import {  tableOneConfig, tableTwoConfig } from './config';
  import CommonTree from "../commonTree/commonTree";
  import TableTransfer from '../tableTransfer/tableTransfer';

  export default {
    name: "assignExperts",
    components: { CommonTree, TableTransfer },
    data() {
      return {
        tableOneFn: '',
        tableTwoFn: '',
        nodeObj: null,
        tableHeight: 330,
        tableData: [],
        fileList: [],
        defaultTreeProps:{
          children:'childList',
          label:'majorName'
        },
        isZyObj: {},
        PCisZyObj: {},
        isKJmeetObj: {}, //科技项目左侧组织树选中容器
      }
    },

    props: {
      assignType: {
        type: String,
        default: () => '',
      },
      text: {
        type: Array,
        default: () => [],
      },
      title: {
        required: true,
        default: () => '',
        type: String,
      },
      uploadModalShow: {
        required: true,
        default: () => false,
        type: Boolean,
      },
      width: {
        type: String,
        default: () => '100%',
      },
      hasCommonTreeShow: {
        required: true,
        default: () => false,
        type: Boolean,
      },
      apiFn: {
        default: () => '',
        type: Function,
      },
      apiFn1: {
        default: () => '',
        type: Function,
      },
      apiFn2: {
        default: () => '',
        type: Function,
      },
      params: {
        default: () => {},
        type: Object,
      },
      params1: {
        default: () => {},
        type: Object,
      },
      params2: {
        type: Object,
      },
      hasFooterBtn: {
        required: true,
        default: () => false,
        type: Boolean,
      },
      hasKJFooterBtn: {
        default: () => false,
        type: Boolean,
      },
      tableOneConfig: {
        required: true,
        default: () => {},
        type: Object,
      },
      tableTwoConfig: {
        required: true,
        default: () => {},
        type: Object,
      },
      ifHaveZZ: {
        default: () => false,
        type: Boolean,
      },
      ifHavePSFZR: {
        default: () => false,
        type: Boolean,
      },
      toRightSuccess: {
        default: () => 0,
        type: Number,
      },
      toLeftSuccess: {
        default: () => 0,
        type: Number,
      },
      ifHaveDXTZ: {
        default: () => false,
        type: Boolean,
      },
      zzApiFn: {
        default: () => '',
        type: Function,
      },
      modalAppendToBody:{
        default: () => false,
        type: Boolean,
      },
      appendToBody:{
        default: () => false,
        type: Boolean,
      },
    },

    mounted() {
      this.getTableData();
    },

    methods: {
      closeHandle() {
        this.$emit('closeHandle',this.assignType)
      },

     async getTableData() {
      let resp=await this.m_apiFn(this.apiFn)(this.params)
          if(resp.result) {
            let newArr=[]
            let obj={
              id:'',
              text:'全部',
              childList:this.deepTree(resp.result)
            }
            newArr.push(obj)
            this.fileList = newArr

          }
      },
      deepTree(arr){
        arr.map(item=>{
          item.id=item.tpmcId
          item.text=item.majorName
          if(item.childList){
            this.deepTree(item.childList)
          }
          return item
        })
        return arr
      },
      handleNodeClick(val) {
        if(this.$route.name === 'meetManage') {
          this.isZyObj = val
        } else if(this.$route.name === 'meetingManagement') {
          this.isKJmeetObj = val
        } else {
          this.PCisZyObj = val
        }
      },
       // 设为组长
      handleClickZZ() {
        this.$emit('handleClickZZ')
      },

      // 设为评审负责人
      handleClickPSFZR() {
        this.$emit('handleClickPSFZR')
      },
      // 设为专家角色成功回调
      successSubmit() {
        this.$emit('szzjjsSuccessSubmit')
      },
      // 表一重置按钮
      onReset1(val) {
         this.$emit('zpzjOnReset1',val,this.assignType)
      },
     // 表二重置按钮
     onReset2(val) {
       this.$emit('zpzjOnReset2',val,this.assignType)
     },
     // 已选-->待选
     toLeft(params, selectList){
       this.$emit('toLeft',params,selectList,this.assignType)
     },
     // 待选-->已选
     toRight(params, selectList) {
       this.$emit('toRight',params,selectList,this.assignType)
     },
     handleClickDXTZ(type,selectList) {
       this.$emit("handleClickDXTZ",type,selectList)
     }
    },
  }
</script>

<style  scoped>
.commonModal >>> .el-dialog__body {
  display: flex;
  max-height: 630px;
  overflow: auto;
}

.commonTree {
  /* min-width: 200px; */
  width:13%;
  max-height: 631px;
  overflow: hidden auto;
}
</style>