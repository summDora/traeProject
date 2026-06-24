<template>
  <div class="pagezc-container">
    <div class="policy-graph-wrapper">
      <div class="graph-container">
        <div class="level level-0">
          <div class="node main-node">
            <div class="node-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2" fill="rgba(0,255,255,0.1)"/>
                <path d="M20 10v8M20 22v8M10 20h8M22 20h8" stroke="currentColor" stroke-width="2"/>
                <circle cx="20" cy="20" r="4" fill="currentColor"/>
              </svg>
            </div>
            <div class="node-label">政策图谱</div>
          </div>
        </div>
        
        <div class="connector-level1">
          <div class="main-line"></div>
          <div class="branch-lines">
            <div class="branch" v-for="(item, index) in level1Nodes" :key="index">
              <div class="branch-line"></div>
              <div class="arrow-down"></div>
            </div>
          </div>
        </div>
        
        <div class="level level-1">
          <div class="node" v-for="item in level1Nodes" :key="item.label">
            <div class="node-icon">
              <component :is="getIcon(item.icon)" />
            </div>
            <div class="node-label">{{ item.label }}</div>
          </div>
        </div>
        
        <div class="connector-level2" v-if="hasActiveLevel1">
          <div class="main-line-vertical"></div>
          <div class="branch-lines-vertical">
            <div class="branch-v" v-for="(item, index) in level2Nodes" :key="index">
              <div class="branch-line-v"></div>
              <div class="arrow-down-small"></div>
            </div>
          </div>
        </div>
        
        <div class="level level-2" v-if="hasActiveLevel1">
          <div class="node vertical-node" v-for="item in level2Nodes" :key="item.label">
            <div class="node-icon small-icon">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <line x1="5" y1="8" x2="15" y2="8" stroke="currentColor" stroke-width="1"/>
                <line x1="5" y1="12" x2="12" y2="12" stroke="currentColor" stroke-width="1"/>
              </svg>
            </div>
            <div class="node-label vertical-label">{{ item.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageZC',
  data() {
    return {
      hasActiveLevel1: true,
      level1Nodes: [
        { label: '常规电源', icon: 'icon-power' },
        { label: '新能源', icon: 'icon-energy' },
        { label: '储能', icon: 'icon-storage' },
        { label: '电力市场', icon: 'icon-market', active: true },
        { label: '新业态', icon: 'icon-new' },
        { label: '碳', icon: 'icon-carbon' },
        { label: '政府监督', icon: 'icon-gov' }
      ],
      level2Nodes: [
        { label: '用户电价图谱' },
        { label: '输配电价图谱' },
        { label: '电源价格政策图谱' }
      ]
    }
  },
  components: {
    'icon-power': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 8H20L15 12L20 16H13.5L12 22L10.5 16H4L9 12L4 8H10.5L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
    },
    'icon-energy': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
    },
    'icon-storage': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="2"/><path d="M6 10H18M8 14H16" stroke="currentColor" stroke-width="2"/></svg>`
    },
    'icon-market': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12H16M12 8V16" stroke="currentColor" stroke-width="2"/></svg>`
    },
    'icon-new': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`
    },
    'icon-carbon': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8C14 8 15 9 15 11V13C15 15 14 16 12 16C10 16 9 15 9 13V11C9 9 10 8 12 8Z" stroke="currentColor" stroke-width="2"/></svg>`
    },
    'icon-gov': {
      template: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 21V10L12 3L21 10V21H3Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8 21H16M12 16V21" stroke="currentColor" stroke-width="2"/></svg>`
    }
  },
  methods: {
    getIcon(iconName) {
      return iconName
    }
  }
}
</script>

<style scoped>
.pagezc-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 96px);
}

.policy-graph-wrapper {
  width: 936px;
  height: 680px;
  background: linear-gradient(135deg, #0a1628 0%, #0d2847 50%, #0a1628 100%);
  border-radius: 12px;
  padding: 30px;
  overflow: auto;
  min-width: 936px;
  box-shadow: 0 0 60px rgba(0, 255, 255, 0.15);
  position: relative;
}

.policy-graph-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(circle, rgba(0, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 20px 20px;
  border-radius: 12px;
  pointer-events: none;
}

.graph-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 620px;
}

.level {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.level-0 {
  margin-bottom: 20px;
}

.level-1 {
  margin-bottom: 20px;
}

.level-2 {
  margin-top: 20px;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(0, 255, 255, 0.08);
  border: 1px solid rgba(0, 255, 255, 0.3);
  border-radius: 20px;
  min-width: 100px;
  transition: all 0.3s ease;
}

.node:hover {
  background: rgba(0, 255, 255, 0.15);
  border-color: rgba(0, 255, 255, 0.5);
  transform: translateY(-2px);
}

.node.main-node {
  background: rgba(0, 255, 255, 0.12);
  border-width: 2px;
  padding: 16px 30px;
}

.node.active {
  background: rgba(0, 255, 255, 0.2);
  border-color: rgba(0, 255, 255, 0.6);
}

.vertical-node {
  padding: 16px 12px;
  border-radius: 10px;
  min-height: 180px;
}

.node-icon {
  color: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node-icon svg {
  filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.5));
}

.small-icon svg {
  width: 20px;
  height: 20px;
}

.node-label {
  color: #00ffff;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
}

.vertical-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 13px;
}

.connector-level1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.main-line {
  width: 2px;
  height: 30px;
  background: linear-gradient(180deg, #00ffff, transparent);
}

.branch-lines {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: -2px;
}

.branch {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branch-line {
  width: 2px;
  height: 15px;
  background: linear-gradient(180deg, transparent, #00ffff);
}

.arrow-down {
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 8px solid #00ffff;
  margin-top: -2px;
}

.connector-level2 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.main-line-vertical {
  width: 2px;
  height: 25px;
  background: linear-gradient(180deg, #00ffff, transparent);
  margin-left: 240px;
}

.branch-lines-vertical {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: -2px;
  margin-left: 240px;
}

.branch-v {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branch-line-v {
  width: 2px;
  height: 15px;
  background: linear-gradient(180deg, transparent, #00ffff);
}

.arrow-down-small {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #00ffff;
  margin-top: -2px;
}

@media (max-width: 960px) {
  .policy-graph-wrapper {
    min-width: 936px;
  }
}
</style>