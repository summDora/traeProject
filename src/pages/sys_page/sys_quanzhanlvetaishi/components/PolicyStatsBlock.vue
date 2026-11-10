<template>
  <div class="qzlt-stats">
    <!-- 左：三块 KPI（六边形徽标 + 标题 + 数字），可点击切换右侧数据 -->
    <div class="qzlt-stats__left">
      <div
        v-for="item in categories"
        :key="item.key"
        class="qzlt-kpi"
        :class="{ 'is-active': item.key === activeKey }"
        @click="activeKey = item.key"
      >
        <img class="qzlt-kpi__badge" :src="item.icon" alt="" />
        <div class="qzlt-kpi__body">
          <div class="qzlt-kpi__title">{{ item.title }}</div>
          <div class="qzlt-kpi__figure">
            <span class="qzlt-kpi__num">{{ item.value }}</span>
            <span class="qzlt-kpi__unit">{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 中：弧形分隔（grid-1.png 等比整图） -->
    <img class="qzlt-stats__arc" :src="arcImg" alt="" />

    <!-- 右：分类列表卡片 -->
    <div class="qzlt-stats__right">
      <div class="qzlt-stats__list">
        <div v-for="(row, i) in activeDetail" :key="i" class="qzlt-cat">
          <span class="qzlt-cat__icon">
            <img :src="row.icon" alt="" />
          </span>
          <span class="qzlt-cat__name">{{ row.name }}</span>
          <span class="qzlt-cat__count">
            <b>{{ row.count }}</b>
            <i>条</i>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import arcImg from "@/asset/images/qzlts/grid-1.png";
import { statsCategories, statsDetailMap } from "./mockData";
import { fetchPolicyStats } from "@/api/quanzhanlvetaishi";

export default {
  name: "PolicyStatsBlock",
  data() {
    return {
      categories: statsCategories,
      detailMap: statsDetailMap,
      activeKey: "policy",
      arcImg,
    };
  },
  computed: {
    activeDetail() {
      return this.detailMap[this.activeKey] || [];
    },
  },
  mounted() {
    this.loadStats();
  },
  methods: {
    /** 左侧政策统计走接口入口（失败时接口层回落 mock） */
    async loadStats() {
      const res = await fetchPolicyStats({});
      if (!res) return;
      if (Array.isArray(res.categories) && res.categories.length) {
        this.categories = res.categories;
      }
      if (res.detailMap && typeof res.detailMap === "object") {
        this.detailMap = res.detailMap;
      }
    },
  },
};
</script>
