<template>
  <div class="time-link-form-wrap">
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
  </div>
</template>

<script>
const YEAR_LIST = [2026, 2027, 2028, 2029, 2030];

export default {
  name: "TimeLinkForm",
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
      return Array.from({ length: weekCount }, (_, i) => ({
        label: `第${i + 1}周`,
        value: i + 1,
      }));
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
      this.$emit("change");
    },
    handleYearChange() {
      this.form.selectedMonths = [];
      this.form.selectedWeeks = [];
      this.syncCombinedFields();
      this.clearFormErrors();
      this.$emit("change");
    },
    touchMonthValidation() {
      this.form.monthTimeSelection = `${this.form.year}-${this.form.selectedMonths.join(",")}`;
      this.clearFormErrors();
      this.$emit("change");
    },
    touchWeekValidation() {
      this.form.weekTimeSelection = `${this.form.year}-${this.form.selectedWeeks.join(",")}`;
      this.clearFormErrors();
      this.$emit("change");
    },
    getSelectionItems() {
      const { dimension, selectedYears, year, selectedMonths, selectedWeeks } =
        this.form;
      if (dimension === "year") {
        return selectedYears
          .slice()
          .sort((a, b) => a - b)
          .map((y) => ({ label: `${y}年`, key: String(y) }));
      }
      if (dimension === "month") {
        return selectedMonths
          .slice()
          .sort((a, b) => a - b)
          .map((m) => ({
            label: `${year}年${m}月`,
            key: `${year}-${m}`,
          }));
      }
      if (dimension === "week") {
        return selectedWeeks
          .slice()
          .sort((a, b) => a - b)
          .map((w) => ({
            label: `${year}年第${w}周`,
            key: `${year}-w${w}`,
          }));
      }
      return [];
    },
    handlePredict() {
      this.syncCombinedFields();
      this.$refs.formRef.validate((valid) => {
        if (!valid) return;
        this.$emit("predict", {
          dimension: this.form.dimension,
          items: this.getSelectionItems(),
        });
      });
    },
  },
};
</script>

<style scoped>
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
</style>
