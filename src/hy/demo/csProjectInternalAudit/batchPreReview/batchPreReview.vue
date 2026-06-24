<template>
<div>
  <hyNewModal v-if="batchPreReviewShow" :dialogVisible='batchPreReviewShow' @closeHandle="batchPreReviewCancle" :ifThird="true" title='批量内审' :showClose="true" :ifSure="false" :ifCancle="false"  :modalAppendToBody="true" :appendToBody="true"   width='80%'>
    <div>
      <div>
        <div class="total-content_table-content-info hy-table_content">
          <newTable
            :ifFixed="true"
            :ifHaveIndex="true"
            :column="column"
            v-if="tableHeight"
            :height="tableHeight"
            :tableData="tableData"
            :ifHaveCheckBox="true"
						@rowDblclick="rowDblclick"
            @handleSelectionChange="handleSelectionChange"
            :page="searchObj.page"
            :pageSize="searchObj.rows"
          >
            <template slot="operation" slot-scope="scope">
              <el-tooltip effect="dark" content="申报材料查看" placement="top">
                <i class="iconfont iconshenbaocailiaochakan" @click="clsb(scope.data)" style="padding:6x;color: rgb(41, 139, 245)"></i>
              </el-tooltip>
            </template>
          </newTable>
          <div class="hy_two_pageBox"  style="position:relative">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="searchObj.page"
              :page-sizes="[ 20,40,60,100]"
              :page-size="searchObj.rows"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <div style="margin-top:15px;text-align:center">
        <el-button @click="batchPreReviewCancle" style="width:200px">取消</el-button>
        <el-button type="danger" @click="submit('0')" style="width:200px">驳回</el-button>
        <el-button type="primary" @click="submit('1')" style="width:200px">通过</el-button>
      </div>
    </template>
  </hyNewModal >

	<!-- 项目 -->
  <projectEdit v-if="projectInfoDialogVisible" :dialogVisible="projectInfoDialogVisible" :disabled="dblclickDisabled" :apiParams="apiParams" title="项目详情" :batchData="rowData" :formData="rowData" @closeHandle="projectInfoDialogVisible=false">
  </projectEdit>

	<!-- 查看材料 -->
  <materialUpload v-if="clsbShow" :dialogVisible="clsbShow" :title="'查看材料'" :rowData="rowData" :clblx="'IPHONEDIY_SB'" @closeHandle="clsbShow=false" :getCommonCltjbTree="getCommonCltjbTree" :downloadFile="downloadFile" :downloadFiles="downloadFiles"></materialUpload>

</div>

</template>
<script>
import {
  getCommonCltjbTree,
  downloadFiles,
  downloadFile
} from "@/api/common.js";
import { 
 getProjectList
} from "@/api/szhApi/szhProjectDeclaration.js";
import {batchSubmitPreAudit} from '@/api/szhApi/csProjectInternalAudit.js'
import projectEdit from "../../common/projectEdit/projectEdit.vue";
import materialUpload from "../../common/materialUpload/materialUpload.vue";
// import { getXmcddwList } from "@/api/feasibilityReport";
// import { getDictTree,queryTableTitle } from "@/api/common";
// import { getZbs, queryKjXmxxTable } from "@/api/kjMeetingManagement";
// import { queryUnPickExpertProjectPager,getBatch,queryXqpc } from "@/api/expertSelectPrudently";
import { columnConfig } from "./batchPreReview.js";

