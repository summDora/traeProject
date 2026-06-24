<template>
  <div class="time-link-container">
    <div class="header">
      <h2>时间联动选择</h2>
    </div>

    <div class="form-container">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="140px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="预测周期维度" prop="periodType">
              <el-select
                v-model="form.periodType"
                placeholder="请选择周期"
                @change="handlePeriodChange"
              >
                <el-option label="周度" value="week" />
                <el-option label="月度" value="month" />
                <el-option label="年度" value="year" />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="预测时间选择" prop="selectedYears">
              <el-select
                v-model="form.selectedYears"
                :multiple="form.periodType === 'year'"
                :placeholder="
                  form.periodType === 'year'
                    ? '请选择年度（可多选）'
                    : '请选择年度'
                "
                @change="handleYearChange"
              >
                <el-option
                  v-for="year in years"
                  :key="year"
                  :label="`${year}年`"
                  :value="year"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" v-if="form.periodType === 'month'">
            <el-form-item label="选择月份" prop="selectedMonths">
              <el-select
                v-model="form.selectedMonths"
                multiple
                placeholder="请选择月份（可多选，最多5项）"
                @change="handleMonthChange"
              >
                <el-option
                  v-for="month in months"
                  :key="month"
                  :label="`${month}月`"
                  :value="month"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" v-if="form.periodType === 'week'">
            <el-form-item label="选择周度" prop="selectedWeeks">
              <el-select
                v-model="form.selectedWeeks"
                multiple
                filterable
                placeholder="请选择周度（可多选，最多5项，支持搜索）"
                @change="handleWeekChange"
              >
                <el-option
                  v-for="week in weeks"
                  :key="week"
                  :label="`第${week}周`"
                  :value="week"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div v-if="showResult" class="result-container">
      <h3>选择结果：</h3>
      <el-card>
        <div class="result-item">
          <span class="label">预测周期维度：</span>
          <span class="value">{{ periodTypeLabel }}</span>
        </div>
        <div class="result-item">
          <span class="label">选择的年度：</span>
          <span class="value">{{ selectedYearsLabel }}</span>
        </div>
        <div v-if="form.periodType === 'month'" class="result-item">
          <span class="label">选择的月份：</span>
          <span class="value">{{ selectedMonthsLabel }}</span>
        </div>
        <div v-if="form.periodType === 'week'" class="result-item">
          <span class="label">选择的周度：</span>
          <span class="value">{{ selectedWeeksLabel }}</span>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageTimeLink",
  data() {
    return {
      form: {
        periodType: "",
        selectedYears: [],
        selectedMonths: [],
        selectedWeeks: [],
      },
      years: [2026, 2027, 2028, 2029, 2030],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      weeks: [],
      rules: {
        periodType: [
          { required: true, message: "请选择预测周期维度", trigger: "change" },
        ],
      },
      showResult: false,
    };
  },
  computed: {
    periodTypeLabel() {
      const map = { week: "周度", month: "月度", year: "年度" };
      return map[this.form.periodType] || "";
    },
    selectedYearsLabel() {
      if (!this.form.selectedYears.length) return "未选择";
      if (Array.isArray(this.form.selectedYears)) {
        return this.form.selectedYears.map((y) => `${y}年`).join("、");
      }
      return `${this.form.selectedYears}年`;
    },
    selectedMonthsLabel() {
      if (!this.form.selectedMonths.length) return "未选择";
      return this.form.selectedMonths.map((m) => `${m}月`).join("、");
    },
    selectedWeeksLabel() {
      if (!this.form.selectedWeeks.length) return "未选择";
      return this.form.selectedWeeks.map((w) => `第${w}周`).join("、");
    },
  },
  mounted() {
    this.initWeeks();
  },
  methods: {
    initWeeks() {
      this.weeks = [];
      for (let i = 1; i <= 52; i++) {
        this.weeks.push(i);
      }
    },
    handlePeriodChange() {
      this.form.selectedYears = [];
      this.form.selectedMonths = [];
      this.form.selectedWeeks = [];
      this.showResult = false;
    },
    handleYearChange(val) {
      if (this.form.periodType === "year") {
        if (Array.isArray(val) && val.length > 5) {
          this.$message.warning("最多选择5项");
          this.form.selectedYears = val.slice(0, 5);
        }
      }
      this.showResult = false;
    },
    handleMonthChange(val) {
      if (Array.isArray(val) && val.length > 5) {
        this.$message.warning("最多选择5项");
        this.form.selectedMonths = val.slice(0, 5);
      }
      this.showResult = false;
    },
    handleWeekChange(val) {
      if (Array.isArray(val) && val.length > 5) {
        this.$message.warning("最多选择5项");
        this.form.selectedWeeks = val.slice(0, 5);
      }
      this.showResult = false;
    },
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.showResult = true;
          this.$message.success("提交成功");
        }
      });
    },
    handleReset() {
      this.$refs.formRef.resetFields();
      this.form.selectedYears = [];
      this.form.selectedMonths = [];
      this.form.selectedWeeks = [];
      this.showResult = false;
    },
  },
};
</script>

<style scoped>
.time-link-container {
  padding: 20px;
  min-height: calc(100vh - 96px);
  background: #f5f7fa;
}

.header {
  margin-bottom: 20px;
}

.header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.form-container {
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.result-container {
  margin-top: 20px;
}

.result-container h3 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
}

.result-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item .label {
  color: #666;
  margin-right: 10px;
}

.result-item .value {
  color: #333;
  font-weight: 500;
}
</style>
