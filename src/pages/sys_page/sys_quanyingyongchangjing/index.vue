<!--
 * 全应用场景（实验室大屏）页面壳
 * 设计基准宽度 1980；高度按内容撑开、由外层纵向滚动，不做全屏等比缩放
 * 职责仅三件事：页面根布局 + 共用头部 + 挂载内容子组件
 * - 内容代码写在 ./components/QyContent.vue
 * - mock 数据写在 ./components/mockData.js
 * - 本页样式统一放在 ./styles/index.scss，不与其他页面混用
-->
<template>
  <div class="qy-page">
    <sys-lab-header />
    <qy-content />
  </div>
</template>

<script>
import SysLabHeader from "../SysLabHeader.vue";
import QyContent from "./components/QyContent.vue";
import "./styles/index.scss";

export default {
  name: "SysQuanyingyongchangjingPage",
  components: { SysLabHeader, QyContent },
};
</script>
