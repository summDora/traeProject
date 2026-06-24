<template>
	<div>
   <hyNewModal id="modalCss" v-if="relateStoryOpearModalShow" :dialogVisible='relateStoryOpearModalShow' :title='title' :ifThird="true"  :showClose="true" :ifSure="false" :ifCancle="false" width='80%' @closeHandle="relateStoryModalCancle" :modalAppendToBody="true" :appendToBody="true">
        <hyProjectForm 
                 :ifInLine="true" 
                 :formData="searchData" 
                 size="middle" 
                 labelPosition="left" 
                 :formConfig="searchConfig" 
                 :ifSearch="ifSearch" 
                 :isReset="isReset" 
                  @onSearch="onSearch"
                  @onReset="onReset">
        </hyProjectForm>
        <div class="zw" style="height:20px"></div>
        <div class="total-content_table-content-info hy-table_content">
            <hyNewTable
              :ifHaveIndex="true"
              :column="columnConfig"
              v-if="tableHeight"
              :height="500"
              :tableData="tableData"
              :ifHaveCheckBox="true"
              @handleSelectionChange="handleSelectionChange"
              @rowDblclick="rowDblclick"
              :page="searchObj.page"
              :pageSize="searchObj.rows"
            >
            <!-- 确认状态 -->
              <template slot="isYesStatus" slot-scope="{data}">
                <span>{{ data.isYesStatus ? isYesStatusList[Number(data.isYesStatus)] : "--" }}</span>
              </template>
            </hyNewTable>
            <div class="hy_two_pageBox">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchObj.page"
                :page-sizes="[20, 40, 60, 100]"
                :page-size="searchObj.rows"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <relateStoryDetailShowDialogTemp v-if="storyDetailShow" ref="storyDetailShowDialogTemp" @storyDetailModalCancle="storyDetailShow=false"></relateStoryDetailShowDialogTemp>
          <!--需求新增/修改弹框-->
          <demandAddEditModal
            v-if="demandAddEditModalShow"
            :modalAppendToBody="true"
            :appendToBody="true"
            ref="demandModalRef"
            :demandType="'查看'"
            :demandSelectDatas="demandSelectDatas"
            :batchData="''"
            :batchRowData="demandSelectDatas[0]"
            :demandAddEditModalShow="demandAddEditModalShow"
            demandModelTitle="需求信息查看"
            @demandAddEditModalOnSubmit="demandAddEditModalCancle"
            @demandAddEditModalCancle="demandAddEditModalCancle"
          ></demandAddEditModal>
          <!--需求新增/修改弹框-->
          <demandAddEditYWModal
            v-if="demandAddEditYWModalShow"
            :modalAppendToBody="true"
            :appendToBody="true"
            ref="demandModalRef"
            :demandType="'查看'"
            :demandSelectDatas="demandSelectDatas"
            :batchData="''"
            :batchRowData="demandSelectDatas[0]"
            :demandAddEditYWModalShow="demandAddEditYWModalShow"
            demandModelTitle="需求信息查看"
            @demandAddEditModalOnSubmit="demandAddEditModalCancle"
            @demandAddEditModalCancle="demandAddEditModalCancle"
          ></demandAddEditYWModal>
          <template slot="footer">
              <el-button size="medium" @click="onCancle">不关联需求</el-button>
              <el-button type="primary" size="medium" @click="onSubmit">确定</el-button>
          </template>
   </hyNewModal>
    
	</div>
