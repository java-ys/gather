import { typeTimeMap, hitchRouteTypeMap, carTypeMapAll, getCarLevelList } from "_g/config/status-map"
import { listToMap } from "@/libs/util.js"

export const getVersionNumber = (data, str) => {
  if (data === undefined || data === null) return;
  let v = "0000" + data
  return str + v.slice(v.length - 4, v.length)
}
export const hitchversionType = {
  1: "SN",
  2: "CJ"
}

export const carTypeMap = getCarLevelList(4); // 快享
export const carTypeMap2 = getCarLevelList(2); // 专车
export const openStatusMap = {
  0: "未开通",
  1: "已开通",
}

export const statusMap = {
  1: "生效中",
  0: "未开始",
  "-1": "已失效",
  3: "已废弃",
  "-2": "已失效",
}

export const driverPackageStatusMap = {
  1: "生效中",
  0: "未开始",
  "-2": "已失效"
}

export const driverTypeMap = {
  0: "-",
  10: "自营司机",
  20: "自营-主司机",
  30: "自营-副司机",
  40: "自营-顶班司机",
  50: "UP司机",
  60: "UP-主司机",
  70: "UP-副司机",
  80: "UP-顶班司机"
}

// 1:自营司机；2:UP司机
export const operationModeMap = {
  1: "自营模式",
  2: "UP模式"
}

// export const driverPackageStatusMap = {
//   1: '生效中',
//   0: '未开始',
//   '-2': '已失效'
// }

// export const driverTypeMap = {
//   0: '-',
//   10: '自营司机',
//   20: '自营-主司机',
//   30: '自营-副司机',
//   40: '自营-顶班司机',
//   50: 'UP司机',
//   60: 'UP-主司机',
//   70: 'UP-副司机',
//   80: 'UP-顶班司机'
// }

// 1:自营司机；2:UP司机
// export const operationModeMap = {
//   1: '自营模式',
//   2: 'UP模式'
// }

// 顺风车抽成策略状态
export const cutPolicyStatusMap = {
  1: "生效中",
  2: "未开始",
  3: "已失效",
  4: "删除"
};

export const operationColumns = [
  {
    title: "序号",
    minWidth: 160,
    tooltip: true,
    key: "xxx",
    slot: "index"
  },
  {
    title: "策略名称",
    minWidth: 160,
    tooltip: true,
    key: ""
  },
  {
    title: "生效时间",
    minWidth: 160,
    tooltip: true,
    key: "effectiveTime"
  },
  {
    title: "订单类型",
    minWidth: 160,
    tooltip: true,
    key: "typeTime",
    render: (h, params) => {
      return h("span", typeTimeMap[params.row.typeTime] + "订单")
    }
  },
  {
    title: "状态",
    minWidth: 160,
    tooltip: true,
    key: "status",
    render: (h, params) => {
      return h("span", statusMap[params.row.status])
    }
  },
  {
    title: "操作人",
    minWidth: 160,
    tooltip: true,
    key: "creator"
  },
  {
    title: "版本号",
    minWidth: 160,
    tooltip: true,
    key: "version"
  },
  {
    title: "操作",
    minWidth: 200,
    tooltip: true,
    key: "action",
    slot: "action"
  }
]

export const hitchColumns = [ // 顺风车定价策略管理
  {
    title: "序号",
    minWidth: 160,
    tooltip: true,
    key: "xxx",
    slot: "index"
  },
  {
    title: "策略名称",
    minWidth: 160,
    tooltip: true,
    key: "strategyName"
  },
  {
    title: "生效时间",
    minWidth: 160,
    tooltip: true,
    key: "effectiveTime"
  },
  {
    title: "行程类型",
    minWidth: 160,
    tooltip: true,
    key: "routeType",
    render: (h, params) => {
      return h("span", hitchRouteTypeMap[params.row.routeType]);
    }
  },
  {
    title: "状态",
    minWidth: 160,
    tooltip: true,
    key: "status",
    render: (h, params) => {
      return h("span", statusMap[params.row.status]);
    }
  },
  {
    title: "操作人",
    minWidth: 160,
    tooltip: true,
    key: "modifier"
  },
  {
    title: "版本号",
    minWidth: 160,
    tooltip: true,
    key: "versions",
    render: (h, params) => {
      return h("span", getVersionNumber(params.row.versions, `DJ${hitchversionType[params.row.routeType]}`));
    }
  },
  {
    title: "操作",
    minWidth: 200,
    tooltip: true,
    key: "action",
    slot: "action"
  }
];

