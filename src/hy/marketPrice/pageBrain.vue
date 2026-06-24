<template>
  <div class="pagebrain-container">
    <div class="header">
      <h2>脑图数据维护</h2>
      <div class="header-actions">
        <el-button type="primary" @click="addRootNode">添加根节点</el-button>
        <el-button @click="clearAll">清空数据</el-button>
      </div>
    </div>

    <div class="main-content">
      <div class="tree-panel">
        <div class="panel-header">
          <span>脑图结构</span>
          <span class="level-info">当前层级: {{ currentLevel }} / 5 · 可拖拽调整层级</span>
        </div>
        <div class="tree-container">
          <div v-if="treeData.length === 0" class="empty-state">
            <div class="empty-icon">📋</div>
            <div class="empty-text">暂无数据，请添加根节点</div>
          </div>
          <el-tree
            v-else
            ref="brainTree"
            node-key="id"
            highlight-current
            draggable
            :allow-drop="allowDrop"
            :data="treeData"
            :props="treeProps"
            :indent="22"
            :expand-on-click-node="false"
            :render-content="renderTreeContent"
            @node-click="handleNodeClick"
            @node-drop="handleNodeDrop"
            default-expand-all
          />
        </div>
      </div>

      <div class="detail-panel">
        <div class="panel-header">
          <span>详情编辑</span>
        </div>
        <div v-if="selectedNode" class="detail-content">
          <el-form :model="nodeForm" label-width="100px">
            <el-form-item label="节点类型">
              <el-select v-model="nodeForm.type" @change="handleTypeChange">
                <el-option label="分类标题" value="category" />
                <el-option label="政策细则" value="policy" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="nodeForm.type === 'category'" label="标题">
              <el-input v-model="nodeForm.label" placeholder="请输入分类标题" />
            </el-form-item>
            <el-form-item v-else label="节点标题">
              <el-input :value="policyNodeLabel" disabled placeholder="请先选择政策，标题将自动取政策标题" />
            </el-form-item>
            <div v-if="nodeForm.type === 'policy'">
              <el-form-item label="政策选择">
                <el-button type="primary" @click="showPolicySearch = true">搜索政策</el-button>
              </el-form-item>
              <div v-if="nodeForm.policies && nodeForm.policies.length > 0" class="policies-scroll-container">
                <div class="policies-list">
                  <div v-for="(policy, index) in nodeForm.policies" :key="policy.id" class="policy-item">
                    <div class="policy-header">
                      <span class="policy-title">{{ policy.title }}</span>
                      <span class="remove-policy" @click="removePolicy(index)">删除</span>
                    </div>
                    <el-form-item label="摘要">
                      <el-input
                        type="textarea"
                        v-model="policy.summary"
                        :rows="3"
                        placeholder="请输入本政策的摘要"
                      />
                    </el-form-item>
                  </div>
                </div>
              </div>
            </div>
            <el-form-item>
              <el-button type="primary" @click="saveNode">保存</el-button>
              <el-button @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="empty-detail">
          <div class="empty-icon">👈</div>
          <div class="empty-text">请选择一个节点进行编辑</div>
        </div>
      </div>
    </div>

    <el-dialog title="搜索政策" :visible.sync="showPolicySearch" width="600px">
      <div class="search-box">
        <el-input
          v-model="searchKeyword"
          placeholder="请输入政策关键词"
          @keyup.enter.native="searchPolicies"
        >
          <el-button slot="append" @click="searchPolicies">搜索</el-button>
        </el-input>
      </div>
      <el-table
        ref="policyTable"
        :data="filteredPolicies"
        row-key="id"
        :reserve-selection="true"
        style="width: 100%;"
      >
        <el-table-column type="selection" />
        <el-table-column prop="title" label="政策标题" />
        <el-table-column prop="summary" label="摘要" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showPolicySearch = false">取消</el-button>
        <el-button type="primary" @click="confirmPolicySelection">确定选择</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PageBrain',
  data() {
    return {
      treeData: [
        { id: 'root-1', label: '政策总览', type: 'category', children: [] }
      ],
      treeProps: { children: 'children', label: 'label' },
      selectedNode: null,
      currentLevel: 1,
      nodeForm: { id: '', label: '', type: 'category', policies: [] },
      showPolicySearch: false,
      searchKeyword: '',
      allPolicies: [
        { id: 'p1', title: '关于促进新能源发展的指导意见', summary: '加快推进新能源项目建设。' },
        { id: 'p2', title: '电力市场改革实施方案', summary: '深化电力体制改革。' },
        { id: 'p3', title: '储能技术发展规划', summary: '推动储能技术研发。' },
        { id: 'p4', title: '智能电网建设指导意见', summary: '加快智能电网建设。' },
        { id: 'p5', title: '电价改革实施细则', summary: '完善电价形成机制。' },
        { id: 'p6', title: '可再生能源消纳保障机制', summary: '确保可再生能源全额收购。' },
        { id: 'p7', title: '电动汽车充电基础设施规划', summary: '加快充电基础设施建设。' },
        { id: 'p8', title: '碳排放权交易管理办法', summary: '建立碳排放权交易市场。' },
        { id: 'p9', title: '节能降耗激励政策', summary: '鼓励企业节能降耗。' },
        { id: 'p10', title: '分布式能源发展指导意见', summary: '支持分布式能源发展。' }
      ]
    }
  },
  computed: {
    filteredPolicies() {
      if (!this.searchKeyword.trim()) {
        return this.allPolicies
      }
      return this.allPolicies.filter(p =>
        p.title.includes(this.searchKeyword) || p.summary.includes(this.searchKeyword)
      )
    },
    policyNodeLabel() {
      if (!this.nodeForm.policies || this.nodeForm.policies.length === 0) {
        return ''
      }
      return this.nodeForm.policies.map(p => p.title).join('、')
    }
  },
  methods: {
    renderTreeContent(h, { node, data }) {
      const iconClass = data.type === 'category' ? 'el-icon-folder' : 'el-icon-document'
      const children = [
        h('i', { class: [iconClass, 'node-icon'] }),
        h('span', { class: 'node-label' }, node.label),
        h('span', { class: 'node-type-badge' }, data.type === 'category' ? '分类' : '政策')
      ]
      if (this.canAddChild(data)) {
        children.push(
          h('el-button', {
            props: { type: 'text', size: 'mini' },
            class: 'add-child-btn',
            on: {
              click: (e) => {
                e.stopPropagation()
                this.addChild(data)
              }
            }
          }, '增加子项')
        )
      }
      children.push(
        h('el-button', {
          props: { type: 'text', size: 'mini' },
          on: {
            click: (e) => {
              e.stopPropagation()
              this.editNode(data)
            }
          }
        }, '编辑'),
        h('el-button', {
          props: { type: 'text', size: 'mini' },
          style: { color: '#f56c6c' },
          on: {
            click: (e) => {
              e.stopPropagation()
              this.deleteNode(data)
            }
          }
        }, '删除')
      )
      return h('span', { class: 'tree-node' }, children)
    },
    handleNodeClick(data) {
      this.selectedNode = data
      this.currentLevel = this.getNodeLevel(data)
      this.nodeForm = {
        id: data.id,
        label: data.label,
        type: data.type || 'category',
        policies: data.policies ? JSON.parse(JSON.stringify(data.policies)) : []
      }
      if (this.nodeForm.type === 'policy') {
        this.syncPolicyLabel()
      }
      this.setTreeCurrentKey(data.id)
    },
    setTreeCurrentKey(key) {
      this.$nextTick(() => {
        const tree = this.$refs.brainTree
        if (tree) {
          tree.setCurrentKey(key)
        }
      })
    },
    calcLevel(data, tree, level) {
      for (let node of tree) {
        if (node.id === data.id) return level
        if (node.children && node.children.length) {
          const found = this.calcLevel(data, node.children, level + 1)
          if (found !== null) return found
        }
      }
      return null
    },
    getNodeLevel(data) {
      return this.calcLevel(data, this.treeData, 1) || 1
    },
    canAddChild(data) {
      const level = this.getNodeLevel(data)
      return level < 5
    },
    getSubtreeDepth(data) {
      if (!data.children || !data.children.length) {
        return 1
      }
      return 1 + Math.max(...data.children.map(child => this.getSubtreeDepth(child)))
    },
    isNodeDescendant(ancestorData, targetData) {
      if (!ancestorData.children || !ancestorData.children.length) {
        return false
      }
      for (const child of ancestorData.children) {
        if (child.id === targetData.id) return true
        if (this.isNodeDescendant(child, targetData)) return true
      }
      return false
    },
    allowDrop(draggingNode, dropNode, type) {
      const dragData = draggingNode.data
      const dropData = dropNode.data
      if (draggingNode === dropNode || draggingNode.contains(dropNode)) {
        return false
      }
      if (this.isNodeDescendant(dragData, dropData)) {
        return false
      }
      const subtreeDepth = this.getSubtreeDepth(dragData)
      const dropLevel = this.getNodeLevel(dropData)
      let newLevel
      if (type === 'inner') {
        if (dropLevel >= 5) return false
        newLevel = dropLevel + 1
      } else {
        newLevel = dropLevel
      }
      return newLevel + subtreeDepth - 1 <= 5
    },
    handleNodeDrop() {
      if (this.selectedNode) {
        this.currentLevel = this.getNodeLevel(this.selectedNode)
        this.setTreeCurrentKey(this.selectedNode.id)
      }
    },
    addRootNode() {
      const newNode = {
        id: 'root-' + Date.now(),
        label: '新标题',
        type: 'category',
        children: []
      }
      this.treeData.push(newNode)
      this.handleNodeClick(newNode)
    },
    addChild(parent) {
      if (!this.canAddChild(parent)) {
        this.$message.warning('最多支持5层层级')
        return
      }
      if (!parent.children) {
        this.$set(parent, 'children', [])
      }
      const newNode = {
        id: 'node-' + Date.now(),
        label: '新标题',
        type: 'category',
        children: []
      }
      parent.children.push(newNode)
      this.handleNodeClick(newNode)
    },
    syncPolicyLabel() {
      if (this.nodeForm.type !== 'policy') return
      this.nodeForm.label = this.policyNodeLabel
    },
    editNode(data) {
      this.handleNodeClick(data)
    },
    deleteNode(data) {
      this.$confirm('确定删除？').then(() => {
        this.removeNode(this.treeData, data)
        this.selectedNode = null
        this.nodeForm = {}
        this.setTreeCurrentKey(null)
        this.$message.success('删除成功')
      }).catch(() => {})
    },
    removeNode(tree, data) {
      const index = tree.findIndex(n => n.id === data.id)
      if (index > -1) {
        tree.splice(index, 1)
        return true
      }
      for (let node of tree) {
        if (node.children && this.removeNode(node.children, data)) {
          return true
        }
      }
      return false
    },
    handleTypeChange() {
      if (this.nodeForm.type === 'category') {
        this.nodeForm.policies = []
        if (!this.nodeForm.label.trim()) {
          this.nodeForm.label = '新标题'
        }
      } else {
        this.syncPolicyLabel()
      }
    },
    saveNode() {
      if (this.nodeForm.type === 'policy') {
        this.syncPolicyLabel()
        if (!this.nodeForm.policies || this.nodeForm.policies.length === 0) {
          this.$message.error('请先选择政策')
          return
        }
      }
      if (!this.nodeForm.label.trim()) {
        this.$message.error('请输入标题')
        return
      }
      const updateNode = (tree) => {
        for (let node of tree) {
          if (node.id === this.nodeForm.id) {
            node.label = this.nodeForm.label
            node.type = this.nodeForm.type
            node.policies = JSON.parse(JSON.stringify(this.nodeForm.policies))
            return true
          }
          if (node.children && updateNode(node.children)) {
            return true
          }
        }
        return false
      }
      updateNode(this.treeData)
      if (this.selectedNode && this.selectedNode.id === this.nodeForm.id) {
        this.selectedNode.label = this.nodeForm.label
        this.selectedNode.type = this.nodeForm.type
        this.selectedNode.policies = JSON.parse(JSON.stringify(this.nodeForm.policies))
      }
      this.setTreeCurrentKey(this.nodeForm.id)
      this.$message.success('保存成功')
    },
    cancelEdit() {
      this.selectedNode = null
      this.nodeForm = {}
      this.setTreeCurrentKey(null)
    },
    clearAll() {
      this.$confirm('确定清空所有数据？').then(() => {
        this.treeData = []
        this.selectedNode = null
        this.nodeForm = {}
        this.$message.success('已清空')
      }).catch(() => {})
    },
    searchPolicies() {
      this.syncPolicyTableSelection()
    },
    syncPolicyTableSelection() {
      this.$nextTick(() => {
        const table = this.$refs.policyTable
        if (!table || !this.nodeForm.policies) return
        table.clearSelection()
        const existingIds = this.nodeForm.policies.map(p => p.id)
        this.filteredPolicies.forEach(policy => {
          if (existingIds.indexOf(policy.id) > -1) {
            table.toggleRowSelection(policy, true)
          }
        })
      })
    },
    confirmPolicySelection() {
      const table = this.$refs.policyTable
      if (table) {
        const selectedRows = table.selection || []
        const existingIds = this.nodeForm.policies.map(p => p.id)
        selectedRows.forEach(row => {
          if (existingIds.indexOf(row.id) === -1) {
            this.nodeForm.policies.push({
              id: row.id,
              title: row.title,
              summary: row.summary
            })
          }
        })
        this.syncPolicyLabel()
      }
      this.showPolicySearch = false
    },
    removePolicy(index) {
      this.nodeForm.policies.splice(index, 1)
      this.syncPolicyLabel()
    }
  },
  watch: {
    showPolicySearch(val) {
      if (val) {
        this.searchKeyword = ''
        this.$nextTick(() => {
          this.syncPolicyTableSelection()
        })
      }
    },
    searchKeyword() {
      if (this.showPolicySearch) {
        this.syncPolicyTableSelection()
      }
    }
  }
}
</script>

