<!--
 * 首页检索区（像素级还原）
 * 线条外框：src/asset/images/home/search-border.png
 *   - 切图逻辑尺寸 502 × 134，右侧为上扬曲线，左侧为直线段
 *   - 线上方为内容区，用 CSS 渐变补齐左侧直线段，曲线部分整图右侧贴边
 * 所有几何量都以「设计稿 2880 下的 px」为单位定义，统一乘 --home-s
-->
<template>
  <section class="home-search-bar">
    <!-- <span class="home-search-bar__line" aria-hidden="true"></span> -->
    <!-- <span class="home-search-bar__arc" aria-hidden="true"></span> -->

    <div class="home-search-bar__inner">
      <img class="home-search-bar__mark" :src="iconMenu" alt="" />

      <label class="home-search-bar__field">
        <img class="home-search-bar__glass" :src="iconSearch" alt="" />
        <span class="home-search-bar__label">全维检索</span>
        <span class="home-search-bar__divider" aria-hidden="true"></span>
        <input
          v-model.trim="keyword"
          type="search"
          placeholder="电价水平、电源成本、最新政策…"
          aria-label="全维检索"
          @keyup.enter="submit"
        />
      </label>
    </div>
  </section>
</template>

<script>
import iconMenu from "@/asset/images/home/icon-menu.png";
import iconSearch from "@/asset/images/home/icon-search.png";
export default {
  name: "HomeSearchBar",
  data() {
    return {
      keyword: "",
      iconMenu,
      iconSearch,
    };
  },
  methods: {
    submit() {
      this.$emit("search", this.keyword);
    },
  },
};
</script>

<style lang="scss" scoped>
.home-search-bar {
  // ---- 设计稿尺寸（2880 基准，单位 px）----
  --search-h: 48; // 检索区高度
  --search-arc-w: 439; // 上扬曲线切图宽度
  --search-curve-w: 102; // 曲线占用宽度（左侧直线段需让开）
  --search-pad-x: 10; // 内容左内边距
  --search-mark: 32; // 左侧方格标记尺寸
  --search-mark-gap: 10; // 方格标记与检索内容的间距
  --search-font: 18; // 文字字号
  --search-field-gap: 8; // 内容内部间距

  position: relative;
  // 宽度由 index.vue 按页宽写入：2880 保持设计稿的 283，1920 放宽到左栏卡片宽 409，
  // 否则 1920 下只剩 237px，检索提示会被挤掉
  width: var(--home-search-w, 11%);
  max-width: 100%;
  height: calc(var(--search-h) * var(--home-s) * 1px);
}

// 右侧上扬曲线：整图贴右下，保持切图原始比例
.home-search-bar__arc {
  position: absolute;
  right: 0;
  bottom: 0;
  width: calc(var(--search-arc-w) * var(--home-s) * 1px);
  height: calc(var(--search-h) * var(--home-s) * 1px);
  background-image: url("~@/asset/images/home/search-border.png");
  background-position: right bottom;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  pointer-events: none;
}

// 内容区：只占直线上方
.home-search-bar__inner {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  gap: calc(var(--search-mark-gap) * var(--home-s) * 1px);
  box-sizing: border-box;

  background-image: url("~@/asset/images/home/search-border.png");
  background-position: right center;
  // 右侧留给上扬曲线的空隙跟随 --home-s，1920 下不白占 50px
  padding: 0 calc(50 * var(--home-s) * 1px) calc(10 * var(--home-s) * 1px) 0;
  background-repeat: no-repeat;
  background-size: 70% auto;
}

// 左侧方格标记：2 列 × 3 行
.home-search-bar__mark {
  width: calc(32 * var(--home-s) * 1px);
  height: calc(32 * var(--home-s) * 1px);
}

.home-search-bar__field {
  display: flex;
  flex: 1;
  align-items: center;
  gap: calc(var(--search-field-gap) * var(--home-s) * 1px);
  min-width: 0;
}

// 放大镜
.home-search-bar__glass {
  width: calc(18 * var(--home-s) * 1px);
  height: calc(18 * var(--home-s) * 1px);
}

.home-search-bar__label {
  flex: 0 0 auto;
  color: #f4feff;
  // 字号跟随 --home-s（2880 → 18px），1920 下压到 12px 太小，用 13px 兜底
  font-size: max(13px, calc(var(--search-font) * var(--home-s) * 1px));
  letter-spacing: calc(2 * var(--home-s) * 1px);
  line-height: 1;
  white-space: nowrap;
}

.home-search-bar__divider {
  flex: 0 0 auto;
  width: calc(1.5 * var(--home-s) * 1px);
  height: calc(30 * var(--home-s) * 1px);
  background: rgba(232, 251, 255, 0.55);
}

.home-search-bar__field input {
  flex: 1;
  min-width: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: #f4feff;
  font-family: inherit;
  font-size: max(13px, calc(var(--search-font) * var(--home-s) * 1px));
  letter-spacing: calc(1 * var(--home-s) * 1px);

  &::placeholder {
    color: rgba(244, 254, 255, 0.92);
  }

  &::-webkit-search-cancel-button {
    display: none;
  }
}
</style>