export const vehicleColumns = (that) => {
  return [ // 跨城派单策略
    // {
    //   title: "省份/城市",
    //   minWidth: 160,
    //   tooltip: true,
    //   key: "cityName",
    //   render: (h, params) => {
    //     return h("div", params.row.provinceName+'/'+params.row.cityName)
    //   }
    // },
    // {
    //   title: "产品线",
    //   minWidth: 160,
    //   tooltip: true,
    //   key: "businessType",
    //   render: (h, params) => {
    //     return h("div", businessTypeMap[params.row.businessType])
    //   }
    // },
    // {
    //   title: "开通状态",
    //   minWidth: 160,
    //   tooltip: true,
    //   render: (h, params) => {
    //     return h("div", params.row?.status==1?'已开通':'未开通')
    //   }
    // },
    {
      title: "策略",
      minWidth: 160,
      tooltip: true,
      key: "offSiteVehicleDto?.strategyType",
      render: (h, params) => {
        const data = {
          1: "允许异地车辆接城市范围内订单", 2: "允许异地车辆接城市范围内划定区域订单", 3: "不允许异地车辆接城市范围内订单"
        }
        return h("div", data[params.row?.offSiteVehicleDto?.strategyType] || "暂无");
      }
    },
    {
      title: "子策略",
      minWidth: 160,
      tooltip: true,
      key: "offSiteVehicleDto?.subStrategyType",
      render: (h, params) => {
        const data = {
          1: "异地车辆只允许目的地为其归属地订单"
        }
        return h("div", params.row.offSiteVehicleDto.strategyType == "3" ? "" : data[params.row?.offSiteVehicleDto?.subStrategyType]);
      }
    },
    {
      title: "电子围栏",
      minWidth: 160,
      tooltip: true,
      key: "status",
      render: (h, params) => {
        return h("div", [
          h("span", {
            props: {
              type: "text",
              size: "small"
            },
            style: {
              color: "#0053ff",
              borderBottom: "1px solid #0053ff",
              cursor: "pointer"
            },
            on: {
              click: () => {
                that.showPanel(params)
              }
            }
          }, "查看范围"),
        ]);
      }
    },
    {
      title: "更新时间",
      minWidth: 160,
      tooltip: true,
      key: "updateTime",
      render: (h, params) => {
        return h("span", params.row.updateTime || "暂无");
      }
    },
    {
      title: "操作人",
      minWidth: 160,
      tooltip: true,
      key: "updater"
    },
    {
      title: "操作",
      minWidth: 200,
      tooltip: true,
      key: "action",
      slot: "action"
    }
  ]
}
export const hitchCutPolicyColumns = [ // 顺风车抽成策略管理
  {
    title: "序号",
    minWidth: 160,
    tooltip: true,
    key: "xxx",
    slot: "index"
  },
  {
    title: "策略名称",
    minWidth: 160,
    tooltip: true,
    key: "ruleName"
  },
  {
    title: "生效时间",
    minWidth: 160,
    tooltip: true,
    key: "effectiveTime"
  },
  {
    title: "状态",
    minWidth: 160,
    tooltip: true,
    key: "status",
    render: (h, params) => {
      return h("span", cutPolicyStatusMap[params.row.status]);
    }
  },
  {
    title: "操作人",
    minWidth: 160,
    tooltip: true,
    key: "creator"
  },
  {
    title: "版本号",
    minWidth: 160,
    tooltip: true,
    key: "versionNumber",
    render: (h, params) => {
      return h("span", getVersionNumber(params.row.versionNumber, "CC"));
    }
  },
  {
    title: "操作",
    minWidth: 200,
    tooltip: true,
    key: "action",
    slot: "action"
  }
];

