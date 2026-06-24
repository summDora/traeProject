<template>
  <el-table-column :prop="col.key" :label="col.label" :fixed="col.fixed" :width="col.width" :resizable="false" :min-width="col.min_width" :show-overflow-tooltip="true" align="center">
    <template v-if="col.children">
      <column v-for="item in col.children" :key="item.key" :col="item"></column>
    </template>
    <template slot-scope="scope">
      <el-popover v-if="scope.row.hasPopover && col.hasPopover" placement="right-end" :visible-arrow="false" trigger="hover" offset="0" :popper-class="scope.row.index + col.key + 'popover'">
        <span slot="reference" :class="scope.row.index + col.key">{{ scope.row[col.key].toString().trim() ? scope.row[col.key] : '--' }}</span>
      </el-popover>

      <div v-else-if="col.canEdit">
        <el-date-picker v-if="col.editType === 'date'" v-model="scope.row[col.key]" size="mini" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :editable="false" :clearable="true" @change="datePickerOnChange"></el-date-picker>
        <el-input v-else-if="col.editType === 'input'" v-model="scope.row[col.key]" size="mini" :maxlength="col.maxlength" @blur="inputOnBlur"></el-input>
      </div>
      
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
          <span v-if="scope.row.data[col.startPosx].displayValue === undefined || scope.row.data[col.startPosx].displayValue === null || scope.row.data[col.startPosx].displayValue === '' || scope.row.data[col.startPosx].displayValue.toString().trim() === ''" :class="scope.row.data[col.startPosx].posx + 'and' + scope.$index" style="color: red;">--</span>
          <span v-else :class="scope.row.data[col.startPosx].posx + 'and' + scope.$index" style="color: red;">{{ precisionProcessing(scope.row.data[col.startPosx], col.dataPrecision) }}</span>
        </el-tooltip>
      </div>

      <div v-else-if="col.color">
        <span :class="scope.row.index + col.key" :style="{color:col.color,cursor:'pointer'}">{{ scope.row[col.key] }}</span>
      </div>
      
      <span v-else-if="scope.row[col.key] === undefined || scope.row[col.key] === null || scope.row[col.key] === ''" :class="scope.row.index + col.key">--</span>
      
      <span v-else-if="col.dataPrecision" :class="scope.row.index + col.key + 5">{{ Number(scope.row[col.key]).toFixed(Number(col.dataPrecision)) }}</span>
      <span v-else :class="scope.row.index + col.key">{{ scope.row[col.key] }}</span>
    </template>
  </el-table-column>
</template>
<script>
// import { formatStandardTime } from "@/utils/dateConversion";
const regExp = /^[0-9.-]+$/;
export default {
  name: "column",
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
    }
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

    // 选择单元格日期事件
    datePickerOnChange(val) {
      this.$emit("datePickerOnChange", val);
    },

    // input输入框失去焦点监听
    inputOnBlur() {
      this.$emit("inputOnBlur");
    }
  }
};
</script>