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
    placeholder: "请选择",
    key: "batchYear",
    embed: true,
    multiple: false,
    selectClass: "selectEmbed",
    selectEmbedLabel: "批次年份",
    width: 260,
    embedWidth: 90,
    options: years,
    clearable: true
  },
  {
    type: "select",
    placeholder: "请选择",
    key: "batchCodeStr",
    embed: true,
    multiple: true,
    clearable: true,
    selectClass: "selectEmbed",
    selectEmbedLabel: "批次名称",
    width: 365,
    embedWidth: 90,
    options: [],
    labelName: "name",
    labeKey: "value"
  },
  {
    type: "input",
    placeholder: "请输入项目名称或编码",
    key: "projectQuery",
    width: 365,
    selectEmbedLabel: "项目查询",
    embedWidth: 90,
    clearable: true
  }
];

const searchData = {
  batchYear: new Date().getFullYear(),
  batchCodeStr: [""],
  projectQuery: "",
  page: 1,
  rows: 20
};

// 项目进度，state（1：已完成，2：进行中，3：未开始，4：未完成）
const stateListOne = [
  {
    state: "1",
    text: "申报"
  },
  {
    state: "1",
    text: "内审"
  },
  {
    state: "1",
    text: "准备"
  },
  {
    state: "1",
    text: "评审"
  },
  {
    state: "1",
    text: "整改"
  },
  {
    state: "1",
    text: "收口"
  },
  {
    state: "1",
    text: "发文"
  }
];

// 项目进度，state（1：已完成，2：进行中，3：未开始，4：未完成）
const stateListTwo = [
  {
    state: "1",
    text: "申报"
  },
  {
    state: "1",
    text: "内审"
  },
  {
    state: "1",
    text: "准备"
  },
  {
    state: "1",
    text: "评审"
  },
  {
    state: "4",
    text: "取消"
  }
];

// 项目进度，state（1：已完成，2：进行中，3：未开始，4：未完成）
const stateListThree = [
  {
    state: "1",
    text: "申报"
  },
  {
    state: "1",
    text: "内审"
  },
  {
    state: "1",
    text: "准备"
  },
  {
    state: "1",
    text: "评审"
  },
  {
    state: "2",
    text: "延审"
  }
];

export { searchConfig, searchData, stateListOne, stateListTwo, stateListThree };
