<!--
 * 经营性预测指标大屏页面壳
 * 职责：全屏布局 + 共用头部（与全战略态势同级）+ 挂载内容子组件
 * 内容代码写在 ./components/JyContent.vue，样式写在 ./styles/index.scss
-->
<template>
  <div class="jy-page">
    <sys-lab-header />
    <jy-content />
  </div>
</template>

<script>
import SysLabHeader from "../SysLabHeader.vue";
import JyContent from "./components/JyContent.vue";
import "./styles/index.scss";

export default {
  name: "SysJingyingxingyucePage",
  components: { SysLabHeader, JyContent },
};
</script>
