<template>
  <div class="hy-table">
    <el-table
        v-bind="$attrs"
        v-set-id
        class="hy-workTable-content"
        :class="ifTableBorder?'tableBorder':''"
        style="width: 100%;"
        :stripe="stripe"
        ref="table"
        v-loading="loadingData"
        v-tableloadmore="tableloadmore"
        element-loading-text="请稍等片刻"
        element-loading-spinner
        element-loading-background
        :row-class-name="tableRowClassNameColor ===true?tableRowClassName:tableSelectRowClassName"
        :fit="true"
        :data="formatData"
        :row-style="showRow"
        :row-key="rowKey"
        :tree-props="treeProps"
        :header-cell-style="headerCellStyle"
        :header-row-style="headerRowStyle"
        header-cell-class-name="table-header"
        :cell-class-name="noNeedChildCheckBox?cellcb:''"
        :cell-style="cellStyle"
        :size="size"
        :default-sort="defaultSort"
        :default-expand-all="defaultExpandAll"
        :height="height"
        @cell-click="cellClick"
        @cell-dblclick="cellDbclick"
        @row-click="rowClick"
        @row-dblclick="rowDblclick"
        @select="handleSelect"
        @select-all="handleAllSelect"
        @current-change="currentChange"
        @selection-change="handleSelectionChange"
        @expand-change="handleExpandChange"
        @sort-change="sortChange"
        border
        :span-method="needSpanMethod ? spanMethod : noSpanMethod"
        :highlight-current-row="highlightCurrentRow"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :empty-text="emptyTextShow ? emptyTextText : '暂无数据' "
        @header-dragend="headerDragend"
    >
      <!-- 是否多选 -->
      <el-table-column type="selection" :selectable="selectable" width="55" align="center" v-if="ifHaveCheckBox"></el-table-column>
      <!-- 比对结果 -->
      <el-table-column
        v-if="ifHaveComparison"
        width="50"
        align="center"
        label="结果"
        :fixed="true">
        <template slot-scope="scope">
          <div v-if="comparisonValue == 'intelligentResult'" class="comparisonCss" :style="{'background':scope.row[comparisonValue]==0?'#73be46':'#d9001b'}"></div>
          <div v-else class="comparisonCss" :style="{'background':comparison(scope.row)||scope.row[comparisonValue]==1?'#73be46':'#d9001b'}"></div>
        </template>
      </el-table-column>
      <!-- 是否单选 -->
      <el-table-column class="radioCss" lable width="55" v-if="ifHaveRadio" :fixed="true">
        <template slot-scope="scope">
          <el-radio
              :label="scope.$index"
              v-model="radio"
              @change.native="getRadio(scope.row,radio)"
          >{{a}}
          </el-radio>
        </template>
      </el-table-column>
      <!-- 是否显示序列 -->
      <el-table-column
        v-if="ifHaveIndex"
        width="65"
        align="center"
        label="序号"
        :fixed="true"
      >
      <template slot-scope="scope">
        <span>{{(page - 1) * pageSize + scope.$index + 1}}</span>
      </template>
      </el-table-column>
      <!-- 是否展开 -->
      <el-table-column width="150" v-if="ifIsExpand&&expandCloumns.length===0">
        <template slot-scope="scope">
          <span class="ms-tree-space" v-for="space in scope.row._level" :key="space"></span>
          <span
              class="tree-ctrl"
              v-if="iconShow(0, scope.row)"
              @click="toggleExpanded(scope.$index)"
          >
            <i v-if="!scope.row._expanded" class="el-icon-plus pointer"></i>
            <i v-else class="el-icon-minus pointer"></i>
          </span>
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column
          v-if="ifIsExpand&&expandCloumns.length>0"
          v-for="(column, index) in expandCloumns"
          :key="column.value"
          :label="column.text"
          :width="column.width"
      >
        <template slot-scope="scope">
          <span
              v-if="index === 0"
              v-for="space in scope.row._level"
              class="ms-tree-space"
              :key="space"
          ></span>
          <span
              class="tree-ctrl"
              v-if="iconShow(index,scope.row)"
              @click="toggleExpanded(scope.$index)"
          >
            <i v-if="!scope.row._expanded" class="el-icon-plus pointer"></i>
            <i v-else class="el-icon-minus pointer"></i>
          </span>
          {{scope.row[column.value]}}
        </template>
      </el-table-column>
      <!-- table数据 -->
      <template v-for="(item) in column">
        <el-table-column
            v-if="item.slot"
            :key="getynamicKey(item.key)"
            class-name="dropColunm"
            :align="item.align || 'left'"
            :label="item.label"
            :isSubmit="item.isSubmit || ''"
            :sortable="item.sortable || false"
            :sort-method="item.sortMethod"
            :min-width="item.width"
            :width="item.baseWidth"
        >
          <template slot-scope="scope">
            <slot :name="item.slot" :row="scope.row"></slot>
          </template>
        </el-table-column>
        <el-table-column
            v-if="item.isLastSlot"
            :key="getynamicKey(item.key)"
            class-name="dropColunm"
            :label="item.colName"
            :isSubmit="item.isSubmit || ''"
            :prop="item.key"
            :align="item.align || 'center'"
            :sortable="item.sortable || false"
            :resizable="false"
            :sort-method="item.sortMethod"
            :min-width="item.width"
            :width="item.baseWidth"
            :fixed="item.fixed ? 'right' : 'right' "
            :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true"
        >
          <template v-if="item.children">
            <multi-column v-for="item in item.children" :ifHTMLShow="ifHTMLShow" :key="item.key" :col="item" @inputOnBlur="inputOnBlur" @inputChange="inputChange"></multi-column>
          </template>
          <template slot-scope="scope">
            <slot
                v-if="item.isLastSlot"
                :data="scope.row"
                :scopeData="scope"
                :name="item.slotName"
                :index="scope.$index"
                :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true"
                :align="item.align ? item.align : 'center'"
            ></slot>

            <el-popover
                v-else-if="scope.row.hasPopover && item.hasPopover"
                placement="right-end"
                :visible-arrow="false"
                trigger="hover"
                offset="0"
                :popper-class="scope.row.index + item.key + 'popover'"
                :content="scope.row[item.key]"
            >
              <span
                  slot="reference"
                  :class="scope.row.index + item.key"
              >{{ scope.row[item.key].toString().trim() ? scope.row[item.key] : '--' }}</span>
            </el-popover>

            <span
                :class="scope.row.index + item.key"
                v-else-if="scope.row[item.key] === undefined || scope.row[item.key] === null || scope.row[item.key] === ''"
            >--</span>
            <span
                v-else-if="item.dataPrecision"
                :class="scope.row.index + item.key + 5"
            >{{ Number(scope.row[item.key]).toFixed(Number(item.dataPrecision)) }}</span>
            <span v-else :class="scope.row.index + item.key">{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
        <el-table-column
            v-if="item.colName == '信息来源</br>/校核内容'"
            :key="getynamicKey(item.key)"
            class-name="xxlyjhnr"
            :label="item.colName"
            :isSubmit="item.isSubmit || ''"
            :prop="item.key"
            :align="item.align || 'center'"
            :sortable="item.sortable || false"
            :resizable="false"
            :sort-method="item.sortMethod"
            :min-width="item.width"
            :width="item.baseWidth"
            :fixed="item.fixed"
            :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true"
        >
          <template slot="header" slot-scope="scope">
            <div class="header-div" >
                <div class="header-col1">校核内容</div>
                <div class="header-col2">信息来源</div>
                <div class="header-line"></div>
              </div>
          </template>
          <template slot-scope="scope">
            <span style="height: 50px;line-height: 50px;" :class="scope.row.index + item.key">{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
        <!--表头-->
        <el-table-column
            v-else
            :key="getynamicKey(item.key)"
            class-name="dropColunm"
            :label="item.colName"
            :isSubmit="item.isSubmit || ''"
            :prop="item.key"
            :align="item.align || 'center'"
            :sortable="item.sortable || false"
            :resizable="true"
            :sort-method="item.sortMethod"
            :min-width="item.width"
            :width="item.baseWidth"
            :fixed="item.fixed"
            :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true"
        > 
          <template slot="header" slot-scope="scope">
            <div style="width:100%" v-if="item.editType==='1'">
              <el-input :disabled="item.disabled==='1'" style="width:60%" v-model="item.colName" size="mini" :maxlength="100" @blur="headerInputBlur($event,scope,item)" @input="headerInputChange($event,scope,item)"/>
              <span @click="headerOperation(scope,item)" class="headerOperation" v-if="item.operateType&&item.disabled!=='1'" :style="{'color':item.operateType==='add'?'#67c23a':'#f56c6c'}">
                <span v-if="item.operateType==='add'">+</span><span v-if="item.operateType==='delete'">X</span>{{item.operateName}}
              </span>
            </div>
            <div v-else  style="text-align: center;">
              <!-- <span v-if="item.isSubmit&&item.isSubmit==1" v-html="item.colName"></span> -->
              <span v-html="item.colName"></span>
            </div>
          </template>
          <template v-if="item.children">
            <multi-column :ifHTMLShow="ifHTMLShow" v-for="i in item.children" :key="i.key" :col="i" :parentItem="item"
            @inputOnBlur="inputOnBlur" @inputChange="inputChange" @headerOperation="headerOperation" 
            @headerInputBlur="headerInputBlur" @headerInputChange="headerInputChange" @headerSelectChange="headerSelectChange"
            @interfaceEdit="childInterfaceEdit"
            >
              <template v-for="slot in Object.keys($scopedSlots)" #[slot]="scope">
                <slot
                  v-if="i.isSlot"
                  :data="JSON.stringify(scope.data)"
                  :scopeData="slot"
                  :name="i.slotName"
                  :index="scope.index"
                  :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true"
                  :align="item.align ? item.align : 'center'"
                ></slot>
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
            <slot
                v-if="item.isSlot"
                :data="scope.row"
                :scopeData="scope"
                :name="item.slotName"
                :index="scope.$index"
                :show-overflow-tooltip="item.showOverflowTooltip === false ? false : true"
                :align="item.align ? item.align : 'center'"
            ></slot>

            <el-popover
                v-else-if="scope.row.hasPopover && item.hasPopover"
                placement="right-end"
                :visible-arrow="false"
                trigger="hover"
                offset="0"
                :popper-class="scope.row.index + item.key + 'popover'"
                :content="scope.row[item.key]"
            >
              <span
                  slot="reference"
                  :class="scope.row.index + item.key"
              >{{ scope.row[item.key].toString().trim() ? scope.row[item.key] : '--' }}</span>
            </el-popover>

            <!-- 动态配置fieldType 输入框:1  文本框:2  下拉框:3  数字框:4  刪除按鈕:5 -->
            <div v-else-if="item.fieldType&&scope.row.isEdit" style="padding:5px 0">
              <!-- 输入框 -->
              <div v-if="item.fieldType=='1'&&item.compare!=='1'&&item.compare!=='2'">
                <el-input :disabled="item.disabled==='1'||scope.row[item.key]=='—'" size="mini" :maxlength="100" v-model="scope.row[item.key]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                  @input="inputChange(scope.row,item,scope.row[item.key])"
                ></el-input>
              </div>
              <!-- 文本框 -->
              <el-input 
                :disabled="item.disabled==='1'"
                v-if="item.fieldType === '2'&&item.compare!=='1'&&item.compare!=='2'"
                type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
                v-model="scope.row[item.key]" 
                @focus="openFromInput(scope.row,item.key)" readonly
                @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                @input="inputChange(scope.row,item,scope.row[item.key])">
              </el-input>

              <!-- 下拉框 -->
              <div v-if="item.fieldType=='3'&&item.compare!=='1'&&item.compare!=='2'">
                <el-select :disabled="item.disabled==='1'" :clearable="true"  v-model="scope.row[item.key]" size="mini" @change="selectChange(scope.row,item,scope.row[item.key])">
                  <el-option v-for="itemSelect in item.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
                  </el-option>
                </el-select>
              </div>
              <!-- 数字框 -->
              <div v-if="item.fieldType=='4'&&item.compare!=='1'&&item.compare!=='2'">
                <el-input-number :disabled="item.disabled==='1'" size="mini" :controls="false"  :precision="0" v-model="scope.row[item.key]"
                 @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                 @input="inputChange(scope.row,item,scope.row[item.key])"
                ></el-input-number>
              </div>


              <!--送审有比对结果的类型-->
              <!-- 输入框 -->
              <div v-if="item.fieldType=='1'&&item.compare==='1'" style="display:flex;align-items: center;">
                <el-input style="width:60%" :disabled="item.disabled==='1'||scope.row[`${item.key}`]=='—'" size="mini" :maxlength="100" v-model="scope.row[item.key]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                  @input="inputChange(scope.row,item,scope.row[item.key])"
                ></el-input>
                <div style="width:40%" v-if="scope.row[item.key+'_dl']">
                  <span v-if="scope.row[item.key]==scope.row[item.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[item.key+'_dl']}}</span>
                  <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[item.key+'_dl']}}</span>
                </div>
              </div>
              <!-- 文本框 -->
              <div v-if="item.fieldType=='2'&&item.compare==='1'" style="display:flex;align-items: center;">
                <el-input 
                  style="width:60%"
                  :disabled="item.disabled==='1'"
                  type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
                  v-model="scope.row[item.key]" 
                  @focus="openFromInput(scope.row,item.key)" readonly
                  @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                  @input="inputChange(scope.row,item,scope.row[item.key])"
                  >
                </el-input>
                <div style="width:40%" v-if="scope.row[item.key+'_dl']">
                  <span v-if="scope.row[item.key]==scope.row[item.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[item.key+'_dl']}}</span>
                  <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[item.key+'_dl']}}</span>
                </div>
              </div>
              <!-- 下拉框 -->
              <div v-if="item.fieldType=='3'&&item.compare==='1'" style="display:flex;align-items: center;">
                <el-select :disabled="item.disabled==='1'" :clearable="true"  v-model="scope.row[item.key]" size="mini" @change="selectChange(scope.row,item,scope.row[item.key])">
                  <el-option v-for="itemSelect in item.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
                  </el-option>
                </el-select>
                <div style="min-width:33px" v-if="scope.row[item.key+'_dl']">
                  <span v-if="Number(scope.row[item.key])==scope.row[item.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[item.key+'_dl']}}</span>
                  <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[item.key+'_dl']}}</span>
                </div>
              </div>
              <!-- 数字框 -->
              <div v-if="item.fieldType=='4'&&item.compare==='1'" style="display:flex;align-items: center;">
                <el-input-number 
                  :disabled="item.disabled==='1'" size="mini" :controls="false"  :precision="0" 
                  v-model="scope.row[item.key]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                  @input="inputChange(scope.row,item,scope.row[item.key])"
                ></el-input-number>
                <div style="min-width:33px" v-if="scope.row[item.key+'_dl']">
                  <span v-if="Number(scope.row[item.key])==scope.row[item.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[item.key+'_dl']}}</span>
                  <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[item.key+'_dl']}}</span>
                </div>
              </div>
              <!-- 又是输入框又是数字 -->
              <div v-if="item.fieldType=='6'&&item.compare==='1'" style="display:flex;align-items: center;">
                <el-input v-if="scope.row[`${item.key}`]!='—'" style="width:60%" :disabled="item.disabled==='1'" size="mini" maxlength="100" v-model="scope.row[item.key]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[item.key])"
                  @input="inputChange(scope.row,item,scope.row[item.key])"
                ></el-input>
                <div v-if="scope.row[`${item.key}`]=='—'">/</div>
                <div style="width:33px" v-if="scope.row[item.key+'_dl']">
                  <span v-if="scope.row[item.key]==scope.row[item.key+'_dl']" class="compareCss" style="background:#73be46;color:white">{{scope.row[item.key+'_dl']==='—'?'/':scope.row[item.key+'_dl']}}</span>
                  <span v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[item.key+'_dl']==='—'?'/':scope.row[item.key+'_dl']}}</span>
                </div>
              </div>
              


              <!--专家评审有比对结果的类型-->
              <!-- 输入框 -->
              <div v-if="item.fieldType=='1'&&item.compare==='2'" style="display:flex;align-items: center;">
                <div style="width:40%">
                  <span>{{scope.row[item.key]}}</span>
                </div>
                <el-input 
                  v-if="scope.row[item.key]==scope.row[`${item.key}_zj`]"
                  style="width:60%" :disabled="item.disabled==='1'||scope.row[`${item.key}_zj`]=='—'" size="mini" :maxlength="100" 
                  v-model="scope.row[`${item.key}_zj`]" @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])" @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])"></el-input>
                <el-input 
                  v-else
                  class="redBoderInput"
                  style="width:60%" :disabled="item.disabled==='1'" size="mini" maxlength="100" 
                  v-model="scope.row[`${item.key}_zj`]" @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])" @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])"
                ></el-input>
              </div>
              <!-- 文本框 -->
              <div v-if="item.fieldType=='2'&&item.compare==='2'" style="display:flex;align-items: center;">
                <div style="width:40%">
                  <span>{{scope.row[item.key]}}</span>
                </div>
                <el-input 
                  v-if="scope.row[item.key]==scope.row[`${item.key}_zj`]"
                  :disabled="item.disabled==='1'"
                  type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
                  v-model="scope.row[`${item.key}_zj`]" 
                  @focus="openFromInput(scope.row,item.key)" readonly
                  @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])"
                  @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])">
                </el-input>
                <el-input 
                  v-else
                  class="redBoderInput"
                  :disabled="item.disabled==='1'"
                  type="textarea" resize="none" :rows="2" size="mini" :maxlength="200" 
                  v-model="scope.row[`${item.key}_zj`]" 
                  @focus="openFromInput(scope.row,item.key)" readonly
                  @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])"
                  @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])">
                </el-input>
                
              </div>

              <!-- 下拉框 -->
              <div v-if="item.fieldType=='3'&&item.compare==='2'" style="display:flex;align-items: center;">
                <div style="min-width:33px">
                  <span>{{scope.row[item.key]}}</span>
                </div>
                <el-select v-if="Number(scope.row[item.key])==scope.row[`${item.key}_zj`]" :disabled="item.disabled==='1'" :clearable="true"  v-model="scope.row[`${item.key}_zj`]" size="mini" @change="selectChange(scope.row,item,scope.row[`${item.key}_zj`])">
                  <el-option v-for="itemSelect in item.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
                  </el-option>
                </el-select>
                <el-select v-else class="redBoderInput" :disabled="item.disabled==='1'" :clearable="true"  v-model="scope.row[`${item.key}_zj`]" size="mini" @change="selectChange(scope.row,item,scope.row[`${item.key}_zj`])">
                  <el-option v-for="itemSelect in item.tableDictValue" :key="itemSelect.dictId" :label="itemSelect.dictName" :value="itemSelect.dictId">
                  </el-option>
                </el-select>
              </div>
              <!-- 数字框 -->
              <div v-if="item.fieldType=='4'&&item.compare==='2'" style="display:flex;align-items: center;">
                <div style="width:33px">
                  <span>{{scope.row[item.key]}}</span>
                </div>
                <el-input-number 
                  v-if="Number(scope.row[item.key])==scope.row[`${item.key}_zj`]"
                  :disabled="item.disabled==='1'" size="mini" :controls="false"  :precision="0" 
                  v-model="scope.row[`${item.key}_zj`]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])"
                  @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])"
                ></el-input-number>
                <el-input-number 
                  v-else
                  class="redBoderInput"
                  :disabled="item.disabled==='1'" size="mini" :controls="false"  :precision="0" 
                  v-model="scope.row[`${item.key}_zj`]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])"
                  @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])"
                ></el-input-number>
              </div>
              <!-- 又是输入框又是数字 -->
              <div v-if="item.fieldType=='6'&&item.compare==='2'" style="display:flex;align-items: center;">
                <div style="width:33px">
                  <span>{{scope.row[item.key]==='—'?'/':scope.row[item.key]}}</span>
                </div>
                <el-input 
                  v-if="scope.row[item.key]==scope.row[`${item.key}_zj`]&&scope.row[`${item.key}_zj`]!='—'"
                  style="width:60%" :disabled="item.disabled==='1'" size="mini" maxlength="100" 
                  v-model="scope.row[`${item.key}_zj`]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])"
                  @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])"
                  ></el-input>
                <el-input 
                  v-if="scope.row[item.key]!=scope.row[`${item.key}_zj`]&&scope.row[`${item.key}_zj`]!='—'"
                  class="redBoderInput"
                  style="width:60%" :disabled="item.disabled==='1'" size="mini" maxlength="100" 
                  v-model="scope.row[`${item.key}_zj`]" 
                  @blur="inputOnBlur(scope.row,item,scope.row[`${item.key}_zj`])"
                  @input="inputChange(scope.row,item,scope.row[`${item.key}_zj`])"
                ></el-input>
                <div v-if="scope.row[`${item.key}_zj`]=='—'">/</div>
              </div>
            </div>
            

            <!--送审有比对结果不带填写框的类型-->
            <!-- 不可编辑时 -->
            <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="item.compare==='1'&&item.fieldType&&!scope.row.isEdit">
              <div>
                <span>{{scope.row[item.key]==='—'?'/':scope.row[item.key]}}</span>
              </div>
              <div v-if="scope.row[`${item.key}_dl`]">
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-if="scope.row[item.key]==scope.row[`${item.key}_dl`]" class="compareCss" style="background:#73be46;color:white">{{scope.row[`${item.key}_dl`]==='—'?'/':scope.row[`${item.key}_dl`]}}</span>
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[`${item.key}_dl`]==='—'?'/':scope.row[`${item.key}_dl`]}}</span>
              </div>
            </div>
            <!-- 查看时 -->
            <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="item.compare==='1'&&!item.fieldType">
              <div>
                <span>{{scope.row[item.key]==='—'?'/':scope.row[item.key]}}</span>
              </div>
              <div v-if="scope.row[`${item.key}_dl`]">
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-if="scope.row[item.key]==scope.row[`${item.key}_dl`]" class="compareCss" style="background:#73be46;color:white">{{scope.row[`${item.key}_dl`]==='—'?'/':scope.row[`${item.key}_dl`]}}</span>
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[`${item.key}_dl`]==='—'?'/':scope.row[`${item.key}_dl`]}}</span>
              </div>
            </div>

            <!--专家评审有比对结果不带填写框的类型-->
            <!-- 不可编辑时 -->
            <div v-else-if="item.fieldType&&item.compare==='2'&&!scope.row.isEdit" style="padding:5px 0;display:flex;align-items: center;">
              <div>
                <span>{{scope.row[item.key]==='—'?'/':scope.row[item.key]}}</span>
              </div>
              <div v-if="scope.row[`${item.key}_zj`]">
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-if="scope.row[item.key]==scope.row[`${item.key}_zj`]" class="compareCss" style="background:#73be46;color:white">{{scope.row[`${item.key}_zj`]==='—'?'/':scope.row[`${item.key}_zj`]}}</span>
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[`${item.key}_zj`]==='—'?'/':scope.row[`${item.key}_zj`]}}</span>
              </div>
            </div>
            <!-- 查看时 -->
            <div style="padding:5px 0;display:flex;align-items: center;" v-else-if="item.compare==='2'&&!item.fieldType">
              <div>
                <span>{{scope.row[item.key]==='—'?'/':scope.row[item.key]}}</span>
              </div>
              <div v-if="scope.row[`${item.key}_zj`]">
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-if="scope.row[item.key]==scope.row[`${item.key}_zj`]" class="compareCss" style="background:#73be46;color:white">{{scope.row[`${item.key}_zj`]==='—'?'/':scope.row[`${item.key}_zj`]}}</span>
                <span :style="{'min-width':Number(scope.row[item.key])!==NaN?'33px':'40%'}" v-else class="compareCss" style="background:#d9001b;color:white">{{scope.row[`${item.key}_zj`]==='—'?'/':scope.row[`${item.key}_zj`]}}</span>
              </div>
            </div>

            <!-- 只展示，但是有计算公式 -->
            <!-- <span style="padding:5px 0" v-else-if="item.fieldCode&&(scope.row[item.key] === undefined || scope.row[item.key] === null || scope.row[item.key] === '')">
              <span>0</span>
            </span> -->

            <span
                :class="scope.row.index + item.key"
                style="display: flex;justify-content: center;"
                v-else-if="scope.row[item.key] === undefined || scope.row[item.key] === null || scope.row[item.key] === ''"
            > {{ modelItem ? '/' : '--' }}</span>
            <span
                v-else-if="item.dataPrecision"
                :class="scope.row.index + item.key + 5"
            >{{ Number(scope.row[item.key]).toFixed(Number(item.dataPrecision)) }}</span>
            <span style="color:#409eff;cursor:pointer" v-else-if="item.clickColor">{{ scope.row[item.key] }}</span>
            <!-- 正常显示 -->
            <span v-else-if="ifHTMLShow" style="display: flex;justify-content: center;align-items: center;" :class="scope.row.index + item.key" v-html="scope.row[item.key]"></span>
            <span v-else style="display: flex;justify-content: center;align-items: center;" :class="scope.row.index + item.key">{{ scope.row[item.key] }}</span>
          </template>
        </el-table-column>
      </template>
      <!-- 修改删除操作 -->
      <el-table-column
          label="操作"
          align="center"
          width="320"
          :fixed="ifFixed ? 'right' : 'right'"
          v-if="isHaveEdit||isHaveDelete||isHaveSuspend||isHaveRecovery||isHaveAdd||isHaveChangePass||isHaveBid||isHaveBidEditHandle||isHaveExport"
      >
        <template slot-scope="scope">
          <el-button
              size="mini" type="primary"
              icon="el-icon-edit-outline"
              v-if="isHaveEdit"
              @click.stop="editHandle(scope)"
          >
            编辑
          </el-button>
          <i class="el-icon-delete pointer" v-if="isHaveDelete" @click.stop="deleteHandle(scope)"></i>
          <i
              class="el-icon-circle-plus-outline pointer"
              v-if="isHaveAdd&&!scope.row.closeAdd"
              @click.stop="addHandle(scope)"
          ></i>
          <i
              class="el-icon-edit-outline pointer"
              v-if="isHaveChangePass"
              @click.stop="changePassHandle(scope)"
          ></i>
          <span
              class="text pointer"
              v-if="isHaveSuspend&&!scope.row.ifZ"
              @click.stop="suspendHandle(scope)"
          >暂停</span>
          <span
              class="text pointer"
              v-if="isHaveRecovery&&scope.row.ifZ"
              @click.stop="recoveryHandle(scope)"
          >恢复</span>
          <el-button
              size="mini" type="primary"
              icon="el-icon-download"
              v-if="isHaveExport"
              @click.stop="exportHandle(scope)"
          >
            导出
          </el-button>
          <span class="text pointer" v-if="isHaveBid" @click.stop="bidHandle(scope)">查看标段信息</span>
          <span
              class="text pointer"
              v-if="isHaveBidEditHandle"
              @click.stop="bidEditHandle(scope)"
          >维护</span>
        </template>
      </el-table-column>
      <el-table-column v-if="columControl" width="50">
        <template #header="{ row }">
          <el-button icon="el-icon-menu" size="mini" circle @click="dialogVisible = !dialogVisible"></el-button>
        </template>
      </el-table-column>
      <slot></slot>
    </el-table>
    <el-dialog title="字段显隐控制" :visible.sync="dialogVisible" class="dialogCustom" width="33px">
      <el-checkbox-group v-model="selection">
        <el-checkbox
            v-for="(check, index) in initColum"
            :key="index"
            :label="check.key"
            style="display: block;margin: 10px;"
        >{{check.label}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>


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
  // import Sortable from "";
  export default {
    name: "workTable",
    directives: {
      setId(el, binding, vnode) {
        vnode.context.$nextTick(() => {
          let aTh = el.getElementsByTagName("th");
          let thArr = Array.from(aTh);
          thArr.forEach((th, idx) => {
            th.dataset.id = idx;
          });
        });
      }
    },
    props: {
      pageName: {
        type: String,
        default: () => ""
      },
      tableData: {
        type: Array,
        default: () => []
      },
      stripe:{
        type: Boolean,
        default: () => true
      },
      column: {
        type: Array,
        default: () => []
      },
      size: {
        type: String,
        default: () => "medium "
      },
      expandCloumns: {
        type: Array,
        default: () => [{ width: "100" }]
      },
      isHaveEdit: {
        type: Boolean,
        default: () => false
      },
      isHaveDelete: {
        type: Boolean,
        default: () => false
      },
      isHaveAdd: {
        type: Boolean,
        default: () => false
      },
      isHaveChangePass: {
        type: Boolean,
        default: () => false
      },
      isHaveSuspend: {
        type: Boolean,
        default: () => false
      },
      isHaveRecovery: {
        type: Boolean,
        default: () => false
      },
      isHaveExport: {
        type: Boolean,
        default: () => false
      },
      isHaveBid: {
        type: Boolean,
        default: () => false
      },
      isHaveBidEditHandle: {
        type: Boolean,
        default: () => false
      },
      showLen: {
        type: Number,
        default: () => 0
      },
      ifHaveCheckBox: {
        type: Boolean,
        default: () => false
      },
      ifHaveComparison: {
        type: Boolean,
        default: () => false
      },
      comparisonValue: {
        type: String,
        default: () => '_dl',
      },
      ifHaveRadio: {
        type: Boolean,
        default: () => false
      },
      notHaveRadioDefaultSelect: {
        type: Boolean,
        default: () => false
      },
      ifIsExpand: {
        type: Boolean,
        default: () => false
      },
      tableRowClassNameColor: {
        type: Boolean,
        default: false
      },
      // 是否需要改变表头样式
      needHeaderStyle: {
        type: Boolean,
        default: false
      },
      // 是否需要改变行样式
      needCellStyle: {
        type: Boolean,
        default: false
      },
      //是否要边框
      ifTableBorder: {
        type: Boolean,
        default: false
      },
      //树形表格多选/子级隐复选框
      noNeedChildCheckBox: {
        type: Boolean,
        default: false
      },
      ifHaveIndex: {
        type: Boolean,
        default: () => false
      },
      evalFunc: Function,
      evalArgs: Array,
      expandAll: {
        type: Boolean,
        default: false
      },
      rowKey: {
        type: String,
        default: "id"
      },
      treeProps: {
        type: Object,
        default: () => ({ children: "children", hasChildren: "hasChildren" })
      },
      columControl: {
        type: Boolean,
        default: false
      },
      defaultSort: {
        type: Object,
        default: () => ({})
      },
      defaultExpandAll: {
        type: Boolean,
        default: false
      },
      dropColumn: {
        type: Boolean,
        default: false
      },
      dropRow: {
        type: Boolean,
        default: false
      },
      isExcel: {
        type: Boolean,
        default: false
      },
      height: [String, Number],
      border: {
        type: Boolean,
        default: true
      },
      ifFixed: {
        type: Boolean,
        default: false
      },
      // 是否需要合并单元格
      needSpanMethod: {
        type: Boolean,
        default: false
      },
      needMergeSpan: {
        type: Array
      },
      needMergeSpanMeet: {
        type: Array
      },
      /**
       * 联系单对应关系
       */
      linkCodeObj: {
        type: Object,
      },
     
      //是否需要表格加载
      loadingData: {
        type: Boolean,
        default: false
      },
      highlightCurrentRow: {
        type: Boolean,
        default: false
      },
      showSummary:{
        type:Boolean,
        default:false
      },
      // summaryMethod:Function,
      page: {
        type: Number,
        default: () => 1,
      },
      pageSize: {
        type: Number,
        default: () => 10,
      },
      allowXmzt: {
        type: String,
        default: () => '0,1,2',
      },
      //区分列表种类
      tableType: {
        type: String,
        default: ""
      },
      //是否需要html格式展示数据
      ifHTMLShow:{
        type:Boolean,
        default:false
      },
      //控制空数据时显示的文本内容
      emptyTextShow:{
        type:Boolean,
        default:false
      },
      //空数据时显示的文本内容
      emptyTextText:{
        type:String,
        default:'当前校核全部通过，点击展开可查看通过的校核项'
      },
      modelItem:{
        // type:String,
        // default:''
      },
      treeSourceData:{
        // type:Object,
        // default:{}
      },

    },

    components: {
      multiColumn
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
        selectRow:[],
        selectData:[],

        // 弹窗编辑字段
        clickRowKey:'',
        // 确认后的值
        clickRowValue:'',
        // 行数据
        clickRowData:null,
        // 弹窗显示
        editModalShow:false,
        //单元格合并对象
        hbObj:{},
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
        this.initColum.forEach(c => {
          if (this.selection.includes(c.key)) {
            newColumn.push(c);
          }
        });
        return newColumn;
      }
    },
    watch: {
      tableData() {
        if(this.notHaveRadioDefaultSelect){
          this.radio = "";
        }else{
          this.radio = 0;
        }
        if (this.tableData.length && this.needSpanMethod) {
          for ( let i of this.needMergeSpan ) {
            const name = i.split('$')[0];
            let code = '';
            if (this.linkCodeObj[name]) {
              code = this.linkCodeObj[name];
            }
            this[`spanArr_${i}`] = [];
            this[`spanArrIndex_${i}`] = null;
            this.getSpanArr(
              this.tableData,
              this[`spanArr_${i}`],
              this[`spanArrIndex_${i}`],
              i,
              code,
            );
          }
        }
        // this.$nextTick(()=>{
        //   this.$refs.table.doLayout()
        // })
      },
      selectData(data){
        this.selectRow=[]
        console.log(data)
        if(data.length>0){
          data.forEach((item,index)=>{
            //如果是不需要子级复选框的树形列表
            if(this.noNeedChildCheckBox){
              this.selectRow.push(item.noNeedChildCheckBoxNum)
              if(item.children){
                for(let child of item.children){
                  this.selectRow.push(child.noNeedChildCheckBoxNum)
                }
              }
            }else{
              this.selectRow.push(this.tableData.indexOf(item))
            }
            
          })
        console.log(this.selectRow)
        }
      },
    },
    mounted() {
      if (this.needSpanMethod) {
        for ( let i of this.needMergeSpan ) {
          this[`spanArr_${i}`] = [];
          this[`spanArrIndex_${i}`] = null;
        }
        this.mergeSpan = this.m_copy(this.needMergeSpan);
      }
      this.initColum = this.m_copy(this.column);
      this.selection = this.column.map(c => c.key);
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
      cellClick(row, colum , cell , event) {
        this.$emit("cellClick",row, colum , cell , event,this.modelItem,this.treeSourceData);
      },
      selectable(row,index){
        //多级列表子级禁用复选框
        if(this.noNeedChildCheckBox){
          if(row.children){
            row.isDisable=false
          }else{
            row.isDisable=true
          }
        }


        if(row.isDisable){
          return false
        }else{
          return true
        }
      },
      cellDbclick(row, column, cell, event){
        this.$emit("cellDbclick",row, column , cell , event);
      },
      rowClick(e, i , colum) {
        this.$emit("rowClick", e, i , colum);
        if(e.isEdit) return false;
        this.$set(e, "isEdit", true);
        // console.log(e,"rowClickrowClick")
        
        // console.log(this.$refs.table)
        // const index = this.formatData.indexOf(e);
        // if(e.isDisable){
        //   return
        // }
        // this.radio = index;
        // this.$refs.table.toggleRowSelection(e)
      },
      rowDblclick(e, i) {
        this.$emit("rowDblclick", e, i);
      },
      handleSelect(selection,row){
        
      },
      handleAllSelect(selection){
        // console.log(selection)
      },

      tableSelectRowClassName({row,rowIndex}){
        // return row.className 
        if(row.num&&row.noNeedChildCheckBoxNum&&!this.stripe){
          if(row.num%2){
            return ''
          }else{
            return 'huiseBg'
          }
        }
        if(this.tableType==="打分表"){
          if(row.rowNum%2){
            return ''
          }else if(row.title == '总分'||row.title == '合计'){
            return 'fixedRow'
          }else {
            return 'huiseBg'
          }
        }
      },

      currentChange(currentRow,oldCurrentRow){
        // this.$refs.table.toggleRowSelection(currentRow,true);
        // this.$refs.table.toggleRowSelection(oldCurrentRow,false);
      },
     
      editHandle(scope) {
        this.$emit("editHandle", scope);
      },
      tableRowClassName({ row, rowIndex }) {
        if (row.status === "评审中" || row.isPs == 0) {
          return "hasYellow";
        }else if(row.title == '总分') {
          return 'fixedRow'
        } else {
          if(rowIndex % 2) {
            return "hasBlue";
          } else {
            return "hasWhite";
          }
        }
      },
      
      deleteHandle(scope) {
        this.$confirm("是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          customClass:this.$store.state.fusionVersion?"fusionVersionMessageBox":'',
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
      getRadio(row,e) {
        // console.log(row)
        this.$emit("getRadio", row);
      },

      //比对结果
      comparison(row){
        let arr=[]
        for(let key in row){
          if(key.indexOf(this.comparisonValue)!==-1){
            arr.push(key)
          }
        }
        let result=true
        for(let item of arr){
          if(row[item]!=row[item.replace(this.comparisonValue,"")]){
            result=false
          }
        }
        if(!arr.length) {
          result=false;
        }
        return result
      },
      //输入框失去焦点
      inputOnBlur(row,col,val){
        this.$emit("inputOnBlur",row,col,val);
      },
      inputChange(row,col,val){
        this.$forceUpdate()
        // this.$set(row,col.key,val)
        this.$emit("inputChange",row,col,val);
      },
      //下拉框改变
      selectChange(row,col,val){
        this.$emit("selectChange",row,col,val);
      },
      //自定义表头操作点击
      headerOperation(scope,col,parentItem){
        this.$emit("headerOperation",scope,col,parentItem);
      },
      //自定义表头输入框失去焦点
      headerInputBlur(event,scope,col){
        this.$emit("headerInputBlur",event,scope,col);
      },
      headerInputChange(){
        this.$emit("headerInputChange",event,scope,col);
        this.$forceUpdate()
      },
      //自定义表头多选框改变
      headerSelectChange(event,scope,col){
        this.$emit("headerSelectChange",event,scope,col);
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
        if(this.ifHaveCheckBox){
          this.selectData=val
        }
        this.$emit("handleSelectionChange", val);
        this.$refs.table.doLayout()
      },
      cellStyle({row,column,rowIndex,columnIndex}) {
        // console.log(column)
        this.$emit('cellStyle',row,column,rowIndex,columnIndex,)
        if(this.needCellStyle && this.tableType == '5.3系统功能清单-表格汇总'){
          if(row.featureLevel==1){
            // return {'background-color':'#409effd9 !important'}
            return {'background-color':'#96CAFF !important'}
          }
          if(row.featureLevel==2){
            // return {'background-color':'#409eff8c !important'}
            return {'background-color':'#C8E3FF !important'}
          }
          if(row.featureLevel==3){
            // return {'background-color':'#409eff4a !important'}
            return {'background-color':'#fff !important'}
          }
        }
        if(this.needCellStyle && (this.tableType == '5.3系统功能清单-目录名称' || this.tableType == '三.基础信息校核')){
          if(rowIndex % 2 == 1){
            return {'background-color':'#409eff4a !important'}
          }
        } 
        if(this.selectRow.includes(rowIndex)){
          return {'background-color':'#d5e9ff !important'}
        }
        //打分表-平均分一列字体加粗(sjb)
        if(this.tableType==="打分表"){
          if(column.property==="平均分"){
            return {
              'font-size':'16px !important',
              'font-weight':'700',
              'color': '#606266'
            }
          }
        }
      },
      showRow({row,rowIndex}) {
        // const show = row.row.parent
        //   ? row.row.parent._expanded && row.row.parent._show
        //   : true;
        // row.row._show = show;
        // return show
        //   ? "animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;"
        //   : "display:none;";
        
      },
      headerCellStyle(param) {
        // console.log(param,'1')
        if(this.tableType==="打分表"){
          if(param.column.label.includes('</br>')){
            return {
              "background": "#E9EBF0 0% 0% no-repeat",
              "border": "1px solid #f5f7fa !important",
            };
          }else{
            return {
              "background": "#409effc9",
              "border": "1px solid #f5f7fa !important",
            };
          }
        }
        if(this.tableType == '自校核固定校核表'){
          let newArr1 = ["consPrimaryModule",'consSecondModule',"consThirdModule","consDetailDescription","kybggnqd"]
          if(newArr1.includes(param.column.property)){ // 浅黄
            return {
              "background": "#FFF5E0 !important",
              "border":'#FFF5E0 !important',
            };
          }
          let newArr2 = ["primaryModule",'secondModule',"thirdModule","detailDescription","kybgxmnr"]
          if(newArr2.includes(param.column.property)){  //浅蓝
            return {
              "background": "#CDEEFC !important",
              "border":'#CDEEFC !important',
            };
          }else{
            return {
              "background": "#EDF6FA !important",
              "border":'#EDF6FA !important',
            };
            
          }
        }
        if(this.tableType == '校核表'){
          // console.log(param,'param')
          let arr = ['supplementValue1','fieldContent']
          if(arr.includes(param.column.property)){ //浅绿
            return {
              "background": "#C0F2E380 !important",
              "border":'#C0F2E380 !important',
            };
          }
          let arr1 = ["contrastValue",'kybgxmnr',"primaryModule","secondModule","thirdModule","detailDescription",'gss1','psyj']
          if(arr1.includes(param.column.property)){ // 浅黄
            return {
              "background": "#FFF5E0 !important",
              "border":'#FFF5E0 !important',
            };
          }
          let arr2 = ["intelligentValue",'kybggnqd',"consPrimaryModule","consSecondModule","consThirdModule","consDetailDescription",'kybb','gss2']
          if(arr2.includes(param.column.property)){  //浅蓝
            return {
              "background": "#CDEEFC !important",
              "border":'#CDEEFC !important',
            };
          }else{
            return {
              "background": "#EDF6FA !important",
              "border":'#EDF6FA !important',
            };
            
          }
        }
        if(this.tableType == '可研内容校核'){
          // console.log(param,'param')
          
          if(param.column.property == 'xtgnqd'){ //深绿
            return {
              "background": "#67C23A !important",
              "border":'#67C23A !important',
            };
          }
          if(param.column.property == 'percent'){ // 粉红
            return {
              "background": "#EC808D !important",
              "border":'#EC808D !important',
            };
          }
          let arr = ['consPrimaryModule','consSecondModule','consThirdModule','consDetailDescription']
          if(arr.includes(param.column.property)){ //浅绿
            return {
              "background": "#A0CE57 !important",
              "border":'#A0CE57 !important',
            };
          }
          // let arr1 = ['xsd33']
          // if(arr1.includes(param.column.property)){ // 粉红
          //   return {
          //     "background": "#EC808D !important",
          //     "border":'#EC808D !important',
          //   };
          // }
          let arr2 = ['kydzb']
          if(arr2.includes(param.column.property)){ // 深蓝
            return {
              "background": "#298BF5 !important",
              "border":'#298BF5 !important',
            };
          }
          let arr3 = ['serialNumber','primaryModule','secondModule','thirdModule','detailDescription']
          if(arr3.includes(param.column.property)){  //浅蓝
            return {
              "background": "#95C6FA !important",
              "border":'#95C6FA !important',
            };
          }else{
            return {
              // "background": "#EDF6FA !important",
              // "border":'#EDF6FA !important',
              "background": "#95C6FA !important",
              "border":'#95C6FA !important',
            };
            
          }
        }
        if(this.tableType == '可研对照表校核'){
          // console.log(param,'param')
          let arr = ['consPrimaryModule','consSecondModule','consThirdModule','consDetailDescription']
          if(arr.includes(param.column.property)){ //浅绿
            return {
              "background": "#A0CE57 !important",
              "border":'#A0CE57 !important',
            };
          }
          let arr1 = ['percent']
          if(arr1.includes(param.column.property)){ // 粉红
            return {
              "background": "#EC808D !important",
              "border":'#EC808D !important',
            };
          }
          let arr2 = ['primaryModule','secondModule','thirdModule','detailDescription']
          if(arr2.includes(param.column.property)){  //浅蓝
            return {
              "background": "#95C6FA !important",
              "border":'#95C6FA !important',
            };
          }else{
            return {
              // "background": "#EDF6FA !important",
              // "border":'#EDF6FA !important',
              "background": "#95C6FA !important",
              "border":'#95C6FA !important',
            };
            
          }
        }

        if(this.tableType == '5.3系统功能清单-目录名称' || this.tableType == '三.基础信息校核'){
          return {
            "background": "#95c6fa !important",
            "border":'#95c6fa !important',
          };
        }
        if(this.tableType == '5.3系统功能清单-表格汇总'){
          return {
            "background": "#298bf5 !important",
            "border":'#298bf5 !important',
            "color":'#fff'
          };
        }
        if(this.tableType == '可研-概设功能点对比'){
          if(this.needHeaderStyle&&(param.column.property&&param.column.property.includes("feasibilityName")) || (param.column.label == '结果' || param.column.label == '序号')){
            return {
              "background": "#95c6fa !important",
              "border":'#95c6fa !important',
            };
          }
          if(this.needHeaderStyle&&param.column.property&&param.column.property.includes("preliminaryName")){
            return {
              "background": "#9cd082 !important",
              "border":'#9cd082 !important',
            };
          }
          if(this.needHeaderStyle&&param.column.property&&param.column.property.includes("cause")){
            return {
              "background": "#F56C6C !important",
              "border":'#F56C6C !important',
            };
          }
          if(this.needHeaderStyle&&param.column.property&&param.column.property==="kydzb"){
            return {
              "background": "#298bf5 !important",
              "border":'#298bf5 !important',
            };
          }
          if(param.column.property==="xtgnqd"){
            return {
              "background": "#67c23a !important",
              "border":'#67c23a !important',
            };
          }
        }
       
        if (param.columnIndex === 0) {
          return {
            "text-align": "center",
            "font-size": "14px",
            "background": "#E9EBF0 0% 0% no-repeat",
            "border":'rgba(255, 255, 255, 0)'
          };
        }
        if (this.pageName==="requirementReview"&&(param.column.label === "软件功能项等级系数</br>（1一5）"||param.column.label === "最小功能单元个数")) {
          return {
            "background": "#d5e9ff !important",
            "border":'#d5e9ff !important',
          };
        }
        if (param.columnIndex === 0) {
          return {
            "text-align": "center",
            "font-size": "14px",
            "background": "#E9EBF0 0% 0% no-repeat",
            "border":'rgba(255, 255, 255, 0)'
          };
        }
        return {
          "background": "#E9EBF0 0% 0% no-repeat",
          "font-size": "14px",
          "border":'rgba(255, 255, 255, 0)'
        };
      },
      headerRowStyle(param) {
        return {
          "background": "#E9EBF0 0% 0% no-repeat",
          "height":"47px",
          "border":'none'
        }
      },
      cellcb(row){
        if(!row.row.children){
          return 'noNeedChildCheckBoxCss'
        }
      },
      sortChange({ column, prop, order }) {
        this.$emit("sortChange", column , prop , order);
      },
      //行拖拽
      rowDrop() {
        // if (this.dropRow) {
        //   const tbody = document.querySelector(
        //     ".hy-table .el-table__body-wrapper tbody"
        //   );
        //   Sortable.create(tbody, {
        //     onEnd: e => {
        //       let oldTit = this.tableData.splice(e.oldIndex, 1);
        //       this.tableData.splice(e.newIndex, 0, ...oldTit);
        //       this.$emit("rowDrop", this.tableData);
        //     }
        //   });
        // }
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
        
        
        // console.log(data,arr,arrIndex,key01,key02)
        //根据两个key值 //判断当前元素是否与上一元素相同
        key02 ? (key02 = key02) : (key02 = "");
        if (key02 && typeof key02 === 'string') {
          for ( let index = 0; index < data.length; index++ ) {
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
        } 
        else if (key02 && typeof key02 === 'object') {
          for ( let index = 0; index < data.length; index++ ) {
            if (index === 0) {
              arr.push(1);
              arrIndex = 0;
            } else {
              let isMethod = true;
              for (let i = 0; i < key02.length; i += 1) {
                if (data[index][key02[i]] !== data[index - 1][key02[i]]) {
                  isMethod = false;
                }
              }
              if (
                data[index][key01] === data[index - 1][key01] && isMethod
              ) {
                arr[arrIndex] += 1;
                arr.push(0);
              } else {
                arr.push(1);
                arrIndex = index;
              }
            }
          }
        } 
        else {
          //判断当前元素是否与上一元素相同
          for ( let index = 0; index < data.length; index++ ) {
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
        // console.log("合并下标",arrIndex,arr)
        //用于传给后台的合并下标
        let hbarray = [];
        let hbarr = arr;
        for(let i = 0; i < hbarr.length; i++) {
          if(hbarr[i]) {
             for(let j = 0; j < hbarr[i]; j++) {
              let a = (i + 1) + "-" + (hbarr[i] + i) ;
              hbarray.push(a);
            }
          }
        }
        // console.log(hbarray)
        this.hbObj[key01]=hbarray
        this.$nextTick(()=>{
          this.$refs.table.doLayout()
        })
        // console.log(this.hbObj)
        this.$emit("getSpanArr",this.hbObj)
      },
      noSpanMethod({ row, column, rowIndex, columnIndex }){
        if(this.modelItem && (this.modelItem.tableCode == 'designDevelopmentWorkloadList' || this.modelItem.tableCode == 'designDevelopmentCostList')){ //"设计开发工作量明细表"
        let newArr = Object.keys(row)
        if( Object.keys(row).includes('isEdit') ){
          newArr.splice(Object.keys(row).length - 1 , 1)
        }
          // if(columnIndex === 4 ) {
          //   //  return {
          //   //   rowspan: 4,
          //   //   colspan: 1
          //   // }
          // }else{
          //   return {
          //     rowspan: 1,
          //     colspan: 1
          //   }
          // }
        if (rowIndex === 0 && columnIndex === newArr.length - 1) {
          return [4,1]; 
        } else if (columnIndex === 0) {
          return [1, 1]; 
        }
          
        }
        return
        console.log(row)
      },
      // 合并单元格
      spanMethod({ row, column, rowIndex, columnIndex }) {
        
        if(this.needMergeSpanMeet && this.needMergeSpanMeet.length > 0) {
          if(columnIndex === 2 || columnIndex === 3 || columnIndex === 6 || columnIndex === 7) {
             return {
              rowspan: this.needMergeSpanMeet[rowIndex],
              colspan: 1
            }
          }else {
            return {
              rowspan: 1,
              colspan: 1
            }
          }
        }

        const set = new Set(this.mergeSpan);
        let _row = ''
        if (set.has(column.property)) {
          if(this.needMergeSpanMeet && this.needMergeSpanMeet.length > 0) {
            if(columnIndex === 1) {
               return {
                rowspan: this.needMergeSpanMeet[rowIndex],
                colspan: 1
              }
            }else {
              return {
                rowspan: 1,
                colspan: 1
              }
            }
           
          }else {
              _row = this[`spanArr_${column.property}`][rowIndex];
              return {
                rowspan: _row,
                colspan: _row ? 1 : 0
              };
          }
         
        }

        // this.$nextTick(()=>{
        //   this.$refs.table.doLayout()
        // })
       

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
      summaryMethod(param){
        const {columns,data}=param
        // console.log(columns,data,'summarycolumns')
        // console.log(data,'summarydata')
        // return
        const sums=[]
        columns.forEach((colum,index)=>{
          if(index===0){
            sums[index]="合计"
            return
          }
          // console.log(colum)
          // 
          if(colum.label!=='小计（一级功能）'){
            const values=data.map(item=> Number(item[colum.property]))
            if(!values.every(value=>isNaN(value))&&colum.property.indexOf("hjl@")!==-1){
              sums[index]=values.reduce((prev,curr)=>{
                const value=Number(curr)
                if(!isNaN(value)){
                  return prev+curr
                }else{
                  return prev
                }
              },0)
            }else{
              sums[index]=""
            }
          }else if(colum.label==='小计（一级功能）'){
            //计算
            // console.log(data,'summaryData')
            let gzl=""
            let xjTotal=0
            for (let key in data[0]) {
              
              if((key.indexOf("系统功能开发工作量")!==-1||key.indexOf("系统功能优化工作量")!==-1)&&key.indexOf("_dl")==-1){
                gzl=key
              }
            }
              console.log(data)
            for(let item of data){
              xjTotal+=Number(item[gzl])
            }
            sums[index]=xjTotal
            console.log(sums[index])
            
          }
          // else if(colum.label==='评分'){
          //   //计算
          //   let total=0
          //   for(let i=data.length-1;i>0;i--){
          //     if(data[i].title!==data[i-1].title){
          //       total+=Number(data[i-1].demandScore)
          //     }
          //   }
          //   total=Number(total).toFixed(1)
          //   sums[index]=total
          //   console.log(sums[index])
          // }
        })
        return sums
      },

      // 打开界面编辑
      openFromInput(row,key){
        this.clickRowData=row
        this.clickRowKey=key
        this.clickRowValue=row[key]
        this.editModalShow=true

      },
      // 界面编辑确认
      interfaceEdit(){
        this.editModalShow=false
        this.$set(this.clickRowData,this.clickRowKey,this.clickRowValue)
        // console.log(this.clickRowData,this.clickRowKey,this.clickRowValue)
        this.tableData.push({})
        this.tableData.pop()
        this.$forceUpdate()
        console.log(this.tableData)
        this.$emit('formModelEdit',this.clickRowData,this.clickRowKey,this.clickRowValue)
      },
      
      childInterfaceEdit(clickRowData,clickRowKey,clickRowValue){
        this.$set(clickRowData,clickRowKey,clickRowValue)
        this.tableData.push({})
        this.tableData.pop()
        this.$forceUpdate()
        console.log(this.tableData)
        this.$emit('formModelEdit',clickRowData,clickRowKey,clickRowValue)
      },

      //界面关闭
      editModalClos(){
        this.editModalShow=false
      },

      headerDragend(newWidth, oldWidth, column, event) {},
        
      //表格触底事件
      tableloadmore(){
        this.$emit('tableloadmore')
      },
      
    }
  };
</script>

<style scoped>
  @import "./index.css";
  .el-table .hasYellow {
    background: #fde6c3;
  }
  .el-table /deep/ .fixedRow{
    display: table-row;
    position: sticky;
    bottom: 0;
    width: 100%;
    font-weight: 700; 
    /* color:#606266; */
  }
  .el-table /deep/ .fixedRow td{
    border: 1px solid #f5f7fa !important;
    background:#409effc9 !important;
  }
  .el-table /deep/ .fixedRow td .cell{
    font-size:16px !important;
  }

  /* .el-table {
  .el-table__body {
    // 吸底
    .fixed-row.el-table__row {
      display: table-row;
      position: sticky;
      bottom: 0;
      width: 100%;
      td {
        border: 1px solid #fff;
        box-shadow: 2px -2px 3px 0px #ddd;
      }
    }
  }
} */


  .el-table .hasBlue {
    background: #f2f3f6;
  }

  .el-table .hasWhite {
    background: #ffffff;
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
    /* transition: all 0.1s;
    border: 1.2px solid #235fe1c7; */
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
  .el-table th.gutter{
    background: #e9ebf0;
  }
  /* .el-popper[x-placement^=bottom]{
    box-shadow: 0 0px 10px rgba(35, 95, 225, 0.5);
  } */

  /* .el-table__header-wrapper {
    .has-gutter {
      tr {
        color: #808e9e;
      }

      tr:first-child {
        color: #6b7178;
      }
      tr:last-child {
        color: #808e9e;
      }
    }
  } */

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
    border-left: none;
  }

  .hy-workTable-content /deep/ .table-header{
    border:1px solid #dedfe1 !important;
  }

  .el-table__row--striped td {
    background: #f2f3f6 !important;
    /* background: #a5aeb71f !important; */
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

  .el-table__body tr.current-row>td {
    /* background-color: #3d6fe07a !important; */
    background-color: rgb(213, 233, 255) !important;
  }

   .hy-workTable-content /deep/ .el-table .el-table__fixed{
    height:auto !important
  }

  .hy-workTable-content /deep/  .el-table__fixed{
     bottom:0px !important;
  }

  .hy-workTable-content /deep/ .el-table__body-wrapper{
    z-index:2;
  }

  .tableSelectRowBg td{
    background:#a2baf0 !important;
  }

  .noNeedChildCheckBoxCss .el-checkbox__input{
    display:none;
  }

  /* .el-table__expand-icon{
  position: absolute !important;
  left: 0;
  top: 10px;
  } */
  .huiseBg{
    background:#f2f3f6 !important;
  }
  .lanseBg{
    background:#409eff !important;
  }

  .headerOperation{
    font-weight: 100;
    cursor: pointer;
    float: right;
  }

  /*合计删除边框*/
 .hy-workTable-content /deep/ .el-table__footer-wrapper{
   height:45px !important;
 }
 .hy-workTable-content /deep/ .el-table__footer{
   height:45px !important;
 }
 .hy-workTable-content /deep/ .el-table__footer td{
   border:none !important;
   background: #f2f3f6 !important;
 }
 .hy-workTable-content /deep/ .has-gutter{
   height:45px !important;
 }
  .hy-workTable-content /deep/ .has-gutter td{
    height:45px !important;
    border:none !important;
    background: #f2f3f6 !important;
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
    border:1px solid red !important;;
  }

  .el-table thead.is-group th {
    background-color: #fff !important;
    border:rgba(255, 255, 255, 0) !important;
  }
  .el-table td,.el-table th.is-leaf {
    /* border-color: #22273426 !important; */
    border:rgba(255, 255, 255, 0) !important;
  }

 .tableBorder /deep/ .el-table__body td {
    /* border: none; */
    border: 0.5px solid #e4e7ed !important;
  }
  .tableBorder /deep/ .el-table td,
  .el-table th.is-leaf {
    /* border-color: #22273426 !important; */
    border:rgb(204, 204, 204) !important;
  }
  .tableBorder /deep/ .el-table thead.is-group th {
    border:rgb(204, 204, 204) !important;
  }

  .el-table__body tr.hover-row>td {
    background: rgba(41, 139, 245, 0.1) !important;
    transition: all .05s !important;
  }
  /* .hy-workTable-content /deep/ .el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
      background: rgba(41, 139, 245, 0.1) !important;
      transition: all .05s !important;
  } */

.el-table--enable-row-hover .el-table__body tr:hover>td.el-table__cell{
    background: rgba(41, 139, 245, 0.1) !important;
      transition: all .05s !important;
  }

  .el-table--enable-row-hover .el-table__body .fixedRow:hover>td.el-table__cell{
    background: #409effc9 !important;
  }

 

</style>

<style lang="less" scoped>
 /* /deep/.dropColunm {
    padding: 0px !important;
  }
  
 /deep/.cell {
    padding: 0 !important;
  } */
  /deep/.xxlyjhnr{
    padding: 0 !important;
    .cell {
      padding: 0 !important;
    }
  }
  .header-div {
    height: 80px;
    position: relative;
  }
  .header-col1 {
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 14px;
    margin-left: 10px;
  }
  .header-col2 {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
    margin-right: 10px;
  }
  .header-line {
    padding-left: 0;
    width: 1px;
    height: 150px;
    transform: rotate(-56deg); /*这里需要自己调整，根据线的位置*/
    -webkit-transform-origin: top;
    transform-origin: top;
    background-color: #ffffff63;
  }
</style>
