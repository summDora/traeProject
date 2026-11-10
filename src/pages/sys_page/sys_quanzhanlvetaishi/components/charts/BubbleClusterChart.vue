<template>
  <div class="bubble-chart" :class="rootClass">
    <div ref="stage" class="bubble-chart__stage">
      <!-- 轨道 + 中心连线（装饰层） -->
      <!-- <svg class="bubble-chart__deco" :width="stageSize.w" :height="stageSize.h">
        <g class="bubble-chart__orbits">
          <ellipse
            v-for="orbit in orbits"
            :key="orbit.id"
            :cx="orbit.cx"
            :cy="orbit.cy"
            :rx="orbit.rx"
            :ry="orbit.ry"
          />
        </g>
        <g class="bubble-chart__links">
          <line
            v-for="link in links"
            :key="link.key"
            :x1="link.x1"
            :y1="link.y1"
            :x2="link.x2"
            :y2="link.y2"
          />
        </g>
      </svg> -->

      <button
        v-for="item in layout"
        :key="item.key"
        type="button"
        class="bubble"
        :class="{ 'is-center': item.isCenter, 'is-active': item.key === activeKey }"
        :style="bubbleStyle(item)"
        :title="item.name"
        @click="select(item)"
      >
        <span class="bubble__name">{{ item.name }}</span>
      </button>
    </div>

    <!-- 右侧：当前气泡对应的三种政策类型卡片（固定三张，高度随省份数量） -->
    <div v-if="showCards" class="bubble-chart__cards">
      <header class="cards-head">
        <img class="cards-head__arrow cards-head__arrow--left" :src="arrowRight" alt="" />
        <span class="cards-head__title">{{ activeName }}</span>
        <img class="cards-head__arrow cards-head__arrow--right" :src="arrowLeft" alt="" />
      </header>

      <section
        v-for="card in activeCards"
        :key="card.key"
        class="type-card"
        :class="`type-card--${card.key}`"
      >
        <header class="type-card__head">
          <img class="type-card__icon" :src="cardIcon(card.key)" alt="" />
          <span class="type-card__title">{{ card.title }}</span>
          <span class="type-card__count">
            <b>{{ card.provinces.length }}</b>
            <i>个</i>
          </span>
        </header>

        <ul v-show="!folded[card.key]" class="type-card__grid">
          <li
            v-for="p in card.provinces"
            :key="p.name"
            class="type-prov"
            :class="`score--${scoreTone(p.score)}`"
          >
            <span class="type-prov__name">{{ p.name }}</span>
            <span class="type-prov__score">{{ p.score }}</span>
          </li>
        </ul>

        <button
          type="button"
          class="type-card__fold"
          :class="{ 'is-folded': folded[card.key] }"
          @click="toggleFold(card.key)"
        >
          <span>{{ folded[card.key] ? "展开" : "收起" }}</span>
          <button
            type="button"
            class="type-card__arrow"
            :class="{ 'is-down': folded[card.key] }"
            :aria-label="folded[card.key] ? '展开卡片' : '折叠卡片'"
          ></button>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import qp1 from "@/asset/images/qzlts/qp1.png";
import qp2 from "@/asset/images/qzlts/qp2.png";
import qp3 from "@/asset/images/qzlts/qp3.png";
import qp4 from "@/asset/images/qzlts/qp4.png";
import qp5 from "@/asset/images/qzlts/qp5.png";
import iconJili from "@/asset/images/qzlts/jili.png";
import iconYushu from "@/asset/images/qzlts/yushu.png";
import iconHuhe from "@/asset/images/qzlts/huhe.png";
import arrowLeft from "@/asset/images/qzlts/icon-zc-left.png";
import arrowRight from "@/asset/images/qzlts/icon-zc-right.png";

/**
 * 气泡底图（qp1 ~ qp5）：自带渐变球体 + 高亮弧线 + 外发光
 * rgb 用于外发光 / 选中态光晕，ink 为文字色
 */
