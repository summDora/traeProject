<!--
 * @author SHUF
 * @date 2025-04-28 14:49:56
 * @Description 页面头部标题(全局注册)
-->
<template>
  <h2 class="page-header-title">{{ pageTitle }}</h2>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'ThePageHeaderTitle',
  props: {
    // 动态二级菜单
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      menuList: state => state.user.menuList,
    }),
    pageTitle: {
      get() {
        return this.title || this.menuList.find(i => i.path === this.$route.name)?.relMenuName
      },
    },
  },
  created() {
    console.log(this.menuList, 'menuList----')
  },
  methods: {},
}
</script>
<style lang="less" scoped>
// 页面title
.page-header-title {
  margin-bottom: 24px;
  color: var(--hi-txt-tb1);
  font-size: 20px;
  font-weight: 600;
}
</style>
