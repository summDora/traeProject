<template>
  <div>
    <el-submenu
      v-if="sunmenuData.children && sunmenuData.children.length > 0"
      :index="sunmenuData.source == 0 ? '' : sunmenuData.path ? sunmenuData.path : sunmenuData.id"
      :popper-append-to-body="true"
    >
      <template slot="title">
        <i v-if="sunmenuData.icon" :class="sunmenuData.icon"></i>
        <span v-if="sunmenuData.source != 0" slot="title">{{ sunmenuData.relMenuName }}</span>
        <a v-else class="menu-a" slot="title" :href="sunmenuData.path" :target="sunmenuData.expansion == 0 ? '_self' : '_blank'">{{
          sunmenuData.relMenuName
        }}</a>
      </template>
      <hy-submenu v-for="item in sunmenuData.children" :sunmenuData="item" :key="item.id"></hy-submenu>
    </el-submenu>

    <el-menu-item v-else :index="sunmenuData.source == 0 ? '' : sunmenuData.path ? sunmenuData.path : sunmenuData.id">
      <i v-if="sunmenuData.icon" :class="sunmenuData.icon"></i>
      <span v-if="sunmenuData.source != 0" slot="title">{{ sunmenuData.relMenuName }}</span>
      <a v-else class="menu-a" slot="title" :href="sunmenuData.path" :target="sunmenuData.expansion == 0 ? '_self' : '_blank'">{{ sunmenuData.relMenuName }}</a>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'HySubmenu',
  props: {
    sunmenuData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {}
}
</script>

<style scoped>
.menu-a {
  color: rgb(255, 255, 255);
}
</style>