<style scoped>
.pagebrain-container {
  padding: 20px;
  min-height: calc(100vh - 96px);
  background: #f5f7fa;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.main-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 180px);
}

.tree-panel, .detail-panel {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
}

.tree-panel { flex: 1; }
.detail-panel { flex: 1; }

.panel-header {
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.level-info {
  font-size: 12px;
  color: #999;
  font-weight: normal;
}

.tree-container {
  flex: 1;
  padding: 12px 16px;
  overflow: auto;
}

.tree-container >>> .el-tree-node {
  margin-bottom: 8px;
}

.tree-container >>> .el-tree-node__content {
  height: auto;
  min-height: 44px;
  padding: 6px 0;
  line-height: 1.5;
}

.tree-container >>> .el-tree-node__children {
  margin-top: 4px;
  margin-left: 12px;
}

.tree-container >>> .node-icon {
  font-size: 16px;
  flex-shrink: 0;
  margin-right: 12px;
}

.tree-container >>> .node-icon.el-icon-folder {
  color: #e6a23c;
}

.tree-container >>> .node-icon.el-icon-document {
  color: #409eff;
}

.tree-container >>> .node-label {
  flex: 1;
  min-width: 0;
}

.tree-container >>> .add-child-btn {
  margin-left: 12px;
}

.empty-state, .empty-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #333;
  min-height: 32px;
  transition: background-color 0.2s ease;
}

.tree-node:hover {
  background-color: #e6f7ff;
}

.node-type-badge {
  font-size: 11px;
  color: #666;
  background: #f0f5ff;
  padding: 3px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.detail-content { padding: 20px; }

.policies-scroll-container {
  max-height: 300px;
  overflow-y: auto;
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.policies-list {
  padding: 10px;
}

.policy-item {
  background: #fafafa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.policy-title {
  font-weight: 600;
  color: #333;
}

.remove-policy {
  color: #f56c6c;
  cursor: pointer;
  font-size: 13px;
}

.search-box { margin-bottom: 15px; }

.dialog-footer { text-align: right; }
</style>