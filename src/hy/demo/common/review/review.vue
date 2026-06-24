<template>
  <section>
    <!-- 信息 -->
    <div class="info-box">
      <!-- 左边 -->
      <div class="left-box">
        <div class="left-box-item" v-for="(item, i) in leftList" :key="i">
          <div class="item-title-box">
            <div class="item-title">{{ item.text }}</div>
            <el-button v-if="i === 0" type="primary" size="small" @click.stop="download">下载</el-button>
          </div>
          <el-checkbox-group class="item-children-box" v-model="fileCheckList">
            <div class="children-item" v-for="(sub, j) in item.children" :key="j">
              <div class="children-title-box">
                <div class="children-title-sign" v-if="sub.sfbx === '01'">*</div>
                <div class="children-title">{{ sub.text }}</div>
              </div>
              <div class="file-box" v-for="(iteration, k) in sub.children" :key="k">
                <div class="file-name-box">
                  <el-checkbox :label="iteration"></el-checkbox>
                  <i class="el-icon-document file-icon"></i>
                  <div class="file-name" @dblclick="fileHandleDbClick(iteration)">{{ iteration.text }}</div>
                </div>
                <div class="upload-icon">
                  <i class="el-icon-download" @click.stop="downloadFile(iteration)"></i>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 分割线 -->
      <div class="divide"></div>
      <!-- 右边 -->
      <div class="right-box">
        <div class="schedule-box" v-if="role === 'zz'">
          <div class="schedule-hint-box">
            <div class="schedule-title">{{ scheduleTitle }}</div>
            <div class="schedule-hint">
              <div class="one"></div>
              <div class="text">完成评审</div>
              <div class="two"></div>
              <div class="text">未完成评审</div>
            </div>
          </div>
          <div class="person-box">
            <div v-for="(item, index) in personList" :key="index" :style="{'color': item.status === 1 ? '#5aad7a' : '#222734' }">{{ item.userName }}</div>
          </div>
        </div>
        <div class="opinion-box">
          <div class="opinion-top">
            <div class="title">{{ opinionTitle }}</div>
            <el-button v-if="reviewType === '1'" type="primary" size="small" @click.stop="editOpinion">专家修改意见</el-button>
          </div>
          <div class="opinion-bottom">
            <div class="opinion-bottom-item" v-for="(item, i) in opinions" :key="i">
              <div class="title-box">
                <i class="el-icon-caret-bottom"></i>
                <div>{{ item.title }}</div>
              </div>
              <div class="option-list-box">
                <div class="list-item" :class="{'row-dark': j % 2 === 0}" v-for="(sub, j) in item.list" :key="j">
                  <div class="item-name">{{ sub.name }}</div>
                  <div class="item-option">{{ sub.psyj }}</div>
                </div>
              </div>
              <div class="summary">意见汇总</div>
              <el-input type="textarea" v-model="item.opinion"></el-input>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 按钮 -->
    <div class="btn-box">
      <hyButtons :buttonsData="buttonsConfig" @selectButtons="selectButtons"></hyButtons>
    </div>
  </section>
