<template>
  <header class="top-nav">
    <router-link to="/" class="nav-brand">
      <span class="brand-title">SUMMERDORA</span>
    </router-link>
    <div class="nav-menu-wrap">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
        background-color="#0E7490"
        text-color="#e6f4f6"
        active-text-color="#ffffff"
      >
        <nav-menu-item
          v-for="item in menus"
          :key="item.path || item.title"
          :item="item"
        />
      </el-menu>
    </div>
  </header>
</template>

<script>
import { navMenus } from "../router";

// 递归渲染菜单项，支持任意层级（含三级菜单）
const NavMenuItem = {
  name: "NavMenuItem",
  props: {
    item: { type: Object, required: true },
  },
  render(h) {
    const children = this.item.children || [];
    if (!children.length) {
      return h(
        "el-menu-item",
        { props: { index: this.item.path } },
        this.item.title
      );
    }
    return h(
      "el-submenu",
      { props: { index: this.item.title } },
      [
        h("span", { slot: "title" }, this.item.title),
        ...children.map((child) =>
          h(NavMenuItem, {
            key: child.path || child.title,
            props: { item: child },
          })
        ),
      ]
    );
  },
};

export default {
  name: "TopNav",
  components: { NavMenuItem },
  data() {
    return {
      menus: navMenus,
    };
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: stretch;
  background: linear-gradient(135deg, #0e7490 0%, #0c5c75 100%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-brand {
  display: flex;
  align-items: center;
  padding: 0 24px;
  flex-shrink: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  text-decoration: none;
  cursor: pointer;
}

.nav-brand:hover .brand-title {
  opacity: 0.86;
}

.brand-title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;
}

.nav-menu-wrap {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
}

.nav-menu-wrap::-webkit-scrollbar {
  height: 4px;
}

.nav-menu-wrap::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.top-nav >>> .el-menu {
  border-bottom: none;
  background: transparent !important;
  white-space: nowrap;
}

.top-nav >>> .el-menu-item,
.top-nav >>> .el-submenu__title {
  height: 56px;
  line-height: 56px;
  border-bottom: 3px solid transparent;
}

.top-nav >>> .el-menu-item:hover,
.top-nav >>> .el-menu-item:focus,
.top-nav >>> .el-submenu__title:hover,
.top-nav >>> .el-submenu__title:focus {
  background-color: rgba(255, 255, 255, 0.12) !important;
}

.top-nav >>> .el-menu-item.is-active {
  background-color: rgba(255, 255, 255, 0.18) !important;
  border-bottom-color: #fff;
  font-weight: 600;
}

.top-nav >>> .el-submenu.is-active .el-submenu__title {
  background-color: rgba(255, 255, 255, 0.18) !important;
  border-bottom-color: #fff;
  font-weight: 600;
}
</style>
