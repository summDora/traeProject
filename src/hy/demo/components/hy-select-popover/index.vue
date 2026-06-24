<template>
  <el-popover v-model="show" v-bind="{ ...$attrs, ...$props }" class="hy-select-popover">
    <div class="tag-popover">
      <template v-for="item in list">
        <div class="tag-title" :key="item.title">{{ item.title }}</div>
        <div class="tag-content">
          <div v-for="(ch, i) in item.children" class="item" :key="i" :class="{ active: ch.SELECTED }" :title="ch.label" @click="handleToogleSelect(ch, item)">
            {{ ch.label }}
          </div>
          <div class="item empty"></div>
        </div>
      </template>
      <div class="btns">
        <el-button class="btn" type="info" @click="handleCancel">取消</el-button>
        <el-button class="btn" type="primary" @click="handleConfirm">完成</el-button>
      </div>
    </div>
    <template #reference>
      <slot name="reference"></slot>
    </template>
  </el-popover>
</template>

<script>
/**
 * data
 * @example
 * [
 *  {
 *    title: {string} 标题
 *    radio: {boolean} 是否单选
 *    prop: {string} 选项的prop
 *    children: {Object[]} [{value, label}] 选项列表
 *  }
 * ]
 */
import omit from 'lodash/omit';
export default {
  name: 'HySelectPopover',
  props: {
    data: {
      // 选项数据
      type: Array
    },
    width: {
      // 宽度
      type: String,
      default: '390'
    },
    trigger: {
      // 触发方式
      type: String,
      default: 'click'
    },
    placement: {
      // 弹出位置
      type: String,
      default: 'bottom'
    },
    visibleArrow: {
      // 是否显示箭头
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      show: false
    };
  },
  watch: {
    data: {
      handler() {
        this.resetList();
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    /**
     *设置某一项的状态
     * @param prop {string} 和this.list中的prop对应
     * @param value {*} 要改变的项的value
     * @param bool {boolean}
     */
    setSelectData(prop, value, bool = true) {
      const data = this.list.find(v => v.prop === prop);
      if (!data) return;
      const children = data.children || [];
      children.forEach(v => {
        if (v.value === value) {
          v.SELECTED = bool;
        } else if (data.radio && bool) {
          v.SELECTED = false;
        }
      });
    },
    /**
     * 删除对象中的SELECTED字段
     * @param obj {Object} 目标对象
     * @returns {Object} 删除字段后的新对象
     */
    delSelectedKey(obj) {
      return omit(obj, 'SELECTED');
    },
    /**
     * 重置选中状态
     */
    resetList() {
      let data = this.m_copy(this.data);
      data.forEach(v => {
        if (v.children && v.children.length) {
          v.children = v.children.map(v => ({ SELECTED: false, ...v }));
        }
      });
      this.list = data;
    },
    /**
     * 同步选中状态
     * */
    syncList() {
      this.data.forEach((val, idx) => {
        val.children = this.list[idx].children;
      });
    },
    /**
     * 点击取消
     */
    handleCancel() {
      this.$emit('cancel');
      this.show = false;
      this.resetList();
    },
    /**
     * 点击完成
     */
    handleConfirm() {
      let idx = 0;
      let result = {};
      this.list.forEach(item => {
        if (item.radio) {
          const selected = item.children.find(v => v.SELECTED);
          const res = this.delSelectedKey(selected);
          result[item.prop || idx++] = res;
        } else {
          const selectedList = item.children.filter(v => v.SELECTED);
          const res = selectedList.map(v => this.delSelectedKey(v));
          result[item.prop || idx++] = res;
        }
      });
      this.$emit('confirm', result);
      this.show = false;
      this.syncList();
    },
    /**
     * 切换选中状态
     * @param item 当前数据
     * @param node 当前数据所属节点,若存在radio值为真表示单选，否则多选
     */
    handleToogleSelect(item, node) {
      if (node.radio && node.children) {
        node.children.forEach(v => {
          if (v !== item) {
            v.SELECTED = false;
          }
        });
      }
      item.SELECTED = !item.SELECTED;
    }
  }
};
</script>

<style scoped lang="scss">
.tag-popover {
  padding: 10px 13px;

  & .tag-title {
    font-size: 14px;
    color: var(--text-color-5);
    text-stroke: 1 rgba(0, 0, 0, 0);
    line-height: 1;
    margin-bottom: 15px;
  }

  & .tag-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 20px;

    & .item {
      width: 115px;
      height: 28px;
      border: 1px solid var(--text-color-1);
      border-radius: 4px;
      font-size: 14px;
      line-height: 28px;
      color: var(--text-color-7);
      margin-bottom: 12px;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 14px;
      box-sizing: border-box;
      cursor: pointer;

      &.active {
        color: var(--primary-color);
        border-color: var(--primary-color);
      }

      &.empty {
        height: 0;
        padding: 0;
        border: none;
      }
    }
  }

  & .btns {
    text-align: center;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    & .btn {
      width: 172px;
    }
  }
}
</style>
