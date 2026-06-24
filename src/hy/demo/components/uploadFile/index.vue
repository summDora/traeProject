<template>
  <div class="upload-file-stub">
    <el-upload
      action="#"
      :auto-upload="false"
      :file-list="fileList"
      :on-change="handleChange"
    >
      <el-button size="small" type="primary">选择文件（模拟）</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'uploadFile',
  props: {
    fileName: { type: String, default: '' },
    fileList: { type: Array, default: () => [] }
  },
  methods: {
    handleChange(file, fileList) {
      this.$emit('beforeUpload', file);
      this.$emit('uploadFile', file, fileList);
    }
  }
};
</script>
