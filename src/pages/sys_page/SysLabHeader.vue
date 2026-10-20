<!--
 * 【实验室】各页面共用的头部（透明，叠在页面底图之上）
 * 上部 126px：透明区 + SUMMERDORA 品牌文字，点击回到首页
 * 下部 44px：透明导航栏（带边框）+ 平铺「实验室」目录下的菜单
-->
<template>
  <header class="lab-header">
    <div class="lab-header__top">
      <router-link to="/" class="lab-header__brand">SUMMERDORA</router-link>
    </div>
    <nav class="lab-header__nav">
      <div class="lab-header__nav-list">
        <router-link
          v-for="item in labMenus"
          :key="item.path || item.title"
          :to="item.path"
          class="lab-header__nav-item"
          :class="{ 'is-active': item.path === $route.path }"
        >
          {{ item.title }}
        </router-link>
      </div>
      <span class="lab-header__nav-more">
        <i></i><i></i><i></i>
      </span>
    </nav>
  </header>
</template>

<script>
import { navMenus } from "@/router";

// 递归查找「实验室」节点，取其子菜单平铺展示
function findLabMenus(menus) {
  for (const menu of menus || []) {
    if (menu.title === "实验室") {
      return menu.children || [];
    }
    if (menu.children) {
      const found = findLabMenus(menu.children);
      if (found) return found;
    }
  }
  return null;
}

export default {
  name: "SysLabHeader",
  data() {
    return {
      labMenus: findLabMenus(navMenus) || [],
    };
  },
};
</script>

<style lang="scss" scoped>
.lab-header {
  width: 100%;
  background: transparent;
}

.lab-header__top {
  display: flex;
  align-items: center;
  width: 100%;
  height: 126px;
  padding: 0 32px;
  background: transparent;
}

.lab-header__brand {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
}

.lab-header__nav {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 44px;
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}

.lab-header__nav-list {
  display: flex;
  align-items: center;
}

.lab-header__nav-item {
  position: relative;
  padding: 0 22px;
  font-size: 14px;
  line-height: 44px;
  color: #d5f0f7;
  white-space: nowrap;
  text-decoration: none;
  transition: color 0.2s;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 0;
    width: 1px;
    height: 12px;
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-50%);
  }

  &:last-child::after {
    display: none;
  }

  &:hover {
    color: #ffffff;
  }

  &.is-active {
    color: #ffffff;
    font-weight: 600;
  }
}

.lab-header__nav-more {
  position: absolute;
  top: 50%;
  right: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 18px;
  height: 14px;
  transform: translateY(-50%);
  cursor: pointer;

  i {
    display: block;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.85);
  }
}
</style>
