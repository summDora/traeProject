<!--
 * 全应用场景 —— 底部场景卡片（充电桩 / 虚拟电厂 / 用户侧储能）
 * 按设计稿像素还原：标题行 + 指标卡 + 柱状图（虚拟电厂为分组指标）+ 测算关注
 * 尺寸全部真实像素，不做 calc 缩放
-->
<template>
  <section class="qy-scene qy-common-card">
    <header class="qy-scene__head">
      <h3 class="qy-scene__title">{{ scene.title }}</h3>
      <div class="qy-scene__tags">
        <span class="qy-scene__tag">{{ scene.tag }}</span>
        <span v-if="scene.more" class="qy-scene__more">{{ scene.more }}</span>
      </div>
    </header>

    <div class="qy-scene__body">
      <!-- 分组指标：虚拟电厂按年份分组，无图表 -->
      <template v-if="scene.groups">
        <div
          v-for="group in scene.groups"
          :key="group.key"
          class="qy-scene__group"
        >
          <p class="qy-scene__group-title">{{ group.title }}</p>
          <ul class="qy-scene__grid qy-scene__grid--2">
            <li
              v-for="stat in group.stats"
              :key="stat.label"
              class="qy-metric qy-metric--row"
            >
              <img
                v-if="stat.icon"
                :src="stat.icon"
                alt=""
                class="qy-metric__icon"
                :class="`qy-metric__icon--${stat.iconSize || 'lg'}`"
              />
              <div class="qy-metric__meta">
                <p class="qy-metric__label">{{ stat.label }}</p>
                <p class="qy-metric__value">
                  <em>{{ stat.value }}</em>
                  <i v-if="stat.unit" class="qy-metric__unit">{{ stat.unit }}</i>
                </p>
              </div>
            </li>
          </ul>
        </div>
      </template>

      <!-- 单行指标 + 柱状图 -->
      <template v-else>
        <ul class="qy-scene__grid qy-scene__grid--3">
          <li
            v-for="stat in scene.stats"
            :key="stat.label"
            class="qy-metric"
          >
            <img
              v-if="stat.icon"
              :src="stat.icon"
              alt=""
              class="qy-metric__icon"
              :class="`qy-metric__icon--${stat.iconSize || 'lg'}`"
            />
            <div class="qy-metric__meta">
              <p class="qy-metric__label">{{ stat.label }}</p>
              <p class="qy-metric__value">
                <em>{{ stat.value }}</em>
                <i v-if="stat.unit">{{ stat.unit }}</i>
              </p>
              <span v-if="stat.delta" class="qy-metric__delta">{{
                stat.delta
              }}</span>
            </div>
          </li>
        </ul>

        <div v-if="scene.chart" class="qy-scene__chart">
          <p class="qy-scene__chart-title">
            <img :src="dotIcon" alt="" class="qy-scene__chart-dot" />
            {{ scene.chart.title }}
          </p>
          <qy-bar-chart
            :labels="scene.chart.labels"
            :values="scene.chart.values"
            :ticks="scene.chart.ticks"
          />
        </div>
      </template>
    </div>

    <div class="qy-scene__note">
      <span class="qy-scene__note-label">
        <img :src="noteIcon" alt="" class="qy-scene__note-icon" />
        测算关注
      </span>
      <p class="qy-scene__note-text">{{ scene.note }}</p>
    </div>
  </section>
</template>

<script>
import QyBarChart from "./QyBarChart.vue";
import { ICONS } from "./mockData";

export default {
  name: "QySceneCard",
  components: { QyBarChart },
  props: {
    scene: { type: Object, required: true },
  },
  data() {
    return {
      noteIcon: ICONS.note,
      dotIcon: ICONS.dotCyan,
    };
  },
};
</script>