const SKINS = [
  { src: qp1, rgb: "26, 219, 171", ink: "#ffffff" },
  { src: qp2, rgb: "63, 216, 232", ink: "#ffffff" },
  { src: qp3, rgb: "255, 140, 240", ink: "#ffffff" },
  { src: qp4, rgb: "255, 154, 60", ink: "#ffffff" },
  { src: qp5, rgb: "190, 255, 60", ink: "#ffffff" },
];

/** 右侧三种政策类型卡片图标 */
const CARD_ICONS = {
  incentive: iconJili,
  constraint: iconYushu,
  mixed: iconHuhe,
};

export default {
  name: "BubbleClusterChart",
  props: {
    /** [{ key, name, count }]，count 决定气泡大小 */
    data: { type: Array, default: () => [] },
    theme: { type: String, default: "dark" },
    /** 当前选中气泡 key（支持 v-model） */
    value: { type: String, default: "" },
    /** 中心气泡半径基准（设计稿 185px，随页面缩放） */
    baseRadius: { type: Number, default: 185 },
    /** 右侧卡片数据：{ [bubbleKey]: [{ key, title, provinces: [{ name, score }] }] } */
    cardMap: { type: Object, default: () => ({}) },
    /** 是否显示右侧卡片 */
    showCards: { type: Boolean, default: true },
  },
  data() {
    return {
      arrowLeft,
      arrowRight,
      layout: [],
      // links: [],
      orbits: [],
      stageSize: { w: 0, h: 0 },
      activeKey: this.value,
      bgMap: {},
      folded: {},
      resizeTimer: null,
      resizeObserver: null,
    };
  },
  computed: {
    rootClass() {
      return this.theme === "light" ? "bubble-chart--light" : "bubble-chart--dark";
    },
    bubbles() {
      return (this.data || []).slice();
    },
    /** 当前选中气泡对应的三张卡片 */
    activeCards() {
      return this.cardMap[this.activeKey] || [];
    },
    /** 当前选中气泡名称（右侧卡片组标题） */
    activeName() {
      const hit = this.bubbles.find((b) => b.key === this.activeKey);
      return hit ? hit.name : "";
    },
  },
  watch: {
    value(val) {
      this.activeKey = val;
    },
    data: {
      deep: true,
      handler() {
        this.assignBackdrops();
        this.$nextTick(this.rebuild);
      },
    },
  },
  mounted() {
    this.assignBackdrops();
    this.$nextTick(this.rebuild);
    window.addEventListener("resize", this.onResize);
    if (typeof ResizeObserver !== "undefined" && this.$refs.stage) {
      this.resizeObserver = new ResizeObserver(this.onResize);
      this.resizeObserver.observe(this.$refs.stage);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }
  },
  methods: {
    /** 每个气泡随机分配一张底图（刷新页面会重新随机） */
    assignBackdrops() {
      const map = { ...this.bgMap };
      this.bubbles.forEach((item) => {
        if (map[item.key] === undefined) {
          map[item.key] = Math.floor(Math.random() * SKINS.length);
        }
      });
      this.bgMap = map;
      if (!this.activeKey && this.bubbles.length) {
        this.activeKey = this.bubbles[0].key;
      }
    },
    onResize() {
      if (this.resizeTimer) clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.resizeTimer = null;
        this.rebuild();
      }, 120);
    },
    select(item) {
      this.activeKey = item.key;
      this.$emit("input", item.key);
      this.$emit("select", item);
    },
    cardIcon(key) {
      return CARD_ICONS[key] || CARD_ICONS.mixed;
    },
    /** 省份得分配色：>=80 绿；<40 红；40~60 黄；60~80 蓝 */
    scoreTone(score) {
      if (score >= 80) return "green";
      if (score < 40) return "red";
      if (score < 60) return "yellow";
      return "blue";
    },
    toggleFold(key) {
      this.$set(this.folded, key, !this.folded[key]);
    },
    /**
     * 气泡布局（对齐设计稿）：
     * 1. 数量最大者居中，半径 = baseRadius * --qzlt-s，底图固定 qp1 + 指定发光
     * 2. 其余按数量从大到小依次落到若干层同心轨道上（内圈在前 30%，其余外圈）
     * 3. 重叠时沿两点连线方向互相推开，且不超出画布
     */
    rebuild() {
      const el = this.$refs.stage;
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h) return;
      this.stageSize = { w, h };

      const list = [...this.bubbles].sort((a, b) => b.count - a.count);
      if (!list.length) {
        this.layout = [];
        // this.links = [];
        this.orbits = [];
        return;
      }

      const scale =
        parseFloat(getComputedStyle(el).getPropertyValue("--qzlt-s")) || 1;
      const base = Math.min(w, h);
      const centerR = Math.min(this.baseRadius * scale, base * 0.3);
      const maxCount = list[0].count || 1;
      const gap = Math.max(6, base * 0.014);
      const edge = Math.max(2, base * 0.006);
      const cx = w / 2;
      const cy = h / 2;
      const innerNum = Math.max(1, Math.ceil(list.length * 0.3) - 1);
      const center = { ...list[0], r: centerR, x: cx, y: cy, isCenter: true };

      // 排不下就逐步收小非中心气泡重排，最后取冲突最少的一次
      let best = null;
      for (let attempt = 0; attempt < 12; attempt++) {
        const factor = Math.max(0.4, 1 - attempt * 0.06);
        const sized = list.slice(1).map((item) => {
          const t = Math.max(0, Math.min(1, item.count / maxCount));
          return {
            ...item,
            r: Math.max(centerR * 0.09, centerR * Math.pow(t, 0.85) * factor),
          };
        });

        const innerItems = sized.slice(0, innerNum);
        const outerItems = sized.slice(innerNum);
        const innerMaxR = Math.max(centerR * 0.2, ...innerItems.map((i) => i.r));
        const outerMaxR = Math.max(centerR * 0.2, ...outerItems.map((i) => i.r));

        const innerRadius = centerR + innerMaxR + gap * 1.2;
        const outerRx = Math.max(innerRadius, w / 2 - outerMaxR - edge);
        const outerRy = Math.max(innerRadius, h / 2 - outerMaxR - edge);

        const placed = [
          { ...center },
          ...this.placeRing(innerItems, innerRadius, innerRadius, cx, cy),
          ...this.placeRing(outerItems, outerRx, outerRy, cx, cy),
        ];

        this.relaxLayout(placed, { w, h, cx, cy, centerR, gap, edge });
        const violations = this.countConflicts(placed, { w, h, cx, cy, centerR });
        if (!best || violations < best.violations) best = { placed, violations };
        if (!violations) break;
      }

      this.layout = best.placed;

      // 轨道（内圈 + 外圈椭圆）与中心连线
      // const centerItem = this.layout[0];
      // const innerItems = this.layout.filter((i) => !i.isCenter).slice(0, innerNum);
      // const outerItems = this.layout.filter((i) => !i.isCenter).slice(innerNum);
      // this.orbits = [
      //   this.orbitOf(innerItems, centerItem, "inner"),
      //   this.orbitOf(outerItems, centerItem, "outer"),
      // ].filter(Boolean);

      // this.links = this.layout
      //   .filter((i) => !i.isCenter)
      //   .map((i) => ({
      //     key: i.key,
      //     x1: centerItem.x,
      //     y1: centerItem.y,
      //     x2: i.x,
      //     y2: i.y,
      //   }));
    },
    /** 由一圈气泡的包围盒推出轨道椭圆 */
    orbitOf(items, centerItem, id) {
      if (!items.length) return null;
      const radii = items.map((i) =>
        Math.hypot(i.x - centerItem.x, i.y - centerItem.y) - i.r
      );
      const avg = radii.reduce((s, v) => s + v, 0) / radii.length;
      return {
        id,
        cx: centerItem.x,
        cy: centerItem.y,
        rx: avg,
        ry: avg,
      };
    },
    /** 沿椭圆环均匀铺开，角度带少量随机抖动 */
    placeRing(items, rx, ry, cx, cy) {
      const step = (Math.PI * 2) / Math.max(items.length, 1);
      const offset = Math.random() * Math.PI * 2;
      return items.map((item, i) => {
        const angle = offset + step * i + (Math.random() - 0.5) * step * 0.22;
        return {
          ...item,
          x: cx + Math.cos(angle) * rx,
          y: cy + Math.sin(angle) * ry,
          isCenter: false,
        };
      });
    },
    /** 碰撞松弛：两两沿连线方向推开 + 远离中心 + 限制在画布内（中心圆不动） */
    relaxLayout(placed, cfg) {
      const { w, h, cx, cy, centerR, gap, edge } = cfg;
      for (let iter = 0; iter < 180; iter++) {
        let moved = false;

        for (let i = 0; i < placed.length; i++) {
          for (let j = i + 1; j < placed.length; j++) {
            const a = placed[i];
            const b = placed[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const min = a.r + b.r + gap;
            if (dist >= min) continue;

            const nx = dx / dist;
            const ny = dy / dist;
            if (a.isCenter || b.isCenter) {
              const target = a.isCenter ? b : a;
              const dir = a.isCenter ? 1 : -1;
              target.x += nx * dir * (min - dist);
              target.y += ny * dir * (min - dist);
            } else {
              const push = (min - dist) / 2;
              a.x -= nx * push;
              a.y -= ny * push;
              b.x += nx * push;
              b.y += ny * push;
            }
            moved = true;
          }
        }

        placed.forEach((item) => {
          if (!item.isCenter) {
            const minCenter = centerR + item.r + gap;
            const dx = item.x - cx;
            const dy = item.y - cy;
            const dist = Math.hypot(dx, dy) || 0.001;
            if (dist < minCenter) {
              item.x = cx + (dx / dist) * minCenter;
              item.y = cy + (dy / dist) * minCenter;
              moved = true;
            }
          }
          const pad = item.r + edge;
          const nx = Math.min(w - pad, Math.max(pad, item.x));
          const ny = Math.min(h - pad, Math.max(pad, item.y));
          if (nx !== item.x || ny !== item.y) {
            item.x = nx;
            item.y = ny;
            moved = true;
          }
        });

        if (!moved) break;
      }
    },
    /** 统计冲突数（重叠 + 越界），用于挑选最优的一次排布 */
    countConflicts(placed, cfg) {
      const { w, h, cx, cy, centerR } = cfg;
      let count = 0;
      placed.forEach((item, i) => {
        for (let j = i + 1; j < placed.length; j++) {
          const other = placed[j];
          const dist = Math.hypot(item.x - other.x, item.y - other.y);
          if (dist < item.r + other.r - 1) count += 1;
        }
        if (
          !item.isCenter &&
          Math.hypot(item.x - cx, item.y - cy) < centerR + item.r - 1
        ) {
          count += 1;
        }
        if (
          item.x - item.r < -1 ||
          item.y - item.r < -1 ||
          item.x + item.r > w + 1 ||
          item.y + item.r > h + 1
        ) {
          count += 1;
        }
      });
      return count;
    },
    bubbleStyle(item) {
      const skin = item.isCenter
        ? SKINS[0]
        : SKINS[this.bgMap[item.key] || 0];
      return {
        left: `${item.x}px`,
        top: `${item.y}px`,
        width: `${item.r * 2}px`,
        height: `${item.r * 2}px`,
        fontSize: `${this.fitFontSize(item.name, item.r)}px`,
        backgroundImage: `url(${skin.src})`,
        zIndex: Math.round(item.r),
        "--bubble-rgb": skin.rgb,
        "--bubble-ink": skin.ink,
      };
    },
    /** 文字自适应：保证折行后的文字块完整落在圆形气泡内 */
    fitFontSize(name, r) {
      const len = (name || "").length || 1;
      for (let fs = Math.min(r * 0.4, 24); fs >= 8; fs -= 0.5) {
        const perLine = Math.max(1, Math.floor((r * 1.42) / fs));
        const lines = Math.ceil(len / perLine);
        const textW = Math.min(len, perLine) * fs;
        const textH = lines * fs * 1.24;
        if (Math.hypot(textW / 2, textH / 2) <= r * 0.86) {
          return Math.round(fs * 2) / 2;
        }
      }
      return 8;
    },
  },
};
</script>

