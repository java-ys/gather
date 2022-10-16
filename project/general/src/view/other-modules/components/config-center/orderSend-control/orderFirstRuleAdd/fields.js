// 查询省份名
export const getProvinceNameByCityUuid = (cityCode, list) => {
  let provinceName = "";
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (Number(it.value) === Number(cityCode)) {
          provinceName = item.province;
        }
      });
    }
  });
  return provinceName;
};
// 查询cityName
export const getCityObjByCityCode = (provienceCode, cityCode, list) => {
  let cityObj = {};
  list.forEach(item => {
    if (item.children && provienceCode === item.provinceID) {
      item.children.forEach(it => {
        if (it.value === cityCode) {
          cityObj = it;
        }
      });
    }
  });
  return cityObj;
};

// 查询省份i
export const getProvinceIdByCityUuid = (cityUuid, list) => {
  let provinceId = "";
  list.forEach(item => {
    if (item.children) {
      item.children.forEach(it => {
        if (it.value === cityUuid) {
          provinceId = item.value;
        }
      });
    }
  });
  return provinceId;
};

// 操作类型
export const geToperationType = i => {
  let map = {
    1: "新增",
    2: "修改"
  };
  return map[i];
};

// 星期值
export const getWeekName = i => {
  let map = {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日"
  };
  return map[i];
};
// 阿拉伯数字
export const isAlabo = i => {
  let map = [1, 2, 3, 4, 5, 6, 7, "1", "2", "3", "4", "5", "6", "7"];
  return map.includes(i);
};
// 反星期值
export const getReverseWeekName = i => {
  let map = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
    六: 6,
    日: 7
  };
  return map[i];
};
// 系数
export const coefficientArr = [
  0.1,
  0.2,
  0.3,
  0.4,
  0.5,
  0.6,
  0.7,
  0.8,
  0.9,
  1,
  1.1,
  1.2,
  1.3,
  1.4,
  1.5,
  1.6,
  1.7,
  1.8,
  1.9,
  2
];
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
};

// 列表数据
export const listColumns = {
  columns(_this) {
    return [
      {
        title: "用户群名称",
        width: 80,
        render(h, params) {
          return h(
            "span",
            {},
            (_this.current - 1) * _this.pageSize + params.index + 1
          );
        }
      },
      {
        title: "适用城市",
        minWidth: 80,
        render: (h, params) => {
          return h("div", params.row.provinceName + "/" + params.row.cityName);
        }
      },
      {
        title: "产品线",
        minWidth: 80,
        render: (h, params) => {
          return h("div", params.row.productLinesShow);
        }
      },
      {
        title: "车型等级",
        minWidth: 200,
        render: (h, params) => {
          return h("div", params.row.orderChannelSetsShow);
        }
      },
      {
        title: "策略类型",
        minWidth: 200,
        render: (h, params) => {
          return h("div", params.row.orderChannelSetsShow);
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
          return h(
            "div",
            _this.$moment(params.row.updateTime).format("YYYY-MM-DD HH:mm:ss")
          );
        }
      },
      {
        title: "操作人",
        minWidth: 100,
        key: "updaterName"
      },
      {
        title: "操作",
        width: 220,
        fixed: "right",
        render(h, params) {
          console.log("操作", _this.fromSource);
          return h(
            "div",
            {
              style: {
                display: _this.fromSource !== 3 ? "flex" : "none"
              }
            },
            [
              h(
                "Button",
                {
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
                  directives: [
                    {
                      name: "hasAuth",
                      value: "strategy_control-priorityEdit"
                    }
                  ],
                  on: {
                    click() {
                      _this.goEdit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    ghost: true,
                    size: "small"
                  },
                  class: {
                    tableBtn: true
                  },
                  directives: [
                    {
                      name: "hasAuth",
                      value: "strategy_control-priorityDelete"
                    }
                  ],
                  on: {
                    click() {
                      _this.deleteData(params.row.uuid);
                    }
                  }
                },
                "删除"
              )
            ]
          );
        }
      }
    ];
  }
};

// 用户群状态
export const getGroupStatusName = i => {
  let map = {
    0: "下线",
    1: "上线",
    2: "移除"
    // 3: '废弃',
    // 4: '上线待审核',
    // 5: '废弃待审核',
  };
  return map[i];
};
export const getDispatchInear = val => {
  console.log(typeof val, "val");
  return val ? "是" : "否";
};

// 用户群列表数据
export const userColumns = {
  columns(_this) {
    return [
      {
        title: "用户群名称",
        minWidth: 200,
        key: "groupName"
      },
      {
        title: "状态",
        minWidth: 100,
        render: (h, params) => {
          return h("div", getGroupStatusName(params.row.onlineStatus));
        }
      },

      {
        title: "优先级系数",
        minWidth: 120,
        key: "dispatchWeight"
      },
      // {
      //   title: "是否就近派单",
      //   minWidth: 120,
      //   render: (h, params) => {
      //     return h("div", getDispatchInear(params.row.nearbyDispatch));
      //   }
      // },
      {
        title: "操作",
        width: 150,
        render(h, params) {
          return h(
            "div",
            {
              style: {
                display: _this.fromSource !== 3 ? "flex" : "none"
              }
            },
            [
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
                      _this.goEdit(params.row);
                    }
                  }
                },
                "编辑"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    ghost: true,
                    size: "small"
                  },
                  class: {
                    tableBtn: true
                  },
                  on: {
                    click() {
                      _this.deleteItem(params.row);
                    }
                  }
                },
                "移除"
              )
            ]
          );
        }
      }
    ];
  }
};
// 校验等级
export const validLevel = (rule, value, callback) => {
  const newValue = Number(value);
  if (Number.isNaN(newValue)) {
    callback(new Error("等级必须为数值类型"));
    return false;
  }
  if (newValue < 0) {
    callback(new Error("等级数值必须大于0"));
    return false;
  }
  const splitValue = String(value).split(".");
  if (splitValue.length === 2 && splitValue[1].length > 2) {
    callback(new Error("等级数值仅限精确至小数点后两位"));
    return false;
  }
  callback();
};
// 校验系数
export const validCofficient = (rule, value, callback) => {
  const newValue = Number(value);
  if (Number.isNaN(newValue)) {
    callback(new Error("系数必须为数值类型"));
    return false;
  }
  if (newValue < 0.1 || newValue > 2.0) {
    callback(new Error("系数仅可输入0.1到2.0之间的数值"));
    return false;
  }
  const splitValue = String(value).split(".");
  if (splitValue.length === 2 && splitValue[1].length > 2) {
    callback(new Error("系数仅限精确至小数点后两位"));
    return false;
  }
  callback();
};

