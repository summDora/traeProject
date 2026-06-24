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

const searchConfig = [
  {
    type: "select",
    placeholder: "请选择批次年份",
    key: "batchYear",
    embed: true,
    multiple: false,
    selectClass: "selectEmbed",
    selectEmbedLabel: "批次年份",
    width: 260,
    embedWidth: 90,
    options: years
  },
  {
    type: "select",
    placeholder: "请选择批次",
    key: "batchCode",
    embed: true,
    multiple: false,
    selectClass: "selectEmbed",
    selectEmbedLabel: "批次查询",
    width: 365,
    embedWidth: 90,
    options: [],
    labelName: "PCMC",
    labeKey: "PCBH"
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
    type: "input",
    placeholder: "请输入项目名称或编码",
    key: "projectQuery",
    width: 300,
    selectEmbedLabel: "项目查询",
    embedWidth: 90
  },
  {
    type: "select",
    placeholder: "请选择项目单位",
    key: "sbdws",
    embed: true,
    multiple: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "项目单位",
    width: 365,
    embedWidth: 90,
    options: [],
    labelName: "orgName",
    labeKey: "orgId"
  }
];

const searchData = {
  batchYear: new Date().getFullYear(),
  batchCode: "",
  professionalType: "",
  projectQuery: "",
  sbdws: [""],
  page: 1,
  rows: 20
};

const tableColumn = [
  {
    key: "projectCompanyName",
    label: "项目单位",
    width: "160"
  },
  {
    key: "erpxmbh",
    label: "项目编号",
    width: "125"
  },
  {
    key: "projectName",
    label: "项目名称",
    width: "400"
  },
  {
    key: "projectStatusName",
    label: "状态",
    width: "100"
  },
  {
    key: "batchCode",
    label: "所属批次编号",
    width: "160"
  },
  {
    key: "professionalTypeName",
    label: "专业类型",
    width: "100"
  },
  {
    key: "psyjwh",
    label: "评审意见",
    width: "200"
  },
  {
    key: "createByName",
    label: "申报人",
    width: "80"
  },
  {
    key: "sbsj",
    label: "申报时间",
    width: "120"
  },
  {
    key: "batchName",
    label: "所属项目批次",
    width: "160"
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

export { searchConfig, searchData, tableColumn };
