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
        {
          type: "input",
          placeholder: "请输入",
          key: "projectQuery",
          selectEmbedLabel: "项目查询",
          width: 280,
          embedWidth: 90,
          disabled: false,
          clearable: true,
          size:"small",
        },
        {
          type: "region",
          percent:true,
          placeholder: "请输入",
          region: [{ key: "duplicateResultMin" }, { key: "duplicateResultMax" }],
          embed: true,
          selectClass: "selectEmbed",
          selectEmbedLabel: "重复率",
          width: 300,
          embedWidth: 90,
          percent:false
        }
      ],
      
    
      searchData: {
        projectQuery: '',
        duplicateResultMin: undefined,
        duplicateResultMax: undefined,
      }
    };
    
    const columnConfig = Object.freeze([
      {
        key: "projectCompanyName",
        label: "项目单位",
        baseWidth:170,
        fixed: true,
      },
      // {
      //   key: "projectCode",
      //   label: "项目编号",
      //   baseWidth:120,
      //   fixed: true,
      //   align:'center',
      // },
      {
        key: "projectName",
        label: "项目名称",
      },
      {
        key: "erpProjectCode",
        label: "项目编号",
        baseWidth:150,
      },
      {
        key: "projectStatusName",
        label: "项目状态",
        baseWidth:110,
      },
      // {
      //   key: "constructionContent",
      //   label: "建设/实施内容",
      // },
      // {
      //   key: "businessRequirement",
      //   label: "业务功能需求",
      // },
      // {
      //   key: "duplicateCheckStatus",
      //   label: "查重状态",
      //   isSlot: true,
      //   slotName: "duplicateCheckStatus",
      //   showOverflowTooltip:false,
      // },
      {
        key: "cz",
        label: "材料查看",
        isSlot: "true",
        slotName: "operation",
        baseWidth: 110,
        fixed: true,
        isLastSlot: true
      }
    ]);
  
  export {
    columnConfig,
  }