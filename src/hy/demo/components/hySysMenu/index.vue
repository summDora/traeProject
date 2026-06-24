<template>
  <section class="menu-box">
    <el-popover placement="bottom" trigger="hover" :open-delay="100" popper-class="menu-popover" :visible-arrow="false"
      v-model="visible" @hide="pophide">
      <div class="menu-box-sub" v-if="subData && subData.length">
        <template v-for="(item, index) in subData">
          <div class="menu-box-sub-group" :key="index">
            <div>
              <i style="color:#1f78E9;font-size: 5px;display:inline;margin-right: 3px;margin-left: -1px; vertical-align: middle;"
                class="icon iconfont iconerjitongyongcaidantubiao"></i>
              <span v-text="item.relMenuName"></span>
            </div>

            <div class="menu-box-sub-content" v-if="item.children && item.children.length">
              <template v-for="(sub, subIndex) in item.children">
                <div class="menu-box-sub-item" :key="subIndex" :class="{ 'active': subMenuActive === sub.relMenuId }"
                  @click="menuClick(sub)">
                  <div style="display: flex; align-items: center;">
                    <!-- <i style="color:#1f78E9;font-size: 12px;margin-top: 1px;" class="icon iconfont iconuser"></i> -->
                    <span v-text="sub.relMenuName"></span>
                  </div>

                  <!-- <template v-for="(i, j) in childrenList">
                        <div class="menu-box-sub-item" :key="j"
                            :class="{'active': subMenuActive === i.relMenuId}"
                            @click="menuClick(i)"
                            style="margin-left: 20px;">
                          <span v-text="i.relMenuName"></span>
                        </div>
                      </template> -->

                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
      <div slot="reference" class="menu-box-content">
        <template v-for="(item, index) in menuData">
          <div class="menu-box-item" v-if="item.children && item.children.length"
            :class="{ 'active': menuActive === item.relMenuId, 'hover': menuhover === item.relMenuId }" :key="index"
            @mouseleave="(e) => handleMouseLeave(e, 100, item)" @mouseenter="(e) => handleMouseEnter(e, 100, item)"
            @focus="(e) > handleMouseEnter(e, 100, item)">
            <i :class="`icon iconfont ${item.norIcon}`" style="font-size: 14px;color:#b4bad8"></i>
            <span v-text="item.relMenuName"></span>
          </div>
          <!-- @mouseenter="visible = false"
          @focus="visible = false" -->
          <div class="menu-box-item" :class="{ 'active': menuActive === item.relMenuId }"
            @mouseleave="(e) => handleMouseLeave(e, 100, item)" @mouseenter="(e) => handleMouseEnter(e, 100, item)"
            @focus="(e) > handleMouseEnter(e, 100, item)" @click="singleMenuClick(item)" :key="index" v-else>
            <i :class="`icon iconfont ${item.norIcon}`" style="font-size: 14px;color:#b4bad8"></i>
            <span v-text="item.relMenuName"></span>
          </div>
        </template>
      </div>
    </el-popover>
  </section>
