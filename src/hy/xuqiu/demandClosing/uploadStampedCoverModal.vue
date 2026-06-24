<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="上传盖章封面"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="920px"
    @closeHandle="handleClose"
  >
    <div class="modal-body">
      <div class="desc-block">
        <div class="desc-label">说明：</div>
        <div class="desc-text">{{ instruction }}</div>
        <div class="upload-row">
          <input
            ref="fileInput"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            style="display: none"
            @change="handleFileChange"
          />
          <el-button size="small" icon="el-icon-paperclip" @click="triggerUpload">
            点击上传附件
          </el-button>
        </div>
      </div>

      <div class="table-block">
        <newTable
          :tableData="fileTableData"
          :column="fileColumn"
          :ifHaveIndex="false"
          :ifHaveCheckBox="false"
          height="120"
        >
          <template slot="fileName" slot-scope="{ data }">
            <el-button type="text" class="file-link" @click="downloadFile(data)">
              {{ data.fileName }}
            </el-button>
          </template>
          <template slot="fileOperation" slot-scope="{ data }">
            <el-button type="text" @click="removeFile(data)">删除</el-button>
          </template>
        </newTable>
      </div>

      <div class="seal-block">
        <el-button type="primary" size="small" @click="recognizeSeal">点击识别印章</el-button>
        <div v-if="sealRecognized" class="seal-result-wrap">
          <div class="block-title">印章识别结果</div>
          <div
            v-for="item in sealResults"
            :key="item.id"
            class="seal-result-row"
          >
            <div class="seal-field">
              <span class="field-label">印章识别结果图片：</span>
              <div class="seal-image-placeholder">
                <div class="seal-circle">
                  <span class="seal-text">印章</span>
                </div>
              </div>
            </div>
            <div class="seal-field seal-content-field">
              <span class="field-label">印章内容：</span>
              <span class="field-value">{{ item.content }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="sealRecognized && unitCompareResults.length" class="compare-block">
        <div class="compare-title">单位名称比对结果</div>
        <div class="compare-grid">
          <div
            v-for="item in unitCompareResults"
            :key="item.key"
            class="compare-item"
          >
            <div class="compare-unit">{{ item.label }}：{{ item.unitName }}</div>
            <span class="compare-badge" :class="statusMap[item.status].className">
              {{ statusMap[item.status].text }}
            </span>
          </div>
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
import {
  stampedCoverInstruction,
  stampedCoverFileColumn,
  unitCompareStatusMap
} from './config.js';
import {
  getStampedCoverData,
  saveStampedCoverFile,
  removeStampedCoverFile,
  runSealRecognition
} from './mockData.js';

export default {
  name: 'uploadStampedCoverModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    demandId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      instruction: stampedCoverInstruction,
      fileColumn: stampedCoverFileColumn,
      statusMap: unitCompareStatusMap,
      fileList: [],
      sealRecognized: false,
      sealResults: [],
      unitCompareResults: []
    };
  },

  computed: {
    fileTableData() {
      return this.fileList.map((item, index) => ({
        ...item,
        index: index + 1
      }));
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.initPage();
      }
    },
    demandId() {
      if (this.visible) {
        this.initPage();
      }
    }
  },

  methods: {
    initPage() {
      const data = getStampedCoverData(this.demandId);
      this.fileList = data.fileList.slice();
      this.sealRecognized = data.sealRecognized;
      this.sealResults = data.sealResults.slice();
      this.unitCompareResults = data.unitCompareResults.slice();
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    triggerUpload() {
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const data = getStampedCoverData(this.demandId);
      const fileName = `任务需求说明书封面盖章-${data.demandName}`;
      const saved = saveStampedCoverFile(this.demandId, {
        fileName,
        lastUpdater: '当前用户'
      });
      this.fileList = [saved];
      this.sealRecognized = false;
      this.sealResults = [];
      this.unitCompareResults = [];
      this.$message.success('附件上传成功（模拟）');
      event.target.value = '';
    },

    downloadFile(row) {
      this.$message.info(`下载文件：${row.fileName}（模拟）`);
    },

    removeFile() {
      removeStampedCoverFile(this.demandId);
      this.fileList = [];
      this.sealRecognized = false;
      this.sealResults = [];
      this.unitCompareResults = [];
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    recognizeSeal() {
      if (!this.fileList.length) {
        this.$message.warning('请先上传盖章封面文件');
        return;
      }
      const result = runSealRecognition(this.demandId);
      if (!result) {
        this.$message.warning('暂无可识别文件');
        return;
      }
      this.sealRecognized = true;
      this.sealResults = result.sealResults;
      this.unitCompareResults = result.unitCompareResults;
      this.$message.success('印章识别完成（模拟）');
    },

    handleConfirm() {
      if (!this.fileList.length) {
        this.$message.warning('请先上传盖章封面文件');
        return;
      }
      this.$emit('confirmed', this.demandId);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-body {
  padding: 0 4px 8px;
}
.desc-block {
  padding: 8px 0 12px;
}
.desc-label {
  color: #298bf5;
  font-weight: bold;
  margin-bottom: 6px;
}
.desc-text {
  color: #606266;
  line-height: 22px;
  margin-bottom: 12px;
}
.upload-row {
  margin-top: 4px;
}
.table-block {
  margin-bottom: 16px;
}
.file-link {
  padding: 0;
  text-align: left;
  white-space: normal;
  line-height: 20px;
}
.seal-block {
  margin-bottom: 16px;
}
.seal-result-wrap {
  margin-top: 12px;
}
.block-title,
.compare-title {
  color: #298bf5;
  font-weight: bold;
  margin-bottom: 10px;
}
.compare-title {
  color: #e6a23c;
}
.seal-result-row {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
}
.seal-field {
  display: flex;
  align-items: flex-start;
}
.seal-content-field {
  flex: 1;
  margin-left: 24px;
}
.field-label {
  color: #606266;
  flex-shrink: 0;
  line-height: 32px;
}
.field-value {
  color: #303133;
  line-height: 32px;
}
.seal-image-placeholder {
  width: 120px;
  height: 80px;
  border: 1px solid #ebeef5;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}
.seal-circle {
  width: 72px;
  height: 72px;
  border: 2px solid #f56c6c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f56c6c;
  font-size: 12px;
  transform: rotate(-12deg);
}
.seal-text {
  font-weight: bold;
}
.compare-grid {
  display: flex;
  gap: 24px;
}
.compare-item {
  flex: 1;
  text-align: center;
}
.compare-unit {
  color: #303133;
  margin-bottom: 8px;
  line-height: 22px;
}
.compare-badge {
  display: inline-block;
  min-width: 88px;
  padding: 4px 12px;
  border-radius: 4px;
  color: #fff;
  font-size: 12px;
  line-height: 20px;
}
.badge-success {
  background: #67c23a;
}
.badge-danger {
  background: #f56c6c;
}
.badge-warning {
  background: #e6a23c;
}
</style>
