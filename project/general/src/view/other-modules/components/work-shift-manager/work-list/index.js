export const inputList = [
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"],
    placeholder: "请选择城市",
    value: [],
    cascaderList: [],
    title: "城市：",
    titleWidth: 50,
    changeOnSelect: false
  },
  {
    name: "text-input",
    bind_key: "shiftName",
    placeholder: "请填写",
    value: "",
    titleWidth: 60,
    title: "排班名称："
  },
  {
    name: "drop-input",
    bind_key: "shiftType",
    placeholder: "请填写",
    value: "",
    titleWidth: 60,
    title: "排班类型：",
    dropList: [
      {
        value: 1,
        label: "单班"
      },
      {
        value: 2,
        label: "双班"
      }
    ]
  },
  {
    name: "drop-input",
    bind_key: "driverTag", // 返回数据的key名
    placeholder: "请选择",
    value: "",
    title: "司机类型：",
    titleWidth: 60,
    dropList: []
  }
];

export const tableColumns = that => {
  return [
    {
      title: "城市",
      key: "cityName",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "排班名称",
      key: "shiftName",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "排班类型",
      key: "shiftType",
      tooltip: true,
      minWidth: 100,
      render(h, params) {
        let statusMap = {
          1: "单班",
          2: "双班"
        };
        return h("div", statusMap[params.row.shiftType]);
      }
    },

    {
      title: "排班时段",
      key: "timeInterval",
      tooltip: true,
      minWidth: 100
    },
    {
      title: "适用司机",
      key: "driverScope",
      tooltip: true,
      minWidth: 100,
      // render(h, params) {
      //   if (params.row.driverTag) {
      //     const list = params.row.driverTag.filter(Boolean);
      //     return h("span", list.join(", "));
      //   }
      // }
    },
    {
      title: "在职司机数",
      key: "driverBangdingCnt",
      tooltip: true,
      minWidth: 100,
      // render(h, params) {
      //   if (params.row.bindedCarDriverNumber) {
      //     const list = params.row.bindedCarDriverNumber.filter(Boolean);
      //     return h("span", list.join(", "));
      //   }
      // }
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right",
      alig: "center",
      render: (h, params) => {
        return h("div", [
          h(
            "a",
            {
              on: {
                click() {
                  that.toCalendar(params.row);
                }
              }
            },
            "详情"
          )
        ]);
      }
    }
  ];
};

export const pageData = {
  pageData: {
    total: 10,
    currPage: 1,
    pageSize: 20
  },
  pageSizeOpts: [20, 50, 100]
};
