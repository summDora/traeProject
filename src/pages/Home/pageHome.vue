<template>
  <div class="home-page">
    <section class="home-hero">
      <div class="home-hero-inner">
        <div class="home-hero-copy">
          <p class="home-kicker">内部演示台</p>
          <h1>SUMMERDORA</h1>
          <p class="home-lead">
            从元素示例、业务表格到储能评估与驾驶舱，按模块进入对应页面。
          </p>
        </div>
        <img class="home-mascot" :src="mascotSrc" alt="" />
      </div>
    </section>

    <section class="home-body">
      <div
        v-for="group in groups"
        :key="group.title"
        class="home-card"
        :class="'is-' + group.tone"
        @click="enter(group.entry)"
      >
        <div class="home-card-top">
          <h2>{{ group.title }}</h2>
          <span class="home-count">{{ group.children.length }} 项</span>
        </div>
        <p class="home-blurb">{{ group.blurb }}</p>
        <div class="home-tags">
          <button
            v-for="child in group.preview"
            :key="child.path"
            type="button"
            class="home-tag"
            @click.stop="enter(child.path)"
          >
            {{ child.title }}
          </button>
          <span v-if="group.more" class="home-tag is-more"
            >+{{ group.more }}</span
          >
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { navMenus } from "../../router";

const GROUP_META = {
  元素: { blurb: "表格、表单与基础组件示例", tone: "teal" },
  业务工具: { blurb: "时间联动、价格预测与任务监控", tone: "blue" },
  "python 迁移": { blurb: "储能优化调度与绿电直连评估", tone: "green" },
  大屏: { blurb: "全屏驾驶舱与可视化大屏", tone: "violet" },
  政策图谱: { blurb: "政策检索、图谱与知识关系", tone: "amber" },
  成效页面: { blurb: "需求管理、评审与项目成效", tone: "slate" },
};

export default {
  name: "PageHome",
  data: function () {
    return {
      mascotSrc: require("./mascot.png"),
    };
  },
  computed: {
    groups: function () {
      return (navMenus || [])
        .map(function (item) {
          const children =
            item.children ||
            (item.path ? [{ path: item.path, title: item.title }] : []);
          const meta = GROUP_META[item.title] || {
            blurb: "进入该模块下的页面",
            tone: "teal",
          };
          return {
            title: item.title,
            blurb: meta.blurb,
            tone: meta.tone,
            children: children,
            preview: children.slice(0, 4),
            more: children.length > 4 ? children.length - 4 : 0,
            entry: children[0] && children[0].path,
          };
        })
        .filter(function (g) {
          return g.entry;
        });
    },
  },
  methods: {
    enter: function (path) {
      if (path) this.$router.push(path);
    },
  },
};
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 56px);
  background: radial-gradient(
      1200px 420px at 8% -10%,
      rgba(14, 116, 144, 0.1),
      transparent 55%
    ),
    radial-gradient(
      900px 360px at 100% 8%,
      rgba(94, 106, 254, 0.08),
      transparent 50%
    ),
    #f4f7f8;
}

.home-hero {
  position: relative;
  overflow: visible;
  padding: 90px 40px 70px;
  background: linear-gradient(135deg, #0e7490 0%, #0c5c75 58%, #164e63 100%);
  color: #fff;
  z-index: 1;
}

.home-hero-inner {
  position: relative;
  max-width: 1120px;
  margin: 0 auto;
}

.home-hero-copy {
  min-width: 0;
  max-width: 640px;
}

.home-mascot {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  height: 320px;
  width: auto;
  pointer-events: none;
  display: block;
  background: transparent;
  z-index: 2;
}

.home-kicker {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(230, 244, 246, 0.78);
  margin-bottom: 10px;
}

.home-hero h1 {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.15;
  margin-bottom: 12px;
}

.home-lead {
  max-width: 560px;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(230, 244, 246, 0.88);
}

.home-body {
  max-width: 1120px;
  margin: 0 auto;
  padding: 28px 40px 48px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.home-card {
  height: 188px;
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #e6eef0;
  border-radius: 14px;
  padding: 20px 20px 16px;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(15, 33, 27, 0.04);
  transition: transform 0.18s ease, box-shadow 0.18s ease,
    border-color 0.18s ease;
  border-top: 3px solid #0e7490;
}

.home-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(15, 33, 27, 0.08);
  border-color: #cfe3e8;
}

.home-card.is-blue {
  border-top-color: #5b9fe8;
}
.home-card.is-green {
  border-top-color: #3cb89a;
}
.home-card.is-violet {
  border-top-color: #5e6afe;
}
.home-card.is-amber {
  border-top-color: #e9a825;
}
.home-card.is-slate {
  border-top-color: #64748b;
}
.home-card.is-teal {
  border-top-color: #0e7490;
}

.home-card-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.home-card h2 {
  font-size: 18px;
  color: #134e4a;
  font-weight: 700;
}

.home-count {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
}

.home-blurb {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.home-tags {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 8px;
}

.home-tag {
  appearance: none;
  border: none;
  font-size: 12px;
  font-family: inherit;
  font-weight: 600;
  color: #0f5c6e;
  background: #eef7f8;
  border-radius: 999px;
  padding: 6px 12px;
  line-height: 1.4;
  cursor: pointer;
}

.home-tag:hover {
  background: #d8eef2;
  color: #0e7490;
}

.home-tag.is-more,
.home-tag.is-more:hover {
  color: #64748b;
  background: #f1f5f9;
  cursor: default;
}

@media (max-width: 1024px) {
  .home-body {
    grid-template-columns: 1fr 1fr;
    padding: 24px 20px 40px;
  }
  .home-hero {
    padding: 36px 20px 28px;
  }
  .home-mascot {
    height: 250px;
  }
}

@media (max-width: 640px) {
  .home-body {
    grid-template-columns: 1fr;
  }
  .home-hero h1 {
    font-size: 28px;
  }
  .home-mascot {
    display: none;
  }
}
</style>
