<template>
  <div class="policy-graph-tree">
    <div class="graph-panel">
      <div class="level level-0">
        <div class="node main-node">
          <div class="node-icon">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="18" stroke="currentColor" stroke-width="2" fill="rgba(0,255,255,0.08)"/>
              <path d="M20 10v8M20 22v8M10 20h8M22 20h8" stroke="currentColor" stroke-width="2"/>
              <circle cx="20" cy="20" r="4" fill="currentColor"/>
            </svg>
          </div>
          <div class="node-label">政策图谱</div>
        </div>
      </div>

      <div class="connector-level1">
        <div class="main-line" />
        <div class="branch-lines">
          <div v-for="item in categories" :key="item.label" class="branch">
            <div class="branch-line" />
            <div class="arrow-down" />
          </div>
        </div>
      </div>

      <div class="level level-1">
        <div
          v-for="item in categories"
          :key="item.label"
          class="category-col"
        >
          <div class="node" :class="{ active: item.active }">
            <div class="node-icon">
              <component :is="item.icon" />
            </div>
            <div class="node-label">{{ item.label }}</div>
          </div>
          <div v-if="item.subLabel" class="sub-connector">
            <div class="sub-line" />
            <div class="arrow-down-small" />
          </div>
          <div v-if="item.subLabel" class="sub-node">
            <div class="sub-node-label">{{ item.subLabel }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const iconComponents = {
  IconPower: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.5 8H20L15 12L20 16H13.5L12 22L10.5 16H4L9 12L4 8H10.5L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
  },
  IconEnergy: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.8"/><path d="M12 6V12L16 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`
  },
  IconStorage: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="12" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M6 10H18M8 14H16" stroke="currentColor" stroke-width="1.8"/></svg>`
  },
  IconMarket: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M8 12H16M12 8V16" stroke="currentColor" stroke-width="1.8"/></svg>`
  },
  IconNew: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2L14 8H20L15 12L17 18L12 14L7 18L9 12L4 8H10L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`
  },
  IconCarbon: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.8"/><path d="M12 8C14 8 15 9 15 11V13C15 15 14 16 12 16C10 16 9 15 9 13V11C9 9 10 8 12 8Z" stroke="currentColor" stroke-width="1.8"/></svg>`
  },
  IconGov: {
    template: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21V10L12 3L21 10V21H3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 21H16M12 16V21" stroke="currentColor" stroke-width="1.8"/></svg>`
  }
}

export default {
  name: 'PolicyGraphTree',
  components: iconComponents,
  data() {
    return {
      categories: [
        { label: '常规电源', icon: 'IconPower', subLabel: '常规电源电价' },
        { label: '新能源', icon: 'IconEnergy', subLabel: '新能源电价' },
        { label: '储能', icon: 'IconStorage', subLabel: '储能电价' },
        { label: '电力市场', icon: 'IconMarket', subLabel: '工商业用户电价', active: true },
        { label: '新业态', icon: 'IconNew', subLabel: '新业态电价' },
        { label: '碳', icon: 'IconCarbon', subLabel: '碳排放' },
        { label: '政府监管', icon: 'IconGov', subLabel: '输配电价' }
      ]
    }
  }
}
</script>

<style scoped>
.policy-graph-tree {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.graph-panel {
  position: relative;
  width: 100%;
  max-width: 780px;
  padding: 16px 12px 8px;
}

.graph-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 212, 255, 0.08) 1px, transparent 1px);
  background-size: 18px 18px;
  pointer-events: none;
  border-radius: 8px;
}

.level {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.level-0 {
  margin-bottom: 8px;
}

.level-1 {
  gap: 6px;
  flex-wrap: nowrap;
}

.category-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 8px;
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.28);
  border-radius: 16px;
  width: 100%;
  max-width: 96px;
  transition: all 0.25s ease;
}

.node.main-node {
  padding: 14px 28px;
  border-width: 2px;
  background: rgba(0, 212, 255, 0.1);
  max-width: none;
}

.node.active {
  background: rgba(255, 215, 0, 0.12);
  border-color: rgba(255, 215, 0, 0.55);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.15);
}

.node-icon {
  color: #00ffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.node.active .node-icon {
  color: #ffd700;
}

.node-label {
  color: #e8f8ff;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
}

.main-node .node-label {
  font-size: 14px;
  color: #00ffff;
}

.sub-connector {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 4px 0;
}

.sub-line {
  width: 1px;
  height: 14px;
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.6), rgba(0, 212, 255, 0.2));
}

.sub-node {
  padding: 10px 6px;
  background: rgba(0, 40, 80, 0.5);
  border: 1px solid rgba(0, 212, 255, 0.25);
  border-radius: 8px;
  min-height: 72px;
  width: 100%;
  max-width: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sub-node-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 1px;
}

.connector-level1 {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 6px;
  position: relative;
  z-index: 1;
}

.main-line {
  width: 2px;
  height: 24px;
  background: linear-gradient(180deg, #00ffff, rgba(0, 255, 255, 0.3));
}

.branch-lines {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 6px;
  margin-top: -1px;
}

.branch {
  flex: 1;
  max-width: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branch-line {
  width: 1px;
  height: 12px;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.3), #00ffff);
}

.arrow-down,
.arrow-down-small {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 6px solid #00ffff;
  margin-top: -1px;
}

.arrow-down-small {
  border-left-width: 3px;
  border-right-width: 3px;
  border-top-width: 5px;
}
</style>
