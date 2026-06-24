<template>
  <el-table-column :prop="col.key" :label="col.colName" :fixed="col.fixed" :width="col.width" :resizable="true" :min-width="col.min_width" :show-overflow-tooltip="col.showOverflowTooltip" align="center">
    <!--自定义表头-->
    <template slot="header" slot-scope="scope">
      <!--需要输入框-->
      <div style="width:100%" v-if="col.editType==='1'">
        <el-input :disabled="col.disabled==='1'" style="width:80%" size="mini"  :maxlength="100" v-model="col.colName" @blur="headerInputBlur($event,scope,col)" @input="headerInputChange($event,scope,col)"/>
        <span @click="headerOperation(scope,col)" class="headerOperation" v-if="col.operateType&&col.disabled!=='1'" :style="{'color':col.operateType==='add'?'#67c23a':'#f56c6c'}">
          <span v-if="col.operateType==='add'">+</span><span v-if="col.operateType==='delete'">X</span>{{col.operateName}}
        </span>
      </div>
      <!--需要下拉框-->
      <div style="width:100%" v-else-if="col.editType==='2'">
        <el-select :disabled="col.disabled==='1'" style="width:100%" size="mini" v-model="col.colName" @change="headerSelectChange($event,scope,col)">
          <el-option v-for="(item,index) in col.tableDictValue" :key="index" :label="item.dictName" :value="item.dictId">
          </el-option>
        </el-select>
      </div>
      <div v-else>
        {{col.colName}}
        <span  @click="headerOperation(scope,col)" class="headerOperation" v-if="col.operateType" :style="{'color':col.operateType==='add'?'#67c23a':'#f56c6c'}">
          <span v-if="col.operateType==='add'">+</span><span v-if="col.operateType==='delete'">X</span>{{col.operateName}}
        </span></div>
    </template>

    <template v-if="col.children">
      <column v-for="item in col.children" :key="item.key" :col="item" v-on="$listeners" :parentItem="col"></column>
    </template>
    <template slot-scope="scope">
      <el-popover v-if="scope.row.hasPopover && col.hasPopover" placement="right-end" :visible-arrow="false" trigger="hover" offset="0" :popper-class="scope.row.index + col.key + 'popover'">
        <span slot="reference" :class="scope.row.index + col.key">{{ scope.row[col.key].toString().trim() ? scope.row[col.key] : '--' }}</span>
      </el-popover>

      <div style="padding:5px 0" v-else-if="col.fieldType&&scope.row.isEdit">
        <!-- 动态配置fieldType 输入框:1  文本框:2  下拉框:3  数字框:4  刪除按鈕:5 -->
        <el-date-picker v-if="col.editType === 'date'" v-model="scope.row[col.key]" size="mini" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :editable="false" :clearable="true" @change="datePickerOnChange"></el-date-picker>
        <el-input  :disabled="col.disabled==='1'" :maxlength="100" v-else-if="col.fieldType === '1'&&col.compare!=='1'&&col.compare!=='2'" v-model="scope.row[col.key]" size="mini"  
          @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
          @input="inputChange(scope.row,col,scope.row[col.key])"
        ></el-input>
        <el-input 
          :disabled="col.disabled==='1'"
          v-else-if="col.fieldType === '2'&&col.compare!=='1'&&col.compare!=='2'"
          type="textarea" resize="none" :rows="2" size="mini" maxlength="500" 
          @focus="openFromInput(scope.row,col.key)" readonly
          v-model="scope.row[col.key]"
          @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
          @input="inputChange(scope.row,col,scope.row[col.key])"
          >
        </el-input>
        <!-- 数字框 -->
        <div v-if="col.fieldType=='4'&&col.compare!=='1'&&col.compare!=='2'">
          <el-input-number  :disabled="col.disabled==='1'" size="mini" :controls="false" :precision="0" v-model="scope.row[col.key]" 
            @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
            @input="inputChange(scope.row,col,scope.row[col.key])"
          ></el-input-number>
        </div>
        <!-- <el-select  :clearable="true"  v-model="scope.row[col.key]"  @change='formSelectChange(scope.row,item.key,scope.row[item.key])'>
          <el-option v-for="(item,index) in scope.row[col.key]" :key="index" :label="item.dictName" :value="item.dictId">
          </el-option>
        </el-select> -->


        <!--送审有比对结果带填写框的类型-->
        <!-- 输入框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='1'&&col.compare==='1'">
          <el-input style="width:60%" :disabled="col.disabled==='1'" size="mini" :maxlength="100" v-model="scope.row[col.key]" 
            @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
            @input="inputChange(scope.row,col,scope.row[col.key])"
          ></el-input>
          <div style="width:40%" v-if="scope.row[col.key+'_dl']">
            <span v-if="scope.row[col.key]==scope.row[col.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[col.key+'_dl']}}</span>
            <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[col.key+'_dl']}}</span>
          </div>
        </div>
        <!-- 文本框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='2'&&col.compare==='1'">
          <el-input 
            style="width:60%"
            :disabled="col.disabled==='1'"
            type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
            v-model="scope.row[col.key]" 
            @focus="openFromInput(scope.row,col.key)" readonly
            @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
            @input="inputChange(scope.row,col,scope.row[col.key])">
          </el-input>
          <div style="width:40%" v-if="scope.row[col.key+'_dl']">
            <span v-if="scope.row[col.key]==scope.row[col.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[col.key+'_dl']}}</span>
            <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[col.key+'_dl']}}</span>
          </div>
        </div>
        <!-- 下拉框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='3'&&col.compare==='1'">
          <el-select :disabled="col.disabled==='1'" :clearable="true"  v-model="scope.row[col.key]" size="mini" @change="selectChange(scope.row,col,scope.row[col.key])">
            <el-option v-for="itemSelect in col.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
            </el-option>
          </el-select>
          <div style="min-width:33px" v-if="scope.row[col.key+'_dl']">
            <span v-if="scope.row[col.key]==scope.row[col.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[col.key+'_dl']}}</span>
            <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[col.key+'_dl']}}</span>
          </div>
        </div>
        <!-- 数字框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='4'&&col.compare==='1'">
          <el-input-number style="width:80%" :disabled="col.disabled==='1'" size="mini" :controls="false"  :precision="0" v-model="scope.row[col.key]" 
          @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
          @input="inputChange(scope.row,col,scope.row[col.key])"
          ></el-input-number>
          <div style="min-width:33px" v-if="scope.row[col.key+'_dl']">
            <span v-if="Number(scope.row[col.key])==scope.row[col.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[col.key+'_dl']}}</span>
            <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[col.key+'_dl']}}</span>
          </div>
        </div>


        <!--专家有比对结果带填写框的类型-->
        <!-- 输入框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='1'&&col.compare==='2'">
          <div style="width:40%">
            <span>{{scope.row[col.key]}}</span>
          </div>
          <el-input 
            v-if="scope.row[col.key]==scope.row[`${col.key}_zj`]"
            style="width:60%" :disabled="col.disabled==='1'" size="mini" :maxlength="100" 
            v-model="scope.row[`${col.key}_zj`]" 
            @blur="inputOnBlur(scope.row,col,scope.row[`${col.key}_zj`])"
            @input="inputChange(scope.row,col,scope.row[`${col.key}_zj`])"
          ></el-input>
          <el-input 
            v-else
            class="redBoderInput"
            style="width:60%" :disabled="col.disabled==='1'" size="mini" :maxlength="100" 
            v-model="scope.row[`${col.key}_zj`]" 
            @blur="inputOnBlur(scope.row,col,scope.row[`${col.key}_zj`])"
            @input="inputChange(scope.row,col,scope.row[`${col.key}_zj`])"
          ></el-input>
        </div>
        <!-- 文本框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='2'&&col.compare==='2'">
          <div style="width:40%">
            <span>{{scope.row[col.key]}}</span>
          </div>
          <el-input 
            v-if="scope.row[col.key]==scope.row[`${col.key}_zj`]"
            style="width:60%"
            :disabled="col.disabled==='1'"
            type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
            v-model="scope.row[`${col.key}_zj`]" 
            @focus="openFromInput(scope.row,col.key)" readonly
            @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
            @input="inputChange(scope.row,col,scope.row[col.key])">
          </el-input>
          <el-input 
            v-else
            class="redBoderInput"
            style="width:60%"
            :disabled="col.disabled==='1'"
            type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
            v-model="scope.row[`${col.key}_zj`]" 
            @focus="openFromInput(scope.row,col.key)" readonly
            @blur="inputOnBlur(scope.row,col,scope.row[col.key])"
            @input="inputChange(scope.row,col,scope.row[col.key])">
          </el-input>
        </div>
        <!-- 下拉框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='3'&&col.compare==='2'">
          <div style="min-width:33px">
            <span>{{scope.row[col.key]}}</span>
          </div>
          <el-select v-if="Number(scope.row[col.key])==scope.row[`${col.key}_zj`]" style="width:80%" :disabled="col.disabled==='1'" :clearable="true"  v-model="scope.row[`${col.key}_zj`]" size="mini" @change="selectChange(scope.row,col,scope.row[`${col.key}_zj`])">
            <el-option v-for="itemSelect in col.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
            </el-option>
          </el-select>
          <el-select v-else class="redBoderInput" style="width:80%" :disabled="col.disabled==='1'" :clearable="true"  v-model="scope.row[`${col.key}_zj`]" size="mini" @change="selectChange(scope.row,col,scope.row[`${col.key}_zj`])">
            <el-option v-for="itemSelect in col.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
            </el-option>
          </el-select>
        </div>
        <!-- 数字框 -->
        <div style="display:flex;align-items: center;" v-if="col.fieldType=='4'&&col.compare==='2'">
          <div style="min-width:33px">
            <span>{{scope.row[col.key]}}</span>
          </div>
          <el-input-number 
            v-if="Number(scope.row[col.key])==scope.row[`${col.key}_zj`]"
            style="width:80%" :disabled="col.disabled==='1'" size="mini" :controls="false"  :precision="0" 
            v-model="scope.row[`${col.key}_zj`]" 
            @blur="inputOnBlur(scope.row,col,scope.row[`${col.key}_zj`])"
            @input="inputChange(scope.row,col,scope.row[`${col.key}_zj`])"
          ></el-input-number>
          <el-input-number 
            v-else
            class="redBoderInput"
            style="width:80%" :disabled="col.disabled==='1'" size="mini" :controls="false"  :precision="0" 
            v-model="scope.row[`${col.key}_zj`]" 
            @blur="inputOnBlur(scope.row,col,scope.row[`${col.key}_zj`])"
            @input="inputChange(scope.row,col,scope.row[`${col.key}_zj`])"
          ></el-input-number>      
        </div>

      </div>

      <!--送审有比对结果不带填写框的类型-->
       <!-- 不可编辑时 -->
      <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="col.compare==='1'&&col.fieldType&&!scope.row.isEdit">
        <div>
          <span>{{scope.row[col.key]}}</span>
        </div>
        <div v-if="scope.row[col.key+'_dl']">
          <span v-if="Number(scope.row[col.key])==scope.row[col.key+'_dl']" class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#73be46;color:white">{{scope.row[col.key+'_dl']}}</span>
          <span v-else class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#d9001b;color:white">{{scope.row[col.key+'_dl']}}</span>
        </div>
      </div>
      <!-- 查看时 -->
      <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="col.compare==='1'&&!col.fieldType">
        <div>
          <span>{{scope.row[col.key]}}</span>
        </div>
        <div v-if="scope.row[col.key+'_dl']">
          <span v-if="Number(scope.row[col.key])==scope.row[col.key+'_dl']" class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#73be46;color:white">{{scope.row[col.key+'_dl']}}</span>
          <span v-else class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#d9001b;color:white">{{scope.row[col.key+'_dl']}}</span>
        </div>
      </div>

      <!--专家有比对结果不带填写框的类型-->
      <!-- 不可编辑时 -->
      <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="col.compare==='2'&&col.fieldType&&!scope.row.isEdit">
        <div>
          <span>{{scope.row[col.key]}}</span>
        </div>
        <div v-if="scope.row[`${col.key}_zj`]">
          <span v-if="scope.row[col.key]==scope.row[`${col.key}_zj`]" class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#73be46;color:white">{{scope.row[`${col.key}_zj`]}}</span>
          <span v-else class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#d9001b;color:white">{{scope.row[`${col.key}_zj`]}}</span>
        </div>
      </div>
      <!-- 查看时 -->
      <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="col.compare==='2'&&!col.fieldType">
        <div>
          <span>{{scope.row[col.key]}}</span>
        </div>
        <div v-if="scope.row[`${col.key}_zj`]">
          <span v-if="scope.row[col.key]==scope.row[`${col.key}_zj`]" class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#73be46;color:white">{{scope.row[`${col.key}_zj`]}}</span>
          <span v-else class="compareCss" :style="{'min-width':Number(scope.row[col.key])!==NaN?'33px':'40%'}" style="background:#d9001b;color:white">{{scope.row[`${col.key}_zj`]}}</span>
        </div>
      </div>

      <!-- 只展示，但是有计算公式 -->
      <!-- <div style="padding:5px 0" v-else-if="col.isConfigFormula">
        <span>{{ formatData(col, scope.row) }}</span>
      </div> -->
      
      <slot
        v-else-if="col.isSlot"
        :data="scope.row"
        :scopeData="scope"
        :name="col.slotName"
        :index="scope.$index"
      ></slot>

      <div v-else-if="scope.row.data">
        <span :class="scope.row.data[col.startPosx].posx + 'and' + scope.$index" v-if="scope.row.data[col.startPosx].success">{{ precisionProcessing(scope.row.data[col.startPosx], col.dataPrecision) }}</span>
        <el-tooltip v-else placement="top" trigger="hover" :content="scope.row.data[col.startPosx].message">
          <span v-if="scope.row.data[col.startPosx].displayValue === undefined || scope.row.data[col.startPosx].displayValue === null || scope.row.data[col.startPosx].displayValue === '' || scope.row.data[col.startPosx].displayValue.toString().trim() === ''" :class="scope.row.data[col.startPosx].posx + 'and' + scope.$index" style="color: #d9001b;">--</span>
          <span v-else :class="scope.row.data[col.startPosx].posx + 'and' + scope.$index" style="color: red;">{{ precisionProcessing(scope.row.data[col.startPosx], col.dataPrecision) }}</span>
        </el-tooltip>
      </div>

      <div v-else-if="col.color">
        <span :class="scope.row.index + col.key" :style="{color:col.color,cursor:'pointer'}">{{ scope.row[col.key] }}</span>
      </div>

      <span v-else-if="col.fieldCode&&(scope.row[col.key] === undefined || scope.row[col.key] === null || scope.row[col.key] === '')" :class="scope.row.index + col.key">0</span>
      <span v-else-if="scope.row[col.key] === undefined || scope.row[col.key] === null || scope.row[col.key] === ''" :class="scope.row.index + col.key">--</span>
      
      <span v-else-if="col.dataPrecision" :class="scope.row.index + col.key + 5">{{ Number(scope.row[col.key]).toFixed(Number(col.dataPrecision)) }}</span>
      <span v-else-if="ifHTMLShow" :class="scope.row.index + col.key" v-html="scope.row[col.key]"></span>
      <span v-else :class="scope.row.index + col.key">{{ scope.row[col.key] }}</span>
    </template>

    <el-dialog class="iframe-dialog" 
      v-if='editModalShow' 
      title="内容填写" 
      :visible.sync="editModalShow" 
      :close-on-click-modal="false" 
      width="760px" 
      :top="'-10px'"
      :modal-append-to-body="true"
      :append-to-body="true"
      :before-close="editModalClos"
    >
      <el-input type="textarea" maxlength="500" :autosize="{minRows:3,maxRows:6}" placeholder="请输入内容"  v-model="clickRowValue" />
      <div style="text-align:center;padding:10px 0">
        <el-button style="width:200px" @click="editModalShow=false">取消</el-button>
        <el-button style="width:200px" type="primary" @click="interfaceEdit">确认</el-button>
      </div>
    </el-dialog>
  </el-table-column>
