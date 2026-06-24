<template>
  <el-dialog
    title="基础数据"
    :visible="visible"
    width="720px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <!-- 预测年度典型日数据：可多份导入 -->
    <div class="data-section">
      <div class="section-header">
        <div class="section-title">预测年度典型日数据</div>
        <el-button size="small" type="primary" plain @click="triggerAnnualImport">
          导入
        </el-button>
        <input
          ref="annualInput"
          type="file"
          accept=".xlsx,.xls"
          multiple
          class="hidden-input"
          @change="handleAnnualImport"
        />
      </div>
      <div v-if="form.annualFiles.length" class="file-list">
        <div
          v-for="file in form.annualFiles"
          :key="file.id"
          class="file-card"
        >
          <span class="delete-tag" @click="removeAnnualFile(file.id)">
            <i class="el-icon-close"></i>
          </span>
          <i class="el-icon-document file-icon"></i>
          <span class="file-name" :title="file.name">{{ file.name }}</span>
        </div>
      </div>
      <div v-else class="empty-tip">暂未导入数据</div>
    </div>

    <!-- 折算系数数据：单份导入 -->
    <div class="data-section">
      <div class="section-header">
        <div class="section-title">折算系数数据</div>
        <el-button
          size="small"
          type="primary"
          plain
          @click="triggerConversionImport"
        >
          导入
        </el-button>
        <input
          ref="conversionInput"
          type="file"
          accept=".xlsx,.xls"
          class="hidden-input"
          @change="handleConversionImport"
        />
      </div>
      <div v-if="form.conversionFile" class="file-list">
        <div class="file-card">
          <span class="delete-tag" @click="removeConversionFile">
            <i class="el-icon-close"></i>
          </span>
          <i class="el-icon-document file-icon"></i>
          <span class="file-name" :title="form.conversionFile.name">
            {{ form.conversionFile.name }}
          </span>
        </div>
      </div>
      <div v-else class="empty-tip">暂未导入数据</div>
    </div>

    <!-- 对应月份数据：单份导入 -->
    <div class="data-section">
      <div class="section-header">
        <div class="section-title">对应月份数据</div>
        <el-button size="small" type="primary" plain @click="triggerMonthImport">
          导入
        </el-button>
        <input
          ref="monthInput"
          type="file"
          accept=".xlsx,.xls"
          class="hidden-input"
          @change="handleMonthImport"
        />
      </div>
      <div v-if="form.monthMappingFile" class="file-list">
        <div class="file-card">
          <span class="delete-tag" @click="removeMonthFile">
            <i class="el-icon-close"></i>
          </span>
          <i class="el-icon-document file-icon"></i>
          <span class="file-name" :title="form.monthMappingFile.name">
            {{ form.monthMappingFile.name }}
          </span>
        </div>
      </div>
      <div v-else class="empty-tip">暂未导入数据</div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleBack">返回</el-button>
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
const ANNUAL_NAME_REG = /^(\d{4})年度\.(xlsx|xls)$/i;
const CONVERSION_NAME = "折算系数.xlsx";
const MONTH_MAPPING_NAME = "对应月份数据.xlsx";

let fileIdSeed = 1;

function createFileItem(file) {
  return {
    id: `file-${fileIdSeed++}`,
    name: file.name,
    size: file.size,
    file,
  };
}

function cloneBaseData(data) {
  return {
    annualFiles: (data.annualFiles || []).map((item) => ({ ...item })),
    conversionFile: data.conversionFile ? { ...data.conversionFile } : null,
    monthMappingFile: data.monthMappingFile
      ? { ...data.monthMappingFile }
      : null,
  };
}

export default {
  name: "BaseDataDialog",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    baseData: {
      type: Object,
      default() {
        return {
          annualFiles: [],
          conversionFile: null,
          monthMappingFile: null,
        };
      },
    },
  },
  data() {
    return {
      form: {
        annualFiles: [],
        conversionFile: null,
        monthMappingFile: null,
      },
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.form = cloneBaseData(this.baseData);
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    handleDialogClose() {
      this.form = cloneBaseData(this.baseData);
      if (this.visible) {
        this.closeDialog();
      }
    },
    resetInput(refName) {
      const input = this.$refs[refName];
      if (input) input.value = "";
    },
    triggerAnnualImport() {
      this.$refs.annualInput.click();
    },
    triggerConversionImport() {
      this.$refs.conversionInput.click();
    },
    triggerMonthImport() {
      this.$refs.monthInput.click();
    },
    parseAnnualYear(fileName) {
      const match = fileName.match(ANNUAL_NAME_REG);
      return match ? Number(match[1]) : null;
    },
    handleAnnualImport(event) {
      const files = Array.from(event.target.files || []);
      this.resetInput("annualInput");
      if (!files.length) return;

      files.forEach((file) => {
        const year = this.parseAnnualYear(file.name);
        if (!year) {
          this.$message.error(
            `文件「${file.name}」命名不符合规范，应为「YYYY年度.xlsx」`
          );
          return;
        }
        const exists = this.form.annualFiles.some((item) => item.year === year);
        if (exists) {
          this.$message.warning(`${year}年度数据已存在，请勿重复导入`);
          return;
        }
        this.form.annualFiles.push({
          ...createFileItem(file),
          year,
        });
      });

      this.form.annualFiles.sort((a, b) => a.year - b.year);
    },
    handleConversionImport(event) {
      const file = (event.target.files || [])[0];
      this.resetInput("conversionInput");
      if (!file) return;

      if (file.name !== CONVERSION_NAME) {
        this.$message.error(`文件命名不符合规范，应为「${CONVERSION_NAME}」`);
        return;
      }

      this.form.conversionFile = createFileItem(file);
    },
    handleMonthImport(event) {
      const file = (event.target.files || [])[0];
      this.resetInput("monthInput");
      if (!file) return;

      if (file.name !== MONTH_MAPPING_NAME) {
        this.$message.error(`文件命名不符合规范，应为「${MONTH_MAPPING_NAME}」`);
        return;
      }

      this.form.monthMappingFile = createFileItem(file);
    },
    removeAnnualFile(id) {
      this.form.annualFiles = this.form.annualFiles.filter(
        (item) => item.id !== id
      );
    },
    removeConversionFile() {
      this.form.conversionFile = null;
    },
    removeMonthFile() {
      this.form.monthMappingFile = null;
    },
    handleBack() {
      this.form = cloneBaseData(this.baseData);
      this.closeDialog();
    },
    handleSave() {
      this.$emit("save", cloneBaseData(this.form));
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.data-section {
  margin-bottom: 24px;
}

.data-section:last-of-type {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.hidden-input {
  display: none;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.file-card {
  position: relative;
  width: 140px;
  padding: 20px 12px 14px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  background: #fafafa;
  text-align: center;
  box-sizing: border-box;
}

.delete-tag {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  text-align: center;
  border-radius: 50%;
  background: #f56c6c;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}

.delete-tag:hover {
  background: #f78989;
}

.file-icon {
  font-size: 32px;
  color: #67c23a;
  margin-bottom: 8px;
}

.file-name {
  display: block;
  font-size: 12px;
  color: #606266;
  word-break: break-all;
  line-height: 1.4;
}

.empty-tip {
  font-size: 13px;
  color: #909399;
  padding: 12px 0;
}

.dialog-footer {
  text-align: right;
}
</style>
