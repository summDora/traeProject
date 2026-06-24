<template>
    <el-form class="hyNewForm" ref='form' :rules='rules' :inline="ifInLine" :model="formData" :size='size' :label-position="labelPosition" :label-width="labelWidth" :disabled="disabled" :validate-on-rule-change=false>

        <el-form-item v-for='item in formConfig' :key='item.key' :label-width="item.labelWidth" :label="item.label" :prop='item.key' v-show='!item.notShow' :style="{marginTop:`${item.marginTop}px`}">

            <slot v-if="item.isSlot" :name="item.slotName"></slot>

            <el-input ref="input" style="box-sizing: border-box;" :style="{width: `${item.width}px`,paddingRight :`${item.paddingRight}px`}" v-else-if="item.type == 'input'|| item.type === 'number'||item.type==='textarea' || item.type === 'addIcon'" v-model="formData[item.key]"
                :placeholder="item.placeholder" :disabled='item.disabled' :type='item.kind' :size="item.size?item.size:'medium'" :clearable="item.clearable" :show-word-limit="item.showWordLimit" :readonly="item.readonly" :autosize="item.autosize" :maxlength="item.maxlength"
                :prefix-icon="prefixIcon ? prefixIcon : ''" :rows="item.rows" @click.native='formSelectClick(item.key)' @blur='inputBlur' @change="inputHandleChange($event, item.key)" @input="inputChange($event, item.key)">
                <!-- onkeyup='this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9#;；（）、/,，.。:：%‘’“”!！ ]/g, "")' -->
                <i slot="suffix" :class="item.inputIcon" style="color:#409eff;font-size:20px;font-weight:700;margin-right:10px;line-height: 33px;cursor:pointer" @click="inputIconClick(item.key)"></i>
                <span slot="suffix" v-if="item.inputName" style="color:#409eff;font-size:15px;font-weight:700;margin-right:10px;line-height: 36px;cursor:pointer" @click="inputIconClick(item.key)">{{item.inputName}}</span>
            </el-input>
            <span v-if="item.type === 'number'">%</span>
            <span v-if="item.type === 'addIcon'">
                <i class="el-icon-circle-plus" style="color:#3477DE;font-size:18px" @click="inputIconClick(item.key)"></i>
            </span>
            <el-input :style="{width: `${item.width}px`}" v-if="item.type == 'passwordInput'" :show-password="item.type == 'passwordInput'" v-model="formData[item.key]" :placeholder="item.placeholder" :disabled='item.disabled' :type='item.kind'
                :size="item.size?item.size:'medium'" :clearable="item.clearable" :prefix-icon="prefixIcon ? prefixIcon : ''" @click.native='formSelectClick(item.key)' @focus="inputFocus(item.key)" @blur="blur(item.key)"></el-input>
            <slot name="btn" v-if="item.showGlxqBtn"></slot>

            <!--数字框-->
            <el-input-number v-if="item.type == 'numberInput'" :controls="false" :min="item.min" :max="item.max" :precision="item.precision" :style="{width: `${item.width}px`}" v-model="formData[item.key]" :placeholder="item.placeholder" :disabled='item.disabled'
                :type='item.kind' :size="item.size?item.size:'medium'" :clearable="item.clearable" :prefix-icon="prefixIcon ? prefixIcon : ''" @click.native='formSelectClick(item.key)' @blur='inputBlur' @change="inputHandleChange($event, item.key)"
                @input="inputChange($event, item.key)"></el-input-number>

            <!--带输入建议的输入框-->
            <el-autocomplete :style="{width: `${item.width}px`}" v-if="item.type == 'autocompleteInput'" v-model="formData[item.key]" :placeholder="item.placeholder" :disabled='item.disabled' :size="item.size?item.size:'medium'" :clearable="item.clearable"
                :fetch-suggestions="querySearch" @select="handleSelect" @click.native='formSelectClick(item.key)' @focus="inputFocus(item.key)" @blur="inputBlur"></el-autocomplete>

            <!--组合搜索框-->
            <el-input :style="{width: `${item.inputWidth}px`}" v-if="item.type == 'makeUpInput'" v-model="formData[item.inputKey]" :placeholder="item.inputPlaceholder" :disabled='item.inputDisabled' :type='item.kind' :size="item.size?item.size:'medium'"
                :clearable="item.clearable" :prefix-icon="prefixIcon ? prefixIcon : ''" @click.native='formSelectClick(item.key)' @focus="inputFocus(item.key)" @blur="blur(item.key)" class="input-with-select">
                <el-select slot="prepend" :style="{width: `${item.selectWidth}px`}" v-model="formData[item.selectKey]" :multiple='item.multiple?item.multiple:false' :disabled='item.selectDisabled' :clearable="item.clearable" :size="item.size?item.size:'medium'"
                    :placeholder="item.selectPlaceholder" @click.native='formSelectClick(item.key)' @change='e => formSelectchange(e,item.key)'>

                    <el-option :style="{width: `${item.width}px`}" v-for="v in item.options" :key="item.valueKey  ? v[item.valueKey]  : v.key" :label="item.labelName ? v[item.labelName] : v.value" :value="item.labeKey   ? v[item.labeKey]   : v.key">
                    </el-option>
                </el-select>
            </el-input>

            <!-- select -->
            <!--要监听选项框改变-->
            <el-select :style="{width: `${item.width}px`}" :popper-class="item.popperClass" v-if="item.type == 'select'" class='elFormSelect' ref="elSelect" v-model="formData[item.key]" v-selectloadmore="selectLoadMore" :filterable="item.filterable"
                :multiple='item.multiple?item.multiple:false' :disabled='item.disabled' :clearable="item.clearable" :size="item.size?item.size:'medium'" :placeholder="item.placeholder" :collapse-tags="item.collapseTags" @click.native='formSelectClick(item.key)'
                @change='e =>formSelectchange(e,item.key)'>
                <el-option :style="{width: `${item.width}px`}" v-for="v in item.options" :key="item.valueKey  ? v[item.valueKey]  : v.key" :label="item.labelName ? v[item.labelName] : v.value" :value="item.labeKey   ? v[item.labeKey]   : v.key" :disabled='v.disabled'>
                </el-option>
            </el-select>
            <!--要监听选项框改变-->
            <el-select :style="{width: `${item.width}px`}" v-if="item.type == 'select2'" class='elFormSelect' v-model="formData[item.key]" :multiple='item.multiple?item.multiple:false' :disabled='item.disabled' :clearable="item.clearable" :size="item.size?item.size:'medium'"
                :placeholder="item.placeholder" @click.native='formSelectClick(item.key)' @change='formSelectchange2'>
                <el-option :style="{width: `${item.width}px`}" v-for="v in item.options" :key="item.valueKey  ? v[item.valueKey]  : v.key" :label="item.labelName ? v[item.labelName] : v.value" :value="item.labeKey   ? v[item.labeKey]   : v.key">
                </el-option>
            </el-select>
            <!-- radio -->
            <el-radio-group :style="{width: `${item.width}px`}" v-if="item.type == 'radio'" :disabled='item.disabled' v-model="formData[item.key]" @change='formRadiochange' @click.native='formSelectClick(item.key)'>
                <el-radio :label="r.value" :key="r.value" v-for="r in item.options">
                    {{r.label}}
                </el-radio>
            </el-radio-group>

            <!-- 多选框 -->
            <el-checkbox-group v-if="item.type == 'checkbox'" v-model="formData[item.key]" @change='formCheckboxchange' @click.native='formSelectClick(item.key)'>
                <el-checkbox v-for="(r,index) in item.options" :label="item.labeKey   ? r[item.labeKey]   : r.key" :key="index">
                    {{item.labelName ? r[item.labelName] : r.value}}
                </el-checkbox>
            </el-checkbox-group>

            <HyCascader :style="{ width: item.width }" v-if="item.type == 'HyCascader'" :value="formData[item.key]" :options="item.options" :size="item.size?item.size:'medium'" @click.native='formSelectClick(item.key)' @formcascchange="formcascchange"></HyCascader>
            <!-- cascader -->
            <el-cascader ref="elCascader" v-if="item.type == 'cascader'" :style="{width: `${item.width}px`}" change-on-select :show-all-levels="showAllLevels" :options="item.options" :props="item.props" :disabled='item.disabled' :size="item.size?item.size:'medium'"
                v-model="formData[item.key]" @click.native='formSelectClick(item.key)' @change="formcascchange" :placeholder="item.placeholder" clearable>
            </el-cascader>

            <!--展示所有级联路径-->
            <el-cascader v-if="item.type == 'cascaderAllPath'" :style="{width: `${item.width}px`}" change-on-select :show-all-levels="item.showAllLevels" :options="item.options" :props="item.props" :disabled='item.disabled' :size="item.size?item.size:'medium'"
                v-model="formData[item.key]" @click.native='formSelectClick(item.key)' @change="formcascchange" :placeholder="item.placeholder" clearable>
            </el-cascader>

            <!-- transfer -->
            <el-transfer v-if="item.type == 'transfer'" filterable filter-placeholder="请输入搜索内容" :size="item.size?item.size:'medium'" v-model="formData[item.key]" :data="item.options" :titles='item.titles' :props='item.props'>
            </el-transfer>

            <!-- switch -->
            <el-switch v-if="item.type == 'switch'" v-model="formData[item.key]" :inactive-text="item.title" :disabled="item.disabled" @change="switchHandleChange">
            </el-switch>

            <!-- tree -->
            <el-scrollbar v-if=" item.type == 'tree' " :style='treeScrollStyle'>
                <hy-tree :treeData="item.options" :treeDefaultCheck="formData[item.key]" :treeDefaultExpand="formData[item.key]" :defaultTreeProps='item.props' :showTreeCheckBox='item.ifCheck' :checkStrictly='item.checkStrictly' @treeClick='treeClick' @treeSelect='treeSelect'
                    @clickTreeBox='formSelectClick(item.key)'>
                </hy-tree>
            </el-scrollbar>

            <!-- datepicker -->
            <el-date-picker v-if="item.type == 'datepicker' " v-model="formData[item.key]" :picker-options="item.needThreeYears?threeYears:''" :type="item.dateType" :size="item.size?item.size:'medium'" :placeholder="item.placeholder[0]" :start-placeholder="item.placeholder[0]"
                :end-placeholder="item.placeholder[1]" :format="item.format" :clearable="item.clearable" :disabled='item.disabled' :value-format="item.valFormat" :style="{ width: item.width }">
            </el-date-picker>

            <!-- dateTimepicker -->
            <el-date-picker v-if="item.type == 'dateTimepicker'" :style="{ width: item.width }" v-model="formData[item.key]" :class="[item.datePickerClass]" :type="item.dateTimeType" range-separator="至" :placeholder="typeof item.placeholder === 'string' ?  item.placeholder : ''"
                :format="item.format" :start-placeholder="item.placeholder[0]" :end-placeholder="item.placeholder[1]" @focus="dateFocus = true" @blur="dateFocus = false" :value-format="item.valFormat" :disabled="item.disabled" :clearable="item.clearable"
                :picker-options="item.pickerOptions">
            </el-date-picker>

            <!-- daterange -->
            <el-date-picker v-if="item.type == 'daterange' " v-model="formData[item.key]" range-separator="至" :start-placeholder="item.placeholder[0]" :end-placeholder="item.placeholder[1]" :picker-options="daterangeOption" :type="item.dateType"
                :size="item.size?item.size:'medium'" :format="item.format" :clearable="item.clearable" :disabled='item.disabled' :value-format="item.valFormat" :style="{ width: item.width }">
            </el-date-picker>
            <!--不能超过1个月日期选择-->
            <el-date-picker v-if="item.type == 'datepickerLimit' " v-model="formData[item.key]" :picker-options="pickerOptions" :type="item.dateType" :size="item.size?item.size:'medium'" :placeholder="item.placeholder[0]" :start-placeholder="item.placeholder[0]"
                :end-placeholder="item.placeholder[1]" :format="item.format" :clearable="item.clearable" :value-format="item.valFormat" :style="{ width: item.width }">
            </el-date-picker>

            <!--下拉多选树-->
            <hySelectTree ref="hySelectTree" :popoverWidth="item.width" :selectPlaceholder="item.placeholder" :size="item.size" :disabled="item.disabled" :labelStyle="item.labelStyle" :checkedKeys="formData[item.key]" :selectTreeNodeKey="item.nodeKey"
                v-if="item.type == 'hySelectTree' " :selectTreeData="item.data" :defaultProps="item.defaultProps" :selectTreeMultiple="item.multiple" :itemKey="item.key" :isShowSelect2="isShowSelect2" :trigger="item.trigger" @selectTreeCheck='formSelectClick(item.key)'
                @selectTreeHandleNodeClick="selectTreeHandleNodeClick" @removeSelectedNodes="removeSelectedNodes" @popoverShow="formSelectClick(item.key)" @popoverHide="popoverHide" tiggerType="newForm" @change="e => formSelectchange(e,item.key)">
            </hySelectTree>

        </el-form-item>

        <slot></slot>
        <!-- submit -->
        <el-form-item v-if="ifSearch1 || ifSearch2 || ifSearch3 || ifReset || ifSlot" :class="ifSlot || ifSearch1|| ifReset || ifSearch3?'submitBox':ifSearch2?'submitFoot':''">
            <el-button v-if='ifSearch2' style="width:200px" size='medium' @click="onCancle">取消
            </el-button>
            <el-button v-if='ifSearch1' type="primary" size="small" @click="onSearch">查询</el-button>
            <el-button v-if='ifSearch2' style="width:200px" size='medium' type="primary" @click="onSubmit">确定
            </el-button>
            <el-button style="border-radius: 4px;" v-if='ifSearch3' type="primary" @click="onSubmit">{{btnText}}
            </el-button>
            <el-button size="small" type="info" v-if='ifReset' @click="onReset">重置
            </el-button>
            <slot name="button" v-if="ifSlot"></slot>
        </el-form-item>
    </el-form>
