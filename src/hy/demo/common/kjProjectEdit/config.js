import regex from "@/utils/regex";

// 仅数字类型值校验
const checkValue = (rule, value, callback) => {
  let reg = /^\d{1,}$/;
  if (value) {
    if (!reg.test(value)) {
      callback(new Error("请输入数字值"));
    } else {
      return callback();
    }
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
  // xqpcbh: [{ required: true, message: "请选择申报批次", trigger: "change" }],
  // projectName: [{ required: true, message: "请填写项目名称", trigger: "blur" }],
  // xmcddw: [
  //   { required: true, message: "请选择项目承担单位", trigger: "change" }
  // ],
  // jsly: [{ required: true, message: "请选择技术领域", trigger: "change" }],
  // zyfx: [{ required: true, message: "请选择专业方向", trigger: "change" }],
  // xmlb: [{ required: true, message: "请选择项目类别", trigger: "change" }],
  // dkywbm: [{ required: true, message: "请填写对口业务部门", trigger: "blur" }],
  // zfy: [
  //   { required: true, message: "请填写总费用（评审前）", trigger: "blur" },
  //   { validator: checkFloatValue, trigger: "blur" }
  // ],
  // dnfy: [
  //   { required: true, message: "请填写当年费用（评审前）", trigger: "blur" },
  //   { validator: checkFloatValue, trigger: "blur" }
  // ],
  // declareEndDate: [{ required: true, message: "请填写结束时间", trigger: "blur" }],
  // xmfzr: [{ required: true, message: "请填写项目负责人", trigger: "blur" }],
  // xmrybm: [
  //   { required: true, message: "请填写项目人员涉及部门或单位", trigger: "blur" }
  // ],
  // xmcyry: [{ required: true, message: "请填写项目参与人员", trigger: "blur" }],
  // xmlxrtel: [
  //   { required: true, message: "请填写项目联系人联系方式", trigger: "blur" },
  //   { validator: regex.checkPhone, trigger: "blur" }
  // ],
  // xmlxr: [{ required: true, message: "请填写项目联系人", trigger: "blur" }],
  // czwt: [
  //   {
  //     required: true,
  //     message: "请填写存在问题及需求必要性说明",
  //     trigger: "blur"
  //   },
  //   { max: 300, message: "请限制文字于300字以内！", trigger: "change" }
  // ],
  // yjnr: [
  //   { required: true, message: "请填写研究内容", trigger: "blur" },
  //   { max: 500, message: "请限制文字于500字以内！", trigger: "change" }
  // ],
  // yqmb: [
  //   { required: true, message: "请填写研究内容的预期目标", trigger: "blur" },
  //   { max: 400, message: "请限制文字于400字以内！", trigger: "change" }
  // ],

  // fmzl: [{ validator: checkValue, trigger: "blur" }],
  // fblw: [{ validator: checkValue, trigger: "blur" }],
  // sqrz: [{ validator: checkValue, trigger: "blur" }]
});


const participationColumn = Object.freeze([
  {
    key: "userName",
    label: "*项目参与人员（必填）",
    isSlot: true,
    slotName: "userName",
    width: 80
  },
  {
    key: "referOrgName",
    label: "*项目人员涉及部门或单位（必填）",
    isSlot: true,
    slotName: "referOrgName",
    width: 120
  },
  {
    key: "compId",
    label: "识别单位",
    isSlot: true,
    slotName: "compId",
    width: 110
  },
  {
    key: "type",
    label: "是否为外部单位",
    isSlot: true,
    slotName: "type",
    width: 70
  },
  {
    key: "operation",
    label: '操作',
    slotName: "operation",
    fixed: true,
    isLastSlot: true,
    width:40,
  },
]);

export { xqxmFormData, xqxmFormRules,participationColumn };
