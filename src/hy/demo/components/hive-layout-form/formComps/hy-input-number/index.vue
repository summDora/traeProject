<template>
  <el-input-number v-model="model[prop]" v-bind="bindProps" v-on="events" class="hy-input-number"></el-input-number>
</template>

<script>
import mixin from '../mixin';
export default {
  name: 'HyInputNumber',
  mixins: [mixin],
  props: {
    model: Object,
    prop: String
  }
};
</script>

<style scoped lang="scss">
.hy-input-number {
  width: 100%;

  & >>> .el-input-number__decrease,
  & >>> .el-input-number__increase {
    border: none;
    width: 24px;
    height: 24px;
    line-height: 24px;
    background: rgba(67, 66, 93, 0.05);
    border-radius: 50%;
    top: 8px;

    & i {
      color: rgba(67, 66, 93, 0.5);
      font-weight: bold;
    }
  }

  & >>> .el-input-number__decrease {
    left: 5px;
  }

  & >>> .el-input-number__increase {
    right: 5px;
  }

  & >>> .el-input__inner {
    border-radius: 0;
    border: none;
    border-bottom: 1px solid rgba(225, 225, 229, 1);
  }

  & >>> .el-input-number__decrease:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled),
  & >>> .el-input-number__increase:hover:not(.is-disabled) ~ .el-input .el-input__inner:not(.is-disabled) {
    /* border-color: var(--primary-color); */
  }
}
</style>
