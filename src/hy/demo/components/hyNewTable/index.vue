<template>
    <div class="hy-table" :class="tableClassName">
        <el-table v-bind="$attrs" v-set-id class="hy-table-content" style="width: 100%;" :stripe="stripe" ref="table" :empty-text="emptyText" v-loading="loadingData" v-tableloadmore="tableloadmore" element-loading-text="请稍等片刻" element-loading-spinner element-loading-background
            :row-class-name="rowClassName ? combineRowClassName : (tableRowClassNameColor ===true?tableRowClassName:tableSelectRowClassName)" :fit="true" :data="formatData" :row-style="showRow" :row-key="rowKey" :tree-props="treeProps" :header-cell-style="headerCellStyle"
            :header-row-style="headerRowStyle" header-cell-class-name="table-header" :cell-class-name="noNeedChildCheckBox?cellcb:''" :cell-style="cellStyle" :size="size" :default-sort="defaultSort" :default-expand-all="defaultExpandAll" :height="height" @cell-click="cellClick"
            @cell-dblclick="cellDbclick" @row-click="rowClick" @row-dblclick="rowDblclick" @select="handleSelect" @select-all="handleAllSelect" @current-change="currentChange" @selection-change="handleSelectionChange" @expand-change="handleExpandChange" @sort-change="sortChange"
            :border="true" :span-method="needSpanMethod ? spanMethod : () => ''" :highlight-current-row="highlightCurrentRow" :show-summary="showSummary" @header-dragend="headerDragend">
            <!-- 是否多选 -->
            <el-table-column type="selection" :selectable="selectable" width="55" align="center" v-if="ifHaveCheckBox"></el-table-column>
            <!-- 比对结果 -->
            <el-table-column v-if="ifHaveComparison" width="65" align="center" label="结果" :fixed="true">
                <template slot-scope="scope">
                    <div class="comparisonCss" :style="{'background':comparison(scope.row)?'#73be46':'#d9001b'}"></div>
                </template>
            </el-table-column>
            <!-- 是否单选 -->
            <el-table-column class="radioCss" lable width="55" v-if="ifHaveRadio" :fixed="true">
                <template slot-scope="scope">
                    <el-radio :label="scope.$index" v-model="radio" @click.native.prevent @change.native.prevent="getRadio(scope.row,radio)">&nbsp;
                    </el-radio>
                </template>
            </el-table-column>
            <!-- 是否显示序列 -->
            <el-table-column v-if="ifHaveIndex" width="65" align="center" label="序号" :fixed="true">
                <template slot-scope="scope">
                    <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <!-- 是否展开 -->
            <el-table-column width="150" v-if="ifIsExpand&&expandCloumns.length===0">
                <template slot-scope="scope">
                    <span class="ms-tree-space" v-for="space in scope.row._level" :key="space"></span>
                    <span class="tree-ctrl" v-if="iconShow(0, scope.row)" @click="toggleExpanded(scope.$index)">
                        <i v-if="!scope.row._expanded" class="el-icon-plus pointer"></i>
                        <i v-else class="el-icon-minus pointer"></i>
                    </span>
                    {{scope.$index}}
                </template>
            </el-table-column>
            <el-table-column v-if="ifIsExpand&&expandCloumns.length>0" v-for="(column, index) in expandCloumns" :key="column.value" :label="column.text" :width="column.width">
                <template slot-scope="scope">
                    <span v-if="index === 0" v-for="space in scope.row._level" class="ms-tree-space" :key="space"></span>
                    <span class="tree-ctrl" v-if="iconShow(index,scope.row)" @click="toggleExpanded(scope.$index)">
                        <i v-if="!scope.row._expanded" class="el-icon-plus pointer"></i>
                        <i v-else class="el-icon-minus pointer"></i>
                    </span>
                    {{scope.row[column.value]}}
                </template>
            </el-table-column>
            <!-- table数据 -->
            <template v-for="(item) in column">
                <el-table-column v-if="item.slot" :key="getynamicKey(item.key)" class-name="dropColunm" :align="item.align || 'left'" :label="item.label" :sortable="item.sortable || false" :sort-method="item.sortMethod" :min-width="item.width" :width="item.baseWidth">
                    <template slot-scope="scope">
                        <slot :name="item.slot" :row="scope.row"></slot>
                    </template>
                </el-table-column>
                <el-table-column v-if="item.isLastSlot" :key="getynamicKey(item.key)" class-name="dropColunm" :label="item.label" :prop="item.key" :align="item.align || 'center'" :sortable="item.sortable || false" :resizable="false" :sort-method="item.sortMethod"
                    :min-width="item.width" :width="item.baseWidth" :fixed="item.fixed ? 'right' : '' " :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true">
                    <template v-if="item.children">
                        <multi-column v-for="item in item.children" :key="item.key" :col="item"></multi-column>
                    </template>
                    <template slot-scope="scope">
                        <slot v-if="item.isLastSlot" :data="scope.row" :scopeData="scope" :name="item.slotName" :index="scope.$index" :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true" :align="item.align ? item.align : 'center'"></slot>

                        <el-popover v-else-if="scope.row.hasPopover && item.hasPopover" placement="right-end" :visible-arrow="false" trigger="hover" offset="0" :popper-class="scope.row.index + item.key + 'popover'" :content="scope.row[item.key]">
                            <span slot="reference" :class="scope.row.index + item.key">{{ scope.row[item.key].toString().trim() ? scope.row[item.key] : '--' }}</span>
                        </el-popover>

                        <div class="elTooltipCss" v-else-if="scope.row.data">
                            <span :class="scope.row.data[item.startPosx].posx + 'and' + scope.$index" v-if="scope.row.data[item.startPosx].success">{{ precisionProcessing(scope.row.data[item.startPosx], item.dataPrecision) }}</span>
                            <!-- <el-tooltip  v-else placement="top" trigger="hover" :content="scope.row.data[item.startPosx].message"> -->
                            <span :class="scope.row.data[item.startPosx].posx + 'and' + scope.$index" style="color: red;"
                                v-if="scope.row.data[item.startPosx].displayValue === undefined || scope.row.data[item.startPosx].displayValue === null || scope.row.data[item.startPosx].displayValue==='' || scope.row.data[item.startPosx].displayValue.toString().trim() === ''">--</span>
                            <span v-else :class="scope.row.data[item.startPosx].posx + 'and' + scope.$index" style="color: red;">{{ precisionProcessing(scope.row.data[item.startPosx], item.dataPrecision) }}</span>
                            <!-- </el-tooltip> -->
                        </div>

                        <span :class="scope.row.index + item.key" v-else-if="scope.row[item.key] === undefined || scope.row[item.key] === null || scope.row[item.key] === ''">--</span>
                        <span v-else-if="item.dataPrecision" :class="scope.row.index + item.key + 5">{{ Number(scope.row[item.key]).toFixed(Number(item.dataPrecision)) }}</span>
                        <span v-else :class="scope.row.index + item.key">{{ scope.row[item.key] }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-else :key="getynamicKey(item.key)" class-name="dropColunm" :label="item.label" :prop="item.key" :align="item.align || 'center'" :sortable="item.sortable || false" :resizable="true" :sort-method="item.sortMethod" :min-width="item.width"
                    :width="item.baseWidth" :fixed="item.fixed" :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true">
                    <template v-if="item.children">
                        <multi-column v-for="i in item.children" :key="i.key" :col="i">
                            <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
                                <slot v-if="i.isSlot" :data="JSON.stringify(scope.data)" :scopeData="slot" :name="i.slotName" :index="scope.index" :show-overflow-tooltip="true" :align="item.align ? item.align : 'center'"></slot>
                            </template>
                        </multi-column>
                    </template>
                    <!-- <template slot-scope="scope">
            <span v-if="scope.row[item.key]===undefined||scope.row[item.key]===null||scope.row[item.key]===''||scope.row[item.key].toString().trim()==''">--</span>
            <slot v-if="item.isSlot" :data="scope.row" :scopeData="scope" :name="item.slotName"
                :show-overflow-tooltip="true"
                :align="item.align ? item.align : 'center'"></slot>
            <el-popover
              placement="top"
              trigger="hover"
              v-else-if='scope.row[item.key].toString().trim().length>showLen&&showLen>0&&showLen!=0'
              :content="scope.row[item.key].toString()"
            >
            
              <span slot="reference">{{ `${scope.row[item.key].toString().trim().slice(0,showLen)}...` }}</span>
            </el-popover>
            <span v-else :style="getTextColor(scope)">{{ scope.row[item.key] }}</span>
          </template>-->
                    <template slot-scope="scope">
                        <slot v-if="item.isSlot" :data="scope.row" :scopeData="scope" :name="item.slotName" :index="scope.$index" :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true" :align="item.align ? item.align : 'center'"></slot>

                        <el-popover v-else-if="scope.row.hasPopover && item.hasPopover" placement="right-end" :visible-arrow="false" trigger="hover" offset="0" :popper-class="scope.row.index + item.key + 'popover'" :content="scope.row[item.key]">
                            <span slot="reference" :class="scope.row.index + item.key">{{ scope.row[item.key].toString().trim() ? scope.row[item.key] : '--' }}</span>
                        </el-popover>

                        <div class="elTooltipCss" v-else-if="scope.row.data">
                            <span :class="scope.row.data[item.startPosx].posx + 'and' + scope.$index" v-if="scope.row.data[item.startPosx].success">{{ precisionProcessing(scope.row.data[item.startPosx], item.dataPrecision) }}</span>
                            <!-- <el-tooltip  v-else placement="top" trigger="hover" :content="scope.row.data[item.startPosx].message"> -->
                            <span :class="scope.row.data[item.startPosx].posx + 'and' + scope.$index" style="color: red;"
                                v-if="scope.row.data[item.startPosx].displayValue === undefined || scope.row.data[item.startPosx].displayValue === null || scope.row.data[item.startPosx].displayValue==='' || scope.row.data[item.startPosx].displayValue.toString().trim() === ''">--</span>
                            <span v-else :class="scope.row.data[item.startPosx].posx + 'and' + scope.$index" style="color: red;">{{ precisionProcessing(scope.row.data[item.startPosx], item.dataPrecision) }}</span>
                            <!-- </el-tooltip> -->
                        </div>

                        <span :class="scope.row.index + item.key" v-else-if="scope.row[item.key] === undefined || scope.row[item.key] === null || scope.row[item.key] === ''">--</span>
                        <span v-else-if="item.dataPrecision" :class="scope.row.index + item.key + 5">{{ Number(scope.row[item.key]).toFixed(Number(item.dataPrecision)) }}</span>
                        <span style="color:#409eff;cursor:pointer" v-else-if="item.clickColor">{{ scope.row[item.key] }}</span>
                        <span v-else :class="scope.row.index + item.key">{{ scope.row[item.key] }}</span>
                    </template>
                </el-table-column>
            </template>
            <!-- 修改删除操作 -->
            <el-table-column label="操作" align="center" width="320" :fixed="ifFixed ? 'right' : ''" v-if="isHaveEdit||isHaveDelete||isHaveSuspend||isHaveRecovery||isHaveAdd||isHaveChangePass||isHaveBid||isHaveBidEditHandle||isHaveExport">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" icon="el-icon-edit-outline" v-if="isHaveEdit" @click.stop="editHandle(scope)">
                        编辑
                    </el-button>
                    <i class="el-icon-delete pointer" v-if="isHaveDelete" @click.stop="deleteHandle(scope)"></i>
                    <i class="el-icon-circle-plus-outline pointer" v-if="isHaveAdd&&!scope.row.closeAdd" @click.stop="addHandle(scope)"></i>
                    <i class="el-icon-edit-outline pointer" v-if="isHaveChangePass" @click.stop="changePassHandle(scope)"></i>
                    <span class="text pointer" v-if="isHaveSuspend&&!scope.row.ifZ" @click.stop="suspendHandle(scope)">暂停</span>
                    <span class="text pointer" v-if="isHaveRecovery&&scope.row.ifZ" @click.stop="recoveryHandle(scope)">恢复</span>
                    <el-button size="mini" type="primary" icon="el-icon-download" v-if="isHaveExport" @click.stop="exportHandle(scope)">
                        导出
                    </el-button>
                    <span class="text pointer" v-if="isHaveBid" @click.stop="bidHandle(scope)">查看标段信息</span>
                    <span class="text pointer" v-if="isHaveBidEditHandle" @click.stop="bidEditHandle(scope)">维护</span>
                </template>
            </el-table-column>
            <el-table-column v-if="columControl" width="50">
                <template #header="{ row }">
                    <el-button icon="el-icon-menu" size="mini" circle @click="dialogVisible = !dialogVisible"></el-button>
                </template>
            </el-table-column>
            <slot></slot>
        </el-table>
        <el-dialog title="字段显隐控制" :visible.sync="dialogVisible" class="dialogCustom" width="20%">
            <el-checkbox-group v-model="selection">
                <el-checkbox v-for="(check, index) in initColum" :key="index" :label="check.key" style="display: block;margin: 10px;">{{check.label}}
                </el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="handleConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
/**
 * 必填
 * @param {tableData} 表格数据
 * @param {column} 表格头数据{key:'',label:'',slot: ''} key代表唯一ID值,label代表名称, slot代表作用域插槽name，作用域传参{row}为当前行数据
 */

/**
 * 选填
 * @param {height} 表格高度
 * @param {showLen} 表格内容显示多长(超过改长度的显示...)
 * @param {isHaveEdit} 是否有修改
 * @function editHandle(scope) 修改事件,scope为修改行数据
 * @param {isHaveDelete} 是否有删除
 * @function deleteHandle(scope) 删除事件,scope为删除行数据
 * @param {isHaveAdd} 是否有添加
 * @function addHandle(scope) 添加事件,scope为添加行数据
 * @param {isHaveChangePass} 是否有修改密码
 * @function changePassHandle(scope) 修改密码事件,scope为添加行数据
 * @param {isHaveSuspend} 是否有暂停
 * @function suspendHandle(scope) 暂停事件,scope为暂停行数据
 * @param {isHaveSuspend} 是否有恢复
 * @function recoveryHandle(scope) 恢复事件,scope为恢复行数据
 * @param {ifHaveCheckBox} 是否显示多选
 * @function handleSelectionChange(val) 多选事件 val为选中项数据
 * @param {ifHaveRadio} 是否显示单选
 * @function getRadio(row) 单选时间 row为选中数据
 * @param {ifIsExpand} 是否展示tableTree
 * @function handleExpandChange(val) 展开事件 val为展开项数据
 * @param {ifHaveIndex} 是否显示序列号
 * @param {dropColumn} 表格头是否可拖拽
 * @function columnDrop(column) 表格头拖拽后执行, column新的列
 * @param {dropRow} 表格行是否可拖拽
 * @function rowDrop(tableData) 表格行拖拽后执行, tableData新的表格数据出口
 * @param {highlightCurrentRow} 是否高亮当前行
 */
import treeToArray from "./eval";
import multiColumn from "./column.vue";
// import Sortable from "sortablejs";
export default {
    name: "hyNewTable",
    directives: {
        setId(el, binding, vnode) {
            vnode.context.$nextTick(() => {
                let aTh = el.getElementsByTagName("th");
                let thArr = Array.from(aTh);
                thArr.forEach((th, idx) => {
                    th.dataset.id = idx;
                });
            });
        },
    },
    props: {
        tableData: {
            type: Array,
            default: () => [],
        },
        stripe: {
            type: Boolean,
            default: () => true,
        },
        column: {
            type: Array,
            default: () => [],
        },
        size: {
            type: String,
            default: () => "medium ",
        },
        expandCloumns: {
            type: Array,
            default: () => [{ width: "100" }],
        },
        isHaveEdit: {
            type: Boolean,
            default: () => false,
        },
        isHaveDelete: {
            type: Boolean,
            default: () => false,
        },
        isHaveAdd: {
            type: Boolean,
            default: () => false,
        },
        isHaveChangePass: {
            type: Boolean,
            default: () => false,
        },
        isHaveSuspend: {
            type: Boolean,
            default: () => false,
        },
        isHaveRecovery: {
            type: Boolean,
            default: () => false,
        },
        isHaveExport: {
            type: Boolean,
            default: () => false,
        },
        isHaveBid: {
            type: Boolean,
            default: () => false,
        },
        isHaveBidEditHandle: {
            type: Boolean,
            default: () => false,
        },
        showLen: {
            type: Number,
            default: () => 0,
        },
        ifHaveCheckBox: {
            type: Boolean,
            default: () => false,
        },
        ifHaveComparison: {
            type: Boolean,
            default: () => false,
        },
        comparisonValue: {
            type: String,
            default: () => "DL",
        },
        ifHaveRadio: {
            type: Boolean,
            default: () => false,
        },
        notHaveRadioDefaultSelect: {
            type: Boolean,
            default: () => false,
        },
        notHaveRadioDefaultSelectIndex: {
            type: String,
            default: () => "",
        },
        ifIsExpand: {
            type: Boolean,
            default: () => false,
        },
        tableRowClassNameColor: {
            type: Boolean,
            default: false,
        },
        //树形表格多选/子级隐复选框
        noNeedChildCheckBox: {
            type: Boolean,
            default: false,
        },
        ifHaveIndex: {
            type: Boolean,
            default: () => false,
        },
        evalFunc: Function,
        evalArgs: Array,
        expandAll: {
            type: Boolean,
            default: false,
        },
        rowKey: {
            type: String,
            default: "id",
        },
        treeProps: {
            type: Object,
            default: () => ({
                children: "children",
                hasChildren: "hasChildren",
            }),
        },
        columControl: {
            type: Boolean,
            default: false,
        },
        defaultSort: {
            type: Object,
            default: () => ({}),
        },
        defaultExpandAll: {
            type: Boolean,
            default: false,
        },
        dropColumn: {
            type: Boolean,
            default: false,
        },
        dropRow: {
            type: Boolean,
            default: false,
        },
        isExcel: {
            type: Boolean,
            default: false,
        },
        height: [String, Number],
        border: {
            type: Boolean,
            default: false,
        },
        ifFixed: {
            type: Boolean,
            default: false,
        },
        // 是否需要合并单元格
        needSpanMethod: {
            type: Boolean,
            default: false,
        },
        needMergeSpan: {
            type: Array,
        },
        needMergeSpanMeet: {
            type: Array,
        },
        meticComparisonModelRowMerge: {
            type: Boolean,
            default: false,
        },
        //同类工程匹配结果行颜色改变
        matchingResultsProjectRowMerge: {
            type: Boolean,
            default: false,
        },
        //使用的页面
        pageType: {
            type: String,
            default: () => "",
        },
        //无数据提示
        emptyText: {
            type: String,
            default: () => "暂无数据",
        },
        //是否需要表格加载
        loadingData: {
            type: Boolean,
            default: false,
        },
        highlightCurrentRow: {
            type: Boolean,
            default: false,
        },
        showSummary: {
            type: Boolean,
            default: false,
        },
        page: {
            type: Number,
            default: () => 1,
        },
        pageSize: {
            type: Number,
            default: () => 10,
        },
        // 外部传入的行样式函数
        rowClassName: {
            type: Function,
            default: null,
        },
        tableClassName: {  // 表格名字
            type: String,
            default: ''
        }
    },

    components: {
        multiColumn,
    },
    data() {
        return {
            radio: 0,
            a: "",
            dialogVisible: false,
            selection: [],
            initColum: [],
            dropColCount: 0,
            mergeSpan: [],
            documentObj: null,
            selectRow: [],
            selectData: [],
        };
    },
    computed: {
        // 格式化数据源
        formatData: function () {
            if (this.ifIsExpand) {
                let tmp;
                if (!Array.isArray(this.tableData)) {
                    tmp = [this.tableData];
                } else {
                    tmp = this.tableData;
                }
                const func = this.evalFunc || treeToArray;
                const args = this.evalArgs
                    ? Array.concat([tmp, this.expandAll], this.evalArgs)
                    : [tmp, this.expandAll];
                return func.apply(null, args);
            } else {
                return this.tableData;
            }
        },
        columnMap() {
            let newColumn = [];
            this.initColum.forEach((c) => {
                if (this.selection.includes(c.key)) {
                    newColumn.push(c);
                }
            });
            return newColumn;
        },
    },
    watch: {
        tableData() {
            if (this.notHaveRadioDefaultSelect) {
                if (!this.notHaveRadioDefaultSelectIndex) {
                    this.radio = "";
                } else {
                    this.radio = Number(this.notHaveRadioDefaultSelectIndex);
                }
            } else {
                this.radio = 0;
            }
            if (this.tableData.length && this.needSpanMethod) {
                for (let i of this.needMergeSpan) {
                    this[`spanArr_${i}`] = [];
                    this[`spanArrIndex_${i}`] = null;
                    this.getSpanArr(
                        this.tableData,
                        this[`spanArr_${i}`],
                        this[`spanArrIndex_${i}`],
                        i
                    );
                }
            }
            this.$nextTick(() => {
                this.$refs.table.doLayout();
            });
        },
        selectData(data) {
            this.selectRow = [];
            // console.log(data)
            if (data.length > 0) {
                data.forEach((item, index) => {
                    //如果是不需要子级复选框的树形列表
                    if (this.noNeedChildCheckBox) {
                        this.selectRow.push(item.noNeedChildCheckBoxNum);
                        if (item.children) {
                            for (let child of item.children) {
                                this.selectRow.push(
                                    child.noNeedChildCheckBoxNum
                                );
                            }
                        }
                    } else {
                        this.selectRow.push(this.tableData.indexOf(item));
                    }
                });
                // console.log(this.selectRow)
            }
        },
    },
    mounted() {
        if (this.needSpanMethod) {
            for (let i of this.needMergeSpan) {
                this[`spanArr_${i}`] = [];
                this[`spanArrIndex_${i}`] = null;
            }
            this.mergeSpan = this.m_copy(this.needMergeSpan);
        }
        this.initColum = this.m_copy(this.column);
        this.selection = this.column.map((c) => c.key);
        this.rowDrop();
        this.columnDrop();
        // this.updateNiceScroll();
    },
    updated() {
        setTimeout(() => {
            this.rowDrop();
            this.columnDrop();
        }, 20);
    },
    methods: {
        // updateNiceScroll() {
        //   this.$nextTick(() => {
        //     let elTableHeader = document.querySelector(".el-table__header-wrapper");
        //     if (this.needUpdateTable) {
        //       elTableHeader = document.querySelector(
        //         `#${this.needUpdateTable} .el-table__header-wrapper`
        //       );
        //     }
        //     if (elTableHeader) {
        //       const a = elTableHeader.clientHeight;
        //       let elBody = document.querySelector(".el-table__body-wrapper");
        //       if (this.needUpdateTable) {
        //         elBody = document.querySelector(
        //           `#${this.needUpdateTable} .el-table__body-wrapper`
        //         );
        //       }
        //       let el = this.$jquery(".el-table__body-wrapper");
        //       if (this.needUpdateTable) {
        //         el = this.$jquery(
        //           `#${this.needUpdateTable} .el-table__body-wrapper`
        //         );
        //       }
        //       const height = this.clientHeight - a - 1;
        //       elBody.style.cssText = `height : ${height}px`;
        //       el.niceScroll({
        //         cursoropacitymin: 0,
        //         cursoropacitymax: 1,
        //         cursorcolor: "rgba(66,66,66,.6)",
        //         cursorwidth: "10px",
        //         zindex: 50,
        //         scrollspeed: 20,
        //         mousescrollstep: 20,
        //         boxzoom: false
        //       });
        //     }
        //     if (this.needListenScroll) {
        //       let el = this.$jquery(".el-table__body-wrapper");
        //       if (this.needUpdateTable) {
        //         el = this.$jquery(
        //           `#${this.needUpdateTable} .el-table__body-wrapper`
        //         );
        //       }
        //       el.getNiceScroll(0).scrollend(e => {
        //         if (el.getNiceScroll(0).page.maxh === e.current.y) {
        //           this.$emit("niceScrollEnd", e);
        //         }
        //       });
        //     }
        //   });
        // },

        getTextColor(scope) {
            // console.log('scope',scope)
            return {};
        },
        getynamicKey(key) {
            return `${key}${this.dropColCount}`;
        },
        handleConfirm() {
            this.dialogVisible = !this.dialogVisible;
            this.$emit("update:column", this.columnMap);
        },
        cellClick(row, colum, cell, event) {
            this.$emit("cellClick", row, colum, cell, event);
        },
        selectable(row, index) {
            //多级列表子级禁用复选框
            if (this.noNeedChildCheckBox) {
                if (row.children) {
                    row.isDisable = false;
                } else {
                    row.isDisable = true;
                }
            }

            if (row.isDisable) {
                return false;
            } else {
                return true;
            }
        },
        cellDbclick(row, column, cell, event) {
            this.$emit("cellDbclick", row, column, cell, event);
        },
        rowClick(e, i, colum) {
            // console.log(this.$refs.table)
            const index = this.formatData.indexOf(e);
            if (e.isDisable) {
                return;
            }
            this.radio = index;
            this.$refs.table.toggleRowSelection(e);
            this.$emit("rowClick", e, i, colum);
        },
        rowDblclick(e, i) {
            this.$emit("rowDblclick", e, i);
        },
        handleSelect(selection, row) {},
        handleAllSelect(selection) {
            // console.log(selection)
        },

        tableSelectRowClassName({ row, rowIndex }) {
            // return row.className
            if (row.num && row.noNeedChildCheckBoxNum && !this.stripe) {
                if (row.num % 2) {
                    return "";
                } else {
                    return "noNeedChildRowClass";
                }
            }
        },

        currentChange(currentRow, oldCurrentRow) {
            // this.$refs.table.toggleRowSelection(currentRow,true);
            // this.$refs.table.toggleRowSelection(oldCurrentRow,false);
        },

        editHandle(scope) {
            this.$emit("editHandle", scope);
        },
        tableRowClassName({ row, rowIndex }) {
            if (row.status === "评审中" || row.isPs == 0) {
                return "hasYellow";
            } else {
                if (rowIndex % 2) {
                    return "hasBlue";
                } else {
                    return "hasWhite";
                }
            }
        },
        // 合并外部传入的行样式与内部行样式
        combineRowClassName({ row, rowIndex }) {
            let className = "";
            // 调用外部传入的 rowClassName
            if (this.rowClassName) {
                const externalClass = this.rowClassName({ row, rowIndex });
                if (externalClass) {
                    className += externalClass;
                }
            }
            // 调用内部默认样式
            if (row.status === "评审中" || row.isPs == 0) {
                className += (className ? " " : "") + "hasYellow";
            } else {
                if (rowIndex % 2) {
                    className += (className ? " " : "") + "hasBlue";
                } else {
                    className += (className ? " " : "") + "hasWhite";
                }
            }
            return className;
        },

        deleteHandle(scope) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
                customClass: this.$store.state.fusionVersion
                    ? "fusionVersionMessageBox"
                    : "",
            })
                .then(() => this.$emit("deleteHandle", scope))
                .catch(() => {
                    return;
                });
        },
        addHandle(scope) {
            this.$emit("addHandle", scope);
        },
        changePassHandle(scope) {
            this.$emit("changePassHandle", scope);
        },
        suspendHandle(scope) {
            this.$emit("suspendHandle", scope);
        },
        recoveryHandle(scope) {
            this.$emit("recoveryHandle", scope);
        },
        detailHandle(scope) {
            this.$emit("detailHandle", scope);
        },
        exportHandle(scope) {
            this.$emit("exportHandle", scope);
        },
        bidHandle(scope) {
            this.$emit("bidHandle", scope);
        },
        bidEditHandle(scope) {
            this.$emit("bidEditHandle", scope);
        },
        handleExpandChange(val) {
            this.$emit("handleExpandChange", val);
        },
        getRadio(row, e) {
            console.log(row);
            this.$emit("getRadio", row);
        },
        //比对结果
        comparison(row) {
            let arr = [];
            for (let key in row) {
                if (key.indexOf(this.comparisonValue) !== -1) {
                    arr.push(key);
                }
            }
            let result = true;
            for (let item of arr) {
                if (
                    Number(row[item]) !=
                    row[item.replace(this.comparisonValue, "")]
                ) {
                    result = false;
                }
            }
            if (!arr.length) {
                result = false;
            }
            return result;
        },
        // 切换下级是否展开
        toggleExpanded: function (trIndex) {
            const record = this.formatData[trIndex];
            record._expanded = !record._expanded;
        },
        // 图标显示
        iconShow(index, record) {
            return index === 0 && record.children && record.children.length > 0;
        },
        handleSelectionChange(val) {
            if (this.ifHaveCheckBox) {
                this.selectData = val;
            }
            this.$emit("handleSelectionChange", val);
            this.$refs.table.doLayout();
        },
        cellStyle({ row, column, rowIndex, columnIndex }) {
            this.$emit("cellStyle", row, column, rowIndex, columnIndex);
            if (
                this.meticComparisonModelRowMerge &&
                row.compareResult === "不一致" &&
                (columnIndex === 3 || columnIndex === 4 || columnIndex === 5)
            ) {
                return { "background-color": "#ffdead  !important" };
            }
            if (this.matchingResultsProjectRowMerge && row.isFix === "1") {
                return { "background-color": "#ffdead  !important" };
            }
            if (
                row.useState === "1" &&
                this.pageType !== "szhMetricVersioning"
            ) {
                return { "background-color": "#d5e9ff !important" };
            }
            //如果是勾选
            if (this.selectRow.includes(rowIndex)) {
                if (this.$store.state.fusionVersion) {
                    //融合版
                    return { "background-color": "#00787338 !important" };
                } else {
                    return { "background-color": "#d5e9ff !important" };
                }
            }
        },
        showRow({ row, rowIndex }) {
            // const show = row.row.parent
            //   ? row.row.parent._expanded && row.row.parent._show
            //   : true;
            // row.row._show = show;
            // return show
            //   ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
            //   : "display:none;";
        },
        headerCellStyle({ row, column, rowIndex, columnIndex }) {
            // console.log(row,column,rowIndex,columnIndex)
            if (this.meticComparisonModelRowMerge) {
                // console.log(param)
                if (rowIndex === 1) {
                    row[1].colSpan = 2;
                }
                if (columnIndex === 2) {
                    return "display:none";
                }
            }

            if (columnIndex === 0) {
                return {
                    "text-align": "center",
                    "font-size": "14px",
                    background: "#E9EBF0 0% 0% no-repeat",
                    border: "rgba(255, 255, 255, 0)",
                };
            }
            if (column.label.includes("*")) {
                return {
                    color: "#f75555",
                    border: "rgba(255, 255, 255, 0)",
                };
            }
            return {
                background: "#E9EBF0 0% 0% no-repeat",
                "font-size": "14px",
                border: "rgba(255, 255, 255, 0)",
            };
        },
        headerRowStyle(param) {
            return {
                background: "#E9EBF0 0% 0% no-repeat",
                height: "47px",
                border: "none",
            };
        },
        cellcb(row) {
            if (!row.row.children) {
                return "noNeedChildCheckBoxCss";
            }
        },
        sortChange({ column, prop, order }) {
            this.$emit("sortChange", column, prop, order);
        },
        //行拖拽
        rowDrop() {
            if (this.dropRow) {
                const tbody = document.querySelector(
                    ".hy-table .el-table__body-wrapper tbody"
                );
                Sortable.create(tbody, {
                    onEnd: (e) => {
                        let oldTit = this.tableData.splice(e.oldIndex, 1);
                        this.tableData.splice(e.newIndex, 0, ...oldTit);
                        this.$emit("rowDrop", this.tableData);
                    },
                });
            }
        },
        //列拖拽
        columnDrop() {
            // if (this.dropColumn) {
            //   let oldSort;
            //   const wrapperTr = document.querySelector(
            //     ".hy-table .el-table__header-wrapper tr"
            //   );
            //   let sortable = Sortable.create(wrapperTr, {
            //     animation: 180,
            //     delay: 0,
            //     dataIdAttr: "data-id",
            //     handle: ".dropColunm",
            //     onStart: e => {
            //       oldSort = sortable.toArray();
            //     },
            //     onEnd: e => {
            //       if (e.oldIndex === e.newIndex) return;
            //       let oldIndex = e.oldIndex;
            //       let newIndex = e.newIndex;
            //       const subProps = [
            //         this.ifHaveCheckBox,
            //         this.ifHaveRadio,
            //         this.ifHaveIndex
            //       ];
            //       const subLength = subProps.filter(b => b).length;
            //       const maxColumn = this.column.length + subLength;
            //       const handlers = [
            //         this.isHaveEdit,
            //         this.isHaveDelete,
            //         this.isHaveAdd,
            //         this.isHaveChangePass,
            //         this.isHaveSuspend,
            //         this.isHaveSuspend
            //       ];
            //       const hasHandler = handlers.some(v => v);
            //       if (newIndex < subLength) {
            //         sortable.sort(oldSort);
            //       } else if (hasHandler && newIndex >= maxColumn) {
            //         sortable.sort(oldSort);
            //       } else {
            //         oldIndex -= subLength;
            //         newIndex -= subLength;
            //         let oldTit = this.column.splice(oldIndex, 1);
            //         this.column.splice(newIndex, 0, ...oldTit);
            //         this.dropColCount++;
            //         this.$emit("columnDrop", this.column);
            //       }
            //     }
            //   });
            // }
        },

        //单元格合并 方案
        getSpanArr(data, arr, arrIndex, key01, key02) {
            //根据两个key值 //判断当前元素是否与上一元素相同
            key02 ? (key02 = key02) : (key02 = "");
            if (key02) {
                for (let index = 0; index < data.length; index++) {
                    if (index === 0) {
                        arr.push(1);
                        arrIndex = 0;
                    } else {
                        if (
                            data[index][key01] === data[index - 1][key01] &&
                            data[index][key02] === data[index - 1][key02]
                        ) {
                            arr[arrIndex] += 1;
                            arr.push(0);
                        } else {
                            arr.push(1);
                            arrIndex = index;
                        }
                    }
                }
            } else {
                //判断当前元素是否与上一元素相同
                for (let index = 0; index < data.length; index++) {
                    if (index === 0) {
                        arr.push(1);
                        arrIndex = 0;
                    } else {
                        if (data[index][key01] === data[index - 1][key01]) {
                            arr[arrIndex] += 1;
                            arr.push(0);
                        } else {
                            arr.push(1);
                            arrIndex = index;
                        }
                    }
                }
            }
        },

        // 合并单元格
        spanMethod({ row, column, rowIndex, columnIndex }) {
            // console.log(123213223,column.property)
            // console.log(row, column, rowIndex, columnIndex);
            // console.log(2132132132,this.needMergeSpanMeet)
            if (this.needMergeSpanMeet && this.needMergeSpanMeet.length > 0) {
                if (
                    columnIndex === 2 ||
                    columnIndex === 3 ||
                    columnIndex === 6 ||
                    columnIndex === 7
                ) {
                    return {
                        rowspan: this.needMergeSpanMeet[rowIndex],
                        colspan: 1,
                    };
                } else {
                    return {
                        rowspan: 1,
                        colspan: 1,
                    };
                }
            }

            const set = new Set(this.mergeSpan);
            let _row = "";
            if (set.has(column.property)) {
                if (
                    this.needMergeSpanMeet &&
                    this.needMergeSpanMeet.length > 0
                ) {
                    if (columnIndex === 1) {
                        return {
                            rowspan: this.needMergeSpanMeet[rowIndex],
                            colspan: 1,
                        };
                    } else {
                        return {
                            rowspan: 1,
                            colspan: 1,
                        };
                    }
                } else {
                    _row = this[`spanArr_${column.property}`][rowIndex];
                    return {
                        rowspan: _row,
                        colspan: _row ? 1 : 0,
                    };
                }
            }
        },

        // renderHeader(h,{colum}){
        //   console.log(colum)
        //   return h(
        //     'div',
        //     [
        //       h('span',colum.label),
        //       h('i',{
        //         class:'el-icon-plus',
        //         style:'color:#409eff'
        //       })
        //     ]
        //   );
        // },
        tableloadmore() {},

        headerDragend(newWidth, oldWidth, column, event) {},
    },
};
</script>

