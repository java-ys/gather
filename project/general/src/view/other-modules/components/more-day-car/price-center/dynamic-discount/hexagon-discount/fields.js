// 产品线类型
export const getServiceTypeName = (i) => {
  let map = {
    4: "快享",
    2: "专享",
    1: "出租车"
  }
  return map[i];
}
// 生效状态
export const getStatusName = (i) => {
  let map = {
    "-1": "已失效",
    "0": "待生效",
    "1": "生效中",
    "-2": "已失效"
  }
  return map[i];
}
// 操作类型
export const getToperationTypeName = (i) => {
  let map = {
    1: "新增",
    2: "修改"
  }
  return map[i];
}
// 车型等级类型
export const getcarLevelName = (i) => {
  let map = {
    1: "快享",
    2: "舒适型",
    3: "行政型",
    4: "商务型",
    5: "尊贵型",
    9: "豪华型",
    8: "自动驾驶",
    10: "惠享"
  }
  return map[i];
}
// 产品线
export const businessTypeList = (i) => {
  let map = {
    1: "出租车",
    2: "专享",
    3: "跨城",
    4: "快享",
    11: "企业用车"
  }
  return map[i];
}

// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date[0]).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("开始时间不能大于结束时间"));
    } else {
      callback();
    }
  }
}

// 校验结束时间大于当前时间
export const validValue = (rule, value, callback) => {
  if (!value[0] || !value[1]) callback(new Error("请选择限定时段"));
  callback();
};

// 详情时间校验
export const validatorTimeDetail = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("开始时间不能大于结束时间"));
    } else {
      callback();
    }
  }
}

// 日志数据
export const logColumns = {
  columns(_this) {
    return [{
      title: "序号",
      width: 80,
      render(h, params) {
        return h("span", {}, (_this.current - 1) * _this.pageSize + params.index + 1);
      }
    },
    {
      title: "操作",
      minWidth: 100,
      key: "operationContent"
    },
    {
      title: "操作时间",
      minWidth: 150,
      key: "operateTime"
    }, {
      title: "操作人",
      minWidth: 200,
      key: "operatorName"
    },
    ];
  }
}
// 六边形折扣列表数据
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
      title: "策略名称",
      minWidth: 200,
      key: "ruleName"
    },
    {
      title: "产品线",
      minWidth: 100,
      key: "businessType",
      render: (h, params) => {
        return h("div", businessTypeList(params.row.businessType))
      }
    },
    {
      title: "车型等级",
      minWidth: 100,
      key: "carLevel",
      render: (h, params) => {
        return h("div", getcarLevelName(params.row.carLevel))
      }
    },
    {
      title: "城市",
      minWidth: 100,
      key: "cityName"
    },
    {
      title: "生效状态",
      minWidth: 100,
      key: "status",
      render: (h, params) => {
        return h("div", getStatusName(String(params.row.status)))
      }
    },
    {
      title: "开始时间",
      minWidth: 160,
      key: "effectiveTime"
    }, {
      title: "结束时间",
      minWidth: 160,
      key: "failureTime"
    },
    {
      title: "更新人",
      minWidth: 100,
      key: "updaterName"
    },
    {
      title: "更新时间",
      minWidth: 160,
      key: "updateTime"
    },
    {
      title: "创建人",
      minWidth: 100,
      key: "creatorName"
    },
    {
      title: "创建时间",
      minWidth: 160,
      key: "createTime"
    },
    {
      title: "操作",
      width: 220,
      fixed: "right",
      render(h, params) {
        return h("div", {
          style: {
            display: "flex",
          }
        }, [
          h(
            "Button", {
              props: {
                type: "error",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              style: {
                display: params.row.status === 0 ? "flex" : "none",
              },
              directives: [{
                name: "hasAuth",
                value: "day-hexagondiscount-delete"
              }],
              on: {
                click() {
                  _this.deleteData(params.row.uuid);
                }
              }
            },
            "删除"
          ),
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
                value: "day-hexagondiscount-detail"
              }],
              on: {
                click() {
                  _this.goDetail(params.row.uuid);
                }
              }
            },
            "详情"
          ),
          // h(
          //   "Button", {
          //     props: {
          //       type: "primary",
          //       ghost: true,
          //       size: "small"
          //     },
          //     class: {
          //       tableBtn: true
          //     },
          //     directives: [{
          //       name: "hasAuth",
          //       value: "day-hexagondiscount-log"
          //     }],
          //     on: {
          //       click() {
          //         _this.goLog(params.row.uuid);
          //       }
          //     }
          //   },
          //   "操作日志"
          // )
        ]);
      }
    }
    ];
  }
}
