<template>
  <aside class="qzlt-left">
    <!-- 上：政策统计（还原设计稿：无标题栏，整卡即统计区） -->
    <section class="qzlt-panel qzlt-stats-panel qzlt-left__stats">
      <div class="qzlt-panel__body qzlt-stats-panel__body">
        <policy-stats-block />
      </div>
    </section>

    <!-- 下：战略板块（单张切图占位） -->
    <section class="qzlt-panel qzlt-left__strategy">
      <header class="qzlt-panel__head">
        <i class="qzlt-panel__bar"></i>
        <span class="qzlt-panel__title">战略板块</span>
      </header>
      <div class="qzlt-panel__body">
        <div class="qzlt-strategy">
          <img v-if="strategyImg" class="qzlt-strategy__img" :src="strategyImg" alt="战略板块" />
          <div v-else class="qzlt-strategy__ph">
            <span>战略板块示意图</span>
            <span class="qzlt-strategy__ph-sub">切图待补，到位后仅替换资源</span>
          </div>
        </div>
      </div>
    </section>
  </aside>
</template>

<script>
import PolicyStatsBlock from "./PolicyStatsBlock.vue";

export default {
  name: "LeftPanel",
  components: { PolicyStatsBlock },
  props: {
    theme: { type: String, default: "dark" },
  },
  data() {
    return {
      // 战略板块整图：切图到位后填入路径即可（如 require("@/asset/images/sys/strategy-board.png")）
      strategyImg: "",
    };
  },
};
</script>
