const columnConfig = Object.freeze([
  {
    key: "serialNumber",
    label: "需求编号",
    baseWidth: 150,
    fixed: true
  },
  {
    key: "projectName",
    label: "需求名称",
    baseWidth: 200,
    fixed: true
  },
  {
    key: "professionalTypeName",
    label: "专业类型",
    baseWidth: 120
  },
  {
    key: "investmentChannelName",
    label: "投资渠道",
    baseWidth: 120
  },
  // {
  //   key: "suggesCost",
  //   label: "建议费用",
  //   baseWidth: 120
  // },
  {
    key: "projectStatusName",
    label: "需求状态",
    baseWidth: 120
  },
  {
    key: "businessCompanyName",
    label: "业务主管部门",
    baseWidth: 150
  },
  {
    key: "projectCompanyName",
    label: "需求提出/运维单位",
    baseWidth: 180
  },
  {
    key: "estimateCost",
    label: "需求预估费用",
    baseWidth: 150
  },
  {
    key: "constructionUnitName",
    label: "需求拟承担单位",
    baseWidth: 180
  },
  {
    key: "informant",
    label: "申报人",
    baseWidth: 120
  },
  {
    key: "batchCode",
    label: "所属需求批次",
    baseWidth: 120
  },
  {
    key: "operation",
    label: "查看",
    fixed: true,
    isLastSlot: true,
    slotName: "operation",
    width: 155,
    baseWidth: 155
  }
]);

const csTableColumn = [
  {
    key: "projectCompanyName",
    label: "项目单位",
    width: "160"
  },
  {
    key: "xmbh",
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
    key: "professionalTypeName",
    label: "专业类型",
    width: "120"
  },
  {
    key: "investmentChannelName",
    label: "投资渠道",
    width: "120"
  },
  {
    key: "batchName",
    label: "所属项目批次",
    width: "160"
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

export { columnConfig, csTableColumn };
