<template>
  <hyNewModal :dialogVisible="dialogVisible" :showClose="true" :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" :width="width" @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
    <div class="project-content">
      <div>项目编码：{{ xmbh }}</div>
      <div>项目名称：{{ projectName }}</div>
    </div>

    <el-collapse v-if="yjlx === '0' || yjlx === '1'" class="opinion-box" @change="handleChange" v-model="opened">
      <el-collapse-item v-if="!dataList.length">
        <template slot="title">
          <p>暂无</p>
        </template>
        <div class="opinion-content">暂无</div>
      </el-collapse-item>
      <el-collapse-item v-else-if="dataList.length" v-for="(item, index) in dataList" :key="index" :name="index">
        <template slot="title">
          <i class="el-icon-caret-bottom" style="color: #298BF5" v-if="item.isActive === true"></i>
          <i class="el-icon-caret-top" style="color: #298BF5" v-else></i>
          <p>{{item.title}}</p>
        </template>
      
        <div v-if="!item.list.length" class="opinion-content">暂无</div>
        <div v-else class="opinion-content" v-for="(value, key) in item.list" :key="key">
          <el-input class="readonly-input" v-model="value.evaluationOpinions" type="textarea" disabled :autosize="true" resize="none"></el-input>
          <!-- {{ value.evaluationOpinions }} -->
        </div>
      </el-collapse-item>
    </el-collapse>
    <el-collapse v-else class="opinion-box" @change="handleChange" v-model="opened">
      <el-collapse-item v-for="(item, index) in dataList" :key="index" :name="index">
        <template slot="title">
          <i class="el-icon-caret-bottom" style="color: #298BF5" v-if="item.isActive === true"></i>
          <i class="el-icon-caret-top" style="color: #298BF5" v-else></i>
          <p>{{ item.yjlxm }}</p>
        </template>
        <div class="opinion-content">{{ item.shyj ? item.shyj : "暂无" }}</div>
      </el-collapse-item>
    </el-collapse>
    <!-- <template slot="footer">
      <el-button size="medium" @click="closeHandle">关闭</el-button>
    </template> -->
  </hyNewModal>
</template>
<script>
import { revisedSuggestions } from "@/api/requirementBatchMangement";
export default {
  name: "checkOpinions", // 意见查看

  /**
   * @param dialogVisible 弹窗展示
   * @param title 弹窗标题
   * @param xmbh 项目编号
   * @param yjlx 意见类型——0：修改意见，1：收口意见
   * @param width 弹窗宽度
   */
  props: {
    dialogVisible: {
      required: true,
      type: Boolean,
      default: () => false
    },
    xmbh: {
      required: true,
      type: String,
      default: () => ""
    },
    projectName: {
      required: true,
      type: String,
      default: () => ""
    },
    title: {
      type: String,
      default: () => "意见查看"
    },
    yjlx: {
      type: String,
      default: () => ""
    },
    width: {
      type: String,
      default: () => "800px"
    },
    queryPsyj: {
      type: Function,
      default: () => null
    },
    getXmPsqyj: {
      type: Function,
      default: () => null
    },
    getSkshyj: {
      type: Function,
      default: () => null
    },
    rowData: {
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      dataList: [],
      jxResult: {},
      jxDataList: [],
      ywlx: this.rowData.ywlx ? this.rowData.ywlx : "BUSINESSTYPE_KY"
    };
  },

  computed: {
    opened() {
      return this.dataList.map((i, index) => {
        return index;
      });
    }
  },

  mounted() {
    if (this.yjlx === "0" || this.yjlx === "1") {
      this.getPsyj();
    } else if(this.yjlx === "sk_0") {
      this._getSKPsyj()
    }else {
      this._getXmPsqyj();
    }
  },

  methods: {
   async getPsyj() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: this.ywlx,
        projectCode: this.xmbh,
        type: this.yjlx
      };
      let res=await this.m_apiFn(revisedSuggestions)(param)
          if (res && res.result) {
            res.result.opinion.forEach(item => {
              this.$set(item, "isActive", true);
            });
            this.dataList = res.result.opinion;
          }
    },

   async _getXmPsqyj() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: this.ywlx,
        xmbh: this.xmbh
      };
      let res=await this.m_apiFn(this.getXmPsqyj)(param)
          if (res && res.result) {
            res.result.forEach(item => {
              this.$set(item, "isActive", true);
            });
            this.dataList = res.result;
          }
    },
    // 检修运维收口意见查看
  async  _getSKPsyj() {
      let list = []
      const params = {
        xmbh: this.rowData.xmbh,
        yjlx: this.yjlx,
        zyfl: this.rowData.zyfl
      }
      let resp=await this.m_apiFn(this.getSkshyj)(params)
        if(resp.statusCode === "200") {
            if(resp.result.sknsyj) {
              let obj = {}
              obj.yjlxm = '收口内审意见',
              obj.shyj = resp.result.sknsyj
              list.push(obj)
            }
            if(resp.result.zjdcyj) {
              let obj = {}
              obj.yjlxm = '收口审核意见-技术',
              obj.shyj = resp.result.zjdcyj
              list.push(obj)
            }
            if(resp.result.zjysyj) {
              let obj = {}
              obj.yjlxm = '收口审核意见-技经',
              obj.shyj = resp.result.zjysyj
              list.push(obj)
            }
            list.forEach(item => {
              this.$set(item, "isActive", true);
            })
            this.dataList = list
        }
    },

    closeHandle() {
      this.$emit("closeHandle");
    },

    handleChange(arr) {
      // console.log(arr);
      this.dataList.forEach((item, index) => {
        const _index = arr.findIndex(i => {
          return i === index;
        });
        if (_index === -1) {
          item.isActive = false;
        } else {
          item.isActive = true;
        }
      });
      this.$emit("handleChange", arr);
    }
  }
};
</script>
<style scoped>
.opinion-box /deep/ .el-collapse-item__wrap {
  border-bottom-color: #a8b0c3;
}

.opinion-box /deep/ .el-collapse-item__header {
  width: 100%;
  padding-left: 10px;
  box-sizing: border-box;
}

.opinion-box /deep/ .el-collapse-item__arrow.is-active {
  display: none;
}

.opinion-box /deep/ .el-collapse-item__arrow {
  display: none;
}

.opinion-box .opinion-content {
  width: 100%;
  min-height: 70px;
  padding: 12px;
  /* padding-left: 20px;
  padding-top: 10px; */
  box-sizing: border-box;
  background-color: #dedee0;
}
.opinion-box {
  max-height: 474px;
  overflow: auto;
}
.readonly-input /deep/ .el-textarea__inner {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #606266 !important;
  cursor: default !important;
  padding: 0 !important;
}

.project-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.project-content div:nth-child(2) {
  width: 50%;
}

.footerBtn {
  height: 80px;
  text-align: center;
  margin-top: 44px;
}
</style>