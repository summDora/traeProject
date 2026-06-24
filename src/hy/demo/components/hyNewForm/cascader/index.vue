<template>
  <div class="block">
    <el-cascader
      style="width: 100%;"
      :options="options"
      :props="{ checkStrictly: true }"
      v-model="value"
      @change="formcascchange"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'HyCascader',
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    formcascchange(e) {
      this.$emit("formcascchange", e);
    }
  }
}
</script>

<style scoped></style>
