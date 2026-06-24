<template>
  <el-tree
      :data="treeData"
      :node-key="nodeKey"
      :props="defaultTreeProps"
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node="expandOnClickNode"
      :highlight-current="highlightCurrent"
      @node-click="handleNodeClick">
    <div class="custom-tree-node" slot-scope="{ node, data }">
      <div><i class="base-icon" :class="data.isZy==='1' ? 'base-icon file-icon':'folder-icon el-icon-folder'"></i></div>
      <el-tooltip effect='dark' :content="data.text" placement="top" >
        <div class="node-line file-name">{{ data.text }}</div>
      </el-tooltip>
    </div>
  </el-tree>
</template>
<script>
  export default {
    name: 'commonTree',

    props: {
      treeData: {
        type: Array,
        default: () => [],
        required: true,
      },
      defaultTreeProps: {
        type: Object,
        default() {
          return {}
        }
      },
      defaultExpandAll: {
        type: Boolean,
        default: () => true,
      },
      highlightCurrent: {
        type: Boolean,
        default: () => true,
      },
      expandOnClickNode: {
        type: Boolean,
        default: () => true,
      },
      nodeKey: {
        type: String,
        default: () => 'id',
      },
    },
    data() {
      return {
        selData: null
      }
    },
    mounted() {
    },
    methods: {
      handleNodeClick(data) {
        this.selData = data;
        this.$emit('handleNodeClick', this.selData)
      }
    },
  }
</script>
<style scoped>
  .file-table {
    background-color: aliceblue;
    margin-top: 5px;
    padding: 5px 0px;
    display: flex;
    justify-content: space-around;
  }

  .file-th {
    font-size: 14px;
    font-weight: bold;
  }

  .custom-tree-node {
    display: flex !important;
    width: calc(100% - 24px);
    /* justify-content: space-around; */
  }

  .base-icon {
    line-height: inherit;
    margin-right: 6px;
  }
.folder-icon {
  color: #409eff;
  font-size: 15px;
  font-weight: 700;
}
.file-icon {
  width: 11px;
  height: 11px;
  display: inline-block;
  border-radius: 50%;
  background: #319bff;
}

  .file-icon {
    color: #ffc000;
  }

  .node-line {
    width: calc(50% - 9px);
  }

  .file-date {
    text-align: center;
  }
</style>