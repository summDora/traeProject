<template>
  <div class="page11-container">
    <div class="stats-grid">
      <div 
        v-for="(item, index) in mockData" 
        :key="index" 
        :class="['stat-card', colors[index % colors.length]]"
      >
        <div class="stat-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path :d="icons[index % icons.length]"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ item.label }}</span>
          <span class="stat-value">{{ item.value }}<span class="stat-unit">个</span></span>
          <span class="stat-ratio">占比 {{ item.ratio }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page11',
  data() {
    return {
      colors: ['green', 'blue', 'orange', 'purple'],
      icons: [
        'M16 21V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2ZM10 14h4',
        'M18 20V10M12 20V4M6 20v-6',
        'M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z',
        'M12 6v6l4 2M12 12a10 10 0 1 0 0-20 10 10 0 0 0 0 20z'
      ],
      mockData: [
        { label: 'xxx类型', value: 56, ratio: '43.75%' },
        { label: 'xxx类型', value: 34, ratio: '26.56%' },
        { label: 'xxx类型', value: 22, ratio: '17.19%' },
        { label: 'xxx类型', value: 16, ratio: '12.50%' },
        { label: 'xxx类型', value: 45, ratio: '35.16%' },
        { label: 'xxx类型', value: 28, ratio: '21.88%' },
        { label: 'xxx类型', value: 19, ratio: '14.84%' }
      ]
    }
  }
}
</script>

<style scoped>
.page11-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  border-radius: 12px;
}

.stat-card.green {
  background-color: #f0fdf4;
}

.stat-card.green .stat-icon-wrap {
  background-color: #dcfce7;
  color: #4ade80;
}

.stat-card.green .stat-value {
  color: #22c55e;
}

.stat-card.blue {
  background-color: #eff6ff;
}

.stat-card.blue .stat-icon-wrap {
  background-color: #dbeafe;
  color: #60a5fa;
}

.stat-card.blue .stat-value {
  color: #3b82f6;
}

.stat-card.orange {
  background-color: #fff7ed;
}

.stat-card.orange .stat-icon-wrap {
  background-color: #ffedd5;
  color: #fb923c;
}

.stat-card.orange .stat-value {
  color: #f97316;
}

.stat-card.purple {
  background-color: #faf5ff;
}

.stat-card.purple .stat-icon-wrap {
  background-color: #f3e8ff;
  color: #a78bfa;
}

.stat-card.purple .stat-value {
  color: #8b5cf6;
}

.stat-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrap svg {
  width: 24px;
  height: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
}

.stat-unit {
  font-size: 14px;
  font-weight: normal;
  color: #999;
  margin-left: 4px;
}

.stat-ratio {
  font-size: 12px;
  color: #999;
  padding-top: 8px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
</style>