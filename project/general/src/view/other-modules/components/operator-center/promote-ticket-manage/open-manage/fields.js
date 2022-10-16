export const statusList = [
  { label: "全部", value: "-1" },
  { label: "初始", value: "0" },
  { label: "启用", value: "1" },
  { label: "停用", value: "2" }
];

export const inputList = [
  {
    name: "cascader-input",
    bind_key: ["provinceCode", "cityCode"], // 返回数据的key名
    placeholder: "请选择城市",
    value: [], // 绑定返回数据
    cascaderList: [], // 级联列表
    title: "城市：", // 展示的字段名
    changeOnSelect: false,
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    title: "运营商",
    dropList: [],
    bind_key: "agentUuid",
    value: "",
    titleWidth: 60,
    inputWidth: 165
  },
  {
    name: "drop-input",
    bind_key: "status",
    value: "",
    titleWidth: 60,
    title: "状态",
    inputWidth: 165,
    dropList: statusList
  }
];

export const tableTitle = that => {
  return [
    // {
    //   type: "selection",
    //   width: 60,
    //   align: "center"
    // },
    {
      title: "序号",
      width: 80,
      align: "center",
      render: (h, params) => {
        return h("div", that.pageSize * (that.current - 1) + params.index + 1);
      }
    },
    {
      title: "省/市",
      key: "provinceName",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        const { provinceName, cityName } = params.row;
        return h("span", `${provinceName}/${cityName}`);
      }
    },
    {
      title: "运营商",
      key: "agentName",
      tooltip: true,
      minWidth: 130
    },
    {
      title: "最新操作时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 140
    },
    {
      title: "状态",
      key: "status",
      tooltip: true,
      minWidth: 100,
      render: (h, params) => {
        let f = statusList.find(it => it.value - params.row.status === 0);
        return h("span", f ? f.label : "");
      }
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 260,
      render: (h, params) => {
        const row = params.row;
        const { status } = row;
        const isInit = status - 0 === 0; // 初始
        const isOn = status - 1 === 0; // 启用
        const buttonDesc = isInit ? "启用" : isOn ? "停用" : "";
        return h("div", [
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              style: {
                "margin-right": "10px"
              },
              attrs: {
                ghost: "ghost"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "open-manage-detail"
                }
              ],
              on: {
                click: () => {
                  that.toDetail(row);
                }
              }
            },
            "详情"
          ),
          isInit
            ? h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    "margin-right": "10px"
                  },
                  attrs: {
                    ghost: "ghost"
                  },
                  directives: [
                    {
                      name: "hasAuth",
                      value: "open-manage-edit"
                    }
                  ],
                  on: {
                    click: () => {
                      that.toEdit(row);
                    }
                  }
                },
                "编辑"
              )
            : null,
          buttonDesc
            ? h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    "margin-right": "10px"
                  },
                  attrs: {
                    ghost: "ghost"
                  },
                  directives: [
                    {
                      name: "hasAuth",
                      value: "open-manage-enable"
                    }
                  ],
                  on: {
                    click: () => {
                      that.toOpenOrClose(row, buttonDesc);
                    }
                  }
                },
                `${buttonDesc}`
              )
            : null,
          h(
            "Button",
            {
              props: {
                type: "primary",
                size: "small"
              },
              attrs: {
                ghost: "ghost"
              },
              directives: [
                {
                  name: "hasAuth",
                  value: "open-manage-record"
                }
              ],
              on: {
                click: () => {
                  that.toRecord(row);
                }
              }
            },
            "操作记录"
          )
        ]);
      }
    }
  ];
};

export const recordTableTitle = that => {
  return [
    {
      title: "序号",
      width: 80,
      align: "center",
      render: (h, params) => {
        return h("div", that.pageSize * (that.current - 1) + params.index + 1);
      }
    },
    {
      title: "操作人",
      key: "operator",
      tooltip: true,
      minWidth: 130
    },
    {
      title: "操作类型",
      key: "operateType",
      tooltip: true,
      minWidth: 130
    },
    {
      title: "操作时间",
      key: "operateTime",
      tooltip: true,
      minWidth: 130
    }
  ];
};
