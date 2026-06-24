<template>
  <div>
    <div class="modelTitle">
      <div class="modelTitleBlock">
        <div v-for="(item,index) of modelTopTitle" :key="index">
          <span style="font-weight:700;margin-right: 100px;">{{item.name}}：{{item.value}}</span>
        </div>
      </div>
    </div>
    <div class="total-content_table-content-title" ref="searchRef">
      <hyProjectForm :ifInLine="true" :formConfig="formConfig" :formData="searchData" size="middle" labelPosition="left" :ifSearch="ifSearch" @onSearch="onSearch" :isReset="true" @onReset="onReset">
      </hyProjectForm>
    </div>
    <div class="total-content_table-content-message">
      <div>
        <hyNewButtons :buttonsData="buttonsData" @selectButtons="selectButtons">
        </hyNewButtons>
      </div>
    </div>
    <div class="total-content_table-content-info hy-table_content">
      <hyNewTable :rowKey="'tdmId'" :needSpanMethod="true" :needMergeSpan="needMergeSpan" :needMergeSpanMeet="spanArr" :ifHaveIndex="true" :column="column" v-if="tableHeight" :height="tableHeight" :tableData="tableData" :ifHaveCheckBox="true" @handleSelectionChange="handleSelectionChange" :page="searchObj.page" :pageSize="searchObj.rows">
      </hyNewTable>
      <div class="hy_two_pageBox">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchObj.page" :page-sizes="[20, 40, 60 ,100]" :page-size="searchObj.rows" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!--会议签到-->
    <hyModal :dialogVisible="qiandaoShow" :title="qiandaoTitle" width="50%" @closeHandle="qiandaoClose" :ifThird="true" :modalAppendToBody="true" :appendToBody="true">
      <!-- 选人的时候 -->
      <div v-if="selectDatas.length === 1">
        <hyNewForm ref="formRef" class="form-box" :formConfig='amaFormConfig' :formData='amaFormData' :rules='amaFormRules' ifInLine :labelPosition="'left'" @formSelectchange="formSelectchange">
        </hyNewForm>
      </div>
      <!-- 没选人的时候 -->
      <div v-else>
        <hyNewForm ref="formRef" class="form-box" :formConfig='xqxmFormConfig' :formData='xqxmFormData' :rules='xqxmFormRules' ifInLine :labelPosition="'left'" @formSelectchange="formSelectchange">
        </hyNewForm>
      </div>
      <!-- 选了用户角色以后带出数据 -->
      <div v-if="yhxxObj.id">
        <el-form :model="yhxxObj" label-width="92px" inline>
          <el-form-item label=" 手机号 : ">
            <el-input v-model="yhxxObj.phone" style="width:312px" disabled></el-input>
          </el-form-item>
          <el-form-item label=" 参会角色 : ">
            <el-input v-model="yhxxObj.roleName" style="width:312px" disabled></el-input>
          </el-form-item>
          <el-form-item label=" 所在单位 : ">
            <el-input v-model="yhxxObj.orgName" style="width:312px" disabled></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 用v-for来循环增加或减少 -->
      <div v-if="newManData.length>0">
        <div v-for="(item,index) in newManData" :key="index">
          <div class="newMan">
            <div>
              <i class="iconfont" :class="'iconuser'" style="color:#298BF5"></i>
              其他参会人员
            </div>
            <div>
              <el-button style="width:100px" size='medium' @click="deleteNewMan(item,index)" type="primary">删除
              </el-button>
            </div>
          </div>
          <hyNewForm ref="formRef" class="form-box" :formConfig='xzryFormConfig' :formData='item' :rules='xzryFormRules' ifInLine :labelPosition="'left'">
          </hyNewForm>
        </div>
      </div>
      <template  slot="footer">
        <div v-if="qiandaoShow">
          <el-button size='medium' type="primary" @click="addNewMan" v-if="(yhxxObj.role === '3' || (selectDatas.length && selectDatas[0].role === '3') )">新增会议人员
          </el-button>
          <el-button size='medium' type="info" @click="onCancle" v-else-if="qiandaoTitle === '会议签到'">取消
          </el-button>
          <el-button size='medium' type="primary" @click="onSubmit" v-if="qiandaoTitle === '会议签到'">会议签到
          </el-button>
          <el-button size='medium' type="primary" @click="onSure" v-else>确定
          </el-button>
        </div>
      </template>
    </hyModal>
    <!-- 导入 -->
    <hyNewModal :smallModel="false" v-if="uploadModalShow" :dialogVisible='uploadModalShow' :modalAppendToBody="true" :appendToBody="true" title='导入' :showClose="true" @closeHandle="closeHandle" :ifSure="false" :ifCancle="false" width='450px'>
      <uploadFile :fileName="fileName" :fileList="fileList" @beforeUpload="beforeUpload" @uploadFile="zybBeforeUpload"></uploadFile>
    </hyNewModal>
  </div>
