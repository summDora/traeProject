<template>
  <div class="table-container">
    <div class="interaction-options">
      <span>交互方式：</span>
      <el-radio-group v-model="interactionMode" size="small">
        <el-radio-button label="tooltip">悬浮提示</el-radio-button>
        <el-radio-button label="dialog">点击弹窗</el-radio-button>
        <el-radio-button label="icon">问号图标</el-radio-button>
      </el-radio-group>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        v-for="col in columns"
        :key="col.prop"
        :prop="col.prop"
        :label="col.label"
        width="180"
      >
        <template slot="header" slot-scope="scope">
          <div class="header-wrapper">
            <span class="header-text">{{ col.label }}</span>
            <template v-if="interactionMode === 'tooltip'">
              <el-tooltip
                placement="top"
                effect="light"
                popper-class="explanation-tooltip"
              >
                <div slot="content" class="tooltip-content">
                  <div class="explanation-row">
                    <span class="label">维度：</span>
                    <span>{{ col.explanation.dimension }}</span>
                  </div>
                  <div class="explanation-row">
                    <span class="label">分类标签：</span>
                  </div>
                  <div style="margin-left: 50px;">
                    <el-tag v-for="tag in col.explanation.categories" :key="tag" size="mini" style="margin-right: 5px; margin-bottom: 5px;">
                      {{ tag }}
                    </el-tag>
                  </div>
                  <div class="explanation-row">
                    <span class="label">量化范围：</span>
                    <span>{{ col.explanation.range }}</span>
                  </div>
                </div>
                <i class="el-icon-question header-icon"></i>
              </el-tooltip>
            </template>
            <template v-else-if="interactionMode === 'dialog'">
              <i
                class="el-icon-question header-icon"
                @click="showExplanationDialog(col)"
              ></i>
            </template>
            <template v-else>
              <el-popover
                placement="top"
                width="300"
                trigger="click"
              >
                <div class="explanation-content">
                  <div class="explanation-row">
                    <span class="label">维度：</span>
                    <span>{{ col.explanation.dimension }}</span>
                  </div>
                  <div class="explanation-row">
                    <span class="label">分类标签：</span>
                    <el-tag v-for="tag in col.explanation.categories" :key="tag" size="small" style="margin-right: 5px;">
                      {{ tag }}
                    </el-tag>
                  </div>
                  <div class="explanation-row">
                    <span class="label">量化范围：</span>
                    <span>{{ col.explanation.range }}</span>
                  </div>
                </div>
                <i slot="reference" class="el-icon-info header-icon"></i>
              </el-popover>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      title="表头解释"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div v-if="currentColumn" class="explanation-dialog-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="维度">
            {{ currentColumn.explanation.dimension }}
          </el-descriptions-item>
          <el-descriptions-item label="分类标签">
            <el-tag v-for="tag in currentColumn.explanation.categories" :key="tag" size="small" style="margin-right: 5px;">
              {{ tag }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="量化范围">
            {{ currentColumn.explanation.range }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'TableWithExplanation',
  data() {
    return {
      interactionMode: 'tooltip',
      dialogVisible: false,
      currentColumn: null,
      tableData: [
        {
          startTime: '日间型',
          endTime: '中等续航时间段',
          soc: '中续航电量型',
          capacity: '中续航电量型',
          battery: '小电池型',
          dailyDistance: '60km / 天'
        },
        {
          startTime: '日间型',
          endTime: '缓降续航时间段',
          soc: '高续航电量型',
          capacity: '中续航电量型',
          battery: '小电池型',
          dailyDistance: '60km / 天'
        },
        {
          startTime: '日间型',
          endTime: '缓降续航时间段',
          soc: '高续航电量型',
          capacity: '高续航电量型',
          battery: '小电池型',
          dailyDistance: '90km / 天'
        },
        {
          startTime: '夜间型',
          endTime: '长降续航时间段',
          soc: '高续航电量型',
          capacity: '高续航电量型',
          battery: '大电池型',
          dailyDistance: '90km / 天'
        }
      ],
      columns: [
        {
          prop: 'startTime',
          label: '充电开始时间',
          explanation: {
            dimension: '充电开始时间',
            categories: ['日间型', '夜间型'],
            range: '日间型:6:00-18:00; 夜间型:18:00-6:00'
          }
        },
        {
          prop: 'endTime',
          label: '结束时间',
          explanation: {
            dimension: '结束时间',
            categories: ['缓降续航', '中等续航', '长降续航'],
            range: '缓降续航:<10:00; 中等续航:10:00-22:00; 长降续航:>22:00'
          }
        },
        {
          prop: 'soc',
          label: '充电SOC',
          explanation: {
            dimension: '充电SOC',
            categories: ['低续航电量', '中续航电量', '高续航电量'],
            range: '低:0%-25%; 中:25%-55%; 高:55%-100%'
          }
        },
        {
          prop: 'capacity',
          label: '充电容量',
          explanation: {
            dimension: '充电容量',
            categories: ['低续航电量', '中续航电量', '高续航电量'],
            range: '低:<6kWh; 中:6-15kWh; 高:>15kWh'
          }
        },
        {
          prop: 'battery',
          label: '电池容量',
          explanation: {
            dimension: '电池容量',
            categories: ['小电池型', '中电池型', '大电池型'],
            range: '小:≤40kWh; 中:40-50kWh; 大:>50kWh'
          }
        },
        {
          prop: 'dailyDistance',
          label: '每日行驶里程(km)',
          explanation: {
            dimension: '每日行驶里程',
            categories: ['缓降续航', '中等续航', '长降续航'],
            range: '缓降续航:<120min; 中等续航:120-200min; 长降续航:>200min'
          }
        }
      ]
    }
  },
  methods: {
    showExplanationDialog(column) {
      this.currentColumn = column
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
.table-container {
  padding: 20px;
}

.interaction-options {
  margin-bottom: 20px;
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.header-text {
  margin-right: 5px;
}

.header-icon {
  color: #409EFF;
  cursor: pointer;
  font-size: 14px;
}

.header-icon:hover {
  color: #66b1ff;
}

.explanation-content {
  padding: 10px;
}

.explanation-row {
  margin-bottom: 10px;
}

.explanation-row .label {
  font-weight: bold;
  margin-right: 10px;
}

.explanation-dialog-content {
  padding: 10px;
}
</style>

<style>
.explanation-tooltip {
  max-width: 350px;
}

.explanation-tooltip .el-tooltip__popper {
  padding: 12px;
}
</style>
