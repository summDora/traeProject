<template>
  <div class="history">
    <div class="header">
      <span @click="goback"><i class="iconfont icon-tool_back"></i> 历史版本</span>
    </div>
    <hy-table :data="tableData" :titles="tableHeader" placeholder="--" align="center" border height="600px" width="80%">
      <template #caozuo="{ row }">
        <el-button type="text" @click="preview(row)">预览</el-button>
      </template>
    </hy-table>
    <hy-dialog :show.sync="previewVisible" showClose>
      <section class="dingflow-design">
        <div class="box-scale disable" ref="boxScale" :style="'transform: scale(' + nowVal / 100 + '); transform-origin: 50% 0px 0px;'">
          <nodeWrap :nodeConfig.sync="nodeConfig" :editMode="false"></nodeWrap>
        </div>
      </section>
    </hy-dialog>
  </div>
</template>
<script>
import { findProcDefHis } from '@/api/flow';
export default {
  name: 'history',
  components: {
    nodeWrap: _ => import('./nodeWrap.vue')
  },
  data() {
    return {
      nowVal: 100,
      directorMaxLevel: 0,
      isTried: false,
      nodeConfig: {},
      previewVisible: false,
      tableId: '',
      tableData: [],
      tableHeader: [
        {
          label: '版本号',
          prop: 'version'
        },
        {
          label: '发布人',
          prop: 'publishBy'
        },
        {
          label: '发布时间',
          prop: 'publishTime',
          align: 'center'
        },
        {
          label: '发布说明',
          prop: 'description'
        },
        {
          label: '操作',
          prop: 'caozuo',
          slot: 'caozuo'
        }
      ]
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    preview(row) {
      if (row.processJson) {
        this.nodeConfig = JSON.parse(row.processJson);
      }
      this.previewVisible = true;
    }
  },
  mounted() {
    const processDefKey = this.$route.query.processDefKey;
    let param = { processDefKey };
    this.m_apiFn(findProcDefHis)(param).then(({ result }) => {
      this.tableData = result;
    });
  }
};
</script>
<style lang="scss" scoped>
.dingflow-design {
  width: 100%;
  height: 100%;
  background-color: #f5f5f7;
  overflow: auto;
}
/deep/.el-table thead {
  color: #43425d;
}
.history {
  width: 1500px;
  margin: 0 auto;
}
.header {
  font-size: 26px;
  font-weight: bold;
  color: #43425d;
  opacity: 0.5;
  margin: 40px 0px;
  & span {
    cursor: pointer;
    display: flex;
    items-align: center;
    & i {
      margin-right: 14px;
    }
  }
}
.disable {
  pointer-events: none;
}
</style>
