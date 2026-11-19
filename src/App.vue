<template>
  <div id="app" :class="{ 'app--fullscreen': isFullscreen }">
    <TopNav v-if="!isFullscreen" />
    <main
      class="main-content"
      :class="{
        'main-content--fullscreen': isFullscreen,
        'main-content--home': isHome,
        'main-content--scroll-x': isScrollX,
      }"
    >
      <router-view />
    </main>
  </div>
</template>

<script>
import TopNav from './components/TopNav.vue'

export default {
  name: 'App',
  components: {
    TopNav
  },
  computed: {
    isFullscreen() {
      return this.$route.meta && this.$route.meta.fullscreen
    },
    isHome() {
      return this.$route.path === '/'
    },
    // 大屏页面设了 min-width，需要让全屏容器允许横向滚动，否则超出部分会被裁掉
    isScrollX() {
      return !!(this.$route.meta && this.$route.meta.scrollX)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background-color: #f5f7fa;
}

#app.app--fullscreen {
  min-height: 100vh;
  background-color: #020818;
}

.main-content {
  padding: 20px;
  min-height: calc(100vh - 56px);
}

.main-content--home {
  padding: 0;
}

.main-content--fullscreen {
  padding: 0;
  min-height: 100vh;
  height: 100vh;
  overflow: hidden;
}

/* 页面自身有 min-width（大屏不做等比缩小）时，横向滚动交给这一层 */
.main-content--scroll-x {
  overflow-x: auto;
  overflow-y: hidden;
  /* 预留滚动条槽位：纵向滚动条出现时不再挤掉 15px 宽度，避免连带出横向滚动条 */
  scrollbar-gutter: stable;
}

/* 视口高低于 900px 时允许纵向滚动；≥900 时靠布局收窄完整放下，不出滚动条 */
@media (max-height: 899px) {
  .main-content--scroll-x {
    overflow-y: auto;
  }
}
</style>
