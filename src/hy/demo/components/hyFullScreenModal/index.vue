<template>
    <div>
        <el-dialog ref="dialog" v-dialogDrag1="{whetherCanFullScreen:false,title:title}" :class="'hyFullScreenModal'" :destroy-on-close="true" v-if='dialogVisible' :title="title" :visible.sync="dialogVisible" :width="width" :style="styleSelf" :before-close="closeHandle"
            :show-close="showClose" :top='modalTop' :modal-append-to-body="modalAppendToBody" :append-to-body="appendToBody" :close-on-click-modal="false" fullscreen>
            <div v-if="ifCustomTitle" slot="title" class="dialog-title">
                <slot name="title"></slot>
            </div>
            <div v-else slot="title" class="dialog-title">
                {{title}}
            </div>
            <div style="width:100%;margin:0;padding:0;box-sizing: border-box;height: calc(100vh - 60px);" :class="{'fusionVersionRouterView':$store.state.fusionVersion}">
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
 * 全屏弹窗组件，基于 hyNewModal 改造，专门用于全屏使用的弹窗场景
 *
 * 必填
 * @param { dialogVisible } 弹窗是否显示
 * @function closeHandle 关闭事件
 * @function sureHandle 确定事件
 */
/**
 * 选填
 * @param { title } 标题
 * @param { ifCancle } 是否显示取消按钮
 * @param { ifSure } 是否显示确定按钮
 * @param { ifCustomTitle } 是否使用自定义标题
 * @param { ifThird } 是否使用自定义footer
 * @param { width } 宽度（全屏模式下默认100%）
 * @param { showClose } 是否显示关闭按钮
 * @param { modalTop } 顶部距离
 * @param { modalAppendToBody } modal是否插入body
 * @param { appendToBody } 弹窗是否插入body
 * @param { styleSelf } 自定义样式
 */
export default {
    name: "hyFullScreenModal",
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
        title: {
            type: String,
            default: () => "",
        },
        modalTop: {
            type: String,
            default: () => "0px",
        },
        width: {
            type: String,
            default: () => "100%",
        },
        showClose: {
            type: Boolean,
            default: () => true,
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
        return {};
    },
    created() {},
    mounted() {
        this.$nextTick(() => {
            // 只操作当前弹窗实例的 body，避免影响其他弹窗
            const dialogEl = this.$refs.dialog?.$el;
            if (dialogEl) {
                const bodyEl = dialogEl.querySelector(".el-dialog__body");
                if (bodyEl) {
                    bodyEl.style.height = "calc(100vh - 60px)";
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

.hyFullScreenModal {
    /deep/ .el-dialog {
        margin: 0 !important;
        position: fixed !important;
        left: 0 !important;
        top: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        max-width: 100vw !important;
        max-height: 100vh !important;
        border-radius: 0 !important;

        .el-dialog__header {
            height: 48px;
            padding: 12px;
            border-bottom: 1px solid #e4e7ed;
            background: #fff;
            box-sizing: border-box;

            .el-dialog__title {
                font-weight: bold;
                font-size: 18px !important;
                line-height: 26px;
            }

            .el-dialog__headerbtn {
                top: 12px;
                right: 20px;
            }
        }

        .el-dialog__body {
            height: calc(100vh - 48px);
            padding: 0px;
            box-sizing: border-box;
            overflow: auto;
            box-sizing: border-box;
            padding: 0 12px;
        }

        .el-dialog__footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            padding: 10px 20px;
            background: #fff;
            border-top: 1px solid #e4e7ed;
            z-index: 10;

            button {
                width: 200px;
            }
        }
    }
}

.dialog-title {
    font-weight: bold;
    font-size: 18px;
}
</style>