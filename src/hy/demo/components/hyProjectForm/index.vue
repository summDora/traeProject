<template>
    <el-form class="hy_project_form" :ref='formRef' :rules='rules' :inline="ifInLine" :model="formData" :size='size' :label-position="labelPosition" :label-width="labelWidth">
        <el-form-item v-for='item in formConfig' :key='item.key' :label="item.label" :prop='item.key'>
            <!-- input search-->
            <slot v-if="item.isSlot" :name="item.slotName"></slot>
            <el-input class="hy_project_form_input search" :style="{width: item.placeholder ? `${item.placeholder.length * 14 + 12 }px`: ''}" v-if="item.type === 'inputSearch'" v-model="formData[item.key]" :placeholder="item.placeholder" :disabled='item.disabled'
                :type='item.kind' :maxlength="item.maxlength" :clearable="item.clearable" @click.native='formSelectClick(item.key)'>
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
            <!-- input normal-->
            <el-input class="hy_project_form_input normal" :class="[item.customClass, `pd${item.selectEmbedLabel.length}`]" :style="{width: item.width ? `${item.width}px`: ''}" v-if="item.type === 'input'" v-model.trim="formData[item.key]" :placeholder="item.placeholder"
                :disabled='item.disabled' :type='item.kind' :maxlength="item.maxlength" :show-word-limit="item.showWordLimit" :clearable="item.clearable" @click.native='formSelectClick(item.key)' @input="formHandleChange(item.key)">
                <!-- onkeyup='this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9#;；（）、/,，.。:：%‘’“”!！ ]/g, "")'> -->
                <div slot="prefix" class="input_embed" :style="{width: item.selectEmbedLabel ? `${Number((item.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : item.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="item.selectEmbedLabel">
                </div>
            </el-input>
            <!-- input number -->
            <el-input class="hy_project_form_input normal" :class="[item.customClass, `pd${item.selectEmbedLabel.length}`]" :style="{width: item.width ? `${item.width}px`: ''}" v-if="item.type === 'inputNumber'" v-model.number="formData[item.key]" :placeholder="item.placeholder"
                :disabled='item.disabled' :type='item.kind' :min="item.min" :max="item.max" :maxlength="item.maxlength" :show-word-limit="item.showWordLimit" :clearable="item.clearable" @click.native='formSelectClick(item.key)' @input="formHandleChange(item.key)">
                <div slot="prefix" class="input_embed" :style="{width: item.selectEmbedLabel ? `${Number((item.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : item.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="item.selectEmbedLabel">
                </div>
            </el-input>
            <!-- select normal -->
            <el-select popper-class="projectFormCss" v-if="item.type === 'select'" :multiple="item.multiple" :clearable="item.clearable" :class="[{'hy_select_embed' : item.embed }, item.selectClass,`pd${item.selectEmbedLabel.length}` ]" class='hy_project_form_select'
                :style="{width: item.width ? `${item.width}px`: ''}" v-model="formData[item.key]" size="mini" :disabled='item.disabled' :placeholder="item.placeholder" @remove-tag="removeTag(item)" @click.native='formSelectClick(item.key)'
                @change='formSelectChange(item,formData[item.key])' @visible-change="selectInputVisibleChange($event,item)" :filterable="false" :allow-create="item.allowCreate" collapse-tags>
                <div v-if="item.embed" slot="prefix" class="select_embed" :style="{width: item.selectEmbedLabel ? `${Number((item.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : item.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="item.selectEmbedLabel">
                </div>
                <div style="width:100%;">
                    <el-input v-if="item.filterable?item.filterable:true" v-model="selectFilterText" @focus="selectInputFocus(item)" @blur="selectInputBlur(item)" @input="selectInputChange(item)" placeholder="关键字" size="mini" style="margin:0 0 5px 10px;width:90%"></el-input>
                </div>
                <div class="hySelectOption">

                    <el-option v-for="(v, index) in item.options" :key="index" :label="item.labelName ? v[item.labelName] : v.value" :value="item.labeKey   ? v[item.labeKey]   : v.key">
                    </el-option>
                </div>
            </el-select>
            <!-- input带下拉联动 -->
            <div v-if="item.type === 'selectLink'" tabindex="0" hidefocus="true" :style="{width: item.width ? `${item.width}px`: ''}" class="hy_project_form_selectLink" :class="{'active' : regionFocus}">
                <div v-if="item.embed" class="selectLink-embed" :style="{width: item.embedWidth ? `${item.embedWidth}px`: ''}" v-text="item.selectEmbedLabel"></div>
                <el-autocomplete :fetch-suggestions="querySearchAsync" :style="{width: item.selectLink[0].width ? `${item.selectLink[0].width}px`: ''}" :placeholder="item.selectLink[0].placeholder" @select="handleSelect" @focus="handleFocus"
                    v-model="formData[item.selectLink[0].key]">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-autocomplete>
                <el-autocomplete :fetch-suggestions="querySearchAsync1" :style="{width: item.selectLink[1].width ? `${item.selectLink[1].width}px`: ''}" :placeholder="item.selectLink[1].placeholder" @select="handleSelect1" @focus="handleFocus1"
                    v-model="formData[item.selectLink[1].key]">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-autocomplete>
                <el-autocomplete :fetch-suggestions="querySearchAsync2" :style="{width: item.selectLink[2].width ? `${item.selectLink[2].width}px`: ''}" :placeholder="item.selectLink[2].placeholder" @select="handleSelect2" @focus="handleFocus2"
                    v-model="formData[item.selectLink[2].key]">
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-autocomplete>
            </div>
            <!-- radio -->
            <el-radio-group v-if="item.type == 'radio'" v-model="formData[item.key]" @change='formRadiochange' @click.native='formSelectClick(item.key)'>
                <el-radio :label="r.value" :key="r.value" v-for="r in item.options">
                    {{r.label}}
                </el-radio>
            </el-radio-group>

            <el-autocomplete v-if="item.type == 'autocompleteInput'" v-model.trim="formData[item.key]" class="hy_project_form_input normal" :class="[item.customClass, `pd${item.selectEmbedLabel.length}`]" :style="{width: item.width ? `${item.width}px`: ''}"
                :placeholder="item.placeholder" :disabled='item.disabled' :maxlength="item.maxlength" :clearable="item.clearable" @click.native='formSelectClick(item.key)' @input="formHandleChange(item.key)" :fetch-suggestions="querySearch">
                <!-- onkeyup='this.value=this.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9#;；（）、/,，.。:：%‘’“”!！ ]/g, "")'> -->
                <div slot="prefix" class="input_embed" :style="{width: item.selectEmbedLabel ? `${Number((item.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : item.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="item.selectEmbedLabel">
                </div>
            </el-autocomplete>
            <!--带输入建议的输入框-->
            <!-- <el-autocomplete
          :style="{width: `${item.width}px`}"
          v-if="item.type == 'autocompleteInput'"
          v-model="formData[item.key]"
          :placeholder="item.placeholder"
          :disabled='item.disabled'
          :size="item.size?item.size:'medium'"
          :clearable="item.clearable"
          :fetch-suggestions="querySearch"
          @select="handleSelect"
          @click.native='formSelectClick(item.key)'
          @focus="inputFocus(item.key)"
          @blur="inputBlur"
      ></el-autocomplete> -->

            <!--下拉多选树-->
            <hySelectTree hidefocus="true" tabindex="0" @blur="regionFocus = false" :class=" regionFocus ? 'active' : ''" class="hyProjectFormSelectTree" v-if="item.type === 'hySelectTree'" :style="{width: `${item.width}px`}" :selectTreeData="item.data"
                :defaultProps="item.defaultProps" :selectTreeMultiple="item.multiple" :selectTreeNodeKey="item.nodeKey" :checkedKeys="formData[item.key]" :labelStyle="item.labelStyle" :popoverWidth="item.popoverWidth" :selectPlaceholder="item.placeholder" :itemKey="item.key"
                :trigger="item.trigger" @popoverHide="popoverHide" @selectTreeCheck='formSelectClick(item.key)' @change="selectTreeChange($event,item.key)">
            </hySelectTree>

            <!--区间-->
            <div tabindex="0" hidefocus="true" :style="{width: item.width ? `${item.width}px`: ''}" class="hy_project_form_region" :class="{'active' : regionFocus}" v-if="item.type === 'region'">
                <div v-if="item.embed" class="region-embed" :style="{width: item.embedWidth ? `${item.embedWidth}px`: ''}" v-text="item.selectEmbedLabel"></div>

                <el-input-number class="region-input" v-model="formData[item.region[0].key]" :controls="false" :precision="item.precision" :min="item.min" :max="item.max" :placeholder="item.region[0].placeholder" :disabled='item.disabled' :type='item.kind'
                    @focus="regionFocus = true" @blur="regionFocus = false" @click.native='formSelectClick(item.key)' />
                <div class='percentEle' v-if="item.percent">%</div>
                <el-input-number class="region-input region-before" v-model="formData[item.region[1].key]" :controls="false" :precision="item.precision" :min="item.min" :max="item.max" :placeholder="item.region[1].placeholder" :disabled='item.disabled' :type='item.kind'
                    @focus="regionFocus = true" @blur="regionFocus = false" @click.native='formSelectClick(item.key)' />
                <div class='percentEle' v-if="item.percent">%</div>
            </div>
            <!-- datepicker -->
            <div tabindex="0" class="hy_project_form_date" :style="{width: item.width ? `${item.width}px`: ''}" :class="[{'active' : dateFocus}, {'disabled': item.disabled}]" v-if="item.type == 'datepicker'">
                <div v-if="item.embed" class="date_embed" :style="{width: item.selectEmbedLabel ? `${Number((item.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : item.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="item.selectEmbedLabel"></div>
                <el-date-picker v-model="formData[item.key]" :class="[item.datePickerClass]" :type="item.dateType" :placeholder="typeof item.placeholder === 'string' ?  item.placeholder : ''" :format="item.format" :start-placeholder="item.placeholder[0]"
                    :end-placeholder="item.placeholder[1]" @focus="dateFocus = true" @blur="dateFocus = false" :value-format="item.valFormat" :disabled="item.disabled" :clearable="item.clearable" :picker-options="item.pickerOptions">
                </el-date-picker>
            </div>
            <!-- dateTimepicker -->
            <div tabindex="0" class="hy_project_form_date" :style="{width: item.width ? `${item.width}px`: ''}" :class="[{'active' : dateFocus}, {'disabled': item.disabled}]" v-if="item.type == 'dateTimepicker'">
                <div v-if="item.embed" class="date_embed" :style="{width: item.selectEmbedLabel ? `${Number((item.selectEmbedLabel.length * 13 + 23)) < 75 ? 75 : item.selectEmbedLabel.length * 13 + 23 }px`: ''}" v-text="item.selectEmbedLabel"></div>
                <el-date-picker v-model="formData[item.key]" :class="[item.datePickerClass]" :type="item.dateTimeType" range-separator="至" :placeholder="typeof item.placeholder === 'string' ?  item.placeholder : ''" :format="item.format" :start-placeholder="item.placeholder[0]"
                    :end-placeholder="item.placeholder[1]" @focus="dateFocus = true" @blur="dateFocus = false" :value-format="item.valFormat" :disabled="item.disabled" :clearable="item.clearable" :picker-options="item.pickerOptions">
                </el-date-picker>
            </div>
        </el-form-item>
        <!--<el-form-item>-->
        <!--<slot name="componentSlot"></slot>-->
        <!--</el-form-item>-->
        <el-form-item class="search_box" v-if="ifSearch">
            <el-button type="primary" size="medium" class="mr20" @click="onSearch">查询</el-button>
        </el-form-item>
        <el-form-item class="search_box" v-if="isReset">
            <el-button type="info" size="medium" class="mr20" @click="onReset">重置</el-button>
        </el-form-item>
        <el-form-item class="other_btn_box" v-if="ifExport || ifAdd || ifGoBack || ifDownload || ifExtra || isReset || ifEdit || ifDelete">
            <el-button v-if="ifExport" type="success" icon="el-button-icon icon-daochu2 iconfont" size="medium" @click="onExport"> 导出</el-button>
            <el-button v-if="ifAdd" type="success" icon="el-icon-circle-plus" size="medium" class="mr20" @click="onAdd">新增
            </el-button>
            <el-button v-if="ifEdit" type="primary" icon="el-icon-edit-outline" size="medium" class="mr20" @click="onEdit">修改
            </el-button>
            <el-button v-if="ifDelete" type="danger" icon="el-icon-remove" size="medium" class="mr20" @click="onDelete">删除
            </el-button>
            <el-button v-if="ifGoBack" type="success" icon="icon-fanhui iconfont" size="medium" @click="goBack"> 返回上一级</el-button>
            <div v-if="ifDownload" class="form-export mr14" @click="onDownload">下载</div>
            <div v-if="ifExtra" class="form-isExtra" @click="OnExtra">{{ExtraText}}</div>

        </el-form-item>

        <el-form-item class="search_box">
            <slot></slot>
        </el-form-item>

        <el-form-item class="cancel_Sure_box" v-if='ifCancel || ifSubmit'>
            <div v-if="ifCancel" class="form-cancel" @click="onCancel">取消</div>
            <div v-if="ifSubmit" class="form-submit" @click="onSubmit">确定</div>
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
 * @param {labelPosition} 标题位置
 * @param {labelWidth} 标题宽度
 * @param {rules} 验证规则
 * @param {ifCancel，ifSubmit} 一般用来 modal 弹出框中 form 表单 最下面的 确定/取消按钮，
 * @param {ifSubmit}确定按钮  确定事件@onSubmit 进行了表单校验，表单不通过，不会触发确定按钮
 * @param {labelName,labeKey}自定义label名称 和选项的参考值id，[{value:'labelName',key:"1"}] =>  不在只能是value 和 key
 */
