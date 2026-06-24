<template>
  <el-submenu v-if="sunmenuData.children&&sunmenuData.children.length>0"
    :index="sunmenuData.path?sunmenuData.path:sunmenuData.id">
    <template slot="title">
      <i v-if='sunmenuData.icon' :class='sunmenuData.icon'></i>
      <span slot="title">{{sunmenuData.title}}</span>
    </template>
    <Submenu
      v-for="(item,index) in sunmenuData.children"
      :sunmenuData="item"
      :key="index" >
    </Submenu>
  </el-submenu>

  <el-menu-item
    v-else
    :index="sunmenuData.path?sunmenuData.path:sunmenuData.id"
    >
    <i v-if='sunmenuData.icon' :class='sunmenuData.icon'></i>
    <span slot='title'>{{ sunmenuData.title }}</span>
  </el-menu-item>

</template>

<script>
export default {
  name: 'Submenu',
  props: {
    sunmenuData:{
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    
  }
}
</script>

<style>
</style>