export const inputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "businessType", // 返回数据的key名
    placeholder: "请选择产品线",
    dropList: [
    ],
    value: "", // 用于数据绑定
    title: "产品线:", // 展示的字段名
    titleWidth: 80, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    clearable: false
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -1,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "typeTime", // 返回数据的key名
    placeholder: "请选择类型",
    dropList: [
      {
        value: 1,
        label: "实时"
      },
      {
        value: 2,
        label: "预约"
      }
    ],
    value: "", // 用于数据绑定
    title: "订单类型 :", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  }
]

export const hitchInputList = [ // 顺风车定价策略
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -1,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200 // input框的宽度
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "routeType", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "市内行程"
      },
      {
        value: 2,
        label: "城际行程"
      }
    ],
    value: "", // 用于数据绑定
    title: "行程类型 :", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200 // input框的宽度
  }
];
export const hitchCutPolicyInputList = [ // 顺风车抽成策略
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 2,
        label: "未开始"
      },
      {
        value: 3,
        label: "已失效"
      },
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200 // input框的宽度
  }
];

export const badInputList = [
  // {
  //   name: "drop-input", // 文本输入框名
  //   bind_key: "extendBizType", // 返回数据的key名
  //   placeholder: "请选择业务线",
  //   dropList: [
  //   ],
  //   value: "", // 用于数据绑定
  //   title: "业务线:", // 展示的字段名
  //   titleWidth: 80, // 展示的字段名的宽度
  //   inputWidth: 200, // input框的宽度
  //   clearable: true
  // },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "businessType", // 返回数据的key名
    placeholder: "请选择产品线",
    dropList: [
    ],
    value: "", // 用于数据绑定
    title: "产品线:", // 展示的字段名
    titleWidth: 80, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
    clearable: true
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -2,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  }
]

// 包车司机定价占比
export const packageDriverInputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -1,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  }
]

// 包车司机定价占比
// export const packageDriverInputList = [
//   {
//     name: 'drop-input', // 文本输入框名
//     bind_key: 'status', // 返回数据的key名
//     placeholder: '请选择状态',
//     dropList: [
//       {
//         value: 1,
//         label: '生效中'
//       },
//       {
//         value: 0,
//         label: '未开始'
//       },
//       {
//         value: -1,
//         label: '已失效'
//       }
//     ],
//     value: '', // 用于数据绑定
//     title: '状态 :', // 展示的字段名
//     titleWidth: 40, // 展示的字段名的宽度
//     inputWidth: 200, // input框的宽度
//   }
// ]

// 定价策略
export const priceColumns = (that) => {
  return [
    {
      title: "序号",
      minWidth: 60,
      tooltip: true,
      key: "xxx",
      slot: "index"
    },
    {
      title: "策略名称",
      minWidth: 160,
      tooltip: true,
      key: ""
    },
    {
      title: "生效时间",
      minWidth: 160,
      tooltip: true,
      key: "effectiveTime"
    },
    {
      title: "产品线",
      minWidth: 160,
      tooltip: true,
      key: "carLevel",
      render: (h, params) => {
        const { row: { businessType }} = params
        const { productKeyValue } = that.businessGradeName
        return h("span", productKeyValue[businessType] || "暂无")
      }
    },
    {
      title: "车型等级",
      minWidth: 160,
      tooltip: true,
      key: "carLevel",
      render: (h, params) => {
        const { row: { businessType,carLevel }} = params
        const { productCarKeyValue } = that.businessGradeName
        return h("span", productCarKeyValue[`${businessType}#${carLevel}`] || "暂无")
      }
    },
    {
      title: "订单类型",
      minWidth: 160,
      tooltip: true,
      key: "typeTime",
      render: (h, params) => {
        return h("span", typeTimeMap[params.row.typeTime] + "订单")
      }
    },
    {
      title: "状态",
      minWidth: 160,
      tooltip: true,
      key: "status",
      render: (h, params) => {
        return h("span", statusMap[params.row.status])
      }
    },
    {
      title: "操作人",
      minWidth: 160,
      tooltip: true,
      key: "creator"
    },
    {
      title: "版本号",
      minWidth: 160,
      tooltip: true,
      key: "version"
    },
    {
      title: "操作",
      minWidth: 160,
      tooltip: true,
      key: "action",
      slot: "action"
    }
  ] }
