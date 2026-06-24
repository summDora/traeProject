import regex from "@/utils/regex";

const checkNum = (rule, value, callback) => {
  const reg = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
  if (!value || reg.test(value)) {
    callback();
  } else {
    return callback(new Error("请输入非负数"));
  }
};

const jsFormConfig = [
  {
    type: "input",
    label: "项目编码：",
    key: "xmbh",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "投资渠道：",
    key: "investmentChannelName",
    placeholder: "",
    width: 312,
    disabled: true
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
    maxlength: 50
  },
  {
    type: "select",
    label: "项目分类：",
    key: "projectClassify",
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
    type: "select",
    label: "项目建设情况：",
    key: "xmjsqk",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
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
    label: "应用维度：",
    key: "yywd",
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
    label: "项目目标：",
    key: "xmmb",
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

const jsFormData = {
  xmbh: "项目编码自动生成",
  investmentChannelName: "",
  sbdw: [],
  projectName: "",
  xmsx: "",
  projectClassify: "",
  sfhkf: "",
  ywubm: "",
  yywd: "",
  sfwwjh: "",
  zydl: "",
  zyxl: "",
  xmjsqk: "",
  ssfw: "",
  xmmb: "",
  xmnr: "",
  bz: ""
};

const jsFormRules = Object.freeze({
  sbdw: [{ required: true, message: "请选择项目单位", trigger: "change" }],
  projectName: [
    { required: true, message: "请填写项目名称", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  xmsx: [{ required: true, message: "请选择项目属性", trigger: "change" }],
  projectClassify: [{ required: true, message: "请选择项目分类", trigger: "change" }],
  ywubm: [{ required: true, message: "请选择业务部门", trigger: "change" }],
  sfwwjh: [
    { required: true, message: "请选择是否涉及内外网交互", trigger: "change" }
  ],
  zydl: [{ required: true, message: "请选择专业大类", trigger: "change" }],
  zyxl: [{ required: true, message: "请选择专业小类", trigger: "change" }],
  xmjsqk: [
    { required: true, message: "请选择项目建设情况", trigger: "change" }
  ],
  ssfw: [
    { required: true, message: "请填写实施范围", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  xmmb: [
    { required: true, message: "请填写项目目标", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  xmnr: [
    { required: true, message: "请填写项目内容", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ]
});

const jsBottomZtzFormConfig = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzJagc",
    type: "input",
    label: "建安工程：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzZxsj",
    type: "input",
    label: "咨询设计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzKf",
    type: "input",
    label: "系统开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSs",
    type: "input",
    label: "集成实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzYyfw",
    type: "input",
    label: "运营服务：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSjcp",
    type: "input",
    label: "数据产品：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSjbz",
    type: "input",
    label: "数据标准：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSjcpss",
    type: "input",
    label: "数据产品实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  },
];

const ztzFormData = {
  ztzHj: "",
  ztzKf: "",
  ztzQt: "",
  ztzRj: "",
  ztzSs: "",
  ztzYj: "",
  ztzJagc: "",
  ztzZxsj: "",
  ztzYyfw: "",
  ztzSjcp: "",
  ztzSjbz: "",
  ztzSjcpss: ""
};

const jsBottomZtzFormConfigZXSJ = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzZxsj",
    type: "input",
    label: "咨询设计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ztzFormDataZXSJ = {
  ztzHj: "",
  ztzZxsj: "",
  ztzQt: ""
};

const jsBottomZtzFormConfigXTKFOrJCSS = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzKf",
    type: "input",
    label: "系统开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSs",
    type: "input",
    label: "集成实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ztzFormDataXTKFOrJCSS = {
  ztzHj: "",
  ztzKf: "",
  ztzSs: "",
  ztzQt: ""
};

const jsBottomZtzFormConfigYWYY = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzYyfw",
    type: "input",
    label: "运营服务：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ztzFormDataYWYY = {
  ztzHj: "",
  ztzYyfw: "",
  ztzQt: ""
};

const jsBottomZtzFormConfigSJGC = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSjcp",
    type: "input",
    label: "数据产品：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSjbz",
    type: "input",
    label: "数据标准：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzSjcpss",
    type: "input",
    label: "数据产品实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ztzFormDataSJGC = {
  ztzHj: "",
  ztzSjcp: "",
  ztzSjbz: "",
  ztzSjcpss: "",
  ztzQt: ""
};

const jsBottomZtzFormConfigCPGZ = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ztzFormDataCPGZ = {
  ztzHj: "",
  ztzRj: "",
  ztzYj: "",
  ztzQt: ""
};

const jsBottomZtzFormConfigJF = [
  {
    key: "ztzHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzJagc",
    type: "input",
    label: "建安工程：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ztzQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ztzFormDataJF = {
  ztzHj: "",
  ztzJagc: "",
  ztzRj: "",
  ztzYj: "",
  ztzQt: ""
};

const jsBottomYwcFormConfig = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcJagc",
    type: "input",
    label: "建安工程：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcZxsj",
    type: "input",
    label: "咨询设计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcKf",
    type: "input",
    label: "系统开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSs",
    type: "input",
    label: "集成实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcYyfw",
    type: "input",
    label: "运营服务：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSjcp",
    type: "input",
    label: "数据产品：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSjbz",
    type: "input",
    label: "数据标准：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSjcpss",
    type: "input",
    label: "数据产品实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  },
];

const ywcFormData = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcYj: "0",
  ywcRj: "0",
  ywcKf: "0",
  ywcSs: "0",
  ywcQt: "0",
  ywcJagc: "0",
  ywcZxsj: "0",
  ywcYyfw: "0",
  ywcSjcp: "0",
  ywcSjbz: "0",
  ywcSjcpss: "0"
};

const ywcFormRules = Object.freeze({
  ywcYj: [
    { required: true, message: "请填写硬件购置", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcRj: [
    { required: true, message: "请填写软件购置", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcKf: [
    { required: true, message: "请填写系统开发", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcSs: [
    { required: true, message: "请填写集成实施", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcQt: [
    { required: true, message: "请填写其他费用", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcJagc: [
    { required: true, message: "请填写建安工程", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcZxsj: [
    { required: true, message: "请填写咨询设计", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcYyfw: [
    { required: true, message: "请填写运营服务", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcSjcp: [
    { required: true, message: "请填写数据产品", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcSjbz: [
    { required: true, message: "请填写数据标准", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  ywcSjcpss: [
    { required: true, message: "请填写数据产品实施", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ]
});

const jsBottomYwcFormConfigZXSJ = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZxsj",
    type: "input",
    label: "咨询设计：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ywcFormDataZXSJ = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcZxsj: "0",
  ywcQt: "0"
};

const jsBottomYwcFormConfigXTKFOrJCSS = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcKf",
    type: "input",
    label: "系统开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSs",
    type: "input",
    label: "集成实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ywcFormDataXTKFOrJCSS = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcKf: "0",
  ywcSs: "0",
  ywcQt: "0"
};

const jsBottomYwcFormConfigYWYY = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcYyfw",
    type: "input",
    label: "运营服务：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ywcFormDataYWYY = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcYyfw: "0",
  ywcQt: "0"
};

const jsBottomYwcFormConfigSJGC = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcSjcp",
    type: "input",
    label: "数据产品：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSjbz",
    type: "input",
    label: "数据标准：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcSjcpss",
    type: "input",
    label: "数据产品实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ywcFormDataSJGC = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcSjcp: "0",
  ywcSjbz: "0",
  ywcSjcpss: "0",
  ywcQt: "0"
};

const jsBottomYwcFormConfigCPGZ = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ywcFormDataCPGZ = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcRj: "0",
  ywcYj: "0",
  ywcQt: "0"
};

const jsBottomYwcFormConfigJF = [
  {
    key: "ywcHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "ywcJagc",
    type: "input",
    label: "建安工程：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "ywcQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const ywcFormDataJF = {
  ywcHj: "0",
  ywcZbj: "0",
  ywcCbj: "0",
  ywcJagc: "0",
  ywcRj: "0",
  ywcYj: "0",
  ywcQt: "0"
};

const jsBottomJhFormConfig = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhJagc",
    type: "input",
    label: "建安工程：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhZxsj",
    type: "input",
    label: "咨询设计：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhKf",
    type: "input",
    label: "系统开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSs",
    type: "input",
    label: "集成实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhYyfw",
    type: "input",
    label: "运营服务：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSjcp",
    type: "input",
    label: "数据产品：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSjbz",
    type: "input",
    label: "数据标准：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSjcpss",
    type: "input",
    label: "数据产品实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  },
];

const jhFormData = {
  jhCbj: "0",
  jhHj: "0",
  jhKf: "0",
  jhQt: "0",
  jhRj: "0",
  jhSs: "0",
  jhYj: "0",
  jhZbj: "0",
  jhJagc: "0",
  jhZxsj: "0",
  jhYyfw: "0",
  jhSjcp: "0",
  jhSjbz: "0",
  jhSjcpss: "0"
};

const jhFormRules = Object.freeze({
  jhYj: [
    { required: true, message: "请填写硬件购置", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhRj: [
    { required: true, message: "请填写软件购置", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhKf: [
    { required: true, message: "请填写系统开发", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhSs: [
    { required: true, message: "请填写集成实施", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhQt: [
    { required: true, message: "请填写其他费用", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhJagc: [
    { required: true, message: "请填写建安工程", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhZxsj: [
    { required: true, message: "请填写咨询设计", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhYyfw: [
    { required: true, message: "请填写运营服务", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhSjcp: [
    { required: true, message: "请填写数据产品", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhSjbz: [
    { required: true, message: "请填写数据标准", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ],
  jhSjcpss: [
    { required: true, message: "请填写数据产品实施", trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ]
});

const jsBottomJhFormConfigZXSJ = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZxsj",
    type: "input",
    label: "咨询设计：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const jhFormDataZXSJ = {
  jhHj: "0",
  jhZbj: "0",
  jhCbj: "0",
  jhZxsj: "0",
  jhQt: "0"
};

const jsBottomJhFormConfigXTKFOrJCSS = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhKf",
    type: "input",
    label: "系统开发：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSs",
    type: "input",
    label: "集成实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const jhFormDataXTKFOrJCSS = {
  jhHj: "0",
  jhZbj: "0",
  jhCbj: "0",
  jhKf: "0",
  jhSs: "0",
  jhQt: "0"
};

const jsBottomJhFormConfigYWYY = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhYyfw",
    type: "input",
    label: "运营服务：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const jhFormDataYWYY = {
  jhHj: "0",
  jhZbj: "0",
  jhCbj: "0",
  jhYyfw: "0",
  jhQt: "0"
};

const jsBottomJhFormConfigSJGC = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhSjcp",
    type: "input",
    label: "数据产品：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSjbz",
    type: "input",
    label: "数据标准：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhSjcpss",
    type: "input",
    label: "数据产品实施：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const jhFormDataSJGC = {
  jhHj: "0",
  jhZbj: "0",
  jhCbj: "0",
  jhSjcp: "0",
  jhSjbz: "0",
  jhSjcpss: "0",
  jhQt: "0"
};

const jsBottomJhFormConfigCPGZ = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const jhFormDataCPGZ = {
  jhHj: "0",
  jhZbj: "0",
  jhCbj: "0",
  jhRj: "0",
  jhYj: "0",
  jhQt: "0"
};

const jsBottomJhFormConfigJF = [
  {
    key: "jhHj",
    type: "input",
    label: "合计：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhZbj",
    type: "input",
    label: "资本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhCbj",
    type: "input",
    label: "成本金：",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    key: "jhJagc",
    type: "input",
    label: "建安工程：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhRj",
    type: "input",
    label: "软件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhYj",
    type: "input",
    label: "硬件购置：",
    placeholder: "",
    width: 312
  },
  {
    key: "jhQt",
    type: "input",
    label: "其他费用：",
    placeholder: "",
    width: 312
  }
];
const jhFormDataJF = {
  jhHj: "0",
  jhZbj: "0",
  jhCbj: "0",
  jhJagc: "0",
  jhRj: "0",
  jhYj: "0",
  jhQt: "0"
};

const ywFormConfig = [
  {
    type: "input",
    label: "项目编码：",
    key: "xmbh",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "投资渠道：",
    key: "investmentChannelName",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "cascader",
    label: "项目单位：",
    key: "sbdw",
    placeholder: "",
    width: 312,
    options: [],
    props: {
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
    width: 312,
    maxlength: 50
  },
  {
    type: "select",
    label: "项目分类：",
    key: "projectClassify",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    label: "项目小类：",
    key: "xmxl",
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
    label: "被保资产对象说明：",
    key: "zcdx",
    placeholder: "",
    width: 968
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "服务具体内容：",
    key: "jtnr",
    placeholder: "",
    width: 968
  },
  {
    type: "select",
    label: "业务部门（单位）：",
    key: "ywubm",
    placeholder: "",
    width: 312,
    options: [],
    labelName: "orgName",
    labeKey: "orgId"
  },
  {
    type: "input",
    label: "运维部门（单位）：",
    key: "ywbm",
    placeholder: "",
    width: 312,
    maxlength: 30
  },
  {
    type: "input",
    label: "起止时间：",
    key: "qzsj",
    placeholder: "",
    width: 312,
    maxlength: 30
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
    type: "input",
    label: "测算费用：",
    key: "zyzyf",
    placeholder: "",
    width: 312,
    maxlength: 1000
  },
  {
    type: "input",
    label: "总费用：",
    key: "zfy",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "一线费用：",
    key: "fy1",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "二线费用：",
    key: "fy2",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "三线费用：",
    key: "fy3",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "耗材费：",
    key: "hcf",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "软件许可维护费：",
    key: "rjxkf",
    placeholder: "",
    width: 312,
    disabled: true
  },
  {
    type: "input",
    label: "维修配件费：",
    key: "wxpjf",
    placeholder: "",
    width: 312,
    disabled: true
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

const ywFormData = {
  xmbh: "项目编码自动生成",
  investmentChannelName: "",
  sbdw: [],
  projectName: "",
  projectClassify: "",
  xmxl: "",
  zcdx: "",
  jtnr: "",
  yewubm: "",
  ywbm: "",
  qzsj: "",
  yywd: "",
  zyzyf: "",
  zfy: "",
  fy1: "",
  fy2: "",
  fy3: "",
  hcf: "",
  rjxkf: "",
  wxpjf: "",
  bz: ""
};

const ywFormRules = {
  sbdw: [{ required: true, message: "请选择项目单位", trigger: "change" }],
  projectName: [
    { required: true, message: "请输入项目名称", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  projectClassify: [{ required: true, message: "请选择项目分类", trigger: "change" }],
  xmxl: [{ required: true, message: "请选择项目小类", trigger: "change" }],
  zcdx: [
    { required: true, message: "请输入被保资产对象说明", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  jtnr: [
    { required: true, message: "请输入服务具体内容", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  ywubm: [{ required: true, message: "请选择业务部门", trigger: "change" }],
  ywbm: [
    { required: true, message: "请输入运维部门", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  qzsj: [
    { required: true, message: "请输入起止时间", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  yywd: [
    { required: true, message: "请输入应用维度", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" }
  ],
  zyzyf: [
    { required: true, message: "请输入测算费用", trigger: "blur" },
    { validator: regex.checkName, trigger: "blur" },
    { validator: checkNum, trigger: "blur" }
  ]
};

export {
  jsFormConfig,
  jsFormData,
  jsFormRules,
  jsBottomZtzFormConfig,
  ztzFormData,
  jsBottomYwcFormConfig,
  ywcFormData,
  ywcFormRules,
  jsBottomJhFormConfig,
  jhFormData,
  jhFormRules,
  ywFormConfig,
  ywFormData,
  ywFormRules,
  jsBottomZtzFormConfigZXSJ,
  jsBottomZtzFormConfigXTKFOrJCSS,
  jsBottomZtzFormConfigYWYY,
  jsBottomZtzFormConfigSJGC,
  jsBottomZtzFormConfigCPGZ,
  jsBottomZtzFormConfigJF,
  ztzFormDataZXSJ,
  ztzFormDataXTKFOrJCSS,
  ztzFormDataYWYY,
  ztzFormDataSJGC,
  ztzFormDataCPGZ,
  ztzFormDataJF,
  jsBottomYwcFormConfigZXSJ,
  ywcFormDataZXSJ,
  jsBottomYwcFormConfigXTKFOrJCSS,
  ywcFormDataXTKFOrJCSS,
  jsBottomYwcFormConfigYWYY,
  ywcFormDataYWYY,
  jsBottomYwcFormConfigSJGC,
  ywcFormDataSJGC,
  jsBottomYwcFormConfigCPGZ,
  ywcFormDataCPGZ,
  jsBottomYwcFormConfigJF,
  ywcFormDataJF,
  jsBottomJhFormConfigZXSJ,
  jhFormDataZXSJ,
  jsBottomJhFormConfigXTKFOrJCSS,
  jhFormDataXTKFOrJCSS,
  jsBottomJhFormConfigYWYY,
  jhFormDataYWYY,
  jsBottomJhFormConfigSJGC,
  jhFormDataSJGC,
  jsBottomJhFormConfigCPGZ,
  jhFormDataCPGZ,
  jsBottomJhFormConfigJF,
  jhFormDataJF
};
