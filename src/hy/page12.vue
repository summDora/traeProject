<template>
  <div class="page12-container">
    <el-table :data="tableData" border class="edit-table">
      <el-table-column prop="name" label="姓名">
        <template slot-scope="scope">
          <el-input 
            v-if="editingId === scope.row.id" 
            v-model="scope.row.name" 
            class="edit-input"
          />
          <span v-else>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" label="年龄">
        <template slot-scope="scope">
          <el-input 
            v-if="editingId === scope.row.id" 
            v-model.number="scope.row.age" 
            type="number"
            class="edit-input"
          />
          <span v-else>{{ scope.row.age }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
        <template slot-scope="scope">
          <el-input 
            v-if="editingId === scope.row.id" 
            v-model="scope.row.email" 
            class="edit-input"
          />
          <span v-else>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门">
        <template slot-scope="scope">
          <el-input 
            v-if="editingId === scope.row.id" 
            v-model="scope.row.department" 
            class="edit-input"
          />
          <span v-else>{{ scope.row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button 
            v-if="editingId === scope.row.id" 
            type="primary" 
            size="small"
            @click="handleSave(scope.row)"
          >
            完成
          </el-button>
          <el-button 
            v-else 
            type="default" 
            size="small"
            @click="handleEdit(scope.row)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Page12',
  data() {
    return {
      editingId: null,
      originalData: {},
      tableData: [
        { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部' },
        { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '产品部' },
        { id: 3, name: '王五', age: 26, email: 'wangwu@example.com', department: '设计部' },
        { id: 4, name: '赵六', age: 30, email: 'zhaoliu@example.com', department: '运营部' },
        { id: 5, name: '钱七', age: 24, email: 'qianqi@example.com', department: '市场部' }
      ]
    }
  },
  methods: {
    handleEdit(row) {
      this.originalData[row.id] = { ...row }
      this.editingId = row.id
      this.$nextTick(() => {
        const inputs = document.querySelectorAll(`.edit-table .el-input__inner`)
        if (inputs.length > 0) {
          inputs[0].focus()
        }
      })
    },
    handleSave(row) {
      this.editingId = null
      this.$message.success('保存成功')
    }
  }
}
</script>

<style scoped>
.page12-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f7fa;
  box-sizing: border-box;
}

.edit-table {
  background-color: #fff;
  border-radius: 8px;
}

.edit-input {
  width: 100%;
}
</style>