<template>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    title="查看材料"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="720px"
    :append-to-body="true"
    :modal-append-to-body="true"
    @closeHandle="handleClose"
  >
    <div class="material-modal-body">
      <div class="toolbar-wrap">
        <hyNewButtons
          :buttonsData="downloadButtonsConfig"
          @selectButtons="handleDownloadAll"
        />
      </div>
      <newTable
        :height="280"
        :tableData="materialList"
        :column="tableColumn"
        :ifHaveIndex="true"
        :ifHaveCheckBox="false"
        :page="1"
        :pageSize="materialList.length || 10"
      >
        <template slot="fileName" slot-scope="{ data }">
          <div class="file-name-cell">
            <div class="file-category">{{ data.category }}</div>
            <el-button type="text" class="file-link" @click="handleDownloadFile(data)">
              {{ data.fileName }}
            </el-button>
          </div>
        </template>
      </newTable>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">返回</el-button>
    </template>
  </hyNewModal>
</template>

<script>
import { materialTableColumn, materialDownloadButtonsConfig } from './config.js';
import { getDemandMaterials } from './mockData.js';

export default {
  name: 'viewMaterialModal',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    demandId: {
      type: String,
      default: ''
    },
    demandCode: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      tableColumn: materialTableColumn,
      downloadButtonsConfig: materialDownloadButtonsConfig,
      materialList: []
    };
  },

  watch: {
    visible(val) {
      if (val) {
        this.loadMaterials();
      }
    },
    demandId() {
      if (this.visible) {
        this.loadMaterials();
      }
    }
  },

  methods: {
    loadMaterials() {
      this.materialList = getDemandMaterials(this.demandId, this.demandCode);
    },

    handleDownloadFile(row) {
      this.$message.success(`正在下载：${row.fileName}（模拟）`);
    },

    handleDownloadAll() {
      if (!this.materialList.length) {
        this.$message.warning('暂无可下载材料');
        return;
      }
      this.$message.success(`正在打包下载全部材料，共 ${this.materialList.length} 个文件（模拟）`);
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.material-modal-body {
  padding: 0 4px;
}
.file-name-cell {
  text-align: left;
  line-height: 1.5;
}
.file-category {
  font-weight: 600;
  color: #303133;
}
.file-link {
  padding: 0;
  font-size: 13px;
}
</style>