export const validatorRuleTypeList = (rule, value, callback) => {
  console.log(value, "value");
  if (!value || !value.length) {
    callback(new Error("订单优先级策略不能为空"));
    return false;
  }
  callback();
};

export const validateArr = tips => (rule, value, callback) => {
  if (!value || !value.length) {
    callback(new Error(tips));
    return false;
  }
  callback();
};

// 校验日期
export const validatorTime = (rule, value, callback) => {
  let date = value;
  if (!date) {
    callback(new Error("必选"));
  }
  let timestamp = new Date(date).getTime();
  if (timestamp < Date.now()) {
    callback(new Error("生效时间不得小于当前时间"));
  } else {
    callback();
  }
};

const vallidArray = (rule, value, callback) => {
  if (value && value.length) {
    callback();
  } else {
    callback();
    // callback(new Error("车型等级不能为空"))
  }
};
export let orderFirstRules = {
  ruleName: [
    {
      required: true,
      message: "规则名称不能为空"
    }
  ],
  // 城市
  provinceCityCode: [
    {
      required: true,
      message: "城市不能为空"
    }
  ],
  // areaCodeList: [
  //   {
  //     required: true,
  //     message: "区县不能为空"
  //   }
  // ],
  areaCode: [
    {
      required: true,
      message: "区县不能为空"
    }
  ],
  expandBizLine: [
    {
      required: true,
      message: "业务线不能为空"
    }
  ],
  productLine: [
    {
      required: true,
      message: "产品线不能为空"
    }
  ],
  carLevels: [
    {
      type: Array,
      required: true,
      message: "车型等级不能为空",
      validator: vallidArray
    }
  ],
  ruleTypeList: [
    {
      required: true,
      message: "订单优先级策略不能为空"
    },
    {
      trigger: "blur",
      validator: validatorRuleTypeList
    }
  ],
  weekFormValidate: {
    periods: [
      {
        required: true,
        validator: validatorTimeDetail
      }
    ],
    coefficient: [
      {
        required: true,
        message: "必选"
      }
    ]
  },

  orderPricePriorityStrategySaveReq: {
    // 等级
    level: [
      {
        required: true,
        message: "请输入等级"
      },
      {
        trigger: "blur",
        validator: validLevel
      }
    ],
    // 等级
    rate: [
      {
        required: true,
        message: "请输入系数"
      },
      {
        trigger: "blur",
        validator: validCofficient
      }
    ]
  },
  orderChannelSets: [
    {
      required: true,
      message: "订单渠道不能为空"
    },
    {
      trigger: "blur",
      validator: validateArr("订单渠道不能为空")
    }
  ]
};
