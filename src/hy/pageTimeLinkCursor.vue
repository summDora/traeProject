<template>
  <div class="page-time-link-cursor">
    <div class="card">
      <div class="section-title">预测时间联动选择</div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        inline
        label-width="120px"
        class="time-link-form"
      >
        <el-form-item label="预测周期维度" prop="dimension">
          <el-select
            v-model="form.dimension"
            placeholder="请选择周期维度"
            class="form-select"
            @change="handleDimensionChange"
          >
            <el-option
              v-for="item in dimensionOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 年度：仅年度多选 -->
        <el-form-item
          v-if="form.dimension === 'year'"
          label="预测时间选择"
          prop="selectedYears"
        >
          <el-select
            v-model="form.selectedYears"
            multiple
            :multiple-limit="5"
            collapse-tags
            placeholder="请选择年度（最多5项）"
            class="form-select form-select-wide"
            @change="clearFormErrors"
          >
            <el-option
              v-for="item in yearOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <!-- 月度：年度单选 + 月度多选 -->
        <el-form-item
          v-if="form.dimension === 'month'"
          label="预测时间选择"
          prop="monthTimeSelection"
          class="combined-time-item"
        >
          <div class="combined-selects">
            <el-select
              v-model="form.year"
              placeholder="请选择年度"
              class="form-select"
              @change="handleYearChange"
            >
              <el-option
                v-for="item in yearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="form.selectedMonths"
              multiple
              :multiple-limit="5"
              collapse-tags
              placeholder="请选择月度（最多5项）"
              class="form-select form-select-wide"
              :disabled="!form.year"
              @change="touchMonthValidation"
            >
              <el-option
                v-for="item in monthOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>

        <!-- 周度：年度单选 + 周度多选（支持模糊搜索） -->
        <el-form-item
          v-if="form.dimension === 'week'"
          label="预测时间选择"
          prop="weekTimeSelection"
          class="combined-time-item"
        >
          <div class="combined-selects">
            <el-select
              v-model="form.year"
              placeholder="请选择年度"
              class="form-select"
              @change="handleYearChange"
            >
              <el-option
                v-for="item in yearOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-select
              v-model="form.selectedWeeks"
              multiple
              filterable
              :multiple-limit="5"
              collapse-tags
              placeholder="请搜索并选择周度（最多5项）"
              class="form-select form-select-wide"
              :disabled="!form.year"
              @change="touchWeekValidation"
            >
              <el-option
                v-for="item in weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handlePredict">
            预测
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="resultText" class="result-panel">
        <div class="result-label">当前选择：</div>
        <div class="result-text">{{ resultText }}</div>
      </div>
    </div>
  </div>
</template>

<script>
const YEAR_LIST = [2026, 2027, 2028, 2029, 2030];

