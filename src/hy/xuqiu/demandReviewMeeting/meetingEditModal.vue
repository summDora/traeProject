<template>
  <div>
  <hyNewModal
    v-if="visible"
    :dialogVisible="visible"
    :title="modalTitle"
    :showClose="true"
    :ifThird="true"
    :ifSure="false"
    :ifCancle="false"
    width="1180px"
    @closeHandle="handleClose"
  >
    <div class="meeting-edit-body">
      <div class="form-section">
        <hyNewForm
          ref="meetingForm"
          :formConfig="displayFormConfig"
          :formData="formData"
          :rules="meetingFormRules"
          :ifInLine="true"
          :ifSearch2="false"
          label-width="120px"
        />
      </div>

      <div class="xuqiu-section-title">评审列表</div>
      <div class="review-search">
        <div class="hy-new-search-box">
          <hyProjectForm
            :formConfig="reviewSearchConfig"
            :formData="reviewSearchObj"
            :ifSearch="true"
            :isReset="true"
            @onSearch="onReviewSearch"
            @onReset="onReviewReset"
          />
        </div>
        <div class="toolbar-wrap">
          <hyNewButtons
            :buttonsData="reviewButtonsConfig"
            @selectButtons="selectReviewButtons"
          />
        </div>
      </div>

      <div class="review-table-wrap">
        <newTable
          :tableData="reviewDemandList"
          :column="reviewTableColumn"
          :ifHaveIndex="true"
          :ifHaveCheckBox="true"
          height="280"
          @handleSelectionChange="handleReviewSelectionChange"
        >
          <template slot="operation" slot-scope="{ data }">
            <el-button type="text" @click.stop="removeReviewDemand(data)">删除</el-button>
          </template>
        </newTable>
      </div>
    </div>

    <template slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleConfirm">确认</el-button>
    </template>
  </hyNewModal>

  <add-review-demand-modal
    :visible="addDemandVisible"
    :exclude-ids="existingDemandIds"
    @confirm="handleAddDemandConfirm"
    @close="addDemandVisible = false"
  />
  </div>
</template>

<script>
import addReviewDemandModal from './addReviewDemandModal.vue';
import {
  meetingFormConfig,
  meetingFormData,
  meetingFormRules,
  reviewDemandSearchConfig,
  reviewDemandSearchData,
  reviewDemandTableColumn,
  reviewDemandButtonsConfig
} from './config.js';
import {
  filterReviewDemandPool,
  getMeetingDetail,
  saveMeeting
} from './mockData.js';

export default {
  name: 'meetingEditModal',

  components: {
    addReviewDemandModal
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    meetingId: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'create'
    }
  },

  data() {
    return {
      meetingFormRules,
      reviewSearchConfig: reviewDemandSearchConfig,
      reviewSearchObj: this.m_copy(reviewDemandSearchData),
      reviewTableColumn: reviewDemandTableColumn,
      reviewButtonsConfig: reviewDemandButtonsConfig,
      formData: this.m_copy(meetingFormData),
      reviewDemandList: [],
      reviewSelectData: [],
      candidateDemands: [],
      addDemandVisible: false
    };
  },

  computed: {
    modalTitle() {
      return this.mode === 'edit' ? '修改会议方案' : '新增会议方案';
    },
    existingDemandIds() {
      return this.reviewDemandList.map((item) => item.id);
    },
    displayFormConfig() {
      return meetingFormConfig.map((item) => {
        if (item.key === 'groupNames') {
          return {
            ...item,
            notShow: this.formData.groupingType !== '分组'
          };
        }
        return item;
      });
    }
  },

  watch: {
    visible(val) {
      if (val) {
        this.initPage();
        this.loadCandidateDemands();
      }
    }
  },

  methods: {
    initPage() {
      this.reviewSearchObj = this.m_copy(reviewDemandSearchData);
      this.reviewSelectData = [];
      if (this.mode === 'edit' && this.meetingId) {
        const detail = getMeetingDetail(this.meetingId);
        if (detail) {
          this.formData = {
            meetingName: detail.meetingName,
            meetingLocation: detail.meetingLocation,
            meetingLeader: detail.meetingLeader,
            meetingTime: detail.meetingTime,
            groupingType: detail.groupingType,
            groupNames: detail.groupNames,
            fundingChannel: detail.fundingChannel,
            remark: detail.remark
          };
          this.reviewDemandList = detail.reviewDemands.slice();
          return;
        }
      }
      this.formData = this.m_copy(meetingFormData);
      this.reviewDemandList = [];
    },

    loadCandidateDemands() {
      this.candidateDemands = filterReviewDemandPool(this.reviewSearchObj);
    },

    onReviewSearch() {
      this.loadCandidateDemands();
    },

    onReviewReset() {
      this.reviewSearchObj = this.m_copy(reviewDemandSearchData);
      this.loadCandidateDemands();
    },

    handleReviewSelectionChange(val) {
      this.reviewSelectData = val;
    },

    selectReviewButtons({ id, text }) {
      if (id === 0) {
        this.addDemandVisible = true;
        return;
      }
      if (id === 1) {
        this.addByTag();
        return;
      }
      if (id === 4) {
        if (!this.reviewSelectData.length) {
          this.$message.warning('请先选择需要删除的评审需求');
          return;
        }
        const ids = this.reviewSelectData.map((item) => item.id);
        this.reviewDemandList = this.reviewDemandList.filter((item) => !ids.includes(item.id));
        this.reviewSelectData = [];
        return;
      }
      this.$message.success(`${text}操作成功（模拟）`);
    },

    handleAddDemandConfirm(rows) {
      this.reviewDemandList.push(...rows);
      this.$message.success(`已新增 ${rows.length} 条评审需求`);
    },

    addByTag() {
      if (!this.reviewSearchObj.demandTag) {
        this.$message.warning('请先在查询区选择需求标签');
        return;
      }
      const existsIds = this.reviewDemandList.map((item) => item.id);
      const toAdd = this.candidateDemands.filter(
        (item) => item.demandTag === this.reviewSearchObj.demandTag && !existsIds.includes(item.id)
      );
      if (!toAdd.length) {
        this.$message.warning('未找到符合标签的评审需求');
        return;
      }
      this.reviewDemandList.push(...toAdd.map((item) => ({ ...item })));
      this.$message.success(`已按标签新增 ${toAdd.length} 条评审需求`);
    },

    removeReviewDemand(row) {
      this.reviewDemandList = this.reviewDemandList.filter((item) => item.id !== row.id);
    },

    handleConfirm() {
      this.$refs.meetingForm.validate((valid) => {
        if (!valid) return;
        if (!this.reviewDemandList.length) {
          this.$message.warning('请至少添加一条评审需求');
          return;
        }
        if (this.formData.groupingType === '分组' && !this.formData.groupNames.length) {
          this.$message.warning('请选择分组名称');
          return;
        }
        saveMeeting({
          ...this.formData,
          reviewDemands: this.reviewDemandList
        }, this.mode === 'edit' ? this.meetingId : '');
        this.$message.success(this.mode === 'edit' ? '会议方案修改成功' : '会议方案新建成功');
        this.$emit('saved');
      });
    },

    handleClose() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="less">
@import '../xuqiuSearch.less';
</style>

<style scoped>
.meeting-edit-body {
  max-height: 70vh;
  overflow-y: auto;
}
.form-section {
  padding: 0 4px 8px;
}
.review-table-wrap {
  padding: 0 4px 8px;
}
</style>
