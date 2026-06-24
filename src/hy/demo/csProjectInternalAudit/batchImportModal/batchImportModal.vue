<template>
  <hyNewModal
    width="70%"
    v-if="batchImportModelShow"
    :dialogVisible="batchImportModelShow"
    title="批量上传"
    :showClose="true"
    @closeHandle="batchImportModelClose"
    :ifSure="false"
    :ifCancle="false"
    :ifThird="true"
  >
    <div class="state-box2">
      <div
        v-for="(item, index) in batchImportStateList"
        :key="index"
        class="state"
      >
        <div class="state-item">
          <i v-if="item.status == '1'" class="icon iconfont iconwancheng"></i>
          <i
            v-if="item.status == '2'"
            class="icon iconfont iconjinhangzhong"
          ></i>
          <i v-if="item.status == '0'" class="icon iconfont iconweikaishi"></i>
          <span class="text">{{ item.name }}</span>
        </div>
        <div
          v-if="index != batchImportStateList.length - 1"
          class="wire"
          :style="{
            backgroundColor: item.status == '1' ? '#5aad7a' : '#dedee0',
          }"
        ></div>
      </div>
    </div>
    <div class="importBlock" v-if="fileStep === 1">
      <div style="width: 100%; display: flex; justify-content: flex-end">
        <el-upload
          class="uploadBtn"
          ref="upload"
          action=""
          :show-file-list="false"
          :file-list="batchImportFileList"
          :auto-upload="false"
          :before-upload="batchImportBeforeUpload"
          :on-change="batchHandleChange"
          multiple
        >
          <el-button type="primary" size="small" slot="trigger"
            >上传文件</el-button
          >
        </el-upload>
        <el-button
          type="primary"
          style="margin-left: 10px"
          size="small"
          slot="trigger"
          @click="confirmUpload"
          >开始上传</el-button
        >
      </div>
      <div class="importBody" v-if="batchImportFileList.length === 0">
        <div class="importContent">
          <div>
            <i
              style="font-size: 50px"
              class="icon iconfont iconcailiaoshangchuan"
            ></i>
          </div>
          <div>点击上传文件按钮打开文件夹上传</div>
          <div>上传的文件格式{{ fileType }}<b>规则说明</b></div>
          <div>单个文件大小不超过500MB</div>
        </div>
      </div>
      <div>
        <dir
          class="filsListBlock"
          v-for="(item, index) in batchImportFileList"
          :key="index"
        >
          <div class="fileListIcon">
            <i
              style="font-size: 50px"
              class="icon iconfont iconcailiaoshangchuan"
            ></i>
          </div>
          <div class="fileListBody">
            <div class="fileListBodyClose">
              <div
                :style="{
                  color:
                    item.stateName === '正在上传'
                      ? '#409eff'
                      : item.stateName === '解析成功'
                      ? '#67C23A'
                      : '#F56C6C',
                }"
              >
                {{ item.stateName }}
                <span
                  style="display: inline-block"
                  v-if="item.stateName === '解析失败'"
                  >({{ item.stateReason }})</span
                >
              </div>
              <div style="margin-left: 8px">
                <i
                  style="cursor: pointer; font-size: 16px"
                  class="el-icon-circle-close"
                  @click="delFileList(item, index)"
                ></i>
              </div>
            </div>
            <div>
              <div>{{ item.name }}</div>
              <div>
                <el-progress :percentage="item.progressNum"></el-progress>
              </div>
            </div>
          </div>
        </dir>
      </div>
    </div>
    <div class="importBlock" v-if="fileStep === 2 || fileStep === 3">
      <div>
        <dir
          class="filsListBlock"
          v-for="(item, index) in batchImportFileList"
          :key="index"
        >
          <div class="fileListIcon">
            <i
              style="font-size: 50px"
              class="icon iconfont iconcailiaoshangchuan"
            ></i>
          </div>
          <div class="fileListBody">
            <div class="fileListBodyClose">
              <div
                :style="{
                  color:
                    item.stateName === '正在上传'
                      ? '#409eff'
                      : item.stateName === '解析成功'
                      ? '#67C23A'
                      : '#F56C6C',
                }"
              >
                {{ item.stateName }}
                <span
                  style="display: inline-block"
                  v-if="item.stateName === '解析失败'"
                  >({{ item.stateReason }})</span
                >
              </div>
              <div style="margin-left: 8px">
                <i
                  style="cursor: pointer; font-size: 16px"
                  class="el-icon-circle-close"
                  @click="delFileList(item, index)"
                ></i>
              </div>
            </div>
            <div>
              <div>{{ item.name }}</div>
              <div>
                <el-progress :percentage="item.progressNum"></el-progress>
              </div>
            </div>
          </div>
        </dir>
      </div>
    </div>
    <template slot="footer">
      <!-- <el-button size="medium" @click="onCancle">下一步</el-button> -->
      <el-button
        v-if="
          batchImportFileList.filter(
            (item) => item.stateName === '解析失败' || !item.stateName
          ).length === 0 &&
          this.nextBtnShow &&
          this.fileStep === 1
        "
        type="primary"
        size="medium"
        @click="batchImportNext"
        >下一步</el-button
      >
      <el-button
        v-if="this.fileStep === 2"
        type="primary"
        size="medium"
        @click="batchImportNext2"
        >后台匹配</el-button
      >
      <el-button
        v-if="this.fileStep === 3"
        size="medium"
        @click="batchImportModelClose"
        >完成</el-button
      >
      <el-button
        v-if="this.fileStep === 3"
        type="primary"
        size="medium"
        @click="batchImportNext3"
        >查看详情</el-button
      >
    </template>

    <!-- 上传详情弹窗 -->
    <hyModal
      :modalTop="'20px'"
      :showClose="true"
      v-if="reviewRecordModalShow"
      :dialogVisible="reviewRecordModalShow"
      :title="'上传详情'"
      @closeHandle="reviewRecordModalShow=false"
      :ifSure="false"
      :ifCancle="false"
      width="80%"
      :modalAppendToBody="true"
      :appendToBody="true"
    >
      <batchImportDetail
        @reviewRecordOnCancle="reviewRecordModalShow=false"
        @batchRowData="batchRowData"
        :businessType="businessType"
        :projectType="projectType"
      ></batchImportDetail>
    </hyModal>
  </hyNewModal>