<style>
@import "./index.css";
.el-table .hasYellow {
    background: #fde6c3;
}

.el-table .hasBlue {
    background: #f2f3f6;
}

.el-table .hasWhite {
    background: #ffffff;
}

.el-table thead.is-group th {
    background-color: #fff !important;
}
.el-table td.el-table__cell {
    border-bottom: none;
    border-right: none;
}
.el-input__inner:focus {
    /* transition: all 0.1s;
    border: 1.2px solid #235fe1c7; */
}

.el-textarea__inner:focus {
    /* transition: all 0.1s;
    border: 1.2px solid #235fe1c7; */
}

.el-range-editor.is-active,
.el-range-editor.is-active:hover {
    transition: all 0.1s;
    border: 1.2px solid #235fe1c7;
    /* box-shadow: 0 1px 10px rgba(35, 95, 225, 0.4); */
}

/* .el-form-item.is-error .el-input__inner,
  .el-form-item.is-error .el-input__inner:focus,
  .el-form-item.is-error .el-textarea__inner,
  .el-form-item.is-error .el-textarea__inner:focus,
  .el-message-box__input input.invalid,
  .el-message-box__input input.invalid:focus {
    box-shadow: 0 1px 10px #f56c6c78;
  } */

.dialogCustom .el-dialog__body {
    padding: 10px 20px;
}
.el-table th.gutter {
    background: #e9ebf0;
}
/* .el-popper[x-placement^=bottom]{
    box-shadow: 0 0px 10px rgba(35, 95, 225, 0.5);
  } */

