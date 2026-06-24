<template>
  <div class="indexBox">
    <div class="title">
      <span class="left-title">{{ title }}</span>
      <div>
        <!-- <el-button size="mini" type="primary" class="tempAuth" @click="jumpTo">临时授权</el-button> -->
        <!-- <span class="tempAuth" @click="jumpTo"><i class="iconfont icon-icon_linshishouquan"></i> 临时授权</span> -->
        <span class="view-more" @click="handleRightClick"> {{ righttitle }}</span>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in list" :key="index">
        <div class="content">
          <div class="content-top">
            <span class="content-title">{{ item.name }}</span
            ><span class="r-title" @click="handleAudit(item)"><i class="iconfont icon-icon_Initiate"></i>发起申请</span>
          </div>
          <span class="desc">{{ item.processDesc }}</span>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'indexBox',
  props: {
    //传入代码
    title: {
      type: String,
      default: ''
    },
    //传入代码
    righttitle: {
      type: String,
      default: ''
    },
    //传入代码
    list: {
      type: Array
    }
  },
  methods: {
    handleRightClick() {
      this.$emit('rightClick');
    },
    handleAudit(item) {
      this.$emit('audit', item);
    },
    jumpTo() {
      this.$router.push({ name: 'temporaryAuth' });
    }
  }
};
</script>

<style lang="scss" scoped>
.indexBox {
  font-family: Source Han Sans CN;
  margin-bottom: 60px;
  line-height: 1;
}
.title {
  display: flex;
  justify-content: space-between;
}
.content {
  background: #ffffff;
  box-shadow: 0px 2px 20px rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  margin-top: 20px;
  padding: 32px 20px 32px 32px;
}
.content-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.content .content-title {
  font-size: 18px;
  font-weight: bold;
  color: #43425d;
}
.content .r-title {
  font-size: 14px;
  font-weight: 400;
  color: #43a0ff;
  cursor: pointer;
  & i {
    margin-right: 7px;
  }
}
.content .desc {
  font-size: 12px;
  font-weight: 400;
  color: #43425d;
  opacity: 0.61;
}
.left-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 27px;
  color: #43425d;
}
.left-title::before {
  content: '';
  width: 3px;
  height: 18px;
  border-left: 3px solid #43a0ff;
  margin-right: 10px;
}
.view-more {
  font-size: 14px;
  font-weight: bold;
  color: #43a0ff;
  cursor: pointer;
}
.tempAuth {
  margin-right: 24px;
  color: rgba(67, 66, 93, 0.35);
  cursor: pointer;
  font-size: 14px;
  &:hover {
    color: rgba(67, 66, 93,1);
  }
}
</style>
