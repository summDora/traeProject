<template>
  <div class="view-material-stub">
    <p v-if="!treeData || !treeData.length">暂无材料（模拟数据）</p>
    <el-tree
      v-else
      :data="treeData"
      :props="treeProps || { children: 'children', label: 'label' }"
      default-expand-all
    />
  </div>
</template>

<script>
export default {
  name: 'viewMaterial',
  props: {
    treeData: { type: Array, default: () => [] },
    treeProps: { type: Object, default: () => ({}) },
    rowData: { type: Object, default: () => ({}) },
    clblx: { type: String, default: '' },
    control: { type: String, default: '' },
    ifNeedUpload: { type: Boolean, default: false },
    hasCKGSS: { type: Boolean, default: false },
    showCheckbox: { type: Boolean, default: false },
    hasSignatureState: { type: Boolean, default: false }
  }
};
</script>