</template>
<script>
import {
  formConfig,
  columnConfig,
  xqxmFormConfig,
  xqxmFormData,
  xqxmFormRules,
  amaFormConfig,
  amaFormData,
  amaFormRules,
  xzryFormConfig,
  xzryFormData,
  xzryFormRules,
  buttonsData
} from "./meetingSignIn";
const { searchConfig, searchData } = formConfig;
import {
  tableDownload,
  getDetailTableData,
  detailTableDownload,
  getKindList,
  querySignSelected,
  addMeetingAutograph,
  queryDeptSignByUserId,
  deleteMeetingAutograph,
  importSignList,
  exportSignList
} from "@/api/meetSignStatisticsTable";
import uploadFile from "@/pages/public/uploadFile.vue";
export default {
  name: "meetingSignIn",
  components: {
    uploadFile
  },
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
      fileName: "",
      files: "",
      fileList: [],
      qiandaoShow: false,
      qiandaoTitle: "会议签到",
      xqxmFormConfig: this.m_copy(xqxmFormConfig),
      xqxmFormData: this.m_copy(xqxmFormData),
      xqxmFormRules: xqxmFormRules,
      amaFormConfig: this.m_copy(amaFormConfig),
      amaFormData: this.m_copy(amaFormData),
      amaFormRules: amaFormRules,
      xzryFormConfig: this.m_copy(xzryFormConfig),
      xzryFormData: this.m_copy(xzryFormData),
      xzryFormRules: xzryFormRules,
      selectDatas: [],
      newManData: [],
      nowDate: "",
      yhxxList: [],
      yhxxObj: {},
      qdList: [],
      spanArr: [],
      position: "",
      needMergeSpan: ["roleName", "userId", "isQdName", "qdDate"],
      num: 0,
      copynewManData: [],
      respData: [],
      buttonsData,
      uploadModalShow: false,
      modelTopTitle: []
    };
  },
  created() {
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
    this.searchData.businessType = this.expertData.businessType; //会议类型
    this.searchData.meetingId = this.expertData.tdmId; //会议id
    //获取今天日期
    let data = new Date();
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    let day = data.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    this.nowDate = year + "-" + month + "-" + day;
    this.searchData.createDate = this.nowDate;
  },
  async mounted() {
    await this.getTableClientHeight();
    await this.init();
  },
  methods: {
    async init() {
      await this.getTableData();
      await this.rowspan();
    },

    //获取列表数据
    async getTableData() {
      await this.m_apiFn(getDetailTableData, {
        ...this.searchData,
        ...this.searchObj
      }).then(res => {
        if (res.result && res.result.rows && res.result.rows.length) {
          const s = new Set();
          let resp = res.result.rows;
          let newList = [];
          resp.forEach(item => s.add(item.userId)); //s中添加不重复userid的值
          let newData = Array.from({ length: s.size }, () => []); //创建指定长度数组并添加值
          resp.forEach(item => {
            let index = [...s].indexOf(item.userId); //找到指定下标
            newData[index].push(item); //添加数据
          });
          newData.forEach((item, index) => {
            if (item.length > 1) {
              newList = item;
            }
          });
          newList.forEach(item => {
            this.num += parseFloat(item.qdNum);
          });
          resp.forEach(item => {
            newList.forEach(ele => {
              if (item.userId === ele.userId) {
                item.qdNum = this.num;
              }
            });
          });

          this.tableData = resp;
          this.total = res.result.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },

    // 操作按钮组
    selectButtons(e) {
      switch (e.text) {
        case "会议签到":
          this.signInClick();
          break;
        case "修改":
          this.mettingProgrammeClick();
          break;
        case "删除":
          this.delTableData();
          break;
        case "导入":
          this.uploadModalShow = true;
          // this.zybBeforeUpload();
          break;
        case "导出":
          this.zybDownloadFile();
          break;
      }
    },

    async rowspan() {
      let contantDoc = 0;
      this.tableData.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1);
        } else {
          if (item.userId === this.tableData[index - 1].userId) {
            this.spanArr[contantDoc] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            contantDoc = index;
          }
        }
      });
    },

    //查询列表
    async onSearch(e) {
      this.searchObj.page = 1;
      this.spanArr = [];
      this.num = 0;
      this.init();
    },
    //重置列表
    async onReset() {
      this.searchObj.page = 1;
      this.searchData = this.m_copy(searchData);
      this.searchData.businessType = this.expertData.businessType; //会议类型
      this.searchData.meetingId = this.expertData.tdmId; //会议id
      this.searchData.createDate = this.nowDate;
      this.num = 0;
      this.spanArr = [];
      this.init();
    },

    // 打开签到
    signInClick() {
      if (this.selectDatas.length > 1) {
        this.$message.warning("请选择一条数据");
        return;
      } else if (
        this.selectDatas.length > 0 &&
        this.selectDatas.length <= 1 &&
        this.selectDatas[0].isQd === "1"
      ) {
        return;
      }
      this.qiandaoTitle = "会议签到";
      this.qiandaoShow = true;
      //call api
      this.xqxmFormData.xqmc = this.expertData.meetingName;

      const params = {
        meetingId: this.expertData.tdmId, //会议id
        isUpdate: "1",
        createDate: this.searchData.createDate,
        businessType: this.expertData.businessType //会议类型
      };
      this.m_apiFn(querySignSelected, params).then(resp => {
        if (resp.result && resp.result.length > 0) {
          this.yhxxList = resp.result;
          for (const iterator of this.xqxmFormConfig) {
            if (iterator.key === "kjxqdl") {
              iterator.options = resp.result;
            }
          }
        }
      });
      if (this.selectDatas.length > 0) {
        this.amaFormData = this.selectDatas[0];
        this.amaFormData.xqmc = this.expertData.meetingName;
        this.amaFormData.kjxqdl = this.selectDatas[0].userName;
      }
    },

    //用户信息下拉change事件
    formSelectchange(e, key) {
      let value = this.yhxxList.filter(item => {
        return item.userId === e;
      });
      this.yhxxObj = value[0];
    },

    // 弹框取消按钮
    onCancle() {
      this.qiandaoShow = false;
      this.yhxxObj = {};
      this.yhxxList = [];
      this.newManData = [];
      this.xqxmFormData.kjxqdl = "";
    },

    // 会议签到
    async onSubmit() {
      if (this.selectDatas.length > 0) {
        if (this.selectDatas[0].isQd === "1") {
          return;
        }
      }
      let obj = {};
      if (this.selectDatas.length > 0 && this.selectDatas[0].role === "3") {
        if (this.$refs.formRef[0]) {
          this.$refs.formRef[0].$refs.form.validate(valid => {
            if (valid) {
              // call api
              obj.userName = this.selectDatas[0].userName;
              obj.orgName = this.selectDatas[0].orgName;
              obj.phone = this.selectDatas[0].phone;
              obj.isZry = this.selectDatas[0].isZry;
              this.newManData.push(obj);
              const params = {
                meetingId: this.expertData.tdmId,
                userId: this.selectDatas[0].userId,
                createDate: this.searchData.createDate,
                list: this.newManData
              };
              this.m_apiFn(addMeetingAutograph, params).then(resp => {
                if (resp.statusCode === "200") {
                  this.$message.success("签到成功");
                  this.qiandaoShow = false;
                  this.yhxxObj = {};
                  this.newManData = [];
                  this.num = 0;
                  this.init();
                }
              });
            } else {
              return false;
            }
          });
        } else if (this.$refs.formRef) {
          this.$refs.formRef.validate(valid => {
            if (valid) {
              return false;
            } else {
              // call api
              obj.userName = this.selectDatas[0].userName;
              obj.orgName = this.selectDatas[0].orgName;
              obj.phone = this.selectDatas[0].phone;
              obj.isZry = this.selectDatas[0].isZry;
              this.newManData.push(obj);
              const params = {
                meetingId: this.expertData.tdmId,
                userId: this.selectDatas[0].userId,
                createDate: this.searchData.createDate,
                list: this.newManData
              };
              this.m_apiFn(addMeetingAutograph, params).then(resp => {
                if (resp.statusCode === "200") {
                  this.$message.success("签到成功");
                  this.qiandaoShow = false;
                  this.yhxxObj = {};
                  this.newManData = [];
                  this.num = 0;
                  this.init();
                }
              });
            }
          });
        }
      } else {
        this.$refs.formRef.validate(valid => {
          if (valid) {
            return false;
          } else {
            if (!this.selectDatas.length) {
              obj.userName = this.yhxxObj.userName;
              obj.orgName = this.yhxxObj.orgName;
              obj.phone = this.yhxxObj.phone;
              obj.isZry = this.yhxxObj.isZry;
              this.qdList.push(obj);
            } else {
              obj.userName = this.selectDatas[0].userName;
              obj.orgName = this.selectDatas[0].orgName;
              obj.phone = this.selectDatas[0].phone;
              obj.isZry = this.selectDatas[0].isZry;
              this.qdList.push(obj);
            }
            // call api
            const params = {
              meetingId: this.expertData.tdmId,
              userId: this.selectDatas[0].userId,
              createDate: this.searchData.createDate,
              list: this.qdList
            };
            this.m_apiFn(addMeetingAutograph, params).then(resp => {
              if (resp.statusCode === "200") {
                this.$message.success("签到成功");
                this.qiandaoShow = false;
                this.yhxxObj = {};
                this.num = 0;
                this.newManData = [];
                this.init();
              }
            });
          }
        });
      }
    },
    //   新增会议人员
    addNewMan() {
      this.newManData.push({
        userName: "",
        orgName: "",
        phone: "",
        isZry: "1"
      });
      this.xzryFormConfig = this.m_copy(xzryFormConfig);
      this.xzryFormData = this.m_copy(xzryFormData);
    },
    // 删除会议人员
    deleteNewMan(e, i) {
      this.newManData.splice(i, 1);
    },
    //   修改
    mettingProgrammeClick() {
      this.newManData = [];
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
      } else if (this.selectDatas[0].role !== "3") {
        this.$message.warning("当前角色不可以修改签到信息");
        return;
      }
      // call api
      const params = {
        meetingId: this.expertData.tdmId, //会议id
        userId: this.selectDatas[0].userId,
        createDate: this.searchData.createDate,
        businessType: this.expertData.businessType //会议类型
      };
      this.m_apiFn(queryDeptSignByUserId, params).then(resp => {
        if (resp.result && resp.result.length > 0) {
          this.newManData = resp.result.filter(item => {
            return item.isZry !== "0";
          });
          this.zryData = resp.result.filter(item => {
            return item.isZry === "0";
          });
          this.amaFormData.xqmc = this.expertData.meetingName;
          this.amaFormData.kjxqdl = this.zryData[0].userName;
          this.amaFormData.phone = this.zryData[0].phone;
          this.amaFormData.roleName = this.zryData[0].roleName;
          this.amaFormData.orgName = this.zryData[0].orgName;
          this.copynewManData = this.newManData.map(item => {
            return {
              isZry: item.isZry,
              orgName: item.orgName,
              phone: item.phone,
              userName: item.userName
            };
          });
        }
      });
      this.qiandaoTitle = "修改会议签到";
      this.qiandaoShow = true;

      let obj = {};
      obj.userName = this.selectDatas[0].userName;
      obj.orgName = this.selectDatas[0].orgName;
      obj.phone = this.selectDatas[0].phone;
      obj.isZry = this.selectDatas[0].isZry;

      this.qdList.push(obj);
    },

    // 确定修改
    onSure() {
      const params = {
        meetingId: this.expertData.tdmId,
        userId: this.selectDatas[0].userId,
        createDate: this.searchData.createDate,
        list: this.zryData.concat(this.newManData)
      };
      // call api
      this.m_apiFn(addMeetingAutograph, params).then(resp => {
        if (resp.statusCode === "200") {
          this.$message.success(resp.message);
          this.qiandaoShow = false;
          this.yhxxObj = {};
          this.num = 0;
          this.newManData = [];
          this.spanArr = [];
          this.init();
        }
      });
    },

    //弹框关闭
    meetingSignInModalClose() {
      this.$emit("meetingSignInModalClose");
    },
    //   会议签到 修改同级的那个删除
    delTableData() {
      // 只能删除陪同人员签到信息
      // 无勾选报错
      // 全部为陪同参会人员
      // 确定后弹出确认按钮

      if (!this.selectDatas.length) {
        this.$message.warning("请勾选一条数据");
        return;
      }
      // 确认是否全部为陪同参会人员 isZry:1 可以删
      let deleList = this.selectDatas.filter(item =>
        this.selectDatas.every(ele => {
          if (ele.isZry === "1") {
            return item;
          }
        })
      );
      if (deleList && deleList.length > 0) {
        this.$confirm("确认删除？", "提示", {
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          type: "",
          iconClass: "el-icon-bell",
          center: true,
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
        })
          .then(() => {
            // call api
            const params = {
              ids: deleList.map(item => {
                return item.id;
              })
            };
            this.m_apiFn(deleteMeetingAutograph, params).then(resp => {
              if (resp.statusCode === "200") {
                this.$message.success(resp.message);
                this.spanArr = [];
                this.num = 0;
                this.init();
              } else {
                this.$message.warning(resp.message);
                return;
              }
            });
          })
          .catch(() => {});
      } else {
        this.$message.warning("不能删除评审专家和项目单位数据！");
        return;
      }
    },

    // 关闭
    qiandaoClose() {
      this.newManData = [];
      this.qiandaoShow = false;
    },

    //会议签到导出
    zybDownloadFile() {
      let params = {};
      if (this.selectDatas.length > 0) {
        params.ids = this.selectDatas.map(item => {
          return item.id;
        });
        params.meetingId = this.searchData.meetingId;
        params.role = this.searchData.role;
        params.userId = this.searchData.userId;
        params.userName = this.searchData.userName;
        params.type = this.searchData.type;
        params.createDate = this.searchData.createDate;
        params.businessType = this.searchData.businessType;
      } else {
        params.meetingId = this.searchData.meetingId;
        params.role = this.searchData.role;
        params.userId = this.searchData.userId;
        params.userName = this.searchData.userName;
        params.type = this.searchData.type;
        params.createDate = this.searchData.createDate;
        params.businessType = this.searchData.businessType;
        params.ids = [];
      }
      this.m_apiFn(exportSignList, params).then(res => {
        if (res.statusCode === "200") {
        }
      });
    },

    //列表多选框改变
    handleSelectionChange(val) {
      this.selectDatas = val;
    },

    //上传弹框关闭
    closeHandle() {
      this.files = "";
      this.fileName = "";
      this.uploadModalShow = false;
    },
    //导入
    beforeUpload(e) {
      this.files = e;
      this.fileName = e.name.split(".")[0];
    },

    zybBeforeUpload() {
      const fileData = new FormData();
      fileData.append("files", this.files);
      fileData.append("meetingId", this.expertData.tdmId);
      this.m_apiFn(importSignList, fileData).then(res => {
        if (res.statusCode === "200") {
          this.$message.success(res.message);
          this.$nextTick(() => {
            this.num = 0;
            this.init();
          });
        } else {
          this.$message.warning(res.message);
        }
      });
    },

    // 页面显示行数变化
    handleSizeChange(e) {
      this.searchObj.page = 1;
      this.searchObj.rows = e;
      this.num = 0;
      this.init();
    },

    // 显示页数变化
    handleCurrentChange(e) {
      this.searchObj.page = e;
      this.num = 0;
      this.init();
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
          this.tableHeight = 500;
        }
      });
    }
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