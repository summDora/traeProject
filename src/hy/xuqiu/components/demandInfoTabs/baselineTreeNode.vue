<template>
  <div class="baseline-node" :class="{ 'is-root': depth === 0 }">
    <div class="node-label" :style="{ paddingLeft: `${depth * 20}px` }">
      <span v-if="depth > 0" class="node-dot"></span>
      <span class="node-text">{{ node.label }}</span>
      <span
        v-if="node.status"
        class="status-tag"
        :class="`status-${node.statusType || 'normal'}`"
      >{{ node.status }}</span>
    </div>
    <baseline-tree-node
      v-for="child in node.children || []"
      :key="`${node.label}-${child.label}`"
      :node="child"
      :depth="depth + 1"
    />
  </div>
</template>

<script>
export default {
  name: 'baselineTreeNode',

  props: {
    node: {
      type: Object,
      required: true
    },
    depth: {
      type: Number,
      default: 0
    }
  }
};
</script>

<style scoped>
.baseline-node {
  margin-bottom: 4px;
}
.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
  line-height: 28px;
  color: #303133;
}
.is-root > .node-label .node-text {
  font-weight: 600;
  color: #007873;
}
.node-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #007873;
  flex-shrink: 0;
}
.status-tag {
  font-size: 12px;
  padding: 0 8px;
  border-radius: 2px;
  line-height: 20px;
}
.status-good {
  color: #67c23a;
  background: #f0f9eb;
}
.status-better {
  color: #409eff;
  background: #ecf5ff;
}
.status-normal {
  color: #e6a23c;
  background: #fdf6ec;
}
.status-poor {
  color: #f56c6c;
  background: #fef0f0;
}
</style>
