<!--
 * 首页左侧：团队结构
 * 三个卡片宽度 1920 → 409px / 2880 → 488px（--home-left-card-w 由 index.vue 写入）
 *   - 战略联合推演中枢 / 外部专家：底色 research-team-frame.png（412 × 90）
 *   - 研究团队：底色 research-team-frame-tall.png（412 × 555）
 * 卡片背景高度跟随内容，内容结束背景图即结束
-->
<template>
  <aside class="home-left-panel" :class="{ 'home-left-panel--wide': wide }">
    <p class="home-left-panel__caption">团队结构</p>

    <div
      v-for="item in hubs"
      :key="item.title"
      class="home-left-panel__card home-left-panel__card--hub"
    >
      <div class="home-left-panel__head">
        <img class="home-left-panel__icon" :src="item.icon" alt="" />
        <div class="home-left-panel__titles">
          <p class="root-home-panel-title">{{ item.title }}</p>
          <p class="root-home-panel-subtitle">{{ item.subtitle }}</p>
        </div>
      </div>

      <div class="home-left-panel__names home-left-panel__names--plain">
        <span v-for="name in item.names" :key="name">{{ name }}</span>
      </div>
    </div>

    <div class="home-left-panel__card home-left-panel__card--team">
      <div class="home-left-panel__head">
        <img class="home-left-panel__icon" :src="teamIcon" alt="" />
        <div class="home-left-panel__titles">
          <p class="root-home-panel-title">研究团队</p>
          <p class="root-home-panel-subtitle">Research team</p>
        </div>
      </div>

      <div class="home-left-panel__groups">
        <div
          v-for="group in groups"
          :key="group.name"
          class="home-left-panel__group"
        >
          <p class="home-left-panel__group-name">{{ group.name }}</p>
          <div class="home-left-panel__names">
            <span v-for="name in group.names" :key="name">{{ name }}</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
import iconOperation from "@/asset/images/home/icon-power-system-operation.png";
import iconPerson from "@/asset/images/home/icon-power-system-person.png";
import iconTeam from "@/asset/images/home/icon-power-system-team.png";

