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
const FormConfig = [
    {
      type: "input",
      selectEmbedLabel: "历史项目名称：",
      key: "cxqmc",
      width: 280,
      embedWidth: 90,
      clearable: true,
    },

    {
      width: 280,
      embedWidth: 50,
      type: "inputNumber",
      kind:"number",
      min:1,
      max:100,
      key: "ccjgmin",
      size:"small",
      placeholder: "%",
      selectEmbedLabel: "查重结果",
      disabled: false,
      clearable: true,
    },
    {
      width: 280,
      embedWidth: 50,
      type: "inputNumber",
      kind:"number",
      min:1,
      max:100,
      key: "ccjgmax",
      size:"small",
      placeholder: "%",
      selectEmbedLabel: "查重结果",
      disabled: false,
      clearable: true,
    },
   
  ];
  
  const formData = {
    cxqmc : "",
    cxqbh: "",
   page:1,
   rows:20,
   ccjgmin:'',
   ccjgmax:''
  };

  const newColumn= Object.freeze([
   
    {
      key: 'projectName',
      label: '项目名称',
      isSlot: 'true',
      slotName: 'projectName',
      showOverflowTooltip: false
    },
    {
      key: "cxmmc",
      label: '历史项目名称',
      isSlot: 'true',
      slotName: 'cxmmc',
      showOverflowTooltip: false
    },
    {
      key: "sxmmc",
      label: '名称重复率',
      isSlot: 'true',
      slotName: 'sxmmc',
    },
    {
      key: "cxqbh",
      label: '历史可研编号',
      isSlot: 'true',
      slotName: 'cxqbh',
    },
    {
      key: "jsnr",
      label: '项目研究内容',
      isSlot: 'true',
      slotName: 'jsnr',
      showOverflowTooltip: false
    },
    {
      key: "cjsnr",
      label: '历史研究内容',
      isSlot: 'true',
      slotName: 'cjsnr',
      showOverflowTooltip: false
    },
    {
      key: "sjsnr",
      label: '内容重复率',
      isSlot: 'true',
      slotName: 'sjsnr',
    },
    {
      key: "ccjg",
      label: '总重复率',
      isSlot: 'true',
      slotName: 'ccjg',
    },
    
  ]);
  
  const ccjgFormRules = Object.freeze({
   
  });

    
  const buttonsData = [
    {
        id:'primary',
        text:'查重结果导出',
        icon: "iconzu1192",
        color:'#409EFF'
      },
  ]

  
  export {
    FormConfig,
    formData,
    buttonsData,
    newColumn
  };
  