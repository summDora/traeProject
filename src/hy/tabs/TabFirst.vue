<template>
  <div class="tab-content">
    <div class="button-group">
      <el-button type="primary" icon="el-icon-upload" @click="handleImport">导入</el-button>
      <el-button type="success" icon="el-icon-download" @click="handleExport">导出</el-button>
    </div>
    <el-table :data="tableData" border class="table-container">
      <el-table-column prop="startSoc" label="开始SOC">
      </el-table-column>
      <el-table-column prop="endSoc" label="结束SOC">
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间">
      </el-table-column>
      <el-table-column prop="chargingPower" label="充电功率">
      </el-table-column>
      <el-table-column prop="batteryCapacity" label="电池容量">
      </el-table-column>
      <el-table-column prop="occupationTime" label="占用时长">
      </el-table-column>
      <el-table-column prop="preciseTime" label="精确时间">
      </el-table-column>
      <el-table-column prop="stayAfterCharging" label="充电后停留时间">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TabFirst',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleImport() {
      this.$message.success('导入功能')
    },
    handleExport() {
      this.$message.success('导出功能')
    }
  }
}
</script>

<style scoped>
.tab-content {
  padding: 20px;
  height: 100%;
  box-sizing: border-box;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.table-container {
  width: 100%;
  max-height: calc(100% - 80px);
  overflow: auto;
}
</style>
