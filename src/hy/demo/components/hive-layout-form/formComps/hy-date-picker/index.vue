<template>
  <el-date-picker v-model="model[prop]" v-bind="bindProps" v-on="events" class="hy-date-picker" :type="kind"> </el-date-picker>
</template>

<script>
import mixin from '../mixin';

export default {
  name: 'HyDatePicker',
  mixins: [mixin],
  props: {
    kind: {
      type: String,
      default: 'date'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped lang="scss">
.hy-date-picker {
  width: 100% !important;

  & >>> .el-range-input {
    background-color: transparent;
  }
}
</style>
