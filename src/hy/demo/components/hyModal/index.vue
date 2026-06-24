<template>
  <div>
    <el-dialog :class="smallModel?'hySmallModal':'hyModal'" destroy-on-close v-dialogDrag1="{whetherCanFullScreen:whetherCanFullScreen}" v-bind="$attrs" :title="title" :visible.sync="dialogVisible" :close-on-click-modal="false" v-if='dialogVisible' :width="width" :style="styleSelf" :before-close="closeHandle" :top='modalTop' :append-to-body="true">
      <!-- <el-scrollbar :style='dialogScrollStyle'> -->
      <div style="width:100%;margin:0;padding:0;box-sizing: border-box;" :class="{'fusionVersionRouterView':$store.state.fusionVersion}">
        <slot></slot>
      </div>
      <!-- </el-scrollbar> -->

      <span slot="footer" v-if='ifCancle || ifSure'>
        <el-button @click="closeHandle" v-if='ifCancle'>取 消</el-button>
        <el-button type="primary" v-if='ifSure' @click="sureHandle">确 定</el-button>
      </span>
      <span slot="footer" v-else-if="ifThird">
        <slot name="footer"></slot>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * 必填
 * @param { dialogVisible } 弹窗是否显示
 * @function closeHandle 关闭事件
 * @function sureHandle 确定事件
 * @function whetherCanFullScreen 是否展示全屏按钮
 */
/**
 * 选填
 * @param { title } 标题
 */
export default {
  name: "hyModal",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    ifCancle: {
      type: Boolean,
      default: () => false
    },
    ifSure: {
      type: Boolean,
      default: () => false
    },
    ifThird: {
      type: Boolean,
      default: () => false
    },
    whetherCanFullScreen: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => ""
    },
    smallModel: {
      type: Boolean,
      default: () => false
    },
   
    modalTop: {
      type: String,
      default: () => "0px"
    },
    width: {
      type: String,
      default: () => "600px"
    },
    dialogScrollStyle: {
      type: Object,
      default: () => {
        return { height: "500px" };
      }
    },
    styleSelf: {
      type: String,
      default: () => ""
    }
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(document.getElementsByClassName("el-dialog__body"));
      if (
        document.getElementsByClassName("el-dialog__body") &&
        document.getElementsByClassName("el-dialog__body").length
      ) {
        const offsetHeight = document.body.offsetHeight;
        const element = document.getElementsByClassName("el-dialog__body");

        for (let index = 0; index < element.length; index++) {
          // const modalTop = element[index].parentElement.style.marginTop;

          let footerHeight = 0;
          if (
            element[index].parentElement.children &&
            element[index].parentElement.children.length
          ) {
            for (const iterator of element[index].parentElement.children) {
              if (iterator._prevClass === "el-dialog__footer") {
                footerHeight = iterator.offsetHeight;
              }
            }
          }

          // element[index].style.maxHeight =
          //   offsetHeight - parseFloat(modalTop) - 54 - footerHeight - 50 + "px";

          element[index].style.maxHeight =
            // offsetHeight * 0.8 - 54 - footerHeight + "px";
            // offsetHeight * 0.8 - footerHeight + 56 + "px";
            offsetHeight * 0.8 - footerHeight - 56 + "px";

          element[index].style.overflow = "auto";
        }
      }
    });
  },
  methods: {
    closeHandle() {
      this.$emit("closeHandle");
    },
    sureHandle() {
      this.$emit("sureHandle");
    }
  }
};
</script>

<style lang="less" scoped>
//融合版样式
 @import "~@/pages/fusionVersionLayout/fusionVersion.less";
 
.hyModal {
  /deep/ .el-dialog {
    margin: 0 auto !important;
    position: absolute !important;
    left: 50%;
    transform: translateX(-50%) !important;
    top: 122px !important;
    .el-dialog__title{
      font-weight: bold;
      font-size: 20px !important;
    }
    .el-dialog__body {
      padding: 0px 20px 10px;
      box-sizing: border-box;
    }

    .el-dialog__footer {
      text-align: center;

      button {
        width: 200px;
      }
    }
  }
}

.hySmallModal {
  /deep/ .el-dialog {
    margin: 0 auto !important;
    position: absolute !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // left: 50%;
    // transform: translateX(-50%) !important;;
    // top: 33%;
    .el-dialog__title{
      font-weight: bold;
      font-size: 20px !important;
    }
    .el-dialog__body {
      padding: 0px 20px 10px;
      box-sizing: border-box;
    }

    .el-dialog__footer {
      text-align: center;

      button {
        width: 200px;
      }
    }
  }
}

</style>
