<template>
  <hyNewModal :dialogVisible="dialogVisible" :showClose="true" :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" :width="width" @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
    <div class="revision-center">
        <div class="project-content">
        <div>可研项目编码:{{xmbh}}</div>
        <div>可研项目名称：{{projectName}}</div>
        </div>
        <div v-for="(item, index) in dataList" :key="index" class="revision-box">
            <div class="revision-item">
                <p >{{item.yjlxm}}</p>
                <el-input
                    class="shadow"
                    type="textarea"
                    :rows="3"
                    placeholder=""
                    v-model="item.yjlxm"
                ></el-input>
            </div>
        </div>
    </div>
    <template  slot="footer">
        <el-button size='medium' @click="closeHandle">关闭</el-button>
    </template>
  </hyNewModal>
</template>
<script>

export default {
  name: "modificationRevision", // 科技项目可研修改意见

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
    }
  },

  data() {
    return {
      dataList: []
    };
  },

  computed: {
    opened() {
      return this.dataList.map(i => {
        return i.yjlxm;
      });
    }
  },

  mounted() {
    if (this.yjlx === "0" || this.yjlx === "1") {
      this.getPsyj();
    } else {
      this._getXmPsqyj();
    }
  },

  methods: {
    getPsyj() {
      const param = {
        xmlx: "PROJECTTYPE_XXH",
        ywlx: "BUSINESSTYPE_KY",
        xmbh: this.xmbh,
        yjlx: this.yjlx
      };
      this.m_apiFn(this.queryPsyj, param)
        .then(res => {
          if (res && res.result) {
            res.result.forEach(item => {
              this.$set(item, "isActive", true);
            });
            this.dataList = res.result;
          }
        })
        .catch(err => {});
    },

    _getXmPsqyj() {
        this.dataList = [
            {
                createBy:null, createByName:null, createDate:null,id:null, isDle:null, shjg :null, shyj:"暂无审核意见" ,
                updateBy:null, updateByName: null, xmbh:null, xmlx:null, yjlx:"1", yjlxm: "材料审核意见", ywlx:null, isActive: true
            },
            {
                createBy:null, createByName:null, createDate:null,id:null, isDle:null, shjg :null, shyj:"暂无审核意见" ,
                updateBy:null, updateByName: null, xmbh:null, xmlx:null, yjlx:"2", yjlxm: "专家预审意见", ywlx:null, isActive: true
            }
        ]
    //   const param = {
    //     xmlx: "PROJECTTYPE_XXH",
    //     ywlx: "BUSINESSTYPE_KY",
    //     xmbh: this.xmbh
    //   };
    //   this.m_apiFn(this.getXmPsqyj, param)
    //     .then(res => {
    //       if (res && res.result) {
    //         res.result.forEach(item => {
    //           this.$set(item, "isActive", true);
    //         });
    //         this.dataList = res.result;
    //       }
    //     })
    //     .catch(err => {});
    },

    closeHandle() {
        this.dialogVisible = false
      this.$emit("closeHandle");
    },

    handleChange(arr) {
      this.dataList.forEach((item, index) => {
        const _index = arr.findIndex(i => {
          return i === item.yjlxm;
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
<style lang="less" scoped>
.revision-center {
    box-sizing: border-box;
    border: 1px solid #ccc
}
.revision-box {
  /deep/ .el-collapse-item__wrap {
    border-bottom-color: #a8b0c3;
  }

  /deep/ .el-collapse-item__header {
    width: 100%;
    padding-left: 10px;
    box-sizing: border-box;
    // background-color: #aac3e2;
  }

  /deep/ .el-collapse-item__arrow.is-active {
    display: none;
  }

  /deep/ .el-collapse-item__arrow {
    display: none;
  }

  .revision-content {
    width: 100%;
    min-height: 70px;
    padding-left: 20px;
    padding-top: 10px;
    box-sizing: border-box;
    background-color: #dedee0;
  }
  p {
      box-sizing: border-box;
      background-color: #66b1ff;
      line-height: 36px
  }
  .shadow {
      -moz-box-shadow: inset 0 0 10px #ccc;
      -webkit-box-shadow: inset 0 0 10px #ccc;
      box-shadow: inset 0 0 10px #ccc;
  }
  .revision-item {
      margin-bottom: 5px
  }
}
.project-content {
  display: flex;
  justify-content: space-between;
  margin: 10px;
  div{
      font-weight: bold
  }
}

.footerBtn {
  height: 80px;
  text-align: center;
  margin-top: 44px;
}
</style>
