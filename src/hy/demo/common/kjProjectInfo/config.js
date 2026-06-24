import regex from "@/utils/regex";

// 仅数字类型值校验
const checkValue = (rule, value, callback) => {
  let reg = /^\d{1,}$/;
  if (!value) {
    return callback();
  }
  if (!reg.test(value)) {
    callback(new Error("请输入数字值"));
  } else {
    return callback();
  }
};

// 浮点数类型值校验(保留小数点后四位)
const checkFloatValue = (rule, value, callback) => {
  let reg = /^(0|[1-9]+[0-9]*)(\.[0-9]{1,4})?$/;
  if (!value) {
    return callback();
  }
  if (!reg.test(value)) {
    callback(new Error("请输入数字值"));
  } else {
    return callback();
  }
};

const xqxmFormConfig = [
  {
    type: "input",
    label: "可研编号：",
    key: "xmbh",
    width: 473,
    disabled: true
  },
  {
    type: "input",
    label: "关联需求：",
    key: "xqbh",
    width: 384,
    disabled: true,
    showGlxqBtn: true
  },
  {
    type: "input",
    label: "项目名称：",
    key: "projectName",
    width: 473,
    maxlength: 100,
    disabled: false,
    clearable: true
  },
  {
    type: "cascader",
    label: "项目承担单位：",
    key: "xmcddw",
    width: 473,
    options: [],
    props: {
      expandTrigger: "hover",
      multiple: false,
      value: "orgId",
      label: "orgName",
      children: "children"
    },
    clearable: true
  },
  {
    type: "select",
    label: "技术领域：",
    key: "jsly",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    clearable: true
  },
  {
    type: "select",
    label: "专业方向：",
    key: "zyfx",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    clearable: true
  },
  {
    type: "select",
    label: "项目类别：",
    key: "xmlb",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    clearable: true
  },
  {
    type: "select",
    label: "对口业务部门：",
    key: "dkywbm",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    disabled: false
  },
  {
    type: "input",
    label: "总费用（万元）（评审前）：",
    key: "zfy",
    width: 473,
    maxlength: 20,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "当年费用（万元）（评审前）：",
    key: "dnfy",
    width: 473,
    maxlength: 20,
    clearable: true,
    disabled: false
  },
  {
    type: "datepicker",
    label: "开始时间",
    clearable: true,
    disabled: false,
    width: "473px",
    dateType: "month",
    key: "declareStartDate",
    valFormat: "yyyy-MM",
    placeholder: ["开始时间"]
  },
  {
    type: "datepicker",
    label: "结束时间",
    clearable: true,
    disabled: false,
    width: "473px",
    dateType: "month",
    key: "declareEndDate",
    valFormat: "yyyy-MM",
    placeholder: ["结束时间"]
  },
  {
    type: "cascader",
    label: "参与单位：",
    key: "cydw",
    width: 473,
    options: [],
    props: {
      expandTrigger: "hover",
      multiple: false,
      value: "orgId",
      label: "orgName",
      children: "children"
    },
    clearable: true
  },
  {
    type: "input",
    label: "合作单位：",
    key: "hzdw",
    width: 473,
    maxlength: 100,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "项目负责人：",
    key: "xmfzr",
    width: 473,
    maxlength: 100,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "项目人员涉及部门或单位：",
    key: "xmrybm",
    width: 473,
    maxlength: 50,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "项目参与人员：",
    key: "xmcyry",
    width: 473,
    maxlength: 50,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "项目联系人联系方式：",
    key: "xmlxrtel",
    width: 473,
    maxlength: 50,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "项目联系人：",
    key: "xmlxr",
    width: 473,
    maxlength: 50,
    disabled: false,
    clearable: true
  },
  {
    type: "select",
    label: "科研创新团队：",
    key: "kycxtd",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    clearable: true
  },
  {
    type: "select",
    label: "实验室：",
    key: "sysmc",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    clearable: true
  },
  {
    type: "input",
    label: "发表核心期刊及以上论文（篇）：",
    key: "fblw",
    width: 473,
    maxlength: 10,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "发明专利（项）：",
    key: "fmzl",
    width: 473,
    maxlength: 10,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    label: "申请软件著作权（项）：",
    key: "sqrz",
    width: 473,
    maxlength: 10,
    disabled: false,
    clearable: true
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    maxlength: 300,
    label: "存在问题及需求必要性说明：",
    key: "czwt",
    width: 968,
    clearable: true
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    maxlength: 500,
    label: "研究内容：",
    key: "yjnr",
    width: 968,
    clearable: true
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    maxlength: 400,
    label: "研究内容的预期目标：",
    key: "yqmb",
    width: 968,
    clearable: true
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    label: "备注：",
    key: "bz",
    maxlength: 200,
    width: 968,
    clearable: true
  },
  {
    type: "input",
    label: "知识产权的考核指标：",
    key: "yqmbhcgzb",
    width: 968,
    disabled: true
  }
];