.el-table__header-wrapper {
    background: 0% 0% no-repeat rgb(233, 235, 240);
    /* .has-gutter {
      tr {
        color: #808e9e;
      }

      tr:first-child {
        color: #6b7178;
      }
      tr:last-child {
        color: #808e9e;
      }
    } */
}

th .table-header {
    border-color: #22273426 !important;
}

.el-table td,
.el-table th.is-leaf {
    border-color: #22273426 !important;
}

.el-table--border {
    border: 1px solid #dedfe1 !important;
    border-right: none !important;
}

.el-table--border th,
.el-table__fixed-right-patch {
    border-color: #22273426;
    background: #e9ebf0;
}

.hy-table {
    /* border-color: #22273426; */
    border: 0.5px solid rgba(34, 39, 52, 0.14902);
    border-top: none;
}

.el-table__row--striped td {
    background: #f2f3f6 !important;
    /* background: #a5aeb71f !important; */
}
.el-table__body td {
    border: none;
}

.el-table__body tr.hover-row > td {
    background: rgba(41, 139, 245, 0.1) !important;
    transition: all 0.05s !important;
}

/* .el-table__row:hover td {
    background: rgba(41, 139, 245, 0.1) !important;
    transition: all .05s !important;
  } */

.el-radio__inner {
    width: 18px !important;
    height: 18px !important;
}

.el-radio__inner::after {
    width: 8px !important;
    height: 8px !important;
}

::-webkit-scrollbar {
    width: 10px !important;
    height: 10px !important;
}

.el-table__fixed::before,
.el-table__fixed-right::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    z-index: 4;
}

.el-table::before {
    height: 0px !important;
}

.el-table__body tr.current-row > td {
    /* background-color: #3d6fe07a !important; */
    background-color: rgb(213, 233, 255) !important;
}

.el-table .el-table__fixed {
    height: auto !important;
    bottom: 10px;
}

.tableSelectRowBg td {
    background: #a2baf0 !important;
}

.noNeedChildCheckBoxCss .el-checkbox__input {
    display: none;
}

/* .el-table__expand-icon{
  position: absolute !important;
  left: 0;
  top: 10px;
  } */
.noNeedChildRowClass {
    background: #f2f3f6 !important;
}

.comparisonCss {
    border-radius: 50%;
    width: 20px;
    height: 20px;
}
</style>
