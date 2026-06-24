<template>
  <div class="link-account">
    <slot></slot>
    <div class="search-inp">
      <slot name="s-l"></slot>
      <el-input v-model="params[nameProp]" class="input" placeholder="查找帐号…" @keyup.native.enter="handleSearch">
        <i slot="prefix" class="el-input__icon el-icon-search" @click="handleSearch"></i>
      </el-input>
      <hy-select-popover class="popover" :data="popoverData" @confirm="handleConfirmPopover" @show="showPopover = true" @hide="showPopover = false">
        <i slot="reference" :class="{ 'active-icon': showPopover }" class="filter-icon icon-tool_screening iconfont"></i>
      </hy-select-popover>
    </div>
    <div class="select-all">
      <el-checkbox v-model="checkAll" class="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <el-checkbox-group v-model="$value" class="checkbox-group" @change="changeCheckAll">
      <el-checkbox v-for="item in data" class="checkbox" :key="item[props.key]" :label="item[props.key]">{{ item[props.label] }}</el-checkbox>
    </el-checkbox-group>
    <div class="link-footer">
      <div class="total">
        <span>共</span>
        <span class="num">{{ params.total }}</span>
        <span>结果</span>
      </div>
      <el-pagination hide-on-single-page background layout="prev, pager, next" :current-page.sync="params.current" :page-size="params.size" :total="params.total" @current-change="getList"></el-pagination>
    </div>
  </div>
</template>

<script>
import { omit, pickBy, difference } from 'lodash';

export default {
  name: 'LinkAccount',
  props: {
    value: {
      type: Array,
      default: _ => []
    },
    props: {
      // 字段名
      type: Object,
      default: _ => ({ key: 'id', label: 'name' })
    },
    apiFn: {
      type: Function,
      required: true
    }, // 请求分页方法
    nameProp: {
      // 搜索 用户名 字段名
      type: String,
      default: 'name'
    },
    names: {
      //用户姓名数组
      type: Array,
      default: _ => []
    }
  },
  data: () => ({
    checkAll: false,
    isIndeterminate: false,
    params: {
      current: 1,
      size: 10,
      total: 0
    },
    data: [],
    showPopover: false,
    popoverData: [
      {
        title: '有效状态',
        prop: 'status',
        radio: true,
        children: [
          { value: '1', label: '有效' },
          { value: '0', label: '无效' }
        ]
      },
      {
        title: '锁定状态',
        prop: 'lockFlag',
        radio: true,
        children: [
          { value: '1', label: '锁定' },
          { value: '0', label: '解锁' }
        ]
      }
    ]
  }),
  computed: {
    $value: {
      get() {
        return this.value;
      },
      set(val) {
        let nameArr = JSON.parse(JSON.stringify(this.names));
        if (val.length > this.value.length) {
          //增加了选项
          const dif = difference(val, this.value);
          this.data.filter(v => dif.includes(v[this.props.key])).forEach(item => nameArr.push(item[this.props.label]));
        }
        if (val.length < this.value.length) {
          const dif = difference(this.value, val);
          //获取需剔除name数组
          let difStrs = this.data.filter(v => dif.includes(v[this.props.key])).map(item => item[this.props.label]);
          nameArr = difference(nameArr, difStrs);
        }
        this.$emit('update:names', nameArr);
        this.$emit('input', val);
      }
    }
  },
  methods: {
    // 搜索
    handleSearch() {
      this.resetCurrent();
      this.getList();
    },
    // 重置请求的页数为1
    resetCurrent() {
      this.params.current = 1;
    },
    // 获取用户数据
    async getList() {
      let params = pickBy(omit(this.params, 'total'), v => v);
      params.appId = window.localStorage.getItem('flow-appId');
      const { result } = await this.m_apiFn(this.apiFn)(params);
      this.data = result.records;
      this.params = this.mergeParams(result);
      this.changeCheckAll();
    },
    // 高级筛选确定
    handleConfirmPopover({ lockFlag: { value: lockFlag }, status: { value: status } }) {
      if (lockFlag || status) {
        this.resetCurrent();
        Object.assign(this.params, { lockFlag, status });
        this.getList();
      }
    },
    // 根据当前数据改变全选按钮样式
    changeCheckAll() {
      const {
        data,
        value,
        props: { key }
      } = this;
      if (!data.length) {
        this.checkAll = false;
        this.isIndeterminate = false;
        return;
      }
      const every = data.every(v => value.includes(v[key]));
      const some = data.some(v => value.includes(v[key]));
      if (every) {
        this.checkAll = true;
        this.isIndeterminate = false;
      } else if (some) {
        this.checkAll = false;
        this.isIndeterminate = true;
      } else {
        this.checkAll = false;
        this.isIndeterminate = false;
      }
    },
    // 全选状态改变触发
    handleCheckAllChange(bool) {
      this.isIndeterminate = false;
      const ids = this.data.map(v => v[this.props.key]);
      if (bool) {
        const unselected = difference(ids, this.value);
        this.$value = this.$value.concat(unselected);
      } else {
        this.$value = difference(this.value, ids);
      }
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="scss">
.link-account {
  --bd: 1px solid rgba(67, 66, 93, 0.1);

  & .search-inp {
    display: flex;
    align-items: flex-end;
    margin-bottom: 20px;

    & .input {
      width: 307px;
      margin-left: auto;

      & >>> .el-input__inner {
        border: none;
        border-bottom: 1px solid rgba(112, 112, 112, 0.2);
        border-radius: 0;
      }
    }

    & .popover {
      margin-left: 20px;

      & .active-icon {
        color: var(--primary-color);
      }
    }
  }

  & .select-all {
    /* width: 996px; */
    height: 44px;
    line-height: 44px;
    background: #ffffff;
    border: 1px solid rgba(67, 66, 93, 0.10196078431372549);
    opacity: 1;
    padding: 0 20px;
    box-sizing: border-box;
  }

  & .checkbox-group {
    border-left: var(--bd);

    & .checkbox {
      display: inline-flex;
      align-items: center;
      width: 20%;
      height: 44px;
      line-height: 44px;
      border-right: var(--bd);
      border-bottom: var(--bd);
      margin-right: 0;
      padding: 0 20px;
      box-sizing: border-box;

      & >>> .el-checkbox__label {
        width: 98%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  & .link-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 32px;

    & .total {
      & span {
        font-size: 16px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: var(--text-color);

        &.num {
          font-size: 24px;
          color: var(--primary-color);
          margin: 0 5px;
        }
      }
    }

    & >>> .el-pagination.is-background .btn-next,
    & >>> .el-pagination.is-background .btn-prev,
    & >>> .el-pagination.is-background .el-pager li {
      border: 1px solid var(--text-color-1);
      background-color: transparent;

      &.active {
        background-color: var(--primary-color);
      }
    }
  }
}
</style>
