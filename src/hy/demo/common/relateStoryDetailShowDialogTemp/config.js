const jsEditConfig = [
  {
    type: 'input',
    placeholder: '请输入需求名称...',
    label: '需求名称1',
    maxlength:'100',
    key: 'demandName',
    clearable:true,
    width: 968,
  },
  {
    type: 'input',
    placeholder: '',
    key: 'demandCategoryName',
    clearable: true,
    disabled: true,
    width: 312,
    label: '业务需求类别：',
  },
  {
    type: 'input',
    placeholder: '系统自动生成',
    label: '需求编号',
    key: 'projectCode',
    disabled:true,
    clearable:true,
    width: 309,
  },
  {
    type: 'input',
    placeholder: '',
    label: '投资渠道',
    key: 'investmentChannelName',
    disabled:true,
    clearable:true,
    width: 309,
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '预估费用（万元）',
    maxlength:'100',
    key: 'estimateCost',
    clearable:true,
    width: 309,
  },
  {
    type: 'input',
    placeholder: '',
    label: '建议费用上限（万元）',
    maxlength:'100',
    key: 'suggesCost',
    clearable:true,
    disabled:true,
    width: 309,
  },
  {
    type: 'select',
    placeholder: '请选择',
    key: 'demandPriority',
    width: 309,
    label: '需求优先级',
    options: [],
    clearable:true,
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: 'select',
    placeholder: '请选择',
    key: 'dataSource',
    width: 309,
    label: '需求来源',
    options: [],
    clearable:true,
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '前期项目名称与完成情况',
    key: 'previousProjectName',
    maxlength:'100',
    clearable:true,
    width: 968,
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '原有系统名称与部署现状',
    key: 'previousSystemName',
    maxlength:'100',
    clearable:true,
    width: 968,
  },


  // {
  //   type: 'input',
  //   placeholder: '请输入',
  //   label: '实施期限',
  //   key: 'implementTerm',
  //   maxlength:'100',
  //   clearable:true,
  //   width: 309,
  // },
  // {
  //   type: 'select',
  //   placeholder: '请选择',
  //   key: 'isIteration',
  //   clearable:true,
  //   width: 309,
  //   label: '是否为原系统优化迭代',
  //   options: [
  //     {label:"是",value:"是"},
  //     {label:"否",value:"否"},
  //   ],
  //   labelName: "label",
  //   labeKey: "value"
  // },
  {
    type: 'input',
    placeholder: '',
    key: 'businessCompanyName',
    clearable: true,
    disabled: true,
    width: 309,
    label: '业务主管部门',
  },
  {
    type: 'select',
    placeholder: '请选择',
    key: 'category',
    width: 309,
    label: '专业大类',
    options: [],
    labelName: "name",
    labeKey: "value"
  },
  {
    type: 'select',
    placeholder: '请选择',
    key: 'subcategory',
    disabled:true,
    width: 309,
    label: '专业小类',
    options: [],
    labelName: "name",
    labeKey: "value"
  },
  {
    type: 'input',
    placeholder: '',
    key: 'constructionUnitName',
    clearable: true,
    width: 309,
    label: '拟承担单位',
    disabled: true,
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '拟承担单位联系人',
    maxlength:'100',
    key: 'constructionUnitContact',
    clearable:true,
    width: 309,
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '拟承担单位联系方式',
    maxlength:'100',
    key: 'constructionUnitDel',
    clearable:true,
    width: 309,
  },
  
  // {
  //   type: 'input',
  //   placeholder: '请输入',
  //   label: '业务主管部门联系人',
  //   maxlength:'100',
  //   key: 'businessCompanyContact',
  //   clearable:true,
  //   width: 309,
  // },
  // {
  //   type: 'input',
  //   placeholder: '请输入',
  //   label: '业务主管部门联系方式',
  //   maxlength:'100',
  //   key: 'businessCompanyDel',
  //   clearable:true,
  //   width: 309,
  // },
  {
    type: 'input',
    placeholder: '',
    key: 'demandProposedCompanyName',
    clearable: true,
    disabled: true,
    width: 312,
    label: '需求提出单位（部门）',
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '需求提出单位（部门）联系人',
    maxlength:'100',
    key: 'bearCompanyContact',
    clearable:true,
    width: 309,
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '需求提出单位（部门）联系方式',
    maxlength:'100',
    key: 'bearCompanyDel',
    clearable:true,
    width: 309,
  },
  {
    type: 'input',
    placeholder: '请输入',
    label: '提报人',
    maxlength:'100',
    key: 'informant',
    clearable:true,
    width: 309,
  },
  {
    type: "cascader",
    label: "提报单位",
    key: "presentingUnit",
    width: 309,
    options: [],
    props: {
      expandTrigger: "hover",
      multiple: false,
      value: "orgId",
      label: "shortName",
      children: "children"
    }
  },
  // {
  //   width:968,
  //   label:"指南对应章节",
  //   type: 'hySelectTree',
  //   placeholder: '请选择',
  //   data:[],
  //   defaultProps: {
  //     children: 'childrenList',
  //     label: 'constructionContent'
  //   },
  //   nodeKey:'tdgId',
  //   key : 'tdgId',
  //   trigger:"manual",
  //   multiple:true,
  //   labelStyle:{
  //     embed:false,
  //     selectClass:"",
  //   },
  // },
  {
    width: 309,
    label: "指南对应章节：",
    type: 'input',
    placeholder: '',
    disabled: true,
    key: 'guideChapter',
  },
  // {
  //   type: 'textarea',
  //   kind:"textarea",
  //   showWordLimit:true,
  //   maxlength:"800",
  //   placeholder: '请输入',
  //   label: '存在问题及需求必要性说明',
  //   key: 'exitsProblem',
  //   clearable:true,
  //   width: 968,
  // },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"1500",
    placeholder: '请输入',
    label: '业务需求描述',
    key: 'businessDescribe',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '预期成效',
    key: 'expectedResult',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '成效指标',
    key: 'effectivenessTarget',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '应用范围',
    key: 'applicationRange',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '需求依据',
    key: 'demandBasis',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '新技术需求（不使用填无）',
    key: 'technologyDemand',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '备注',
    key: 'remark',
    clearable:true,
    width: 968,
    autosize: true,
  },
  {
    type: 'textarea',
    kind:"textarea",
    showWordLimit:true,
    maxlength:"800",
    placeholder: '请输入',
    label: '总部对口部门审核意见',
    key: 'noBasisDemand',
    clearable:true,
    width: 968,
    autosize: true,
  },
  
]

  const jsEditData = {
    projectCode:"",
    investmentChannelName:"",
    demandName:"",
    demandCategory:"",
    estimateCost:"",
    suggesCost:"",
    demandPriority:"",
    dataSource:"",
    previousProjectName:"",
    previousSystemName:"",
    implementTerm:"",
    isIteration:"",
    category:"",
    subcategory:"",
    businessCompany:"",
    businessCompanyContact:"",
    businessCompanyDel:"",
    bearCompany:"",
    bearCompanyContact:"",
    bearCompanyDel:"",
    informant:"",
    presentingUnit:"",
    constructionUnit:"",
    constructionUnitContact:"",
    constructionUnitDel:"",
    tdgId:[],
    exitsProblem:"",
    businessDescribe:"",
    expectedResult:"",
    effectivenessTarget:"",
    applicationRange:"",
    demandBasis:"",
    technologyDemand:"",
    noBasisDemand:"",
    remark:"",
  }
  
  //去空格必填项
  const requiredTrim = (rule, value, callback) => {
    if (!value) {
      callback(new Error('此为必填项'))
    }else if(!value.trim()){
      callback(new Error('内容为空'))
    }else{
      callback()
    }
  }
  //下拉必填项
  const selectRequiredTrim = (rule, value, callback) => {
    if (!value) {
      callback(new Error('此为必填项'))
    }else{
      callback()
    }
  }
  //数组必填项
  const ArrayRequiredTrim = (rule, value, callback) => {
    if (!value.length) {
      callback(new Error('此为必填项'))
    }else{
      callback()
    }
  }
  //数字必填项
  const numCheckTrim = (rule, value, callback) => {
    if (!value) {
      callback(new Error('此为必填项'))
    }else{
      let reg=/^[+-]?(0|([1-9]\d*))(\.\d+)?$/g;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('请输入数字且不能输入空格'));
      }
    }
  }
  
  
  //数字非必填项
  const noNumCheckTrim = (rule, value, callback) => {
    if (!value) {
      callback()
    }else{
      let reg=/^[+-]?(0|([1-9]\d*))(\.\d{0,2})?$/g;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('请输入数字且小数点不大于两位'));
      }
    }
  }
  
  //0-1000的正则
  const checkTrimLimit = (rule, value, callback) => {
    if (!value) {
      callback()
    }else{
      let reg=/^([1-9]\d{0,2}$)|(^0\.\d{1,2}$)|(^[1-9]\d{0,2}\.\d{1,2}$)/;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('请输入0到1000之间的数字且小数点不大于两位'));
      }
    }
  
  }
  
  //各种率的正则
  const checkTrimRate = (rule, value, callback) => {
    if (!value) {
      callback()
    }else{
      let reg=/^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$/;
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('请输入0~100之间的数字'));
      }
    }
  
  }

  //手机号
  const phoneRequiredTrim = (rule, value, callback) => {
    if (!value||!value.length) {
      callback(new Error('此为必填项'))
    }else{
      let reg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/
      if(reg.test(value)){
        callback()
      }else{
        callback(new Error('请输入正确的手机号'));
      }
    }
  }
  
  
  
  
  const jsEditRules = Object.freeze({
    demandName: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    constructionUnitContact: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    demandPriority: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    dataSource: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    previousProjectName: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    previousSystemName: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    implementTerm: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    businessCompanyContact: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    bearCompanyContact: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    exitsProblem: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    businessDescribe: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    expectedResult: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    effectivenessTarget: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    applicationRange: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    demandBasis: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    
    constructionUnitDel: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    businessCompanyDel: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    bearCompanyDel: [{ required:true, validator:requiredTrim, trigger: 'blur' },],

    estimateCost: [{ required:true, validator:numCheckTrim, trigger: 'blur' },],
    
    demandCategory: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    isIteration: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    category: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    subcategory: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    businessCompany: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    constructionUnit: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    bearCompany: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    informant:[{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    presentingUnit:[{ required:true, validator:selectRequiredTrim, trigger: 'change' },],

    tdgId: [{ required:true, validator:ArrayRequiredTrim, trigger: 'change' },],
  })



  const ywEditConfig = [
    {
      type: 'input',
      placeholder: '系统自动生成',
      label: '需求编号',
      key: 'projectCode',
      disabled:true,
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '',
      label: '投资渠道',
      key: 'investmentChannelName',
      disabled:true,
      clearable:true,
      width: 309,
    },
    {
      type: 'select',
      placeholder: '请选择',
      key: 'businessCompany',
      width: 309,
      label: '业务部门（单位）',
      options: [],
      labelName: "name",
      labeKey: "value"
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '信息运维服务计划名称',
      maxlength:'100',
      key: 'demandName',
      clearable:true,
      width: 968,
    },
    {
      type: 'select',
      placeholder: '请选择',
      key: 'serviceTypeLevelOne',
      width: 309,
      label: '服务类别（一级）',
      options: [],
      labelName: "name",
      labeKey: "value"
    },
    {
      type: 'select',
      placeholder: '请选择',
      key: 'serviceTypeLevelTwo',
      width: 309,
      label: '服务类别（二级）',
      options: [],
      labelName: "name",
      labeKey: "value"
    },
    {
      type: 'select',
      placeholder: '请选择',
      key: 'serviceTypeLevelThree',
      width: 309,
      label: '服务类别（三级）',
      options: [],
      labelName: "name",
      labeKey: "value"
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '运维资产',
      maxlength:'100',
      key: 'devopsObjectName',
      disabled:false,
      clearable:true,
      width: 637,
    },
    {
      type: 'select',
      placeholder: '请选择',
      key: 'operationsDeptUnit',
      disabled:false,
      width: 309,
      label: '运维部门（单位）',
      options: [],
      labelName: "name",
      labeKey: "value"
    },
    {
      type: 'datepicker',
      label: '开始时间',
      clearable:true,
      disabled:false,
      width: '309px',
      dateType: 'date',
      key: 'startDate',
      valFormat: 'yyyy-MM-dd',
      placeholder:["开始时间"]
    },
    {
      type: 'datepicker',
      label: '结束时间',
      clearable:true,
      disabled:false,
      width: '309px',
      dateType: 'date',
      key: 'endDate',
      valFormat: 'yyyy-MM-dd',
      placeholder:["结束时间"]
    },
    {
      type: 'input',
      placeholder: '系统自动汇算',
      label: '预计费用总计',
      maxlength:'100',
      key: 'estimateCost',
      disabled:true,
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '一线费用（仅客户服务列支）',
      maxlength:'100',
      key: 'oneLineCostSum',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '二线费用',
      maxlength:'100',
      key: 'twoLineCostSum',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '三线费用',
      maxlength:'100',
      key: 'threeLineCostSum',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '软件许可服务费',
      maxlength:'100',
      key: 'softwareLicenseServiceFeeSum',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '维修配件费',
      maxlength:'100',
      key: 'repairAccessoriesCostSum',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '耗材费',
      maxlength:'100',
      key: 'consumableCostSum',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '硬件质保费',
      maxlength:'100',
      key: 'qualityAssuranceSum',
      clearable:true,
      width: 309,
    },
    {
      type: "cascader",
      label: "需求提报单位",
      key: "bearCompany",
      width: 309,
      options: [],
      props: {
        expandTrigger: "hover",
        multiple: false,
        value: "orgId",
        label: "shortName",
        children: "children"
      }
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '提报人',
      maxlength:'100',
      key: 'informant',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '需求单位联系人',
      maxlength:'100',
      key: 'contactPerson',
      clearable:true,
      width: 309,
    },
    {
      type: 'input',
      placeholder: '请输入',
      label: '联系电话',
      maxlength:'100',
      key: 'phoneNum',
      clearable:true,
      width: 309,
    },
    {
      type: 'textarea',
      kind:"textarea",
      showWordLimit:true,
      maxlength:"800",
      placeholder: '请输入',
      label: '备注',
      key: 'remark',
      clearable:true,
      width: 968,
      autosize: true,
    },
  ]

  const ywEditData = {
    projectCode:"",
    investmentChannelName:"",
    businessCompany:"",
    demandName:"",
    serviceTypeLevelOne:"",
    serviceTypeLevelTwo:"",
    serviceTypeLevelThree:"",
    devopsObjectName:"",
    operationsDeptUnit:"",
    startDate:"",
    endDate:"",
    estimateCost:"",
    oneLineCostSum:"",
    twoLineCostSum:"",
    threeLineCostSum:"",
    softwareLicenseServiceFeeSum:"",
    repairAccessoriesCostSum:"",
    consumableCostSum:"",
    qualityAssuranceSum:"",
    bearCompany:"",
    informant:"",
    contactPerson:"",
    phoneNum:"",
    remark:"",
  }
  
  
  const ywEditRules = Object.freeze({
    projectCode: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    investmentChannelName: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    businessCompany: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    demandName: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    serviceTypeLevelOne: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    serviceTypeLevelTwo: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    serviceTypeLevelThree: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    devopsObjectName: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    operationsDeptUnit: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    startDate: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    endDate: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    // estimateCost: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    oneLineCostSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    twoLineCostSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    threeLineCostSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    softwareLicenseServiceFeeSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    repairAccessoriesCostSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    consumableCostSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    qualityAssuranceSum: [{ required:false, validator:noNumCheckTrim, trigger: 'blur' },],
    bearCompany: [{ required:true, validator:selectRequiredTrim, trigger: 'change' },],
    informant: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    contactPerson: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
    phoneNum: [{ required:true, validator:requiredTrim, trigger: 'blur' },],
  })

  
  export {
    jsEditConfig,
    jsEditData,
    jsEditRules,
    ywEditConfig,
    ywEditData,
    ywEditRules,
  };
