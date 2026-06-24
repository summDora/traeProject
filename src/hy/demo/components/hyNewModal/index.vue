<template>
    <div>
        <el-dialog ref="dialog" v-dialogDrag1="{whetherCanFullScreen:whetherCanFullScreen,title,}" :class="smallModel?'hySmallModal':'hyModal'" :destroy-on-close="true" v-if='dialogVisible' :title="title" :visible.sync="dialogVisible" :width="width" :style="styleSelf"
            :before-close="closeHandle" :show-close="showClose" :top='modalTop' :modal-append-to-body="modalAppendToBody" :append-to-body="appendToBody" :close-on-click-modal="false">
            <div v-if="ifCustomTitle" slot="title" class="dialog-title">
                <slot name="title"></slot>
            </div>
            <div v-else slot="title" class="dialog-title">
                {{title}}
            </div>
            <div style="width:100%;margin:0;padding:0;box-sizing: border-box;height: 100%;" :class="{'fusionVersionRouterView':$store.state.fusionVersion}">
                <slot></slot>
            </div>
            <span v-if='ifCancle || ifSure' slot="footer">
                <el-button style="width:200px" v-if='ifCancle' @click="closeHandle">取 消</el-button>
                <el-button type="primary" style="width:200px" v-if='ifSure' @click="sureHandle">确 定</el-button>
            </span>
            <span slot="footer" v-else-if="ifThird">
                <slot name="footer"></slot>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 必填
 * @param { dialogVisible } 弹窗是否显示
 * @function closeHandle 关闭事件
 * @function sureHandle 确定事件
 * @function whetherCanFullScreen 是否展示全屏按钮
 */
/**
 * 选填
 * @param { title } 标题
 */
export default {
    name: "hyNewModal",
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false,
        },
        ifCancle: {
            type: Boolean,
            default: () => false,
        },
        ifSure: {
            type: Boolean,
            default: () => false,
        },
        ifCustomTitle: {
            type: Boolean,
            default: () => false,
        },
        ifThird: {
            type: Boolean,
            default: () => false,
        },
        whetherCanFullScreen: {
            type: Boolean,
            default: () => false,
        },
        title: {
            type: String,
            default: () => "",
        },
        smallModel: {
            type: Boolean,
            default: () => false,
        },
        modalTop: {
            type: String,
            default: () => "0px",
        },
        width: {
            type: String,
            default: () => "600px",
        },
        showClose: {
            type: Boolean,
            default: () => false,
        },
        modalAppendToBody: {
            type: Boolean,
            default: () => false,
        },
        appendToBody: {
            type: Boolean,
            default: () => false,
        },
        styleSelf: {
            type: String,
            default: () => "",
        },
    },
    data() {
        return {
            maxHeight: 0,
        };
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            // 只操作当前弹窗实例的 body，避免影响其他弹窗
            const dialogEl = this.$refs.dialog?.$el;
            if (dialogEl) {
                const bodyEl = dialogEl.querySelector(".el-dialog__body");
                if (bodyEl) {
                    const offsetHeight = document.body.offsetHeight;

                    let footerHeight = 0;
                    if (bodyEl.parentElement && bodyEl.parentElement.children) {
                        for (const child of bodyEl.parentElement.children) {
                            if (child._prevClass === "el-dialog__footer") {
                                footerHeight = child.offsetHeight;
                            }
                        }
                    }

                    bodyEl.style.maxHeight =
                        offsetHeight * 0.8 - footerHeight + "px";
                    this.maxHeight = bodyEl.style.maxHeight;
                    bodyEl.style.overflow = "auto";
                }
            }
        });
    },
    methods: {
        closeHandle() {
            this.$emit("closeHandle");
        },
        sureHandle() {
            this.$emit("sureHandle");
        },
    },
};
</script>

<style lang="less" scoped>
//融合版样式
@import "~@/pages/fusionVersionLayout/fusionVersion.less";

.hyModal {
    /deep/ .el-dialog {
        margin: 0 auto !important;
        position: absolute !important;
        left: 50%;
        transform: translateX(-50%) !important;
        top: 122px !important;
        .el-dialog__title {
            font-weight: bold;
            font-size: 20px !important;
        }
        .el-dialog__body {
            padding: 0px 20px 10px;
            box-sizing: border-box;
        }

        .el-dialog__footer {
            text-align: center;

            button {
                width: 200px;
            }
        }
    }
}

.hySmallModal {
    /deep/ .el-dialog {
        margin: 0 auto !important;
        position: absolute !important;
        // left: 50%;
        // transform: translateX(-50%) !important;;
        // top: 33% ;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        .el-dialog__title {
            font-weight: bold;
            font-size: 20px !important;
        }
        .el-dialog__body {
            padding: 0px 20px 10px;
            box-sizing: border-box;
        }

        .el-dialog__footer {
            text-align: center;

            button {
                width: 200px;
            }
        }
    }
}

.dialog-title {
    // float: left;
    font-weight: bold;
    font-size: 20px;
}
</style>
