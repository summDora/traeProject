<template>
  <!-- 评审记录 -->
  <section>
    <div class="total-content_table">
      <template>
        <div class="total-content_table-content">
          <div class="total-content_table-content-title" ref="searchRef">
            <hyProjectForm
              :formConfig="formConfig"
              :formData="searchData"
              @onSearch="onSearch"
              :ifSearch="true"
              @onReset="onReset"
              :isReset="true"
            ></hyProjectForm>
          </div>
          <div class="hy-table_content">
            <hyNewTable  
              :ifHaveIndex="true"
              :column="tableColumn"
              :height="500"
              :tableData="tableData"
              :ifHaveCheckBox="true"
              @handleSelectionChange="handleSelectionChange"
              :page="searchObj.page"
              :pageSize="searchObj.rows">
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
        </div>
      </template>
    </div>


  </section>
</template>
<script>
import { getProjectBeforeOpinion, revisedSuggestions } from "@/api/szhApi/common.js";
import {
  getCommonCltjbTree,
  uploadTreeFiles,
  downloadFile,
  downloadFiles,
  deleteFileById,
} from "@/api/common.js";
import {
  reviewRecord,
  recallOpinion,
} from "@/api/szhApi/szhGroupLeaderSummary";
export default {
  name: "batchImportDetail",   //上传详情
  props: {
    businessType: {
      type: String,
      default: ""
    },
    projectType: {
      type: String,
      default: ""
    },
  },
  data() {
    return {
      formConfig:[
        {
          type: "input",
          placeholder: "请输入",
          key: "projectQuery",
          embed: true,
          clearable: true,
          selectClass: "selectEmbed",
          selectEmbedLabel: "项目查询",
          width: 300,
          embedWidth: 90
        },
        {
          type: "input",
          key: "batchName",
          embed: true,
          selectClass: "selectEmbed",
          selectEmbedLabel: "文件名称",
          clearable: true,
          width: 300,
          size: "small",
          placeholder: "请输入",
          labelName: "name",
          labeKey: "value"
        },
        {
          type: "select",
          placeholder: "请选择状态",
          key: "sjType",
          embed: true,
          multiple: false,
          clearable: true,
          selectClass: "selectEmbed",
          selectEmbedLabel: "上传状态",
          width: 260,
          embedWidth: 90,
          options: [
            {
              key: "",
              value: "全部"
            },
            {
              key: "1",
              value: "成功"
            },
            {
              key: "0",
              value: "失败"
            }
          ],
          labelName: "value",
          labeKey: "key"
        },
      ],
      searchData:{
        batchName: "",
        projectQuery: ""
      },
      searchObj: { page: 1, rows: 20 },
      ifSearch: true,
      tableData: [],
      tableColumn:[
        {
          key: "projectCode",
          label: "项目编号",
          // baseWidth: 120
        },
        {
          key: "projectName",
          label: "项目名称"
        },
        {
          key: "projectCompanyName",
          label: "项目单位",
          // baseWidth: 160
        },
        {
          key: "projectStatusName",
          label: "项目状态",
          // baseWidth: 100
        },
        {
          key: "batchCode",
          label: "批次编号",
          // baseWidth: 120
        },
        {
          key: "operation",
          label: "操作",
          isSlot: "true",
          slotName: "operation",
          baseWidth: 160,
          fixed: true,
          isLastSlot: true
        }
      ],
      total: 0,
      selectDatas: [],
      //材料查看/上传弹框
      projectRowData: {},
      materialScienceModalShow: false,
      getCommonCltjbTree,
      uploadTreeFiles,
      downloadFile,
      downloadFiles,
      deleteFileById,
      //意见查看
      checkOpinionsModalDialogShow: false,
      checkOpinionsModalTitle: "",
      checkOpinionsModalYjlx: "",
      getProjectBeforeOpinion, 
      revisedSuggestions,
    };
  },
  components: {

  },
  created() {
    this.searchObj = Object.assign(this.searchObj, this.searchData);
    this.getTableData();
  },
  methods: {
    //查询列表
    onSearch(e) {
      this.searchObj.page = 1;
      this.searchObj = Object.assign(this.searchObj, e);
      this.getTableData();
    },
    onReset() {
      this.searchData = {
        batchName: "",
        projectQuery: ""
      }
      this.searchObj.page = 1;
      this.searchObj = Object.assign(this.searchObj, this.searchData);
      this.getTableData();
    },
   async getTableData() {
      let param = {};
      param = Object.assign(this.searchObj, param);
      let res=await this.m_apiFn(reviewRecord)( Object.assign(param, {
          projectType: this.projectType,
          businessType: this.businessType,
          type: "1",
          showType: ""
        }))
          if (res.result.rows) {
            this.tableData = res.result.rows;
            this.total = res.result.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
    },

    //列表多选框改变
    handleSelectionChange(val) {
      this.selectDatas = val;
    },

    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.rows = e;
      this.getTableData();
    },


    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this.getTableData();
    },

 
    //取消
    onCancle() {
      this.$emit("reviewRecordOnCancle");
    }
  },
  mounted() {}
};
</script>
<style scoped>
/* @import "../../../../../styles/page.css"; */
#modalCss /deep/ .el-form--label-top .el-form-item__label {
  width: 114px;
  text-align: right;
}
</style>