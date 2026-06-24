<template>
  <aside class="policy-sidebar">
    <div v-for="panel in panels" :key="panel.title" class="sidebar-panel">
      <div class="panel-header">
        <span class="panel-title">{{ panel.title }}</span>
        <i v-if="panel.more" class="el-icon-more panel-more" />
      </div>

      <div v-if="panel.tabs" class="panel-tabs">
        <span
          v-for="tab in panel.tabs"
          :key="tab"
          class="panel-tab"
          :class="{ active: panel.activeTab === tab }"
          @click="panel.activeTab = tab"
        >{{ tab }}</span>
      </div>

      <ul class="panel-list">
        <li v-for="(item, idx) in panel.items" :key="idx" class="panel-item">
          <div class="item-main">
            <i v-if="item.pdf" class="el-icon-document item-pdf" />
            <span class="item-title">{{ item.title }}</span>
          </div>
          <span class="item-date">{{ item.date }}</span>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script>
export default {
  name: 'PolicySidebar',
  data() {
    return {
      panels: [
        {
          title: '外部动态',
          tabs: ['国内', '国际', '省内'],
          activeTab: '国际',
          items: [
            { title: '欧盟发布新版可再生能源指令修订草案', date: '2025-05-28' },
            { title: '南非 IRP 2025 规划正式发布', date: '2025-05-15' },
            { title: '印度强制风光项目配套储能政策落地', date: '2025-04-22' },
            { title: '韩国分布式能源特区建设方案公布', date: '2025-04-08' }
          ]
        },
        {
          title: '政策追踪',
          more: true,
          items: [
            { title: '关于完善新能源上网电价机制的通知', date: '2025-05-20', pdf: true },
            { title: '新型储能项目管理规范（征求意见稿）', date: '2025-05-12', pdf: true },
            { title: '电力现货市场建设试点扩围方案', date: '2025-04-30' },
            { title: '输配电价监管办法修订说明', date: '2025-04-18' }
          ]
        },
        {
          title: '政策出台',
          items: [
            { title: '国家发改委：2025年能源工作指导意见', date: '2025-05-06' },
            { title: '国家能源局：加强新型电力系统试点通知', date: '2025-04-25' },
            { title: '工信部：工业领域碳达峰实施方案更新', date: '2025-04-10' }
          ]
        },
        {
          title: '政策解读',
          items: [
            { title: '一图读懂：新能源全面入市交易规则', date: '2025-05-18' },
            { title: '专家解读：储能容量电价机制变化', date: '2025-05-02' },
            { title: '政策问答：工商业分时电价如何调整', date: '2025-04-16' }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.policy-sidebar {
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 520px;
  overflow-y: auto;
  padding-right: 4px;
}

.policy-sidebar::-webkit-scrollbar {
  width: 4px;
}

.policy-sidebar::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.3);
  border-radius: 2px;
}

.sidebar-panel {
  background: rgba(0, 30, 60, 0.55);
  border: 1px solid rgba(0, 212, 255, 0.18);
  border-radius: 6px;
  padding: 10px 12px;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
}

.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #00d4ff;
  position: relative;
  padding-left: 10px;
}

.panel-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 12px;
  background: #00d4ff;
  border-radius: 1px;
}

.panel-more {
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  font-size: 14px;
}

.panel-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 8px;
}

.panel-tab {
  padding: 2px 10px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s;
}

.panel-tab.active {
  color: #00d4ff;
  border-color: rgba(0, 212, 255, 0.5);
  background: rgba(0, 212, 255, 0.1);
}

.panel-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.panel-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
  font-size: 11px;
  line-height: 1.45;
}

.panel-item:last-child {
  border-bottom: none;
}

.item-main {
  display: flex;
  align-items: flex-start;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.item-pdf {
  color: #ffd700;
  font-size: 12px;
  margin-top: 1px;
  flex-shrink: 0;
}

.item-title {
  color: rgba(255, 255, 255, 0.82);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.item-date {
  color: rgba(255, 255, 255, 0.4);
  white-space: nowrap;
  flex-shrink: 0;
  font-size: 10px;
}
</style>
