// 2015版本
// 检修工程总表（表一）2015&2022
const jxgczb1ColumnConfig = [
  {
    key: "gcfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "hsje",
    label: "含税金额",
    width: 110
  },
  {
    key: "zhjzfydbl",
    label: "占合计总费用的比例(%)",
    width: 110
  },
  {
    key: "bhsje",
    label: "不含税金额",
    width: 110
  },
  {
    key: "kdzzzsje",
    label: "可抵扣增值税金额",
    width: 110
  }
];

// 设备检修专业汇总表（表二甲）
const sbjxzyhzbb2jColumnConfig = [
  {
    key: "gcfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "sbjxf",
    label: "设备检修费",
    width: 110
  },
  {
    key: "pzgzf",
    label: "配件购置费",
    width: 110
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  }
];

// 建筑修缮专业汇总表（表二乙）
const jzxszyhzbb2yColumnConfig = [
  {
    key: "gcfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "jzxsf",
    label: "建筑修缮费",
    width: 110
  },
  {
    key: "pzgzf",
    label: "配件购置费",
    width: 110
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  }
];

//设备检修单位工程表（表三甲）
const sbjxdwgcbb3jColumnConfig = [
  {
    key: "bzyj",
    label: "编制依据",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "pjdj",
    label: "配件单价",
    width: 110
  },
  {
    key: "jxdj",
    label: "检修单价",
    width: 110,
    children: [
      {
        key: "jxdj_dejj",
        label: "定额基价",
        width: 110
      },
      {
        key: "jxdj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jxdj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  },
  {
    key: "pjhj",
    label: "配件合价",
    width: 110
  },
  {
    key: "jxhj",
    label: "检修合价",
    width: 110,
    children: [
      {
        key: "jxhj_dejj",
        label: "费用金额",
        width: 110
      },
      {
        key: "jxhj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jxhj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  }
];

//建筑修缮单位工程表（表三乙）
const jzxsdwgcbb3yColumnConfig = [
  {
    key: "bzyj",
    label: "编制依据",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "pjdj",
    label: "配件单价",
    width: 110
  },
  {
    key: "jzxsdj",
    label: "建筑修缮单价",
    width: 110,
    children: [
      {
        key: "jzxsdj_dejj",
        label: "定额基价",
        width: 110
      },
      {
        key: "jzxsdj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jzxsdj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  },
  {
    key: "pjhj",
    label: "配件合价",
    width: 110
  },
  {
    key: "jzxshj",
    label: "建筑修缮合价",
    width: 110,
    children: [
      {
        key: "jzxshj_dejj",
        label: "费用金额",
        width: 110
      },

      {
        key: "jzxshj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jzxshj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  }
];

//建筑修缮工程取费表2015, 设备检修工程取费表2015,建筑修缮工程取费表2020,设备检修工程取费表2020
const jzxsgcqfbColumnConfig = [
  {
    key: "fymc",
    label: "费用名称",
    width: 110
  },
  {
    key: "qfjs",
    label: "取费基数",
    width: 110
  },
  {
    key: "fl",
    label: "费率",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "zj",
    label: "总价",
    width: 110
  },
  {
    key: "jssm",
    label: "计算说明",
    width: 110
  }
];

// 其他费用表（表四）2015 && 2020
const qtfybbsb4ColumnConfig = [
  {
    key: "gchfyxmmc",
    label: "工程或费用项目名称",
    width: 110
  },
  {
    key: "bzyjjjssm",
    label: "编制依据及计算说明",
    width: 110
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  }
];

// 甲供配件汇总表（附表一）
const jgpjhzbfb1ColumnConfig = [
  {
    key: "pzmc",
    label: "配件名称",
    width: 110
  },
  {
    key: "ggxh",
    label: "规格型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "jg",
    label: "价格",
    width: 110,
    children: [
      {
        key: "jg_dj",
        label: "单价",
        width: 110
      },
      {
        key: "jg_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "yzf",
    label: "运杂费",
    width: 110,
    children: [
      {
        key: "yzf_fl",
        label: "费率（%）",
        width: 110
      },
      {
        key: "yzf_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  }
];

// 乙供配件汇总表（附表二）
const ygpjhzbfb2ColumnConfig = [
  {
    key: "pzmc",
    label: "配件名称",
    width: 110
  },
  {
    key: "ggxh",
    label: "规格型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "jg",
    label: "价格",
    width: 110,
    children: [
      {
        key: "jg_dj",
        label: "单价",
        width: 110
      },
      {
        key: "jg_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  }
];

// 编制基准期价差表（附表三）
const bzjzqicbfb3ColumnConfig = [
  {
    key: "fymc",
    label: "费用名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "dj",
    label: "单价",
    width: 110
  },
  {
    key: "zj",
    label: "总价",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 综合地形增加系数计算表（附表四）
const bzjzqicbfb4ColumnConfig = [
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "gdzjxs",
    label: "规定增加系数",
    width: 110,
    children: [
      {
        key: "gdzjxs_ql",
        label: "丘陵",
        width: 110
      },
      {
        key: "gdzjxs_sd",
        label: "山地",
        width: 110
      },
      {
        key: "gdzjxs_gs",
        label: "高山",
        width: 110
      },
      {
        key: "gdzjxs_jl",
        label: "峻岭",
        width: 110
      },
      {
        key: "gdzjxs_nz",
        label: "泥沼",
        width: 110
      },
      {
        key: "gdzjxs_hw",
        label: "河网",
        width: 110
      },
      {
        key: "gdzjxs_sm",
        label: "沙漠",
        width: 110
      }
    ]
  },
  {
    key: "dxhfbl",
    label: "地形划分比例",
    width: 110,
    children: [
      {
        key: "dxhfbl_ql",
        label: "丘陵",
        width: 110
      },
      {
        key: "dxhfbl_sd",
        label: "山地",
        width: 110
      },
      {
        key: "dxhfbl_gs",
        label: "高山",
        width: 110
      },
      {
        key: "dxhfbl_jl",
        label: "峻岭",
        width: 110
      },
      {
        key: "dxhfbl_nz",
        label: "泥沼",
        width: 110
      },
      {
        key: "dxhfbl_hw",
        label: "河网",
        width: 110
      },
      {
        key: "dxhfbl_sm",
        label: "沙漠",
        width: 110
      }
    ]
  },
  {
    key: "zhzjxs",
    label: "综合增加系数",
    width: 110,
    children: [
      {
        key: "zhzjxs_ql",
        label: "丘陵",
        width: 110
      },
      {
        key: "zhzjxs_sd",
        label: "山地",
        width: 110
      },
      {
        key: "zhzjxs_gs",
        label: "高山",
        width: 110
      },
      {
        key: "zhzjxs_jl",
        label: "峻岭",
        width: 110
      },
      {
        key: "zhzjxs_nz",
        label: "泥沼",
        width: 110
      },
      {
        key: "zhzjxs_hw",
        label: "河网",
        width: 110
      },
      {
        key: "zhzjxs_sm",
        label: "沙漠",
        width: 110
      },
      {
        key: "zhzjxs_hj",
        label: "合计",
        width: 110
      }
    ]
  }
];

// 输（配）电线路检修配件统计表（附表五）
const spdxljxpjtjbfb5ColumnConfig = [
  {
    key: "pjmc",
    label: "配件名称",
    width: 110
  },
  {
    key: "ggjxh",
    label: "规格及型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sjyl",
    label: "设计用量",
    width: 110
  },
  {
    key: "shl",
    label: "损耗率%",
    width: 110
  },
  {
    key: "dj",
    label: "单价",
    width: 110
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  },
  {
    key: "dz",
    label: "单重(kg)",
    width: 110
  },
  {
    key: "zz",
    label: "总重(kg)",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 输电线路检修土石方量计算表（附表六）
const sdxljxtsfljsbfb6ColumnConfig = [
  {
    key: "jcxs",
    label: "基础型式",
    width: 110
  },
  {
    key: "tz",
    label: "土质",
    width: 110
  },
  {
    key: "kd",
    label: "坑底(m)",
    width: 110,
    children: [
      {
        key: "kd_c",
        label: "长",
        width: 110
      },
      {
        key: "kd_k",
        label: "宽",
        width: 110
      }
    ]
  },
  {
    key: "ks",
    label: "坑深(m)",
    width: 110
  },
  {
    key: "dxfp",
    label: "地形放坡",
    width: 110
  },
  {
    key: "mktsfl",
    label: "每坑土石方量(m³)",
    width: 110,
    children: [
      {
        key: "mktsfl_gtk",
        label: "杆塔坑",
        width: 110
      },
      {
        key: "mktsfl_md",
        label: "马道",
        width: 110
      }
    ]
  },
  {
    key: "mjks",
    label: "每基坑数(个)",
    width: 110
  },
  {
    key: "mjtsfl",
    label: "每基土石方量(m³)",
    width: 110
  },
  {
    key: "kslmyn",
    label: "坑深2m以内",
    width: 110,
    children: [
      {
        key: "ks2myn_js",
        label: "基数",
        width: 110
      },
      {
        key: "ks2myn_hj",
        label: "合计",
        width: 110
      }
    ]
  },
  {
    key: "kssmyn",
    label: "坑深3m以内",
    width: 110,
    children: [
      {
        key: "ks3myn_js",
        label: "基数",
        width: 110
      },
      {
        key: "ks3myn_hj",
        label: "合计",
        width: 110
      }
    ]
  },
  {
    key: "kssmys",
    label: "坑深3m以上",
    width: 110,
    children: [
      {
        key: "ks3mys_js",
        label: "基数",
        width: 110
      },
      {
        key: "ks3mys_hj",
        label: "合计",
        width: 110
      }
    ]
  }
];

// 输电线路工地运输质量计算表（附表七）
const sdxlgdyszljsbfb7ColumnConfig = [
  {
    key: "cllb",
    label: "材料类别",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },

  {
    key: "zlhj",
    label: "质量合计(t)",
    width: 110
  },
  {
    key: "bzxs",
    label: "包装系数",
    width: 110
  },
  {
    key: "yszl",
    label: "运输质量(t)",
    width: 110
  }
];

// 输电线路工地运输工程量计算表（附表八）
const sdxlgdysgcljsbfb8ColumnConfig = [
  {
    key: "clz",
    label: "材料站",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },

  {
    key: "dxysl",
    label: "地形运输量(t)",
    width: 110
  },
  {
    key: "rlys",
    label: "人力运输",
    width: 110,
    children: [
      {
        key: "rlys_yj",
        label: "运距(km)",
        width: 110
      },

      {
        key: "rlys_gcl",
        label: "工程量(t*km)",
        width: 110
      }
    ]
  },
  {
    key: "qcys",
    label: "汽车运输",
    width: 110,
    children: [
      {
        key: "qcys_yj",
        label: "运距(km)",
        width: 110
      },
      {
        key: "qcys_gcl",
        label: "工程量(t*km)",
        width: 110
      }
    ]
  }
];

// 勘察费明细表（附表九）
const kcfmxbfb9ColumnConfig = [
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "",
    label: "初步勘测",
    width: 110,
    children: [
      {
        key: "cbkc_jss",
        label: "计算式",
        width: 110
      },

      {
        key: "cbkc_hj",
        label: "合价",
        width: 110
      }
    ]
  },

  {
    key: "",
    label: "施工图勘测",
    width: 110,
    children: [
      {
        key: "sgtkc_jss",
        label: "计算式",
        width: 110
      },

      {
        key: "sgtkc_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  }
];

// 勘察费复杂程度表（附表十）
const kcffzcdbfb10ColumnConfig = [
  {
    key: "ysfl",
    label: "因素分类",
    width: 110
  },
  {
    key: "fzd",
    label: "复杂度",
    width: 110
  },
  {
    key: "fz",
    label: "分值",
    width: 110
  },
  {
    key: "yssm",
    label: "因素说明",
    width: 110
  }
];

// 设计费明细表（附表十一）
const sjfmxbfb11ColumnConfig = [
  {
    key: "mc",
    label: "名称",
    width: 110
  },
  {
    key: "tzxs",
    label: "调整系数",
    width: 110
  },
  {
    key: "jss",
    label: "计算式",
    width: 110
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  }
];

// 配件购置费明细表
const pjgzfmxbColumnConfig = [
  {
    key: "gchfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "je",
    label: "金额",
    width: 110
  }
];

// 可抵扣增值税分析表
const kdkzzsfxbColumnConfig = [
  {
    key: "fymc",
    label: "费用名称",
    width: 110
  },
  {
    key: "kdzje",
    label: "可抵扣金额",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 2020版本
// 设备检修专业汇总表（表二甲）
const sbjxzyhzbb2j2020ColumnConfig = [
  {
    key: "gcfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "",
    label: "设备检修费",
    width: 110,
    children: [
      {
        key: "sbjxf",
        label: "检修费",
        width: 110
      },
      {
        key: "wjjclf",
        label: "未计价材料费",
        width: 110
      }
    ]
  },
  {
    key: "pzgzf",
    label: "配件购置费",
    width: 110
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  }
];

// 建筑修缮专业汇总表（表二乙）2020
const jzxszthzbb2y2020ColumnConfig = [
  {
    key: "gcfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "pzgzf",
    label: "建筑配件购置费",
    width: 110
  },
  {
    key: "wjjclf",
    label: "未计价材料费",
    width: 110
  },
  {
    key: "jzxsf",
    label: "修缮费",
    width: 110
  },
  {
    key: "hj",
    label: "建筑修缮费合计",
    width: 110
  }
];

// 建筑修缮工程专业汇总表(取费),设备检修工程专业汇总表(取费)2020
const jzxsgczyhzbqf2020ColumnConfig = [
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "",
    label: "直接费",
    width: 110,
    children: [
      {
        key: "zjf_rgf",
        label: "人工费",
        width: 110
      },
      {
        key: "zjf_clf",
        label: "材料费",
        width: 110
      },
      {
        key: "zjf_jxlf",
        label: "机械费",
        width: 110
      },
      {
        key: "zjf_csf",
        label: "措施费",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "间接费",
    width: 110,
    children: [
      {
        key: "jjf_gf",
        label: "规费",
        width: 110
      },
      {
        key: "jjf_qyglf",
        label: "企业管理费",
        width: 110
      }
    ]
  },
  {
    key: "bzjzqjc",
    label: "编制基准期价差",
    width: 110
  },
  {
    key: "lr",
    label: "利润",
    width: 110
  },
  {
    key: "zzs",
    label: "增值税",
    width: 110
  },
  {
    key: "",
    label: "合计",
    width: 110,
    children: [
      {
        key: "hj_hj",
        label: "合计",
        width: 110
      },
      {
        key: "hj_jxf",
        label: "其中:检修费",
        width: 110
      },
      {
        key: "hj_wjjclf",
        label: "其中:未计价材料费",
        width: 110
      }
    ]
  }
];

//设备检修单位工程表（表三甲）
const sbjxdwgcbb2j2020ColumnConfig = [
  {
    key: "bzyj",
    label: "编制依据",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "pjdj",
    label: "配件单价",
    width: 110
  },
  {
    key: "",
    label: "单价",
    width: 110,
    children: [
      {
        key: "",
        label: "检修费",
        width: 110,
        children: [
          {
            key: "jxdj_dejj",
            label: "定额基价",
            width: 110
          },
          {
            key: "jxdj_qzrg",
            label: "其中人工",
            width: 110
          },
          {
            key: "jxdj_qzjx",
            label: "其中机械",
            width: 110
          }
        ]
      },
      {
        key: "jxdj_wjjcl",
        label: "未计价材料",
        width: 110
      }
    ]
  },
  {
    key: "pjhj",
    label: "配件合价",
    width: 110
  },
  {
    key: "",
    label: "合价",
    width: 110,
    children: [
      {
        key: "",
        label: "检修费",
        width: 110,
        children: [
          {
            key: "jxhj_dejj",
            label: "费用金额",
            width: 110
          },
          {
            key: "jxhj_qzrg",
            label: "其中人工",
            width: 110
          },
          {
            key: "jxhj_qzjx",
            label: "其中机械",
            width: 110
          }
        ]
      },
      {
        key: "jxhj_wjjcl",
        label: "未计价材料",
        width: 110
      }
    ]
  }
];

// 建筑修缮单位工程表（表三乙）
const jzxsdwgcbb3y2020ColumnConfig = [
  {
    key: "bzyj",
    label: "编制依据",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "pjdj",
    label: "建筑配件单价",
    width: 110
  },
  {
    key: "wjjcldj",
    label: "未计价材料单价",
    width: 110
  },
  {
    key: "",
    label: "修缮单价",
    width: 110,
    children: [
      {
        key: "jzxsdj_dejj",
        label: "定额基价",
        width: 110
      },
      {
        key: "jzxsdj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jzxsdj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  },
  {
    key: "pjhj",
    label: "建筑配件合价",
    width: 110
  },
  {
    key: "wjjclhj",
    label: "未计价材料合价",
    width: 110
  },
  {
    key: "",
    label: "合价",
    width: 110,
    children: [
      {
        key: "jzxshj_dejj",
        label: "费用金额",
        width: 110
      },
      {
        key: "jzxshj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jzxshj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  },
  {
    key: "lx",
    label: "类型",
    width: 110
  }
];

// 余物清理计算表
const ywqljsb2020ColumnConfig = [
  {
    key: "bzyj",
    label: "编制依据",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "pjdj",
    label: "配件单价",
    width: 110
  },
  {
    key: "wjjcldj",
    label: "未计价材料单价",
    width: 110
  },
  {
    key: "",
    label: "单价",
    width: 110,
    children: [
      {
        key: "jzxsdj_dejj",
        label: "定额基价",
        width: 110
      },
      {
        key: "jzxsdj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jzxsdj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  },
  {
    key: "pjhj",
    label: "配件合价",
    width: 110
  },
  {
    key: "wjjclhj",
    label: "未计价材料合价",
    width: 110
  },
  {
    key: "",
    label: "合价",
    width: 110,
    children: [
      {
        key: "jzxshj_dejj",
        label: "费用金额",
        width: 110
      },
      {
        key: "jzxshj_qzrg",
        label: "其中人工",
        width: 110
      },
      {
        key: "jzxshj_qzjx",
        label: "其中机械",
        width: 110
      }
    ]
  }
];

// 输(配)电线路工程土石方量计算表
const spdxlgctsfljsb2020ColumnConfig = [
  {
    key: "jcxs",
    label: "基础型式",
    width: 110
  },
  {
    key: "tz",
    label: "土质",
    width: 110
  },
  {
    key: "kdcxk",
    label: "坑底长×宽(㎡)",
    width: 110
  },
  {
    key: "ks",
    label: "坑深(m)",
    width: 110
  },
  {
    key: "bpxs",
    label: "边坡系数",
    width: 110
  },
  {
    key: "",
    label: "每坑土石方量(m³)",
    width: 110,
    children: [
      {
        key: "mktsfl_gtk",
        label: "杆塔坑",
        width: 110
      },
      {
        key: "mktsfl_md",
        label: "马道",
        width: 110
      }
    ]
  },
  {
    key: "mjks",
    label: "每基坑数(个)",
    width: 110
  },
  {
    key: "mjtsfl",
    label: "每基土石方量(m³)",
    width: 110
  },
  {
    key: "",
    label: "坑深2m以内",
    width: 110,
    children: [
      {
        key: "ks2myn_js",
        label: "基数",
        width: 110
      },
      {
        key: "ks2myn_hj",
        label: "合计",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "坑深3m以内",
    width: 110,
    children: [
      {
        key: "ks3myn_js",
        label: "基数",
        width: 110
      },
      {
        key: "ks3myn_hj",
        label: "合计",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "坑深3m以上",
    width: 110,
    children: [
      {
        key: "ks3mys_js",
        label: "基数",
        width: 110
      },
      {
        key: "ks3mys_hj",
        label: "合计",
        width: 110
      }
    ]
  }
];

// 输(配)电线路工程工地运输质量计算表
const spdxlgcgdyszljsb2020ColumnConfig = [
  {
    key: "cllb",
    label: "材料类别",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "zlhj",
    label: "重量合计(含损耗)(t)",
    width: 110
  },
  {
    key: "bzxs",
    label: "包装系数",
    width: 110
  },
  {
    key: "yszl",
    label: "运输质量(t)",
    width: 110
  }
];

//输(配)电线路工程工地运输工程量计算表
const spdxlgcgdysgcljsb2020ColumnConfig = [
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "yszl",
    label: "运输重量(t)",
    width: 110
  },
  {
    key: "yj",
    label: "运距(km)",
    width: 110
  },
  {
    key: "gcl",
    label: "工程量(t·km)",
    width: 110
  }
];

// 编制基准期价差表
const bzjzqjcb2020ColumnConfig = [
  {
    key: "fymc",
    label: "费用名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "dj",
    label: "单价",
    width: 110
  },
  {
    key: "zj",
    label: "总价",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 检修配件统计表(附表二)
const jxpjtjbfb22020ColumnConfig = [
  {
    key: "pjmc",
    label: "配件名称",
    width: 110
  },
  {
    key: "ggjxh",
    label: "规格及型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sjyl",
    label: "设计用量",
    width: 110
  },
  {
    key: "shl",
    label: "损耗率%",
    width: 110
  },
  {
    key: "dj",
    label: "单价",
    width: 110
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  },
  {
    key: "dz",
    label: "单重(kg)",
    width: 110
  },
  {
    key: "zz",
    label: "总重(kg)",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 检修材料统计表(附表三)
const jxcltjbfb32020ColumnConfig = [
  {
    key: "clmc",
    label: "材料名称",
    width: 110
  },
  {
    key: "ggjxh",
    label: "规格及型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sjsl",
    label: "设计用量",
    width: 110
  },
  {
    key: "shl",
    label: "损耗率%",
    width: 110
  },
  {
    key: "dj",
    label: "单价(元)",
    width: 110
  },
  {
    key: "zj",
    label: "合价(元)",
    width: 110
  },
  {
    key: "dz",
    label: "单重(kg)",
    width: 110
  },
  {
    key: "zz",
    label: "总重(kg)",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 甲供配件汇总表
const jgpjhzb2020ColumnConfig = [
  {
    key: "wlbm",
    label: "物料编码",
    width: 110
  },
  {
    key: "pzmc",
    label: "配件名称",
    width: 110
  },
  {
    key: "ggxh",
    label: "规格型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "",
    label: "价格（含税）",
    width: 110,
    children: [
      {
        key: "jg_dj",
        label: "单价",
        width: 110
      },
      {
        key: "jg_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "运杂费",
    width: 110,
    children: [
      {
        key: "yzf_fl",
        label: "费率（%）",
        width: 110
      },
      {
        key: "yzf_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  },
  {
    key: "sflj",
    label: "是否利旧",
    width: 110
  }
];

// 乙供配件汇总表
const ygpjhzb2020ColumnConfig = [
  {
    key: "pzmc",
    label: "配件名称",
    width: 110
  },
  {
    key: "ggxh",
    label: "规格型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "",
    label: "价格",
    width: 110,
    children: [
      {
        key: "jg_dj",
        label: "单价",
        width: 110
      },
      {
        key: "jg_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "hj",
    label: "合计",
    width: 110
  }
];

// 甲供未计价材料汇总表
const jgwjjclhzb2020ColumnConfig = [
  {
    key: "wlbm",
    label: "物料编码",
    width: 110
  },
  {
    key: "clmc",
    label: "材料名称",
    width: 110
  },
  {
    key: "ggjxh",
    label: "规格及型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sjyl",
    label: "设计用量",
    width: 110
  },
  {
    key: "shl",
    label: "损耗率%",
    width: 110
  },
  {
    key: "dj",
    label: "单价（含税）",
    width: 110
  },
  {
    key: "zj",
    label: "总价（含税）",
    width: 110
  },
  {
    key: "sflj",
    label: "是否利旧",
    width: 110
  }
];

// 乙供未计价材料汇总表
const ygwjjclhzb2020ColumnConfig = [
  {
    key: "clmc",
    label: "材料名称",
    width: 110
  },
  {
    key: "ggjxh",
    label: "规格及型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sjyl",
    label: "设计用量",
    width: 110
  },
  {
    key: "shl",
    label: "损耗率%",
    width: 110
  },
  {
    key: "dj",
    label: "单价（不含税）",
    width: 110
  },
  {
    key: "zj",
    label: "总价（不含税）",
    width: 110
  }
];

// 人工汇总表
const rghzb2020ColumnConfig = [
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "rgmc",
    label: "人工名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "ysjdj",
    label: "预算价单价",
    width: 110
  },
  {
    key: "ysjhj",
    label: "预算价合价",
    width: 110
  }
];

// 材料汇总表
const clhzb2020ColumnConfig = [
  {
    key: "ghf",
    label: "供货方",
    width: 110
  },
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "clmc",
    label: "材料名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "",
    label: "预算价单价",
    width: 110,
    children: [
      {
        key: "ysjdj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "ysjdj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "预算价合价",
    width: 110,
    children: [
      {
        key: "ysjhj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "ysjhj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  }
];

// 建筑修缮材料价差汇总表
const jzxscljchzb2020ColumnConfig = [
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "clmc",
    label: "材料名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "",
    label: "市场价单价",
    width: 110,
    children: [
      {
        key: "scjdj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "scjdj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "预算价单价",
    width: 110,
    children: [
      {
        key: "ysjdj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "ysjdj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "市场价合价",
    width: 110,
    children: [
      {
        key: "scjhj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "scjhj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "预算价合价",
    width: 110,
    children: [
      {
        key: "ysjhj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "ysjhj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "价差合价",
    width: 110,
    children: [
      {
        key: "jchj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "jchj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  }
];

// 配合比材料汇总表
const phbclhzb2020ColumnConfig = [
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "clmc",
    label: "材料名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "",
    label: "预算价单价",
    width: 110,
    children: [
      {
        key: "ysjdj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "ysjdj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "预算价合价",
    width: 110,
    children: [
      {
        key: "ysjhj_hsj",
        label: "含税价",
        width: 110
      },
      {
        key: "ysjhj_bhsj",
        label: "不含税价",
        width: 110
      }
    ]
  }
];

// 机械汇总表
const jxhzb2020ColumnConfig = [
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "jxmc",
    label: "机械名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "ysjdj",
    label: "预算价单价",
    width: 110
  },
  {
    key: "ysjhj",
    label: "预算价合价",
    width: 110
  }
];

// 建筑修缮机械价差汇总表
const jzxsjxjchzb2020ColumnConfig = [
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "jxmc",
    label: "机械名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "ysjdj",
    label: "预算价单价",
    width: 110
  },
  {
    key: "scjdj",
    label: "市场价单价",
    width: 110
  },
  {
    key: "ysjhj",
    label: "预算价合价",
    width: 110
  },
  {
    key: "scjhj",
    label: "市场价合价",
    width: 110
  },
  {
    key: "jchj",
    label: "价差合价",
    width: 110
  }
];

// 勘察费明细表
const kcfmxb2020ColumnConfig = [
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "",
    label: "初步勘测",
    width: 110,
    children: [
      {
        key: "cbkc_jss",
        label: "计算式",
        width: 110
      },
      {
        key: "cbkc_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "施工图勘测",
    width: 110,
    children: [
      {
        key: "sgtkc_jss",
        label: "计算式",
        width: 110
      },
      {
        key: "sgtkc_hj",
        label: "合价",
        width: 110
      }
    ]
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  }
];

//勘察费复杂程度表
const kcffzcdb2020ColumnConfig = [
  {
    key: "ysfl",
    label: "因素分类",
    width: 110
  },
  {
    key: "fzd",
    label: "复杂度",
    width: 110
  },
  {
    key: "fz",
    label: "分值",
    width: 110
  },
  {
    key: "yssm",
    label: "因素说明",
    width: 110
  }
];

// 设计费明细表
const sjfmxb2020ColumnConfig = [
  {
    key: "mc",
    label: "名称",
    width: 110
  },
  {
    key: "tzxs",
    label: "调整系数",
    width: 110
  },
  {
    key: "jss",
    label: "计算式",
    width: 110
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  }
];

// 组合件汇总表
const zhjhzb2020ColumnConfig = [
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "dj",
    label: "单价",
    width: 110
  },
  {
    key: "hj",
    label: "合价",
    width: 110
  }
];

// 配件购置费明细表
const pjgzfmxb2020ColumnConfig = [
  {
    key: "gchfymc",
    label: "工程或费用名称",
    width: 110
  },
  {
    key: "je",
    label: "金额",
    width: 110
  }
];

// 工程量汇总表
const gclhzb2020ColumnConfig = [
  {
    key: "lb",
    label: "类别",
    width: 110
  },
  {
    key: "bm",
    label: "编码",
    width: 110
  },
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "ggxh",
    label: "规格型号",
    width: 110
  },
  {
    key: "dw",
    label: "单位",
    width: 110
  },
  {
    key: "jss",
    label: "计算式",
    width: 110
  },
  {
    key: "sl",
    label: "数量",
    width: 110
  },
  {
    key: "bz",
    label: "备注",
    width: 110
  }
];

// 综合地形增加系数计算表(附表一)
const zhdxzjxsjsbfb12020ColumnConfig = [
  {
    key: "projectName",
    label: "项目名称",
    width: 110
  },
  {
    key: "",
    label: "规定增加系数",
    width: 110,
    children: [
      {
        key: "gdzjxs_ql",
        label: "丘陵",
        width: 110
      },
      {
        key: "gdzjxs_sd",
        label: "山地",
        width: 110
      },
      {
        key: "gdzjxs_gs",
        label: "高山",
        width: 110
      },
      {
        key: "gdzjxs_jl",
        label: "峻岭",
        width: 110
      },
      {
        key: "gdzjxs_nz",
        label: "泥沼",
        width: 110
      },
      {
        key: "gdzjxs_hw",
        label: "河网",
        width: 110
      },
      {
        key: "gdzjxs_sm",
        label: "沙漠",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "地形划分比例",
    width: 110,
    children: [
      {
        key: "dxhfbl_ql",
        label: "丘陵",
        width: 110
      },
      {
        key: "dxhfbl_sd",
        label: "山地",
        width: 110
      },
      {
        key: "dxhfbl_gs",
        label: "高山",
        width: 110
      },
      {
        key: "dxhfbl_jl",
        label: "峻岭",
        width: 110
      },
      {
        key: "dxhfbl_nz",
        label: "泥沼",
        width: 110
      },
      {
        key: "dxhfbl_hw",
        label: "河网",
        width: 110
      },
      {
        key: "dxhfbl_sm",
        label: "沙漠",
        width: 110
      }
    ]
  },
  {
    key: "",
    label: "综合增加系数",
    width: 110,
    children: [
      {
        key: "zhzjxs_ql",
        label: "丘陵",
        width: 110
      },
      {
        key: "zhzjxs_sd",
        label: "山地",
        width: 110
      },
      {
        key: "zhzjxs_gs",
        label: "高山",
        width: 110
      },
      {
        key: "zhzjxs_jl",
        label: "峻岭",
        width: 110
      },
      {
        key: "zhzjxs_nz",
        label: "泥沼",
        width: 110
      },
      {
        key: "zhzjxs_hw",
        label: "河网",
        width: 110
      },
      {
        key: "zhzjxs_sm",
        label: "沙漠",
        width: 110
      }
    ]
  },
  {
    key: "zhdxzjxs",
    label: "综合地形增加系数(%)",
    width: 110
  }
];

export {
  jxgczb1ColumnConfig,
  sbjxzyhzbb2jColumnConfig,
  jzxszyhzbb2yColumnConfig,
  sbjxdwgcbb3jColumnConfig,
  jzxsdwgcbb3yColumnConfig,
  jzxsgcqfbColumnConfig,
  qtfybbsb4ColumnConfig,
  jgpjhzbfb1ColumnConfig,
  ygpjhzbfb2ColumnConfig,
  bzjzqicbfb3ColumnConfig,
  bzjzqicbfb4ColumnConfig,
  spdxljxpjtjbfb5ColumnConfig,
  sdxljxtsfljsbfb6ColumnConfig,
  sdxlgdyszljsbfb7ColumnConfig,
  sdxlgdysgcljsbfb8ColumnConfig,
  kcfmxbfb9ColumnConfig,
  kcffzcdbfb10ColumnConfig,
  sjfmxbfb11ColumnConfig,
  pjgzfmxbColumnConfig,
  kdkzzsfxbColumnConfig,
  sbjxzyhzbb2j2020ColumnConfig,
  jzxszthzbb2y2020ColumnConfig,
  jzxsgczyhzbqf2020ColumnConfig,
  sbjxdwgcbb2j2020ColumnConfig,
  jzxsdwgcbb3y2020ColumnConfig,
  ywqljsb2020ColumnConfig,
  spdxlgctsfljsb2020ColumnConfig,
  spdxlgcgdyszljsb2020ColumnConfig,
  spdxlgcgdysgcljsb2020ColumnConfig,
  bzjzqjcb2020ColumnConfig,
  jxpjtjbfb22020ColumnConfig,
  jxcltjbfb32020ColumnConfig,
  jgpjhzb2020ColumnConfig,
  ygpjhzb2020ColumnConfig,
  ygwjjclhzb2020ColumnConfig,
  rghzb2020ColumnConfig,
  clhzb2020ColumnConfig,
  jzxscljchzb2020ColumnConfig,
  phbclhzb2020ColumnConfig,
  jxhzb2020ColumnConfig,
  jzxsjxjchzb2020ColumnConfig,
  kcfmxb2020ColumnConfig,
  kcffzcdb2020ColumnConfig,
  sjfmxb2020ColumnConfig,
  zhjhzb2020ColumnConfig,
  pjgzfmxb2020ColumnConfig,
  gclhzb2020ColumnConfig,
  zhdxzjxsjsbfb12020ColumnConfig,
  jgwjjclhzb2020ColumnConfig
};
