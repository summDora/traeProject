<template>
  <div id="app" :class="{ 'app--fullscreen': isFullscreen }">
    <TopNav v-if="!isFullscreen" />
    <main class="main-content" :class="{ 'main-content--fullscreen': isFullscreen, 'main-content--home': isHome }">
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
</style>