<style lang="scss" scoped>
.bubble-chart {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: calc(12px * var(--qzlt-s));
  min-height: 0;
}
.bubble-chart__stage {
  position: relative;
  flex: 1;
  min-width: 0;
  min-height: 0;
  /* 光晕允许溢出画布，避免被裁切 */
  overflow: visible;
}

/* ---- 右侧三张政策类型卡片 ---- */
.bubble-chart__cards {
  flex: 0 0 30%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: calc(20px * var(--qzlt-s));
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: calc(4px * var(--qzlt-s));
}
/* 卡片组标题：当前气泡名称 + 左右箭头 */
.cards-head {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: calc(10px * var(--qzlt-s));
  height: calc(38px * var(--qzlt-s));

  &__title {
    font-size: clamp(13px, calc(17px * var(--qzlt-s)), 19px);
    font-weight: 700;
    letter-spacing: 2px;
    color: #eaf9ff;
    text-shadow: 0 0 calc(12px * var(--qzlt-s)) rgba(80, 220, 255, 0.55);
  }
  &__arrow {
    width: calc(30px * var(--qzlt-s));
    height: calc(20px * var(--qzlt-s));
    object-fit: contain;
  }
}
.type-card {
  flex: none;
  padding-top: calc(4px * var(--qzlt-s));
  background-color: rgba(3, 24, 40, 0.6);
  background-image: url("~@/asset/images/qzlts/zc-type-bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;

  &__head {
    display: flex;
    align-items: center;
    gap: calc(20px * var(--qzlt-s));
    padding: calc(12px * var(--qzlt-s)) calc(14px * var(--qzlt-s))
      calc(5px * var(--qzlt-s));
  }
  &__icon {
    flex: none;
    width: clamp(30px, calc(40px * var(--qzlt-s)), 40px);
    height: clamp(30px, calc(40px * var(--qzlt-s)), 40px);
    object-fit: contain;
    filter: drop-shadow(0 0 calc(6px * var(--qzlt-s)) rgba(70, 210, 255, 0.5));
  }
  &__title {
    flex: 1;
    min-width: 0;
    font-size: clamp(14px, calc(16px * var(--qzlt-s)), 18px);
    // font-weight: 700;
    letter-spacing: 1px;
    color: #00EAFF;
  }
  &__count {
    flex: none;
    display: flex;
    align-items: baseline;
    gap: calc(3px * var(--qzlt-s));

    b {
      font-size: clamp(20px, calc(28px * var(--qzlt-s)), 30px);
      font-weight: 700;
      line-height: 1;
      font-family: "DIN Alternate", "Microsoft YaHei", sans-serif;
      background: linear-gradient(180deg, #6bdcff 0%, #f1fffc 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      text-shadow: 0 0 calc(12px * var(--qzlt-s)) rgba(90, 220, 255, 0.4);
    }
    i {
      font-style: normal;
      font-size: clamp(10px, calc(13px * var(--qzlt-s)), 14px);
      color: #a6d3e6;
    }
  }
  /* 头部右上角的收起/展开箭头 */
  &__arrow {
    flex: none;
    width: calc(8px * var(--qzlt-s));
    height: calc(8px * var(--qzlt-s));
    padding: 0;
    border: 0;
    background: transparent;
    border-left: 1px solid #7fe6ff;
    border-top: 1px solid #7fe6ff;
    transform: rotate(45deg);
    cursor: pointer;
    transition: transform 0.2s, margin 0.2s;

    &.is-down {
      margin-bottom: 0;
      margin-top: calc(4px * var(--qzlt-s));
      transform: rotate(225deg);
    }
  }
  &__grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: calc(10px * var(--qzlt-s));
    margin: 0;
    padding: calc(9px * var(--qzlt-s)) calc(14px * var(--qzlt-s));
    list-style: none;
  }
  /* 底部收起 / 展开条（与头部箭头状态联动） */
  &__fold {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: calc(5px * var(--qzlt-s));
    width: 100% ;
    height: calc(24px * var(--qzlt-s));
    padding: 0;
    font-size: var(--qzlt-font-xs);
    letter-spacing: 1px;
    color: #8cd6ef;
    border: none;
    border-radius: calc(2px * var(--qzlt-s));
    background: #00b0c733;
    cursor: pointer;
    transition: color 0.18s, background 0.18s, border-color 0.18s, box-shadow 0.18s;

    &.is-folded {
      color: #eaffff;
      background: #00b0c75e;
      box-shadow: inset 0 0 calc(10px * var(--qzlt-s)) rgba(80, 220, 255, 0.28);
    }

    &:hover {
      color: #ffffff;
      border-color: rgba(88, 226, 255, 0.85);
      background: rgba(22, 104, 146, 0.5);
    }
  }
}
.type-prov {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: calc(10px * var(--qzlt-s));
  min-width: 0;
  height: calc(28px * var(--qzlt-s));
  width: calc(91px * var(--qzlt-s));
  border: 1px solid currentColor;
  border-radius: calc(12px * var(--qzlt-s));
  font-size: clamp(10px, calc(14px * var(--qzlt-s)), 15px);
  letter-spacing: 0.3px;
  white-space: nowrap;
  overflow: hidden;
  transition: background 0.18s, box-shadow 0.18s;

  &__name {
    flex: 0 1 auto;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__score {
    flex: none;
    font-variant-numeric: tabular-nums;
    opacity: 0.92;
  }

  &.score--green {
    color: #00D1AE;
    border-color: #159973;
  }
  &.score--blue {
    color: #359EE3;
    border-color: #359EE3;
  }
  &.score--yellow {
    color: #D4BF68;
    border-color: #8A7524;
  }
  &.score--red {
    color: #EF5443;
    border-color: #992015;
  }
}

.bubble-chart__deco {
  position: absolute;
  left: 0;
  top: 0;
  pointer-events: none;
  overflow: visible;
}
.bubble-chart__orbits ellipse {
  fill: none;
  stroke: rgba(72, 176, 220, 0.18);
  stroke-width: 1;
  stroke-dasharray: 3 6;
}
// .bubble-chart__links line {
//   stroke: rgba(72, 176, 220, 0.14);
//   stroke-width: 1;
// }
// .bubble-chart--light {
//   .bubble-chart__orbits ellipse,
//   .bubble-chart__links line {
//     stroke: rgba(37, 99, 235, 0.16);
//   }
// }

.bubble {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: transparent;
  background-repeat: no-repeat;
  /* 底图实心球约占图宽 53%，放大 196% 后正好铺满元素 */
  background-position: 50% 46.8%;
  background-size: 196% auto;
  // background-size: 116% auto;
  color: var(--bubble-ink, #eafff8);
  font-family: inherit;
  line-height: 1.2;
  text-align: center;
  cursor: pointer;
  transition: filter 0.22s ease, transform 0.22s ease;

  &__name {
    width: 100%;
    max-width: 66%;
    writing-mode: horizontal-tb;
    white-space: normal;
    word-break: break-all;
    text-align: center;
    font-weight: 500;
    letter-spacing: 0.5px;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  }

  &:hover {
    filter: brightness(1.2) saturate(1.05);
  }

  &.is-active {
    font-weight: 700;

    .bubble__name {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.55);
    }
  }

  /* 中心大圆：固定 qp1 底图 + 设计稿指定的外发光 / 内发光 */
  &.is-center {
    font-weight: 700;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
      pointer-events: none;
      box-shadow: 11.56px 48.56px 55.5px 0 #00000024,
        0 0 80.94px 0 #1adbabb3, 0 0 80.94px 0 #1adbabb3,
        0 9.25px 9.25px 0 #00faa7 inset;
    }

    .bubble__name {
      font-size: 1.28em;
      letter-spacing: 2px;
      text-shadow: 0 0 12px rgba(0, 255, 214, 0.6);
    }
  }
}
</style>
