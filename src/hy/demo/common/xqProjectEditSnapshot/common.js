class Common{
  constructor() {

  }
  /**
   * 根据子id查找父级 
   * @param {*} key  子id
   * @param {*} treeData tree数据
   * @param {*} id 属性值
   */
  // 获取随机uuid
  uuid(len = 15) {
    let str =
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15) +
      Math.random()
      .toString(36)
      .substr(2, 15);
    if (str.length < len) {
      console.warn(`uuid的长度不能大于${str.length}`);
    }
    return str.slice(0, len);
  }
  pStoVf(val,Org,readonly){
    if(val&&val.length>0){
      let arr = []
      val.map(item=>{
        arr.push({
          type: item.widgetType,
          id: item.options.fieldId,
          category: item.widgetType==='sub-form'?'container':null,
          widgetList: (item.options.widgetList && item.options.widgetList.length>0)?this.pStoVf(item.options.widgetList):[],
          formItemFlag: true,
          options: {
            // fieldCode: item.options.fieldCode,
            fieldCode: item.options.fieldId,
            // name: item.options.fieldId,
            name: item.options.fieldCode?item.options.fieldCode:item.options.fieldId,
            label: item.options.widgetLabel,
            defaultValue: item.options.defaultValue,
            placeholder: item.options.promptContent,
            readonly: readonly?true:item.options.isEditable==='1'?true:false,
            required: item.options.isRequired==='1'?true:false,
            labelUnit: item.options.unit,
            labelModule: item.options.formGrid,
            labelRemark: item.options.remark,
            maxLength: item.options.fieldLength,
            tfdId: item.options.fieldId,
            rulesList: item.options.rulesList?item.options.rulesList:[{fieldRules:'', rulesFunction:''}],
            max: item.options.numberMax,
            min: item.options.numberMin,
            preKey: item.options.prefixValue,
            precision: item.options.numberPrecise,
            multiple: item.options.isMultiSelect==='1'?true:false,
            activeText: item.options.openValue,
            inactiveText: item.options.closeValue,
            dictheadId: item.options.dictheadId,
            dictLevel: item.options.dictLevel,
            fileMaxSize: item.options.fileSize,
            widgetList: item.options.widgetList,
            showAllLevels: item.options.showAllLevels?item.options.showAllLevels:false,
            optionItems: item.options.dictheadId==='company'?this.optionsItems(Org):item.options.optionItems?this.optionsItems(item.options.optionItems):[],
            props: {
              value: "busCode",
              label: "name",
              children: "children"
            },
            // showBlankRow: item.widgetType==='sub-form'?true:null,
            showBlankRow: true,
            operate: item.widgetType ==='sub-form'?true:null,
          }
        })
      })
      return arr
    }else {
      return null
    }
  }
  optionsItem(val){
    // debugger
    let arr = []
    val.map(item=>{
      arr.push({
        label : item.dataLabel?item.dataLabel:item.name,
        value : item.dataVal?item.dataVal:item.busCode
        // label: item.dataLabel,
        // value: item.dataVal
      })
    })
    console.log(arr)
    return arr
  }
  optionsItems(val){
    let arr=val.map(item=>{
      item.label = item.dataLabel?item.dataLabel:item.name?item.name:item.chapterTitle,
      item.value = item.dataVal?item.dataVal:item.busCode?item.busCode:item.id
      if(item.children){
        this.optionsItems(item.children)
      }
      return item;
    })
    return arr
  }
  getParentsById(list, id) {
    for (let i in list) {
      if (list[i].value == id) {
        //查询到就返回该数组对象的value
        return [list[i].value]
      }
      if (list[i].children) {
        let node = this.getParentsById(list[i].children, id)
        if (node !== undefined) {
          //查询到把父节把父节点加到数组前面
          node.unshift(list[i].value)
          return node
        }
      }
    }
  }
}
export default new Common()