<!--
 * 中心卡片 V2 · 首页
 * 结构：顶部两个标题（打分情况 / 方向研判）+ 中间心形底图 + 两侧标签
 * - 心形底图用 center-bg.png 铺满舞台（设计稿：center-bg 范围覆盖量化目标等整个中心区域）
 * - 标题左侧图标 + 下方边缘线全部用 v2 切图
 * - 左侧四条类目背景 left-bg.png，右侧四条 right-bg.png，右侧箭头 icon-arrow-transparent.png
 * - 标签只负责抛 open 事件，跳转由 CenterPanelV2 决定
-->
<template>
  <div class="qcv2-home">
    <div class="qcv2-home__heads">
      <div class="qcv2-head">
        <img class="qcv2-head__icon" src="@/asset/images/qzlts/v2/icon-grade.png" alt="" />
        <span class="qcv2-head__label">打分情况</span>
        <img class="qcv2-head__line" src="@/asset/images/qzlts/v2/left-title-bottom.png" alt="" />
      </div>

      <div class="qcv2-head qcv2-head--right">
        <img class="qcv2-head__icon" src="@/asset/images/qzlts/v2/icon-direact.png" alt="" />
        <span class="qcv2-head__label">方向研判</span>
        <img class="qcv2-head__line" src="@/asset/images/qzlts/v2/right-title-bottom.png" alt="" />
      </div>
    </div>

    <div class="qcv2-heart">
      <div class="qcv2-heart__tags">
        <div class="qcv2-heart__col qcv2-heart__col--left">
          <button
            v-for="(tag, index) in scoreTags"
            :key="tag.key"
            :style="{ '--qcv2-offset': `${index * 30}px` }"
            type="button"
            class="qcv2-tag qcv2-tag--left"
            @click="$emit('open', tag)"
          >
            <span class="qcv2-tag__label">{{ tag.label }}</span>
            <img class="qcv2-tag__arrow" src="@/asset/images/qzlts/v2/icon-arrow-transparent.png" alt="" />
          </button>
        </div>
        <div class="qcv2-heart__col qcv2-heart__col--right">
          <button
            v-for="(tag, index) in researchTags"
            :key="tag.key"
            :style="{ '--qcv2-offset': `${index * 30}px` }"
            type="button"
            class="qcv2-tag qcv2-tag--right"
            @click="$emit('open', tag)"
          >
            <span class="qcv2-tag__label">{{ tag.label }}</span>
            <img class="qcv2-tag__arrow" src="@/asset/images/qzlts/v2/icon-arrow-transparent.png" alt="" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { scoreTags, researchTags } from "../mockData";

export default {
  name: "V2HomeView",
  data() {
    return {
      scoreTags,
      researchTags,
    };
  },
};
</script>

<style lang="scss" scoped>
.qcv2-home {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.qcv2-home__heads {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(12px * var(--qzlt-s, 1));
  margin-bottom: calc(4px * var(--qzlt-s, 1));
}

.qcv2-head {
  display: inline-flex;
  align-items: center;
  gap: calc(10px * var(--qzlt-s, 1));
  height: calc(64px * var(--qzlt-s, 1));
}

.qcv2-head__icon {
  width: calc(60px * var(--qzlt-s, 1));
  height: calc(60px * var(--qzlt-s, 1));
  flex: none;
  object-fit: contain;
}

.qcv2-head__label {
  font-size: clamp(15px, calc(26px * var(--qzlt-s, 1)), 28px);
  font-weight: 600;
  letter-spacing: calc(2px * var(--qzlt-s, 1));
  color: #eaf7ff;
  text-shadow: 0 0 calc(12px * var(--qzlt-s, 1)) rgba(80, 190, 255, 0.6);
  white-space: nowrap;
}

.qcv2-head__line {
  flex: 1;
  height: calc(32px * var(--qzlt-s, 1));
  object-fit: contain;
}

.qcv2-head--right {
  flex-direction: row-reverse;
}

.qcv2-heart {
  position: relative;
  flex: 1;
  min-height: 0;

  /* center-bg.png 上方约 32% 是透明留白：宽度铺满、高度自适应、底部对齐，正好把心形主体铺满舞台 */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-image: url("~@/asset/images/qzlts/v2/center-bg.png");
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: 100% auto;
    pointer-events: none;
  }

  &__tags {
    position: absolute;
    inset: 0;
  }

  &__col {
    position: absolute;
    top: 16%;
    display: flex;
    flex-direction: column;
    gap: calc(44px * var(--qzlt-s, 1));
    width: 30%;

    &--left {
      left: 4%;
    }
    &--right {
      right: 4%;
    }
  }
}

/* 左侧四条类目：left-bg.png 做背景；每条比上一条右移 30px */
.qcv2-tag--left {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(104px * var(--qzlt-s, 1));
  padding: 0 calc(24px * var(--qzlt-s, 1)) 0 calc(34px * var(--qzlt-s, 1));
  font: inherit;
  font-size: clamp(13px, calc(22px * var(--qzlt-s, 1)), 24px);
  letter-spacing: calc(1px * var(--qzlt-s, 1));
  color: #e6f8ff;
  cursor: pointer;
  /* 按钮默认样式清零，否则透明处会漏出浏览器默认白底与描边 */
  border: 0;
  outline: none;
  background-color: transparent;
  transition: transform 0.2s;
  background-image: url("~@/asset/images/qzlts/v2/left-bg.png");
  background-repeat: no-repeat;
  background-position: left center;
  background-size: contain;
  transform: translateX(calc(var(--qcv2-offset, 0px) * var(--qzlt-s, 1)));
}

/* 右侧四条类目：right-bg.png 做背景；每条比上一条左移 30px */
.qcv2-tag--right {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: calc(104px * var(--qzlt-s, 1));
  padding: 0 calc(34px * var(--qzlt-s, 1)) 0 calc(24px * var(--qzlt-s, 1));
  font: inherit;
  font-size: clamp(13px, calc(22px * var(--qzlt-s, 1)), 24px);
  letter-spacing: calc(1px * var(--qzlt-s, 1));
  color: #e6f8ff;
  cursor: pointer;
  border: 0;
  outline: none;
  background-color: transparent;
  transition: transform 0.2s;
  background-image: url("~@/asset/images/qzlts/v2/right-bg.png");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: contain;
  transform: translateX(calc(var(--qcv2-offset, 0px) * var(--qzlt-s, 1) * -1));
}

.qcv2-tag__label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.qcv2-tag__arrow {
  flex: none;
  width: calc(30px * var(--qzlt-s, 1));
  height: calc(30px * var(--qzlt-s, 1));
  object-fit: contain;
}

.qcv2-tag:hover {
  transform: translateX(
    calc((var(--qcv2-offset, 0px) + 3px) * var(--qzlt-s, 1))
  );
}

.qcv2-tag--right:hover {
  transform: translateX(
    calc((var(--qcv2-offset, 0px) + 3px) * var(--qzlt-s, 1) * -1)
  );
}

.qcv2-tag:active {
  transform: translateX(calc(var(--qcv2-offset, 0px) * var(--qzlt-s, 1)));
}

.qcv2-tag--right:active {
  transform: translateX(
    calc(var(--qcv2-offset, 0px) * var(--qzlt-s, 1) * -1)
  );
}
</style>