</template>
<script>
import {
  queryDictTree,
} from "@/api/common.js";
import { getScores } from "@/api/reviewSummary";
import batchImportDetail from "./batchImportDetail.vue";
export default {
  name: "batchImportModal", // 批量上传
  props: {
    businessType: {
      type: String,
      default: "BUSINESSTYPE_CS"
    },
    projectType: {
      type: String,
      default: () => "PROJECTTYPE_XXH"
    },
    batchImportModelShow: {
      type: Boolean,
      default: false,
    },
    batchRowData: {
      type: Object,
      default: {},
    },
  },
  components: {
    batchImportDetail,
  },
  data() {
    return {
      //批量上传弹框
      fileStep: 1,
      batchImportStateList: [
        { name: "上传材料", status: "2" },
        { name: "材料匹配上传", status: "0" },
        { name: "上传详情", status: "0" },
      ],
      fileType:
        "zip,pdf,ipg,png,gif,bmp,tif,jpeg,doc,docx,mps,mptdot,dotx,docm,txt,xls,xlsx,et,ett,xlt,xlsm,xltx,xtm,ppt,ptx,dpx,dpt,pps,pot,rar",
      batchImportFileList: [],
      timer: null,
      num: 0,
      nextBtnShow: false,
      //[评审记录弹窗]
      reviewRecordModalShow: false,
    };
  },
  created() {},
  mounted() {
    this.getDict('UPLOAD_FILE_FORMAT')
  },
  methods: {
    //获取文字
    getDict(dataVal) {
      this.m_apiFn(queryDictTree)(dataVal).then(resp => {
        if( dataVal == 'UPLOAD_FILE_FORMAT' ){
          if (resp.result && resp.result.length > 0) {
            this.fileType = resp.result.map( item => item.dataVal ).toString()
          }
        }
      })

    },
    //上传文件
    batchImportBeforeUpload(e) {
      return;
    },
    fileListReset() {
      //重置文件列表
      for (let item of this.batchImportFileList) {
        this.$set(item, "progressNum", 0);
        this.$set(item, "stateName", "");
        this.$set(item, "stateReason", "");
      }
    },
    //删除文件
    delFileList(item, index) {
      this.batchImportFileList.splice(index, 1);
      this.fileListReset();
    },
    batchHandleChange(file, fileList) {
      console.log("1111111111");
      this.batchImportFileList = fileList;
      this.fileListReset();
    },

    confirmUpload() {
      if (!this.batchImportFileList.length) {
        this.$message.warning("请先上传文件");
        return;
      }
      this.nextBtnShow = false;
      this.fileListReset();
      this.num = 0;
      this.timer = setInterval(() => {
        this.num++;
        this.getProgressValue();
      }, 360);
    },

    getProgressValue() {
      for (let item of this.batchImportFileList) {
        item.stateName = "正在上传";
        if (
          this.fileType.includes(
            item.name.substring(item.name.lastIndexOf(".") + 1)
          )
        ) {
          if (item.progressNum < 70) {
            item.progressNum += Number(Math.floor(Math.random() * 30) + 1);
          }
        } else {
          if (item.progressNum < 50) {
            item.progressNum += Number(Math.floor(Math.random() * 10) + 1);
          }
        }
      }
      //定时器结束的一次
      if (this.num >= this.batchImportFileList.length) {
        let maxCapacity = 512000;
        let fileCapacity = 0;
        this.batchImportFileList.forEach((item, index) => {
          if (
            this.fileType.includes(
              item.name.substring(item.name.lastIndexOf(".") + 1)
            )
          ) {
            item.progressNum = 100;
            item.stateName = "解析成功";
          } else {
            item.stateName = "解析失败";
            item.stateReason = "文件格式错误";
          }
          if (item.stateName === "解析成功") {
            fileCapacity += Number(item.size);
            fileCapacity = fileCapacity / 1024;
          }
          if (fileCapacity > maxCapacity) {
            item.progressNum = 0;
            item.stateName = "解析失败";
            item.stateReason = "总文件大小超出限制";
          }
        });
        this.nextBtnShow = true;
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = null;
      }

      console.log(this.batchImportFileList, this.num);
    },

    //批量上传下一步
    batchImportNext() {
      this.fileStep = 2;
      this.batchImportStateList = [
        { name: "上传材料", status: "1" },
        { name: "材料匹配上传", status: "2" },
        { name: "上传详情", status: "0" },
      ];
      if (this.timer) {
        clearInterval(this.timer);
        window.clearInterval(this.timer);
      }
      this.timer = null;
    },
    //后台匹配(第二步)
    batchImportNext2() {
      this.batchImportStateList = [
        { name: "上传材料", status: "1" },
        { name: "材料匹配上传", status: "1" },
        { name: "上传详情", status: "2" },
      ];
      this.fileStep = 3;
    },
    //查看详情(第三步)
    batchImportNext3() {
      this.reviewRecordModalShow=true
    },
    batchImportModelClose() {
      this.fileStep = 1;
      this.nextBtnShow = false;
      (this.batchImportStateList = [
        { name: "上传材料", status: "2" },
        { name: "材料匹配上传", status: "0" },
        { name: "上传详情", status: "0" },
      ]),
        (this.batchImportFileList = []);
      this.$emit("batchImportModelClose");
    },

    //批量报送
    batchSubmit(item) {},
  },
};
</script>
<style scoped lang="less" >
.state-box2 {
  width: 97%;
  height: 50px;
  display: flex;
  align-items: center;
  // position: absolute;
  // top: 35px;
  // left: 16px;
  justify-content: center;
  margin: 12px 0;
  .state {
    display: flex;
    align-items: center;
    .state-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 35px;
      .text {
        font-size: 15px;
        color: #222734;
        margin-top: 4px;
        height: 17px;
        line-height: 17px;
      }
      i {
        font-size: 22px;
        margin-right: 5px;
        transform: scale(1);
        transition: all 1s;
        top: 2px;
        position: relative;
      }
      .iconwancheng {
        color: #5aad7a;
      }
      .iconjinhangzhong {
        color: #ffb100;
      }
      .iconweikaishi {
        color: #dedee0;
        background-color: white;
        border-radius: 100%;
        padding: 0 !important;
      }
      .el-icon-circle-close {
        color: #ed6565;
      }
    }
    .state-item:hover i {
      transform: scale(1.2);
      transition: all 1s;
    }
    .wire {
      width: 150px;
      height: 2px;
      margin: 3px 10px 0;
    }
  }
}

.importBlock {
  border-radius: 5px;
  border: 1px solid #ccc;
  padding: 15px;
  margin: 5px;
  box-sizing: border-box;
  width: 100%;
  .importBody {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    .importContent {
      line-height: 45px;
      width: 50%;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
    }
  }
  .filsListBlock {
    box-sizing: border-box;
    width: 100%;
    margin: 12px 0;
    padding: 5px 9px;
    border-radius: 3px;
    border: 1px solid #409eff;
    display: flex;
    .fileListIcon {
      border-right: 1px solid #1874d7;
    }
    .fileListBody {
      width: calc(100% - 80px);
      padding: 0 15px;
      box-sizing: border-box;
      .fileListBodyClose {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>