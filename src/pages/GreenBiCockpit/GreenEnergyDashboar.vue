<template>
  <div class="green-bi-cockpit" :class="{ 'green-bi-cockpit--fullscreen': isFullscreen }">
    <div class="green-bi-cockpit__viewport">
      <div class="green-bi-cockpit__scale-slot" :style="scaleSlotStyle">
        <div class="green-bi-cockpit__scale" :style="scaleStyle">
          <div class="green-bi-cockpit__screen">
            <div class="green-bi-cockpit-layer bg" />
            <div class="green-bi-cockpit-layer show">
              <header class="cockpit-header">
                <div class="cockpit-header__bg" />
                <h1 class="cockpit-header__title">国家绿色能源电力产业知识产权运营驾驶舱</h1>
              </header>
              <div class="green-bi-cockpit__content">
                <CockpitLeftMainPanel :data="leftPanelData" />
                <CockpitRightMainPanel :data="rightPanelData" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { applyCockpitTheme, DESIGN_WIDTH, DESIGN_HEIGHT } from './cockpit/utils/chartTheme'
import { setDashboardData, createEmptyDashboardState } from './cockpit/utils/setDashboardData'
import screenScaleMixin from './cockpit/mixins/screenScale'
import CockpitLeftMainPanel from './cockpit/CockpitLeftMainPanel.vue'
import CockpitRightMainPanel from './cockpit/CockpitRightMainPanel.vue'
import { getGreenBiCockpitDashboard } from './cockpit/api/greenBiCockpit'

applyCockpitTheme()

const emptyState = createEmptyDashboardState()

export default {
  name: 'GreenEnergyDashboard',
  components: { CockpitLeftMainPanel, CockpitRightMainPanel },
  mixins: [screenScaleMixin],
  data() {
    return {
      leftPanelData: emptyState.leftPanelData,
      rightPanelData: emptyState.rightPanelData
    }
  },
  computed: {
    scaleSlotStyle() {
      // zoom 会同步布局尺寸，F11 原始结构无需 slot；transform 需 slot 保证滚动高度
      if (this.useZoom || this.isFullscreen) return null
      return {
        width: `${DESIGN_WIDTH * this.scale}px`,
        height: `${DESIGN_HEIGHT * this.scale}px`
      }
    },
    scaleStyle() {
      const style = {
        width: `${DESIGN_WIDTH}px`,
        height: `${DESIGN_HEIGHT}px`
      }

      if (this.useZoom) {
        style.zoom = this.scale
      } else {
        style.transform = `scale(${this.scale})`
        style.transformOrigin = this.isFullscreen ? 'center center' : 'top center'
      }

      return style
    }
  },
  created() {
    this.loadDashboard()
  },
  methods: {
    loadDashboard() {
      getGreenBiCockpitDashboard().then(res => {
        if (res && res.result) {
          this.setData(res.result)
        }
      })
    },
    setData(raw) {
      const { leftPanelData, rightPanelData } = setDashboardData(raw)
      this.leftPanelData = leftPanelData
      this.rightPanelData = rightPanelData
    }
  }
}
</script>

<style scoped lang="scss">
@import './cockpit/styles/green-bi-cockpit.scss';

.cockpit-header {
  position: relative;
  width: 100%;
  height: 84px;
  flex-shrink: 0;

  &__bg {
    position: absolute;
    inset: 0;
    background: url('~@/bi/asset/images/cockpit/topbg.png') center top / 120% 120% no-repeat;
  }

  &__title {
    position: relative;
    z-index: 1;
    margin: 0;
    padding-top: 8px;
    text-align: center;
    font-size: 30px;
    font-weight: 600;
    letter-spacing: 3px;
    color: #fff;
    -webkit-text-fill-color: #fff;
    text-shadow: none;
  }
}
</style>
