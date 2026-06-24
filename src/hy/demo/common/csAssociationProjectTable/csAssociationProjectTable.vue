<template>
	<div>
    <hyProjectForm 
        class="batchCreatProject_projectFrom"
        :ifInLine="true" 
        :formData="searchData" 
        size="middle" 
        labelPosition="left" 
        :formConfig="searchConfig" 
        :ifSearch="true" 
        :isReset="true" 
        @formSelectChange="formSelectChange"
        @onSearch="onSearch"
        @onReset="onReset">
    </hyProjectForm>
    <div class="total-content_table-content-info hy-table_content ">
      <hyNewTable
        :ifHaveIndex="true"
        :column="columnConfig"
        :height="450"
        :tableData="tableData"
        :ifHaveCheckBox="true"
        @handleSelectionChange="handleSelectionChange"
        :page="searchObj.page"
        :pageSize="searchObj.rows"
      >
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
    <div class="footerBtn">
      <el-button style="width:200px"  @click="onCancle">取消</el-button>
      <el-button type="primary" style="width:200px"  @click="onSubmit">移除</el-button>
    </div>
	</div>
</template>
<script>
import { savePcxx, getKindList,getSelectXq, saveProjectYws, saveProjects,getAllDeptList, selectBatchList} from '@/api/batchManage'
import { formConfig, columnConfig } from "./csAssociationProjectTable.js";
const { searchConfig, searchData } = formConfig;
//初设概设添加项目接口
import { getAddProjectTableData } from '@/api/csBatchManage'
import { queryPcbhmcByYear , queryOrgByUserOrg } from "@/api/projectManagement.js";
export default {
  name: "csAssociationProjectTable", // 添加项目
  props:{
    page: {
      type: String,
      default: () => "batchManage"
    },
    ywlx: {
      type: String,
      default: () => "BUSINESSTYPE_KY"
    },
  },
  data() {
    return {
      searchConfig,
      searchData: this.m_copy(searchData),
      searchObj: { page: 1, rows: 20 , pageType : 'qForCsgl' , professionalType : '0'},
      columnConfig,
      selectList: [],
      tableHeight: 0,
      tableData: [],
      total: 0,
    };
  },
  created() {
    this.getSearchList()
    this.getOrgByUserOrg()
    this.getTableData();
  },
  mounted() {
    this.getTableClientHeight();
  },
  methods: {
    //获取可研批次
    getSearchList() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY",
        batchYear: this.searchData.batchYear
      };
      this.m_apiFn(queryPcbhmcByYear, param).then(res => {
        if (res && res.result) {
          for (const iterator of this.searchConfig) {
            if (iterator.key === "batchCodeStr") {
              iterator.options = res.result;
              iterator.options.unshift({ PCMC: "全部", PCBH: "" });
            }
          }
        }
      }) .catch(err => {});
    },

    // 查找项目单位
    getOrgByUserOrg() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY"
      };
      this.m_apiFn(queryOrgByUserOrg, param).then(res => {
        for (const iterator of this.searchConfig) {
          if (iterator.key === "sbdws") {
            iterator.options = res.result;
            iterator.options.unshift({ orgName: "全部", orgId: "" });
          }
        }
      }).catch(err => {});
    },

    formSelectChange(key, v) {
      if (key === "batchYear") {
        this.searchData.batchCodeStr = [""];
        this.getSearchList();
      } 
    },


    // 获取列表数据
    getTableData() {
      this.m_apiFn(getAddProjectTableData, this.searchObj).then(resp => {
        if (resp && resp.result && resp.result.rows && resp.result.rows.length > 0) {
          this.tableData = resp.result.rows;
          // this.tableData.forEach(item=>{
          //   if(item.isSelect==1){
          //     this.$nextTick(() => {
          //       this.$refs.tableData.$refs.table.toggleRowSelection(item, true);
          //     })
          //   }
          // })
          this.total = resp.result.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      }).catch(err => {});
    },
   
    //弹框关闭
    projrctModalCancle(){

    },
    // 查询
    onSearch(e) {
      this.searchObj.page = 1;
      let params=this.m_copy(e)
      if(e.batchCodeStr&&e.batchCodeStr.length){
        params.batchCodeStr = e.batchCodeStr.join(',');
      }else{
        params.batchCodeStr = ""
      }
      if(e.sbdws&&e.sbdws.length){
        params.sbdws = e.sbdws.join(',');
      }else{
        params.sbdws = ""
      }
      this.searchObj = Object.assign({},this.searchObj,params);
      this.getTableData();
    },
    // 重置
    onReset() {
      this.searchData=this.m_copy(searchData)
      let params={batchCodeStr:"",sbdws:""}
      this.searchObj = Object.assign({}, this.searchObj, this.searchData,params);
      this.getSearchList();
      this.getTableData();
    },
 
    //多选事件
    handleSelectionChange(val) {
      this.selectList = val
    },
    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.page = 1;
      this.searchObj.rows = e;
      this.getTableData();
    },

    // 显示页数变化
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
    },

    //  确定
    onSubmit() {

    },
    
    // 取消
    onCancle() {
      this.$emit("csAssociationOnCancle")
    }
  }
};
</script>
<style scoped>
  #modalCss /deep/  .el-form--label-top .el-form-item__label{
    width: 114px;
    text-align: right;
  }
  
#elFromCss {
  display: flex;
  flex-wrap: wrap;
  padding: 0 103px;
}
#elFromCss /deep/ .el-form-item {
  flex: 1 0 0;
  flex-basis: 50%;
  padding: 0 0;
  display: flex;
  justify-content: flex-start;
}
#elFromCss /deep/ .el-form-item--small .el-form-item__content,
.el-form-item--small .el-form-item__label {
  /* flex-basis: 287px !important; */
  text-align: left;
  flex-shrink: 0;
}
.footerBtn {
    height: 80px;
    text-align: center;
    margin-top: 18px;
}
.text {
    color:#3477DE;
}
/* .batchCreatProject_projectFrom >>> .el-select-dropdown__item {
    max-width: 300px;
    overflow: auto;
    display: -webkit-inline-box;
} */

</style>