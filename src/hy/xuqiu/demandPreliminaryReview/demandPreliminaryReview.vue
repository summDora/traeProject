<template>
  <section>
    <preliminary-review-list
      v-if="activeView === 'main'"
      :show-back="false"
      page-title="需求初审"
      @review="goReview"
      @detail="goDetail"
      @batch-review="goBatchReview"
      @go-classify-list="goClassifyList"
      @blueprint="goBlueprint"
    />

    <preliminary-review-list
      v-else-if="activeView === 'classifyList'"
      :key="'classify-list'"
      :show-back="true"
      page-title="初审列表"
      @back="handleBackToMain"
      @review="goReview"
      @detail="goDetail"
      @batch-review="goBatchReview"
      @blueprint="goBlueprint"
    />

    <preliminary-review-process
      v-else-if="activeView === 'review'"
      :key="`review-${pageContext.demandId}`"
      :demand-id="pageContext.demandId"
      :readonly="pageContext.readonly"
      @back="handleBackFromReview"
      @saved="handleReviewSaved"
    />

    <blueprint-manage
      v-else-if="activeView === 'blueprint'"
      :key="`blueprint-${pageContext.demandId}`"
      :demand-id="pageContext.demandId"
      @back="handleBackFromBlueprint"
      @saved="handleBlueprintSaved"
    />
  </section>
</template>

<script>
import preliminaryReviewList from './preliminaryReviewList.vue';
import preliminaryReviewProcess from './preliminaryReviewProcess.vue';
import blueprintManage from './blueprintManage.vue';

export default {
  name: 'demandPreliminaryReview',

  components: {
    preliminaryReviewList,
    preliminaryReviewProcess,
    blueprintManage
  },

  data() {
    return {
      activeView: 'main',
      pageContext: {}
    };
  },

  methods: {
    goClassifyList() {
      this.activeView = 'classifyList';
    },

    goReview(row) {
      this.pageContext = {
        demandId: row.id,
        readonly: false,
        fromView: this.activeView
      };
      this.activeView = 'review';
    },

    goDetail(row) {
      this.pageContext = {
        demandId: row.id,
        readonly: true,
        fromView: this.activeView
      };
      this.activeView = 'review';
    },

    goBlueprint(row) {
      this.pageContext = {
        demandId: row.id,
        fromView: this.activeView
      };
      this.activeView = 'blueprint';
    },

    goBatchReview(rows) {
      if (rows.length === 1) {
        this.goReview(rows[0]);
        return;
      }
      this.$message.info(`已选中 ${rows.length} 条待初审需求，请逐条确认结论后提交（模拟批量入口）`);
      this.goReview(rows[0]);
    },

    handleBackToMain() {
      this.activeView = 'main';
      this.pageContext = {};
    },

    handleBackFromReview() {
      this.activeView = this.pageContext.fromView || 'main';
      this.pageContext = {};
    },

    handleReviewSaved() {
      this.handleBackFromReview();
    },

    handleBackFromBlueprint() {
      this.activeView = this.pageContext.fromView || 'main';
      this.pageContext = {};
    },

    handleBlueprintSaved() {
      this.handleBackFromBlueprint();
    }
  }
};
</script>
