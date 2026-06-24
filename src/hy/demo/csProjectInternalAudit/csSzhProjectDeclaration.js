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

// 批次
const csBatchFormConfig = {
  csBatchSearchConfig: [
    {
      type: "select",
      placeholder: "请选择批次年份",
      key: "batchYear",
      embed: true,
      multiple: false,
      clearable: true,
      selectClass: "selectEmbed",
      selectEmbedLabel: "批次年份",
      width: 280,
      embedWidth: 90,
      options: years
    },
    {
      type: "select",
      placeholder: "请选择批次编号/名称",
      key: "batchCodeStr",
      embed: true,
      multiple: true,
      clearable: true,
      selectClass: "selectEmbed",
      selectEmbedLabel: "批次查询",
      width: 365,
      embedWidth: 90,
      options: [],
      labelName: "name",
      labeKey: "value"
    },
    {
      type: "select",
      placeholder: "请选择批次类型",
      key: "batchType",
      embed: true,
      multiple: false,
      clearable: true,
      selectClass: "selectEmbed",
      selectEmbedLabel: "批次类型",
      width: 260,
      embedWidth: 90,
      options: [
        {
          key: "1",
          value: "省公司批次"
        },
        {
          key: "2",
          value: "放管服批次"
        }
      ]
    }
  ],

  csBatchSearchData: {
    batchYear: new Date().getFullYear(),
    batchCodeStr:[""],
    batchType:"",
  }
};

const csBatchColumnConfig = Object.freeze([
  // {
  //   key: "batchYear",
  //   label: "批次年份",
  //   width: 100
  // },
  {
    key: "batchName",
    label: "批次名称",
    width: 300
  },
  {
    key: "batchCode",
    label: "批次编号",
    width: 85
  },
  {
    key: "professionalTypeName",
    label: "专业类型",
    width: 85
  },
  {
    key: "declareStartDate",
    label: "申报开始时间",
    width: 130
  },
  {
    key: "declareEndDate",
    label: "申报截止时间",
    width: 130
  },
  {
    key: "leaderUserName",
    label: "评审负责人",
    width: 130
  },
  {
    key: "helperLeaderUserName",
    label: "辅助评审人",
    width: 130
  },
  {
    key: "batchStatusName",
    label: "状态",
    // isSlot: true,
    // slotName: "batchStatus",
    width: 100
  },
]);


const csProjectButtonsData = [
  {
    id: "success",
    text: "新增",
    icon: "icontianjia",
    color: "#5aad7a"
  },
  {
    id: "primary",
    text: "修改",
    icon: "iconxiugai",
    color: "#298BF5"
  },
  {
    id: "danger",
    text: "删除",
    icon: "iconshanchu",
    color: "#ED6161"
  },
  {
    id: "primary",
    text: "导入",
    icon: "iconshangchuan",
    color: "#298BF5"
  },
  {
    id: "primary",
    text: "导出",
    icon: "iconzu1192",
    color: "#298BF5"
  },
  {
    id: "primary",
    icon: "iconzu1192",
    text: "初/概设模板下载",
    color: "#298BF5"
  },
  {
    id: "primary",
    text: "模板下载",
    icon: "iconzu1192",
    color: "#298BF5"
  },
];

const lowCsProjectButtonsData = [
  {
    id: "primary",
    text: "导出",
    icon: "iconzu1192",
    color: "#298BF5"
  },
  {
    id: "primary",
    icon: "iconzu1192",
    text: "初/概设模板下载",
    color: "#298BF5"
  },
  {
    id: "primary",
    text: "模板下载",
    icon: "iconzu1192",
    color: "#298BF5"
  },
];

export {
  csBatchFormConfig,
  csBatchColumnConfig,
  csProjectButtonsData,
  lowCsProjectButtonsData,
};
