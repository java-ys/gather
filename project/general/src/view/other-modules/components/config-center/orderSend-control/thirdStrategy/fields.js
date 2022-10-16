
// 操作类型
export const geToperationType = (i) => {
  let map = {
    1: "新增",
    2: "修改",
  }
  return map[i];
}

// 星期值
export const getWeekName = (i) => {
  let map = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日",
  }
  return map[i];
}
// 阿拉伯数字
export const isAlabo = (i) => {
  let map = [1, 2, 3, 4, 5, 6, 7, "1", "2", "3", "4", "5", "6", "7"]
  return map.includes(i);
}
// 反星期值
export const getReverseWeekName = (i) => {
  let map = {
    "一": 1,
    "二": 2,
    "三": 3,
    "四": 4,
    "五": 5,
    "六": 6,
    "日": 7,
  }
  return map[i];
}
// 系数
export const coefficientArr = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]
// 详情时间校验
export const validatorTimeDetail = (rule, value, callback) => {
  let date = value;
  if (!date[0] && !date[1]) {
    callback(new Error("必选"));
  } else {
    if (JSON.stringify(date[0]) === JSON.stringify(date[1])) {
      callback(new Error("结束时间要大于开始时间"));
    } else {
      callback();
    }
  }
}
export const getProductLineName = (context, productLine) => {
  return context.optList.find((i) => i.businessCode === productLine)?.businessCodeDesc
}

export const getCarLevelsName = (context, h, row) => {
  const { productLine, carLevels } = row;
  const { productCarKeyValue } = context.businessGradeName
  if (carLevels && carLevels.length) {
    return carLevels.map(v => {
      return h("span", productCarKeyValue[`${productLine}#${v}`])
    })
  }
  return ""

  // const { productLine, carLevels } = row;
  // const productLineObj = context.optList.find((i) => i.businessCode === productLine)
  // const length = carLevels.length;
  // const names = carLevels.map((carLevel, index) => {
  //   const findCarObj = productLineObj?.gradeDtoList.find((i) => i.gradeCode === carLevel);
  //   if (findCarObj) {
  //     const tips = (index === (length - 1) || length < 2) ? `${findCarObj.gradeDesc}` : `${findCarObj.gradeDesc}、`
  //     return h("span", tips)
  //   }
  // })
  // return names
}


export const getRuleTypesName = (h, RuleTypes) => {
  const config = {
    33: "订单来源优先级",
    11: "订单价值优先级",
    35: "用户群相对优先级"
  }
  const length = RuleTypes.length;
  const names = RuleTypes.map((ruleId, index) => {
    const tips = (index === (length - 1) || length < 2) ? `${config[ruleId]}` : `${config[ruleId]}、`
    return h("div", tips)
  })
  return names
}
// 列表数据
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
      title: "规则名称",
      width: 180,
      ellipsis: true,
      key: "ruleName"
    },
    {
      title: "适用城市",
      minWidth: 120,
      render: (h, params) => {
        return h("div", params.row.provinceName + "/" + params.row.cityName)
      }
    },
    {
      title: "区县",
      minWidth: 120,
      render: (h, params) => {
        return h("div", params.row.areaName)
      }
    },
    {
      title: "业务线",
      minWidth: 80,
      render: (h, params) => {
        const { row: { expandBizLine }} = params
        const { businessKeyValue } = _this.businessGradeName
        return h("div", businessKeyValue[expandBizLine])
      }
    },
    {
      title: "产品线",
      minWidth: 80,
      render: (h, params) => {
        const { row: { productLine }} = params
        const { productKeyValue } = _this.businessGradeName
        return h("div", productKeyValue[productLine])
      }
    },
    {
      title: "车型等级",
      minWidth: 200,
      render: (h, params) => {
        const { row } = params
        return h("div", getCarLevelsName(_this, h, row))
      }
    },
    {
      title: "策略类型",
      minWidth: 200,
      render: (h, params) => {
        return h("div", [...getRuleTypesName(h, params.row.ruleTypeList)])
      }
    },
    // {
    //   title: "订单渠道",
    //   minWidth: 200,
    //   render: (h, params) => {
    //     return h("div", params.row.orderChannelSetsShow)
    //   }
    // },
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
      key: "updater"
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
                type: "success",
                ghost: true,
                size: "small"
              },
              class: {
                tableBtn: true
              },
              on: {
                click() {
                  _this.goDetail(params.row);
                }
              }
            },
            "详情"
          ),
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
                value: "strategy_control-priorityEdit"
              }],
              on: {
                click() {
                  _this.goEdit(params.row);
                }
              }
            },
            "编辑"
          ),
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
                value: "strategy_control-priorityEdit"
              }],
              on: {
                click() {
                  _this.goCopy(params.row);
                }
              }
            },
            "复制"
          ),
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
              directives: [{
                name: "hasAuth",
                value: "strategy_control-priorityDelete"
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
              on: {
                click() {
                  _this.goViewDetail(params.row);
                }
              }
            },
            "预览"
          ),
        ]);
      }
    }
    ];
  }
}
