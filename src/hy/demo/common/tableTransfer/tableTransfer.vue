<template>
  <section style="width: 100%;">
    <div class="table-transfer">
      <div class="table-transfer-one">
        <div class="title" v-text="text[0]"></div>
        <div class="content">
          <hyNewForm
              class="assignFormCss"
              labelPosition="left"
              :formConfig='tableOneConfig.searchConfig'
              :formData='tableOneConfig.searchData'
              @onSearch="onSearch1"
              @onReset="onReset1"
              @formSelectchange="formSelectChanged1"
              :ifSearch1="true"
              :ifReset="true">
          </hyNewForm>
          <hyNewTable
              :ifHaveIndex="false"
              @handleSelectionChange="handleSelectionChange1"
              :column="tableOneConfig.column"
              :height="dialogHeight"
              :tableData="tableData1"
              :ifHaveCheckBox="true"
              :page="searchObj1.page"
              :pageSize="searchObj1.rows"
          ></hyNewTable>
          <el-pagination
            class="hy_two_pageBox"
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page="searchObj1.page"
            :page-sizes="[20, 40, 60 ,100]"
            :page-size="searchObj1.rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total1"
          ></el-pagination>
        </div>
      </div>
      <section class="table-transfer-button">
        <el-button type="primary" :style="table2SelectRow && table2SelectRow.length ? '': 'opacity: 0.5'" @click="toLeft" circle icon="el-icon-back"></el-button>
        <el-button type="primary" :style="table1SelectRow && table1SelectRow.length ? '': 'opacity: 0.5'" @click="toRight" circle icon="el-icon-right"></el-button>
      </section>
      <div class="table-transfer-two">
        <div class="title" v-text="text[1]"></div>
        <div class="content">
          <hyNewForm
              class="assignFormCss"
              labelPosition="left"
              :formConfig='tableTwoConfig.searchConfig'
              :formData='tableTwoConfig.searchData'
              @formSelectchange="formSelectChanged2"
              @onSearch="onSearch2"
              @onReset="onReset2"
              :ifSearch1="true"
              :ifReset="true"
              :ifSlot="true">
          </hyNewForm>
          <div v-if="ifHaveZZ || ifHavePSFZR || (ifHaveDXTZ && dxType)" style="text-align:right;padding:5px 10px;border: 1px solid #E3E3E7;border-bottom:none">
              <el-button slot="button" size="small" type="primary" v-if="ifHaveZZ" @click="handleClickZZ">设为组长</el-button>
              <el-button slot="button" size="small" type="primary" v-if="ifHavePSFZR" @click="handleClickPSFZR">设为评审负责人</el-button>
              <el-button slot="button" size="small" type="primary" v-if="ifHaveDXTZ && dxType" @click="handleClickDXTZ">短信通知</el-button>
          </div>
          <hyNewTable
              :ifHaveIndex="false"
              @handleSelectionChange="handleSelectionChange2"
              :column="tableTwoConfig.column"
              :height="this.ifHaveZZ || this.ifHavePSFZR || (this.ifHaveDXTZ && this.dxType) ? dialogHeight-43 : dialogHeight"
              :tableData="tableData2"
              :ifHaveCheckBox="true"
          >
          <!-- 评审角色科技项目会议管理需要 -->
         <template slot="psjs" slot-scope="scope">
                <span>
                  <el-select v-model="psjs" clearable  placeholder="请选择" style="width:100%" >
                    <el-option v-for="item in zyfxOptions" :key="item.dataVal"  :value="item.dataVal" :label="item.dataLabel" >
                    </el-option>
                  </el-select>
                </span>
            </template>
          </hyNewTable>
          <el-pagination
            class="hy_two_pageBox"
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="searchObj2.page"
            :page-sizes="[20, 40, 60 ,100]"
            :page-size="searchObj2.rows"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total2"
          ></el-pagination>
        </div>
      </div>
    </div>
    <div class="footerBtn" v-if="hasFooterBtn">
      <el-button @click="onCancle">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
    <div class="footerBtn" v-if="hasKJFooterBtn">
      <el-button @click="onCancle" style="width:200px">取消</el-button>
      <el-button type="primary" @click="onSubmit" style="width:200px">保存</el-button>
    </div>
  </section>
