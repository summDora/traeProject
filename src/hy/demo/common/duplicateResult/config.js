//  仅数字类型值校验
const checkValue = (rule, value, callback) => {
    let reg = /^\d{1,}$/;
    if(!value) {
        return callback()
    }
    if(!reg.test(value)) {
        callback(new Error('请输入数字值'))
    }else {
        return callback()
    }
}

 //  浮点数类型值校验(保留小数点后四位)
 const checkFloatValue = (rule, value, callback) => {
    let reg = /^(0|[1-9]+[0-9]*)(\.[0-9]{1,4})?$/;
    if(!value) {
        return callback()
    }
    if(!reg.test(value)) {
        callback(new Error('请输入数字值'))
    }else {
        return callback()
    }
}
const ccjgFormConfig = [
    {
      type: "input",
      selectEmbedLabel: "需求名称：",
      key: "xqmc",
      width: 280,
      embedWidth: 90,
    },
    {
        type: "input",
        selectEmbedLabel: "需求编号：",
        key: "xqbh",
        width: 280,
        embedWidth: 90,
        
    },
    {
        type: "input",
        selectEmbedLabel: "查重结果：",
        key: "ccjg",
        width: 280,
        embedWidth: 90,
    },
   
  ];
  
  const ccjgFormData = {
   xqmc: "",
   xqbh: "",
   ccjg: "",
   page:1,
   rows:20
  };

  const columnConfig = Object.freeze([
    {
      key: 'xqbh',
      label: '需求编号',
      baseWidth:250,
    },
    {
      key: 'xqmc',
      label: '需求名称',
      baseWidth:250,
    },
    {
      key: 'lsxqmc',
      label: '历史需求名称',
    },
    {
      key: "lsxqbh",
      label: '历史需求编号',
    },
    {
        key: "mccfl",
        label: '名称重复率',
    },
    {
      key: "xqyjnr",
      label: '需求研究内容',
    },
    {
      key: "lsyjnr",
      label: '历史研究内容',
    },
    {
        key: "nrcfl",
        label: '内容重复率',
      },
      {
        key: "zcfl",
        label: '总重复率',
      },
    
  ]);
  
  const ccjgFormRules = Object.freeze({
    sbpc: [{ required: true, message: "请选择申报批次", trigger: "change" }],
    projectName: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
    xmcddw: [{ required: true, message: "请选择项目承担单位", trigger: "change" }],
    jsly: [{ required: true, message: "请选择技术领域", trigger: "change" }],
    zyfx: [{ required: true, message: "请选择专业方向", trigger: "change" }],
    xmlb: [{ required: true, message: "请选择项目类别", trigger: "change" }],
    dkywbm: [{ required: true, message: "请填写对口业务部门", trigger: "blur" }],
    zfy: [
        { required: true, message: "请填写总费用（评审前）", trigger: "blur" },
        {validator: checkFloatValue,trigger: 'blur'}
    ],
    dnfy: [
        { required: true, message: "请填写当年费用（评审前）", trigger: "blur" },
        {validator: checkFloatValue,trigger: 'blur'}
    ],
    declareStartDate: [{ required: true, message: "请填写开始时间", trigger: "blur" }],
    declareEndDate: [{ required: true, message: "请填写结束时间", trigger: "blur" }],
    xmfzr: [{ required: true, message: "请填写项目负责人", trigger: "blur" }],
    xmrysjdwhbm: [{ required: true, message: "请填写项目人员涉及部门或单位", trigger: "blur" }],
    xmcyry: [{ required: true, message: "请填写项目参与人员", trigger: "blur" }],
    xmlxrlxfs: [{ required: true, message: "请填写项目联系人联系方式", trigger: "blur" }],
    xmclxr: [{ required: true, message: "请填写项目联系人", trigger: "blur" }],
    czwtjxqbyxsm: [{ required: true, message: "请填写存在问题及需求必要性说明", trigger: "blur" }],
    yjnr: [{ required: true, message: "请填写研究内容", trigger: "blur" }],
    yjnrdyqmb: [{ required: true, message: "请填写研究内容的预期目标", trigger: "blur" }],
    fmzl: [
        {validator: checkValue,trigger: 'blur'}
    ],
    fbhxqkjyslw: [
        {validator: checkValue,trigger: 'blur'}
    ],
    sqrjzzq: [
        {validator: checkValue,trigger: 'blur'}
    ]
  });

    
  const buttonsData = [
    {
      id:'primary',
      text:'查重结果导出',
      icon: "iconzu1192",
      color:'#298BF5'
    },
 
  ]

  
  export {
    ccjgFormConfig,
    ccjgFormData,
    ccjgFormRules,
    buttonsData,
    columnConfig
  };
  