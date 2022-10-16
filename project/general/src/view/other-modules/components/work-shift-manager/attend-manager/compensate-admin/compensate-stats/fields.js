const zeroFill = (v) => {
  return +v >= 10 ? v : `0${+v}`
}
// 获取年月
export const getNowYearMonth = () => {
  const ds = new Date()
  const year = ds.getFullYear()
  const month = zeroFill(ds.getMonth()+1)
  const nowYearMonth = `${year}-${month}`
  return nowYearMonth
}

export const inputList = [
  {
    name: "cascader-input", // 文本输入框名
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择城市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "城市：", // 展示的字段名
    changeOnSelect: true,
    titleWidth: 60,
    inputWidth: 165,
  },
  {
    name: "drop-input",
    title: "运营商",
    dropList: [],
    bind_key: "agentId",
    value: "",
    titleWidth: 60,
    inputWidth: 165,
  },
  {
    name: "month-input",
    bind_key: "statsDate",
    value: getNowYearMonth(),
    titleWidth: 60,
    title: "时间",
    inputWidth: 100,
  },
  {
    name: "section-input",
    bind_key: ["minTimes", "maxTimes"],
    value1: null,
    value2: null,
    titleWidth: 60,
    title: "补偿时间",
    inputWidth: 50,
  },
];

export const tableColumns = (that) => {
  return [
    {
      title: "月份",
      key: "statsDate",
      tooltip: true,
      minWidth: 100,
    },
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 50,
    },
    {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      minWidth: 180,
    },
    {
      title: "补偿时长(小时)",
      key: "totalTimes",
      tooltip: true,
      minWidth: 100,
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      render: (h, params) => {
        return h("div", [
          h(
            "a",
            {
              on: {
                click() {
                  that.getDetail(params.row)
                },
              },
            },
            "详情"
          ),
        ]);
      },
    },
  ];
};

// 补偿列表参数
export const pageData = {
  isShowAudit: false,
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10,
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [],
};


// ==================================================================

export const inputListDetail = [
  {
    name: "text-input",
    title: "司机姓名",
    bind_key: "driverName",
    value: "",
    titleWidth: 60,
    inputWidth: 165,
  },
  {
    name: "text-input",
    bind_key: "driverMobile",
    value: "",
    titleWidth: 60,
    title: "手机号",
    inputWidth: 150,
  },
  {
    name: "month-input",
    bind_key: "statsDate",
    value: "",
    titleWidth: 60,
    title: "时间",
    inputWidth: 100,
  },
  {
    name: "section-input",
    bind_key: ["minTimes", "maxTimes"],
    value1: null,
    value2: null,
    titleWidth: 60,
    title: "补偿时间",
    inputWidth: 50,
  },
];

export const tableTitleState = (that) => {
  return [
    {
      title: "月份",
      key: "statsDate",
      tooltip: true,
      minWidth: 160,
    },
    {
      title: "司机姓名",
      key: "driverName",
      tooltip: true,
      minWidth: 150,
    },
    {
      title: "手机号",
      key: "driverMobile",
      tooltip: true,
      minWidth: 150,
    },
    {
      title: "月补偿时长(小时)",
      key: "totalTimes",
      tooltip: true,
      minWidth: 150,
    },
    {
      title: "类型",
      key: "outageName",
      tooltip: true,
      minWidth: 150,
    },
    {
      title: "类型补偿时长(小时)",
      key: "monRecoupDuration",
      tooltip: true,
      minWidth: 150,
    },
  ];
};

// 补偿统计详情参数
export const pageDataTwo = {
  pageData: {
    total: 0,
    currPage: 1,
    pageSize: 10,
  },
  pageSizeOpts: [10, 30, 50, 100],
  tableColumns: [],
  tableData: [],
};
