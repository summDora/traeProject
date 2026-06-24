<template>
    <div>
        <div v-if="!$store.state.fusionVersion" class="new-buttons">
            <div class='btn' v-for='(item, index) in buttonsData' size='small' :key='index' @click='selectButtons(item)'>
                <template v-if="item.isSlot">
                    <slot v-if="item.isSlot" :name="item.slotName"></slot>
                </template>
                <el-button v-else-if="item.icon && item.icon.startsWith('el-icon')" size="small" :icon="item.icon" class='btn el-btn' :type="item.type ?item.type:'primary' " @click='selectButtons(item)'>
                    {{item.text}}
                </el-button>
                <template v-else>
                    <i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>
                    {{item.text}}
                </template>
            </div>
            <!-- <i class="iconfont" :class="item.icon" :style="{'color':item.color}"></i>
          {{item.text}}</div>
        <el-upload
          v-if="ifNeedUpload"
				 	style="display:inline-block;margin-left: 10px;"
					ref="upload"
					action=""
          :show-file-list="false"
					:file-list="fileList"
					:on-change="fileChange"
					:on-remove="fileRemove"
					:limit="1"
					:before-upload="beforeUpload"
					:on-exceed="fileExceed"
					:auto-upload="true"
				>
				  <el-button size="small" slot="trigger" icon="el-icon-upload2" type="primary">导入</el-button>
				</el-upload>
        <slot></slot> -->
        </div>
        <div v-else class="fusionButtons">
            <div v-for='(item, index) in buttonsData' :key='index'>
                <template v-if="item.isSlot">
                    <slot v-if="item.isSlot" :name="item.slotName"></slot>
                </template>
                <el-button v-else-if="item.icon && item.icon.startsWith('el-icon')" size="small" :icon="item.icon" class='btn el-btn' :type="item.type ?item.type:'primary' " @click='selectButtons(item)'>
                    {{item.text}}
                </el-button>
                <el-button v-else size="small" class='btn' :style="{'background':'#007873','color':'white !important'}" @click='selectButtons(item)'>
                    {{item.text}}
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @param {buttonsData} 按钮组数据 {id:0,text:'content'} id为按钮唯一ID值 text为按钮显示文本(不区分选中按钮传相同的id值)
 * @param {selectId} 默认被选中按钮
 * @function selectButtons(e) 选择按钮事件 e为选择按钮数据
 */
export default {
    name: "hyNewButtons",
    props: {
        buttonsData: {
            type: Array,
            default: () => [],
        },
        selectId: {
            type: Number,
            default: () => 0,
        },
        fileList: {
            type: Array,
            default: () => [],
        },
        ifNeedUpload: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            mySelectId: this.selectId,
        };
    },
    created() {
        console.log(
            this.$store.state.fusionVersion,
            "fusionVersionfusionVersionfusionVersion"
        );
        if (
            this.buttonsData.length > 0 &&
            this.buttonsData[0].id !== undefined
        ) {
            if (!isNaN(this.buttonsData[0].id)) {
                this.mySelectId = this.buttonsData[0].id;
            }
        }
    },
    methods: {
        selectButtons(e) {
            this.mySelectId = e.id;
            this.$emit("selectButtons", e);
        },
        fileChange(file, fileList) {
            this.$emit("fileChange", file, fileList);
        },
        fileRemove(file, fileList) {
            this.$emit("fileRemove", file, fileList);
        },
        beforeUpload(file) {
            this.$emit("beforeUpload", file);
        },
        fileExceed(file, fileList) {
            this.$emit("fileExceed", file, fileList);
        },
    },
    watch: {
        selectId(val) {
            this.mySelectId = val;
        },
    },
};
</script>

<style lang="less" scoped>
.new-buttons {
    display: flex;
    justify-content: flex-end;
    /deep/ .btn {
        display: flex;
        align-items: center;
    }

    div {
        border: 0;
        cursor: pointer;
        font-size: 14px;
        color: #222734;
        transition: color ease 0.5s;

        &:hover {
            color: #298bf5;
        }

        & + div {
            margin-left: 24px;
        }
        i {
            // margin-right: 5px;
        }
    }
}

.fusionButtons {
    display: flex;
    justify-content: flex-end;
    div {
        & + div {
            margin-left: 10px;
        }
    }
}
/deep/ .el-btn.el-button--default {
    border-color: #007873;
    background: #fff;
    color: #222734;
    i {
        color: #222734 !important;
    }
}
/deep/ .el-btn.el-button--primary {
    background-color: #007873 !important;
    border-color: #007873 !important;
    border-radius: 6px;
    i {
        color: #fff !important;
    }
}
/deep/ .el-btn .el-button [class*="el-icon-"] + span {
    margin-left: 0 !important;
}
</style>
