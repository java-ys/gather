import { operateTypeEnum, productLineEnum, tacticsEnum } from "@/config";

export const statusList = [
  { label: "未提交", value: "HT_WTJ" },
  { label: "待城市确认", value: "CS_QR" },
  { label: "待运营商确认", value: "YYS_QR" },
  { label: "待总部审核", value: "ZB_SH" },
  { label: "已作废", value: "HT_ZF" },
  { label: "已完结", value: "WJ" }
];
const protocolList = [
  { label: "未生成", value: 0 },
  { label: "已生成", value: 1 },
]
const allType = [{ label: "不限", value: -1 }]

export const inputList = [
  {
    name: "month-input",
    bind_key: "assessTime",
    placeholder: "请选择月份",
    value: "",
    title: "月份：",
    titleWidth: 80,
    // options: {
    //   // 只能选择小于当前月
    //   disabledDate: date => {
    //     const [, , nowDay] = timeFormat(+new Date(), "yyyy-MM-dd").split("-");
    //     return date && date.valueOf() > Date.now() - nowDay * 24 * 3600 * 1000;
    //   }
    // }
  },
  {
    name: "drop-input",
    bind_key: "cityUuid",
    placeholder: "请选择城市",
    value: "",
    dropList: [],
    filterable: true,
    title: "城市：",
    titleWidth: 80,
  },
  {
    name: "drop-input",
    title: "运营商：",
    dropList: [],
    bind_key: "agentUuid",
    value: "",
    filterable: true,
    titleWidth: 80,
  },
  {
    name: "drop-input",
    title: "运营模式：",
    titleWidth: 80,
    filterable: true,
    value: "",
    bind_key: "operateTypeList",
    dropList: operateTypeEnum
  },
  {
    name: "drop-input",
    title: "状态：",
    titleWidth: 80,
    filterable: true,
    value: "",
    bind_key: "flowStatusList",
    dropList: statusList
  },
  {
    name: "drop-input",
    title: "策略类型",
    titleWidth: 80,
    value: "",
    bind_key: "strategyType",
    dropList: tacticsEnum
  },
  {
    name: "drop-input",
    title: "产品线：",
    titleWidth: 80,
    filterable: true,
    multiple: true,
    value: "",
    bind_key: "businessTypeList",
    dropList: productLineEnum
  },
  {
    name: "drop-input",
    title: "是否生成协议：",
    titleWidth: 90,
    value: "",
    bind_key: "createdFlag",
    dropList: protocolList
  }
];

