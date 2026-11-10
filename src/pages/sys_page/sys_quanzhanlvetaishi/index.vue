<!--
 * 全战略态势（实验室大屏）页面壳
 * 职责仅三件事：全屏布局 + 共用头部 + 挂载内容子组件
 * - 大屏内容代码请写在 ./components/QuanzhanlvetaishiContent.vue（移植内容只改这个文件）
 * - 本页样式统一放在 ./styles/index.scss，不与其他页面混用
-->
<template>
  <div class="qzlt-page">
    <sys-lab-header />
    <quanzhanlvetaishi-content />
  </div>
</template>

<script>
import SysLabHeader from "../SysLabHeader.vue";
import QuanzhanlvetaishiContent from "./components/QuanzhanlvetaishiContent.vue";
import "./styles/index.scss";

export default {
  name: "SysQuanzhanlvetaishiPage",
  components: { SysLabHeader, QuanzhanlvetaishiContent },
};
</script>
