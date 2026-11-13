<template>
  <section class="jy-panel jy-right">
    <div class="jy-right-body">
      <!-- 经营策略联动 -->
      <div class="jy-section jy-linkage">
        <div class="jy-section__head">
          <span class="jy-section__text">经营策略联动</span>
        </div>
        <div class="jy-linkage__list">
          <div
            v-for="item in linkageCards"
            :key="item.key"
            class="jy-linkage__card"
            :class="`jy-linkage__card--${item.theme}`"
          >
            <div class="jy-linkage__row">
              <img class="jy-linkage__dot" :src="item.dot" alt="" />
              <span class="jy-linkage__title">{{ item.title }}</span>
              <span class="jy-linkage__badge">{{ item.status }}</span>
            </div>
            <div class="jy-linkage__value">{{ item.value }}</div>
          </div>
        </div>
      </div>

      <!-- 策略建议 -->
      <div class="jy-section jy-strategy">
        <div class="jy-section__head">
          <img class="jy-strategy__deco" :src="subtitleDeco" alt="" />
          <span class="jy-section__text">策略建议</span>
        </div>
        <div class="jy-strategy__list jy-scroll">
          <div v-for="s in strategyItems" :key="s.no" class="jy-strategy__item">
            <div class="jy-strategy__row" :style="{ borderLeftColor: s.color }">
              <div class="jy-strategy__title" :style="{ color: s.color }">
                <span class="jy-strategy__no">{{ s.no }}</span>
                <span class="jy-strategy__name">{{ s.title }}</span>
              </div>
              <p class="jy-strategy__desc">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 上线校验 -->
      <div class="jy-check">
        <div class="jy-check__row">
          <span class="jy-check__tag">{{ checkNote.tag }}</span>
          <span class="jy-check__strong">{{ checkNote.strong }}</span>
        </div>
        <p class="jy-check__weak">{{ checkNote.weak }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import { LINKAGE_CARDS, STRATEGY_ITEMS, CHECK_NOTE } from "./mockData";
import subtitleDeco from "@/asset/images/jyzbyc/subtitle-decoration.png";

export default {
  name: "JyRightPanel",
  data() {
    return {
      linkageCards: LINKAGE_CARDS,
      strategyItems: STRATEGY_ITEMS,
      checkNote: CHECK_NOTE,
      subtitleDeco,
    };
  },
};
</script>
