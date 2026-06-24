<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" v-model="visible">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item Inputnode" @click="addType(1)">
            <div class="item-wrapper">
              <i class="iconfont icon-icon_Entrynode"></i>
            </div>
            <p>录入节点</p>
          </a>
          <a class="add-node-popover-item Approvenode" @click="addType(2)">
            <div class="item-wrapper">
              <i class="iconfont icon-icon_Approvenode"></i>
            </div>
            <p>审批节点</p>
          </a>
          <a class="add-node-popover-item CC" @click="addType(3)">
            <div class="item-wrapper">
              <i class="iconfont icon-icon_CC"></i>
            </div>
            <p>抄送节点</p>
          </a>
          <!-- <a class="add-node-popover-item management" @click="addType(4)">
                        <div class="item-wrapper">
                            <i class="iconfont icon-icon_management"></i>
                        </div>
                        <p>系统节点</p>
                    </a> -->
          <a class="add-node-popover-item Jumpcondition" @click="addType(5)">
            <div class="item-wrapper">
              <i class="iconfont icon-icon_Jumpcondition"></i>
            </div>
            <p>跳转条件</p>
          </a>
          <a class="add-node-popover-item copy" @click="copy">
            <div class="item-wrapper">
              <i class="iconfont icon-icon_copy2"></i>
            </div>
            <p>复制节点</p>
          </a>
        </div>
        <button class="btn" type="button" slot="reference" :style="{ visibility: editMode ? 'inherit' : 'hidden' }">
          <span class="iconfont icon-icon_new"></span>
        </button>
      </el-popover>
      <hy-dialog :show.sync="showCondition" showClose size="500px" append-to-body title="选择节点">
        <el-radio-group v-model="selectNode">
          <div v-for="item in selectNodes" :key="item.id">
            <el-radio :key="item.id" :label="item.id">
              {{ item.formData.nodeName || item.name }}
            </el-radio>
          </div>
        </el-radio-group>
        <div class="handlers">
          <el-button class="btn cancel" type="info" @click="_handleCancel">取消</el-button>
          <el-button class="btn confirm" type="primary" @click="_handleConfirm">完成</el-button>
        </div>
      </hy-dialog>
    </div>
  </div>
