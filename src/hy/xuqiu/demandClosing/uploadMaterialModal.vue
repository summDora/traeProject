<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    :title="modalTitle"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="920px"
    @closeHandle="handleClose"
  >
    <div class="modal-body">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane
          v-for="tab in materialTabs"
          :key="tab.key"
          :label="tab.label"
          :name="tab.key"
        />
      </el-tabs>

      <div class="tab-content">
        <div v-if="!readonly" class="upload-row">
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

        <div class="desc-block">
          <div class="desc-label">说明：</div>
          <div class="desc-text">{{ currentInstruction }}</div>
        </div>

        <div class="table-block">
          <newTable
            :tableData="fileTableData"
            :column="fileColumn"
            :ifHaveIndex="false"
            :ifHaveCheckBox="false"
            height="160"
          >
            <template slot="fileName" slot-scope="{ data }">
              <el-button type="text" class="file-link" @click="downloadFile(data)">
                {{ data.fileName }}
              </el-button>
            </template>
            <template slot="fileOperation" slot-scope="{ data }">
              <el-button v-if="!readonly" type="text" @click="removeFile(data)">删除</el-button>
              <span v-else>—</span>
            </template>
          </newTable>
        </div>
      </div>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">{{ readonly ? '关闭' : '取消' }}</el-button>
      <el-button v-if="!readonly" type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import {
  closingMaterialTabs,
  stampedCoverFileColumn
} from './config.js';
import {
  getClosingMaterialData,
  saveClosingMaterialFile,
  removeClosingMaterialFile,
  buildClosingMaterialFileName
} from './mockData.js';

export default {
  name: 'uploadMaterialModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    demandIds: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'upload'
    }
  },

  data() {
    return {
      materialTabs: closingMaterialTabs,
      fileColumn: stampedCoverFileColumn,
      activeTab: 'requirementReport',
      fileList: []
    };
  },

  computed: {
    readonly() {
      return this.mode === 'view';
    },
    modalTitle() {
      return this.readonly ? '查看收口材料' : '上传收口材料';
    },
    primaryDemandId() {
      return this.demandIds.length ? this.demandIds[0] : '';
    },
    currentTabConfig() {
      return this.materialTabs.find((item) => item.key === this.activeTab) || this.materialTabs[0];
    },
    currentInstruction() {
      return this.currentTabConfig.instruction || '';
    },
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
    demandIds() {
      if (this.visible) {
        this.initPage();
      }
    }
  },

  methods: {
    initPage() {
      this.activeTab = 'requirementReport';
      this.loadTabFiles();
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    loadTabFiles() {
      if (!this.primaryDemandId) {
        this.fileList = [];
        return;
      }
      const data = getClosingMaterialData(this.primaryDemandId, this.activeTab);
      this.fileList = data.fileList.slice();
    },

    handleTabChange() {
      this.loadTabFiles();
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    triggerUpload() {
      if (!this.primaryDemandId) {
        this.$message.warning('未找到需求信息');
        return;
      }
      this.$refs.fileInput.click();
    },

    handleFileChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file || !this.primaryDemandId) return;
      const data = getClosingMaterialData(this.primaryDemandId, this.activeTab);
      const detail = {
        demandCode: data.demandCode,
        demandName: data.demandName
      };
      const fileName = buildClosingMaterialFileName(detail, this.activeTab);
      const saved = saveClosingMaterialFile(this.primaryDemandId, this.activeTab, {
        fileName,
        lastUpdater: '当前用户'
      });
      this.fileList = saved ? [saved] : [];
      this.$message.success('附件上传成功（模拟）');
      event.target.value = '';
    },

    downloadFile(row) {
      this.$message.info(`下载文件：${row.fileName}（模拟）`);
    },

    removeFile() {
      if (!this.primaryDemandId) return;
      removeClosingMaterialFile(this.primaryDemandId, this.activeTab);
      this.fileList = [];
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },

    handleConfirm() {
      this.$emit('uploaded', this.demandIds);
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
.tab-content {
  padding-top: 4px;
}
.upload-row {
  margin-bottom: 12px;
}
.desc-block {
  margin-bottom: 12px;
}
.desc-label {
  color: #298bf5;
  font-weight: bold;
  margin-bottom: 6px;
}
.desc-text {
  color: #606266;
  line-height: 22px;
}
.table-block {
  margin-bottom: 8px;
}
.file-link {
  padding: 0;
  text-align: left;
  white-space: normal;
  line-height: 20px;
}
</style>

<style lang="less">
.modal-body {
  .el-tabs__item.is-active {
    color: #298bf5;
  }
  .el-tabs__active-bar {
    background-color: #298bf5;
  }
  .el-tabs__item:hover {
    color: #298bf5;
  }
}
</style>
