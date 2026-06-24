<template>
  <div class="hive-transfer">
    <el-transfer v-bind="{ ...$attrs, ...$props }" v-on="$listeners">
      <template v-if="$scopedSlots.default" #default="scope">
        <slot v-bind="scope"></slot>
      </template>
    </el-transfer>
  </div>
</template>

<script>
import { debounce } from 'lodash';
export default {
  name: 'HiveTransfer',
  inheritAttrs: false,
  props: {
    filterMethod: {
      type: Function,
      default(query, item) {
        return item[this.props.label].includes(query);
      }
    },
    filterable: {
      type: Boolean,
      default: true
    },
    props: {
      type: Object,
      default: _ => ({ label: 'label', key: 'key', disabled: 'disabled' })
    },
    targetOrder: {
      type: String,
      default: 'unshift'
    },
    currentPage: Number,
    pageSize: Number,
    total: Number
  },
  data() {
    return {
      index: 1, // 当前页，穿梭框左侧滚动到底自增1
      scrolled: false
    };
  },
  methods: {
    currentChange(curr) {
      this.$emit('current-change', curr);
    },
    // 穿梭框左部滚动到底部触发
    emitScrollCeil() {
      if (!this.scrolled) {
        this.$emit('ceil', this.index, this.subIndex);
        this.changeScrolled();
      }
    },
    // 穿梭框左部滚动到底部触发
    emitScrollFloor(oContainer) {
      if (!this.scrolled) {
        this.$emit('floor', this.index, () => this.addIndex(oContainer));
        this.changeScrolled();
      }
    },
    changeScrolled() {
      this.scrolled = true;
      setTimeout(() => {
        this.scrolled = false;
      }, 200);
    },
    // index自增1
    addIndex(oContainer) {
      oContainer.scrollTop = 10;
      return ++this.index;
    },
    // index自减1
    subIndex() {
      return --this.index;
    },
    // 重置index为1
    resetIndex() {
      this.index = 1;
    }
  },
  beforeDestroy() {
    this.resetIndex();
  }
};
</script>

<style scoped lang="scss">
@import './index.css';
</style>
