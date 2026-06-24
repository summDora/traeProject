const formConfig = {
  searchConfig: [
    {
      width: 260,
      embedWidth: 90,
      type: "input",
      key: "userName",
      placeholder: "请输入姓名",
      selectEmbedLabel: "姓名",
      size: "small",
      disabled: false,
      clearable: true
    },
    {
      width: 450,
      embedWidth: 90,
      type: "dateTimepicker",
      dateTimeType: "datetimerange",
      format: "yyyy-MM-dd HH:mm",
      key: "moveDate",
      placeholder: ["开始日期", "结束日期"],
      selectClass: "selectEmbed",
      selectEmbedLabel: "入住时间",
      embed: true,
      clearable: true
    },
    {
      type: "select",
      placeholder: "请选择是否参会",
      key: "status",
      embed: true,
      multiple: false,
      selectClass: "selectEmbed",
      selectEmbedLabel: "是否参会",
      width: 260,
      embedWidth: 90,
      options: [
        {
          dataVal: "0",
          dataLabel: "未回执"
        },
        {
          dataVal: "1",
          dataLabel: "不参会"
        },
        {
          dataVal: "2",
          dataLabel: "参会"
        }
      ],
      labelName: "dataLabel",
      labeKey: "dataVal"
    },
    {
      type: "select",
      placeholder: "请选择是否预订房间",
      key: "isMove",
      embed: true,
      multiple: false,
      selectClass: "selectEmbed_6",
      selectEmbedLabel: "是否预订房间",
      width: 280,
      embedWidth: 90,
      options: [
        {
          dataVal: "0",
          dataLabel: "否"
        },
        {
          dataVal: "1",
          dataLabel: "是"
        }
      ],
      labelName: "dataLabel",
      labeKey: "dataVal"
    }
  ],

  searchData: {
    userName: "",
    status: "",
    isMove: "",
    moveDate: []
  }
};

const columnConfig = Object.freeze([
  {
    key: "roleName",
    label: "参会角色"
  },
  {
    key: "professorNumber",
    label: "工号"
  },
  {
    key: "userName",
    label: "用户姓名"
  },
  {
    key: "tel",
    label: "手机号码"
  },
  {
    key: "statusName",
    label: "是否参会"
  },
  {
    key: "moveName",
    label: "是否预订房间",
    isSlot: true,
    slotName: "moveName"
  },
  {
    key: "moveStartDate",
    label: "入住日期"
  },
  {
    key: "moveEndDate",
    label: "退房日期"
  },
  {
    key: "roomNum",
    label: "预订房间数",
    isSlot: true,
    slotName: "roomNum"
  },
  {
    key: "movePeople",
    label: "入住人数",
    isSlot: true,
    slotName: "movePeople"
  },
  {
    key: "replyRemark",
    label: "备注"
  },
  {
    key: "createDate",
    label: "回执时间"
  }
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

export { formConfig, columnConfig };
