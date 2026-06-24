const formConfig = [
  {
    type: "input",
    label: "项目名称：",
    key: "projectName",
    placeholder: "",
    width: 968,
    maxlength: 200
  },
  {
    type: "input",
    label: "项目编号：",
    key: "xmbh",
    placeholder: "",
    width: 312,
    disabled: true
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
    type: "input",
    label: "业务部门联系人：",
    key: "ywubmlxr",
    placeholder: "",
    width: 312,
    maxlength: 50
  },
  {
    type: "input",
    label: "业务部门联系方式：",
    key: "ywubmlxfx",
    placeholder: "",
    width: 312,
    maxlength: 50
  },
  {
    type: "cascader",
    label: "建设单位：",
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
    label: "建设单位联系人：",
    key: "jsdwlxr",
    placeholder: "",
    width: 312,
    maxlength: 50
  },
  {
    type: "input",
    label: "建设单位联系方式：",
    key: "jsdwlxfx",
    placeholder: "",
    width: 312,
    maxlength: 50
  },
  {
    type: "input",
    label: "项目经理/大客户经理：",
    key: "xmjl",
    placeholder: "",
    width: 312,
    maxlength: 50
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "项目概况：",
    key: "xmgk",
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
  xmbh: "系统自动生成",
  projectName: "",
  ywubm: "",
  ywubmlxr: "",
  ywubmlxfx: "",
  sbdw: [],
  jsdwlxr: "",
  jsdwlxfx: "",
  xmjl: "",
  xmgk: "",
  bz: ""
};

const formRules = Object.freeze({
  projectName: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
  ywubm: [{ required: true, message: "请选择业务部门", trigger: "change" }],
  sbdw: [{ required: true, message: "请选择建设单位", trigger: "change" }]
});

const csFormConfig = [
  {
    type: "datepicker",
    label: "初审时间：",
    clearable: true,
    disabled: true,
    width: "312px",
    dateType: "date",
    key: "cssj",
    valFormat: "yyyy-MM-dd",
    placeholder: ["初审时间"]
  },
  {
    type: "select",
    label: "是否安委会评审：",
    key: "sfps",
    placeholder: "",
    width: 312,
    options: [
      {
        orgName: "是",
        orgId: "1"
      },
      {
        orgName: "否",
        orgId: "0"
      }
    ],
    labelName: "orgName",
    labeKey: "orgId",
    disabled: true
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "规范性审查意见：",
    key: "scyj",
    placeholder: "",
    width: 968,
    disabled: true
  },
  {
    type: "input",
    kind: "textarea",
    autosize: true,
    showWordLimit: true,
    maxlength: 1000,
    label: "初审意见：",
    key: "csyj",
    placeholder: "",
    width: 968,
    disabled: true
  }
];

const csFormData = {
  cssj: "",
  sfps: "",
  scyj: "",
  csyj: ""
};

export { formConfig, formData, formRules, csFormConfig, csFormData };
