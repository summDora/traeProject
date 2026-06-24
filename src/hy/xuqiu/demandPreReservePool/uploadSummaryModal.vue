<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="上传盖章版需求汇总表"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="560px"
    @closeHandle="handleClose"
  >
    <div class="upload-body">
      <input
        ref="fileInput"
        type="file"
        accept=".doc,.docx,.pdf"
        style="display: none"
        @change="handleFileChange"
      />
      <el-button size="small" @click="triggerSelect">选择文件</el-button>

      <div v-if="fileList.length" class="file-list">
        <div v-for="(file, index) in fileList" :key="`${file.name}-${index}`" class="file-row">
          <span class="file-name">{{ file.name }}</span>
          <el-button type="text" class="danger-btn" @click="removeFile(index)">删除</el-button>
        </div>
      </div>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
const MAX_SIZE = 20 * 1024 * 1024;
const ALLOW_EXT = ['.doc', '.docx', '.pdf'];

export default {
  name: 'uploadSummaryModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      fileList: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.fileList = [];
        if (this.$refs.fileInput) {
          this.$refs.fileInput.value = '';
        }
      }
    }
  },

  methods: {
    triggerSelect() {
      this.$refs.fileInput.click();
    },

    validateFile(file) {
      const name = file.name.toLowerCase();
      const validExt = ALLOW_EXT.some((ext) => name.endsWith(ext));
      if (!validExt || file.size > MAX_SIZE) {
        return false;
      }
      return true;
    },

    handleFileChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      if (!this.validateFile(file)) {
        this.$message.warning('上传失败，请检查文件格式或大小！');
        event.target.value = '';
        return;
      }
      this.fileList = [file];
    },

    removeFile(index) {
      this.fileList.splice(index, 1);
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    handleConfirm() {
      if (!this.fileList.length) {
        this.$message.warning('请先选择文件');
        return;
      }
      const file = this.fileList[0];
      if (!this.validateFile(file)) {
        this.$message.warning('上传失败，请检查文件格式或大小！');
        return;
      }
      this.$emit('uploaded', file.name);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.upload-body {
  padding: 8px 12px;
  min-height: 120px;
}
.file-list {
  margin-top: 16px;
}
.file-row {
  display: flex;
  align-items: center;
  line-height: 32px;
}
.file-name {
  flex: 1;
  color: #606266;
}
.danger-btn {
  color: #f56c6c !important;
}
</style>
