<template>
  <div class="policy-home-container">
    <!-- 平台顶栏 -->
    <header class="platform-header">
      <div class="header-left">
        <div class="sg-logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="#00d4ff" stroke-width="1.5"/>
            <path d="M10 18h16M18 10v16" stroke="#00d4ff" stroke-width="1.5"/>
          </svg>
        </div>
        <div class="title-block">
          <div class="main-title">互联网+发展 辅助决策分析平台</div>
          <div class="sub-title">STATE GRID · INTERNET PLUS DEVELOPMENT DECISION ANALYSIS PLATFORM</div>
        </div>
      </div>
      <div class="header-center">
        <div class="scope-select">
          <span>全网视角</span>
          <i class="el-icon-arrow-down" />
        </div>
      </div>
      <div class="header-right">
        <span class="header-date">2025-06-09</span>
        <div class="header-user">
          <i class="el-icon-user" />
          <span>刘安安</span>
          <i class="el-icon-arrow-down" />
        </div>
        <i class="el-icon-bell header-icon" />
        <i class="el-icon-setting header-icon" />
      </div>
    </header>

    <!-- 二级导航 -->
    <nav class="sub-nav">
      <span
        v-for="tab in subTabs"
        :key="tab"
        class="sub-tab"
        :class="{ active: tab === '政策图谱' }"
      >{{ tab }}</span>
      <div class="sub-search">
        <input type="text" placeholder="请输入关键词" />
        <i class="el-icon-search" />
      </div>
    </nav>

    <!-- 主体 -->
    <div class="body-layout">
      <div class="upper-section">
        <policy-graph-tree />
        <policy-sidebar />
      </div>

      <policy-timeline-g6
        v-model="activeTimelineId"
        :points="timelinePoints"
        :point-spacing="200"
        :padding-x="120"
      />
    </div>
  </div>
</template>

<script>
import PolicyGraphTree from './components/PolicyGraphTree.vue'
import PolicySidebar from './components/PolicySidebar.vue'
import PolicyTimelineG6 from './components/PolicyTimelineG6.vue'
import { SUB_TABS, TIMELINE_DATA } from './utils/policyHomeData'

export default {
  name: 'PagePolicyHome',
  components: {
    PolicyGraphTree,
    PolicySidebar,
    PolicyTimelineG6
  },
  data() {
    return {
      subTabs: SUB_TABS,
      timelinePoints: TIMELINE_DATA,
      activeTimelineId: 'e2025-01'
    }
  }
}
</script>

<style scoped>
.policy-home-container {
  min-height: calc(100vh - 56px);
  background: radial-gradient(ellipse at 50% 0%, #0d2847 0%, #060e1a 55%, #040810 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
}

/* ===== 顶栏 ===== */
.platform-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.sg-logo {
  display: flex;
  align-items: center;
  justify-content: center;
}

.main-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.sub-title {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.8px;
  margin-top: 2px;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.scope-select {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 16px;
  background: rgba(0, 212, 255, 0.08);
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 4px;
  font-size: 13px;
  color: #00d4ff;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 18px;
  font-size: 13px;
}

.header-date {
  color: rgba(255, 255, 255, 0.65);
}

.header-user {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.85);
}

.header-icon {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
}

.header-icon:hover {
  color: #00d4ff;
}

/* ===== 二级导航 ===== */
.sub-nav {
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.25);
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  flex-shrink: 0;
  gap: 2px;
}

.sub-tab {
  padding: 10px 18px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.sub-tab.active {
  color: #00d4ff;
  border-bottom-color: #00d4ff;
}

.sub-tab:hover {
  color: rgba(255, 255, 255, 0.85);
}

.sub-search {
  margin-left: auto;
  position: relative;
  width: 220px;
}

.sub-search input {
  width: 100%;
  padding: 6px 12px;
  padding-right: 32px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
}

.sub-search input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.sub-search .el-icon-search {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

/* ===== 主体布局 ===== */
.body-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 20px 16px;
  min-height: 0;
}

.upper-section {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 380px;
  margin-bottom: 8px;
}

@media (max-width: 1100px) {
  .upper-section {
    flex-direction: column;
  }

  .sub-tab {
    padding: 8px 10px;
    font-size: 12px;
  }
}
</style>
