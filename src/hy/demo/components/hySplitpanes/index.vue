<template>
  <splitpanes class="default-theme" horizontal :style="{height: height + 'px'}" @resized="resized" @splitter-click="splitterClick">
    <pane :min-size="aboveMinSize" :size="aboveSize">
      <slot name="above"></slot>
    </pane>
    <pane :min-size="belowMinSize" :size="belowSize">
      <slot name="below"></slot>
    </pane>
  </splitpanes>
</template>
<script>
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
export default {
  name: "hySplitpanes",

  components: {
    Splitpanes,
    Pane
  },

  /**
   * @param aboveHeight 上表格高度，初始化时定高，显示四行数据
   * @param aboveSearchHeight 上表格搜索条件+操作栏高度
   * @param belowSearchHeight 下表格搜索条件+操作栏高度
   */
  props: {
    aboveHeight: {
      type: Number,
      default: () => 0
    },
    aboveSearchHeight: {
      type: Number,
      default: () => 0
    },
    belowSearchHeight: {
      type: Number,
      default: () => 0
    }
  },

  data() {
    return {
      height: 0,
      aboveMinSize: 0,
      belowMinSize: 0,
      aboveSize: 0,
      belowSize: 0
    };
  },

  watch: {
    belowSearchHeight(newVal, oldVal) {
      this.getHeight();
    },
    aboveHeight(newVal, oldVal) {
      this.getHeight();
      this.initHtml(newVal);
    }
  },

  mounted() {
    let splitpanesSplitter = document.querySelector(".splitpanes__splitter");
    let elIconCaretTop = document.querySelector(".el-icon-caret-top");
    if (!elIconCaretTop) {
      let createI = document.createElement("i");
      createI.className = "el-icon-caret-top";
      createI.innerHTML = "收起";
      splitpanesSplitter.appendChild(createI);
    }
  },

  methods: {
    getHeight() {
      const offsetH = document.body.offsetHeight;
      if(this.$store.state.fusionVersion){
        this.height =
          offsetH -
          // 72 - // logo栏高度
          // 48 - // 菜单栏高度
          // 40 - // 导航栏高度
          30; // 补偿高度
      }else{
        this.height =
          offsetH -
          72 - // logo栏高度
          48 - // 菜单栏高度
          40 - // 导航栏高度
          30; // 补偿高度
      }

      this.aboveSize =
        (this.aboveHeight + this.aboveSearchHeight + 36) /
        (this.height - 12 - 3) *
        100;
      this.belowSize = 100 - this.aboveSize;

      this.setAboveMinSize();
      this.setBelowMinSize();
    },

    setAboveMinSize() {
      this.aboveMinSize =
        (this.aboveSearchHeight + 40 + 36) / this.height * 100;
    },

    setBelowMinSize() {
      this.belowMinSize =
        (this.belowSearchHeight + 40 + 36) / this.height * 100;
    },

    resized(val) {
      const aboveHeight =
        (this.height - 12 - 3) * val[0].size / 100 -
        this.aboveSearchHeight -
        36;
      const belowHeight =
        (this.height - 12 - 3) * val[1].size / 100 -
        this.belowSearchHeight -
        36;
      this.$emit("resized", aboveHeight, belowHeight);
    },

    splitterClick(e) {
      let val = [];
      if (e && e.size && e.size == 100) {
        val = [{ size: 33 }, { size: 67 }];
      } else {
        val = [{ size: 0 }, { size: 100 }];
      }
      this.resized(val);
    },

    initHtml(newVal) {
      // newVal 上表格高度
      let splitpanesSplitter = document.querySelector(".splitpanes__splitter");
      // 收起
      let elIconCaretTop = document.querySelector(".el-icon-caret-top");
      // 展开
      let elIconCaretBottom = document.querySelector(".el-icon-caret-bottom");

      if (newVal > 0 && elIconCaretTop) {
        return false;
      }

      if (newVal <= 0 && elIconCaretBottom) {
        return false;
      }

      let createI = document.createElement("i");

      if (newVal > 0 && elIconCaretBottom) {
        splitpanesSplitter.removeChild(elIconCaretBottom);
        createI.className = "el-icon-caret-top";
        createI.innerHTML = "收起";
      }

      if (newVal <= 0 && elIconCaretTop) {
        splitpanesSplitter.removeChild(elIconCaretTop);
        createI.className = "el-icon-caret-bottom";
        createI.innerHTML = "展开";
      }

      splitpanesSplitter.appendChild(createI);
    }
  }
};
</script>
<style lang="less" scoped>
.splitpanes {
  .splitpanes__pane {
    background-color: white;
  }

  /deep/ .splitpanes__splitter {
    height: 12px;
    background: linear-gradient(180deg, #f4f6f9 0%, #e0e6ee 100%);
    border-left: 1px solid rgba(34, 39, 52, 0.15);
    border-right: 1px solid rgba(34, 39, 52, 0.15);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #298bf5;

    i {
      transform: scale(0.8);
    }
  }

  /deep/ .splitpanes__splitter:before,
  /deep/ .splitpanes__splitter:after {
    display: none;
  }
}
</style>
