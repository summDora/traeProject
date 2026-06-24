<template>
  <div class="hy-drag-tree">
    <div v-if="drag" class="drag-edit">
      <div v-show="!draggable" class="edit" @click="handleStartDrag">编辑</div>
      <div v-show="draggable" class="done">
        <div class="tip">拖动菜单列表调整顺序</div>
        <span class="achieve" @click="handleEndDrag">完成</span>
        <span class="edit" @click="handleCancelDrag">取消</span>
      </div>
    </div>
    <el-scrollbar class="bar">
      <el-tree v-bind="{ ...$attrs, ...$props }" v-on="$listeners" ref="tree" class="tree" icon-class="iconfont icon-tool_folder_open" :filter-node-method="filterNodeMethod" :draggable="draggable" @check-change="handleCheckChange" @node-drop="handleDrop">
        <template #default="{ node, data }">
          <el-input v-if="data.INPUTING" v-model="data[props.label]" ref="input" class="inp" placeholder="按回车确认,按esc取消" @keyup.enter.native="handleConfirmAdd(data)" @keyup.esc.native="handleCancelAdd(data)" @blur="handleCancelAdd(data)"></el-input>
          <div v-else class="tree-item">
            <i v-show="singleIconShow(data)" class="iconfont icon-tool_node_diamond"></i>
            <div v-padding-w class="content">
              <span class="label" :title="data[props.label]">{{ data[props.label] }}</span>
              <span class="userNum" v-if="!data[props.userNum] == 0">({{ data[props.userNum] }})</span>
              <div v-if="!notHaveHandle" class="handler">
                <i v-if="_iconShow('edit', data.noEdit)" class="iconfont icon-tool_edit" @click.stop="handleEdit(data)"></i>
                <i v-if="_iconShow('add', data.noAdd)" class="iconfont icon-icon_new" @click.stop="handleAdd(data, node)"></i>
                <i v-if="_iconShow('del', data.noDel)" class="iconfont icon-tool_close" @click.stop="handleDel(data)"></i>
              </div>
            </div>
          </div>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>

<script>
/**
 * @function checked-node-change 节点选中状态发生变化时的回调
 *  @param data {Array} 所有选中的节点
 *
 * 其他所有属性及事件和el-tree一致
 */

// 获取元素样式
function getStyle(dom) {
  var style = null;
  window.getComputedStyle ? (style = window.getComputedStyle(dom)) : (style = dom.currentStyle);
  return style;
}

// 获取元素父元素的paddingleft
function findNodePl(dom) {
  let parent;
  const find = el => {
    let p = el.parentNode;
    if (p.className.includes('el-tree-node__content')) return (parent = p);
    find(p);
  };
  find(dom);
  return getStyle(parent).paddingLeft;
}

const pls = [];

