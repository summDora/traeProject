<template>
   <hyNewModal id="modalCss" v-if="assginReviewerModalShow" :ifThird="true" :dialogVisible='assginReviewerModalShow' :title='title'  :showClose="true" :ifSure="false" :ifCancle="false" width='950px' @closeHandle="relateStoryModalCancle" :modalAppendToBody="true" :appendToBody="true">
       <div class="table-content">
            <div class="total-content_table-content-info hy-table_content" style="padding-right: 25px;width: 50%;box-sizing: border-box;">
                <div class="title">指派评审负责人</div>
                <hyNewTable
                ref="psfzrTable"
                :ifHaveIndex="true"
                :column="columnConfig"
                v-if="tableHeight"
                :height="dialogHeight"
                :tableData="tableData"
                :ifHaveCheckBox="true"
                @handleSelectionChange="handleSelectionChange"
                >
                </hyNewTable>
            </div>
            <div class="total-content_table-content-info hy-table_content" style="width: 50%;">
                <div class="title">指派辅助评审人</div>
                <hyNewTable
                ref="fzpsrTable"
                :ifHaveIndex="true"
                :column="columnConfig1"
                v-if="tableHeight"
                :height="dialogHeight"
                :tableData="tableData1"
                :ifHaveCheckBox="true"
                @handleSelectionChange="handleSelectionChange1"
                >
                </hyNewTable>
            </div>
       </div>
      <template slot="footer">
          <el-button size="medium" @click="onCancle">取消</el-button>
          <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
      </template>
   </hyNewModal>
</template>
<script>
import { columnConfig, columnConfig1 } from "./config.js";
export default {
  name: "assginReviewer", // 指派评审人
  data() {
    return {
      dialogHeight:500,
      columnConfig,
      columnConfig1,
      title: "",
      assginReviewerModalShow: false,
      popType: "",
      popParams: {},
      tableHeight: 0,
      tableData: [],
      tableData1: [],
      total: 0,
      selectDatas: [],
      selectDatas1: [],
      // 评审负责人
      PsfzrApiFn: '',
      PsfzrParams: {},
      // 辅助评审人
      FzpsrApiFn: '',
      FzpsrParams: {},
      togglePsfzrId: '', //标识行数据传过来的评审人id
      toggleFzpsrId: '', //标识行数据传过来的辅助评审人id
    };
  },

  watch: {
    "$store.state.dialogHeight":{
      handler:function(newVal,oldVal){
        console.log(newVal,"newVal")
        this.dialogHeight=newVal?newVal-60:500
      }
    },
  },

  created() {
   
  },
  mounted() {
    this.getTableClientHeight();
  },
  methods: {
    async open(val) {
      console.log(val)
      this.assginReviewerModalShow = val.assginReviewerModalShow
      this.title = val.popTitle
      this.popType = val.popType
      this.PsfzrApiFn = val.PsfzrApiFn
      this.PsfzrParams = val.PsfzrParams
      this.FzpsrApiFn = val.FzpsrApiFn
      this.FzpsrParams = val.FzpsrParams
      this.popParams = val.popParams
      this.togglePsfzrId =  val.popParams.psfzr ? val.popParams.psfzr.split(',') : ""
      this.toggleFzpsrId = val.popParams.fzpsr ? val.popParams.fzpsr.split(',') : ""
      await this._getPsfzrTableData();
      await this._getFzpsrTableData()
    },
   
    //弹框关闭
    relateStoryModalCancle(){
      this.assginReviewerModalShow=false
    },

    // 获取评审负责人数据
  async  _getPsfzrTableData() {
      //  return new Promise(resolve=>{
        let resp=await this.m_apiFn(this.PsfzrApiFn)(this.PsfzrParams)
          if(resp.result && resp.result.length) {
            this.tableData = resp.result
            // 行数据评审负责人勾选
            this.$nextTick(() => {
              for(let item of this.tableData){
                if(item.isSelect==1){
                  this.$refs.psfzrTable.$refs.table.toggleRowSelection(item,true)
                }
              }
            })
          } 
        //   resolve()
        // })
    },

    // 获取辅助评审人数据
  async  _getFzpsrTableData() {
      // return new Promise(resolve=>{
       let resp=await  this.m_apiFn(this.FzpsrApiFn)( this.FzpsrParams)
          if(resp.result && resp.result.length) {
            this.tableData1 = resp.result
            // 行数据辅助评审人勾选
            this.$nextTick(() => {
              for(let item of this.tableData1){
                if(item.isSelect==1){
                  this.$refs.fzpsrTable.$refs.table.toggleRowSelection(item,true)
                }
              }
            })
          }
        //   resolve()
        // })
    },

    
    //多选事件
    handleSelectionChange(val) {
        this.selectDatas = val
    },

    handleSelectionChange1(val) {
        this.selectDatas1 = val
    },

    // 获取表格占高
    getTableClientHeight() {
      // offsetH body高度
      this.tableHeight = 0;
      let offsetH = document.getElementsByClassName("routerView")[0]
        .clientHeight;
      this.$nextTick(() => {
        if (offsetH) {
          const tableH = offsetH;
          this.tableHeight = tableH;
        }
      });
    },
  
    //  确定
    onSubmit() {
      this.$emit('savePSfzrSubmit',this.selectDatas, this.selectDatas1,this.popParams)
    },
    // 取消
    onCancle() {
        this.assginReviewerModalShow=false
    },
    
  }
};
</script>
<style scoped>
.table-content {
    display: flex
}
.title {
    line-height: 32px
}
.footerBtn {
    margin-top: 10px;
    text-align: center
}
</style>