export default {
    name: "hyProjectForm",

    props: {
        formRef: {
            type: String,
            default: () => "form",
        },
        rules: {
            type: Object,
            default: () => {},
        },

        ifInLine: {
            type: Boolean,
            default: () => true,
        },

        size: {
            type: String,
            default: () => "small",
        },

        formData: {
            type: Object,
            default: () => {},
        },

        labelPosition: {
            type: String,
            default: () => "left",
        },

        labelWidth: {
            type: String,
            default: () => "80px",
        },
        formConfig: {
            type: Array,
            default: () => [],
        },

        ifSearch: {
            type: Boolean,
            default: () => false,
        },
        isReset: {
            type: Boolean,
            default: () => false,
        },
        ifCancel: {
            type: Boolean,
            default: () => false,
        },
        ifSubmit: {
            type: Boolean,
            default: () => false,
        },
        ifExport: {
            type: Boolean,
            default: () => false,
        },
        ifExtra: {
            type: Boolean,
            default: () => false,
        },
        ExtraText: {
            type: String,
            default: () => "确定",
        },
        ifAdd: {
            type: Boolean,
            default: () => false,
        },
        ifEdit: {
            type: Boolean,
            default: () => false,
        },
        ifDelete: {
            type: Boolean,
            default: () => false,
        },
        ifGoBack: {
            type: Boolean,
            default: () => false,
        },

        ifDownload: {
            type: Boolean,
            default: () => false,
        },
        formRemoveKey: {
            type: String,
            default: () => "",
        },
        ifSlot: {
            type: Boolean,
            default: () => false,
        },
    },

    data() {
        return {
            selectFormItem: "",
            regionFocus: false,
            dateFocus: false,
            restaurants: [],
            timeout: null,
            state: "",

            selectFilterText: "",
            copySelectItem: {},
            fouceNum: 0,
            currentSearchSelectKey: {},
        };
    },

    created() {
        this.selectFormItem = "";
    },

    mounted() {
        this.restaurants = this.inputSelectData1();
    },

    methods: {
        //下拉框做输入筛选
        selectInputFocus(item) {},
        selectInputBlur(item) {},
        selectInputVisibleChange(e, item) {
            if (e) {
                this.$set(item, "copyOption", item.options);
                this.copySelectItem = this.m_copy(item);
            } else {
                item.options = this.m_copy(item.copyOption);
                // item.options=this.copySelectItem.options
                this.selectFilterText = "";
            }
        },
        selectInputChange(item) {
            if (!this.selectFilterText) {
                item.options = this.copySelectItem.options;
                return;
            }
            let copyItem = this.m_copy(this.copySelectItem);
            console.log(copyItem, copyItem.labelName, this.selectFilterText);
            if (!copyItem.labelName) {
                copyItem.labelName = "value";
            }
            let searchOption = [];
            searchOption = copyItem.options.filter((filterItem) => {
                console.log(filterItem, copyItem.labelName);
                if (
                    filterItem[copyItem.labelName].indexOf(
                        this.selectFilterText
                    ) !== -1
                ) {
                    return filterItem;
                }
            });

            if (!searchOption.length) {
                item.options = [];
            } else {
                item.options = searchOption;
            }
            this.$emit("selectInputChange", this.selectFilterText, item);
        },
        //-------------\\

        selectTreeChange(e, itemKey) {
            console.log("selectTreeChange", e, itemKey);
            this.formData[itemKey] = e;
            this.$emit("selectTreeChange", e, this.selectFormItem);
        },

        inputSelectData1() {
            return [
                { value: "三全33食品", address: "长宁区1新余路" },
                { value: "三全44食品", address: "长宁区2新余路" },
                { value: "三全55食品", address: "长宁区3新余路" },
                { value: "三全66食品", address: "长宁区4新余路" },
                { value: "三全11食品", address: "长宁区5新余路" },
                { value: "三全77食品", address: "长宁区6新余路" },
                { value: "三全88食品", address: "长宁区7新余路" },
            ];
        },

        querySearchAsync(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString
                ? restaurants.filter(this.createStateFilter(queryString))
                : restaurants;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1000);
        },
        createStateFilter(queryString) {
            return (restaurant) => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        handleSelect(item) {
            // console.log(9999, item);
        },
        handleFocus() {
            // input 框获取焦点就去调用接口找数据
        },

        querySearchAsync1(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString
                ? restaurants.filter(this.createStateFilter1(queryString))
                : restaurants;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1000);
        },
        createStateFilter1(queryString) {
            return (restaurant) => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        handleSelect1(item) {
            // console.log(9999, item);
        },
        handleFocus1() {
            // input 框获取焦点就去调用接口找数据
        },

        querySearchAsync2(queryString, cb) {
            let restaurants = this.restaurants;
            let results = queryString
                ? restaurants.filter(this.createStateFilter2(queryString))
                : restaurants;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                cb(results);
            }, 1000);
        },
        createStateFilter2(queryString) {
            return (restaurant) => {
                return (
                    restaurant.value
                        .toLowerCase()
                        .indexOf(queryString.toLowerCase()) === 0
                );
            };
        },
        handleSelect2(item) {
            // console.log(9999, item);
        },
        handleFocus2() {
            // input 框获取焦点就去调用接口找数据
        },

        formSelectClick(e) {
            this.selectFormItem = e;
        },

        formRadiochange(e) {
            this.$emit("formRadiochange", e, this.selectFormItem);
        },

        formHandleChange(e) {
            this.$emit("formHandleChange", e);
        },

        formSelectChange({ key, multiple, labelName }, v) {
            // console.log(key,labelName)
            if (multiple) {
                const optionLength = this.getOptionLength(key);
                const hasAll = this.getHasAll(key, labelName);
                const e = this.formData[key];
                console.log(hasAll, e);
                if (e.length) {
                    if (e[0] === "" && e.length > 1) {
                        this.formData[key] = this.formData[key].slice(1);
                    } else if (
                        e.length > 1 &&
                        e.some((item) => item === "") &&
                        hasAll
                    ) {
                        this.formData[key] = [""];
                    } else if (
                        e.length === optionLength - 1 &&
                        e.some((item) => item === "") > -1 &&
                        hasAll
                    ) {
                        this.formData[key] = [""];
                    } else {
                        this.formData[key] = e;
                    }
                } else {
                    this.formData[key] = [];
                }
            }
            this.$emit("formSelectChange", key, v);
        },

        querySearch(queryString, cb) {
            this.$emit("querySearch", queryString, cb, this.selectFormItem);
        },

        onSearch() {
            this.$refs[this.formRef].validate((valid) => {
                if (valid) {
                    for (let key in this.formData) {
                        if (typeof this.formData[key] === "string") {
                            this.formData[key] = this.formData[key].trim();
                        }
                    }
                    this.$emit("onSearch", this.formData);
                    return true;
                } else {
                    return false;
                }
            });
        },

        onReset() {
            this.$emit("onReset");
        },

        onExport() {
            this.$refs[this.formRef].validate((valid) => {
                if (valid) {
                    this.$emit("onExport", this.formData);
                    return true;
                } else {
                    return false;
                }
            });
        },

        OnExtra() {
            this.$refs[this.formRef].validate((valid) => {
                if (valid) {
                    this.$emit("OnExtra", this.formData);
                    return true;
                } else {
                    return false;
                }
            });
        },

        onCancel() {
            this.$emit("onCancel", this.formData);
        },

        onSubmit() {
            this.$refs[this.formRef].validate((valid) => {
                if (valid) {
                    this.$emit("onSubmit", this.formData);
                    return true;
                } else {
                    return false;
                }
            });
        },

        onAdd() {
            this.$emit("onAdd");
        },
        onEdit() {
            this.$emit("onEdit");
        },
        onDelete() {
            this.$emit("onDelete");
        },
        goBack() {
            this.$emit("goBack");
        },

        onDownload() {
            this.$refs[this.formRef].validate((valid) => {
                if (valid) {
                    this.$emit("onDownload", this.formData);
                    return true;
                } else {
                    return false;
                }
            });
        },

        removeTag({ key }) {
            this.$emit("removeTag", key);
        },

        // 处理获得option长度
        getOptionLength(key) {
            let optionLength = 0;
            const formConfigItem = this.formConfig.find(
                (item) => item.key === key
            );
            if (formConfigItem && formConfigItem.options) {
                optionLength = formConfigItem.options.length;
            }
            return optionLength;
        },

        // 下拉选项有没有全部
        getHasAll(key, labelName) {
            let hasAll = false;
            const formConfigItem = this.formConfig.find(
                (item) => item.key === key
            );
            if (formConfigItem && formConfigItem.options) {
                let index = -1;
                if (labelName) {
                    index = formConfigItem.options.findIndex(
                        (sub) => sub[labelName] === "全部"
                    );
                } else {
                    index = formConfigItem.options.findIndex(
                        (sub) => sub.value === "全部"
                    );
                }
                if (index > -1) {
                    hasAll = true;
                } else {
                    hasAll = false;
                }
            }
            return hasAll;
        },
        popoverHide(checkedIds, checkedData, itemKey) {
            // console.log("checkedIds", checkedIds);
            // console.log("checkedData", checkedData);
            // console.log("itemKey", itemKey);
            this.formData[itemKey] = checkedIds;
        },
    },
};
</script>
<style  scoped>
.el-form /deep/ .el-input__icon {
    display: inline-block !important;
    line-height: 35px !important;
}
.hySelectOption {
    box-sizing: border-box;
}
/* .el-select-dropdown{
  max-width:500px;
}
.el-select-dropdown__item{
  display:inline-block;
}

.hySelectOption >>> .el-select-dropdown__item span{
  min-width:205px;
  display:inline-block;
} */

/* .hySelectOption >>> .el-select-dropdown__item {
    overflow: initial !important;
    display: block !important;
} */
.hy_project_form_select >>> .el-select__tags span {
    /* line-height: 20px !important; */
    /* overflow-y: auto !important;
    overflow-x: overlay !important; */
    height: 24px !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
}
.hy_project_form >>> .el-tag--light {
    display: flex !important;
}

.region-input /deep/ .el-input__inner {
    height: 19px !important;
    font-size: 15px !important;
}
.percentEle {
    position: relative;
    left: -15px;
}
</style>
<style lang="less">
@import "./index.less";
.hy_project_form .hy_project_form_select.el-select {
    //overflow:hidden !important;
    box-sizing: border-box;
}
.hy_project_form .hy_project_form_select.hy_select_embed .el-select__tags {
    box-sizing: border-box;
}
</style>