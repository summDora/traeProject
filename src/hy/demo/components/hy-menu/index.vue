<template>
  <el-menu
    :class="mode==='horizontal'?'hyMenu':'el-menu-vertical-demo'"
    @select='selectMenu'
    :default-active='defaultActive'
    :collapse="isCollapse"
    :router='router'
    :unique-opened='uniqueOpen'
    :mode="mode"
    :background-color='bgColor'
    :text-color='textColor'
    :active-text-color='activeTextColor'
  >
    <slot></slot>
    <HySubmenu
      v-for="item in menuData"
      :sunmenuData="item"
      :key="item.id"
    >
    </HySubmenu>
  </el-menu>
</template>
<script>
/**
 * @param {menuData} 导航数据，例：[{id:'',icon:'',path:'',title:''}],id:唯一id,icon:图标,path:对应路径,title:标题
 * @param {mode} 导航类型
 * @param {bgColor} 背景色
 * @param {textColor} 文字颜色
 * @param {activeTextColor} 选中字体颜色
 * @param {uniqueOpen} 最多同时展开一层
 * @param {router} 是否使用 vue-router 的模式
 * @param {isCollapse} 展开收缩
 * @param {defaultActive} 当前激活菜单的 index
 */
import HySubmenu from "./HySubmenu";
export default {
  name: "HyMenu",
  data() {
    return {};
  },
  props: {
    menuData: {
      type: Array,
      default() {
        return [];
      }
    },
    mode: {
      type: String,
      default() {
        return "horizontal";
      }
    },
    bgColor: {
      type: String,
      default() {
        return "";
      }
    },
    textColor: {
      type: String,
      default() {
        return "";
      }
    },
    activeTextColor: {
      type: String,
      default() {
        return "";
      }
    },
    uniqueOpen: {
      type: Boolean,
      default() {
        return false;
      }
    },
    router: {
      type: Boolean,
      default() {
        return false;
      }
    },
    isCollapse: {
      type: Boolean,
      default() {
        return false;
      }
    },
    defaultActive: {
      type: String,
      default() {
        return "";
      }
    }
  },
  components: {
    HySubmenu
  },
  methods: {
    selectMenu(index, indexPath) {
      this.$emit("selectMenu", index, indexPath);
    }
  }
};
</script>
<style scoped>
@import "./index.css";
</style>

