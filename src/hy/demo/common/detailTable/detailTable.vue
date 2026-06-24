<template>
  <div>
    <div class="modelTitle">
      <div v-if="modelTopTitle.length>0" class="modelTitleBlock">
        <div v-for="(item,index) of modelTopTitle" :key="index">
          <span style="font-weight:700;margin-right: 100px;">{{item.name}}：{{item.value}}</span>
        </div>
      </div>
      <div v-if="modelTopContent.length>0" class="modelTitleBlock" style="margin-top:18px">
        <div v-for="(item,index) of modelTopContent" :key="index">
          <span style="margin-right: 100px;">{{item.name}}：{{item.value}}</span>
        </div>
      </div>
    </div>
		<div class="total-content_table-content-title" ref="searchRef">
      <hyProjectForm 
        :ifInLine="true" 
        :formConfig="searchConfig" 
        :formData="searchData" 
        size="middle" 
        labelPosition="left" 
        :ifSearch="true" 
        @onSearch="onSearch"
        :isReset="true" 
        @onReset="onReset">
      </hyProjectForm>
    </div>
    <div class="total-content_table-content-message">
      <div>
        <hyNewButtons
          :buttonsData="buttonsData"
          @selectButtons="selectButtons"
        >
        </hyNewButtons>
      </div>
    </div>
    <div class="total-content_table-content-info hy-table_content">
      <hyNewTable
        :rowKey="rowKey"
        :ifHaveIndex="true"
        :column="detailColumnConfig"
        :ifFixed="true"
        :height="420"
        :tableData="tableData"
        :ifHaveCheckBox="true"
        :needSpanMethod="needSpanMethod"
        :needMergeSpan="needMergeSpan"
        @rowDblclick="rowDblclick"
        @handleSelectionChange="handleSelectionChange"
        :page="searchObj.page"
        :pageSize="searchObj.rows"
      >
        <!--会议名称-->
        <template slot="name" slot-scope="scope">
          <span style="cursor:pointer;color:#298BF5" v-if="scope.data.createByName" @click="getDetail(scope.data)">{{scope.data.createByName}}</span>
          <span v-else>--</span>
        </template>
      </hyNewTable>
      <div class="hy_two_pageBox">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchObj.page"
          :page-sizes="[20, 40, 60 ,100]"
          :page-size="searchObj.rows"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getTableData,
  updateBanner,
  deleteBanner
} from "@/api/bannerManagement";
export default {
  name: "detailTable",
  props: {
    detailType: {
      type: String,
      default: () => ""
    },
    rowKey: {
      type: String,
      default: () => "id"
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    tableUrl: {
      required: true,
      type: Function,
      default: () => null
    },
    tableDownloadUrl: {
      required: true,
      type: Function,
      default: () => null
    },
    modelTopTitle: {
      type: Array,
      default: () => []
    },
    modelTopContent: {
      type: Array,
      default: () => []
    },
    detailFormConfig: {
      type: Object,
      default: () => {}
    },
    detailColumnConfig: {
      type: Array,
      default: () => []
    },
    needMergeSpan: {
      type: Array,
      default: () => []
    },
  },
  data() {
    return {
      //需求
      searchConfig: this.detailFormConfig.searchConfig,
      searchData: this.m_copy(this.detailFormConfig.searchData),
      searchObj: { page: 1, rows: 20 },
      tableData: [],
      total: 0,
      tableHeight: 0,
      selectDatas: [],
      //按钮组
      buttonsData: [
        {
          id: "primary",
          text: "导出",
          icon: "iconzu1192",
          color: "#298BF5"
        }
      ],
      nowDate:"",
      needSpanMethod:false,
    };
  },
  created() {
    //获取今天日期
    let data=new Date();
    let year=data.getFullYear();
    let month=data.getMonth()+1
    let day=data.getDate()
    if(month<10){
      month='0'+month
    }
    if(day<10){
      day='0'+day
    }
    this.nowDate=year+'-'+month+'-'+day
    if(this.detailType==="会议签到明细表"){
      this.searchData.createDate=this.nowDate
      this.searchObj.createDate=this.nowDate
    }
    this.getTableData();
  },
  methods: {
    //页面查询
    onSearch(e) {
      this.searchObj.page = 1;
      let params = this.m_copy(e);
      if(this.detailType==="会议回执明细表"){
        if(params.moveDate&&params.moveDate.length>0){
          params.moveStartDate=params.moveDate[0]
          params.moveEndDate=params.moveDate[1]
        }else{
          params.moveStartDate=""
          params.moveEndDate=""
        }
        delete params.moveDate
      }
      this.searchObj = Object.assign({}, this.searchObj, params);
      this.getTableData();
    },
    //重置列表
    onReset() {
      this.searchObj.page = 1;
      this.searchData = this.m_copy(this.detailFormConfig.searchData);
      switch(this.detailType){
        case '会议签到明细表':
        this.searchData.createDate=this.nowDate
        break
        case '会议回执明细表':
        this.searchData.moveStartDate=""
        this.searchData.moveEndDate=""
        delete this.searchData.moveDate
        break
      }
      this.searchObj = Object.assign({}, this.searchObj, this.searchData);
      this.getTableData();
    },
    //获取列表数据
    async getTableData() {
      let params={}
      switch(this.detailType){
        case '会议签到明细表':
          params.meetingId=this.rowData.tdmId
          params.businessType=this.rowData.businessType
        break
        case '会议回执明细表':
          params.meetingId=this.rowData.tdmId
          params.businessType=this.rowData.businessType
        break
        case '会议用餐明细表':
          params.dinnerDate=this.rowData.dinnerDate
        break
        case '会议入住明细表':
          params.meetingId=this.rowData.meetingId
        break
      }
      this.searchObj = Object.assign({}, this.searchObj, params, {
        businessType: this.rowData.businessType
      });
      let res= await this.m_apiFn(this.tableUrl)(this.searchObj)
      if (res.result && res.result.rows && res.result.rows.length) {
        this.tableData = res.result.rows.map(item => {
          item.tel = this.m_phoneNumDesensitization(item.tel);
          return item;
        });
        this.total = res.result.total;
        // if(this.detailType==='会议签到明细表'){
        //   for(let item of this.tableData){
        //     for(let i=0;i<this.tableData.length;i++){
        //       if(this.tableData[i].userId===item.userId){
        //         this.needSpanMethod=true
        //         item.roleName=item.roleName+" "
        //         // item.userId=item.userId+" "
        //         item.userName=item.userName+" "
        //         item.phone=item.phone+" "
        //         item.qdNum=item.qdNum+" "
        //         item.qdNum+=this.tableData[i].qdNum
        //         item.isQdName=item.isQdName+" "
        //       }else{
        //         this.needSpanMethod=false
        //       }
        //     }
        //   }
        // }
      } else {
        this.tableData = [];
        this.total = 0;
      }
    },
    //页面按钮操作
    async selectButtons(e) {
      switch (e.text) {
        case '导出':
          let params=this.m_copy(this.searchObj)
          let list=[]
          for(let item of this.selectDatas){
            switch (this.detailType) {
              case '会议签到明细表':
                list.push(item.id)
              break
              case '会议回执明细表':
                list.push(item.professorNumber)
              break
              case '会议用餐明细表':
                list.push(item.tamId)
              break
              case '会议入住明细表':
                list.push(item.unique)
              break
            }
          }
          switch (this.detailType) {
            case '会议签到明细表':
              params.ids=list
            break
            case '会议回执明细表':
              params.professorNumber=list.join(',')
              params.meetingName=this.modelTopTitle[0].value
            break
            case '会议用餐明细表':
              params.tamId=list.join(',')
            break
            case '会议入住明细表':
              params.unique=list.join(',')
              params.meetingName=this.modelTopTitle[0].value
            break
          }
          await this.m_apiFn(this.tableDownloadUrl)(params)
        break
      }
    },

    rowDblclick(e) {},

    //页面多选框改变
    handleSelectionChange(val) {
      this.selectDatas = val;
    },

    //页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.page = 1;
      this.searchObj.rows = e;
      this.getTableData();
    },
    //显示页数变化
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
    }
  },
  mounted() {
    this.getTableClientHeight();
  }
};
</script>
<style lang="less" scoped>
@import "../../../styles/page.css";
.modelTitle{
  margin-bottom: 10px;
  background: #cccccc47;
  padding:16px 25px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .modelTitleBlock{
    width:100%;
    display: flex;
  }
}
</style>