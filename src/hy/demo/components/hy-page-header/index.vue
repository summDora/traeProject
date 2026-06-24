<template>
  <div class="hy-page-header" :style="{ marginBottom }">
    <div class="left">
      <i v-if="back" class="iconfont icon-tool_back" @click="handleBack"></i>
      <slot name="title"
        ><h2>{{ title }}</h2></slot
      >
    </div>
    <div class="right">
      <slot></slot>
      <el-input v-if="search" v-model="searchName" class="search-input" :placeholder="placeholder" :clearable="clearable" @input="handleSearchValChange" @keyup.enter.native="handleSearch">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
      </el-input>
      <hy-select-popover v-if="highSearch" ref="selectPopover" :data="highSearchData" @confirm="handleConfirmTag">
        <i slot="reference" class="search-icon iconfont icon-tool_screening"></i>
      </hy-select-popover>
      <i v-if="add" class="add-icon el-icon-circle-plus" @click="handleAdd"></i>
    </div>
  </div>
</template>

<script>
import omit from 'lodash/omit';
export default {
  name: 'HyPageHeader',
  props: {
    title: {
      // 标题
      type: String
    },
    back: {
      // 是否有返回
      type: Boolean,
      default: false
    },
    backCustom: {
      // 是否自定义返回
      type: Boolean,
      default: false
    },
    add: {
      // 是否显示添加按钮
      type: Boolean,
      default: false
    },
    search: {
      // 是否显示搜索框
      type: Boolean,
      default: false
    },
    clearable: {
      // 搜索框是否可清空
      type: Boolean,
      default: false
    },
    mb: {
      // 页头的margin-bottom
      type: [String, Number],
      default: '14'
    },
    placeholder: {
      //搜索框的placeholder内容
      type: String
    },
    highSearch: {
      //高级搜索
      type: Boolean,
      default: false
    },
    highSearchData: {
      // 高级搜索列表，具体属性见hy-select-popover
      type: Array,
      default: _ => []
    }
  },
  data() {
    return {
      marginBottom: this.mb + 'px',
      searchName: ''
    };
  },
  methods: {
    /**
     * 点击返回
     */
    handleBack() {
      if (this.backCustom) {
        this.$emit('back');
      } else {
        this.$router.back(-1);
      }
    },
    /**
     * 点击添加
     */
    handleAdd() {
      this.$emit('add');
    },
    /**
     * 输入框回车
     */
    handleSearch() {
      this.$emit('search', this.searchName);
    },
    /**
     * 输入框值变化
     */
    handleSearchValChange(val) {
      this.$emit('search-change', val);
    },
    /**
     * 高级筛选确认
     */
    handleConfirmTag(selection) {
      this.$emit('high-search', selection);
    },
    /**
     *设置某一项的状态
     */
    setHighSearchSelectData(...args) {
      this.$nextTick(() => {
        this.$refs.selectPopover.setSelectData(...args);
      });
    }
  }
};
</script>

<style scoped lang="scss">
.hy-page-header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  & .left {
    display: flex;
    align-items: center;

    & i {
      margin-right: 23px;
      cursor: pointer;
      font-size: 25px;
      color: rgba(67, 66, 93, 1);
      opacity: 0.5;
    }

    & h2 {
      font-size: 35px;
      font-weight: 600;
      color: rgba(67, 66, 93, 1);
      opacity: 0.5;
    }
  }

  & .right {
    display: flex;
    align-items: center;

    & i.add-icon {
      font-size: 38px;
      color: rgba(67, 66, 93, 0.5);
      cursor: pointer;
      margin: 0 11px;
    }

    & .search-icon {
      font-size: 20px;
      color: rgba(67, 66, 93, 0.5);
      cursor: pointer;
      margin: 0 11px;
    }

    & .search-input {
      width: 307px;
      font-size: 13px;
      color: rgba(67, 66, 93, 0.5);

      & .el-input__icon {
        font-size: 16px;
        font-weight: bold;
        color: rgba(67, 66, 93, 0.4);
        cursor: pointer;
      }
    }
  }
}
</style>
