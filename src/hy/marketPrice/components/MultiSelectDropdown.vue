<template>
  <div
    ref="wrap"
    :class="['multi-select-dropdown', { 'is-disabled': disabled, 'is-open': dropdownOpen }]"
  >
    <div class="select-trigger" @click="handleTriggerClick">
      <div class="tags-wrap">
        <span
          v-for="item in selectedOptions"
          :key="getOptionValue(item)"
          class="select-tag"
          :title="getOptionLabel(item)"
        >
          {{ formatLabel(getOptionLabel(item)) }}
          <i
            v-if="!disabled"
            class="el-icon-close"
            @click.stop="removeItem(getOptionValue(item))"
          ></i>
        </span>
        <span v-if="!selectedOptions.length" class="placeholder-text">
          {{ placeholderText }}
        </span>
      </div>
      <i
        :class="dropdownOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
        class="arrow-icon"
      ></i>
    </div>

    <div v-show="dropdownOpen" class="dropdown-panel">
      <div v-if="filterable" class="search-box">
        <input
          v-model="keyword"
          type="text"
          class="search-input"
          :placeholder="searchPlaceholder"
          :disabled="disabled"
          @click.stop
          @input="handleSearchInput"
        />
        <i
          v-if="keyword"
          class="el-icon-close search-clear"
          @click.stop="clearKeyword"
        ></i>
      </div>

      <div
        class="options-list"
        :style="{ maxHeight: dropdownMaxHeight + 'px' }"
        v-loading="loading"
      >
        <div
          v-for="item in displayOptions"
          :key="getOptionValue(item)"
          :class="['option-item', { 'is-option-disabled': isOptionDisabled(item) }]"
          @click.stop="toggleItem(item)"
        >
          <span
            :class="[
              'checkbox',
              {
                checked: isSelected(item),
                disabled: isCheckboxDisabled(item),
              },
            ]"
          >
            <i v-if="isSelected(item)" class="el-icon-check"></i>
          </span>
          <span class="option-label" :title="getOptionLabel(item)">
            {{ formatLabel(getOptionLabel(item)) }}
          </span>
        </div>
        <div v-if="!loading && !displayOptions.length" class="empty-options">
          {{ emptyText }}
        </div>
      </div>

      <div v-if="showFooter" class="dropdown-footer">
        <button
          type="button"
          class="btn-select-all"
          :disabled="disabled || loading"
          @click.stop="selectAll"
        >
          {{ selectAllText }}
        </button>
        <button
          type="button"
          class="btn-clear-all"
          :disabled="disabled || loading"
          @click.stop="clearAll"
        >
          {{ clearAllText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MultiSelectDropdown",
  props: {
    /** v-model 绑定值：选中项的 value 数组 */
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    /** 静态下拉选项 */
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    /** 远程加载选项，返回 Promise<Array> 或 Array */
    fetchOptions: {
      type: Function,
      default: null,
    },
    /** 远程搜索，keyword 变化时调用；不传则本地 filterMethod 过滤 */
    remoteSearch: {
      type: Function,
      default: null,
    },
    /** 最多可选数量，0 表示不限制 */
    max: {
      type: Number,
      default: 5,
    },
    /** 选项 value 字段名 */
    valueKey: {
      type: String,
      default: "id",
    },
    /** 选项 label 字段名 */
    labelKey: {
      type: String,
      default: "name",
    },
    /** 选项 disabled 字段名，或通过 disabledOption 函数判断 */
    disabledKey: {
      type: String,
      default: "disabled",
    },
    disabledOption: {
      type: Function,
      default: null,
    },
    /** 未选择时的占位文案 */
    placeholder: {
      type: String,
      default: "",
    },
    /** 搜索框占位文案 */
    searchPlaceholder: {
      type: String,
      default: "请输入文字搜索",
    },
    /** 是否可搜索 */
    filterable: {
      type: Boolean,
      default: true,
    },
    /** 本地过滤函数 (option, keyword) => boolean */
    filterMethod: {
      type: Function,
      default: null,
    },
    /** 标签展示最大字符数，0 表示不截断 */
    maxLabelLength: {
      type: Number,
      default: 20,
    },
    /** 是否禁用 */
    disabled: {
      type: Boolean,
      default: false,
    },
    /** 是否展示底部全选/取消 */
    showFooter: {
      type: Boolean,
      default: true,
    },
    selectAllText: {
      type: String,
      default: "全选",
    },
    clearAllText: {
      type: String,
      default: "全部取消",
    },
    emptyText: {
      type: String,
      default: "暂无匹配选项",
    },
    /** 下拉列表最大高度 */
    dropdownMaxHeight: {
      type: Number,
      default: 220,
    },
    /** 是否在挂载时自动加载 fetchOptions */
    autoLoad: {
      type: Boolean,
      default: true,
    },
    /** 超出上限时的提示文案，{max} 会被替换 */
    exceedLimitMessage: {
      type: String,
      default: "最多选择{max}项",
    },
  },
  data() {
    return {
      dropdownOpen: false,
      keyword: "",
      loading: false,
      innerOptions: [],
      remoteOptions: null,
      searchTimer: null,
    };
  },
  computed: {
    placeholderText() {
      if (this.placeholder) return this.placeholder;
      if (this.max > 0) return `请选择（最多${this.max}项）`;
      return "请选择";
    },
    allOptions() {
      if (this.remoteOptions !== null) return this.remoteOptions;
      if (this.innerOptions.length) return this.innerOptions;
      return this.options;
    },
    selectedValues() {
      return Array.isArray(this.value) ? this.value : [];
    },
    selectedOptions() {
      return this.allOptions.filter((item) =>
        this.selectedValues.includes(this.getOptionValue(item))
      );
    },
    displayOptions() {
      if (this.remoteSearch) return this.allOptions;
      const kw = this.keyword.trim();
      if (!kw) return this.allOptions;
      if (this.filterMethod) {
        return this.allOptions.filter((item) => this.filterMethod(item, kw));
      }
      const lower = kw.toLowerCase();
      return this.allOptions.filter((item) =>
        String(this.getOptionLabel(item))
          .toLowerCase()
          .includes(lower)
      );
    },
  },
  watch: {
    options: {
      deep: true,
      handler(val) {
        if (!this.fetchOptions) {
          this.innerOptions = val.slice();
        }
      },
    },
  },
  mounted() {
    document.addEventListener("click", this.handleDocumentClick);
    if (this.fetchOptions && this.autoLoad) {
      this.loadOptions();
    } else {
      this.innerOptions = this.options.slice();
    }
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleDocumentClick);
    if (this.searchTimer) clearTimeout(this.searchTimer);
  },
  methods: {
    getOptionValue(item) {
      return item[this.valueKey];
    },
    getOptionLabel(item) {
      return item[this.labelKey];
    },
    formatLabel(label) {
      if (!this.maxLabelLength || !label) return label;
      return label.length > this.maxLabelLength
        ? `${label.slice(0, this.maxLabelLength)}…`
        : label;
    },
    isOptionDisabled(item) {
      if (this.disabledOption) return this.disabledOption(item);
      return !!item[this.disabledKey];
    },
    isSelected(item) {
      return this.selectedValues.includes(this.getOptionValue(item));
    },
    isCheckboxDisabled(item) {
      if (this.isOptionDisabled(item)) return true;
      return (
        !this.isSelected(item) &&
        this.max > 0 &&
        this.selectedValues.length >= this.max
      );
    },
    emitChange(values) {
      const next = values.slice();
      this.$emit("input", next);
      const selected = this.allOptions.filter((item) =>
        next.includes(this.getOptionValue(item))
      );
      this.$emit("change", next, selected);
    },
    async loadOptions() {
      if (!this.fetchOptions) return;
      this.loading = true;
      try {
        const result = await this.fetchOptions();
        this.innerOptions = Array.isArray(result) ? result : [];
        this.remoteOptions = null;
        this.$emit("options-loaded", this.innerOptions);
      } catch (err) {
        this.innerOptions = [];
        this.$emit("load-error", err);
      } finally {
        this.loading = false;
      }
    },
    async doRemoteSearch(keyword) {
      if (!this.remoteSearch) return;
      this.loading = true;
      try {
        const result = await this.remoteSearch(keyword);
        this.remoteOptions = Array.isArray(result) ? result : [];
        this.$emit("search", keyword, this.remoteOptions);
      } catch (err) {
        this.remoteOptions = [];
        this.$emit("search-error", err);
      } finally {
        this.loading = false;
      }
    },
    handleSearchInput() {
      if (!this.remoteSearch) return;
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.doRemoteSearch(this.keyword.trim());
      }, 300);
    },
    clearKeyword() {
      this.keyword = "";
      if (this.remoteSearch) {
        this.doRemoteSearch("");
      }
    },
    handleDocumentClick(e) {
      const wrap = this.$refs.wrap;
      if (wrap && !wrap.contains(e.target)) {
        this.closeDropdown();
      }
    },
    handleTriggerClick() {
      if (this.disabled) return;
      const willOpen = !this.dropdownOpen;
      this.dropdownOpen = willOpen;
      if (willOpen) {
        this.$emit("open");
        if (this.fetchOptions && !this.autoLoad) {
          this.loadOptions();
        }
        if (this.remoteSearch) {
          this.doRemoteSearch(this.keyword.trim());
        }
      } else {
        this.$emit("close");
      }
    },
    closeDropdown() {
      if (!this.dropdownOpen) return;
      this.dropdownOpen = false;
      this.$emit("close");
    },
    showExceedWarning(extra) {
      const msg = this.exceedLimitMessage.replace("{max}", this.max) + (extra || "");
      this.$message.warning(msg);
      this.$emit("exceed-limit", this.max);
    },
    toggleItem(item) {
      if (this.disabled || this.isOptionDisabled(item)) return;
      const val = this.getOptionValue(item);
      if (this.isSelected(item)) {
        this.emitChange(this.selectedValues.filter((v) => v !== val));
        return;
      }
      if (this.max > 0 && this.selectedValues.length >= this.max) {
        this.showExceedWarning();
        return;
      }
      this.emitChange(this.selectedValues.concat(val));
    },
    removeItem(val) {
      if (this.disabled) return;
      this.emitChange(this.selectedValues.filter((v) => v !== val));
    },
    selectAll() {
      const merged = this.selectedValues.slice();
      this.displayOptions.forEach((item) => {
        if (this.isOptionDisabled(item)) return;
        const val = this.getOptionValue(item);
        if (merged.includes(val)) return;
        if (this.max > 0 && merged.length >= this.max) return;
        merged.push(val);
      });
      if (
        this.max > 0 &&
        this.displayOptions.length > this.max &&
        merged.length >= this.max
      ) {
        this.showExceedWarning("，已自动截取");
      }
      this.emitChange(merged);
      this.$emit("select-all", merged);
    },
    clearAll() {
      const filteredValues = this.displayOptions.map((item) =>
        this.getOptionValue(item)
      );
      const next = this.selectedValues.filter(
        (val) => !filteredValues.includes(val)
      );
      this.emitChange(next);
      this.$emit("clear-all", next);
    },
    /** 外部可调用：刷新选项 */
    refresh() {
      return this.loadOptions();
    },
  },
};
</script>

