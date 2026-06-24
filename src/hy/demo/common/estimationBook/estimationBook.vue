<template>
  <hyNewModal :dialogVisible="dialogVisible" :showClose="true" isJx :ifThird="true" :ifCancle="false" :ifSure="false" :title="title" width="65%" styleSelf="min-width: 870px;" @closeHandle="closeHandle" :modalAppendToBody="true" :appendToBody="true">
      <div style="margin-top:20px" class="main">
        <el-tabs v-model="tabsValue" type="card" @tab-click="tabClick" class="main-tab">
            <el-tab-pane
                v-for="item in tabs"
                :key="item.name"
                :label="item.title"
                :name="item.name"
            > 
            </el-tab-pane>
          </el-tabs>
           <hyNewTable
              ref="projectTableRef"
              :rowKey="'id'"
              :ifHaveIndex="false"
              :column="columnConfig"
              :ifFixed="true"
              v-if="tableHeight"
              :height="tableHeight"
              :tableData="tableData"
            >
            </hyNewTable>
           
      </div>
  </hyNewModal>
</template>
<script>
import {  
    jxgczb1ColumnConfig,
    sbjxzyhzbb2jColumnConfig,
    jzxszyhzbb2yColumnConfig,
    sbjxdwgcbb3jColumnConfig,
    jzxsdwgcbb3yColumnConfig,
    jzxsgcqfbColumnConfig,
    qtfybbsb4ColumnConfig,
    jgpjhzbfb1ColumnConfig,
    ygpjhzbfb2ColumnConfig,
    bzjzqicbfb3ColumnConfig,
    bzjzqicbfb4ColumnConfig,
    spdxljxpjtjbfb5ColumnConfig,
    sdxljxtsfljsbfb6ColumnConfig,
    sdxlgdyszljsbfb7ColumnConfig,
    sdxlgdysgcljsbfb8ColumnConfig,
    kcfmxbfb9ColumnConfig,
    kcffzcdbfb10ColumnConfig,
    sjfmxbfb11ColumnConfig,
    pjgzfmxbColumnConfig,
    kdkzzsfxbColumnConfig,
    sbjxzyhzbb2j2020ColumnConfig,
    jzxszthzbb2y2020ColumnConfig,
    jzxsgczyhzbqf2020ColumnConfig,
    sbjxdwgcbb2j2020ColumnConfig,
    jzxsdwgcbb3y2020ColumnConfig,
    ywqljsb2020ColumnConfig,
    spdxlgctsfljsb2020ColumnConfig,
    spdxlgcgdyszljsb2020ColumnConfig,
    spdxlgcgdysgcljsb2020ColumnConfig,
    bzjzqjcb2020ColumnConfig,
    jxpjtjbfb22020ColumnConfig,
    jxcltjbfb32020ColumnConfig,
    jgpjhzb2020ColumnConfig,
    ygpjhzb2020ColumnConfig,
    ygwjjclhzb2020ColumnConfig,
    rghzb2020ColumnConfig,
    clhzb2020ColumnConfig,
    jzxscljchzb2020ColumnConfig,
    phbclhzb2020ColumnConfig,
    jxhzb2020ColumnConfig,
    jzxsjxjchzb2020ColumnConfig,
    kcfmxb2020ColumnConfig,
    kcffzcdb2020ColumnConfig,
    sjfmxb2020ColumnConfig,
    zhjhzb2020ColumnConfig,
    pjgzfmxb2020ColumnConfig,
    gclhzb2020ColumnConfig,
    zhdxzjxsjsbfb12020ColumnConfig,
    jgwjjclhzb2020ColumnConfig
} from "./config";

