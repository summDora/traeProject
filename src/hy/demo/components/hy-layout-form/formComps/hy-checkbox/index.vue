<template>
  <el-checkbox v-model="model[prop]" v-bind="bindProps" v-on="events" class="hy-checkbox">{{ text }}</el-checkbox>
</template>

<script>
import mixin from '../mixin';

export default {
  name: 'HyCheckbox',
  mixins: [mixin],
  props: {
    text: String
  },
  created() {
    if (this.model[this.prop] == null) this.$set(this.model, this.prop, false);
  }
};
</script>

<style scoped lang="scss">
@import '../checkbox.css';
</style>
