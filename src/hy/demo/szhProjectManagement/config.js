const getPlanYears = () => {
  const yearMax = new Date().getFullYear();
  const years = [
    {
      key: "",
      value: "全部"
    }
  ];
  for (let i = yearMax; i >= 2017; i--) {
    years.push({
      key: i,
      value: i
    });
  }
  return years;
};

const years = getPlanYears();

const projectSearchConfig = [
  {
    type: "select",
    placeholder: "请选择批次年度",
    key: "batchYear",
    embed: true,
    multiple: false,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "批次年度",
    width: 260,
    embedWidth: 90,
    options: years
  },
  {
    type: "select",
    placeholder: "请选择批次名称",
    key: "batchCodeStr",
    embed: true,
    multiple: true,
    filterable: false,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "批次名称",
    width: 365,
    embedWidth: 90,
    options: [],
    labelName: "batchName",
    labeKey: "batchCode"
  },
  {
    type: "select",
    placeholder: "请选择会议名称",
    key: "meetingIdStr",
    embed: true,
    multiple: true,
    filterable: false,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "会议名称",
    width: 365,
    embedWidth: 90,
    options: [],
    labelName: "meetingName",
    labeKey: "tdmId"
  },
  {
    popoverWidth: 365,
    type: "hySelectTree",
    placeholder: "请选择项目单位",
    data: [],
    defaultProps: {
      children: "children",
      label: "name"
    },
    nodeKey: "busCode",
    key: "projectCompanyStr",
    labelStyle: {
      embed: true,
      selectEmbedLabel: "项目单位",
      selectClass: "padding_left_90"
    }
  },
  {
    type: "select",
    placeholder: "请选择业务部门",
    key: "businessCompanyStr",
    embed: true,
    multiple: true,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "业务部门",
    width: 260,
    embedWidth: 90,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    placeholder: "请选择项目状态",
    key: "projectStatusStr",
    embed: true,
    multiple: true,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "项目状态",
    width: 260,
    embedWidth: 90,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    placeholder: "请选择专业类型",
    key: "professionalType",
    embed: true,
    multiple: false,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "专业类型",
    width: 260,
    embedWidth: 90,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    placeholder: "请选择项目分类",
    key: "projectClassify",
    embed: true,
    multiple: false,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "项目分类",
    width: 260,
    embedWidth: 90,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    placeholder: "请选择项目属性",
    key: "projectProperties",
    embed: true,
    multiple: true,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "项目属性",
    width: 260,
    embedWidth: 90,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    placeholder: "请选择评审意见",
    key: "isReview",
    embed: true,
    multiple: false,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "评审意见",
    width: 260,
    embedWidth: 90,
    options: [
      {
        dataLabel: "全部",
        dataVal: ""
      },
      {
        dataLabel: "已上传",
        dataVal: "1"
      },
      {
        dataLabel: "未上传",
        dataVal: "0"
      }
    ],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "select",
    placeholder: "请选择投资渠道细类",
    key: "releaseInvestmentChannel",
    embed: true,
    multiple: false,
    clearable: true,
    selectClass: "selectEmbed_6",
    selectEmbedLabel: "投资渠道细类",
    width: 280,
    embedWidth: 90,
    options: [],
    labelName: "dataLabel",
    labeKey: "dataVal"
  },
  {
    type: "input",
    placeholder: "请输入项目编号或名称",
    key: "projectQuery",
    width: 365,
    clearable: true,
    selectEmbedLabel: "项目查询",
    embedWidth: 90
  }
];

const projectSearchData = {
  batchYear: new Date().getFullYear(),
  batchCodeStr: [""],
  meetingIdStr: [""],
  projectCompanyStr: [],
  projectStatusStr: [""],
  businessCompanyStr: [""],
  professionalType: "",
  releaseInvestmentChannel:"",
  projectClassify: "",
  projectProperties: [""],
  isReview: "",
  projectQuery: "",
  page: 1,
  rows: 20
};

const projectTableColumn = [
  {
    key: "xmbh",
    label: "项目编号",
    width: 125
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 400
  },
  {
    key: "projectCompanyName",
    label: "项目单位",
    width: 160
  },
  {
    key: "projectStatusName",
    label: "项目状态",
    width: 100
  },
  {
    key: "psyj",
    label: "评审意见文号",
    isSlot: true,
    slotName: "psyj",
    width: 200
  },
  {
    key: "pfyj",
    label: "批复意见文号",
    isSlot: true,
    slotName: "pfyj",
    width: 200
  },
  {
    key: "xqbh",
    label: "需求编号",
    isSlot: true,
    slotName: "xqbh",
    width: 135
  },
  {
    key: "ywubmm",
    label: "业务部门",
    width: 90
  },
  {
    key: "xqtbdw",
    label: "需求提报单位",
    width: 220
  },
  {
    key: "batchName",
    label: "批次名称",
    width: 220
  },
  {
    key: "hymc",
    label: "会议名称",
    width: 220
  },
  {
    key: "createByName",
    label: "申报人",
    width: 80
  },
  {
    key: "sbsj",
    label: "申报时间",
    width: 180
  },
  {
    key: "clck",
    label: "材料查看",
    isSlot: true,
    slotName: "clck",
    baseWidth: 105,
    fixed: "right"
  },
  {
    key: "ckyj",
    label: "意见查看",
    isSlot: true,
    slotName: "ckyj",
    baseWidth: 105,
    fixed: "right"
  }
];

const buttonsConfig = [
  {
    id: 0,
    icon: "iconshangchuan",
    text: "导入",
    color: "#298BF5"
  },
  // {
  //   id: 1,
  //   icon: "iconshangchuan",
  //   text: "运维导入",
  //   color: "#298BF5"
  // },
  { 
    id: 2,
    icon: "iconzu1192",
    text: "导出",
    color: "#298BF5"
  },
];

export {
  projectSearchConfig,
  projectSearchData,
  projectTableColumn,
  buttonsConfig
};
