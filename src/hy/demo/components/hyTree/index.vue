<template>
  <div class='treeBox' @click.capture='clickTreeBox'>
    <div class='treeDo'>
      <el-input size='small' v-if='ifShowTreeSearch' :placeholder="placeholder" v-model="filterText"></el-input>
      <slot></slot>
    </div>
    <el-tree
      v-bind="{...$attrs, ...$props}"
      v-on="$listeners"
      :accordion='accordion' 
      :data="treeData" 
      :props="defaultTreeProps" 
      @node-click="treeClick" 
      :show-checkbox='showTreeCheckBox' 
      @check-change="treeSelect"
      :draggable='draggable'
      :filter-node-method="filterNode"
      :node-key="treeNodeKey"
      :default-expand-all='ifExpandAll'
      :expand-on-click-node='ifClickNodeExpand'
      :check-strictly='checkStrictly'
      @node-expand='nodeExpand'
      ref='hyTree'
    >
      <span class='treeSlot' slot-scope="{node, data}" @mousemove="mousemove(data[treeNodeKey])" @mouseleave="mouseleave(data[treeNodeKey])">
        <span >{{node.label}}</span>
        <span v-if='ifCanDoSomethings.ifPromise && data[treeNodeKey]==mouseHoverNode'>
          <i class="el-icon-circle-plus-outline icon" v-if='ifCanDoSomethings.operation.append&&!node.data.closeAdd' @click='append(node, data)'></i>
          <i class="el-icon-edit icon" v-if='ifCanDoSomethings.operation.edit&&!node.data.closeEdit' @click='edit(node, data)'></i>
          <i class="el-icon-delete icon" v-if='ifCanDoSomethings.operation.remove&&!node.data.closeDelete' @click='remove(node, data)'></i>
          <slot name='treeBtn' :node='node'></slot>
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
/**
 * 必填
 * @param {treeData} 树形结构数据
 */

/**
 * 选填
 * @param {defaultTreeProps} 节点属性 {children: 'children', label: 'label'} children为子节点属性，label为该节点属性
 * @param {treeDefaultCheck} 被选中节点，key或者节点两种形式，建议以key为标准
 * @param {ifExpandAll} 是否展开所有节点
 * @param {accordion} 是否每次只打开一个同级树节点展开
 * @param {checkStrictly} 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
 * @param {draggable} 是否可以拖拽
 * @param {ifShowTreeSearch} 是否提供搜索功能
 * @param {showTreeCheckBox} 是否可以多选(checkbox)
 * @param {treeDefaultExpand} 展开节点，该数据为节点唯一标识(node-key)，例如：id
 * @param {ifCanDoSomethings} 是否有增删改事件 {ifPromise:false,operation: {append: false,edit: false,remove: false}} ifPromise:是否有操作，append是否有添加，edit是否有编辑，remove是否有删除
 * @function treeAppendChild 增加子节点
 * @function treeEditChild 修改节点数据
 * @function treeRemoveChild 移除节点
 * @function treeClick(e, node) 点击节点事件，e为点击节点数据, node为点击的节点
 * @function treeSelect(data,treeCheckedKeys,treeCheckedNodes,checked,indeterminate) 选择checkbox事件 data:选中的节点数据，treeCheckedKeys:所有被选中节点key的集合,treeCheckedNodes:所有被选中节点的数据集合
 */
/**
 * closeAdd/closeEdit/closeDelete true隐藏对应按钮
 */