export const priceInputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -1,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "carLevel", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: carTypeMap,
    value: "", // 用于数据绑定
    title: "车型等级 :", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "typeTime", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "实时"
      },
      {
        value: 2,
        label: "预约"
      }
    ],
    value: "", // 用于数据绑定
    title: "订单类型 :", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  }
] // 快享
export const priceInputListSpecil = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -1,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "carLevel", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: carTypeMap2,
    value: "", // 用于数据绑定
    title: "车型等级:", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "typeTime", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "实时"
      },
      {
        value: 2,
        label: "预约"
      }
    ],
    value: "", // 用于数据绑定
    title: "订单类型 :", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  }
] // 专车

// 包车套餐-搜索框
export const PackageInputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "status", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 1,
        label: "生效中"
      },
      {
        value: 0,
        label: "未开始"
      },
      {
        value: -2,
        label: "已失效"
      }
    ],
    value: "", // 用于数据绑定
    title: "状态 :", // 展示的字段名
    titleWidth: 40, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "cascader-input",
    bind_key: ["bizType", "carLevel"],
    placeholder: "请选择产品线/车型等级",
    value: [], // 绑定返回数据
    cascaderList: [
    ], // 级联列表
    title: "产品线/车型等级：", // 展示的字段名
    titleWidth: 150,
    changeOnSelect: true,
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "wrapType", // 返回数据的key名
    placeholder: "请选择状态",
    dropList: [
      {
        value: 0,
        label: "起步价套餐"
      },
      {
        value: 1,
        label: "一口价套餐"
      }
    ],
    value: "", // 用于数据绑定
    title: "套餐类型 :", // 展示的字段名
    titleWidth: 65, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  }
]
// 包车套餐-列表
export const PackageColumns = [
  {
    title: "序号",
    minWidth: 60,
    tooltip: true,
    key: "xxx",
    slot: "index"
  },
  {
    title: "套餐",
    minWidth: 160,
    tooltip: true,
    key: "wrap"
  },
  {
    title: "套餐名称",
    minWidth: 160,
    tooltip: true,
    key: "wrapName"
  },
  {
    title: "套餐类型",
    minWidth: 160,
    tooltip: true,
    key: "wrapType",
    render: (h, params) => {
      return h("span", params.row.wrapType === 0 ? "起步价套餐" : params.row.wrapType === 1 ? "一口价套餐" : "-")
    }
  },
  {
    title: "生效时间",
    minWidth: 160,
    tooltip: true,
    key: "effectiveTime"
  },
  {
    title: "车型等级",
    minWidth: 160,
    tooltip: true,
    key: "carLevelStr"
  },
  {
    title: "状态",
    minWidth: 80,
    tooltip: true,
    key: "status",
    render: (h, params) => {
      return h("span", statusMap[params.row.status])
    }
  },
  {
    title: "操作人",
    minWidth: 80,
    tooltip: true,
    key: "creator"
  },
  {
    title: "版本号",
    minWidth: 160,
    tooltip: true,
    key: "version"
  },
  {
    title: "操作",
    minWidth: 160,
    tooltip: true,
    key: "action",
    slot: "action"
  }
]
// 包车司机订单占比-列表
export const PackageDriverColumns = [
  {
    title: "序号",
    minWidth: 60,
    tooltip: true,
    key: "xxx",
    slot: "index"
  },
  {
    title: "司机类型",
    minWidth: 160,
    tooltip: true,
    key: "driverTypes",
    render: (h, params) => {
      return h("span", driverTypeMap[params.row.driverTypes])
    }
  },
  {
    title: "运营模式",
    minWidth: 160,
    tooltip: true,
    key: "operationMode",
    render: (h, params) => {
      return h("span", params.row.operationMode === 1 ? "自营模式" : params.row.operationMode === 2 ? "UP模式" : "-")
    }
  },
  {
    title: "司机包车定价占比",
    minWidth: 160,
    tooltip: true,
    key: "driverFareDiscount",
    render: (h, { row }) => {
      return h("span", `${row.driverFareDiscount}%`)
    }
  },
  {
    title: "生效时间",
    minWidth: 160,
    tooltip: true,
    key: "effectiveTime"
  },
  {
    title: "状态",
    minWidth: 80,
    tooltip: true,
    key: "status",
    render: (h, params) => {
      return h("span", driverPackageStatusMap[params.row.status])
    }
  },
  {
    title: "操作人",
    minWidth: 80,
    tooltip: true,
    key: "updater"
  },
  {
    title: "备注",
    minWidth: 160,
    tooltip: true,
    key: "remark"
  },
  {
    title: "操作",
    minWidth: 160,
    tooltip: true,
    key: "action",
    slot: "action"
  }
]