export default {
  name: "PageTimeLinkCursor",
  data() {
    return {
      form: {
        dimension: "",
        selectedYears: [],
        year: "",
        selectedMonths: [],
        selectedWeeks: [],
        monthTimeSelection: "",
        weekTimeSelection: "",
      },
      resultText: "",
      dimensionOptions: [
        { label: "周度", value: "week" },
        { label: "月度", value: "month" },
        { label: "年度", value: "year" },
      ],
      yearOptions: YEAR_LIST.map((y) => ({
        label: `${y}年`,
        value: y,
      })),
      monthOptions: Array.from({ length: 12 }, (_, i) => ({
        label: `${i + 1}月`,
        value: i + 1,
      })),
      rules: {
        dimension: [
          { required: true, message: "请选择预测周期维度" },
        ],
        selectedYears: [
          {
            validator: (rule, value, callback) => {
              if (this.form.dimension !== "year") {
                callback();
                return;
              }
              if (!value || value.length === 0) {
                callback(new Error("请至少选择一个年度"));
                return;
              }
              callback();
            },
          },
        ],
        monthTimeSelection: [
          {
            validator: (rule, value, callback) => {
              if (this.form.dimension !== "month") {
                callback();
                return;
              }
              if (!this.form.year) {
                callback(new Error("请选择年度"));
                return;
              }
              if (!this.form.selectedMonths.length) {
                callback(new Error("请至少选择一个月度"));
                return;
              }
              callback();
            },
          },
        ],
        weekTimeSelection: [
          {
            validator: (rule, value, callback) => {
              if (this.form.dimension !== "week") {
                callback();
                return;
              }
              if (!this.form.year) {
                callback(new Error("请选择年度"));
                return;
              }
              if (!this.form.selectedWeeks.length) {
                callback(new Error("请至少选择一个周度"));
                return;
              }
              callback();
            },
          },
        ],
      },
    };
  },
  computed: {
    weekOptions() {
      if (!this.form.year) return [];
      const weekCount = this.getWeeksInYear(this.form.year);
      return Array.from({ length: weekCount }, (_, i) => {
        const week = i + 1;
        return {
          label: `第${week}周`,
          value: week,
        };
      });
    },
  },
  methods: {
    getWeeksInYear(year) {
      const dec31 = new Date(year, 11, 31);
      const jan1 = new Date(year, 0, 1);
      const dayOfWeek = jan1.getDay() || 7;
      const daysInYear = Math.floor((dec31 - jan1) / 86400000) + 1;
      return Math.ceil((daysInYear + dayOfWeek - 1) / 7);
    },
    resetTimeFields() {
      this.form.selectedYears = [];
      this.form.year = "";
      this.form.selectedMonths = [];
      this.form.selectedWeeks = [];
      this.form.monthTimeSelection = "";
      this.form.weekTimeSelection = "";
      this.resultText = "";
    },
    clearFormErrors() {
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate();
        }
      });
    },
    syncCombinedFields() {
      this.form.monthTimeSelection = `${this.form.year}-${this.form.selectedMonths.join(",")}`;
      this.form.weekTimeSelection = `${this.form.year}-${this.form.selectedWeeks.join(",")}`;
    },
    handleDimensionChange() {
      this.resetTimeFields();
      this.clearFormErrors();
    },
    handleYearChange() {
      this.form.selectedMonths = [];
      this.form.selectedWeeks = [];
      this.syncCombinedFields();
      this.clearFormErrors();
    },
    touchMonthValidation() {
      this.form.monthTimeSelection = `${this.form.year}-${this.form.selectedMonths.join(",")}`;
      this.clearFormErrors();
    },
    touchWeekValidation() {
      this.form.weekTimeSelection = `${this.form.year}-${this.form.selectedWeeks.join(",")}`;
      this.clearFormErrors();
    },
    buildResultText() {
      const dimMap = { week: "周度", month: "月度", year: "年度" };
      const dimLabel = dimMap[this.form.dimension] || "";

      if (this.form.dimension === "year") {
        const years = this.form.selectedYears
          .slice()
          .sort((a, b) => a - b)
          .map((y) => `${y}年`)
          .join("、");
        return `【${dimLabel}】${years}`;
      }

      if (this.form.dimension === "month") {
        const months = this.form.selectedMonths
          .slice()
          .sort((a, b) => a - b)
          .map((m) => `${m}月`)
          .join("、");
        return `【${dimLabel}】${this.form.year}年 ${months}`;
      }

      if (this.form.dimension === "week") {
        const weeks = this.form.selectedWeeks
          .slice()
          .sort((a, b) => a - b)
          .map((w) => `第${w}周`)
          .join("、");
        return `【${dimLabel}】${this.form.year}年 ${weeks}`;
      }

      return "";
    },
    handlePredict() {
      this.syncCombinedFields();
      this.$refs.formRef.validate((valid) => {
        if (!valid) return;
        this.resultText = this.buildResultText();
        this.$message.success("预测成功");
      });
    },
  },
};
</script>

<style scoped>
.page-time-link-cursor {
  padding: 0;
}

.card {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.time-link-form >>> .el-form-item {
  margin-bottom: 18px;
  vertical-align: top;
}

.form-select {
  width: 180px;
}

.form-select-wide {
  width: 280px;
}

.combined-time-item >>> .el-form-item__content {
  line-height: normal;
}

.combined-selects {
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.result-panel {
  margin-top: 24px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 6px;
  border-left: 4px solid #667eea;
}

.result-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 6px;
}

.result-text {
  font-size: 14px;
  color: #303133;
  line-height: 1.6;
}
</style>
