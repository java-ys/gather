
export const productLine = {
    4: "快享",
    2: "专享"
  }
  export const dropList = (v = statusMap) => {
    return Object.keys(v).map(key => {
      return {
        value: Number(key),
        label: v[key]
      };
    });
  };
  export const transportMap = {
    1: "T3运力",
    2: "东风运力",
    3: "一汽运力"
  }
  export const powerStatusMap = {
    0: "未启用",
    1: "已启用",
  };
  export const powerInputList = [
    {
      name: "cascader-input", // 级联
      bind_key: ["provinceCode", "cityUuid"],
      value: [],
      cascaderList: [],
      filterable: true,
      title: "城市"
    },
    {
      name: "drop-input",
      bind_key: "businessType",
      placeholder: "请选择",
      value: "",
      dropList: dropList(productLine),
      title: "产品线",
    },
    {
      name: "drop-input",
      bind_key: "status",
      placeholder: "请选择",
      value: "",
      dropList: dropList(powerStatusMap),
      title: "状态",
    }
  ]

export const getPowerTableColumns = that => {
    return [
      {
        title: "城市",
        key: "cityName",
        tooltip: true,
        align: "center",
        minWidth: 200,
      },
      {
        title: "产品线",
        key: "businessType",
        tooltip: true,
        align: "center",
        minWidth: 200,
        render(h, params) {
          return h("span", productLine[params.row.businessType]);
        }
      },
      {
        title: "低电量阈值",
        key: "lowSocThreshold",
        tooltip: true,
        align: "center",
        minWidth: 200,
      },
      {
        title: "优先级系数",
        key: "coefficient",
        tooltip: true,
        align: "center",
        minWidth: 200,
      },
      {
        title: "状态",
        key: "state",
        tooltip: true,
        align: "center",
        minWidth: 200,
        render(h, params) {
          return h("span", powerStatusMap[params.row.status]);
        }
      },
      {
        title: "更新时间",
        key: "updateTime",
        tooltip: true,
        minWidth: 200,
        align: "center",
        render(h, params) {
          if (params.row.updateTime) {
            return h(
              "span",
              that.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss")
            );
          }
        }
      },
      {
        title: "操作人",
        key: "operator",
        tooltip: true,
        align: "center",
        minWidth: 200,
      },
      {
        title: "操作",
        align: "center",
        fixed: "right",
        minWidth: 200,
        render: (h, params) => {
          return h(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-around"
              }
            },
            [
              h(
                "Button",
                {
                  directives: [
                    {
                      name: "hasAuth",
                      value: "rechargin-pre-edit"
                    }
                  ],
                  props: {
                    type: "primary",
                    ghost: true
                  },
                  on: {
                    click: () => {
                      that.edit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              params.row.status === 0
                ? h(
                  "Button",
                  {
                    directives: [
                      {
                        name: "hasAuth",
                        value: "rechargin-pre-off"
                      }
                    ],
                    props: {
                      type: "success",
                      ghost: true
                    },
                    style: {},
                    on: {
                      click: () => {
                        that.close(params.row, 0)
                      }
                    }
                  },
                  "启用"
                )
                : h(
                  "Button",
                  {
                    directives: [
                      {
                        name: "hasAuth",
                        value: "rechargin-pre-off"
                      }
                    ],
                    props: {
                      type: "error",
                      ghost: true
                    },
                    style: {},
                    on: {
                      click: () => {
                        that.close(params.row, 1)
                      }
                    }
                  },
                  "停用"
                ),
            ]
          );
        }
      }
    ];
  };