</template>

<script>
import common from '@/utils/common.js'
export default {
    name: "tableTransfer",

    data() {
      return {
        dialogHeight:493,
        searchObj1: { page: 1, rows: 20 },
        searchObj2: { page: 1, rows: 20 },
        total1:0,
        total2:0,
        tableHeight1: 493,
        // tableHeight1: 543,
        tableHeight2: this.ifHaveZZ || this.ifHavePSFZR || (this.ifHaveDXTZ && this.dxType) ? 450 : 493,
        // tableHeight2: 600,
        tableData1:[],
        tableData2: [],
        table1SelectRow: [],
        table2SelectRow: [],
        companys1: [],
        companys2: [],
        selectKey1: '',
        selectKey2: '',
        psjs: '',
        zyfxOptions: [
          {dataLabel: '财务专家', dataVal: '1'}
        ]
      };
    },

    props: {
      text: {
        type: Array,
        default: () => ['待选专家', '已选专家'],
      },
      tableOneConfig: {
        required: true,
        default: () => {
        },
        type: Object,
      },
      tableTwoConfig: {
        required: true,
        default: () => {
        },
        type: Object,
      },
      hasFooterBtn: {
        required: true,
        default: () => false,
        type: Boolean,
      },
      hasKJFooterBtn: {
        default: () => false,
        type: Boolean,
      },
      apiFn1: {
        default: () => '',
        type: Function,
      },
      apiFn2: {
        default: () => '',
        type: Function,
      },
     
      params1: {
        default: () => {},
        type: Object,
      },
      params2: {
        default: () => {},
        type: Object,
      },
      ifHaveZZ: {
        default: () => false,
        type: Boolean,
      },
      ifHavePSFZR: {
        default: () => false,
        type: Boolean,
      },
      isZyObj: {
        default: () => {},
        type: Object,
      },
      dxType: {
         default: () => '',
         type: String
      },
      PCisZyObj: {
        default: () => {},
        type: Object,
      },
      isKJmeetObj: {
        default: () => {},
        type: Object,
      },
      toRightSuccess: {
        default: () => 0,
        type: Number,
      },
      toLeftSuccess: {
        default: () => 0,
        type: Number,
      },
      ifHaveDXTZ: {
        default: () => false,
        type: Boolean,
      },
      zzApiFn: {
        default: () => '',
        type: Function,
      },
    },
    watch: {
      "$store.state.dialogHeight":{
        handler:function(newVal,oldVal){
          console.log(newVal,"newVal")
          this.dialogHeight=newVal?newVal-190:493
        }
      },
      isZyObj: {
        handler(val) {
          if(val.isZy === '0') {
            this.params1.groupId = val.id
            this.params1.majorId = ''
            this.getTableData1();
          }else{
            this.params1.majorId = val.id?val.id:val.groupId
            this.params1.groupId = ''
            this.getTableData1();
          }
      //  this.params1.majorId = val.id
      //  this.params1.groupId = ''
      //  this.getTableData1();
       },
       deep: true
      },
      PCisZyObj: {
        handler(val) {
          this.params1.majorId = val.id?val.id:val.groupId
          this.getTableData1();
        },
        deep: true
      },
      isKJmeetObj: {
        handler(val) {
          this.params1.compId = val.id
          this.getTableData1();
        },
        deep: true
      },
      toRightSuccess: {
        handler(val) {
          if(val) {
             this.getTableData1();
             this.getTableData2();
          }
        },
        deep: true
      },
      toLeftSuccess: {
        handler(val) {
          if(val) {
             this.getTableData1();
             this.getTableData2();
          }
        },
        deep: true
      }
    },
    mounted() {
      
      this.getTableData1();
      this.getTableData2();
    },

    methods: {
      // 字段脱敏
      getDesenData (str, s, e) {
        if (str) {
          return common.setDesen(str, s, e)
        }
        return ''
      },

      formSelectChanged1(e,selectKey){
        // console.log(11111111111,e,selectKey)
        this.selectKey1 = selectKey
        this.companys1 = e
      },
       formSelectChanged2(e,selectKey){
        this.selectKey2 = selectKey
        this.companys2 = e
      },
      // 表格一查询
      onSearch1() {
        if(this.selectKey1 === 'companys') {
          this.params1.companys = this.companys1
        }else if(this.selectKey1 === 'orgids') {
          this.params1.orgids = this.companys1
        }
        this.searchObj1.page = 1;
        this.getTableData1();
      },

      onSearch2() {
         if(this.selectKey2 === 'companys') {
          this.params2.companys = this.companys2
        }else if(this.selectKey2 === 'orgids') {
          this.params2.orgids = this.companys2
        }
        this.searchObj2.page = 1;
        this.getTableData2();
      },
      // 表一重置
      onReset1() {
        this.$emit('onReset1',this.params1)
        this.searchObj1.page = 1;
        this.getTableData1();
      },

     // 表二重置
      onReset2() {
        this.$emit('onReset2',this.params2)
        this.searchObj2.page = 1;
        this.getTableData2();
      },
      /**
       * 表格1
       * 行选择事件
       */
      handleSelectionChange1(val) {
        this.table1SelectRow = val;
      },

     async getTableData1() {
      let resp=await this.m_apiFn(this.apiFn1)(Object.assign(this.params1,this.searchObj1))
          if(resp.result && resp.result.rows&&  resp.result.rows.length > 0) {
          //   resp.result.forEach(item => {
          //    if(item.tel) {
          //     item.tel = this.getDesenData(item.tel,3,7) //脱敏过滤（电话号码）
          //    }else if(item.ETEl) {
          //      item.ETEl = this.getDesenData(item.ETEl,3,7) //脱敏过滤（电话号码）
          //    }else if(item.ETEL) {
          //      item.ETEL = this.getDesenData(item.ETEL,3,7) //脱敏过滤（电话号码）
          //    }
          //  })
            this.tableData1 = resp.result.rows.map(item => {
              if(item.tel) {
                item.tel = this.m_phoneNumDesensitization(item.tel);
              }else if(item.ETEl) {
                item.ETEl = this.m_phoneNumDesensitization(item.ETEl);
              }else if(item.ETEL) {
                item.ETEL = this.m_phoneNumDesensitization(item.ETEL);
              }
              return item;
            });
            this.total1=resp.result.total
            // console.log('tableData1',this.tableData1);
            
          }else {
            this.tableData1 = []
            this.total1=0
          }
      },

      /**
       * 表格2
       * 行选择事件
       */
      handleSelectionChange2(val) {
        this.table2SelectRow = val;
      },

     async getTableData2() {
      let resp=await this.m_apiFn(this.apiFn2)(Object.assign(this.params2,this.searchObj2))
          if(resp.result &&resp.result.rows &&  resp.result.rows.length) {
          //   resp.result.forEach(item => {
          //    if(item.tel) {
          //     item.tel = this.getDesenData(item.tel,3,7) //脱敏过滤（电话号码）
          //    }else if(item.ETEl) {
          //      item.ETEl = this.getDesenData(item.ETEl,3,7) //脱敏过滤（电话号码）
          //    }else if(item.ETEL) {
          //      item.ETEL = this.getDesenData(item.ETEL,3,7) //脱敏过滤（电话号码）
          //    }
          //  })
            this.tableData2 = resp.result.rows.map(item => {
              if(item.tel) {
                item.tel = this.m_phoneNumDesensitization(item.tel);
              }else if(item.ETEl) {
                item.ETEl = this.m_phoneNumDesensitization(item.ETEl);
              }else if(item.ETEL) {
                item.ETEL = this.m_phoneNumDesensitization(item.ETEL);
              }
              return item;
            });
            this.total2=resp.result.total
          }else {
            this.tableData2 = []
            this.total2=0
          }
      },

      /**
       * toLeft 移除会议专家
       */
      toLeft() {
         if(!this.table2SelectRow.length) {
          this.$message.warning("请选择数据")
          return
        }
        this.$emit('toLeft',this.params2,this.table2SelectRow)
      },

      // 添加会议专家
      toRight() {
        if(!this.table1SelectRow.length) {
          this.$message.warning("请选择数据")
          return
        }
        this.$emit('toRight',this.params1,this.table1SelectRow)
      },
      
      onSubmit() {

      },
      onCancle() {
        
      },
      // 设为组长
     async handleClickZZ() {
      if (!this.table2SelectRow.length) {
        this.$message.warning("请选择要设为组长的数据");
        return;
      } else if (this.table2SelectRow.length > 1) {
        this.$message.warning("请逐条选择数据不可多选");
        return;
      }
      const params = {
        hybh:	this.params2.hybh,
        xmbhs: this.params2.xmbhs,
        zjgh:	this.table2SelectRow[0].zjgh,
        sfzz: '1'		 //（0 专家 1 组长 2 负责人）
      }
      let resp=await this.m_apiFn(this.zzApiFn)(params)
          if(resp.statusCode === '200') {
             this.$message.success(resp.message);
             this.$emit('successSubmit')
               return;
          }else {
            //  this.$message.error(resp.message);
             return
          }
      },

      // 设为评审负责人
     async handleClickPSFZR() {
      if (!this.table2SelectRow.length) {
        this.$message.warning("请选择要设为评审负责人的数据");
        return;
      } else if (this.table2SelectRow.length > 1) {
        this.$message.warning("请逐条选择数据不可多选");
        return;
      }
      const params = {
        hybh:	this.params2.hybh,
        xmbhs: this.params2.xmbhs,
        zjgh:	this.table2SelectRow[0].zjgh,
        sfzz: '2'		 //（0 专家 1 组长 2 负责人）
      }
      let resp=await this.m_apiFn(this.zzApiFn)(params)
          if(resp.statusCode === '200') {
             this.$message.success(resp.message);
             this.$emit('successSubmit')
               return;
          }else {
            //  this.$message.error(resp.message);
             return
          }
      },
      //短信通知
      handleClickDXTZ() {
        this.$emit('handleClickDXTZ',this.dxType,this.table2SelectRow)
      },

      // 页面显示行数变化
      handleSizeChange1(e) {
        this.searchObj1.page = 1;
        this.searchObj1.rows = e;
        this.getTableData1();
      },

      // 显示页数变化
      handleCurrentChange1(e) {
        this.searchObj1.page = e;
        this.getTableData1();
      },

      // 页面显示行数变化
      handleSizeChange2(e) {
        this.searchObj2.page = 1;
        this.searchObj2.rows = e;
        this.getTableData2();
      },

      // 显示页数变化
      handleCurrentChange2(e) {
        this.searchObj2.page = e;
        this.getTableData2();
      },

    },
  }
