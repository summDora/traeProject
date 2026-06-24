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


  const kyFormConfig = {
    kySearchConfig: [
      {
        type: "select",
        placeholder: "请选择批次年份",
        key: "batchYear",
        embed: true,
        multiple: false,
        clearable: true,
        selectClass: "selectEmbed_7",
        selectEmbedLabel: "需求批次年份",
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
        type: "input",
        placeholder: "请输入项目名称或编号",
        key: "projectQuery",
        selectEmbedLabel: "项目查询",
        width: 300,
        embedWidth: 90,
        disabled: false,
        clearable: true,
        size:"small",
        maxlength: "50"
      },
      {
        popoverWidth: 300,
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
    ],
  
    kySearchData: {
      projectType: "PROJECTTYPE_XXH",
      businessType:"BUSINESSTYPE_KY",
      batchYear: new Date().getFullYear(),
      batchCodeStr: [""],
      projectQuery: "",
      projectCompanyStr: [],
    }
  };
  
  const kyColumnConfig = Object.freeze([
    {
      key: "projectCompanyName",
      label: "项目单位",
      baseWidth: 150,
    },
    {
      key: "projectCode",
      label: "项目编号",
      baseWidth: 125,
    },
    {
      key: "projectName",
      label: "项目名称",
      baseWidth: 300,
    },
    {
      key: "projectStatusName",
      label: "状态"
    },
    {
      key: "professionalTypeName",
      label: "专业类型",
      baseWidth: 150
    },
    {
      key: "investmentChannelName",
      label: "投资渠道",
      baseWidth: 105
    },
  
    {
      key: "createByName",
      label: "申报人",
      baseWidth: 80
    },
    {
      key: "createDate",
      label: "申报时间",
      baseWidth: 180
    },
    {
      key: "batchName",
      label: "所属项目批次",
      baseWidth: 180
    },
  ]);
  const csColumnConfig = Object.freeze([
    {
      key: "projectCompanyName",
      label: "项目单位",
      baseWidth: 150,
    },
    {
      key: "projectCode",
      label: "项目编号",
      baseWidth: 125,
    },
    {
      key: "projectName",
      label: "项目名称",
      baseWidth: 300,
    },
    {
      key: "projectStatusName",
      label: "状态"
    },
    {
      key: "opinionsFileName",
      label: "评审意见",
      isSlot: true,
      slotName: "opinionsFileName",
      width: "200"
    },
    {
      key: "replyFileName",
      label: "可研批复",
      isSlot: true,
      slotName: "replyFileName",
      width: "200"
    },
    {
      key: "professionalTypeName",
      label: "专业类型",
      baseWidth: 150
    },
    {
      key: "investmentChannelName",
      label: "投资渠道",
      baseWidth: 105
    },
  
    {
      key: "createByName",
      label: "申报人",
      baseWidth: 80
    },
    {
      key: "createDate",
      label: "申报时间",
      baseWidth: 180
    },
    {
      key: "batchName",
      label: "所属项目批次",
      baseWidth: 180
    },
  ]);


  const cjsbrFormConfig = {
    cjsbrSearchConfig: [
      {
        type: "input",
        placeholder: "请输入完整的项目名称或项目编号",
        key: "projectQuery",
        selectEmbedLabel: "项目查询",
        width: 400,
        embedWidth: 90,
        disabled: false,
        clearable: true,
        size:"small",
        maxlength: "50"
      },
    ],
  
    cjsbrSearchData: {
      projectQuery: "",
    }
  };

  const cjsbrColumnConfig = Object.freeze([
    {
      key: "projectCompanyName",
      label: "项目单位",
      baseWidth: 200,
    },
    {
      key: "projectCode",
      label: "项目编号",
      baseWidth: 200,
    },
    {
      key: "projectName",
      label: "项目名称",
      // baseWidth: 300,
    },
  ]);


  export {
    kyFormConfig,
    kyColumnConfig,
    csColumnConfig,
    cjsbrFormConfig,
    cjsbrColumnConfig,
  }