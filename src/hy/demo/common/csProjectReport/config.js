import regex from "@/utils/regex";

const formConfig = [
  {
    type: "input",
    label: "关联可研：",
    key: "kybh",
    width: 232,
    disabled: true,
    clearable: true,
    showGlxqBtn: true
  },
  {
    type: "input",
    label: "项目编号：",
    key: "erpxmbh",
    placeholder: "",
    width: 312
  },
  {
    type: "cascader",
    label: "项目单位：",
    key: "sbdw",
    placeholder: "",
    width: 312,
    options: [],
    props: {
      checkStrictly: false,
      expandTrigger: "hover",
      multiple: false,
      value: "busCode",
      label: "name",
      children: "children"
    }
  },
  {
    type: "input",
    label: "项目名称：",
    key: "projectName",
    placeholder: "",
    width: 968,
    maxlength: 200
  },
  {
    type: "select",
    label: "业务部门：",
    key: "ywubm",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "orgName",
    labeKey: "orgId"
  },
  {
    type: "select",
    label: "专业大类：",
    key: "zydl",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    label: "专业小类：",
    key: "zyxl",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal",
    disabled: true
  },
  {
    type: "select",
    label: "是否涉及内外网交互：",
    key: "sfwwjh",
    placeholder: "",
    width: 312,
    options: [{ label: "是", value: "1" }, { label: "否", value: "0" }],
    labelName: "label",
    labeKey: "value"
  },
  {
    type: "select",
    label: "是否有数据模型测试报告：",
    key: "sfysjmx",
    placeholder: "",
    width: 312,
    options: [{ label: "是", value: "1" }, { label: "否", value: "0" }],
    labelName: "label",
    labeKey: "value"
  },
  {
    type: "select",
    label: "是否含开发：",
    key: "sfhkf",
    placeholder: "",
    width: 312,
    options: [{ label: "是", value: "1" }, { label: "否", value: "0" }],
    labelName: "label",
    labeKey: "value"
  },
  {
    type: "select",
    label: "项目性质：",
    key: "xmxz",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    label: "应用维度：",
    key: "yywd",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    label: "项目属性：",
    key: "xmsx",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "实施范围：",
    key: "ssfw",
    placeholder: "",
    width: 968
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "项目内容：",
    key: "xmnr",
    placeholder: "",
    width: 968
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "备注：",
    key: "bz",
    placeholder: "",
    width: 968
  }
];

const formData = {
  erpxmbh: "",
  sbdw: [],
  projectName: "",
  xdxmsx: "",
  xmsx: "",
  sfwwjh: "",
  sfhkf: "",
  ywubm: "",
  yywd: "",
  ssfw: "",
  xmnr: "",
  bz: "",
  kybh: "",
  zydl: "",
  zyxl: "",
  sfysjmx: ""
};

const formRules = Object.freeze({
  erpxmbh: [
    { required: true, message: "请填写项目编号", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  sbdw: [{ required: true, message: "请选择项目单位", trigger: "change" }],
  projectName: [
    { required: true, message: "请填写项目名称", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  xmxz: [{ required: true, message: "请选择项目性质", trigger: "change" }],
  xmsx: [{ required: true, message: "请选择项目属性", trigger: "change" }],
  sfhkf: [{ required: true, message: "请选择是否含开发", trigger: "change" }],
  sfwwjh: [
    { required: true, message: "请选择是否涉及内外网交互", trigger: "change" }
  ],
  ywubm: [{ required: true, message: "请选择业务部门", trigger: "change" }],
  ssfw: [
    { required: true, message: "请填写实施范围", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  xmnr: [
    { required: true, message: "请填写项目内容", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  zydl: [{ required: true, message: "请选择专业大类", trigger: "change" }],
  zyxl: [{ required: true, message: "请选择专业小类", trigger: "change" }],
  sfysjmx: [
    { required: true, message: "请选择是否有数据模型", trigger: "change" }
  ]
});

const csZtzFormConfig = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "xdtz",
    type: "input",
    label: "累计已下达计划：",
    placeholder: "",
    width: 312
  }
];

const csZtzFormData = {
  ztzHj: "",
  xdtz: ""
};

const checkNum = (rule, value, callback) => {
  const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
  if (!value || reg.test(value)) {
    callback();
  } else {
    return callback(new Error("请输入非负数"));
  }
};

const csZtzFormRules = Object.freeze({
  xdtz: [{ validator: checkNum, trigger: "blur" }]
});

const csZjgcFormConfig = [
  {
    key: "sshj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "sszbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312
  },
  {
    key: "sscbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312
  }
];

const csZjgcFormData = {
  sshj: "",
  sszbj: "",
  sscbj: ""
};

const csZjytFormConfig = [
  {
    key: "jhYj",
    type: "input",
    label: "硬件：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhRj",
    type: "input",
    label: "软件：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhKf",
    type: "input",
    label: "开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSs",
    type: "input",
    label: "实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他：",
    placeholder: "",
    width: 312
  }
];

const csZjytFormData = {
  jhYj: "",
  jhRj: "",
  jhKf: "",
  jhSs: "",
  jhQt: ""
};

export {
  formConfig,
  formData,
  formRules,
  csZtzFormConfig,
  csZtzFormData,
  csZtzFormRules,
  csZjgcFormConfig,
  csZjgcFormData,
  csZjytFormConfig,
  csZjytFormData
};
