const driverTypeList = [
  { 10: "自营司机" },
  { 20: "自营-主司机" },
  { 30: "自营-副司机" },
  { 40: "自营-顶班司机" },
  { 50: "UP司机" },
  { 60: "UP-主司机" },
  { 70: "UP-副司机" },
  { 80: "UP-顶班司机" }
];
const driverStateList= [
  { 1: "正常" },
  { 2: "短期封号" },
  { 3: "长期封号" },
  { 4: "未审核" },
  { 5: "待运营" },
  { 6: "离职" },
  { 7: "黑名单" },
  { 8: "强制下线" },
  { 9: "冻结" }
]
const modeInfo = {
  "1": "A模式",
  "2": "UP模式",
  "3": "P模式"
};
export const inputList = [
  {
    name: "text-input", // 文本输入框名
    bind_key: "driverName", // 返回数据的key名
    placeholder: "请输入司机姓名",
    value: "", // 用于数据绑定
    title: "司机姓名："
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "mobile", // 返回数据的key名
    placeholder: "请输入手机号",
    value: "", // 用于数据绑定
    title: "司机手机号：",
    titleWidth: 80
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "idCard", // 返回数据的key名
    placeholder: "请输入身份证号",
    value: "", // 用于数据绑定
    title: "司机身份证号：",
    titleWidth: 100
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityCode", // 返回数据的key名
    placeholder: "请选择城市",
    value: "", // 绑定返回数据
    title: "城市：",
    filterable: true,
    dropList: []
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "agentUuid", // 返回数据的key名
    placeholder: "请选择运营商",
    value: "", // 用于数据绑定
    title: "运营商：",
    filterable: true,
    dropList: []
  },
  // {
  //   name: "drop-input", // 文本输入框名
  //   bind_key: "operationMode", // 返回数据的key名
  //   placeholder: "请选择",
  //   value: "", // 用于数据绑定
  //   title: "运营模式：", // 展示的字段名
  //   dropList: [
  //     {
  //       label: "A模式",
  //       value: 1
  //     },
  //     {
  //       label: "UP模式",
  //       value: 2
  //     }
  //   ]
  // },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "driverTypes", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "司机类型：", // 展示的字段名
    titleWidth: 80,
    dropList: driverTypeList.map(it => {
      let k = Object.keys(it)[0];
      return {
        label: it[k],
        value: k
      };
    })
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "driverStatus", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "司机状态：", // 展示的字段名
    titleWidth: 80,
    dropList: driverStateList.map(it => {
      let k = Object.keys(it)[0];
      return {
        label: it[k],
        value: k
      };
    })
  },
  {
    name: "text-input", // 文本输入框名
    bind_key: "plateNum", // 返回数据的key名
    placeholder: "请输入",
    value: "", // 用于数据绑定
    title: "车牌号："
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "supplyWay", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "供应方式：", // 展示的字段名
    dropList: [
      {
        label: "自购",
        value: 0
      },
      {
        label: "加盟",
        value: 1
      },
      {
        label: "裸车租赁",
        value: 3
      },
      {
        label: "大包租赁",
        value: 4
      }
    ]
  },
  {
    name: "date-input", // 文本输入框名
    bind_key: ["entryStartTime", "entryEndTime"], // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "入职日期："
  }
];

export const tableTitle = that => {
  return [
    {
      title: "司机ID",
      key: "driverNo",
      tooltip: true,
      minWidth: 140
      // fixed: "left"
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "司机手机号",
      key: "mobile",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "司机身份证号",
      key: "idCard",
      tooltip: true,
      minWidth: 180
    },
    // {
    //   title: "运营模式",
    //   key: "operationMode",
    //   tooltip: true,
    //   minWidth: 120,
    //   render: (h, params) => {
    //     let mode = params.row.operationMode.split(",");
    //     let r = mode.map(it => {
    //       return modeInfo[it + ""];
    //     });
    //     return h("span", r.join(", "));
    //   }
    // },
    {
      title: "司机类型",
      key: "driverType",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let k = {};
        driverTypeList.forEach(it => {
          k = { ...k, ...it };
        });
        return h("span", k[+params.row.driverType]);
      }
    },
    {
      title: "司机工资类别",
      key: "driverSalaryType",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "司机状态",
      key: "driverStatus",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let k = {};
        driverStateList.forEach(it => {
          k = { ...k, ...it };
        });
        return h("span", k[+params.row.driverStatus]);
      }
     
    },
    {
      title: "城市",
      key: "cityName",
      ellipsis: true,
      width: 120
    },
    {
      title: "运营商",
      key: "agentName",
      ellipsis: true,
      width: 140
    },
    {
      title: "入职日期",
      key: "entryTime",
      tooltip: true,
      minWidth: 180
    },
    {
      title: "绑车日期",
      key: "authTimeStart",
      tooltip: true,
      width: 180
    },
    {
      title: "绑定车型",
      key: "model",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "车牌号",
      key: "plateNum",
      tooltip: true,
      minWidth: 120
    },
    {
      title: "供应方式",
      key: "supplyWay",
      tooltip: true,
      minWidth: 120,
      render: (h, params) => {
        let Enum = ["自购", "加盟", "", "裸车租赁", "大包租赁"]; // 2: 租赁(废弃)
        return h("span", Enum[params.row.supplyWay]);
      }
    },
    {
      title: "资产公司",
      key: "authCoName",
      tooltip: true,
      minWidth: 120
    }
    // {
    //   title: "考勤规则版本",
    //   key: "version",
    //   tooltip: true,
    //   width: 150,
    //   render: (h, params) => {
    //     return h("div", [
    //       h(
    //         "Button",
    //         {
    //           props: {
    //             type: "text",
    //             ghost: true,
    //             size: "small"
    //           },
    //           style: {
    //             color: "#2d8cf0",
    //             textDecoration: "underline",
    //             display:
    //               params.row.version && params.row.cityName
    //                 ? "inline-block"
    //                 : "none"
    //           },
    //           on: {
    //             click: () => {
    //               that.detailParams = {
    //                 cityName: params.row.cityName,
    //                 examineType: "D",
    //                 versionNumber: Number(params.row.version.slice(1, 4))
    //               };
    //               that.isAttenRulesModal = true;
    //             }
    //           }
    //         },
    //         params.row.cityName + params.row.version
    //       )
    //     ]);
    //   }
    // }
  ];
};

export const pageData = {
  queryAjaxPramas: {}, //查询条件obj
  total: 0,
  current: 1,
  pageSize: 10,
  pageSizeOpts: [20, 30, 50, 100],
  tableColumns: [],
  tableData: [],
  // tableColumnsChecked: Object.keys(tableTitle)
};
