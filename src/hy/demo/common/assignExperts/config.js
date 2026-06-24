const tableOneConfig = {
    column: [
      {
        key: "id",
        label: "工号"
      },
      {
        key: "cc",
        label: "专家"
      },
      {
        key: "ff",
        label: "电话"
      },
      {
        key: "dd",
        label: "单位"
      },
    ],
    searchConfig: [
      {
        type: "input",
        placeholder: "姓名",
        key: "one",
        label: "",
        width: 160,
        disabled: false,
        clearable: true,
        size:"small",
      },
      {
        popoverWidth: 256,
        type: "hySelectTree",
        placeholder: "请选择单位",
        data: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        nodeKey: "busCode",
        key: "hybhs",
        labelStyle: {
          embed: true,
          selectEmbedLabel: "单位",
          selectClass: "padding_left_90"
        }
      }
    ],
    searchData: {},
  };
  const tableTwoConfig = {
    column: [
      {
        key: "id",
        label: "工号"
      },
      {
        key: "cc",
        label: "专家"
      },
      {
        key: "ff",
        label: "电话"
      },
      {
        key: "dd",
        label: "单位"
      },
    ],
    searchConfig: [
      {
        type: "input",
        placeholder: "姓名",
        key: "one",
        label: "",
        width: 200,
        disabled: false,
        clearable: true,
        size:"small",
      },
    ],
    searchData: {},
  };
  export {
    tableOneConfig,
    tableTwoConfig,
  }