<template>
  <div class="page4-container">
    <div class="header">
      <h1 class="title">合作企业</h1>
      <div class="divider"></div>
    </div>
    <div class="cards-container">
      <div class="card" v-for="(company, index) in companies" :key="index">
        <div class="logo">
          <i class="el-icon-building"></i>
        </div>
        <h3 class="company-name">{{ company.name }}</h3>
        <div class="info-item">
          <i class="el-icon-map-location"></i>
          <span>注册时间：{{ company.time }}</span>
        </div>
        <div class="info-item">
          <i class="el-icon-map-location"></i>
          <span>注册地址：{{ company.address }}</span>
        </div>
        <div class="info-item">
          <i class="el-icon-menu"></i>
          <span>主营：{{ company.business }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Page4',
  data() {
    return {
      companies: [
        {
          name: '北京新能源科技有限公司',
          time: '成立于2015年',
          address: '北京市朝阳区科技园区',
          business: '新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售'
        },
        {
          name: '上海智能电网集团',
          time: '成立于2010年',
          address: '上海市浦东新区张江',
          business: '新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售'
        },
        {
          name: '广州储能技术有限公司',
          time: '成立于2018年',
          address: '广州市天河区科技园',
          business: '新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售'
        },
        {
          name: '深圳充电桩科技有限公司',
          time: '成立于2012年',
          address: '深圳市南山区科技园',
          business: '新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售、新能源汽车研发与销售'
        }
      ]
    }
  }
}
</script>

<style scoped>
.page4-container {
  padding: 20px;
  min-height: 100vh;
  background-color: #fff;
}

.header {
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  color: #333;
  margin: 0 0 15px 0;
}

.divider {
  height: 1px;
  background-color: #e0e0e0;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
}

.logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo i {
  font-size: 36px;
  color: #fff;
}

.company-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.info-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  font-size: 14px;
  color: #666;
  text-align:left;
  margin-bottom: 10px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item i {
  font-size: 14px;
  color: #409EFF;
  
}

@media (max-width: 1024px) {
  .cards-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>