</script>

<style lang="less" scoped>
  .table-transfer {
    display: flex;
    // flex: 1 0 0;
    width: 100%;
  }

  .table-transfer-one, .table-transfer-two {
    width: 48%;
    display: flex;
    flex-direction: column;
    // display: flex;
    // flex-direction: column;
    overflow: hidden;
    // box-sizing: border-box;
    // flex: 1 0 0;
    .title {
      font-size: 14px;
      font-weight: bold;
      font-family: Source Han Sans CN;
      color: #434250;
      display: flex;
      height: 38px;
      align-items: center;

      &::before {
        content: '';
        width: 8px;
        height: 14px;
        background-color: #2988f5;
        margin-right: 5px;
      }
    }

    .content {
      .el-form {
        border: 1px solid rgba(67, 66, 93, 0.15);
        border-bottom: 0;
        padding: 16px 10px;
        box-sizing: border-box;
      }
    }
  }

  .table-transfer-button {
    width: 4%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    /deep/  .el-button.is-circle {
      display: flex;
    }
    /deep/ .el-button + .el-button {
      margin: 10px 0 0 0;
      display: flex;
    }
  }

  .footerBtn {
    text-align: center;
    margin-top: 18px
  }

  .assignFormCss{
  padding: 10px 10px !important;
}
.assignFormCss /deep/ .submitBox{
  display: inline-block ;
  
}

.assignFormCss /deep/ .el-form-item {
  line-height: 0 !important;
}
</style>