<template>
  <el-checkbox-group v-model="model[prop]" v-bind="bindProps" v-on="events" class="hy-checkbox-group">
    <el-checkbox v-for="item in opts" v-bind="getItemProps(item, true)" :key="getItemValue(item)">{{ item[$_props.label] }}</el-checkbox>
  </el-checkbox-group>
</template>

<script>
import mixin from '../mixin';

export default {
  name: 'HyCheckboxGroup',
  mixins: [mixin],
  props: {
    opts: Array,
    props: Object
  },
  created() {
    if (!this.model[this.prop]) {
      this.$set(this.model, this.prop, []);
    }
  }
};
</script>

<style scoped lang="scss">
@import '../checkbox.css';
</style>
