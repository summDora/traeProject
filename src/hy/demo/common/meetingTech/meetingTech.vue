<template>
  <div>
    <div class="modelTitle">
      <div class="modelTitleBlock">
        <div v-for="(item,index) of modelTopTitle" :key="index">
          <span style="font-weight:700;margin-right: 100px;">{{item.name}}：{{item.value}}</span>
        </div>
      </div>
      <div class="modelTitleBlock" style="margin-top:18px;display: flex;justify-content: space-between;">
        <div v-for="(item,index) of modelTopContent" :key="index">
          <span >{{item.name}}：{{item.value}}</span>
        </div>
      </div>
    </div>
    <div class="total-content_table-content-title" ref="searchRef">
      <hyProjectForm :ifInLine="true" :formConfig="formConfig" :formData="searchData" size="middle" labelPosition="left" :ifSearch="ifSearch" @onSearch="onSearch" :isReset="true" @onReset="onReset">
      </hyProjectForm>
    </div>
    <div class="total-content_table-content-message">
      <div>
        <div class="new-buttons">
          <div size='small' @click="mettingProgrammeClick">
            <i class="iconfont" :class="'iconxiugai'" style="color:#298BF5;margin-right: 5px;"></i>
            修改
          </div>
          <div size='small' @click="zybDownloadFile">
            <i class="iconfont" :class="'icon iconfont iconzu1192'" style="color:#298BF5;margin-right: 5px;"></i>
            导出
          </div>
          <div size='small' @click="signInClick">
            <i class="iconfont" :class="'icon iconfont iconyushenjilu'" style="color:#298BF5;margin-right: 5px;"></i>
            短信通知
          </div>
        </div>
      </div>
    </div>
    <div class="total-content_table-content-info hy-table_content">
      <hyNewTable :rowKey="'tdmId'" :ifHaveIndex="true" :column="column" v-if="tableHeight" :height="tableHeight" :tableData="tableData" :ifHaveCheckBox="true" @handleSelectionChange="handleSelectionChange" :page="searchObj.page" :pageSize="searchObj.rows">
        <!-- 是否预订房间 -->
        <template slot="moveName" slot-scope="scope">
          <span v-if="scope.data.status == '0'">--</span>
          <span v-else>{{scope.data.moveName}}</span>
        </template>
        <!-- 预订房间数 -->
        <template slot="roomNum" slot-scope="scope">
          <span v-if="scope.data.status == '0'">--</span>
          <span v-else>{{scope.data.roomNum}}</span>
        </template>
        <!-- 入住人数 -->
        <template slot="movePeople" slot-scope="scope">
          <span v-if="scope.data.status == '0'">--</span>
          <span v-else>{{scope.data.movePeople}}</span>
        </template>
      </hyNewTable>
      <div class="hy_two_pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchObj.page" :page-sizes="[20, 40, 60 ,100]" :page-size="searchObj.rows" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!--会议回执-->
    <hyModal :dialogVisible="qiandaoShow" v-if="qiandaoShow" :ifThird="true" :title="qiandaoTitle" :width="'700px'" @closeHandle="qiandaoClose">
      <!-- 选人的时候 -->
      <el-form :model="item" label-width="160px" :rules="itemrules" ref="huiyiForm">
        <el-form-item label=" 用户信息 : ">
          <el-input v-model="item.userMessage" style="width:312px" disabled></el-input>
        </el-form-item>
        <!-- 项目单位无此 默认参会 -->
        <!-- <el-form-item v-show="item.roleType == '0'" label=" 是否参会 : " prop="status">
          <el-radio-group v-model="item.status" @change="changeGroup(item.status,0)">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- 9-26需求变更 放开 -->
        <el-form-item label=" 是否参会 : " prop="status">
          <el-radio-group v-model="item.status" @change="changeGroup(item.status,0)">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label=" 是否预订房间 : " prop="isMove">
          <el-radio-group v-model="item.isMove" @change="changeGroup(item.isMove,1)">
            <el-radio label="是"></el-radio>
            <el-radio label="否"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="item.status == '是' && item.isMove == '是'" label=" 入住时间 : " required>
          <el-col :span="11">
            <el-form-item prop="moveStartDate">
              <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="item.moveStartDate" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="2" style="text-align: center">
            -
          </el-col>
          <el-col :span="11">
            <el-form-item prop="moveEndDate">
              <el-date-picker value-format="yyyy-MM-dd" type="date" v-model="item.moveEndDate" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item v-if="item.status == '是' && item.isMove == '是'" label=" 预订房间数 : " aria-placeholder="请输入0~100之间的数字" prop="roomNum">
          <el-input v-model="item.roomNum" style="width:312px" type="number" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item v-if="item.status == '是' && item.isMove == '是'" label=" 入住人数 : " aria-placeholder="请输入0~100之间的数字" prop="movePeople">
          <el-input v-model="item.movePeople" style="width:312px" type="number" maxlength="3"></el-input>
        </el-form-item>
        <el-form-item label=" 备注 : ">
          <el-input v-model="item.replyRemark" style="width:312px" type="textarea" :rows="4" maxlength="100" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <template  slot="footer">
        <!--  修改-->
        <div>
          <el-button size='medium' @click="qiandaoClose">取消
          </el-button>
          <!-- 修改确定 -->
          <el-button size='medium' type="primary" @click="onSure('huiyiForm')">确定
          </el-button>
        </div>
      </template>
    </hyModal>
  </div>
