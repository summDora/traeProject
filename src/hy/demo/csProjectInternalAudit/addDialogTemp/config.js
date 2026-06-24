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


const formConfig = {
    searchConfig: [
      // {
      //   type: "select",
      //   placeholder: "请选择批次年份",
      //   key: "batchYear",
      //   embed: true,
      //   multiple: false,
      //   clearable: true,
      //   selectClass: "selectEmbed_7",
      //   selectEmbedLabel: "需求批次年份",
      //   width: 260,
      //   embedWidth: 90,
      //   options: years
      // },
      // {
      //   type: "select",
      //   placeholder: "请选择需求批次",
      //   key: "batchCodeStr",
      //   embed: true,
      //   multiple: true,
      //   filterable: false,
      //   clearable: true,
      //   selectClass: "selectEmbed",
      //   selectEmbedLabel: "需求批次",
      //   width: 260,
      //   embedWidth: 90,
      //   options: [],
      //   labelName: "batchName",
      //   labeKey: "batchCode"
      // },
      {
        type: "input",
        placeholder: "请输入完整的项目名称或项目编号",
        key: "projectQuery",
        selectEmbedLabel: "项目查询",
        width: 350,
        embedWidth: 90,
        disabled: false,
        clearable: true,
        size:"small",
        maxlength: "50"
      },
      // {
      //   type: "select",
      //   placeholder: "请选择业务部门",
      //   key: "businessCompanyStr",
      //   embed: true,
      //   multiple: true,
      //   filterable: false,
      //   selectClass: "selectEmbed",
      //   selectEmbedLabel: "业务部门",
      //   width: 260,
      //   embedWidth: 90,
      //   options: [],
      //   labelName: "dataLabel",
      //   labeKey: "dataVal"
      // },
    ],
  
    searchData: {
      projectType: "PROJECTTYPE_XXH",
      businessType: "BUSINESSTYPE_XQ",
      // batchYear: "",
      // batchCodeStr: [""],
      projectQuery: "",
      // businessCompanyStr: [""],
    }
  };
  
  const columnConfig = Object.freeze([
    {
      key: "serialNumber",
      label: "需求编号",
      baseWidth:135,
      fixed:true
    },
    {
      key: "projectName",
      label: "需求名称",
      baseWidth:240,
    },
    {
      key: "professionalTypeName",
      label: "专业类型",
      baseWidth:120,
    },
    {
      key: "investmentChannelName",
      label: "投资渠道",
      baseWidth:120,
    },
    // {
    //   key: "suggesCost",
    //   label: "建议费用",
    //   baseWidth:120,
    // },
    {
      key: "projectStatusName",
      label: "需求状态",
      baseWidth:120,
    },
    // {
    //   key: "isYesStatus",
    //   label: "确认状态",
    //   isSlot: true,
    //   slotName: "isYesStatus",
    //   baseWidth:120,
    // },
    {
      key: "businessCompanyName",
      label: "业务主管部门",
      baseWidth:150,
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
      baseWidth:120,
    },
    {
      key: "batchCode",
      label: "所属需求批次",
      baseWidth:150,
    }
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
    formConfig,
    columnConfig,
    cjsbrFormConfig, 
    cjsbrColumnConfig,
  } 