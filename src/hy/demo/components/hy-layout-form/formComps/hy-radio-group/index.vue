<template>
  <el-radio-group v-model="model[prop]" v-bind="bindProps" v-on="events" class="hy-radio-group">
    <el-radio v-for="item in opts" v-bind="getItemProps(item, true)" :key="getItemValue(item)">
      {{ item[$_props.label] }}
    </el-radio>
  </el-radio-group>
</template>

<script>
import mixin from '../mixin';

// 默认props
const props = {
  value: 'value',
  label: 'label',
  disabled: 'disabled',
  border: 'border',
  size: 'size',
  name: 'name'
};

export default {
  name: 'HyRadioGroup',
  mixins: [mixin],
  props: {
    opts: Array,
    props: Object
  }
};
</script>

<style scoped lang="scss"></style>
