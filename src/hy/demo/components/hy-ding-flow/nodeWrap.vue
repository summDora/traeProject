<template>
    <div>
        <div class="node-wrap" v-if="nodeConfig.type!=5&&nodeConfig.type!=-1">
            <div v-if="nodeConfig.type==0">
                <div class="startNode">开始</div>
            </div>
            <div v-if="nodeConfig.type!=0" class="node-wrap-box" :class="{active:nodeConfig.id==activeId}">
                <div >
                    <div class="ding-title"  @click.stop="clickEvent()" :style="'background: rgb('+ ['67, 160, 255','247, 93, 93','250, 187, 43','130, 126, 255'][nodeConfig.type-1] +');'">
                        <i class="iconfont flag" :class="nodeClass(nodeConfig)"></i>
                        <span class="single-elsis" v-if="nodeConfig.type!=0&&!isInput"  :title="nodeConfig.formData&&nodeConfig.formData.nodeName||nodeConfig.nodeName">{{nodeConfig.formData&&nodeConfig.formData.nodeName||nodeConfig.nodeName}}
                            
                            <i class=" iconfont icon-tool_edit edit"></i>
                        </span>
                        <input type="text" class="ant-input editable-title-input" v-if="nodeConfig.type!=0&&isInput"
                        @blur="blurEvent()" @focus="$event.currentTarget.select()" v-focus
                        v-model="nodeConfig.formData.nodeName" :placeholder="nodeConfig.formData&&nodeConfig.formData.nodeName||nodeConfig.nodeName">
                        <i class=" iconfont icon-tool_close2 close" v-if="nodeConfig.type!=0" @click.stop="delNode()"></i>
                    </div>
                    <div class="ding-content" v-show="nodeConfig.type!=4" @click="setPerson">
                        <!-- <div>{{oper(nodeConfig)}}</div> -->
                        <div class="single-elsis" :title="nodeConfig.formData&&nodeConfig.formData.oper?nodeConfig.formData.oper:' '">
                             {{nodeConfig.formData&&nodeConfig.formData.oper?nodeConfig.formData.oper:nodeConfig.type==1?'所有人':' '}}
                        </div>
                    </div>
                    <div class="ding-content" v-show="nodeConfig.type==4" @click="setPerson">
                        <div>调用方法：</div>
                        <div class="single-elsis" >
                             {{nodeConfig.formData&&nodeConfig.formData.apiContent&&nodeConfig.formData.apiContent.apiData.apiName?nodeConfig.formData.apiContent.apiData.apiName:' '}}
                        </div>
                    </div>
                </div>
            </div>
            <addNode :childNodeP.sync="nodeConfig.childNode" :editMode="editMode" v-bind="$attrs"></addNode>
        </div>
        <div class="branch-wrap" v-if="nodeConfig.type==5">
            <div class="branch-box-wrap">
                <div class="branch-box">
                    <button class="add-branch" @click="addTerm"></button>
                    <span class="add-text"  @click="addTerm">添加条件</span>
                    <div class="col-box" v-for="(item,index) in nodeConfig.conditionNodes" :key="index">
                        <div class="condition-node">
                            <div class="condition-node-box">
                                <div class="auto-judge"  :class="{active:item.id==activeId}" @click="setPerson(index)">

                                    <div class="ding-title"  @click.stop="clickEvent(index)">
                                        <span v-if="!isInputList[index]" class="single-elsis" :title="item.formData.nodeName||('条件'+(index+1))">{{item.formData.nodeName||('条件'+(index+1))}}
                                            <i class=" iconfont icon-tool_edit edit"></i>
                                        </span>
                                        <input type="text" class="ant-input editable-title-input" v-if="isInputList[index]"
                                        @blur="blurEvent(index)" @focus="$event.currentTarget.select()" v-focus
                                        v-model="item.formData.nodeName" :placeholder="item.formData&&item.formData.nodeName||item.nodeName">
                                        <i class="iconfont icon-tool_close2 close" @click="delTerm(index)"></i>
                                    </div>
                                    <div class="ding-content single-elsis" :title="item.formData?item.formData.conExpCN:''">
                                        {{item.formData?item.formData.conExpCN:''}}
                                    </div>

                                </div>
                                <addNode :childNodeP.sync="item.childNode" :editMode="editMode"  v-bind="$attrs"></addNode>
                            </div>
                        </div>
                        <nodeWrap v-if="item.childNode && item.childNode" :nodeConfig.sync="item.childNode" 
                          :activeId.sync="activeId" @change="handleCHange" :editMode="editMode"  v-bind="$attrs"></nodeWrap>
                        <div class="top-left-cover-line" v-if="index==0"></div>
                        <div class="bottom-left-cover-line" v-if="index==0"></div>
                        <div class="top-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                        <div class="bottom-right-cover-line" v-if="index==nodeConfig.conditionNodes.length-1"></div>
                    </div>
                </div>
                <addNode :childNodeP.sync="nodeConfig.childNode" :editMode="editMode" v-bind="$attrs"></addNode>
            </div>
        </div>
        <div class="end-node" v-if="nodeConfig.type==-1">
            结束
        </div>
        
        <nodeWrap v-if="nodeConfig.childNode && nodeConfig.childNode" :nodeConfig.sync="nodeConfig.childNode" :editMode="editMode"  v-bind="$attrs"
          :activeId.sync="activeId" @change="handleCHange"></nodeWrap>
        
    </div>