<style scoped>
.multi-select-dropdown {
  position: relative;
  width: 100%;
  min-width: 0;
}

.multi-select-dropdown.is-disabled .select-trigger {
  background: #f5f7fa;
  cursor: not-allowed;
}

.select-trigger {
  display: flex;
  align-items: center;
  min-height: 36px;
  padding: 4px 30px 4px 8px;
  border: 1px solid #409eff;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  position: relative;
}

.tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;
  min-width: 0;
}

.select-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background: #ecf5ff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  font-size: 13px;
  color: #409eff;
  line-height: 22px;
}

.select-tag .el-icon-close {
  font-size: 12px;
  cursor: pointer;
}

.select-tag .el-icon-close:hover {
  color: #f56c6c;
}

.placeholder-text {
  color: #c0c4cc;
  font-size: 13px;
  line-height: 28px;
  padding-left: 4px;
}

.arrow-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
  font-size: 14px;
}

.dropdown-panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 2000;
  background: #fff;
  border: 1px solid #409eff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.search-box {
  position: relative;
  padding: 8px 10px;
  border-bottom: 1px solid #ebeef5;
}

.search-input {
  width: 100%;
  height: 32px;
  padding: 0 28px 0 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 13px;
  outline: none;
  box-sizing: border-box;
}

