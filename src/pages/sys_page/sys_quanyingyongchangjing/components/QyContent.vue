          <!--
 * 全应用场景大屏「内容区」骨架
 * 设计基准宽度 1980；高度按内容撑开，纵向滚动交给外层 main-content（meta.scrollY），不做全屏等比缩放
 * 地图 / 图表 / 头图当前均为占位块，静态素材到位后替换 QyPlaceholder 即可
-->
<template>
  <div class="qy-content">
    <header class="qy-hero qy-common-card">
      <div class="qy-hero__text">
        <h1 class="qy-hero__title">{{ pageIntro.title }}</h1>
        <p class="qy-hero__desc">{{ pageIntro.descPrefix }}<span class="qy-hero__desc-em">{{ pageIntro.descHighlight }}</span>{{ pageIntro.descSuffix }}</p>
      </div>
    </header>

    <!-- 园区：绿电直连 + 零碳园区 -->
    <section class="qy-block qy-common-card">
      <qy-p-title class="qy-block__head" title="园区" tag="经济效益测算主线" />

      <div class="qy-park__body">
        <div class="qy-park__col">
          <qy-panel
            :title="parkScenes[0].title"
            :icon="parkScenes[0].icon"
            :tag="parkScenes[0].tag"
          >
            <qy-stat-group :items="parkScenes[0].stats" />
            <qy-subtitle :title="parkScenes[0].mapTitle" :icon="dotIcon" />
            <qy-park-map :scene="parkScenes[0]" />
          </qy-panel>

          <div class="qy-park__sub">
            <qy-panel
              class="qy-foot__table"
              :title="policyBoundaries.title"
              hide-header
            >
              <qy-subtitle :title="policyBoundaries.title" :icon="dotIcon" :tag="policyBoundaries.tag" />
              <ul class="qy-table">
                <li
                  v-for="row in policyBoundaries.rows"
                  :key="row.label"
                  class="qy-table__row"
                >
                  <div class="qy-table__text">
                    <span class="qy-table__label">{{ row.label }}</span>
                    <span class="qy-table__note">· {{ row.note }}</span>
                    <span class="qy-table__limit">{{ row.limit }}</span>
                  </div>
                  <div class="qy-table__track">
                    <span class="qy-table__bar" :style="{ width: row.progress + '%' }"></span>
                  </div>
                </li>
              </ul>
            </qy-panel>

            <article class="qy-scene__note qy-econ__card qy-econ__card--narrow">
              <span class="qy-scene__note-label">
                <img :src="noteIcon" alt="" class="qy-scene__note-icon">
                {{ econNotes[0].title }}
              </span>
              <p class="qy-scene__note-text">{{ econNotes[0].desc }}</p>
            </article>
          </div>
        </div>

        <div class="qy-park__col">
          <qy-panel
            :title="parkScenes[1].title"
            :icon="parkScenes[1].icon"
            :tag="parkScenes[1].tag"
          >
            <qy-stat-group :items="parkScenes[1].stats" />
            <qy-subtitle :title="parkScenes[1].mapTitle" :icon="dotIcon" />
            <qy-park-map :scene="parkScenes[1]" />
          </qy-panel>

          <article class="qy-scene__note qy-econ__card qy-econ__card--wide">
            <span class="qy-scene__note-label">
              <img :src="noteIcon" alt="" class="qy-scene__note-icon">
              {{ econNotes[1].title }}
            </span>
            <p class="qy-scene__note-text">{{ econNotes[1].desc }}</p>
          </article>
        </div>
      </div>

      <div class="qy-cta">
        <img :src="yitihuaIcon" alt="" class="qy-cta__icon" />
        <div class="qy-cta__text">
          <h4>{{ storageBanner.title }}</h4>
          <p>{{ storageBanner.desc }}</p>
        </div>
        <button type="button" class="qy-cta__btn">
          {{ storageBanner.action }}
        </button>
      </div>
    </section>

    <!-- 充电桩 / 虚拟电厂 / 用户侧储能 -->
    <section class="qy-block qy-block--scenes">
      <div class="qy-scene-cards ">
        <qy-scene-card
          v-for="scene in sceneCards"
          :key="scene.key"
          :scene="scene"
        />
      </div>
    </section>
  </div>
</template>

<script>
import QyPanel from "./QyPanel.vue";
import QyPTitle from "./QyPTitle.vue";
import QyStatGroup from "./QyStatGroup.vue";
import QySceneCard from "./QySceneCard.vue";
import QySubtitle from "./QySubtitle.vue";
import QyParkMap from "./QyParkMap.vue";
import {
  econNotes,
  pageIntro,
  parkScenes,
  policyBoundaries,
  sceneCards,
  storageBanner,
  ICONS,
} from "./mockData";

export default {
  name: "QuanyingyongchangjingContent",
  components: {
    QyPanel,
    QyPTitle,
    QyStatGroup,
    QySceneCard,
    QySubtitle,
    QyParkMap,
  },
  data() {
    return {
      pageIntro,
      parkScenes,
      policyBoundaries,
      econNotes,
      storageBanner,
      sceneCards,
      noteIcon: ICONS.note,
      dotIcon: ICONS.dotCyan,
      yitihuaIcon: ICONS.yitihua,
    };
  },
};
</script>