</template>
<script>
import { mapMutations } from 'vuex'
// import {genId} from '@/utils/jsonToXml'
import getFormInit from '@/components/hy-flow-attr-panel/formInit'
export default {
    props: {
        "nodeConfig": Object, 
        "activeId":String,
        //编辑模式(false时隐藏+号)
        editMode: {
            type: Boolean,
            default: true
        },    

    },
    components:{
    	addNode: _ => import("./addNode.vue"),
    	nodeWrap: _ => import("./nodeWrap.vue"),
    },
    data() {
        return {
            conditions: [],
            conditionList: [],
            isInputList: [],
            isInput: false,
        }
    },
    mounted() {
    },
    methods: {
        clickEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, true)
            } else {
                this.isInput = true;
            }
        },
        blurEvent(index) {
            if (index || index === 0) {
                this.$set(this.isInputList, index, false)
                this.nodeConfig.conditionNodes[index].formData.nodeName = this.nodeConfig.conditionNodes[index].formData.nodeName ? this.nodeConfig.conditionNodes[index].formData.nodeName:this.nodeConfig.conditionNodes[index].nodeName 
            } else {
                this.isInput = false;
                this.nodeConfig.formData.nodeName=this.nodeConfig.formData.nodeName ? this.nodeConfig.formData.nodeName:this.nodeConfig.nodeName 
            }
        },
        nodeClass(item){
            let className=''
            switch(item.type){
                case 1:className='icon-icon_Entrynode' ;break
                case 2:className='icon-icon_Approvenode' ;break
                case 3:className='icon-icon_CC' ;break
                case 4:className='icon-icon_management' ;break
            }
            return className
        },
        //
        oper(item){
            let className=''
            switch(item.type){
                case 1:className='录入人:' ;break
                case 2:className='审批人:' ;break
                case 3:className='抄送人:' ;break
            }
            return className
        },
        dealStr(str, obj) {
            let arr = [];
            let list = str.split(",");
            for (var elem in obj) {
                list.map(item => {
                    if (item == elem) {
                        arr.push(obj[elem].value)
                    }
                })
            }
            return arr.join("或")
        },
        delNode() {
            this.$emit("update:nodeConfig", this.nodeConfig.childNode);
        },
        addTerm() {
            let len = this.nodeConfig.conditionNodes.length + 1
            let node ={
                "nodeName": "条件" + len,
                "type": 9,
                "priorityLevel": len,
                "conditionList": [],
                "childNode": null
            }
            genId(node)
            node.formData={...getFormInit(node.type),id:node.id,nodeName:"条件" + len}
            this.nodeConfig.conditionNodes.push(node);
            this.$emit("update:nodeConfig", this.nodeConfig);
        },
        delTerm(index) {
            this.nodeConfig.conditionNodes.splice(index, 1)
            this.$emit("update:nodeConfig", this.nodeConfig);
            if (this.nodeConfig.conditionNodes.length == 1) {
                if (this.nodeConfig.childNode) {
                    if (this.nodeConfig.conditionNodes[0].childNode) {
                        this.reData(this.nodeConfig.conditionNodes[0].childNode, this.nodeConfig.childNode)
                    } else {
                        this.nodeConfig.conditionNodes[0].childNode = this.nodeConfig.childNode
                    }
                }
                this.$emit("update:nodeConfig", this.nodeConfig.conditionNodes[0].childNode);
            }
        },
        reData(data, addData) {
            if (!data.childNode) {
                data.childNode = addData
            } else {
                this.reData(data.childNode, addData)
            }
        },
        ...mapMutations({
            setCurrentNode: 'SET_CURRENTNODE',
            setPriorityLevel: 'SET_PRIORITYLEVEL',
            setPropertyActive: 'SET_PROPERTYACTIVE',
        }),
        setPerson(priorityLevel) {
            var { type } = this.nodeConfig;
            if(type==5){
                this.$emit("change",this.nodeConfig.conditionNodes[priorityLevel].id,this.nodeConfig.conditionNodes[priorityLevel])
            }else{
                this.$emit("change",this.nodeConfig.id,this.nodeConfig)
            }
            this.setPropertyActive('nodeAttr')
        },
        handleCHange(id,item){
            this.$emit("change",id,item);
        }
    }
}
</script>
<style scoped>
@import "./workflow.css";
.add-node-popover-body {
    display: flex;
}
.promoter_content {
    padding: 0 20px;
}
.condition_content .el-button,
.copyer_content .el-button,
.approver_self_select .el-button,
.promoter_content .el-button,
.approver_content .el-button {
    margin-bottom: 20px;
}
.promoter_content p {
    padding: 18px 0;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
}
.promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
}
.person_body {
    border: 1px solid #f5f5f5;
    height: 500px;
}
.person_tree {
    padding: 10px 12px 0 8px;
    width: 280px;
    height: 100%;
    border-right: 1px solid #f5f5f5;
}
.person_tree input {
    padding-left: 22px;
    width: 210px;
    height: 30px;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid #d5dadf;
    /* background: url(~@/assets/images/list_search.png) no-repeat 10px center; */
    background-size: 14px 14px;
    margin-bottom: 14px;
}
.tree_nav span {
    display: inline-block;
    padding-right: 10px;
    margin-right: 5px;
    max-width: 6em;
    color: #38adff;
    font-size: 12px;
    cursor: pointer;
    /* background: url(~@/assets/images/jiaojiao.png) no-repeat right center; */
}
.tree_nav span:last-of-type {
    background: none;
}
.person_tree ul,
.has_selected ul {
    height: 420px;
    overflow-y: auto;
}
.person_tree li {
    padding: 5px 0;
}
.person_tree li i {
    float: right;
    padding-left: 24px;
    padding-right: 10px;
    color: #3195f8;
    font-size: 12px;
    cursor: pointer;
    /* background: url(~@/assets/images/next_level_active.png) no-repeat 10px center; */
    border-left: 1px solid rgb(238, 238, 238);
}
.person_tree li a.active + i {
    color: rgb(197, 197, 197);
    /* background-image: url(~@/assets/images/next_level.png); */
    pointer-events: none;
}
.person_tree img {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
}
.has_selected {
    width: 276px;
    height: 100%;
    font-size: 12px;
}
.has_selected ul {
    height: 460px;
}
.has_selected p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;
}
.has_selected p a {
    float: right;
}
.has_selected ul li {
    margin: 11px 26px 13px 19px;
    line-height: 17px;
}
.has_selected li span {
    vertical-align: middle;
}
.has_selected li img:first-of-type {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
}
.has_selected li img:last-of-type {
    float: right;
    margin-top: 2px;
    width: 14px;
}
el-radio-group {
    padding: 20px 0;
}
.approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
}
.approver_content .el-radio,
.approver_some .el-radio,
.approver_self_select .el-radio {
    width: 27%;
    margin-bottom: 20px;
}
.copyer_content .el-checkbox {
    margin-bottom: 20px;
}
.el-checkbox__label {
    font-size: 12px;
}
.condition_content,
.copyer_content,
.approver_self_select,
.approver_manager,
.approver_content,
.approver_some {
    padding: 20px 20px 0;
}
.approver_manager p:first-of-type,
.approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
}

