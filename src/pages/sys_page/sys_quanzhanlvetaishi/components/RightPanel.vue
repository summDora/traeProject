<template>
  <aside class="qzlt-right">
    <section class="qzlt-panel qzlt-right__panel">
      <header class="qzlt-panel__head qzlt-right__head">
        <i class="qzlt-panel__bar"></i>
        <span class="qzlt-panel__title">外部动态</span>
        <div class="qzlt-right__head-extra">
          <span class="qzlt-right__range">{{ activeTab.range }}</span>
          <button type="button" class="qzlt-right__more">查看全部</button>
        </div>
      </header>

      <!-- 日 / 周 / 月 / 季 / 年：切换下方动态内容 -->
      <div class="qzlt-right__tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="qzlt-feed-tab"
          :class="[`tone--${tab.tone}`, { 'is-active': activeKey === tab.key }]"
          @click="activeKey = tab.key"
        >
          <i class="qzlt-feed-tab__icon">{{ tab.short }}</i>
          <span class="qzlt-feed-tab__label">{{ tab.label }}</span>
        </button>
      </div>

      <div class="qzlt-panel__body qzlt-right__body">
        <div class="qzlt-feed">
          <section
            v-for="group in activeFeed.groups"
            :key="group.key"
            class="qzlt-feed__group"
          >
            <div class="qzlt-feed__group-head">
              <img class="qzlt-feed__group-icon" src="./../../../../asset/images/qzlts/doc.png" alt="">
              <span class="qzlt-feed__group-title">{{ group.title }}</span>
            </div>

            <ul class="qzlt-feed__list">
              <li v-for="(item, i) in group.items" :key="i" class="qzlt-feed-card">
                <div class="qzlt-feed-card__head">
                  <span class="qzlt-feed-card__title">
                    <i class="qzlt-feed-card__dot"></i>
                    <span>{{ item.title }}</span>
                  </span>
                  <span class="qzlt-feed-card__tag" :class="`tag--${item.tagTone}`">
                    {{ item.tag }}
                  </span>
                </div>
                <p class="qzlt-feed-card__desc">{{ item.desc }}</p>
                <div class="qzlt-feed-card__meta">
                  <span class="qzlt-feed-card__meta-item">
                    <img src="@/asset/images/qzlts/icon-time.png" class="qzlt-feed-card__meta-icon" alt="">
                    <span>{{ item.date }}</span>
                  </span>
                  <span class="qzlt-feed-card__meta-item">
                    <img src="@/asset/images/qzlts/icon-local.png" class="qzlt-feed-card__meta-icon" alt="">
                    <span>{{ item.org }}</span>
                  </span>
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </section>
  </aside>
</template>

<script>
import { externalTabs, externalFeedMap } from "./mockData";
import { fetchExternalFeed } from "@/api/quanzhanlvetaishi";

export default {
  name: "RightPanel",
  props: {
    theme: { type: String, default: "dark" },
  },
  data() {
    return {
      tabs: externalTabs,
      activeKey: externalTabs[0].key,
      feedMap: externalFeedMap,
    };
  },
  computed: {
    activeTab() {
      return this.tabs.find((t) => t.key === this.activeKey) || this.tabs[0];
    },
    activeFeed() {
      return this.feedMap[this.activeKey] || { groups: [] };
    },
  },
  watch: {
    activeKey: "loadFeed",
  },
  mounted() {
    this.loadFeed();
  },
  methods: {
    /** 右侧外部动态走接口入口（失败时接口层回落 mock） */
    async loadFeed() {
      const res = await fetchExternalFeed({ type: this.activeKey });
      if (res && typeof res === "object") {
        this.feedMap = { ...this.feedMap, ...res };
      }
    },
  },
};
</script>