export default {
  name: 'HyDragTree',
  directives: {
    paddingW: {
      inserted(el) {
        const paddingLeft = findNodePl(el);
        // el.style.width = `calc(100% - ${paddingLeft}px)`
        // el.style.paddingRight = paddingLeft
      }
    }
  },
  props: {
    data: {
      type: Array
    },
    nodeKey: {
      type: String,
      default: 'id'
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        disabled: 'disabled',
        isLeaf: 'isLeaf',
        userNum: 'userNum'
      })
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    notHaveHandle: {
      type: Boolean
    },
    hiddenHandler: {
      // 需要隐藏的操作 add,edit,del
      type: String,
      default: ''
    },
    beforeAdd: [Promise, Function], // 一个promise或返回promise的函数， 点击添加按钮触发，如果返回值为假则不会添加
    defaultLabel: {
      // 新增时的默认名
      type: String,
      default: '新节点'
    },
    drag: {
      // 是否显示可拖拽编辑
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputParentNode: null, // 当前输入节点的父节点
      isInputing: false, // 是否在输入状态
      draggable: false, // 是否可拖拽
      oldTree: null
    };
  },
  methods: {
    // 进入拖拽状态
    handleStartDrag() {
      this.draggable = !this.draggable;
      this.oldTree = this.m_copy(this.data);
    },
    // 拖拽完成
    handleEndDrag() {
      this.draggable = !this.draggable;
      this.$emit('drop-over', this.m_copy(this.oldTree));
    },
    // 拖拽取消
    handleCancelDrag() {
      this.draggable = !this.draggable;
      this.$emit('update:data', this.m_copy(this.oldTree));
    },
    /**
     * 是否显示操作图标
     * @param {string} type 图标类型 add,edit,del
     * @param {boolean} itemShow 当前行是否隐藏图标
     * @returns {boolean} 是否显示
     */
    _iconShow(type, itemShow) {
      if (this.hiddenHandler.includes(type) || itemShow) return false;
      else return true;
    },
    /**
     * 是否显示单文件图标
     * @param data
     * @returns {boolean}
     */
    singleIconShow(data) {
      const ch = data[this.props.children];
      if (ch && ch.length) return false;
      else return true;
    },
    /**
     * 点击编辑按钮
     * @param data
     */
    handleEdit(data) {
      this.$emit('edit', data);
    },
    /**
     * 点击添加按钮
     * @param data {Object} 当前节点数据
     * @param node {Object} 当前节点
     */
    async handleAdd(data, node) {
      /*if (!this.isInputing) {
        if (this.beforeAdd) {
          await this.beforeAdd()
        }
        const hasCh = data[this.props.children]
        if (!hasCh) {
          this.$set(data, this.props.children, [])
        }
 
        data[this.props.children].unshift({
          INPUTING: true
        })
        node.expanded = true
 
        this.inputParentNode = data
        this.isInputing = true
        setTimeout(() => {
          this.$refs.input.focus()
        }, 400)
      }*/
      const hasCh = data[this.props.children];
      let newData = { [this.props.label]: this.defaultLabel };
      if (!hasCh) {
        this.$set(data, this.props.children, []);
      }

      data[this.props.children].unshift(newData);
      this.inputParentNode = data;
      node.expanded = true;
      this.$emit('add', newData, data);
    },
    /**
     * 点击删除按钮
     * @param data
     */
    handleDel(data) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      })
        .then(() => {
          this.$emit('del', data);
        })
        .catch(() => {});
    },
    /**
     * 添加节点
     * @param data
     */
    handleConfirmAdd(data) {
      this.$delete(data, 'INPUTING');
      this.$emit('add', data, this.inputParentNode);
      this.inputParentNode = null;
      this.isInputing = false;
    },
    /**
     * 取消添加节点
     * @param data
     */
    handleCancelAdd(data) {
      if (this.isInputing) {
        this.$nextTick(() => {
          this.inputParentNode[this.props.children].shift();
          this.inputParentNode = null;
          this.isInputing = false;
        });
      }
    },
    /**
     * 对树节点进行筛选时执行的方法
     * @param value
     * @param data
     * @returns {boolean}
     */
    filterNodeMethod(value, data) {
      if (!value) return true;
      return data.id === '-1' || data[this.props.label].indexOf(value) !== -1;
    },
    /**
     * 对树节点进行筛选
     * @param value 关键字
     */
    filter(value) {
      this.$refs.tree.filter(value);
    },
    /**
     * 节点选中状态发生变化时的回调
     * @param data {Object} 节点所对应的对象
     * @param checked {boolean} 节点本身是否被选中
     * @param indeterminate {boolean} 节点的子树中是否有被选中的节点
     */
    handleCheckChange(data, checked, indeterminate) {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      this.$emit('checked-node-change', checkedNodes);
    },
    handleDrop() {},
    // 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key);
    }
  }
};
</script>

<style scoped lang="scss">
.hy-drag-tree {
  height: 100%;
  padding: 33px;
  box-sizing: border-box;

  & .drag-edit {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 10px;

    & .edit {
      font-size: 14px;
      font-family: Source Han Sans CN;
      line-height: 1;
      color: rgba(67, 66, 93, 0.35);
      cursor: pointer;
    }

    & .achieve {
      font-size: 14px;
      font-family: Source Han Sans CN;
      line-height: 1;
      color: rgba(255, 115, 74, 1);
      cursor: pointer;
    }

    & .done {
      display: flex;
      align-items: center;

      & .tip {
        width: 167px;
        height: 30px;
        background: #ffffff;
        box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.07);
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        line-height: 30px;
        text-align: center;
        color: rgba(67, 66, 93, 0.5);
        margin-right: 5px;
      }

      & .edit {
        margin-left: 10px;
      }
    }
  }

  & .bar {
    height: 100%;

    & >>> .el-scrollbar__wrap {
      overflow-x: hidden;
    }

    & >>> .el-scrollbar__view {
      min-width: 100% !important;
    }
  }

  & .tree {
    width: 100%;
    box-sizing: border-box;
  }

  & >>> .el-tree {
    background-color: #ffffff;

    & .is-current > .el-tree-node__content {
      background-color: #ffffff;

      & .content {
        background-color: rgba(67, 66, 93, 0.05);
      }
    }

    & .el-tree-node__content {
      width: 100%;
      height: 36px;
      box-sizing: border-box;
      position: relative;

      &:hover {
        background-color: #ffffff;

        & .content {
          background-color: rgba(67, 66, 93, 0.05);
        }
      }

      & .is-leaf {
        width: 10px;
        padding: 0;
      }

      & > .el-tree-node__expand-icon {
        font-size: 12px;
        color: rgba(255, 115, 74, 1);
        &.el-tree-node__expand-icon.is-leaf {
          color: transparent;
        }
        &.expanded {
          transform: rotate(0);
        }
      }
    }
  }

  & .tree-item {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    & > i {
      color: rgba(255, 115, 74, 1);
      font-size: 12px;
    }

    & .content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }

    & .label {
      display: inline-block;
      color: rgba(67, 66, 93, 1);
      font-size: 16px;
      max-width: 48%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      line-height: 36px;
    }
    & .userNum {
      font-size: 16px;
      color: rgba(255, 115, 74, 1);
      padding-left: 5px;
    }

    & .handler {
      margin-left: auto;
      overflow: hidden;
      position: absolute;
      right: 13px;

      & i {
        font-size: 14px;
        color: rgba(67, 66, 93, 0.3);
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }

  & .inp {
    width: 95%;
  }
}
</style>
