<template>
  <el-button class="hyCdButton" v-bind="$attrs" :disabled="disabled" @click="handleClick">{{ text }}</el-button>
</template>

<script>
export default {
  name: 'HyCdButton',
  props: {
    initText: {
      type: String,
      default: '发送验证码'
    },
    waitTime: {
      type: Number,
      default: 60
    },
    countingText: {
      type: String,
      default: '{s}s'
    }
  },
  data() {
    return {
      disabled: false,
      timer: null,
      laveTime: 0
    };
  },
  computed: {
    text() {
      if (this.disabled) {
        return this.countingText.replace(/\{s\}/g, _ => this.laveTime);
      } else {
        return this.initText;
      }
    }
  },
  methods: {
    countdown() {
      this.timer = setInterval(_ => {
        if (this.laveTime === 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.disabled = false;
          return;
        }
        this.laveTime -= 1;
      }, 1000);
    },
    start() {
      this.disabled = true;
      this.laveTime = this.waitTime;
      this.countdown();
    },
    handleClick() {
      this.$emit('click', this.start);
    }
  },
  beforeDestroy() {
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style scoped lang="scss">
/* .hyCdButton{
  width:90px;
  height: 24px;
} */
</style>