.search-input:focus {
  border-color: #409eff;
}

.search-clear {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: #c0c4cc;
  cursor: pointer;
  font-size: 14px;
}

.options-list {
  overflow-y: auto;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
}

.option-item:hover {
  background: #f5f7fa;
}

.option-item.is-option-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checkbox {
  width: 16px;
  height: 16px;
  border: 1px solid #409eff;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-sizing: border-box;
}

.checkbox.checked {
  background: #409eff;
  color: #fff;
}

.checkbox.disabled {
  border-color: #dcdfe6;
  background: #f5f7fa;
  cursor: not-allowed;
}

.checkbox .el-icon-check {
  font-size: 12px;
  font-weight: bold;
}

.option-label {
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty-options {
  padding: 24px;
  text-align: center;
  color: #909399;
  font-size: 13px;
}

.dropdown-footer {
  display: flex;
  border-top: 1px solid #409eff;
}

.btn-select-all,
.btn-clear-all {
  flex: 1;
  height: 36px;
  border: none;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.btn-select-all:disabled,
.btn-clear-all:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-select-all {
  background: #409eff;
  color: #fff;
}

.btn-select-all:hover:not(:disabled) {
  background: #66b1ff;
}

.btn-clear-all {
  background: #fff;
  color: #409eff;
  border-left: 1px solid #409eff;
}

.btn-clear-all:hover:not(:disabled) {
  background: #ecf5ff;
}
</style>
