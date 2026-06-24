<template>
  <el-table 
    :data="formattedData" 
    border 
    style="width: 100%"
    :span-method="mergeCells"
  >
    <!-- 第一层节点列 -->
    <el-table-column label="标题1" width="300">
      <template slot-scope="scope">
        <div v-if="!scope.row.editingLevel1" class="cell-content">
          {{ scope.row.level1.name }}
          <div class="operation-buttons">
            <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row, 1)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, 1)"></el-button>
          </div>
        </div>
        <el-input 
          v-else 
          v-model="scope.row.level1.name" 
          @blur="handleSave(scope.row, 1)"
          @keyup.enter.native="handleSave(scope.row, 1)"
          ref="editInput"
          :data-id="scope.row.level1.id"
          :data-level="1"
        ></el-input>
      </template>
    </el-table-column>
    
    <!-- 第二层节点列 -->
    <el-table-column label="标题2" width="300">
      <template slot-scope="scope">
        <div v-if="scope.row.level2 && !scope.row.editingLevel2" class="cell-content">
          {{ scope.row.level2.name }}
          <div class="operation-buttons">
            <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row, 2)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, 2)"></el-button>
          </div>
        </div>
        <el-input 
          v-if="scope.row.level2 && scope.row.editingLevel2" 
          v-model="scope.row.level2.name" 
          @blur="handleSave(scope.row, 2)"
          @keyup.enter.native="handleSave(scope.row, 2)"
          ref="editInput"
          :data-id="scope.row.level2.id"
          :data-level="2"
        ></el-input>
      </template>
    </el-table-column>
    
    <!-- 第三层节点列 -->
    <el-table-column label="标题3" width="300">
      <template slot-scope="scope">
        <div v-if="scope.row.level3 && !scope.row.editingLevel3" class="cell-content">
          {{ scope.row.level3.name }}
          <div class="operation-buttons">
            <el-button size="mini" icon="el-icon-edit" @click="handleEdit(scope.row, 3)"></el-button>
            <el-button size="mini" icon="el-icon-delete" type="danger" @click="handleDelete(scope.row, 3)"></el-button>
          </div>
        </div>
        <el-input 
          v-if="scope.row.level3 && scope.row.editingLevel3" 
          v-model="scope.row.level3.name" 
          @blur="handleSave(scope.row, 3)"
          @keyup.enter.native="handleSave(scope.row, 3)"
          ref="editInput"
          :data-id="scope.row.level3.id"
          :data-level="3"
        ></el-input>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          id: 1,
          name: '项目A',
          children: [
            {
              id: 2,
              name: 'A1',
              children: [
                {
                  id: 3,
                  name: '功能A11',
                },
                {
                  id: 4,
                  name: 'A12',
                }
              ]
            },
            {
              id: 5,
              name: '模块A2'
            }
          ]
        },
        {
          id: 6,
          name: '项目B',
          children: [
            {
              id: 7,
              name: '模块B1',
            }
          ]
        }
      ],
      formattedData: [], // 格式化后用于表格展示的数据
      level1Spans: [],   // 用于记录标题1列的合并信息
      level2Spans: [],   // 用于记录标题2列的合并信息
      level3Spans: []    // 用于记录标题3列的合并信息
    };
  },
  mounted() {
    this.formatTreeData();
  },
  methods: {
    /**
     * 将树形数据格式化为表格所需的扁平结构
     */
    formatTreeData() {
      this.formattedData = [];
      
      // 处理第一层节点
      this.tableData.forEach(level1 => {
        // 如果有第二层节点
        if (level1.children && level1.children.length) {
          level1.children.forEach(level2 => {
            // 如果有第三层节点
            if (level2.children && level2.children.length) {
              level2.children.forEach(level3 => {
                this.formattedData.push({
                  level1,
                  level2,
                  level3,
                  editingLevel1: false,
                  editingLevel2: false,
                  editingLevel3: false
                });
              });
            } else {
              // 只有两层节点
              this.formattedData.push({
                level1,
                level2,
                level3: null,
                editingLevel1: false,
                editingLevel2: false,
                editingLevel3: false
              });
            }
          });
        } else {
          // 只有第一层节点
          this.formattedData.push({
            level1,
            level2: null,
            level3: null,
            editingLevel1: false,
            editingLevel2: false,
            editingLevel3: false
          });
        }
      });
      
      // 计算所有列的合并信息
      this.calculateLevel1Spans();
      this.calculateLevel2Spans();
      this.calculateLevel3Spans();
    },
    
    /**
     * 计算标题1列的合并信息
     */
    calculateLevel1Spans() {
      this.level1Spans = [];
      if (this.formattedData.length === 0) return;
      
      let currentLevel1Id = this.formattedData[0].level1.id;
      let count = 1;
      
      for (let i = 1; i < this.formattedData.length; i++) {
        if (this.formattedData[i].level1.id === currentLevel1Id) {
          count++;
        } else {
          this.level1Spans.push({
            id: currentLevel1Id,
            startRow: this.level1Spans.reduce((sum, item) => sum + item.rowSpan, 0),
            rowSpan: count
          });
          currentLevel1Id = this.formattedData[i].level1.id;
          count = 1;
        }
      }
      
      // 添加最后一组
      this.level1Spans.push({
        id: currentLevel1Id,
        startRow: this.level1Spans.reduce((sum, item) => sum + item.rowSpan, 0),
        rowSpan: count
      });
    },
    
    /**
     * 计算标题2列的合并信息
     */
    calculateLevel2Spans() {
      this.level2Spans = [];
      if (this.formattedData.length === 0) return;
      
      let currentLevel1Id = null;
      let currentLevel2Id = null;
      let count = 0;
      
      this.formattedData.forEach((row, index) => {
        // 对于没有level2的行不参与合并计算
        if (!row.level2) {
          if (count > 0) {
            this.level2Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              startRow: index - count,
              rowSpan: count
            });
            count = 0;
          }
          return;
        }
        
        // 处理新的level1组
        if (row.level1.id !== currentLevel1Id) {
          if (count > 0) {
            this.level2Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              startRow: index - count,
              rowSpan: count
            });
          }
          currentLevel1Id = row.level1.id;
          currentLevel2Id = row.level2.id;
          count = 1;
        } 
        // 同一level1下的新level2
        else if (row.level2.id !== currentLevel2Id) {
          if (count > 0) {
            this.level2Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              startRow: index - count,
              rowSpan: count
            });
          }
          currentLevel2Id = row.level2.id;
          count = 1;
        } 
        // 同一level2
        else {
          count++;
        }
        
        // 处理最后一组
        if (index === this.formattedData.length - 1 && count > 0) {
          this.level2Spans.push({
            level1Id: currentLevel1Id,
            level2Id: currentLevel2Id,
            startRow: index - count + 1,
            rowSpan: count
          });
        }
      });
    },
    
    /**
     * 计算标题3列的合并信息
     */
    calculateLevel3Spans() {
      this.level3Spans = [];
      if (this.formattedData.length === 0) return;
      
      let currentLevel1Id = null;
      let currentLevel2Id = null;
      let currentLevel3Id = null;
      let count = 0;
      
      this.formattedData.forEach((row, index) => {
        // 对于没有level3的行不参与合并计算
        if (!row.level3) {
          if (count > 0) {
            this.level3Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              level3Id: currentLevel3Id,
              startRow: index - count,
              rowSpan: count
            });
            count = 0;
          }
          return;
        }
        
        // 处理新的level1组
        if (row.level1.id !== currentLevel1Id) {
          if (count > 0) {
            this.level3Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              level3Id: currentLevel3Id,
              startRow: index - count,
              rowSpan: count
            });
          }
          currentLevel1Id = row.level1.id;
          currentLevel2Id = row.level2.id;
          currentLevel3Id = row.level3.id;
          count = 1;
        } 
        // 同一level1下的新level2
        else if (row.level2.id !== currentLevel2Id) {
          if (count > 0) {
            this.level3Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              level3Id: currentLevel3Id,
              startRow: index - count,
              rowSpan: count
            });
          }
          currentLevel2Id = row.level2.id;
          currentLevel3Id = row.level3.id;
          count = 1;
        }
        // 同一level2下的新level3
        else if (row.level3.id !== currentLevel3Id) {
          if (count > 0) {
            this.level3Spans.push({
              level1Id: currentLevel1Id,
              level2Id: currentLevel2Id,
              level3Id: currentLevel3Id,
              startRow: index - count,
              rowSpan: count
            });
          }
          currentLevel3Id = row.level3.id;
          count = 1;
        }
        // 同一level3
        else {
          count++;
        }
        
        // 处理最后一组
        if (index === this.formattedData.length - 1 && count > 0) {
          this.level3Spans.push({
            level1Id: currentLevel1Id,
            level2Id: currentLevel2Id,
            level3Id: currentLevel3Id,
            startRow: index - count + 1,
            rowSpan: count
          });
        }
      });
    },
    
    /**
     * 处理单元格合并
     */
    mergeCells({ row, column, rowIndex, columnIndex }) {
      // 处理标题1列的合并
      if (columnIndex === 0) {
        const spanInfo = this.level1Spans.find(item => 
          rowIndex >= item.startRow && rowIndex < item.startRow + item.rowSpan
        );
        
        if (spanInfo) {
          return rowIndex === spanInfo.startRow 
            ? { rowspan: spanInfo.rowSpan, colspan: 1 } 
            : { rowspan: 0, colspan: 0 };
        }
      }
      // 处理标题2列的合并
      else if (columnIndex === 1 && row.level2) {
        const spanInfo = this.level2Spans.find(item => 
          item.level1Id === row.level1.id &&
          item.level2Id === row.level2.id &&
          rowIndex >= item.startRow && 
          rowIndex < item.startRow + item.rowSpan
        );
        
        if (spanInfo) {
          return rowIndex === spanInfo.startRow 
            ? { rowspan: spanInfo.rowSpan, colspan: 1 } 
            : { rowspan: 0, colspan: 0 };
        }
      }
      // 处理标题3列的合并
      else if (columnIndex === 2 && row.level3) {
        const spanInfo = this.level3Spans.find(item => 
          item.level1Id === row.level1.id &&
          item.level2Id === row.level2.id &&
          item.level3Id === row.level3.id &&
          rowIndex >= item.startRow && 
          rowIndex < item.startRow + item.rowSpan
        );
        
        if (spanInfo) {
          return rowIndex === spanInfo.startRow 
            ? { rowspan: spanInfo.rowSpan, colspan: 1 } 
            : { rowspan: 0, colspan: 0 };
        }
      }
      
      return { rowspan: 1, colspan: 1 };
    },
    
    /**
     * 处理编辑操作
     * @param {Object} row 当前行数据
     * @param {Number} level 层级(1-3)
     */
    handleEdit(row, level) {
      // 先关闭所有编辑状态
      ['editingLevel1', 'editingLevel2', 'editingLevel3'].forEach(key => {
        row[key] = false;
      });
      
      // 开启当前层级的编辑状态
      row[`editingLevel${level}`] = true;
      
      // 等待DOM更新后聚焦到输入框
      this.$nextTick(() => {
        const inputs = this.$refs.editInput;
        if (Array.isArray(inputs)) {
          const input = inputs.find(el => 
            el.$el.getAttribute('data-id') === row[`level${level}`].id.toString() &&
            el.$el.getAttribute('data-level') === level.toString()
          );
          if (input) {
            input.focus();
          }
        }
      });
    },
    
    /**
     * 处理保存操作
     * @param {Object} row 当前行数据
     * @param {Number} level 层级(1-3)
     */
    handleSave(row, level) {
      row[`editingLevel${level}`] = false;
      this.$message.success('修改成功');
    },
    
    /**
     * 处理删除操作
     * @param {Object} row 当前行数据
     * @param {Number} level 层级(1-3)
     */
    handleDelete(row, level) {
      this.$confirm('确定要删除该节点及所有子节点吗？', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (level === 1) {
          // 删除第一层节点及所有子节点
          this.tableData = this.tableData.filter(item => item.id !== row.level1.id);
        } else if (level === 2) {
          // 删除第二层节点及所有子节点
          const level1Item = this.tableData.find(item => item.id === row.level1.id);
          if (level1Item && level1Item.children) {
            level1Item.children = level1Item.children.filter(item => item.id !== row.level2.id);
          }
        } else if (level === 3) {
          // 删除第三层节点
          const level1Item = this.tableData.find(item => item.id === row.level1.id);
          if (level1Item && level1Item.children) {
            const level2Item = level1Item.children.find(item => item.id === row.level2.id);
            if (level2Item && level2Item.children) {
              level2Item.children = level2Item.children.filter(item => item.id !== row.level3.id);
            }
          }
        }
        
        // 重新格式化数据并刷新表格
        this.formatTreeData();
        this.$message.success('删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    }
  }
};
</script>

<style scoped>
.cell-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 12px 0;
}

.operation-buttons {
  display: flex;
  gap: 5px;
}

/* 优化合并单元格的样式 */
::v-deep .el-table__cell {
  vertical-align: middle;
}

/* 编辑状态的输入框样式优化 */
::v-deep .el-input {
  width: 200px;
}
</style>