</template>
<script>
import { buttonsConfig, zzBtnConfig } from "./config.js";
import { getUserRole } from "@/api/requirementReview";
import {
  getCommonCltjbTree,
  downloadFile,
  downloadFiles
} from "@/api/common.js";
export default {
  name: "review", // 评审

  /**
   * @param fileListApiFn 文件接口
   * @param scheduleApiFn 进度接口
   * @param opinionsApiFn 意见接口
   * @param role 角色——专家：zj，组长：zz
   * @param rowData 行数据
   * @param scheduleTitle 进度标题
   * @param opinionTitle 意见标题
   */
  data() {
    return {
      result: {}
    };
  },

  /**
   * @param clblx IPHONEDIY_SB：申报材料，IPHONEDIY_SK：收口材料，IPHONEDIY_GZSK：盖章收口材料
   * @param reviewType 0是专家评审 1是收口审核
   */
  props: {
    fileListApiFn: {
      type: Function,
      default: () => null
    },
    scheduleApiFn: {
      type: Function,
      default: () => null
    },
    opinionsApiFn: {
      type: Function,
      default: () => null
    },
    role: {
      type: String,
      default: () => ""
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    scheduleTitle: {
      type: String,
      default: () => "进度"
    },
    opinionTitle: {
      type: String,
      default: () => "意见"
    },
    reviewData: {
      type: Object,
      default: () => {}
    },
    clblx: {
      type: String,
      default: () => ""
    },
    reviewType: {
      type: String,
      default: () => "0"
    }
  },

  data() {
    return {
      buttonsConfig:
        this.reviewType === "1" && this.role === "zz"
          ? zzBtnConfig
          : buttonsConfig,
      fileCheckList: [],
      leftList: [],
      personList: [],
      opinions: []
    };
  },
  created() {
    this.initData();
    this._getCltjbTree();
  },

  methods: {
   async _getCltjbTree() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY",
        clblx: this.clblx,
        professionalType: this.professionalType,
        projectClassify:this.rowData.projectClassify,
        // projectClassify: "ZXSJ",
        xmbh: this.rowData.xmbh
      };
      let res=await this.m_apiFn(getCommonCltjbTree)(param)
          if (res && res.result) {
            this.leftList = res.result;
          }
    },

    fileHandleDbClick(data) {
      this.m_pageoffice(data, false, this.professionalType, this.rowData.xmbh, this.clblx);
    },

    // 获取意见
   async initData() {
      // console.log(this.reviewData);
      let param = {};
      param.xmbh = this.reviewData.xmbh;
      param.sfzz = this.reviewData.sfzz;
      param.xmlx = "PROJECTTYPE_XXH";
      param.ywlx = "BUSINESSTYPE_KY";
      param.type = this.reviewType;
      let res1=await this.m_apiFn(this.scheduleApiFn)(param)
          if (res1) {
            this.personList = res1.result;
          }
     let res2=await this.m_apiFn(getUserRole)(param)
          this.reviewData.opinionType = res2.result;
          let res=await this.m_apiFn(this.opinionsApiFn)(param)
              if (res.result) {
                this.result = res.result;
                if (res.result.sfzz === "1" || res.result.sfzz === "2") {
                  // console.log(this.reviewData);
                  this.opinions = [
                    {
                      title: "技术专家意见",
                      list: res.result.jszs,
                      opinion: res.result.jsz
                    },
                    {
                      title: "技经专家意见",
                      list: res.result.jjzs,
                      opinion: res.result.jjz
                    },
                    {
                      title: "财务专家意见",
                      list: res.result.cwzs,
                      opinion: res.result.cwz
                    }
                  ];
                } else {
                  switch (this.reviewData.opinionType) {
                    case "0":
                      this.opinions = [
                        {
                          title: "技术专家意见",
                          list: res.result.jszs,
                          opinion: res.result.jsz,
                          opinionType: this.reviewData.opinionType
                        }
                      ];
                      break;
                    case "1":
                      this.opinions = [
                        {
                          title: "财务专家意见",
                          list: res.result.cwzs,
                          opinion: res.result.cwz,
                          opinionType: this.reviewData.opinionType
                        }
                      ];
                      break;
                    case "2":
                      this.opinions = [
                        {
                          title: "技经专家意见",
                          list: res.result.jjzs,
                          opinion: res.result.jjz,
                          opinionType: this.reviewData.opinionType
                        }
                      ];
                      break;
                  }
                }
              }
              this.opinions = [...this.opinions];
              // console.log(this.opinions, 11);
    },

    // 批量下载
   async download() {
      // console.log(this.fileCheckList);
      this.$emit("download", this.fileCheckList);

      if (this.fileCheckList.length === 0) {
        this.$message.warning("请选择文件");
        return false;
      }
      let clids = [];
      for (const iterator of this.fileCheckList) {
        clids.push(iterator.id);
      }
    let res=await this.m_apiFn(downloadFiles)({
        clids: clids,
        xmbh: this.rowData.xmbh,
        clblx: this.clblx
      })
    },

    // 单个文件下载
   async downloadFile(row) {
      this.$emit("singleFileDownload", row);
    let res=await this.m_apiFn(downloadFile)({ clid: row.id })
    },

    // 专家修改意见
    editOpinion() {
      this.$emit("editOpinion", this.rowData);
    },

    selectButtons({ id }) {
      let commitData = {};
      commitData = this.result;
      if (this.role === "zz") {
        commitData.jsz = this.opinions[0].opinion;
        commitData.jszs = this.opinions[0].list;
        commitData.jjz = this.opinions[1].opinion;
        commitData.jjzs = this.opinions[1].list;
        commitData.cwz = this.opinions[2].opinion;
        commitData.cwzs = this.opinions[2].list;
      } else {
        switch (this.reviewData.opinionType) {
          case "0":
            commitData.psyj = this.opinions[0].opinion;
            commitData.jszs = this.opinions[0].list;
            break;
          case "1":
            commitData.psyj = this.opinions[0].opinion;
            commitData.cwzs = this.opinions[0].list;
            break;
          case "2":
            commitData.psyj = this.opinions[0].opinion;
            commitData.jjzs = this.opinions[0].list;
            break;
        }
      }
      commitData.type = this.reviewType;
      this.$emit("selectButtons", id, commitData);
    }
  }
};
</script>
<style lang="less" scoped>
@import "./review.less";
</style>
