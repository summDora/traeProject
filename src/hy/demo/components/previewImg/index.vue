<template>
    <div v-if="visible">
        <div :class="['preview-floating-container', { 'preview-fullscreen': isFullscreen, 'is-dragging': isContainerDragging }]" :style="containerStyle">
            <!-- 标题栏 - 可拖动浮窗 -->
            <div class="preview-header" @mousedown="handleContainerDragStart">
                <span class="preview-title">{{ title }}</span>
                <div class="preview-header-actions">
                    <!-- 全屏按钮 -->
                    <div class="header-action-btn" @click.stop="toggleFullscreen" :title="isFullscreen ? '退出全屏' : '全屏'">
                        <i v-if="isFullscreen" class="iconfont icontuichuquanping"></i>
                        <i v-else class="iconfont iconquanping"></i>
                    </div>
                    <!-- 关闭按钮 -->
                    <div class="header-action-btn" @click.stop="handleClose" title="关闭">
                        <i class="el-icon-close"></i>
                    </div>
                </div>
            </div>
            <!-- 图片预览区域 -->
            <div class="preview-dialog-content" @wheel.prevent="handleWheel" @mousedown="handleMouseDown" @dblclick="toggleFullscreen">
                <div class="preview-image-wrapper" :style="{
                    transform: 'translate(' + panX + 'px, ' + panY + 'px) scale(' + imageScale + ')',
                    transition: isDragging ? 'none' : 'transform 0.2s ease'
                }">
                    <img :src="imageUrl" alt="" class="preview-image">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PreviewImg",
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        imageUrl: {
            type: String,
            default: "",
        },
        width: {
            type: String,
            default: "60%",
        },
        title: {
            type: String,
            default: "业务蓝图预览",
        },
        // 初始是否全屏模式
        initialFullscreen: {
            type: Boolean,
            default: false,
        },
        // 是否强制全屏（用于子组件触发）
        forceFullscreen: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            imageScale: 1,
            panX: 0,
            panY: 0,
            isDragging: false,
            startX: 0,
            startY: 0,
            startPanX: 0,
            startPanY: 0,
            isFullscreen: false,
            // 浮窗拖拽相关
            isContainerDragging: false,
            containerStartX: 0,
            containerStartY: 0,
            containerOffsetX: 0,
            containerOffsetY: 0,
            // 浮窗位置（像素）
            containerTop: 0,
            containerLeft: 0,
            // 绑定的事件处理函数
            boundHandleMouseMove: null,
            boundHandleMouseUp: null,
            // 记录原始父节点和下一个兄弟节点，用于退出全屏时恢复
            originalParent: null,
            originalNextSibling: null,
        };
    },
    computed: {
        containerStyle() {
            if (this.isFullscreen) {
                return {
                    width: "100vw",
                    height: "100vh",
                    top: "0px",
                    left: "0px",
                    borderRadius: "0",
                    transform: "none",
                };
            }
            return {
                width: this.width,
                height: "80vh",
                top: this.containerTop + "px",
                left: this.containerLeft + "px",
                transform: "none",
                cursor: this.isContainerDragging ? "grabbing" : "default",
            };
        },
    },
    methods: {
        handleClose() {
            this.resetZoom();
            this.isFullscreen = false;
            this.$emit("close");
        },
        toggleFullscreen() {
            this.isFullscreen = !this.isFullscreen;
            // 等待 Vue 更新 DOM 后再移动元素
            this.$nextTick(() => {
                if (this.isFullscreen) {
                    this.moveToBody();
                } else {
                    this.restoreToOriginalPosition();
                    this.centerContainer();
                }
            });
        },
        // 将元素移动到body下实现真正的全屏（解决父弹窗限制问题）
        moveToBody() {
            const element = this.$el;
            if (!element) return;

            // 记录原始父节点和兄弟节点
            this.originalParent = element.parentNode;
            this.originalNextSibling = element.nextSibling;

            // 创建占位元素保持 Vue 的 DOM 结构
            this._placeholder = document.createElement("div");
            this._placeholder.style.display = "none";
            if (this.originalParent) {
                this.originalParent.insertBefore(
                    this._placeholder,
                    this.originalNextSibling
                );
            }

            // 将元素移动到 body
            document.body.appendChild(element);
        },
        // 恢复元素到原始位置
        restoreToOriginalPosition() {
            const element = this.$el;
            if (!element) return;

            // 移除占位元素
            if (this._placeholder && this._placeholder.parentNode) {
                this._placeholder.parentNode.removeChild(this._placeholder);
                this._placeholder = null;
            }

            // 将元素插回原位置
            if (this.originalParent) {
                if (
                    this.originalNextSibling &&
                    this.originalNextSibling.parentNode === this.originalParent
                ) {
                    this.originalParent.insertBefore(
                        element,
                        this.originalNextSibling
                    );
                } else {
                    this.originalParent.appendChild(element);
                }
            }

            this.originalParent = null;
            this.originalNextSibling = null;
        },
        // 计算容器宽度（像素）
        getContainerWidth() {
            const widthStr = this.width;
            if (widthStr.includes("%")) {
                const percent = parseFloat(widthStr);
                return (window.innerWidth * percent) / 100;
            }
            if (widthStr.includes("px")) {
                return parseFloat(widthStr);
            }
            return parseFloat(widthStr) || window.innerWidth * 0.6;
        },
        // 居中容器
        centerContainer() {
            const containerWidth = this.getContainerWidth();
            const containerHeight = window.innerHeight * 0.8;
            this.containerLeft = (window.innerWidth - containerWidth) / 2;
            this.containerTop = (window.innerHeight - containerHeight) / 2;
        },
        // 浮窗拖拽开始
        handleContainerDragStart(e) {
            if (this.isFullscreen) return;
            this.isContainerDragging = true;
            this.containerStartX = e.clientX;
            this.containerStartY = e.clientY;
            this.containerOffsetX = this.containerLeft;
            this.containerOffsetY = this.containerTop;
            // 添加全局事件监听
            document.addEventListener(
                "mousemove",
                this.handleContainerDragMove
            );
            document.addEventListener("mouseup", this.handleContainerDragEnd);
            e.preventDefault();
        },
        handleContainerDragMove(e) {
            if (!this.isContainerDragging) return;
            const deltaX = e.clientX - this.containerStartX;
            const deltaY = e.clientY - this.containerStartY;
            // 计算新位置（无边界限制）
            let newLeft = this.containerOffsetX + deltaX;
            let newTop = this.containerOffsetY + deltaY;
            this.containerLeft = newLeft;
            this.containerTop = newTop;
        },
        handleContainerDragEnd() {
            this.isContainerDragging = false;
            document.removeEventListener(
                "mousemove",
                this.handleContainerDragMove
            );
            document.removeEventListener(
                "mouseup",
                this.handleContainerDragEnd
            );
        },
        handleWheel(e) {
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            const newScale = Math.min(
                Math.max(0.1, this.imageScale + delta),
                5
            );
            this.imageScale = newScale;
            if (this.imageScale <= 1) {
                this.panX = 0;
                this.panY = 0;
            }
        },
        zoomIn() {
            const newScale = Math.min(this.imageScale + 0.2, 5);
            this.imageScale = newScale;
        },
        zoomOut() {
            const newScale = Math.max(this.imageScale - 0.2, 0.1);
            this.imageScale = newScale;
            if (this.imageScale <= 1) {
                this.panX = 0;
                this.panY = 0;
            }
        },
        resetZoom() {
            this.imageScale = 1;
            this.panX = 0;
            this.panY = 0;
        },
        handleMouseDown(e) {
            if (this.imageScale > 1) {
                // 先移除已有的监听器（防止重复绑定）
                this.removeImageDragListeners();

                this.isDragging = true;
                this.startX = e.clientX;
                this.startY = e.clientY;
                this.startPanX = this.panX;
                this.startPanY = this.panY;

                // 创建绑定的事件处理函数
                this.boundHandleMouseMove = this.handleMouseMove.bind(this);
                this.boundHandleMouseUp = this.handleMouseUp.bind(this);

                // 添加全局事件监听
                document.addEventListener(
                    "mousemove",
                    this.boundHandleMouseMove
                );
                document.addEventListener("mouseup", this.boundHandleMouseUp);
            }
        },
        handleMouseMove(e) {
            if (this.isDragging) {
                const deltaX = e.clientX - this.startX;
                const deltaY = e.clientY - this.startY;
                this.panX = this.startPanX + deltaX;
                this.panY = this.startPanY + deltaY;
            }
        },
        handleMouseUp() {
            this.isDragging = false;
            this.removeImageDragListeners();
        },
        // 移除图片拖动的事件监听器
        removeImageDragListeners() {
            if (this.boundHandleMouseMove) {
                document.removeEventListener(
                    "mousemove",
                    this.boundHandleMouseMove
                );
                this.boundHandleMouseMove = null;
            }
            if (this.boundHandleMouseUp) {
                document.removeEventListener(
                    "mouseup",
                    this.boundHandleMouseUp
                );
                this.boundHandleMouseUp = null;
            }
        },
    },
    watch: {
        visible(val) {
            if (val) {
                // 打开时根据 initialFullscreen 或 forceFullscreen 决定是否全屏
                this.$nextTick(() => {
                    if (this.initialFullscreen || this.forceFullscreen) {
                        this.isFullscreen = true;
                        // 延迟移动确保 DOM 渲染完成
                        this.$nextTick(() => {
                            this.moveToBody();
                        });
                    } else {
                        this.centerContainer();
                    }
                });
            } else {
                this.resetZoom();
                // 关闭时恢复位置
                if (this.isFullscreen) {
                    this.restoreToOriginalPosition();
                }
                this.isFullscreen = false;
            }
        },
    },
    beforeDestroy() {
        this.restoreToOriginalPosition();
        document.removeEventListener("mousemove", this.handleContainerDragMove);
        document.removeEventListener("mouseup", this.handleContainerDragEnd);
        this.removeImageDragListeners();
    },
};
</script>

