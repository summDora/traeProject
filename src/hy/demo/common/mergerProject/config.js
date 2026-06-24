const formConfig = {
  searchConfig: [
    {
      type: "input",
      placeholder: "请输入可研编号",
      key: "cxmbh",
      selectEmbedLabel: "可研编号",
      width: 280,
      clearable: true
    },
    {
      type: "input",
      placeholder: "请输入项目名称",
      key: "projectName",
      selectEmbedLabel: "项目名称",
      width: 280,
      clearable: true
    },
    {
      popoverWidth: 280,
      type: "hySelectTree",
      placeholder: "请选择项目承担单位",
      data: [],
      defaultProps: {
        children: "children",
        label: "orgName"
      },
      nodeKey: "orgId",
      key: "xmcddw",
      labelStyle: {
        embed: true,
        selectEmbedLabel: "项目承担单位",
        selectClass: "padding_left_120"
      }
    },
    {
      type: "select",
      placeholder: "请选择查重结论",
      key: "ccjl",
      embed: true,
      multiple: true,
      selectClass: "selectEmbed_4",
      selectEmbedLabel: "查重结论",
      width: 280,
      embedWidth: 120,
      options: [],
      labelName: "dataLabel",
      labeKey: "dataVal"
    }
  ],

  searchData: {
    cxmbh: "",
    projectName: "",
    xmcddw: [],
    ccjl: [""]
  }
};

const columnConfig = Object.freeze([
  {
    key: "xmbh",
    label: "可研编号",
    baseWidth: 150,
    fixed: true
  },
  {
    key: "projectName",
    label: "项目名称",
    baseWidth: 150,
  },
  {
    key: "xmcddwm",
    label: "项目承担单位",
    baseWidth: 200
  },
  {
    key: "projectStatusName",
    label: "项目状态",
    baseWidth: 150
  },
  {
    key: "zyfxm",
    label: "专业方向",
    baseWidth: 150
  },
  {
    key: "jslym",
    label: "技术领域",
    baseWidth: 150
  },
  {
    key: "xmlbm",
    label: "项目类别",
    baseWidth: 150
  },

  {
    key: "yqmbhcgzb",
    label: "预期项目成果指标",
    baseWidth: 150
  },
  {
    key: "czwt",
    label: "存在问题及必要性说明",
    baseWidth: 180
  },
  {
    key: "sysmcm",
    label: "实验室",
    baseWidth: 180
  },
  {
    key: "kycxtdm",
    label: "科研创新团队",
    baseWidth: 180
  }
]);

export { formConfig, columnConfig };