</template>

<script>
/**
 * 必填
 * @param {formData} 表单显示数据
 * @param {formConfig} 表单配置
 * @param {size} 大小类型
 * @param {ifInLine} 是否行内表单
 * @param {ifSearch1} 搜索图标
 * @param {ifSearch3} 自定义搜索文本
 * @param {labelPosition} 标题位置
 * @param {labelWidth} 标题宽度
 * @param {rules} 验证规则
 */
/**
 * formConfig
 * 通用配置
 * @param {key} 表单formData中对应key值
 * @param {label} 表单标题
 * @param {notShow} 对应表单是否显示
 * @param {placeholder} 输入框占位文本
 * @param {disabled} 是否禁用
 * @param {type} 表单类型 input、select、cascader、transfer、switch、tree、datepicker
 * input
 * @param {kind} input框类型  text、textarea、password等
 * select
 * @function formSelectchange(val, key) val为对应id, key为表单formData中对应key值
 * @param {options} 例：[{label: 'a', value: 1}] label为值, value为唯一ID
 * @param {multiple} 是否多选
 * cascader
 * @function formcascchange(val, key) val为对应id集合, key为表单formData中对应key值
 * @param showAllLevels 输入框中是否显示选中值的完整路径
 * @param options 可选项数据源，键名可通过 props 属性配置
 * @param props {value: 'a', lable: 'b', children: [], disabled: false} value:指定选项的值为选项对象的某个属性值, label: 指定选项标签为选项对象的某个属性值, children: 指定选项的子选项为选项对象的某个属性值, disabled: 指定选项的禁用为选项对象的某个属性值
 * transfer
 * @param {options} Transfer 的数据源
 * @param {titles}  自定义列表标题
 * @param {props} 数据源的字段别名
 * switch
 * @param {title} switch关闭时的文字描述
 * tree
 * @param {options} 树形结构数据
 * @param {props} 节点属性 {children: 'children', label: 'label'} children为子节点属性，label为该节点属性
 * @param {ifCheck} 是否可以多选(checkbox)
 * @param {checkStrictly} 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false
 * @function treeClick(e, node) 点击节点事件，e为点击节点数据, node为点击的节点
 * datepicker
 * @param {dateType} 显示类型 year/month/date/dates/ week/datetime/datetimerange/daterange
 * @param {format} 显示在输入框中的格式 例： yyyy-MM-dd
 * @param {valFormat} 可选，绑定值的格式。不指定则绑定值为 Date 对象
 */
