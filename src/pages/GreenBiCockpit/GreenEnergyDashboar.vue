<template>
  <div class="green-bi-cockpit">
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
</template>

<script>
import { applyCockpitTheme } from './cockpit/utils/chartTheme'
import { setDashboardData, createEmptyDashboardState } from './cockpit/utils/setDashboardData'
import cockpitViewportMixin from './cockpit/mixins/cockpitViewport'
import CockpitLeftMainPanel from './cockpit/CockpitLeftMainPanel.vue'
import CockpitRightMainPanel from './cockpit/CockpitRightMainPanel.vue'
import { getGreenBiCockpitDashboard } from './cockpit/api/greenBiCockpit'
import dashboardData from './cockpit/dashboardData.json'

applyCockpitTheme()

const emptyState = createEmptyDashboardState()

export default {
  name: 'GreenEnergyDashboard',
  components: { CockpitLeftMainPanel, CockpitRightMainPanel },
  mixins: [cockpitViewportMixin],
  data() {
    return {
      leftPanelData: emptyState.leftPanelData,
      rightPanelData: emptyState.rightPanelData
    }
  },
  created() {
    this.setData(dashboardData)
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
@import './cockpit/styles/design';
@import './cockpit/styles/green-bi-cockpit.scss';

.cockpit-header {
  position: relative;
  width: 100%;
  height: vw(84);
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
    padding-top: vw(8);
    text-align: center;
    font-size: vw(30);
    font-weight: 600;
    letter-spacing: vw(3);
    color: #fff;
    -webkit-text-fill-color: #fff;
    text-shadow: none;
  }
}
</style>
