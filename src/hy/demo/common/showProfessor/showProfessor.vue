 <template>
  <!-- 查看专家 -->
  <section >
    <div  >
      <template>
        <div>
          <div class="total-content_table-content-info hy-table_content">
            <hyNewTable
              :ifHaveIndex="true"
              :column="column"
              :height="460"
              :tableData="tableData"
              :ifHaveCheckBox="true"
              @handleSelectionChange="handleSelectionChange"
            ></hyNewTable>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>
 <script>
import { columnConfig, columnConfigExprt } from "./showProfessor.js";
import { getMeetingExpertTableData,getProjectExpertTableData } from "@/api/szhApi/szhGroupLeaderSummary";
export default {
  name: "showProfessor",
  data() {
    return {
      tableData: [],
      column: this.m_copy(columnConfig),
      total: 0,
      tableHeight: 0,
      selectDatas: "",
    };
  },
  props: {
    rowData: {
      type: Object,
      default: () => {}
    },
    page: {
      type: String,
      default: ""
    }
  },
  created() {
    if(this.rowData.expertType === 'project') {
      this.column = this.m_copy(columnConfigExprt);
    }
    this.getTableData();
  },
  methods: {
    //获取列表数据
   async getTableData() {
      let url=""
      let param = {};
      if(this.rowData.expertType === 'meeting') {
        url=getMeetingExpertTableData
        param = {meetingId:this.rowData.tdmId}
      } else {
        url=getProjectExpertTableData
        param = {projectCodeStr:this.rowData.projectCode}
      }
      this.page==="收口"?param.isClosing = "1":param.isClosing = "0"
      let res=await this.m_apiFn(url)(param)
        if (res.result && res.result.length) {
          this.tableData = res.result.map(item => {
            item.tel = this.m_phoneNumDesensitization(item.tel);
            return item;
          });
          this.total = res.result.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
    },

    //列表多选框改变
    handleSelectionChange(val) {
      this.selectDatas = [];
      if (val && val.length) {
        for (let item of val) {
          this.selectDatas.push(item.aa);
        }
      }
    },



    //弹框关闭
    professorDetailClose() {
      this.$emit("professorDetailClose");
    }
  },
  mounted() {}
};
</script>
<style scoped>
@import "../../../styles/page.css";
#modalCss /deep/ .el-form--label-top .el-form-item__label {
  width: 114px;
  text-align: right;
}
</style>