</template>
<script>
import { getDictTree, selectBatchList} from "@/api/common.js";
import demandAddEditModal from "@/pages/zhny_base/requirementBatchMangement/demandAddEditModal.vue";
import demandAddEditYWModal from "@/pages/zhny_base/requirementBatchMangement/demandAddEditYWModal.vue";
import relateStoryDetailShowDialogTemp from "../relateStoryDetailShowDialogTemp/relateStoryDetailShowDialogTemp"
import { formConfig, columnConfig } from "./config.js";
const { searchConfig, searchData } = formConfig;
export default {
  name: "relateStoryOpear", // 关联需求
  components: {
    relateStoryDetailShowDialogTemp,
    demandAddEditModal,
    demandAddEditYWModal
  },
  data() {
    return {
      searchConfig,
      searchData: this.m_copy(searchData),
      searchObj: { page: 1, rows: 20 },
      columnConfig,
      ifSearch: true,
      isReset: true,
      title: "",
      relateStoryOpearModalShow: false,
      popType: "",
      popFormData: {},
      popParams: {},
      tableHeight: 0,
      tableData: [],
      total: 0,
      ztNoDeleteList: [],
      selectDatas: [],
      apiFn: '', //后台api
      professionalType: '',
      zjqd: '',
      investmentChannel: '',
      isYesStatus: '',
      isYesStatusList: ["未确认", "已确认"],
      storyDetailShow:false,
      pageTypeTable:"",
      //需求详情
      demandAddEditModalShow: false,
      demandAddEditYWModalShow:false,
      demandSelectDatas: "",
      relationStatus:"",
    };
  },
 
  created() {
   
  },
  mounted() {
    this.getTableClientHeight();
  },
  methods: {
    open(val) {
      console.log(val)
      this.relateStoryOpearModalShow = val.relateStoryOpearModalShow
      this.title = val.popTitle
      this.popType = val.popType
      this.apiFn = val.apiFn
      this.popFormData = Object.assign(val.popFormData)
      this.popParams = Object.assign(val.popParams)
      this.pageTypeTable=val.pageTypeTable
      this.relationStatus=val.relationStatus
      console.log(this.popParams)
      this.professionalType = this.popParams.professionalType,
      this.investmentChannel = this.popParams.investmentChannel
      this._getTableData()
      this._getDictTree();
      this._selectBatchList()
    },
    onMove() {

    },

    //弹框关闭
    relateStoryModalCancle(){
      this.relateStoryOpearModalShow=false
      this.searchData.batchYear = "",
      this.searchData.batchCodeStr = [""]
      this.searchData.demandName = ''
      this.searchData.projectCode = ''
      this.searchData.businessCompanyStr = [""]
      this.searchObj={ page: 1, rows: 20 }
      this.$emit("relateStoryModalCancle");
    },

     // 获取业务部门
    async _getDictTree() {
      let resp=await this.m_apiFn(getDictTree)("APP_SZH_YWBM")
      if(resp.statusCode === '200') {
        if (resp && resp.result && resp.result.length > 0) {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "businessCompanyStr") {
              iterator.options = resp.result;
              iterator.options.unshift({ dataLabel: "全部", dataVal: "" });
            }
          }
        }
      }
    },

        // 获取需求批次
    async _selectBatchList() {
      let resp=await this.m_apiFn(selectBatchList)()
      if(resp.statusCode === '200') {
        if (resp && resp.result && resp.result.length > 0) {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "batchCodeStr") {
              iterator.options = resp.result;
              iterator.options.unshift({ batchName: "全部", batchCode: "" });
            }
          }
        }
      }
    },
    
    // 获取列表数据
    async _getTableData() {
      let params = this.m_copy(this.searchData);
      console.log(this.searchData)
      params = Object.assign(params, this.searchObj ,{
        professionalType: this.professionalType,
        investmentChannel: this.investmentChannel,
        batchCodeStr: params.batchCodeStr.join(","),
        businessCompanyStr: params.businessCompanyStr.join(","),
        relationStatus:'0',
        relationBusinessType:this.popFormData.businessType,
      });
      if(this.title==="关联需求"){
        params.relationType='1'
      }
      if(this.pageTypeTable==="szhProjectDeclaration"){
        params.pageType="xmsb"
      }
      params.relationType='1'
      let resp=await this.m_apiFn(this.apiFn)(params)
      if(resp.statusCode === '200') {
        if (resp.result && resp.result.rows && resp.result.rows.length) {
          this.tableData = resp.result.rows;
          this.total = resp.result.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }
    },

    //多选事件
    handleSelectionChange(val) {
      this.selectDatas = val
    },
     // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.rows = e;
      this._getTableData();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this._getTableData();
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
    },
  
    //  确定
    onSubmit() {
      if (this.selectDatas.length === 0) {
          this.$message.warning("请选择数据");
          return false;
        }
      if(this.popFormData.businessType !== "BUSINESSTYPE_KY"){
        if (this.selectDatas.length > 1) {
          this.$message.warning("请选择一条数据");
          return false;
        }
      }
      this.$emit("relateStoryOpearSubmit",this.selectDatas)

    },
    // 取消
    onCancle() {
       this.searchData.batchYear = "",
       this.searchData.batchCodeStr = [""]
       this.searchData.demandName = ''
       this.searchData.projectCode = ''
       this.searchData.businessCompanyStr = [""]
       this.searchObj={ page: 1, rows: 20 }
       this.relateStoryOpearModalShow=false
    },
     // 查询
    onSearch() {
      this.searchObj.page = 1;
      this.searchObj = Object.assign(this.searchObj,this.popParams,this.searchData);
      this._getTableData();
    },
    // 重置
    onReset() {
       this.searchObj.page = 1;
       this.searchData.batchYear = "",
       this.searchData.batchCodeStr = [""]
       this.searchData.demandName = ''
       this.searchData.projectCode = ''
       this.searchData.businessCompanyStr = []
       this.searchData.projectQuery = ''
       this.searchObj = Object.assign(this.searchObj,this.popParams,this.searchData);
       this._getTableData();
    },

    // 双击需求编号可查看需求详情
    rowDblclick(e,i) {
      this.m_apiFn(getUpdateModelValue, {tdrpId:e.tdrpId}).then(res => {
        if(res.statusCode==="200"){
          this.demandSelectDatas=[res.result]
          if(e.professionalType==="0"){
            this.demandAddEditModalShow = true
          }else{
            this.demandAddEditYWModalShow = true
          }
        }else{
          this.$message.warning(res.message);
        }
      });
    },
    demandAddEditModalCancle() {
      this.demandAddEditModalShow = false;
      this.demandAddEditYWModalShow = false;
    },

  }
};
</script>
<style scoped>
.footerBtn {
    height: 80px;
    margin-top: 18px;
    text-align: center
}
</style>