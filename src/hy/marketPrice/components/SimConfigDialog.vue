<template>
  <el-dialog
    title="仿真方案参数配置"
    :visible.sync="dialogVisible"
    width="560px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="130px"
      class="sim-config-form"
    >
      <el-form-item label="预测算法" prop="algorithm">
        <el-select
          v-model="form.algorithm"
          placeholder="请选择预测算法"
          class="form-select-full"
          @change="clearFormErrors"
        >
          <el-option
            v-for="item in algorithmOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="预测时间段" prop="predictYears">
        <el-select
          v-model="form.predictYears"
          multiple
          :multiple-limit="5"
          collapse-tags
          placeholder="请选择预测时间段（最多5项）"
          class="form-select-full"
          @change="clearFormErrors"
        >
          <el-option
            v-for="item in predictYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="历史数据时间段" prop="historyYears">
        <el-select
          v-model="form.historyYears"
          multiple
          :multiple-limit="5"
          collapse-tags
          placeholder="请选择历史数据时间段（最多5项）"
          class="form-select-full"
          @change="clearFormErrors"
        >
          <el-option
            v-for="item in historyYearOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
const PREDICT_YEARS = [2026, 2027, 2028, 2029, 2030];
const HISTORY_YEARS = [2025];

export default {
  name: "SimConfigDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      default: () => ({
        algorithm: "",
        predictYears: [],
        historyYears: [],
      }),
    },
  },
  data() {
    return {
      form: {
        algorithm: "",
        predictYears: [],
        historyYears: [],
      },
      algorithmOptions: [{ label: "折算系数法", value: "conversion" }],
      predictYearOptions: PREDICT_YEARS.map((y) => ({
        label: `${y}年`,
        value: y,
      })),
      historyYearOptions: HISTORY_YEARS.map((y) => ({
        label: `${y}年`,
        value: y,
      })),
      rules: {
        algorithm: [
          { required: true, message: "请选择预测算法" },
        ],
        predictYears: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error("请至少选择一个预测时间段"));
                return;
              }
              callback();
            },
          },
        ],
        historyYears: [
          {
            validator: (rule, value, callback) => {
              if (!value || value.length === 0) {
                callback(new Error("请至少选择一个历史数据时间段"));
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
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      },
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = {
          algorithm: this.config.algorithm || "",
          predictYears: (this.config.predictYears || []).slice(),
          historyYears: (this.config.historyYears || []).slice(),
        };
        this.clearFormErrors();
      }
    },
  },
  methods: {
    clearFormErrors() {
      this.$nextTick(() => {
        if (this.$refs.formRef) {
          this.$refs.formRef.clearValidate();
        }
      });
    },
    handleClose() {
      this.clearFormErrors();
    },
    handleCancel() {
      this.dialogVisible = false;
    },
    handleSave() {
      this.$refs.formRef.validate((valid) => {
        if (!valid) return;
        this.$emit("save", {
          algorithm: this.form.algorithm,
          predictYears: this.form.predictYears.slice().sort((a, b) => a - b),
          historyYears: this.form.historyYears.slice().sort((a, b) => a - b),
        });
        this.dialogVisible = false;
      });
    },
  },
};
</script>

<style scoped>
.form-select-full {
  width: 100%;
}

.sim-config-form >>> .el-form-item {
  margin-bottom: 22px;
}

.dialog-footer {
  text-align: right;
}
</style>