const xqxmFormConfigDisable = [
  {
    type: "input",
    label: "可研编号：",
    key: "xmbh",
    width: 473,
    disabled: true
  },
  {
    type: "input",
    label: "关联需求：",
    key: "xqbh",
    width: 384,
    disabled: true,
    showGlxqBtn: true
  },
  {
    type: "input",
    label: "项目名称：",
    key: "projectName",
    width: 473,
    maxlength: 100,
    disabled: false
  },
  {
    type: "cascader",
    label: "项目承担单位：",
    key: "xmcddw",
    width: 473,
    options: [],
    placeholder: "",
    props: {
      expandTrigger: "hover",
      multiple: false,
      value: "orgId",
      label: "orgName",
      children: "children"
    }
  },
  {
    type: "input",
    label: "项目承担单位：",
    key: "xmcddwName",
    width: 473,
    maxlength: 100,
    disabled: false
  },
  {
    type: "select",
    label: "技术领域：",
    key: "jsly",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    placeholder: ""
  },
  {
    type: "select",
    label: "专业方向：",
    key: "zyfx",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    placeholder: ""
  },
  {
    type: "select",
    label: "项目类别：",
    key: "xmlb",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    placeholder: ""
  },
  {
    type: "select",
    label: "对口业务部门：",
    key: "dkywbm",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    disabled: false
  },
  {
    type: "input",
    label: "总费用（万元）（评审前）：",
    key: "zfy",
    width: 473,
    maxlength: 20,
    disabled: false
  },
  {
    type: "input",
    label: "当年费用（万元）（评审前）：",
    key: "dnfy",
    width: 473,
    maxlength: 20,
    disabled: false
  },
  {
    type: "datepicker",
    label: "开始时间",
    clearable: true,
    disabled: false,
    width: "473px",
    dateType: "month",
    key: "declareStartDate",
    valFormat: "yyyy-MM",
    placeholder: [""]
  },
  {
    type: "datepicker",
    label: "结束时间",
    clearable: true,
    disabled: false,
    width: "473px",
    dateType: "month",
    key: "declareEndDate",
    valFormat: "yyyy-MM",
    placeholder: [""]
  },
  // {
  //   type: "datepicker",
  //   key: "hysj",
  //   embed: true,
  //   selectClass: "dsptDate",
  //   selectEmbedLabel: "会议时间",
  //   width: 473,
  //   embedWidth: 90,
  //   placeholder: ["开始时间", "结束时间"],
  //   dateType: "daterange",
  //   valFormat: "yyyy-MM"
  // },
  {
    type: "cascader",
    label: "参与单位：",
    key: "cydw",
    width: 473,
    options: [],
    placeholder: "",
    props: {
      expandTrigger: "hover",
      multiple: false,
      value: "orgId",
      label: "orgName",
      children: "children"
    }
  },
  {
    type: "input",
    label: "参与单位：",
    key: "cydwName",
    width: 473,
    maxlength: 100,
    notShow: true,
    disabled: false
  },
  {
    type: "input",
    label: "合作单位：",
    key: "hzdw",
    width: 473,
    maxlength: 100,
    disabled: false
  },
  {
    type: "input",
    label: "项目负责人：",
    key: "xmfzr",
    width: 473,
    maxlength: 100,
    disabled: false
  },
  {
    type: "input",
    label: "项目人员涉及部门或单位：",
    key: "xmrybm",
    width: 473,
    maxlength: 50,
    disabled: false
  },
  {
    type: "input",
    label: "项目参与人员：",
    key: "xmcyry",
    width: 473,
    maxlength: 50,
    disabled: false
  },
  {
    type: "input",
    label: "项目联系人联系方式：",
    key: "xmlxrtel",
    width: 473,
    maxlength: 50,
    disabled: false
  },
  {
    type: "input",
    label: "项目联系人：",
    key: "xmlxr",
    width: 473,
    maxlength: 50,
    disabled: false
  },
  {
    type: "select",
    label: "科研创新团队：",
    key: "kycxtd",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    placeholder: ""
  },
  {
    type: "select",
    label: "实验室：",
    key: "sysmc",
    width: 473,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    placeholder: ""
  },
  {
    type: "input",
    label: "发表核心期刊及以上论文（篇）：",
    key: "fblw",
    width: 473,
    maxlength: 10,
    disabled: false
  },
  {
    type: "input",
    label: "发明专利（项）：",
    key: "fmzl",
    width: 473,
    maxlength: 10,
    disabled: false
  },
  {
    type: "input",
    label: "申请软件著作权（项）：",
    key: "sqrz",
    width: 473,
    maxlength: 10,
    disabled: false
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    maxlength: 300,
    label: "存在问题及需求必要性说明：",
    key: "czwt",
    width: 968
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    maxlength: 500,
    label: "研究内容：",
    key: "yjnr",
    width: 968
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    maxlength: 400,
    label: "研究内容的预期目标：",
    key: "yqmb",
    width: 968
  },
  {
    type: "input",
    kind: "textarea",
    showWordLimit: true,
    label: "备注：",
    key: "bz",
    width: 968
  },
  {
    type: "input",
    label: "知识产权的考核指标：",
    key: "yqmbhcgzb",
    width: 968,
    disabled: true
  }
];