.approver_manager p {
    line-height: 32px;
}
.approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 12px;
    line-height: 16px;
    color: #f8642d;
}
.approver_self {
    padding: 28px 20px;
}
.selected_list {
    margin-bottom: 20px;
    line-height: 30px;
}
.selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
}
.selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
}
.approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
}
.condition_copyer .el-drawer__body select {
    position: absolute;
    top: 11px;
    right: 30px;
    width: 100px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content p.tip {
    margin: 20px 0;
    width: 510px;
    text-indent: 17px;
    line-height: 45px;
    background: rgba(241, 249, 255, 1);
    border: 1px solid rgba(64, 163, 247, 1);
    color: #46a6fe;
    font-size: 14px;
}
.condition_content ul {
    max-height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
}
.condition_content li > span {
    float: left;
    margin-right: 8px;
    width: 70px;
    line-height: 32px;
    text-align: right;
}
.condition_content li > div {
    display: inline-block;
    width: 370px;
}
.condition_content li:not(:last-child) > div > p {
    margin-bottom: 20px;
}
.condition_content li > div > p:not(:last-child) {
    margin-bottom: 10px;
}
.condition_content li > a {
    float: right;
    margin-right: 10px;
    margin-top: 7px;
}
.condition_content li select,
.condition_content li input {
    width: 100%;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li select + input {
    width: 260px;
}
.condition_content li select {
    margin-right: 10px;
    width: 100px;
}
.condition_content li p.selected_list {
    padding-left: 10px;
    border-radius: 4px;
    min-height: 32px;
    border: 1px solid rgba(217, 217, 217, 1);
}
.condition_content li p.check_box {
    line-height: 32px;
}
.condition_list .el-dialog__body {
    padding: 16px 26px;
}
.condition_list p {
    color: #666666;
    margin-bottom: 10px;
}
.condition_list p.check_box {
    margin-bottom: 0;
    line-height: 36px;
}
</style>