import HyTree from "../hyTree";
import HyCascader from "./cascader/index.vue";
import hySelectTree from "../hySelectTree";
import { debuglog } from "util";
export default {
    name: "hyNewForm",
    props: {
        size: {
            type: String,
            default: () => "small",
        },
        ifInLine: {
            type: Boolean,
            default: () => true,
        },
        ifSearch1: {
            type: Boolean,
            default: () => false,
        },
        ifSearch1Icon: {
            type: Boolean,
            default: () => true,
        },
        ifSearch2: {
            type: Boolean,
            default: () => false,
        },
        ifSearch3: {
            type: Boolean,
            default: () => false,
        },
        ifReset: {
            type: Boolean,
            default: () => false,
        },
        btnText: {
            type: String,
            default: () => "确定",
        },
        labelPosition: {
            type: String,
            default: () => "top",
        },
        labelWidth: {
            type: String,
            default: () => "",
        },
        rules: {
            type: Object,
            default: () => {},
        },
        clearAll: {
            type: Boolean,
            default: () => true,
        },
        showAllLevels: {
            type: Boolean,
            default: () => false,
        },
        formConfig: {
            type: Array,
            default() {
                return [];
            },
        },
        formData: {
            type: Object,
            default() {
                return {};
            },
        },
        treeScrollStyle: {
            type: Object,
            default: () => {
                return { height: "400px" };
            },
        },
        clearStatus: {
            type: [String, Number, Boolean],
        },
        prefixIcon: {
            default: () => "",
            type: String,
        },
        ifSlot: {
            type: Boolean,
            default: () => false,
        },
        disabled: {
            type: Boolean,
            default: () => false,
        },
    },
    data() {
        return {
            isShowSelect2: "",
            selectFormItem: "",
            //限制日期选前三年
            threeYears: {
                disabledDate: (time) => {
                    let curDate = new Date().getTime();
                    let three = 360 * 2 * 24 * 3600 * 1000;
                    let threeYears = curDate - three;
                    return (
                        time.getTime() > Date.now() ||
                        time.getTime() < threeYears
                    );
                },
            },
            //限制日期一个月选择
            pickerOptions: {
                onPick: ({ maxDate, minDate }) => {
                    this.choiceDate = minDate.getTime();
                    if (maxDate) {
                        this.choiceDate = "";
                    }
                },
                disabledDate: (time) => {
                    if (this.choiceDate) {
                        const one = 30 * 24 * 3600 * 1000;
                        const minTime = this.choiceDate - one;
                        const maxTime = this.choiceDate + one;
                        return (
                            time.getTime() < minTime || time.getTime() > maxTime
                        );
                    }
                },
            },
            // 限制结束时间必须大于开始时间
            daterangeOption: {
                onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    // console.log(44444444)
                },
            },
            choiceDate: "",
        };
    },
    components: {
        HyTree,
        HyCascader,
    },
    created() {
        this.selectFormItem = "";
    },

    methods: {
        validate(cb) {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    cb();
                } else {
                    return false;
                }
            });
        },
        onSubmit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.$emit("onSubmit", this.formData);
                } else {
                    // console.log("error submit!!");
                    return false;
                }
            });
        },
        onSearch() {
            this.$emit("onSearch", this.formData);
        },
        onReset() {
            this.$emit("onReset", this.formData);
        },
        onCancle() {
            this.$refs.form.resetFields();
            this.$emit("onCancle");
        },
        formSelectClick(e) {
            this.selectFormItem = e;
            this.isShowSelect2 = false;
        },
        selectLoadMore() {
            // console.log('===========selectLoadMore=');
            this.$emit("selectLoadMore");
        },
        inputBlur(e) {
            this.$emit("inputBlur", e, this.selectFormItem);
        },
        inputFocus(e) {
            this.$emit("inputFocus", e, this.selectFormItem);
        },
        inputIconClick(e) {
            this.$emit("inputIconClick", e);
        },
        blur(e) {
            console.log(e, "e");
            this.$emit("blur", e, this.selectFormItem);
        },
        formSelectchange(e, key) {
            this.formData[key ? key : this.selectFormItem] = e;
            this.$emit("formSelectchange", e, key ? key : this.selectFormItem);
        },
        formSelectchange2(e) {
            this.$emit("formSelectchange2", e, this.selectFormItem);
        },
        formRadiochange(e) {
            this.$emit("formRadiochange", e, this.selectFormItem);
        },
        formCheckboxchange(e) {
            this.$emit("formCheckboxchange", e, this.selectFormItem);
        },
        formcascchange(e) {
            for (const iterator of this.$refs.elCascader) {
                iterator.dropDownVisible = false;
            }
            this.$emit("formcascchange", e, this.selectFormItem);
        },
        querySearch(queryString, cb) {
            this.$emit("querySearch", queryString, cb, this.selectFormItem);
        },
        handleSelect(item) {},
        treeSelect(e, keys) {
            this.formData[this.selectFormItem] = keys;
        },
        treeClick(e, node) {
            this.$emit("treeClick", e, node, this.selectFormItem);
        },
        popoverShow() {},
        popoverHide(checkedIds, checkedData, itemKey) {
            // console.log("checkedIds", checkedIds);
            // console.log("checkedData", checkedData);
            // console.log("itemKey", itemKey);
            // console.log("selectFormItem", this.selectFormItem);
            this.formData[itemKey] = checkedIds;
            this.$emit("getTreeNodeName", checkedData);
        },
        selectTreeHandleNodeClick(data, node) {
            if (node.checkedKeys && node.checkedKeys.length > 0) {
                // console.log(11111,this.$refs)
                //  this.$refs.form.clearValidate();
            }
            this.$emit("selectTreeHandleNodeClick", data, node);
        },
        removeSelectedNodes(e) {
            this.$emit("removeSelectedNodes", e);
        },
        inputHandleChange(val, key) {
            // console.log(val,key,'change')
            this.$emit("inputHandleChange", val, key);
        },
        inputChange(val, key) {
            this.$emit("inputChange", val, key);
        },
        switchHandleChange(val) {
            this.$emit("switchHandleChange", val);
        },
    },
    watch: {
        clearAll(val) {
            if (!val) {
                this.$refs.form.resetFields();
                this.$refs.form.clearValidate();
            }
            this.selectFormItem = "";
        },
        "formData.password"(val) {
            const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
            if (reg.test(val))
                this.formData.checkPassword &&
                    this.$nextTick(() =>
                        this.$refs.form.validateField("checkPassword")
                    );
        },
        clearStatus() {
            this.$refs.form.clearValidate();
        },
    },
};
</script>

