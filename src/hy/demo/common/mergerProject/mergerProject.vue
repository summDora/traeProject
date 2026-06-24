<template>
  <hyModal :dialogVisible='dialogVisible' :title='title' :ifThird="true" :ifSure="false" :ifCancle="false" width='80%' @closeHandle="mergerProjectModalCancle">
    <div class="total-content_table-content-title">
      <hyProjectForm :formData="searchObj" :formConfig="searchConfig" :ifSearch="ifSearch" :isReset="isReset" @onSearch="onSearch" @onReset="onReset">
      </hyProjectForm>
    </div>
    <div class="total-content_table-content-info hy-table_content">
      <newTable :ifHaveIndex="true" :column="titleColumn" :tableData="tableData" :ifHaveCheckBox="true" :height="500" @handleSelectionChange="handleSelectionChange" @cellClick="cellClick">
      </newTable>
    </div>
    <template slot="footer">
      <div v-if="hasBtn">
        <el-button size='medium' @click="onCancle">取消关联</el-button>
        <el-button type="primary" size='medium' @click="onSubmit">关联</el-button>
      </div>
    </template>
  </hyModal>
</template>
<script>
import { formConfig, columnConfig } from "./config.js";
const { searchConfig, searchData } = formConfig;
import { getXmcddwList } from "@/api/feasibilityReport.js";
import { querrySkglxm , queryZjpsxm } from "@/api/closedMaterialUpload.js";
import { getDictTree, queryTableTitle } from "@/api/common.js";
export default {
  name: "mergerProject", //合并项目

  props: {
    dialogVisible: {
      required: true,
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => "合并项目"
    },
    page: {
      type: String,
      default: () => ""
    },
    width: {
      type: String,
      default: () => "1060px"
    },
    hasBtn: {
      type: Boolean,
      default: () => false
    },
    mainRowData: {
      type: Object,
      default: () => {}
    }
  },

  data() {
    return {
      searchConfig,
      searchObj: this.m_copy(searchData),
      columnConfig,
      ifSearch: true,
      isReset: true,
      tableData: [],
      selectDatas: [],
      apiParams:{
        tableType: "1",
        projectType: "PROJECTTYPE_KJ",
        businessType: "BUSINESSTYPE_KY"
      },
      titleColumn:[],
    };
  },

  created() {},

  mounted() {
    this.getTableTitle();
    this.getAllXmcddwList();
    this.getccjlKindList();
    this._queryProjectListInPage();
  },

  methods: {
    // 获取列表标题
    getTableTitle() {
      this.apiParams.showType= "0"
      this.apiParams.pageTypeTable="feasibilityReport"
      this.apiParams.businessType="BUSINESSTYPE_KY"
      this.apiParams.tableType='1'

      let param = {
        ...this.apiParams,
        showType: "0",
      }
      this.m_apiFn(queryTableTitle,param).then(resp => {
        if (resp.result&&resp.result.length) {
          // 
          this.titleColumn = resp.result.map(item => {
            item.key = item.fieldCode;
            item.typeName = item.menuFieldType;
            
            item.label = item.fieldName;
            item.fixed = item.fixed==='1'?true:false;
            item.width = item.fieldWidth;
            if(item.children&&item.children.length>0){
              item.children.map(x=>{
                x.key = x.fieldCode;
                x.typeName = x.menuFieldType;
                
                x.label = x.fieldName;
                x.width = x.fieldWidth;
              })
            }
            return item;
          });
          
        }
      }).catch(err=>{
        // console.log(err)
      })
    },

    // 查找项目单位
    getAllXmcddwList() {
      const param = {
        isSearch: 1,
        organizeId: "ZJDL"
      };
      this.m_apiFn(getXmcddwList, param)
        .then(res => {
          if (res && res.result && res.result.length > 0) {
            for (const iterator of this.searchConfig) {
              if (iterator.key === "xmcddw") {
                iterator.data = res.result;
              }
            }
          }
        })
        .catch(err => {});
    },

    // 获取查重结论
    getccjlKindList() {
      const dictHeadId = "APP_KJ_CCJL";
      this.m_apiFn(getDictTree, dictHeadId).then(res => {
        if (res.result.children && res.result.children.length > 0) {
          for (const item of this.searchConfig) {
            if (item.key === "ccjl") {
              item.options = res.result.children;
              item.options.unshift({
                dataLabel: "全部",
                dataVal: ""
              });
            }
          }
        }
      });
    },

    // 获取列表数据
    _queryProjectListInPage() {
      let param = Object.assign(this.searchObj, {
        xmbh: this.mainRowData.xmbh
      });

      let params = this.m_copy(param);
      params.xmcddw = params.xmcddw.join(",");
      params.ccjl = params.ccjl.join(",");
      params.showType = "0";
      params.tableType = "1";
      params.pageTypeTable = "feasibilityReport";
      params.businessType = "BUSINESSTYPE_KY";
      params.projectType = "PROJECTTYPE_KJ";

      let url=""
      if(this.page==="expertEvaluation" || this.page==="closedMaterialUpload"){
        url=queryZjpsxm
        params.xmbh=this.mainRowData.hbxmbh
      }else{
        url=querrySkglxm
      }
      this.m_apiFn(url, params)
        .then(resp => {
          if (resp.result.rows && resp.result.rows.length) {
            this.tableData = resp.result.rows;
          } else {
            this.tableData = [];
          }
        })
        .catch();
    },

    //弹框关闭
    mergerProjectModalCancle() {
      this.$emit("mergerProjectOnCancle");
    },

    cellClick() {},

    // 查询
    onSearch(e) {
      this.searchObj = Object.assign(this.searchObj, e);
      this._queryProjectListInPage();
    },

    // 重置
    onReset() {
      this.searchObj = this.m_copy(searchData);
      this._queryProjectListInPage();
    },

    //取消关联
    onCancle() {
      this.$emit("mergerProjectOnCancle");
    },

    //关联
    onSubmit() {
      this.$emit("mergerProjectOnSubmit");
    },

    //多选事件
    handleSelectionChange(val) {
      this.selectDatas = val;
    }
  }
};
</script>
<style scoped>
.footerBtn {
  height: 80px;
  text-align: center;
  margin-top: 18px;
}
</style>