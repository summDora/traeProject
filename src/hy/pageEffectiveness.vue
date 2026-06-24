<template>
  <div class="page-effectiveness">
    <div class="card">
      <div class="page-title">成效页面</div>
      <div class="page-placeholder">页面内容待开发</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageEffectiveness",
};
</script>

<style scoped>
.page-effectiveness {
  min-height: calc(100vh - 96px);
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 24px;
}

.page-placeholder {
  color: #909399;
  font-size: 14px;
  text-align: center;
  padding: 80px 0;
  background: #fafafa;
  border-radius: 6px;
  border: 1px dashed #dcdfe6;
}
</style>
