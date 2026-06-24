
<template>
  <div @click.capture="selectTreeCheck">
    <div v-if="disabled" style="background: #f5f7fa00; cursor: not-allowed; z-index: 10000; position: absolute; top: 0; width: 100%; height: 36px;"></div>
    <div class="hySelectTreeCss" v-show="isShowSelect" @click="isShowSelect = !isShowSelect"></div>
    <el-popover
        placement="bottom-start"
        :width="popoverWidth"
        :trigger="trigger"
        v-model="isShowSelect"
        @show="popoverShow"
        @hide="popoverHide"
        >
        <el-input v-if="filterable" v-model="filterText" placeholder="关键字" size="mini" style="margin-bottom: 10px;"></el-input>
        <el-tree class="hySelectTree" :style="style" ref="tree" :data="selectTreeData" :props="defaultProps"
          :show-checkbox="selectTreeMultiple"
          :node-key="selectTreeNodeKey"
          :check-strictly="selectTreeCheckStrictly"
          default-expand-all
          :expand-on-click-node="false"
          :check-on-click-node="selectTreeMultiple"
          :highlight-current="true"
          :filter-node-method="filterNode"
          @node-click="selectTreeHandleNodeClick"
          @check="selectTreeHandleNodeClick"
          @check-change="selectTreeHandleCheckChange"></el-tree>

        <el-select slot="reference" :style="selectStyle" ref="select" :size="size"
          v-model="selectKey"
          :placeholder="selectPlaceholder"
          :multiple="selectTreeMultiple"
          :clearable="clearable"
          :disabled="disabled"
          :collapse-tags="collapseTags"
          @click.native="disabled ? isShowSelect = false : isShowSelect = !isShowSelect"
          @remove-tag="removeSelectedNodes"
          @clear="removeSelectedNode"
          @change="changeSelectedNodes"
          class="tree-select"
          :class="labelStyle.selectClass">
          <div class="select_embed"  v-if="labelStyle.embed" slot="prefix" :style="{width: labelStyle.selectEmbedLabel ? `${Number((labelStyle.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : labelStyle.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="labelStyle.selectEmbedLabel"></div>
          <el-option v-for="(item, index) in selectTreeOptions" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'hySelectTree',
  props: {
    // 树结构数据
    selectTreeData: {
      type: Array,
      default () {
        return [];
      }
    },
    defaultProps: {
      type: Object,
      default () {
        return {};
      }
    },
    selectPlaceholder: {
      type: String,
      default () {
        return "";
      }
    },
    // 配置是否可多选
    selectTreeMultiple: {
      type: Boolean,
      default () {
        return true;
      }
    },
    // 配置是否可清空选择
    clearable: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 配置禁用
    disabled: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 配置多选时是否将选中值按文字的形式展示
    collapseTags: {
      type: Boolean,
      default () {
        return true;
      }
    },
    selectTreeNodeKey: {
      type: String,
      default () {
        return 'id';
      }
    },
    selectTreeCheckStrictly: {
      type: Boolean,
      default () {
        return false;
      }
    },
    // 默认选中的节点key数组
    checkedKeys: {
      type: Array,
      default () {
        return [];
      }
    },
    size: {
      type: String,
      default () {
        return 'medium';
      }
    },
    popoverWidth: {
      type: Number,
      default () {
        return 280;
      }
    },
    height: {
      type: Number,
      default () {
        return 300;
      }
    },
    itemKey: {
      type: String,
      default: () => ""
    },
    labelStyle: {
      type: Object,
      default: () => {}
    },
    tiggerType: {
      type: String,
      default: () => "newForm"
    },
    trigger: {
      type: String,
      default: () => "manual" // hover click manual
    },
    filterable: {
      type: Boolean,
      default: () => true
    }
  },
  data () {
    return {
      isShowSelect: false, // 是否显示树状选择器
      selectTreeOptions: [],
      selectKey: [], 
      style: "",
      selectStyle: "",
      checkedIds: [],
      checkedData: [],
      filterText: ""
    };
  },
  mounted () {
    this.selectKey = this.checkedKeys;
    const offsetHeight = document.body.offsetHeight;
    this.style = 'width:' + this.popoverWidth + 'px;' + 'max-height:' + offsetHeight * 0.45  + 'px;'; // this.height
    this.selectStyle = 'width:' + (this.popoverWidth) + 'px;'
    this.initCheckedData();
  },
  methods: {
    // 节点过滤
    filterNode(value, data) {
      // console.log(value, data);
      if(!value) return true;
      return data[this.defaultProps.label].indexOf(value) !== -1;
    },
    // 单选时点击tree节点，设置select选项
    setSelectOption (node) {
      let tmpMap = {};
      tmpMap.value = node.key;
      tmpMap.label = node.label;
      this.selectTreeOptions = [];
      this.selectTreeOptions.push(tmpMap);
      this.selectKey = node.key;
    },
    // 单选，选中传进来的节点
    checkSelectedNode (checkedKeys) {
      var item = checkedKeys[0];
      this.$refs.tree.setCurrentKey(item);
      var node = this.$refs.tree.getNode(item);
      this.setSelectOption(node);
    },
    // 多选，勾选上传进来的节点
    checkSelectedNodes (checkedKeys) {
      this.$refs.tree.setCheckedKeys(checkedKeys);
      this.$forceUpdate();
    },
    // 单选，清空选中
    clearSelectedNode () {
      this.selectKey = '';
      this.$refs.tree.setCurrentKey(null);
    },
    // 多选，清空所有勾选
    clearSelectedNodes () {
      var checkedKeys = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
      for (let i = 0; i < checkedKeys.length; i++) {
        this.$refs.tree.setChecked(checkedKeys[i], false);
      }
      this.$forceUpdate();
    },
    initCheckedData () {
      // console.log("initCheckedData",this.checkedKeys)
      if (this.selectTreeMultiple) {
        // 多选
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNodes(this.checkedKeys);
        } else {
          this.clearSelectedNodes();
        }
      } else {
        // 单选
        if (this.checkedKeys.length > 0) {
          this.checkSelectedNode(this.checkedKeys);
        } else {
          this.clearSelectedNode();
        }
      }
      
    },
    popoverShow() {
      if(this.selectKey.length === 0) {
          this.clearSelectedNodes();
      }
      this.$emit('popoverShow');
    },
    popoverHide () {
      if (this.selectTreeMultiple) {
        this.checkedIds = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
        this.checkedData = this.$refs.tree.getCheckedNodes(); // 所有被选中的节点所组成的数组数据
      } else {
        this.checkedIds = this.$refs.tree.getCurrentKey();
        this.checkedData = this.$refs.tree.getCurrentNode();
      }
      this.$emit('popoverHide', this.checkedIds, this.checkedData, this.itemKey);
    },
    // 单选，节点被点击时的回调,返回被点击的节点数据
    selectTreeHandleNodeClick (data, node) {
      this.$emit('selectTreeHandleNodeClick', data,node);
      if (!this.selectTreeMultiple) {
        this.setSelectOption(node);
        this.isShowSelect = !this.isShowSelect;
        this.$emit('change', this.selectKey);
        this.$forceUpdate();
      }
    },
    // 多选，节点勾选状态发生变化时的回调
    selectTreeHandleCheckChange () {
      var checkedKeys = this.$refs.tree.getCheckedKeys(); // 所有被选中的节点的 key 所组成的数组数据
      this.selectTreeOptions = checkedKeys.map((item) => {
        var node = this.$refs.tree.getNode(item); // 所有被选中的节点对应的node
        let tmpMap = {};
        tmpMap.value = node.key;
        tmpMap.label = node.label;
        return tmpMap;
      });
      this.selectKey = this.selectTreeOptions.map((item) => {
        return item.value;
      });
      this.$emit('change', this.selectKey);
    },
    // 多选,删除任一select选项的回调
    removeSelectedNodes (val) {
      // debugger
      this.$refs.tree.setChecked(val, false);
      var node = this.$refs.tree.getNode(val);
      if (!this.selectTreeCheckStrictly && node.children.length > 0) {
        this.treeToList(node).map(item => {
          if (item.children.length <= 0) {
            this.$refs.tree.setChecked(item, false);
          }
        });
        // this.selectTreeHandleCheckChange();
      }
      // this.$nextTick(()=>{
        this.selectTreeHandleCheckChange();
        // console.log("aaa",this.selectKey)
      // })
      this.$emit('removeSelectedNodes', this.selectKey);
      this.$emit('change', this.selectKey);
    },
    //选择树节点
    selectTreeCheck(){
      this.$emit('selectTreeCheck');
    },
    treeToList (tree) {
      var queen = [];
      var out = [];
      queen = queen.concat(tree);
      while (queen.length) {
        var first = queen.shift();
        if (first.children) {
          queen = queen.concat(first.children);
        }
        out.push(first);
      }
      return out;
    },
    // 单选,清空select输入框的回调
    removeSelectedNode () {
      this.clearSelectedNode();
      this.$emit('change', this.selectKey);
    },
    // 选中的select选项改变的回调
    changeSelectedNodes (selectKey) {
      // 多选,清空select输入框时，清除树勾选
      if (this.selectTreeMultiple && selectKey.length <= 0) {
        this.clearSelectedNodes();
      }
      this.$emit('change', this.selectKey);
    }
  },
  watch: {
    isShowSelect (val) {
      // 隐藏select自带的下拉框
      this.$refs.select.blur();
    },
    checkedKeys: {
      handler(val, oldValue) {
        if (!val) return;
        this.selectKey = val;
        this.initCheckedData();
      },
      deep: true,
    },
    // checkedKeys (val) {
    //   if (!val) return;
    //   this.checkedKeys = val;
    //   this.initCheckedData();
    // }
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style lang="less" scoped>
.hySelectTreeCss{
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 11;
}

.hySelectTree{
  overflow: auto;
}

.tree-select{
  z-index: 111;
}
.tree-select /deep/ .el-select__tags ::hover{
  overflow: auto;
  white-space: nowrap;
  margin: 0 3px;
}
// .tree-select /deep/ .el-select__tags{
//   overflow: auto;
//   white-space: nowrap;
//   margin: 0 3px;
//   display:inline-block;
// }
.tree-select /deep/ .el-tag--small{
  height: 20px;
  line-height: 20px;
}
.tree-select/deep/.el-select .el-input__inner{
  
}


.hySelectTree /deep/ .el-tree-node{
  // min-width: 440px;
  width:280px 
}
.hySelectTree /deep/ .el-tree-node>.el-tree-node__children{
  overflow: inherit !important;
}
.tree-select /deep/ .el-select__tags{
    max-height: 36px;
    overflow: auto;
}
</style>