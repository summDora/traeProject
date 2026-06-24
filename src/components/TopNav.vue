<template>
  <header class="top-nav">
    <div class="nav-brand">
      <span class="brand-title">数据看板</span>
    </div>
    <div class="nav-menu-wrap">
      <el-menu
        :default-active="activeMenu"
        mode="horizontal"
        router
        background-color="#667eea"
        text-color="#e8eaf6"
        active-text-color="#ffffff"
      >
        <template v-for="item in menus">
          <el-menu-item
            v-if="!item.children"
            :key="item.path"
            :index="item.path"
          >
            {{ item.title }}
          </el-menu-item>
          <el-submenu
            v-else
            :key="'submenu-' + item.title"
            :index="item.title"
          >
            <template slot="title">{{ item.title }}</template>
            <el-menu-item
              v-for="child in item.children"
              :key="child.path"
              :index="child.path"
            >
              {{ child.title }}
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </div>
  </header>
</template>

<script>
import { navMenus } from '../router'

export default {
  name: 'TopNav',
  data() {
    return {
      menus: navMenus
    }
  },
  computed: {
    activeMenu() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.top-nav {
  display: flex;
  align-items: stretch;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
