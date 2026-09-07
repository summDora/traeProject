<template>
  <div class="world-rank">
    <div
      v-for="(row, rowIndex) in rows"
      :key="rowIndex"
      class="world-rank__row"
    >
      <!-- 左侧 -->
      <div class="world-rank__side world-rank__side--left">
        <div
          v-if="row.left"
          class="world-rank__entry"
          :class="{
            'world-rank__entry--bent': rowIndex !== 1,
            'world-rank__entry--middle': rowIndex === 1
          }"
        >
          <div class="world-rank__text">
            <span class="world-rank__name">{{ row.left.name }}</span>
            <span class="world-rank__value">{{ formatPlainNumber(row.left.value) }}</span>
          </div>
          <svg
            class="world-rank__line"
            :class="'world-rank__line--' + rowIndex"
            viewBox="0 0 164 36"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                :id="'wr-lg-l-' + rowIndex"
                gradientUnits="userSpaceOnUse"
                x1="164"
                y1="16"
                x2="0"
                y2="16"
              >
                <stop offset="0%" stop-color="#135999" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#72A8DA" stop-opacity="1" />
              </linearGradient>
            </defs>
            <path
              :d="leftPath(rowIndex)"
              fill="none"
              :stroke="'url(#wr-lg-l-' + rowIndex + ')'"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>

      <div class="world-rank__hub-slot" />

      <!-- 右侧 -->
      <div class="world-rank__side world-rank__side--right">
        <div
          v-if="row.right"
          class="world-rank__entry"
          :class="{
            'world-rank__entry--bent': rowIndex !== 1,
            'world-rank__entry--middle': rowIndex === 1
          }"
        >
          <div class="world-rank__text">
            <span class="world-rank__name">{{ row.right.name }}</span>
            <span class="world-rank__value">{{ formatPlainNumber(row.right.value) }}</span>
          </div>
          <svg
            class="world-rank__line"
            :class="'world-rank__line--' + rowIndex"
            viewBox="0 0 164 36"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                :id="'wr-lg-r-' + rowIndex"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="16"
                x2="164"
                y2="16"
              >
                <stop offset="0%" stop-color="#135999" stop-opacity="0.25" />
                <stop offset="100%" stop-color="#72A8DA" stop-opacity="1" />
              </linearGradient>
            </defs>
            <path
              :d="rightPath(rowIndex)"
              fill="none"
              :stroke="'url(#wr-lg-r-' + rowIndex + ')'"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>

    <div class="world-rank__center">
      <img
        src="@/bi/asset/images/cockpit/totalnumber.png"
        alt=""
        class="world-rank__icon"
      >
      <div class="world-rank__meta">
        <div class="world-rank__label">总存量</div>
        <div class="world-rank__total">{{ formatPlainNumber(total) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
/** 折线水平段 : 斜段 = 110 : 54，总长 164；斜段垂直偏移 14（原 10）折角更明显 */
const HORIZONTAL = 110
const DIAGONAL = 54
const TOTAL = HORIZONTAL + DIAGONAL
const LINE_Y = 16
const BEND_DY = 20

function leftPath(rowIndex) {
  if (rowIndex === 1) {
    return 'M 0 ' + LINE_Y + ' L ' + TOTAL + ' ' + LINE_Y
  }
  if (rowIndex === 0) {
    return 'M 0 ' + LINE_Y + ' L ' + HORIZONTAL + ' ' + LINE_Y + ' L ' + TOTAL + ' ' + (LINE_Y + BEND_DY)
  }
  return 'M 0 ' + LINE_Y + ' L ' + HORIZONTAL + ' ' + LINE_Y + ' L ' + TOTAL + ' ' + (LINE_Y - BEND_DY)
}

function rightPath(rowIndex) {
  if (rowIndex === 1) {
    return 'M ' + TOTAL + ' ' + LINE_Y + ' L 0 ' + LINE_Y
  }
  if (rowIndex === 0) {
    return 'M ' + TOTAL + ' ' + LINE_Y + ' L ' + DIAGONAL + ' ' + LINE_Y + ' L 0 ' + (LINE_Y + BEND_DY)
  }
  return 'M ' + TOTAL + ' ' + LINE_Y + ' L ' + DIAGONAL + ' ' + LINE_Y + ' L 0 ' + (LINE_Y - BEND_DY)
}

function formatPlainNumber(num) {
  return String(Number(num) || 0)
}

export default {
  name: 'CockpitWorldRankHub',
  props: {
    total: { type: Number, default: 0 },
    leftCountries: {
      type: Array,
      default: function() { return [] }
    },
    rightCountries: {
      type: Array,
      default: function() { return [] }
    }
  },
  computed: {
    rows() {
      const result = []
      for (let i = 0; i < 3; i++) {
        result.push({
          left: this.leftCountries[i] || null,
          right: this.rightCountries[i] || null
        })
      }
      return result
    }
  },
  methods: {
    leftPath,
    rightPath,
    formatPlainNumber
  }
}
</script>

<style scoped lang="scss">
@import './styles/world-rank-hub.scss';
</style>