export const tableColumns = _this => {
  return [
    // {
    //   title: '序号',
    //   key: 'index',
    //   width: 70,
    //   render(h, params) {
    //     return h('span', {}, (_this.tableConfig.current - 1) * _this.tableConfig.pageSize + params.index + 1);
    //   }
    // },
    {
      type: "selection",
      align: "center",
      width: 80
    },
    {
      title: "申请单编号",
      key: "bizCode",
      tooltip: true,
      minWidth: 220,
      render(h, { row }) {
        return (<span style={"color: #2d8cf0; cursor: pointer"} onClick={() => _this.rowClickHandle(row)}>{row.bizCode}</span>)
      }
    },
    {
      title: "月份",
      key: "assessTime",
      minWidth: 200
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 160
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 140,
      render: (h, { row }) => {
        let tList = (`${row.operateType}`).split(",");
        return (<span>{tList.map(v => {
          let f = [...operateTypeEnum, ...allType].find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "策略类型",
      key: "strategyType",
      tooltip: true,
      minWidth: 140,
      render: (h, { row }) => {
        let tList = (`${row.strategyType}`).split(",");
        return (<span>{tList.map(v => {
          let f = [...tacticsEnum, ...allType].find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "产品线",
      key: "businessType",
      tooltip: true,
      minWidth: 140,
      render: (h, { row }) => {
        let tList = (`${row.businessType}`).split(",");
        return (<span>{tList.map(v => {
          let f = [...productLineEnum, ...allType].find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "主题",
      key: "title",
      minWidth: 160
    },
    {
      title: "模板名称",
      key: "title",
      minWidth: 160
    },
    {
      title: "状态",
      key: "statusDesc",
      minWidth: 120
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 180
    },
    {
      title: "操作人",
      key: "updaterName",
      minWidth: 120
    },
    {
      title: "当前处理人",
      key: "handlerName",
      minWidth: 120
    },
    {
      title: "操作",
      key: "action",
      slot: "action",
      minWidth: 200,
      fixed: "right",
    }
  ];
};

// 指标搜索项
export const indicatorInputList = [
  {
    name: "text-input",
    bind_key: "name",
    placeholder: "请输入",
    value: "",
    title: "指标名称：",
    titleWidth: 60,
    inputWidth: 200
  }
];
// 指标列
export const indicatorColumn = [
  {
    type: "selection",
    width: 60,
    align: "center",
    minWidth: 100
  },
  {
    title: "所属分类",
    key: "classifyEx",
    width: 120,
    tooltip: true,
    align: "center"
  },
  {
    title: "名称",
    key: "name",
    minWidth: 180,
    tooltip: true,
    align: "center"
  },
  {
    title: "说明",
    key: "remark",
    minWidth: 180,
    tooltip: true,
    align: "center"
  },
  {
    title: "类型",
    key: "typeEx",
    width: 120,
    tooltip: true,
    align: "center"
  }
];

// 条例搜索项
export const regulationInputList = [
  {
    name: "text-input",
    bind_key: "title",
    placeholder: "请输入",
    value: "",
    title: "模板名称：",
    titleWidth: 60,
    inputWidth: 200
  }
];

export const regulationColumn = _this => {
  return [
    {
      title: "运营模式",
      key: "operationModeEx",
      minWidth: 60,
      tooltip: true,
      align: "center"
    },
    {
      title: "模板名称",
      key: "title",
      width: 120,
      tooltip: true,
      align: "center"
    },
    {
      title: "创建时间",
      key: "updateTime",
      minWidth: 120,
      tooltip: true,
      align: "center"
    },
    {
      title: "操作",
      fixed: "right",
      width: 80,
      key: "operation",
      render(h, params) {
        let row = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              on: {
                click() {
                  _this.selectRow(row);
                }
              }
            },
            "选择"
          )
        ]);
      }
    }
  ];
};

export const inputListProcess = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "bizCode", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "申请单编号：",
    titleWidth: 80
  }
];

export const tableColumnsProcess = _this => {
  return [
    {
      title: "申请单编号",
      key: "bizCode",
      tooltip: true,
      minWidth: 220,
      render(h, { row }) {
        return (<span style={"color: #2d8cf0; cursor: pointer"} onClick={() => _this.rowClickHandle(row)}>{row.bizCode}</span>)
      }
    },
    {
      title: "月份",
      key: "assessTime",
      minWidth: 120
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 140
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 100,
      render: (h, { row }) => {
        let tList = (`${row.operateType}`).split(",");
        return (<span>{tList.map(v => {
          let f = [...operateTypeEnum, ...allType].find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "主题",
      key: "title",
      minWidth: 160
    },
    {
      title: "状态",
      key: "statusDesc",
      minWidth: 120
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 180
    },
    {
      title: "操作人",
      key: "updaterName",
      minWidth: 120
    },
    {
      title: "当前处理人",
      key: "handlerName",
      minWidth: 120
    },
    {
      title: "操作",
      fixed: "right",
      width: 120,
      key: "operation",
      render(h, params) {
        let row = params.row;
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              on: {
                click() {
                  _this.rowClickHandle(row);
                }
              }
            },
            "处理"
          )
        ]);
      }
    }
  ];
};
export const tableColumnsProcessDone = _this => {
  return [
    {
      title: "申请单编号",
      key: "bizCode",
      tooltip: true,
      minWidth: 220,
      render(h, { row }) {
        return (<span style={"color: #2d8cf0; cursor: pointer"} onClick={() => _this.rowClickHandle(row)}>{row.bizCode}</span>)
      }
    },
    {
      title: "月份",
      key: "assessTime",
      minWidth: 120
    },
    {
      title: "城市",
      key: "cityName",
      minWidth: 160
    },
    {
      title: "运营商",
      key: "agentName",
      minWidth: 120
    },
    {
      title: "运营模式",
      key: "operateType",
      minWidth: 140,
      render: (h, { row }) => {
        let tList = (`${row.operateType}`).split(",");
        return (<span>{tList.map(v => {
          let f = [...operateTypeEnum, ...allType].find(t => `${t.value}` === `${v}`)
          return f ? f.label : ""
        }).filter(Boolean).join(", ")}</span>)
      }
    },
    {
      title: "主题",
      key: "title",
      minWidth: 160
    },
    {
      title: "状态",
      key: "statusDesc",
      minWidth: 120
    },
    {
      title: "创建时间",
      key: "createTime",
      minWidth: 180
    },
    {
      title: "操作人",
      key: "updaterName",
      minWidth: 120
    },
    {
      title: "当前处理人",
      key: "handlerName",
      minWidth: 120
    }
  ];
};

// 流程处理记录table列
export const columnsProcess = [
  {
    title: "时间",
    key: "handlerEndTime",
    minWidth: 80,
    align: "center"
  },
  {
    title: "节点名称",
    key: "valDesc",
    align: "center"
  },
  {
    title: "节点处理人",
    key: "handlerName",
    align: "center"
  },
  {
    title: "操作",
    key: "resultDesc",
    align: "center"
  },
  {
    title: "处理意见",
    key: "proposal",
    align: "center"
  }
];