export default {
  name: "estimationBook", // 估算书
  components: {
     
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false
    },
    getGusEmptyTableByXmid: {
       type: Function,
      default: () => null
    },
    getDwsb4SuanData: {
      type: Function,
      default: () => null
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    title:{
      type: String,
      default: () => '估算书查看'
    }
  },
  data() {
    return {
        tabsValue: '',
        tableHeight: 166,
        columnConfig: [],
        tabs: [],
        tableData: [],
        // 表格表头
        jxgczb1ColumnConfig,
        sbjxzyhzbb2jColumnConfig,
        jzxszyhzbb2yColumnConfig,
        sbjxdwgcbb3jColumnConfig,
        jzxsdwgcbb3yColumnConfig,
        jzxsgcqfbColumnConfig,
        qtfybbsb4ColumnConfig,
        jgpjhzbfb1ColumnConfig,
        ygpjhzbfb2ColumnConfig,
        bzjzqicbfb3ColumnConfig,
        bzjzqicbfb4ColumnConfig,
        spdxljxpjtjbfb5ColumnConfig,
        sdxljxtsfljsbfb6ColumnConfig,
        sdxlgdyszljsbfb7ColumnConfig,
        sdxlgdysgcljsbfb8ColumnConfig,
        kcfmxbfb9ColumnConfig,
        kcffzcdbfb10ColumnConfig,
        sjfmxbfb11ColumnConfig,
        pjgzfmxbColumnConfig,
        kdkzzsfxbColumnConfig,
        sbjxzyhzbb2j2020ColumnConfig,
        jzxszthzbb2y2020ColumnConfig,
        jzxsgczyhzbqf2020ColumnConfig,
        sbjxdwgcbb2j2020ColumnConfig,
        jzxsdwgcbb3y2020ColumnConfig,
        ywqljsb2020ColumnConfig,
        spdxlgctsfljsb2020ColumnConfig,
        spdxlgcgdyszljsb2020ColumnConfig,
        spdxlgcgdysgcljsb2020ColumnConfig,
        bzjzqjcb2020ColumnConfig,
        jxpjtjbfb22020ColumnConfig,
        jxcltjbfb32020ColumnConfig,
        jgpjhzb2020ColumnConfig,
        ygpjhzb2020ColumnConfig,
        ygwjjclhzb2020ColumnConfig,
        rghzb2020ColumnConfig,
        clhzb2020ColumnConfig,
        jzxscljchzb2020ColumnConfig,
        phbclhzb2020ColumnConfig,
        jxhzb2020ColumnConfig,
        jzxsjxjchzb2020ColumnConfig,
        kcfmxb2020ColumnConfig,
        kcffzcdb2020ColumnConfig,
        sjfmxb2020ColumnConfig,
        zhjhzb2020ColumnConfig,
        pjgzfmxb2020ColumnConfig,
        gclhzb2020ColumnConfig,
        zhdxzjxsjsbfb12020ColumnConfig,
        jgwjjclhzb2020ColumnConfig
    };
  },

  created() {
   this.tabsValue = '检修工程总表（表一）'
   this.columnConfig = this.jxgczb1ColumnConfig

  },

  mounted() {
    this.init()
    this.$nextTick(()=>{
      this.getTableClientHeight()
    })
  },

  methods: {
   async init(){
      await this._getGusEmptyTableByXmid()
      this._getDwsb4SuanData(this.tabsValue)
    },
    // // 获取表格占高
    getTableClientHeight() {
      const offsetH = document.body.offsetHeight*0.8;
      const tableH =
        offsetH - // 页面高度
        54- 30-30 //dialog头部底部
        56 // tab高度
      this.tableHeight = tableH;
    },
    // 关闭弹窗
    closeHandle() {
      this.$emit("closeHandle");
    },
    // 获取tableData 
   async _getDwsb4SuanData(tabsValue) {
      const params = {
        xmbh: this.rowData.xmbh,
        jcmc: 'ss',
        titleName: tabsValue
      }
      let resp=await this.m_apiFn(this.getDwsb4SuanData)(params)
        if(resp.statusCode === '200') {
          this.tableData = resp.result
        }else {
          this.tableData = []
        }
    },
    // 获取tab数组
  async  _getGusEmptyTableByXmid() {
      const params = {
        jcmc: "ss",
        xmbh: this.rowData.xmbh
      }
      let tabsArr=[]
       await this.m_apiFn(this.getGusEmptyTableByXmid, params)
        if(this.rowData.ygbb === '2020版') {
           tabsArr = [
            {title:'检修工程总表（表一）', name: '检修工程总表（表一）'},
            {title:'设备检修专业汇总表（表二甲）', name: '设备检修专业汇总表（表二甲）'},
            {title:'建筑修缮专业汇总表（表二乙）', name: '建筑修缮专业汇总表（表二乙）'},
            {title:'建筑修缮工程专业汇总表(取费)', name: '建筑修缮工程专业汇总表(取费)'},
            {title:'设备检修工程专业汇总表(取费)', name: '设备检修工程专业汇总表(取费)'},
            {title:'设备检修单位工程表（表三甲）', name: '设备检修单位工程表（表三甲）'},
            {title:'建筑修缮单位工程表（表三乙）',name: '建筑修缮单位工程表（表三乙）'},
            {title:'余物清理计算表' , name: '余物清理计算表'},
            {title:'建筑修缮工程取费表', name: '建筑修缮工程取费表'},
            {title:'设备检修工程取费表', name: '设备检修工程取费表'},
            {title:'其他费用表（表四）', name: '其他费用表（表四）'},
            {title:'输(配)电线路工程土石方量计算表', name: '输(配)电线路工程土石方量计算表'},
            {title:'输(配)电线路工程工地运输质量计算表', name: '输(配)电线路工程工地运输质量计算表'},
            {title:'输(配)电线路工程工地运输工程量计算表', name: '输(配)电线路工程工地运输工程量计算表'},
            {title:'编制基准期价差表', name: '编制基准期价差表'},
            {title:'检修配件统计表(附表二)', name: '检修配件统计表(附表二)'},
            {title:'检修材料统计表(附表三)', name: '检修材料统计表(附表三)'},
            {title:'甲供配件汇总表', name: '甲供配件汇总表'},
            {title:'乙供配件汇总表', name:'乙供配件汇总表'},
            {title:'甲供未计价材料汇总表', name: '甲供未计价材料汇总表'},
            {title:'乙供未计价材料汇总表', name: '乙供未计价材料汇总表'},
            {title:'人工汇总表', name: '人工汇总表'},
            {title:'材料汇总表', name: '材料汇总表'},
            {title:'建筑修缮材料价差汇总表', name: '建筑修缮材料价差汇总表'},
            {title:'配合比材料汇总表', name: '配合比材料汇总表'},
            {title:'机械汇总表', name: '机械汇总表'},
            {title:'建筑修缮机械价差汇总表', name: '建筑修缮机械价差汇总表'},
            {title:'勘察费明细表', name: '勘察费明细表'},
            {title:'勘察费复杂程度表', name: '勘察费复杂程度表'},
            {title:'设计费明细表', name: '设计费明细表'},
            {title:'组合件汇总表', name: '组合件汇总表'},
            {title:'配件购置费明细表', name: '配件购置费明细表'},
            {title:'工程量汇总表', name: '工程量汇总表'},
            {title:'综合地形增加系数计算表(附表一)', name: '综合地形增加系数计算表(附表一)'}
          ]
          if(resp.result.notEmptyTabs && resp.result.notEmptyTabs.length > 0) {
            this.tabs = tabsArr.filter(item => resp.result.notEmptyTabs.some(ele => ele === item.name))
            if(!this.tabs.length) {
              this.tabs = [
                {title:'检修工程总表（表一）', name: '检修工程总表（表一）'}
              ]
            }
          }else {
            this.tabs = tabsArr
          }
        }else {
            tabsArr = [
            {title:'检修工程总表（表一）', name: '检修工程总表（表一）'},
            {title:'设备检修专业汇总表（表二甲）', name: '设备检修专业汇总表（表二甲）'},
            {title:'建筑修缮专业汇总表（表二乙）', name: '建筑修缮专业汇总表（表二乙）'},
            {title:'设备检修单位工程表（表三甲）', name: '设备检修单位工程表（表三甲）'},
            {title:'建筑修缮单位工程表（表三乙）', name: '建筑修缮单位工程表（表三乙）'},
            {title:'建筑修缮工程取费表', name: '建筑修缮工程取费表'},
            {title:'设备检修工程取费表', name: '设备检修工程取费表'},
            {title:'其他费用表（表四）', name: '其他费用表（表四）'},
            {title:'甲供配件汇总表（附表一）', name: '甲供配件汇总表（附表一）'},
            {title:'乙供配件汇总表（附表二）', name: '乙供配件汇总表（附表二）'},
            {title:'编制基准期价差表（附表三）', name: '编制基准期价差表（附表三）'},
            {title:'综合地形增加系数计算表（附表四）', name: '综合地形增加系数计算表（附表四）'},
            {title:'输（配）电线路检修配件统计表（附表五）', name: '输（配）电线路检修配件统计表（附表五）'},
            {title:'输电线路检修土石方量计算表（附表六）', name: '输电线路检修土石方量计算表（附表六）'},
            {title:'输电线路工地运输质量计算表（附表七）', name: '输电线路工地运输质量计算表（附表七）'},
            {title:'输电线路工地运输工程量计算表（附表八）', name: '输电线路工地运输工程量计算表（附表八）'},
            {title:'勘察费明细表（附表九）', name: '勘察费明细表（附表九）'},
            {title:'勘察费复杂程度表（附表十）', name: '勘察费复杂程度表（附表十）'},
            {title:'设计费明细表（附表十一）', name: '设计费明细表（附表十一）'},
            {title:'配件购置费明细表', name: '配件购置费明细表'},
            {title:'可抵扣增值税分析表', name: '可抵扣增值税分析表'}
          ]
          if(resp.result.notEmptyTabs && resp.result.notEmptyTabs.length > 0) {
            this.tabs = tabsArr.filter(item => resp.result.notEmptyTabs.some(ele => ele === item.name))
            if(!this.tabs.length) {
              this.tabs = [
                {title:'检修工程总表（表一）', name: '检修工程总表（表一）'},
              ]
            }
          }else {
            this.tabs = tabsArr
          }
        }
        this.tabsValue=this.tabs[0].name
    },
    // tab切换事件
    tabClick(tab) {
     this.columnConfig = [];
     this.$nextTick(() => {
      //  debugger
      if(this.rowData.ygbb === '2020版') {
         switch (tab.label) {
          case '检修工程总表（表一）':
            this.columnConfig = this.jxgczb1ColumnConfig
            break;
          case '建筑修缮工程取费表':
          case '设备检修工程取费表':
            this.columnConfig = this.jzxsgcqfbColumnConfig
            break;
          case '其他费用表（表四）':
            this.columnConfig = this.qtfybbsb4ColumnConfig
            break;
          case '设备检修专业汇总表（表二甲）':
            this.columnConfig = this.sbjxzyhzbb2j2020ColumnConfig
            break;
          case '建筑修缮专业汇总表（表二乙）':
            this.columnConfig = this.jzxszthzbb2y2020ColumnConfig
            break;
          case ' 建筑修缮工程专业汇总表(取费)':
          case '设备检修工程专业汇总表(取费)':
            this.columnConfig = this.jzxsgczyhzbqf2020ColumnConfig
            break;
          case '设备检修单位工程表（表三甲）':
            this.columnConfig = null
            this.columnConfig = this.m_copy(this.sbjxdwgcbb2j2020ColumnConfig)
            break;
          case '建筑修缮单位工程表（表三乙）':
            this.columnConfig = null
            this.columnConfig = this.jzxsdwgcbb3y2020ColumnConfig
            break;
          case '余物清理计算表':
            this.columnConfig = this.ywqljsb2020ColumnConfig
            break;
          case '输(配)电线路工程土石方量计算表':
            this.columnConfig = this.spdxlgctsfljsb2020ColumnConfig
            break;
          case '输(配)电线路工程工地运输质量计算表':
            this.columnConfig = this.spdxlgcgdyszljsb2020ColumnConfig
            break;
          case '输(配)电线路工程工地运输工程量计算表':
            this.columnConfig = this.spdxlgcgdysgcljsb2020ColumnConfig
            break;
          case '编制基准期价差表':
            this.columnConfig = this.bzjzqjcb2020ColumnConfig
            break;
          case '检修配件统计表(附表二)':
            this.columnConfig = this.jxpjtjbfb22020ColumnConfig
            break;
          case '检修材料统计表(附表三)':
            this.columnConfig = this.jxcltjbfb32020ColumnConfig
            break;
          case '甲供配件汇总表':
            this.columnConfig = this.jgpjhzb2020ColumnConfig
            break;
          case '乙供配件汇总表':
            this.columnConfig = this.ygpjhzb2020ColumnConfig
            break;
          case '甲供未计价材料汇总表':
            this.columnConfig = this.jgwjjclhzb2020ColumnConfig
            break;
          case '乙供未计价材料汇总表':
            this.columnConfig = this.ygwjjclhzb2020ColumnConfig
            break;
          case '人工汇总表':
            this.columnConfig = this.rghzb2020ColumnConfig
            break;
          case '材料汇总表':
            this.columnConfig = this.clhzb2020ColumnConfig
            break;
          case '建筑修缮材料价差汇总表':
            this.columnConfig = this.jzxscljchzb2020ColumnConfig
            break;
          case '配合比材料汇总表':
            this.columnConfig = this.phbclhzb2020ColumnConfig
            break;
          case '机械汇总表':
            this.columnConfig = this.jxhzb2020ColumnConfig
            break;
          case '建筑修缮机械价差汇总表':
            this.columnConfig = this.jzxsjxjchzb2020ColumnConfig
            break;
          case '勘察费明细表':
            this.columnConfig = this.kcfmxb2020ColumnConfig
            break;
          case '勘察费复杂程度表':
            this.columnConfig = this.kcffzcdb2020ColumnConfig
            break;
          case '设计费明细表':
            this.columnConfig = this.sjfmxb2020ColumnConfig
            break;
          case '组合件汇总表':
            this.columnConfig = this.zhjhzb2020ColumnConfig
            break;
          case '配件购置费明细表':
            this.columnConfig = this.pjgzfmxb2020ColumnConfig
            break;
          case '工程量汇总表':
            this.columnConfig = this.gclhzb2020ColumnConfig
            break;
          case '综合地形增加系数计算表(附表一)':
            this.columnConfig = this.zhdxzjxsjsbfb12020ColumnConfig
            break;
          
          
        }
      }else {
        switch (tab.label) {
              case '检修工程总表（表一）':
              this.columnConfig = this.jxgczb1ColumnConfig
                break;
              case '设备检修专业汇总表（表二甲）':
              this.columnConfig = this.sbjxzyhzbb2jColumnConfig
                break;
              case '建筑修缮专业汇总表（表二乙）':
              this.columnConfig = this.jzxszyhzbb2yColumnConfig
                break;
              case '设备检修单位工程表（表三甲）':
              this.columnConfig = this.sbjxdwgcbb3jColumnConfig
                break;
              case '建筑修缮单位工程表（表三乙）':
              this.columnConfig = this.jzxsdwgcbb3yColumnConfig
                break;
              case '建筑修缮工程取费表':
              case '设备检修工程取费表':
              this.columnConfig = this.jzxsgcqfbColumnConfig
                break;
              case '其他费用表（表四）':
              this.columnConfig = this.qtfybbsb4ColumnConfig
                break;
              case '甲供配件汇总表（附表一）':
              this.columnConfig = this.jgpjhzbfb1ColumnConfig
                break;
              case '乙供配件汇总表（附表二）':
              this.columnConfig = this.ygpjhzbfb2ColumnConfig
                break;
              case '编制基准期价差表（附表三）':
              this.columnConfig = this.bzjzqicbfb3ColumnConfig
                break;
              case '综合地形增加系数计算表（附表四）':
              this.columnConfig = this.bzjzqicbfb4ColumnConfig
                break;
              case '输（配）电线路检修配件统计表（附表五）':
              this.columnConfig = this.spdxljxpjtjbfb5ColumnConfig
                break;
              case '输电线路检修土石方量计算表（附表六）':
              this.columnConfig = this.sdxljxtsfljsbfb6ColumnConfig
                break;
              case '输电线路工地运输质量计算表（附表七）':
              this.columnConfig = this.sdxlgdyszljsbfb7ColumnConfig
                break;
              case '输电线路工地运输工程量计算表（附表八）':
              this.columnConfig = this.sdxlgdysgcljsbfb8ColumnConfig
                break;
              case '勘察费明细表（附表九）':
              this.columnConfig = this.kcfmxbfb9ColumnConfig
                break;
              case '勘察费复杂程度表（附表十）':
              this.columnConfig = this.kcffzcdbfb10ColumnConfig
                break;
              case '设计费明细表（附表十一）':
              this.columnConfig = this.sjfmxbfb11ColumnConfig
                break;
              case '配件购置费明细表':
              this.columnConfig = this.pjgzfmxbColumnConfig
                break;
              case '可抵扣增值税分析表':
              this.columnConfig = this.kdkzzsfxbColumnConfig
                break;
              default:
                break;
          }
       
      }
      // console.log(this.$refs)
      this.$refs.projectTableRef.$refs.table.doLayout()
      this._getDwsb4SuanData(tab.label)
      this.$forceUpdate();
     });
    }
  }
};
</script>
<style lang="less" scoped>

.main {
  .main-tab
  /deep/.el-icon-arrow-left {
    margin-top: 13px
  }
  /deep/ .el-icon-arrow-right{
     margin-top: 13px
  }
    
 
  
}
</style>