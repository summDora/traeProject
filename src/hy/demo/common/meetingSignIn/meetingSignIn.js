const formConfig = {
  searchConfig: [
    {
      width: 260,
      embedWidth: 90,
      type: "select",
      key: "role",
      selectEmbedLabel: "参会角色",
      placeholder: "请选择参会角色",
      selectClass: "selectEmbed",
      options: [
        {name:"专家",value:"0"},
        {name:"组长",value:"1"},
        {name:"负责人",value:"2"},
        {name:"项目单位",value:"3"},
      ],
      labelName: "name",
      labeKey: "value",
      size: "small",
      multiple: false,
      embed: true,
      clearable: true,
    },
    {
      width: 260,
      embedWidth: 90,
      type: "input",
      key: "userName",
      size:"small",
      placeholder: "请输入工号/用户名",
      selectEmbedLabel: "工号/用户名",
      disabled: false,
      clearable: true
    },
    
    {
      width: 260,
      embedWidth: 90,
      type: "select",
      key: "type",
      selectEmbedLabel: "签到状态",
      placeholder: "请选择签到状态",
      selectClass: "selectEmbed",
      options: [
        {name:"未签到",value:"0"},
        {name:"已签到",value:"1"},
      ],
      labelName: "name",
      labeKey: "value",
      size: "small",
      multiple: false,
      embed: true,
      clearable: true,
    },
    {
      type: "datepicker",
      placeholder: "请选择签到日期",
      key: "createDate",
      embed: true,
      selectClass: "selectEmbed",
      selectEmbedLabel: "签到日期",
      dateType: "date",
      valFormat: "yyyy-MM-dd",
      width: 260,
      embedWidth: 90,
    },
  ],

  searchData: {
    userName:"",
    type:"",
    role:"",
    createDate:"",
    meetingId: '',
    businessType: ''
  }
};

const columnConfig = Object.freeze([
  {
    key: 'roleName',
    label: '参会角色',
    width:110,
  },
  {
    key: 'userId',
    label: '工号',
    width:150,
  },
  {
    key: 'userName',
    label: '用户姓名',
    width:150,
  },
  {
    key: 'phone',
    label: '手机号',
    width:150,
  },
  {
    key: 'qdNum',
    label: '签到人数',
    width:110,
  },
  {
    key: 'isQdName',
    label: '签到状态',
    width:110,
  },
  {
    key: 'chUserName',
    label: '参会人',
    width:150,
  },
  {
    key: 'chPhone',
    label: '参会人手机',
    width:150,
  },
  {
    key: 'orgName',
    label: '所属单位',
    width:150,
  },
  {
    key: 'qdDate',
    label: '签到日期',
    width:150,
  },
]);
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
    label: "会议名称：",
    key: "xqmc",
    width: 312,
    maxlength: 100,
    disabled: true
  },
  {
    type: "select",
    label: "用户信息：",
    key: "kjxqdl",
    width: 312,
    options: [],
    labelName: "userName",
    labeKey: "userId"
  }
];

const xqxmFormData = {
  xqmc: "",
  kjxqdl: ""
};

const xqxmFormRules = Object.freeze({
  xqmc: [{ required: true, message: "请填写会议名称", trigger: "blur" }],
  kjxqdl: [{ required: true, message: "请选择用户信息", trigger: "change" }]
});

const xzryFormConfig = [
  {
    type: "input",
    label: "人员姓名:",
    key: "userName",
    width: 312,
    maxlength: 100,
    
  },
  {
    type: "input",
    label: "手机号码：",
    key: "phone",
    width: 312,
    maxlength: 11,
   
  },
  {
    type: "input",
    label: "所在单位：",
    key: "orgName",
    width: 312,
    maxlength: 100,
  
  }
]
const xzryFormData = {
  userName: '',
  phone: '',
  orgName: ''
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

const xzryFormRules = Object.freeze({
  userName: [{ required: true, message: "请填写人员姓名", trigger: "blur" }],
  phone: [{ required: true, message: "请填写手机号码", trigger: "blur" },
          {validator: phoneRequiredTrim,trigger: 'blur'}
          ],
  orgName: [{ required: true, message: "请填写所在单位", trigger: "blur" }]
})
const amaFormConfig = [
  {
    type: "input",
    label: "会议名称：",
    key: "xqmc",
    width: 312,
    maxlength: 100,
    disabled: true
  },
  {
    type: "select",
    label: "用户信息：",
    key: "kjxqdl",
    width: 312,
    options: [],
    labelName: "userName",
    labeKey: "userId",
    disabled: true
  },
  {
    type: "input",
    label: "手机号码：",
    key: "phone",
    width: 312,
    maxlength: 100,
    disabled: true
  },
  {
    type: "input",
    label: "参会角色：",
    key: "roleName",
    width: 312,
    maxlength: 100,
    disabled: true
  },
  {
    type: "input",
    label: "所在单位：",
    key: "orgName",
    width: 312,
    maxlength: 100,
    disabled: true
  }
];

const amaFormData = {
  xqmc: "",
  kjxqdl: "",
  phone: "",
  roleName: "",
  orgName: ""
};

const amaFormRules = Object.freeze({
  xqmc: [{ required: true, message: "请填写会议名称", trigger: "blur" }],
  kjxqdl: [{ required: true, message: "请选择用户信息", trigger: "change" }],
  sjh: [{ required: true, message: "请填写手机号", trigger: "blur" }],
  js: [{ required: true, message: "请填写参会角色", trigger: "blur" }],
  dw: [{ required: true, message: "请填写所在单位", trigger: "blur" }]
});

const buttonsData = [
  {
    id: "primary",
    text: "会议签到",
    icon:'icon iconfont iconyushenjilu',
    color:'#298BF5'
  },
  {
    id: "primary",
    text: "修改",
    icon:'icon iconfont iconxiugai',
    color:'#298BF5'
  },
  {
    id: "primary",
    text: "删除",
    icon:'icon iconfont iconshanchu',
    color:'#298BF5'
  },
  {
    id: "primary",
    text: "导入",
    icon:'icon iconfont iconshangchuan',
    color:'#298BF5'
  },
  {
    id: "primary",
    text: "导出",
    icon:'icon iconfont iconzu1192',
    color:'#298BF5'
  },
  
];
export {
  formConfig,
  columnConfig,
  xqxmFormConfig,
  xqxmFormData,
  xqxmFormRules,
  amaFormConfig,
  amaFormData,
  amaFormRules,
  xzryFormConfig,
  xzryFormData,
  xzryFormRules,
  buttonsData
};
