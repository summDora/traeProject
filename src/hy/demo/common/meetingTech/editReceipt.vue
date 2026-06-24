<template>
      <!--会议回执-->
    <hyModal :dialogVisible="dialogVisible" :title="title" :width="'900px'" :ifThird="true" @closeHandle="qiandaoClose">
      <!-- 选人的时候 -->
      <el-form :model="item" label-width="120px" :rules="itemrules" ref="huiyiForm">
        <el-form-item label=" 会议名称 : ">
          <el-input v-model="item.meetingName" style="width:100%" disabled></el-input>
        </el-form-item>
        <el-form-item label=" 用户信息 : ">
          <el-input v-model="item.userMessage" style="width:100%" disabled></el-input>
        </el-form-item>
        <!-- 项目单位无此 默认参会 -->
        <el-form-item v-show="item.roleType == '0'" label=" 是否参会 : " prop="status">
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
              <el-date-picker prop value-format="yyyy-MM-dd" type="date" v-model="item.moveStartDate" style="width:100%"></el-date-picker>
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
        <el-row>
          <el-col :span="12">
            <el-form-item v-if="item.status == '是' && item.isMove == '是'" label=" 预订房间数 : " aria-placeholder="请输入不大于三位数的整数" prop="roomNum">
              <el-input-number v-model="item.roomNum" style="width:100%" :min="1" :max="999" :step="1" :precision="0" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="item.status == '是' && item.isMove == '是'" label=" 入住人数 : " aria-placeholder="请输入不大于三位数的整数" prop="movePeople">
              <el-input-number v-model="item.movePeople"  style="width:100%" :min="1" :max="999" :step="1" :precision="0" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        
      
        <el-form-item label=" 备注 : " >
          <el-input v-model="item.replyRemark" type="textarea"  :rows="4" maxlength="100" show-word-limit></el-input>
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
</template>
<script>
import {
  getDetailTableData,
  detailTableDownload,
  sendMeetingReplyMessage,
  updateMoveReply
} from "@/api/szhApi/szhMeetReceiptStatisticsTable";

import { meetingReplyDetail } from "@/api/szhApi/haveMeals";
//数字加后两位且非无法选中
const checkTrimAll = (rule, value, callback) => {
  if (!value) {
    callback(new Error("请输入数字且小数点不大于两位"));
  } else {
    let reg = /^[+-]?(0|([1-9]\d*))(\.\d{0,2})?$/g;
    if (reg.test(value)) {
      callback();
    } else {
      callback(new Error("请输入数字且小数点不大于两位"));
    }
  }
};
export default {
  components: {},
  props: {
    rowData: {
      type: Object,
      default: () => {}
    },
    dialogVisible: {
      required: true,
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      item: {
        meetingName:"",
        userMessage: "",
        status: "是",
        isMove: "是",
        moveStartDate: "",
        moveEndDate: "",
        roomNum: "",
        movePeople: "",
        replyRemark: "",
        roleType: "0"
      },
      title:"会议回执",
      itemrules: {
        status: [{ required: true, message: "请选择", trigger: "change" }],
        isMove: [{ required: true, message: "请选择", trigger: "change" }],
        moveStartDate: [{ required: true, message: "请选择入住时间", trigger: "change" }],
        moveEndDate: [
          { required: true, message: "请选择离开时间", trigger: "change" },

          ],
        roomNum: [{required: true,validator: checkTrimAll,trigger: "blur"}],
        movePeople: [{required: true,validator: checkTrimAll,trigger: "blur"}]
      }
    };
  },
  created() {
    // this.item.moveEndDate=/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.rowData.meetingEndDate)
    this.item.moveEndDate=/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.rowData.meetingEndDate)[0]
    this.item.meetingName=this.rowData.meetingName
    this.getMeetingData();
  },
  methods: {
    getMeetingData(){
     
      let params = {};
      params.meetingId  = this.rowData.tdmId;
      // this.searchObj = Object.assign({}, this.searchObj, params);
      this.m_apiFn(meetingReplyDetail)(params).then(res => {
        if (res.result) {
          this.fromData=res.result
          this.mettingProgrammeClick()
        } 
      });
    },
    // 是否参会
    changeGroup(e, i) {
      if (e === "否") {
        if (i === 0) {
          this.item.isMove = "否";
        }
        this.item.moveStartDate = "";
        this.item.moveEndDate = "";
        this.item.roomNum = "";
        this.item.movePeople = "";
      }
    },
    //   修改确定
    onSure(e) {
      this.$refs[e].validate(valid => {
        if (valid) {
          let params = {
            meetingId: this.rowData.tdmId,
            professorNumber: this.fromData.professorNumber,
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
                this.qiandaoClose("onSure");
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
      if(!this.fromData.isMove){
        this.title = "修改回执信息";
      }
      this.item.userMessage =
        this.fromData.professorNumber +
        "/" +
        this.fromData.userName;

      this.item.status = (this.fromData.status == "2" ||!this.fromData.status)? "是" : "否";
      this.item.isMove =(this.fromData.isMove == "1"||this.fromData.isMove == "") ? "是" : "否";
      this.item.moveStartDate = this.fromData.moveStartDate
        ? this.fromData.moveStartDate
        : "";
      this.item.moveEndDate = this.fromData.moveEndDate
        ? this.fromData.moveEndDate
        : this.item.moveEndDate ;
      this.item.roomNum = this.fromData.roomNum
        ? this.fromData.roomNum
        : null;
      this.item.movePeople = this.fromData.movePeople
        ? this.fromData.movePeople
        : null;
      this.item.replyRemark = this.fromData.replyRemark
        ? this.fromData.replyRemark
        : null;
      this.item.roleType = this.fromData.roleType
        ? this.fromData.roleType == "0" ? "0" : "1"
        : "0";
      if (this.item.roleType === "1") {
        this.item.status = "是";
      }

    },
    // 会议签到
    onSubmit() {
      this.qiandaoShow = false;
    },
    // 关闭
    qiandaoClose(val) {
      this.$emit("closeHandle", val);
    },
  },
  mounted() {

  }
};
</script>
<style lang="less" scoped>
.minuTitle {
  background-color: #e3e8e9;
  height: 80px;
  margin-top: -20px;
  display: flex;
  flex-direction: column;
  .minuTitle-oneHang {
    display: flex;
    align-items: center;
    justify-content: space-around;
    font-size: 16px;
    font-weight: bold;
    margin: 10px;
  }
  .minuTitle-twoHang {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px;
  }
}
.newButtons {
  display: flex;
  justify-content: flex-end;
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