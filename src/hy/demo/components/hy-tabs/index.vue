<template>
  <div class='hyTabs'>
    <el-tabs class='tabs' v-model="mySelectTab" type="card" closable @tab-remove="removeTab" @tab-click='tabClick'>
      <el-tab-pane
          v-for="item in myTabData"
          v-if="item.name !== 'sys_zy_01' &&  item.name !== 'sys_kj_01_00'"
          :key="item.name"
          :label="item.relMenuName"
          :name="item.name"
      >
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  /**
   * @param {tabData} 选项卡数据 {title:'',name:'',path:''},title:标题，name:唯一id值，path:跳转路由
   * @param {selectTab} 选中tab的name值
   * @function removeTab(removeData,tabsData,activeName,nextT) 移除tab,removeData:移除的数据,tabsData:移除后tabs数据，activeName:移除后的被选中的tab的name值,nexT下一个选中的tab数据
   * @function tabClick(e) 点击tab事件，e:选中的tab数据
   */
  import store from '@/store'
  export default {
    name: "hyTabs",
    props: {
      tabData: {
        type: Array,
        default() {
          return []
        }
      },
      selectTab: {
        type: String,
        default() {
          return ''
        }
      }
    },
    data() {
      return {
        myTabData: this.tabData,
        mySelectTab: this.selectTab
      };
    },
    created(){
      // console.log(this.tabData,"tabDatatabDatatabData")
    },
    methods: {
      removeTab(targetName) {
        if (this.myTabData.length < 2) return
        let tabs = this.myTabData;
        let activeName = this.mySelectTab;
        var nextT
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              nextT = nextTab
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }
        this.mySelectTab = activeName;
        this.myTabData = tabs.filter(tab => tab.name !== targetName);
        var removeData = tabs.filter(tab => tab.name == targetName);
        this.$emit('removeTab', removeData, this.myTabData, activeName, nextT)
      },
      tabClick(tab, event) {
        // console.log(this.myTabData,tab,event,"tabClicktabClicktabClick")
        const { name } = tab
        this.myTabData.map((item) => {
          if (item.name == name) {
            // console.log(item,"tabClickitemitemitemitem")
            // this.$store.commit('SET_MENUACTIVE', item.name.slice(0,-6),)
            this.$emit('tabClick', item)
          }
        })
      }
    },
    watch: {
      tabData(val) {
        this.myTabData = val
      },
      selectTab(val) {
        // console.log(val)
        this.mySelectTab = val
        // store.commit('SET_MENUACTIVE', val)
        // console.log(this.mySelectTab,"mySelectTabmySelectTabmySelectTab")
      }
    }
  };
</script>

<style lang="less" scoped>
  .hyTabs {
    height: 40px;
    background: #eef0f2;
    width: 100%;
    /deep/ .el-tabs__nav {
      height: 40px;
      padding-top: 8px;
      box-sizing: border-box;
      border: none;
    }
    /deep/ .el-tabs--card > .el-tabs__header {
      border-bottom: 0;
      .el-tabs__item {
        border-left: 0;
        position: relative;
        &::before {
          content: '';
          top: 50%;
          transform: translateY(-50%);
          position: absolute;
          left: 0;
          height: 16px;
          width: 1px;
          background-color: #c1ccda;
        }
      }

      .el-tabs__nav-wrap.is-scrollable {
        display: flex;
        align-items: center;
      }
    }
    /deep/ .el-tabs__item {
      color: #526070;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
      &.is-active {
        color: #4a90e2;
        background-color: #ffffff;
        box-shadow: 0 -4px 4px rgba(0, 0, 0, 0.05);
        border-radius: 4px 4px 0 0;
        &::before {
          width: 0 !important;
        }
        & + .el-tabs__item {
          &::before {
            width: 0;
          }
        }
      }
      &:last-child {
        &.is-active {
          &::after {
            width: 0 !important;
          }
        }
        &::after {
          content: '';
          top: 50%;
          transform: translateY(-50%);
          position: absolute;
          right: 0;
          height: 16px;
          width: 1px;
          background-color: #c1ccda;
        }
      }
    }
  }
</style>
