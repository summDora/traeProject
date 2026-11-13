<template>
  <section class="jy-panel jy-left">
    <div class="jy-ptitle">
      <span class="jy-ptitle__text">参数控制台</span>
    </div>

    <div class="jy-params jy-scroll">
      <template v-for="(g, gi) in groups">
        <div v-if="gi > 0" :key="`div-${g.key}`" class="jy-param-divider"></div>
        <div :key="g.key" class="jy-param-group">
          <div class="jy-param-group__head">
            <div
              class="jy-param-group__title"
              :class="`jy-param-group__title--${g.theme}`"
            >
              {{ g.title }}
            </div>
            <div v-if="gi === 0" class="jy-year">
              <span class="jy-year__label">年份</span>
              <span class="jy-year__field">
                <select v-model="year" class="jy-year__select">
                  <option v-for="opt in years" :key="opt" :value="opt">
                    {{ opt }}
                  </option>
                </select>
                <img class="jy-year__icon" :src="calendarIcon" alt="" />
              </span>
            </div>
          </div>
          <div v-for="row in g.rows" :key="row.key" class="jy-param-row">
            <label class="jy-param-row__label" :for="`jy-input-${row.key}`">{{
              row.label
            }}</label>
            <div class="jy-param-field-wrap">
              <div
                class="jy-param-row__field"
                :class="`jy-param-row__field--${g.theme}`"
              >
                <input
                  :id="`jy-input-${row.key}`"
                  v-model="row.value"
                  class="jy-param-row__input"
                  inputmode="decimal"
                  autocomplete="off"
                />
              </div>
              <span v-if="row.hint" class="jy-param-row__hint">{{
                row.hint
              }}</span>
            </div>
          </div>
        </div>
      </template>

      <div class="jy-calc-wrap">
        <button
          type="button"
          class="jy-btn jy-btn--calc"
          @click="runCalculation"
        >
          <img :src="calculatorIcon" alt="" /> 运算
        </button>
      </div>

      <div class="jy-note">
        <div class="jy-check__row">
          <div class="jy-note__title">{{ noteTitle }}</div>
          <div class="jy-note__main">{{ noteMain }}</div>
        </div>
        <div class="jy-note__sub">{{ noteSub }}</div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  PARAM_GROUPS,
  YEAR,
  YEARS,
  NOTE_TITLE,
  NOTE_MAIN,
  NOTE_SUB,
  ICONS,
} from "./mockData";

export default {
  name: "JyLeftPanel",
  data() {
    return {
      groups: PARAM_GROUPS,
      year: YEAR,
      years: YEARS,
      noteTitle: NOTE_TITLE,
      noteMain: NOTE_MAIN,
      noteSub: NOTE_SUB,
      calendarIcon: ICONS.calendar,
      calculatorIcon: ICONS.calculator,
    };
  },
  methods: {
    // 接口位：经营规划口径值变化时调用
    runCalculation() {
      console.log("[JyLeftPanel] runCalculation", this.year, this.groups);
    },
  },
};
</script>
