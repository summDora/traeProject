<template>
  <el-dialog
    title="选择对比场景"
    :visible="visible"
    width="560px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleDialogClose"
  >
    <div class="form-row">
      <label class="form-label">场景名称</label>
      <multi-select-dropdown
        v-model="selectedIds"
        :options="scenarios"
        :fetch-options="fetchOptions"
        :max="maxSelect"
        value-key="id"
        label-key="name"
        placeholder="请选择场景（最多5项）"
        empty-text="暂无匹配场景"
        @change="handleSelectionChange"
      />
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="handleCompare">对比</el-button>
    </div>
  </el-dialog>
</template>

<script>
import MultiSelectDropdown from "./MultiSelectDropdown.vue";
import {
  MAX_SCENARIO_SELECT,
  MOCK_SCENARIOS,
} from "../utils/scenarioCompare";

export default {
  name: "ScenarioSelectDialog",
  components: {
    MultiSelectDropdown,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /** 静态场景列表 */
    scenarios: {
      type: Array,
      default() {
        return MOCK_SCENARIOS;
      },
    },
    /** 远程加载场景 API，返回 Promise<Array> */
    fetchOptions: {
      type: Function,
      default: null,
    },
    /** 最多可选数量 */
    maxSelect: {
      type: Number,
      default: MAX_SCENARIO_SELECT,
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      selectedIds: [],
      selectedOptions: [],
    };
  },
  watch: {
    visible(val) {
      if (val) {
        this.selectedIds = this.value.slice();
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:visible", false);
    },
    handleDialogClose() {
      if (this.visible) {
        this.closeDialog();
      }
    },
    handleSelectionChange(values, options) {
      this.selectedOptions = options;
    },
    handleCancel() {
      this.closeDialog();
    },
    handleCompare() {
      if (!this.selectedIds.length) {
        this.$message.warning("请至少选择一个场景");
        return;
      }
      const selected =
        this.selectedOptions.length > 0
          ? this.selectedOptions
          : this.scenarios.filter((item) =>
              this.selectedIds.includes(item.id)
            );
      this.$emit("compare", selected);
      this.closeDialog();
    },
  },
};
</script>

<style scoped>
.form-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.form-label {
  flex-shrink: 0;
  width: 72px;
  line-height: 36px;
  font-size: 14px;
  color: #606266;
  text-align: right;
}

.form-row >>> .multi-select-dropdown {
  flex: 1;
}

.dialog-footer {
  text-align: right;
}
</style>