</template>
<script>
/**
 * @param {menuData} 导航数据，例：[{id:'',icon:'',path:'',title:''}],id:唯一id,icon:图标,path:对应路径,title:标题
 * @param {mode} 导航类型
 * @param {bgColor} 背景色
 * @param {textColor} 文字颜色
 * @param {activeTextColor} 选中字体颜色
 * @param {uniqueOpen} 最多同时展开一层
 * @param {router} 是否使用 vue-router 的模式
 * @param {isCollapse} 展开收缩
 * @param {defaultActive} 当前激活菜单的 index
 */
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: "hySysMenu",
  data() {
    return {
      show: true,
      activeMenu: null,
      isActive: null,
      visible: false,
      nodeActive: null,
      childMenuActive: null,
      menuhover: '',
      childrenList: [
        {
          relMenuId: 1,
          relMenuName: "测试菜单1"
        },
        {
          relMenuId: 2,
          relMenuName: "测试菜单2"
        },
        {
          relMenuId: 3,
          relMenuName: "测试菜单3"
        }
      ]
    }
  },

  props: {
    menuData: {
      type: Array,
      default() {
        return []
      }
    },
    mode: {
      type: String,
      default() {
        return 'horizontal'
      }
    },
    bgColor: {
      type: String,
      default() {
        return ''
      }
    },
    textColor: {
      type: String,
      default() {
        return ''
      }
    },
    activeTextColor: {
      type: String,
      default() {
        return ''
      }
    },
    uniqueOpen: {
      type: Boolean,
      default() {
        return false
      }
    },
    router: {
      type: Boolean,
      default() {
        return false
      }
    },
    isCollapse: {
      type: Boolean,
      default() {
        return false
      }
    },
    defaultActive: {
      type: String,
      default() {
        return ''
      }
    },
    needUnderline: {
      type: Boolean,
      default() {
        return false
      }
    }
  },

  computed: {
    subData() {
      const el = this.menuData.filter(item => item.relMenuId === this.activeMenu)[0];

      return el ? el.children : [];
    },
    ...mapGetters([
      'tabData',
      'subMenuActive',
      'menuActive'
    ]),
  },

  watch: {
    menuActive: {
      handler(val) {
        // console.log(4444,this.menuActive);
        this.menuhover = this.menuActive
      },
      immediate: true,
    }
  },
  created() {
    // console.log(this.menuData,11111111111111)
    // console.log(this.subData,22222222)
  },
  methods: {
    selectMenu(index, indexPath) {
      this.$emit('selectMenu', index, indexPath)
    },

    handler() {
      this.show = false;
    },
    handleMouseEnter(e, time, path) {
      let popover = document.getElementsByClassName('menu-popover')
      // console.log(popover)
      this.menuhover = path.relMenuId
      this.activeMenu = path.relMenuId;
      this.$forceUpdate();
      // this.$nextTick(()=>{
      //   popover.style.left=e.target.offsetLeft+'px !important'
      // // popover.setAttribute('left',e.target.offsetLeft+'px ! important')
      //   debugger
      //   console.log(22222,e.target.offsetLeft,popover.style);
      // })
      setTimeout(() => {
        for (let item of popover) {
          item.style.left = e.target.offsetLeft + 'px'
        }
      }, 100);
    },
    pophide() {
      //console.log(11111);
      this.menuhover = this.menuActive
    },
    handleMouseLeave(e, time, path) {
      // this.menuhover= this.menuActive 
    },

    menuClick(sub) {
      // console.log(sub)
      this.childMenuActive = sub.relMenuId;
      this.visible = false;
      this.menuActiveFn(sub);
      this.setSubMenuActive(this.childMenuActive);
      sessionStorage.setItem("firstPath", sub.path);
      this.$router.push(sub.path);
      let arr = JSON.parse(JSON.stringify(this.tabData))
      this._removeRepeat(arr, sub);

      this.menuhover = this.menuActive
    },

    singleMenuClick(item) {
      this.isActive = this.menuActive;
      if (this.isActive === item.relMenuId) return;
      this.isActive = item.relMenuId;
      this.setMenuActive(this.isActive);
      this.$router.push(item.path)
      let arr = JSON.parse(JSON.stringify(this.tabData))
      this._removeRepeat(arr, item);
    },

    menuActiveFn(sub) {
      const relMenuId = this.subData.find(item => item.relMenuId === sub.menuParentId).menuParentId;
      this.isActive = this.menuData.find(item => item.relMenuId === relMenuId).relMenuId;
      this.setMenuActive(this.isActive);
    },

    ...mapMutations({
      setTabData: 'SET_TABDATA',
      setSelectTab: 'SET_SELECTTAB',
      setMenuActive: 'SET_MENUACTIVE',
      setSubMenuActive: 'SET_SUBMENUACTIVE',
    }),

    removeRepeat(val, obj) {
      return new Promise((resolve) => {
        let ifRepeat = false
        ifRepeat = val.some((item) => item.name == obj.relMenuId)
        resolve(ifRepeat)
      })
    },
    _removeRepeat(val, obj) {
      this.setSelectTab(obj.relMenuId)
      this.removeRepeat(val, obj).then((res) => {
        if (!res) {
          let arr = JSON.parse(JSON.stringify(val))
          arr = [...arr, { relMenuName: obj.relMenuName, name: obj.relMenuId, path: obj.path, key: obj.name, topMenuId: this.isActive }]
          this.$nextTick(() => {
            this.setTabData(arr)
            this.$forceUpdate()
          })
        }
      })
    },
  }
};
</script>
<style lang="less" scoped>
.five-menu {
  height: 48px;
  flex-shrink: 0;
  box-sizing: border-box;

  /deep/ .el-submenu__title {
    line-height: 48px !important;
  }

  /deep/ .el-menu-item {
    height: 48px;
    line-height: 48px !important;
  }

  &.el-menu--horizontal {
    .el-submenu {
      height: 100%;

      /deep/ .el-submenu__title {
        &:hover {
          background-color: inherit;
        }
      }
    }
  }
}
</style>
<style lang="less">
.menu-box {
  display: flex;
  height: inherit !important;
  box-sizing: border-box;

  .menu-box-content {
    display: flex;
    width: 100%;
    padding: 0 24px;
    color: rgba(255, 255, 255, .6);
    // height: 40px;
    height: 48px;
    box-sizing: border-box;

    .menu-box-item {
      margin: 0 17px;
      width: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      height: 100%;
      flex-shrink: 0;
      cursor: pointer;

      &.active {
        transition: width ease 1s;
        position: relative;
        color: #ffffff;

        i {
          color: #ffffff !important;
        }
      }

      &.hover {
        position: relative;

        &::before {
          position: absolute;
          content: '';
          width: 82px;
          height: 4px;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          background-color: #fff;
        }
      }
    }
  }
}

.menu-box-sub {
  display: flex;
  padding: 12px 8px 36px 28px;
  box-sizing: border-box;

  .menu-box-sub-group {
    flex: 170px 0 0;
    display: flex;
    flex-direction: column;
    color: rgba(44, 50, 71, 0.65);
    width: 170px;

    span {
      color: #2c3247;
      height: 30px;
      vertical-align: middle;
      font-family: Source Han Sans CN;
      font-weight: bold;
      font-size: 14px;
      cursor: default;
    }

    .menu-box-sub-content {
      display: flex;
      flex-direction: column;
      align-items: left;
      margin-top: 18px;

      .menu-box-sub-item {
        // height: 30px;
        display: flex;
        // align-items: center;
        justify-content: center;
        flex-direction: column;

        &.active {
          span {
            color: #298BF5;
          }
        }

        span {
          font-weight: 400;
          color: rgba(44, 50, 71, 0.65);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          width: 100%;

          &:hover {
            color: #298BF5;
          }
        }
      }
    }
  }
}

.el-popper[x-placement^=bottom] {
  &.menu-popover {
    margin-top: 0;
    padding: 0;
  }
}

.el-menu {
  &.el-menu--popup {
    /deep/ .el-menu-item {
      color: rgba(44, 50, 71, 0.65) !important;

      &.is-active {
        color: rgba(41, 139, 245, 1) !important;
      }
    }

    /deep/ .el-submenu {
      /deep/ .el-submenu__title {
        color: rgba(44, 50, 71, 0.65) !important;
      }

      &.is-active {
        /deep/ .el-submenu__title {
          color: rgba(41, 139, 245, 1) !important;
        }
      }
    }
  }
}
</style>