export const areaTypeList = [
  {
    value: 1,
    label: "市级",
  },
  {
    value: 2,
    label: "区县级",
  },
];

// 乘客定价策略 inputList 增加行政区
export const customerPriceInputList = [
  ...inputList,
  {
    name: "drop-input",
    bind_key: "areaType",
    placeholder: "全部",
    dropList: areaTypeList,
    value: "", // 用于数据绑定
    title: "行政区类型：", // 展示的字段名
    titleWidth: 80, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
  {
    name: "drop-input",
    bind_key: "workRestDayType",
    placeholder: "全部",
    dropList: [{
      label: "工作日",
      value: 1
    }, {
      label: "休息日",
      value: 2
    }],
    value: "", // 用于数据绑定
    title: "适用时段：", // 展示的字段名
    titleWidth: 80, // 展示的字段名的宽度
    inputWidth: 200, // input框的宽度
  },
];

// 乘客定价策略 tableColumn 增加行政区
export const customerPriceColumns = (that) => { return [
  {
    title: "序号",
    minWidth: 60,
    tooltip: true,
    key: "xxx",
    slot: "index"
  },
  {
    title: "策略名称",
    minWidth: 160,
    tooltip: true,
    key: ""
  },
  {
    title: "行政区域",
    minWidth: 100,
    tooltip: true,
    key: "areaName",
  },
  {
    title: "行政区类型",
    minWidth: 100,
    tooltip: true,
    key: "areaType",
    render: (h, params) => {
      return h("span", Number(params.row.areaType) === 2 ? "区县级" : "市级")
    }
  },
  {
    title: "生效时间",
    minWidth: 160,
    tooltip: true,
    key: "effectiveTime"
  },
  {
    title: "适用时段",
    minWidth: 130,
    tooltip: true,
    key: "workRestDayType",
    render: (h, params) => {
      return h("span", Number(params.row.workRestDayType) === 1 ? "工作日" : Number(params.row.workRestDayType) === 2 ? "休息日" : "工作日、休息日")
    }
  },
  {
    title: "产品线",
    minWidth: 160,
    tooltip: true,
    key: "businessType",
    render: (h, params) => {
      const { row: { businessType }} = params
      const { productKeyValue } = that.businessGradeName
      return h("span", productKeyValue[businessType] || "暂无")
    }
  },
  {
    title: "车型等级",
    minWidth: 160,
    tooltip: true,
    key: "carLevel",
    render: (h, params) => {
      const { row: { businessType, carLevel }} = params
      // 根据产品线找车型名称
      let lineF = that.bizTypeList.find(it => it.value - businessType === 0);
      let carName = ''
      if(lineF) {
        let carF = lineF.children.find(it => it.value - carLevel === 0);
        carName = carF?.label
      }
      return h("span", carName || "暂无")
    }
  },
  {
    title: "订单类型",
    minWidth: 160,
    tooltip: true,
    key: "typeTime",
    render: (h, params) => {
      return h("span", typeTimeMap[params.row.typeTime] + "订单")
    }
  },
  {
    title: "状态",
    minWidth: 160,
    tooltip: true,
    key: "status",
    render: (h, params) => {
      return h("span", statusMap[params.row.status])
    }
  },
  {
    title: "操作人",
    minWidth: 160,
    tooltip: true,
    key: "creator"
  },
  {
    title: "版本号",
    minWidth: 160,
    tooltip: true,
    key: "version"
  },
  {
    title: "操作",
    minWidth: 160,
    tooltip: true,
    key: "action",
    slot: "action"
  }
] };
// 远程分段下拉选项，0-100公里
export const capacityMap = new Array(101).fill(0).map((m, i) => i);