const xqxmFormData = {
  xqpcbh: "",
  kybh: "系统自动生成",
  projectName: "",
  xqbh: "",
  xmcddw: "",
  jsly: "",
  zyfx: "",
  xmlb: "",
  dkywbm: "",
  zfy: "",
  dnfy: "",
  declareStartDate: "",
  declareEndDate: "",
  cydw: "",
  hzdw: "",
  xmfzr: "",
  xmrybm: "",
  xmcyry: "",
  xmlxrtel: "",
  xmlxr: "",
  kycxtd: "",
  sysmc: "",
  fblw: "",
  fmzl: "",
  sqrz: "",
  czwt: "",
  yjnr: "",
  yqmb: "",
  bz: "",
  yqmbhcgzb: ""
};

const xqxmFormRules = Object.freeze({
  xqpcbh: [{ required: true, message: "请选择申报批次", trigger: "change" }],
  projectName: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
  xmcddw: [
    { required: true, message: "请选择项目承担单位", trigger: "change" }
  ],
  jsly: [{ required: true, message: "请选择技术领域", trigger: "change" }],
  zyfx: [{ required: true, message: "请选择专业方向", trigger: "change" }],
  xmlb: [{ required: true, message: "请选择项目类别", trigger: "change" }],
  dkywbm: [{ required: true, message: "请填写对口业务部门", trigger: "change" }],
  zfy: [
    { required: true, message: "请填写总费用（评审前）", trigger: "blur" },
    { validator: checkFloatValue, trigger: "blur" }
  ],
  dnfy: [
    { required: true, message: "请填写当年费用（评审前）", trigger: "blur" },
    { validator: checkFloatValue, trigger: "blur" }
  ],
  declareEndDate: [{ required: true, message: "请填写结束时间", trigger: "blur" }],
  xmfzr: [{ required: true, message: "请填写项目负责人", trigger: "blur" }],
  xmrybm: [
    { required: true, message: "请填写项目人员涉及部门或单位", trigger: "blur" }
  ],
  xmcyry: [{ required: true, message: "请填写项目参与人员", trigger: "blur" }],
  xmlxrtel: [
    { required: true, message: "请填写项目联系人联系方式", trigger: "blur" },
    // { validator: regex.checkPhone, trigger: "blur" }
  ],
  xmlxr: [{ required: true, message: "请填写项目联系人", trigger: "blur" }],
  czwt: [
    {
      required: true,
      message: "请填写存在问题及需求必要性说明",
      trigger: "blur"
    },
    { max: 300, message: "请限制文字于300字以内！", trigger: "change" }
  ],
  yjnr: [
    { required: true, message: "请填写研究内容", trigger: "blur" },
    { max: 500, message: "请限制文字于500字以内！", trigger: "change" }
  ],
  yqmb: [
    { required: true, message: "请填写研究内容的预期目标", trigger: "blur" },
    { max: 400, message: "请限制文字于400字以内！", trigger: "change" }
  ],

  fmzl: [{ validator: checkValue, trigger: "blur" }],
  fblw: [{ validator: checkValue, trigger: "blur" }],
  sqrz: [{ validator: checkValue, trigger: "blur" }]
});

export { xqxmFormConfig, xqxmFormConfigDisable, xqxmFormData, xqxmFormRules };