<style scoped lang="less">
.preview-floating-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: flex-start;
}

.preview-floating-container {
    position: fixed;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 999999;
    transition: border-radius 0.3s ease, box-shadow 0.3s ease;

    &.is-dragging {
        transition: none;
    }

    &.preview-fullscreen {
        border-radius: 0;
        z-index: 1000000;
    }
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    min-height: 40px;
    cursor: move;
    user-select: none;

    .preview-title {
        font-weight: bold;
        font-size: 18px;
        color: #303133;
    }

    .preview-header-actions {
        display: flex;
        align-items: center;
        gap: 8px;

        .header-action-btn {
            width: 32px;
            height: 32px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 4px;
            cursor: pointer;
            color: #606266;
            transition: all 0.2s;

            &:hover {
                background-color: #f5f7fa;
                color: #409eff;
            }

            i {
                font-size: 16px;
            }
        }
    }
}

.preview-dialog-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background-color: #f5f7fa;
    overflow: hidden;
    position: relative;
    cursor: grab;
    box-sizing: border-box;

    &:active {
        cursor: grabbing;
    }

    .preview-image-wrapper {
        transform-origin: center center;
        will-change: transform;

        .preview-image {
            width: 100%;
            object-fit: contain;
            user-select: none;
            -webkit-user-drag: none;
            max-height: 100%;
        }
    }
}
</style>
