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
  //   key: "suggesCost",   //说不用了
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


export { columnConfig };