</template>
<script>
// import { formatStandardTime } from "@/utils/dateConversion";
const regExp = /^[0-9.-]+$/;
export default {
  name: "column",
  data() {
    return {
    // 弹窗编辑字段
    clickRowKey:'',
    // 确认后的值
    clickRowValue:'',
    // 行数据
    clickRowData:null,
    // 弹窗显示
    editModalShow:false,
    }
  },
  props: {
    col: {
      type: Object,
      default() {
        return {};
      }
    },
    showLen: {
      type: Number,
      default: () => 0
    },
    parentItem: {
      type: Object,
      default: () => {}
    },
    ifHTMLShow:{
      type:Boolean,
      default:false
    },
  },
  created(){
  },

  methods: {
    // 精度处理
    precisionProcessing({ displayValue, fieldType }, precision) {
      if (!regExp.test(displayValue)) {
        return displayValue;
      }

      // if (fieldType === "Date") {
      //   return formatStandardTime(displayValue);
      // }

      const content = displayValue.toString();
      const index = content.indexOf(".");
      if (index > -1) {
        let contentList = content.split(".");
        if (contentList.length !== 2) {
          return displayValue;
        }

        if (contentList[1].length <= Number(precision) || precision === null) {
          return (
            Number(contentList[0]).toLocaleString("en-US") +
            "." +
            contentList[1]
          );
        }

        const finallyValue =
          Number(contentList[0]).toLocaleString("en-US") +
          "." +
          contentList[1].substring(0, Number(precision));

        return finallyValue;
      } else {
        return Number(content).toLocaleString("en-US");
      }
    },



    //自定义表头操作点击
    headerOperation(scope,col){
      this.$emit("headerOperation", scope, col , this.parentItem);
    },

    //自定义表头输入框失去焦点
    headerInputBlur(event,scope,col){
      this.$emit("headerInputBlur", event, scope , col);
    },

    headerInputChange(event,scope,col){
      this.$emit("headerInputChange", event, scope , col);
    },
    
    //自定义表头选择框失去焦点
    headerSelectChange(event,scope,col){
      this.$emit("headerSelectChange", event, scope , col);
    },

    // 选择单元格日期事件
    datePickerOnChange(val) {
      this.$emit("datePickerOnChange", val);
    },

    // input输入框失去焦点监听
    inputOnBlur(row,col,val) {
      this.$emit("inputOnBlur",row,col,val);
    },

    inputChange(row,col,val) {
      // this.$set(row,col.key,val)
      this.$emit("inputChange",row,col,val);
    },
    

    // 打开界面编辑
    openFromInput(row,key){
      console.log(row,key)
      this.clickRowData=row
      this.clickRowKey=key
      this.clickRowValue=row[key]
      this.editModalShow=true
    },
    // 界面编辑
    interfaceEdit(){
      this.editModalShow=false
      this.$set(this.clickRowData,this.clickRowKey,this.clickRowValue)
      // console.log(this.clickRowData,this.clickRowKey,this.clickRowValue)
      this.$emit('interfaceEdit',this.clickRowData,this.clickRowKey,this.clickRowValue)
    },
    //界面关闭
    editModalClos(){
      this.editModalShow=false
    },
    // 计算
    formatData(col, data) {
      // 开始计算
      let factorFormulaList = [];
      if(!col.factorFormulaList) {
        // 加括号是为了防止公式最后面的计算因子漏掉
        let factorFormula = "(" + col.factorFormula + ")";

        console.log("factorFormula", factorFormula);

        // 拆分公式，把计算符号和计算因子按顺序组合成数组
        let factor = "";
        for (const iterator of factorFormula) {
          if(iterator == "(" || iterator == ")" || iterator == "+" || iterator == "-" || iterator == "*" || iterator == "/") {
            if(factor) {
              factorFormulaList.push(factor);
              factor = "";
            }
            factorFormulaList.push(iterator);
          } else {
            factor += iterator;
          }
        }
        console.log("factorFormulaList1", factorFormulaList);

        // 删除头尾的括号
        factorFormulaList.shift();
        factorFormulaList.pop();

        console.log("factorFormulaList2", factorFormulaList);

        this.$set(col, "factorFormulaList", factorFormulaList);
      } else {
        factorFormulaList = col.factorFormulaList;
      }

      console.log("factorFormulaList3", factorFormulaList);

      // 替换计算因子为具体数值(fieldCode)
      let formulaResultList = [];
      for (const iterator of factorFormulaList) {
        if(iterator == "(" || iterator == ")" || iterator == "+" || iterator == "-" || iterator == "*" || iterator == "/" || !isNaN(Number(iterator))) {
          formulaResultList.push(iterator);
        } else {
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const element = data[key];
              if(key.includes(iterator)) {
                formulaResultList.push(element);
              }
            }
          }
        }
      }
      console.log("formulaResultList", formulaResultList);

      // 拼接为可计算公式
      let formulaResult = "";
      for (const iterator of formulaResultList) {
        formulaResult += iterator;
      }

      console.log("formulaResult", formulaResult);

      // 最终计算
      data[col.key] = eval(formulaResult);
      data[col.key] = data[col.key].toFixed(2);
      console.log("item fieldCode", data[col.key]);
    }
  }
};
</script>
<style lang="less" scoped>
  .headerOperation{
    font-weight: 100;
    cursor: pointer;
    float: right;
  }


  .comparisonCss{
    border-radius:50%;width:20px;height:20px;
  }

  .compareCss{
    display: inline-block;
    font-size: 12px;
    width: 100%;
    text-align: center;
    border-radius: 6px;
    height: 20px;
    line-height: 20px;
    margin-left: 5px;
  }

  .redBoderInput /deep/ .el-input__inner{
    border:1px solid red !important;
  }
</style>