// import DuplicateCheckResults from './duplicateCheckResults.vue'
// import CcReview from './ccReview.vue'
// import { queryChoiceProjectList,exportProjectList } from '@/api/duplicateCheckTaskdeclaration.js'
import { exportProjectResult,queryProjectInfomationList  } from '@/api/szhApi/szhDuplicateCheck.js'
import { getExpertsRecordList } from "@/api/szhApi/szhExpertsPreliminary.js";
export default {
  name: "ProjectSelect",
  components: { projectEdit,materialUpload },
	props: {
		apiParams: {
      type: Object,
      default: () => {}
    },
    batchRowData: {
      type: Object,
      default: () => {}
    },
    batchPreReviewShow: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      column: columnConfig,
			rowData:{},
      searchObj: { page: 1, rows: 20 },
      isReset: true, //查询显示
      ifSearch: true, //重置显示
      tableHeight: 380, //表格高度
      total: 0,
      selectDatas: [], //多选选中
      params:{},
      tableData:[],
      titleColumn:[],

      //查重报告
      CCRowObj: {},
      ccModelShow: false,
      //材料查看
      clsbShow: false,
      getCommonCltjbTree,
    	downloadFiles,
    	downloadFile,
			//查看项目信息
			dblclickDisabled:true,
			projectInfoDialogVisible:false,
    };
  },
  created() {
     this.getTableData();
  },
  mounted() {},

  methods: {
    //获取列表数据
    async getTableData() {
      const param = {
        batchCode: this.batchRowData.batchCode,
        professionalType: this.batchRowData.professionalType,
        page: this.searchObj.page,
        rows: this.searchObj.rows,
        configType:'1',
        ...this.apiParams,
        projectStatusStr:"18",
      };
      let res=await this.m_apiFn(getProjectList)(param)
      if (res.result && res.result.rows) {
        this.tableData = res.result.rows;
        this.total = res.result.total;
      } else {
        this.tableData = [];
        this.total = 0;
      }
    },


    formSelectChange(key,e){
    },

    // 列表多选事件
    handleSelectionChange(row) {
      this.selectDatas = row;
    },

		 // 项目双击行项目事件
    rowDblclick(e, i) {
      this.dblclickDisabled = true
      this.rowData = e;
      this.projectInfoDialogVisible = true;
    },
    
    //材料查看
    clsb(rowData) {
      this.rowData = Object.assign({}, rowData, {
        xmlx: this.projectType,
        ywlx: this.businessType,
        xmbh: rowData.projectCode,
        projectStatus: rowData.projectStatus
      });
      this.clsbShow = true;
    },
    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.page=1

      this.searchObj.rows = e;
      this.getTableData();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this.getTableData();
    },

    

    // 获取表格占高
    // getTableClientHeight() {
    //   // offsetH body高度
    //   this.tableHeight = 0;
    //   let offsetH = document.getElementsByClassName("hy-table_content")[0]
    //     .clientHeight;
    //   let pageBox = document.getElementsByClassName("hy_two_pageBox")[0]
    //     .clientHeight;
    //   this.$nextTick(() => {
    //     if (offsetH) {
    //       const tableH = offsetH - pageBox - pageBox;
    //       this.tableHeight = tableH;
    //     }
    //   });
    // },

		//弹框关闭事件
    batchPreReviewCancle() {
      // this.searchData = this.m_copy(searchData)
      this.selectDatas = [] //清空选中项
      this.$emit('batchPreReviewCancle')
    },

		//通过/驳回
		submit(type){
      this.$confirm(type==='1'?"确认通过？":"确认驳回？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      }).then(() => {
        let params = {
          batchCode: this.batchRowData.batchCode,
          professionalType: this.batchRowData.professionalType,
          page: this.searchObj.page,
          rows: this.searchObj.rows,
          configType:'1',
          ...this.apiParams,
          projectStatusStr:"18",
          isSubmit:type,
        };
        params.projectCodeStr=this.selectDatas.map(item=>{
          return item.projectCode
        }).toString()
        this.m_apiFn(batchSubmitPreAudit)(params).then(res=>{
          if(res.statusCode==="200"){
            this.$message.success("成功")
            this.$emit("batchPreReviewSubmit");
          }
        })
        
      }).catch(() => {});
      
		},

  }
};
</script>
<style scoped>
/* @import "../../../../styles/page.css"; */
.total-content_table {
  width: 100%;
}
.hy-table_content {
  width: 100%;
}
#elFromCss {
  display: flex !important;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 0 103px;
}

.icon {
  color: #3477de;
}
</style>