<style scoped>
.elFormSelect {
    width: 100%;
}

.submitBox {
    display: flex;
    justify-content: flex-end;
}

.submitFoot {
    display: flex;
    justify-content: center !important;
}

.el-input__inner {
    border-radius: 4px !important;
}

.el-input__icon {
    font-size: 16px !important;
    line-height: 27px !important;
}

.el-form--inline .el-form-item {
    line-height: 46px;
    margin-right: 18px !important;
    margin-bottom: 5px !important;
    vertical-align: middle !important;

    /* padding-right: 4px!important;
    padding-left: 12px!important; */
}
.el-form--inline /deep/ .el-form-item__content {
    vertical-align: middle !important;
}
.el-form-item__label {
    padding-right: 16px !important;
    color: #333 !important;
}
.el-textarea__inner {
    border-radius: 4px !important;
}
.el-input__count {
    background: none !important;
}
.hyNewForm /deep/ .el-form--inline .el-form-item__content {
    vertical-align: middle !important;
}

/* .el-button {
    transition: all .1s;
    border-radius: 4px !important;
  }
  .el-button:hover{
    transition: all .1s;
    opacity: .8;
  } */
.input-with-select /deep/.el-input-group__prepend {
    background: white !important;
}
.input-with-select /deep/.el-input__inner {
    border-radius: 0px 4px 4px 0 !important;
}

.hyNewForm /deep/ .el-input__suffix {
    display: flex !important;
    align-items: center !important;
}
</style>