</template>
<script>
import { formConfig, columnConfig } from "./meetingTech";
const { searchConfig, searchData } = formConfig;
import {
  getDetailTableData,
  detailTableDownload,
  sendMeetingReplyMessage,
  updateMoveReply
} from "@/api/szhApi/szhMeetReceiptStatisticsTable";
//各种率的正则
const checkTrimRate = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入0~100之间的数字"));
  } else {
    let reg = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入0~100之间的数字"));
    }
  }
};
export default {
  components: {},
  props: {
    expertData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formConfig: searchConfig,
      searchData: this.m_copy(searchData),
      searchObj: { page: 1, rows: 20 },
      ifSearch: true,
      tableData: [],
      column: columnConfig,
      total: 0,
      tableHeight: 0,
      qiandaoShow: false,
      qiandaoTitle: "会议签到",
      selectDatas: [],
      allPageData: {},
      item: {
        userMessage: "",
        status: "",
        isMove: "",
        moveStartDate: "",
        moveEndDate: "",
        roomNum: "1",
        movePeople: "1",
        replyRemark: "",
        roleType: "1"
      },
      itemrules: {
        status: [{ required: true, message: "请选择", trigger: "change" }],
        isMove: [{ required: true, message: "请选择", trigger: "change" }],
        moveStartDate: [
          { required: true, message: "请选择入住时间", trigger: "change" }
        ],
        moveEndDate: [
          { required: true, message: "请选择离开时间", trigger: "change" }
        ],
        roomNum: [
          {
            required: true,
            validator: checkTrimRate,
            trigger: "blur"
          }
        ],
        movePeople: [
          {
            required: true,
            validator: checkTrimRate,
            trigger: "blur"
          }
        ],
        modelTopTitle: [],
        modelTopContent: []
      },
      modelTopTitle: [],
      modelTopContent: []

    };
  },
  created() {
    this.selectDatas = [];
    this.getTableData();
  },
  methods: {
    // 是否参会
    changeGroup(e, i) {
      // console.log(e, i, 111);
      if (e === "否") {
        if (i === 0) {
          this.item.isMove = "否";
        }
        this.item.moveStartDate = "";
        this.item.moveEndDate = "";
        this.item.roomNum = "1";
        this.item.movePeople = "1";
      }
    },
    //弹框关闭
    meetingTechModalClose() {
      this.$emit("meetingTechModalClose");
    },
    //   修改确定
    onSure(e) {
      this.$refs[e].validate(valid => {
        if (valid) {
          let params = {
            meetingId : this.expertData.tdmId,
            professorNumber: this.selectDatas[0].professorNumber,
            status: this.item.status
              ? this.item.status === "是" ? "2" : "1"
              : "1",
            isMove: this.item.isMove
              ? this.item.isMove === "是" ? "1" : "0"
              : "0",
            moveStartDate:
              this.item.status === "是" && this.item.isMove === "是"
                ? this.item.moveStartDate
                : "",
            moveEndDate:
              this.item.status === "是" && this.item.isMove === "是"
                ? this.item.moveEndDate
                : "",
            roomNum:
              this.item.status === "是" && this.item.isMove === "是"
                ? this.item.roomNum
                : "",
            movePeople:
              this.item.status === "是" && this.item.isMove === "是"
                ? this.item.movePeople
                : "",
            replyRemark: this.item.replyRemark,
            roleType: this.item.roleType
          };
          this.m_apiFn(updateMoveReply)(params)
            .then(res => {
              if (res.statusCode === "200") {
                this.$message.success(res.message);
                this.qiandaoClose();
                this.getTableData();
              } else {
                this.$message.warning(res.message);
              }
            })
            .catch();
        } else {
          return false;
        }
      });
    },
    //   修改
    mettingProgrammeClick() {
      // 没勾选报错 1
      // 多勾选报错 1
      // 不是项目单位报错
      // 项目单位未签到弹签到
      // 已签到才弹出来
      if (this.selectDatas.length === 0 || this.selectDatas.length > 1) {
        this.$message.warning(
          `请${this.selectDatas.length === 0 ? "勾选" : "选择"}一条数据`
        );
        return;
      }
      this.qiandaoTitle = "修改回执信息";
      this.item.userMessage =
        this.selectDatas[0].professorNumber +
        "/" +
        this.selectDatas[0].userName;
      if (this.selectDatas[0].status == "0") {
        this.item.status = "是";
        this.item.isMove = "是";
        this.item.moveEndDate = this.expertData.meetingEndDate;
      } else {
        this.item.status = this.selectDatas[0].status == "2" ? "是" : "否";
        this.item.isMove = this.selectDatas[0].isMove == "1" ? "是" : "否";
        this.item.moveEndDate = this.selectDatas[0].moveEndDate
          ? this.selectDatas[0].moveEndDate
          : "";
      }
      this.item.moveStartDate = this.selectDatas[0].moveStartDate
        ? this.selectDatas[0].moveStartDate
        : "";
      this.item.roomNum =
        this.selectDatas[0].roomNum && this.selectDatas[0].roomNum !== "0"
          ? this.selectDatas[0].roomNum
          : "1";
      this.item.movePeople =
        this.selectDatas[0].movePeople && this.selectDatas[0].movePeople !== "0"
          ? this.selectDatas[0].movePeople
          : "1";
      this.item.replyRemark = this.selectDatas[0].replyRemark
        ? this.selectDatas[0].replyRemark
        : null;
      this.item.roleType = this.selectDatas[0].roleType
        ? this.selectDatas[0].roleType == "0" ? "0" : "1"
        : "1";
      if (this.item.roleType === "1") {
        this.item.status = "是";
      }
      this.qiandaoShow = true;
    },
    // 会议签到
    onSubmit() {
      this.qiandaoShow = false;
    },
    // 关闭
    qiandaoClose() {
      this.qiandaoShow = false;
      this.item = {
        userMessage: "",
        status: "",
        isMove: "",
        moveStartDate: "",
        moveEndDate: "",
        roomNum: "",
        movePeople: "",
        replyRemark: "",
        roleType: "1"
      };
    },
    // 短信通知
    signInClick() {
      if (this.selectDatas.length === 0 || this.selectDatas.length > 1) {
        this.$message.warning(
          `请${this.selectDatas.length === 0 ? "勾选" : "选择"}一条数据`
        );
        return;
      }
      this.$confirm(`确认发送会议短信通知吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      })
        .then(() => {
          let params = {};
          params.meetingId  = this.expertData.tdmId;
          let tels = [];
          for (let item of this.selectDatas) {
            tels.push(item.tel);
          }
          params.tels = tels.join();
          let roleType = [];
          for (let item of this.selectDatas) {
            roleType.push(item.roleType);
          }
          params.roleType = roleType.join();
          this.m_apiFn(sendMeetingReplyMessage)(params).then(res => {
            this.$message.success("成功！");
          });
        })
        .catch(() => {
          return;
        });
    },
    //资源包导出
    zybDownloadFile() {
      this.$confirm(
        `是否确认导出${
          this.selectDatas.length > 0 ? "选中" : "当前"
        }会议回执数据?`, "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
        }
      )
        .then(() => {
          let params = this.m_copy(this.searchObj);
          let list = [];
          for (let item of this.selectDatas) {
            list.push(item.professorNumber);
          }
          params.professorNumber = list.join();
          this.m_apiFn(detailTableDownload)(params).then(res => {
            this.$message.success("成功！");
          });
        })
        .catch(() => {
          return;
        });
    },
    //获取列表数据
    getTableData() {
      //       meetingId 	必传	会议ID
      // businessType	必传	业务类型
      // userName		姓名
      // moveStartDate		入住开始时间
      // moveEndDate		入住结束时间
      // status		0未回执1不参会2参会
      // isMove		0否1是
      console.log(this.expertData,'1')
      let params = {};
      params.meetingId  = this.expertData.tdmId;
      params.businessType = this.expertData.businessType;
      this.searchObj = Object.assign({}, this.searchObj, params);
      this.m_apiFn(getDetailTableData)(this.searchObj).then(res => {
        if (res.result && res.result.rows && res.result.rows.length) {
          this.allPageData = res.result;
          this.tableData = res.result.rows.map(item => {
            item.tel = this.m_phoneNumDesensitization(item.tel);
            return item;
          });
          this.total = res.result.total;
          this.modelTopTitle = [
            {
              name: "会议名称",
              value: this.expertData.meetingName
            },
            {
              name: "会议地址",
              value: this.expertData.meetingPlace
            },
            {
              name: "会议时间",
              value:
                this.expertData.meetingStartDate +
                "-" +
                this.expertData.meetingEndDate
            }
          ];
          this.modelTopContent = [
            {
              name: "专家总人数",
              value: this.allPageData.professorTotal
            },
            {
              name: "参会专家数",
              value: this.allPageData.joinProfessorNum
            },
            {
              name: "不参会专家数",
              value: this.allPageData.notJoinProfessorNum
            },
            {
              name: "未回执专家数",
              value: this.allPageData.notReplyProfessorNum
            },
            {
              name: "项目单位数",
              value: this.allPageData.unitNum
            },
            {
              name: "参会单位数",
              value: this.allPageData.unitJoinNum
            },
            {
              name: "预订房间数",
              value: this.allPageData.roomNum
            },
            {
              name: "入住人数",
              value: this.allPageData.peopleNum
            }
          ];
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    //列表多选框改变
    handleSelectionChange(val) {
      this.selectDatas = val;
    },
    //查询列表
    onSearch(e) {
      let params = this.m_copy(e);
      if (params.moveDate && params.moveDate.length) {
        params.moveStartDate = params.moveDate[0];
        params.moveEndDate = params.moveDate[1];
      } else {
        params.moveStartDate = "";
        params.moveEndDate = "";
      }
      delete params.moveDate;
      this.searchObj.page = 1;
      this.searchObj = Object.assign(this.searchObj, params);
      this.getTableData();
    },
    //重置列表
    onReset() {
      this.searchObj.page = 1;
      this.searchData = this.m_copy(searchData);
      this.searchObj = Object.assign({}, this.searchObj, this.searchData, {
        moveStartDate: "",
        moveEndDate: ""
      });
      delete this.searchObj.moveDate;
      this.getTableData();
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
          this.tableHeight = 400;
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
.modelTitle {
  margin-bottom: 10px;
  background: #cccccc47;
  padding: 16px 25px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .modelTitleBlock {
    width: 100%;
    display: flex;
  }
}
.new-buttons {
  display: flex;
  justify-content: flex-end;
  /deep/ div {
    border: 0;
    cursor: pointer;
    font-size: 14px;
    color: #222734;
    transition: color ease 0.5s;

    &:hover {
      color: #298bf5;
    }

    & + div {
      margin-left: 24px;
    }
    i {
      margin-right: 5px;
    }
  }
}
.el-form--inline .el-form-item {
  line-height: 46px;
  margin-right: 18px !important;
  margin-bottom: 0 !important;
}
.newMan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  margin: 10px;
  border-bottom: 1px solid #e3e8e9;
}
</style>