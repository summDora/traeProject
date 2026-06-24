<template>
  <div style="padding: 10px; background-color: #fafafa">
    <el-button
      class="btn"
      v-for="(item, index) in buttonsData"
      :disabled="item.disabled"
      :size="item.BtnSize ? item.BtnSize : 'small'"
      :key="index"
      :type="item.type"
      :round="item.round"
      v-if="!item.isHidden"
      :style="item.style"
      @click="selectButtons(item)"
    >
      <!-- <img class="el-img-icon" v-if="item.isQiyong" src="../../images/qiyong.png" alt="" style="width: 12px" /> -->
      <!-- <img class="el-img-icon" v-if="item.isZanting" src="../../images/zanting.png" alt="" style="width: 12px" /> -->
      <!-- <img class="el-img-icon" v-if="item.isDelete" src="../../images/lajitong.png" alt="" style="width: 12px" /> -->
      <i class="el-img-icon" v-if="item.icon" :class="[item.icon, { iconfont: item.third }]"></i>
      <!-- <img v-if="item.imgBtn" :src="item.imgBtn" /> -->
      {{ item.text }}
    </el-button>
  </div>
</template>

<script>
/**
 * @param {buttonsData} 按钮组数据 {id:0,text:'content'} id为按钮唯一ID值 text为按钮显示文本(不区分选中按钮传相同的id值)
 * @param {selectId} 默认被选中按钮
 * @function selectButtons(e) 选择按钮事件 e为选择按钮数据
 */
export default {
  name: 'colorButton',
  props: {
    buttonsData: {
      type: Array,
      default: () => [],
    },
    selectId: {
      type: Number,
      default: () => 0,
    },
  },
  data() {
    return {
      mySelectId: this.selectId,
    }
  },
  created() {
    if (this.buttonsData.length > 0 && this.buttonsData[0].id !== undefined) {
      if (!isNaN(this.buttonsData[0].id)) {
        this.mySelectId = this.buttonsData[0].id
      }
    }
  },
  methods: {
    selectButtons(e) {
      this.mySelectId = e.id
      this.$emit('selectButtons', e)
    },
  },
  watch: {
    selectId(val) {
      this.mySelectId = val
    },
  },
}
</script>

<style lang="less" scoped>
.el-button--medium {
  i {
    font-size: 13px !important;
  }
}
.el-img-icon {
  margin-right: 5px;
  margin-bottom: 0px;
}
</style>