</template>
<script>
// import {genId,genIdStr,get4NodeConfig} from '@/utils/jsonToXml'
import getFormInit from '@/components/hy-flow-attr-panel/formInit';
import { cloneDeep } from 'lodash';
export default {
  props: {
    childNodeP: Object,
    srcConfig: Object,
    editMode: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visible: false,
      selectNodes: [],
      showCondition: false,
      selectNode: ''
    };
  },
  methods: {
    _handleCancel() {
      this.showCondition = false;
    },
    _handleConfirm() {
      if (!this.selectNode) {
        this.$message.error('请选择节点');
        return;
      }
      let nodeData = this.selectNodes.filter(item => item.id == this.selectNode);
      let cloneNode = cloneDeep(nodeData[0]);
      cloneNode.formData.id = cloneNode.id = genIdStr(); //修改复制节点id
      cloneNode.childNode = this.childNodeP;
      this.$emit('update:childNodeP', cloneNode);
      this.showCondition = false;
    },
    addType(type) {
      this.visible = false;
      this._validate(type).then(valid => {
        if (valid) {
          if (type != 5) {
            var data;
            if (type == 1) {
              data = {
                nodeName: '录入节点',
                error: true,
                type: 1,
                childNode: this.childNodeP
              };
            } else if (type == 2) {
              data = {
                nodeName: '审批节点',
                type: 2,
                childNode: this.childNodeP
              };
            } else if (type == 3) {
              data = {
                nodeName: '抄送节点',
                type: 3,
                childNode: this.childNodeP
              };
            } else if (type == 4) {
              data = {
                nodeName: '系统节点',
                type: 4,
                childNode: this.childNodeP
              };
            }
            genId(data); //添加ID
            let formData = { ...getFormInit(data.type), id: data.id };
            data.formData = formData;
            this.$emit('update:childNodeP', data);
          } else {
            let data = {
              nodeName: '路由',
              type: 5,
              childNode: this.childNodeP,
              conditionNodes: []
            };
            let conditionNode1 = {
              nodeName: '条件1',
              error: true,
              type: 9,
              priorityLevel: 1,
              conditionList: [],
              childNode: null,
              id: genIdStr()
            };
            let conditionNode2 = {
              nodeName: '条件2',
              error: true,
              type: 9,
              priorityLevel: 1,
              conditionList: [],
              childNode: null,
              id: genIdStr()
            };
            conditionNode1.formData = { ...getFormInit(conditionNode1.type), id: conditionNode1.id, nodeName: '条件1' };
            conditionNode2.formData = { ...getFormInit(conditionNode2.type), id: conditionNode2.id, nodeName: '条件2' };
            data.conditionNodes.push(conditionNode1);
            data.conditionNodes.push(conditionNode2);
            genId(data); //添加ID
            data.formData = { ...getFormInit(data.type), id: data.id };
            this.$emit('update:childNodeP', data);
          }
        }
      });
    },
    _validate(type) {
      return new Promise((resolve, reject) => {
        let { nodes } = get4NodeConfig(this.srcConfig);
        if (type == 1 && nodes.filter(item => item.type == 1).length > 0) {
          this.$message.warning('录入节点只能存在一个！');
          resolve(false);
        } else if (type == 3 && nodes.filter(item => item.type == 3).length > 0) {
          this.$message.warning('抄送节点只能存在一个！');
          resolve(false);
        } else {
          resolve(true);
        }
      });
    },
    copy() {
      let { nodes } = get4NodeConfig(this.srcConfig);
      this.selectNodes = nodes.filter(item => [1, 2, 3, 4].includes(item.type));
      // console.log(selectNodes)
      this.showCondition = true;
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__body {
  min-height: 250px;
  padding-bottom: 70px !important;
  position: relative;
  box-sizing: border-box;
}
.handlers {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  & .btn {
    width: 200px;

    & + .btn {
      margin-left: 30px;
    }

    &.test {
      background-color: #3b86ff;
      border-color: #3b86ff;
    }
  }
}
.add-node-btn {
  user-select: none;
  width: 240px;
  padding: 20px 0 32px;
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  flex-shrink: 0;
  -webkit-box-flex: 1;
  flex-grow: 1;
}

.add-node-btn .btn {
  outline: none;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  width: 30px;
  height: 30px;
  background: #3296fa;
  border-radius: 50%;
  position: relative;
  border: none;
  line-height: 30px;
  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.add-node-btn .btn .iconfont {
  color: #fff;
  font-size: 16px;
}

.add-node-btn .btn:hover {
  transform: scale(1.3);
  box-shadow: 0 13px 27px 0 rgba(0, 0, 0, 0.1);
}

.add-node-btn .btn:active {
  transform: none;
  background: #1e83e9;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
}
.add-node-btn-box {
  width: 240px;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -ms-flex-negative: 0;
  flex-shrink: 0;
  -webkit-box-flex: 1;
  -ms-flex-positive: 1;
  position: relative;
}

.add-node-btn-box:before {
  content: '';
  position: absolute;
  top: 0px;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: -1;
  margin: auto;
  width: 2px;
  height: 100%;
  background-color: #cacaca;
}

.add-node-popover {
  min-height: 160px;
}

.add-node-popover-header {
  position: relative;
  margin-bottom: 15px;
}

.add-node-popover-close {
  cursor: pointer;
  position: absolute;
  top: 5px;
  right: 5px;
  color: rgba(0, 0, 0, 0.25);
}

.add-node-popover-body {
  display: flex;
}

.add-node-popover-item {
  user-select: none;
  display: inline-block;
  width: 64px;
  height: 64px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
}
.add-node-popover-item:not(:first-of-type) {
  margin-left: 10px;
}
.add-node-popover-item p {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
}
.add-node-popover-item .item-wrapper {
  user-select: none;
  display: inline-block;
  margin-bottom: 5px;
}

.add-node-popover-item .iconfont {
  font-size: 24px;
  color: #ffffff;
}

.add-node-popover-item.Inputnode {
  background: rgba(67, 160, 255, 1);
}

.add-node-popover-item.Approvenode {
  background: rgba(247, 93, 93, 1);
}

.add-node-popover-item.CC {
  background: rgba(250, 187, 43, 1);
}

.add-node-popover-item.management {
  background: rgba(130, 126, 255, 1);
}
.add-node-popover-item.Jumpcondition {
  background: rgba(98, 191, 51, 1);
}
.add-node-popover-item.copy {
  background: rgb(28, 184, 184);
}

/* .add-node-popover-item:hover .item-wrapper {
    background: #3296fa;
    box-shadow: 0 10px 20px 0 rgba(50, 150, 250, .4)
}

.add-node-popover-item:hover .iconfont {
    color: #fff
} */

.add-node-popover-item:active .item-wrapper {
  box-shadow: none;
  background: #eaeaea;
}

.add-node-popover-item:active .iconfont {
  color: inherit;
}
</style>