export default {
  name: 'hyTree',
  props: {
    treeData: {
      type: Array,
      default:()=> []
    },
    defaultTreeProps: {
      type: Object,
      default() {
        return { children: 'children', label: 'label' }
      }
    },
    showTreeCheckBox: {
      type: Boolean,
      default:()=> false
    },
    accordion: {
      type: Boolean,
      default:()=> false
    },
    draggable: {
      type: Boolean,
      default:()=> false
    },
    ifShowTreeSearch: {
      type: Boolean,
      default:()=> false
    },
    treeNodeKey: {
      type: String,
      default:()=> 'id'
    },
    treeDefaultCheck: {
      type: Array,
      default:()=> []
    },
    treeDefaultExpand: {
      type: Array,
      default:()=> []
    },
    ifExpandAll: {
      type: Boolean,
      default:()=> false
    },
    ifCanDoSomethings: {
      type: Object,
      default() {
        return {
          ifPromise: false,
          operation: {
            append: false,
            edit: false,
            remove: false
          }
        }
      }
    },
    ifClickNodeExpand: {
      type: Boolean,
      default:()=> false
    },
    checkStrictly: {
      type: Boolean,
      default: ()=> false
    },
    placeholder: {
      type: String,
      default: ()=> '输入关键字进行过滤'
    }
  },
  data() {
    return {
      filterText: '',
      allExpand: [],
      mouseHoverNode: ''
    }
  },
  created() {
    this.$nextTick(() => {
      this.$refs.hyTree.setCheckedKeys(this.treeDefaultCheck)
      !this.ifExpandAll && this.setDefaultCheck(this.treeDefaultExpand)
    })
  },
  watch: {
    filterText(val) {
      this.$refs.hyTree.filter(val)
    },
    treeDefaultCheck(val) {
      if(!this.showTreeCheckBox) return
      if (Object.prototype.toString.call(val[0]) === '[object Object]') {
        this.$refs.hyTree.setCheckedNodes(val)
      } else {
        this.$refs.hyTree.setCheckedKeys(val)
      }
    },
    treeDefaultExpand(val) {
      this.setDefaultCheck(val)
    }
  },
  methods: {
    setDefaultCheck(val) {
      this.allExpand = []
      this.closeAllExpand()
      const treeAllNodes = this.$refs.hyTree.store._getAllNodes()
      this.getAllExpandNodes(val)
        .then(data => {
          data.map(e => {
            treeAllNodes.map(item => {
              if (item.key === e) {
                item.expanded = true
              }
            })
          })
        })
        .catch(() => {
          this.closeAllExpand()
        })
    },
    getAllExpandNodes(val) {
      const len = val.length
      const p = new Promise((resolve, reject) => {
        let getAllNodes
        if (len > 0) {
          val.map(e => {
            const currentNode = this.$refs.hyTree.getNode(e)
            getAllNodes = this.getAllExpand(currentNode)
          })
          resolve(Array.from(new Set(getAllNodes)))
        } else {
          reject(0)
        }
      })
      return p
    },
    getAllExpand(val) {
      if (val.key) {
        this.allExpand.push(val.key)
      }
      if (val.parent) {
        this.getAllExpand(val.parent)
      }
      return this.allExpand
    },
    closeAllExpand() {
      const treeAllNodes = this.$refs.hyTree.store._getAllNodes()
      treeAllNodes.map(item => item.expanded = false)
    },
    treeClick(e, node, nodes) {
      this.$emit('treeClick', e, node)
    },
    nodeExpand(e) {
      this.$emit('nodeExpand', e)
    },
    treeSelect(data, checked, indeterminate) {
      const treeCheckedKeys = this.$refs.hyTree.getCheckedKeys()
      const treeCheckedNodes = this.$refs.hyTree.getCheckedNodes()
      this.$emit(
        'treeSelect',
        data,
        treeCheckedKeys,
        treeCheckedNodes,
        checked,
        indeterminate
      )
    },
    filterNode(value, data) {
      if (!value) return true
      return data[this.defaultTreeProps.label].indexOf(value) !== -1
    },
    mousemove(e) {
      this.mouseHoverNode = e
    },
    mouseleave(e) {
      this.mouseHoverNode = ''
    },
    append(data) {
      // this.$refs.hyTree.append({id:10,label:'test'}, data.key) // 添加子节点
      this.$emit('treeAppendChild', data)
    },
    edit(data) {
      this.$emit('treeEditChild', data)
    },
    remove(data) {
      // this.$refs.hyTree.remove(data.key) // 删除tree节点
      this.$confirm('是否删除?', "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
      }).then(()=>this.$emit('treeRemoveChild', data))
    },
    clickTreeBox() {
      this.$emit('clickTreeBox')
    }
  }
}
</script>

<style scoped>
@import './index.css'
</style>

