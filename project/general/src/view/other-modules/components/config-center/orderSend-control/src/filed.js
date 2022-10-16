import { checkHasBtn } from "@/libs/util"
export const transportMap = {
  // 1: "T3运力",
  2: "东风运力",
  3: "一汽运力"
}
export const statusMap = {
  0: "已启用",
  1: "未启用",
};
export const productLine = {
  2: "快享",
  4: "专享"
}
export const dropList = (v = statusMap) => {
  return Object.keys(v).map(key => {
    return {
      value: Number(key),
      label: v[key]
    };
  });
};
  //策略类型
export const  clList = [                
  {value: 1 ,label: '行N限N'},
]

//状态类型
export const  statusList = [                
  {value: 1 ,label: '启用'},
  {value: -2 ,label: '停用'},
]

export const inputList = [
  {
    name: "drop-input",
    bind_key: "transportId",
    placeholder: "请选择",
    value: "",
    dropList: dropList(transportMap),
    title: "运力渠道",
  },
  {
    name: "cascader-input", // 级联
    bind_key: ["provinceCode", "cityCode"],
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
    bind_key: "state",
    placeholder: "请选择",
    value: "",
    dropList: dropList(),
    title: "状态",
  }
]
export const getTableColumns = that => {
  return [
    {
      title: "运力渠道",
      key: "transportId",
      tooltip: true,
      align: "center",
      minWidth: 200,
      render(h, params) {
        return h("span", transportMap[params.row.transportId]);
      }
    },
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
      title: "优先级系数",
      key: "priorityFactor",
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
        return h("span", statusMap[params.row.state]);
      }
    },
    {
      title: "更新时间",
      key: "updateTime",
      tooltip: true,
      minWidth: 200,
      align: "center",
      render(h, params) {
        if (params.row.createTime) {
          return h(
            "span",
            that.$moment(params.row.createTime).format("YYYY-MM-DD HH:mm:ss")
          );
        }
      }
    },
    {
      title: "操作人",
      key: "updater",
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
                    value: "dispatch-priority-edit"
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
            params.row.status === 1
              ? h(
                "Button",
                {
                  directives: [
                    {
                      name: "hasAuth",
                      value: "dispatch-priority-open"
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
                      value: "dispatch-priority-close"
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

// 列表数据 - 非号牌类限制策略
export const listColumns = {
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: "城市",
      minWidth: 80,
      render: (h, params) => {
        return h("div", params.row.provinceName + "/" + params.row.cityName)
      }
    },
    {
      title: "策略名称",
      tooltip: true,
      minWidth: 150,
      key: "ruleName"
    },
    {
      title: "策略类型",
      minWidth: 80,
      render: (h, params) => {
        let strategyType = params.row.nonNumberPlateDto.strategyType
        let strategyName = null      
        clList.some(item => {
          if (item.value === strategyType) strategyName = item.label
        })
        return h("div", strategyName)
      }
    },
    {
      title: "状态",
      minWidth: 80,
      render: (h, params) => {
        let status = params.row.status
        let statusName = null        
        statusList.some(item => {
          if (item.value === status) statusName = item.label
        })
        return h("div", statusName)
      }
    },
    {
      title: "更新时间",
      minWidth: 160,
      key: "effectiveTime",
      render: (h, params) => {
        return h("div", _this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss"))
      }
    },
    {
      title: "操作人",
      minWidth: 100,
      key: "updaterName",
      render: (h, params) => {
        return h("div",params.row.updater)
      }
    },
    {
      title: "操作",
      width: 220,
      fixed: "right",
      render(h, params) {
        const paramData = params.row;
        const { status } = paramData; 
        const canStop = status - 1 === 0; // 停用：仅未生效、正常状态可以停用
        const canStart = status + 2 === 0; // 启用：仅停用状态可以启用。
        return h("div", {
          style: {
            display: "flex",
          }
        }, [

          h(
            "Button", {
              props: {
                type: "primary",
                ghost: true,
                size: "small" 
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "strategy_detail"
              }],
              on: {
                click() {
                  _this.goDetail(paramData);
                }
              }
            },
            "详情"
          ),
          h(
            "Button", {
              props: {
                type: "warning",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "strategy_edit"
              }],
              on: {
                click() {
                  _this.goEdit(paramData);
                }
              }
            },
            "编辑"
          ),
          canStart?
          h(
            "Button", {
              props: {
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "strategy_active"
              }],
              // style: {
              //   display: !checkHasBtn("strategy_active") ? "none" : "inline-block"
              // },  
              on: {
                click() {
                  _this.rowActive(paramData);
                }
              }
            },
            "启用"
          ):'',
          canStop ?
          h(
            "Button", {
              props: {
                type: "info",
                ghost: true,
                size: "small"
              },
              style: {
                color: "red",
                borderColor: "red"
              },
              class: {
                tableBtn: true
              },
              directives: [{
                name: "hasAuth",
                value: "strategy_deactive"
              }],
              // style: {
              //   display: !checkHasBtn("strategy_deactive") ? "none" : "inline-block"
              // },
              on: {
                click() {
                  _this.rowActive(paramData);
                }
              }
            },
            "停用"
          ): '',

          // h(
          //   "Button", {
          //     props: {
          //       type: "error",
          //       ghost: true,
          //       size: "small"
          //     },
          //     class: {
          //       tableBtn: true
          //     },
          //     directives: [{
          //       name: "hasAuth",
          //       value: "strategy_delete"
          //     }],
          //     on: {
          //       click() {
          //         _this.deleteData(params.row.uuid);
          //       }
          //     }
          //   },
          //   "删除"
          // )
        ]);
      }
    }
    ];
  }
}
