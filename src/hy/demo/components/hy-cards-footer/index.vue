<template>
  <div class="hy-cards-footer" :style="{ marginTop: mt + 'px' }">
    <div v-if="!hiddenTotal" class="left">
      <p>
        共<span>{{ data.total || 0 }}</span
        >个{{ name }}
      </p>
      <slot></slot>
      <p v-show="picking">
        已选择<span>{{ pickedLength }}</span
        >个{{ name }}
      </p>
    </div>
    <div v-if="!hiddenPagina" class="right">
      <!-- hide-on-single-page -->
      <el-pagination v-on="$listeners" background layout="prev, pager, next" :total="data.total" :page-size.sync="data.size" :current-page.sync="data.current"></el-pagination>
    </div>
  </div>
</template>

<script>
/*底部分页+统计*/
export default {
  name: 'HyCardsFooter',
  props: {
    data: {
      // 分页信息
      type: Object
    },
    name: {
      // 名称
      type: String
    },
    picking: {
      // 是否选择状态
      type: Boolean
    },
    pickedLength: {
      // 当前选中的数量
      type: [Number, String]
    },
    mt: {
      // marginTop
      type: [Number, String],
      default: 0
    },
    hiddenTotal: {
      // 是否隐藏统计信息
      type: Boolean,
      default: false
    },
    hiddenPagina: {
      // 是否隐藏分页信息
      type: Boolean,
      default: false
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.hy-cards-footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;

  & .left {
    display: flex;

    & p {
      font-size: 18px;
      color: var(--text-color);
      margin-right: 24px;

      & span {
        font-size: 24px;
        color: var(--primary-color);
        margin: 0 10px;
      }
    }
  }

  & .right {
    & >>> button,
    & >>> .number {
      width: 35px;
      height: 35px;
      line-height: 35px;
      background: var(--content-bg);
      border: 1px solid rgba(232, 233, 236, 1);
      border-radius: 4px;
    }

    & >>> button {
      font-size: 13px;
      color: var(--text-color);
    }

    & >>> .number {
      font-size: 13px;
      font-family: Source Sans Pro;
      color: var(--text-color-5);
    }
  }
}
</style>