export default {
  name: "HomeLeftPanel",
  props: {
    // 2880（wide）下小卡片的名单与标题同行，1920（standard）下换行展示
    wide: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      teamIcon: iconTeam,
      hubs: [
        {
          title: "战略联合推演中枢",
          subtitle: "Strategic Joint DeductionHub",
          icon: iconOperation,
          names: ["冯昊", "徐晨博", "周林"],
        },
        {
          title: "外部专家",
          subtitle: "external expert",
          icon: iconPerson,
          names: ["文福栓", "鲁刚", "李知艺"],
        },
      ],
      groups: [
        {
          name: "全战略态势研判",
          names: ["陈沁语", "倪筹帷", "叶玲节", "张韦维", "张艺迪"],
        },
        {
          name: "全经济综合分析",
          names: ["马蕾", "文凡", "董丹煌", "陈彦佐", "吴舒泓", "杨黎"],
        },
        {
          name: "全市场规划仿真",
          names: ["兰洲", "周翰泽", "顾晨临"],
        },
        {
          name: "全企业经营推演",
          names: ["王坤", "张一弘", "沈妍", "周婧瑜", "杨侃", "冯也"],
        },
        {
          name: "全应用场景实验",
          names: ["高强", "吴莹", "张耀", "殷永亮", "杜协峻"],
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.home-left-panel {
  // ---- 设计稿尺寸（卡宽 488 基准，单位 px）----
  --card-pad-x: 16;
  --card-pad-y: 12;
  --card-icon: 58;
  --card-gap: 10;
  --name-font: 18;
  --group-font: 17;

  display: flex;
  flex-direction: column;
  gap: calc(10 * var(--home-s) * 1px);
  width: var(--home-left-card-w);
}

// 标题：与经营预测指标页 jy-section__head 一致的竖条样式
.home-left-panel__caption {
  position: relative;
  display: flex;
  align-items: center;
  gap: calc(8 * var(--home-s) * 1px);
  margin: calc(6 * var(--home-s) * 1px) 0 calc(2 * var(--home-s) * 1px);
  color: #eafcff;
  font-size: calc(15 * 1px);
  font-weight: 600;
  letter-spacing: 1px;

  &::before {
    content: "";
    width: calc(3 * var(--home-s) * 1px);
    height: calc(14 * var(--home-s) * 1px);
    background: #00ffff;
  }
}

.home-left-panel__card {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  box-sizing: border-box;
}

// 小卡片：切图 412 × 90，高度跟随内容
.home-left-panel__card--hub {
  padding: calc(var(--card-pad-y) * var(--home-s) * 1px)
    calc(var(--card-pad-x) * var(--home-s) * 1px);
  background-image: url("~@/asset/images/home/research-team-frame.png");
  justify-content: center;
  gap: calc(2 * var(--home-s) * 1px);
}

.home-left-panel--wide .home-left-panel__card--hub {
  flex-direction: row;
  align-items: center;
  gap: calc(26 * var(--home-s) * 1px);
  justify-content: space-between;
}

.home-left-panel--wide .home-left-panel__titles {
  flex: 0 0 auto;
}

.home-left-panel--wide .home-left-panel__names--plain {
  margin-left: 0;
  gap: calc(22 * var(--home-s) * 1px);
}

// 研究团队：切图 412 × 555，高度跟随内容
.home-left-panel__card--team {
  padding: calc(8 * var(--home-s) * 1px)
    calc(var(--card-pad-x) * var(--home-s) * 1px)
    calc(var(--card-pad-y) * var(--home-s) * 1px);
  background-image: url("~@/asset/images/home/research-team-frame-tall.png");
  overflow: hidden;
}

.home-left-panel__head {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: calc(var(--card-gap) * var(--home-s) * 1px);
  min-width: 0;
}

.home-left-panel__icon {
  flex: 0 0 auto;
  width: calc(var(--card-icon) * 1px);
  height: calc(var(--card-icon) * 1px);
  object-fit: contain;
}

.home-left-panel__titles {
  min-width: 0;
}

// 标题/副标题的基础样式见 styles/index.scss 的 .root-home-panel-title / -subtitle

// 名单
.home-left-panel__names {
  display: flex;
  flex-wrap: wrap;
  // 胶囊间距两个设计稿下都是 6px
  gap: 6px;
}

.home-left-panel__names > span {
  color: #e2f8ff;
  font-size: calc(var(--name-font) * 1px);
  line-height: 1;
  white-space: nowrap;
  border: 0.5px solid #2ec0ff33;
  background: linear-gradient(180deg, #023 0%, #00446678 100%);
}

// 研究团队的人名胶囊：两个设计稿下都是固定 72 × 31
.home-left-panel__card--team .home-left-panel__names > span {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 72px;
  height: 31px;
  padding: 0;
  border-radius: 7px;
}

// 小卡片的名单是纯文字（无底框）
.home-left-panel__names--plain {
  margin-left: calc((var(--card-icon) + var(--card-gap)) * 1px);
  gap: calc(20 * var(--home-s) * 1px);
}

.home-left-panel__names--plain > span {
  padding: 0;
  border: 0;
  background: transparent;
  color: #f2feff;
  letter-spacing: calc(1 * var(--home-s) * 1px);
}

.home-left-panel__groups {
  display: flex;
  flex-direction: column;
  margin-top: calc(10 * var(--home-s) * 1px);
  min-height: 0;
}

.home-left-panel__group {
  // 常规 12px；矮屏下由 index.vue 按实测溢出量收紧（最低 2px），保证 7 个组放得下
  padding: var(--home-group-pad, 12px) 0;
  border-bottom: 1px solid rgba(96, 200, 235, 0.522);
  background: linear-gradient(90deg, #0c1e2700 0.67%, #060d1c7a 26%, #0c122775 62%, #0c1e2700 92.26%);

  &:last-child {
    border-bottom: 0;
  }
}

.home-left-panel__group-name {
  margin: 0 0 calc(8 * var(--home-s) * 1px);
  color: #eafcff;
  font-size: calc(var(--group-font) * 1px);
  letter-spacing: calc(1 * var(--home-s) * 1px);
  line-height: 1.2;
}
</style>
