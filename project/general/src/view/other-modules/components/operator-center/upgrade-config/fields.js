// 策略类型
export const policyPriority = [
  {label: "运力负载均衡", value: 0},
  {label: "差价升舱", value: 1},
]
// 车型等级转换：运力负载均衡+差价升舱两种类型：
// 1. 下单车型中含有非巡网出租车型（11-快享型出租车，12-惠享型出租车）非普通出租车型；目标车型过滤出租车-普通经济型；
// 2. 下单车型中含有出租车-普通经济型，目标车型只展示巡网出租车型（11-快享型出租车，12-惠享型出租车）。
export const carRule1 = {targets: ['1#11','1#12'], notargets: ['1#1']}
export const carRule2 = {targets: ['1#1'], showCars: ['1#11','1#12']}

// 是否弹出升舱弹窗
export const need2PopList = [
  {label: "是", value: 1},
  {label: "否", value: 0},
]


// 订单类型
export const orderType = [
  {label: "实时单", value: 1},
  {label: "预约单", value: 2},
]

export const orderChannel = [
  {label: "端内", value: 0},
  {label: "端外", value: 1},
]

// 运力负载平衡->按下单车型定价；差价升舱→按目标车型定价
export const chargingStandard = ["按下单车型定价", "按目标车型定价"];

export const weekList = [
  {
    label: "周一",
    value: 1
  },
  {
    label: "周二",
    value: 2
  },
  {
    label: "周三",
    value: 3
  },
  {
    label: "周四",
    value: 4
  },
  {
    label: "周五",
    value: 5
  },
  {
    label: "周六",
    value: 6
  },
  {
    label: "周日",
    value: 7
  }
];

export const inputList = [
  {
    name: "drop-input", // 文本输入框名
    bind_key: "cityCodes", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "城市：", // 展示的字段名
    dropList: [],
    multiple: true,
    filterable: true,
    titleWidth: 90,
  },
  {
    key: "expandBizLine",
    name: "drop-input", // 文本输入框名
    bind_key: "expandBizLine", // 返回数据的key名
    placeholder: "请选择产品线",
    value: "", // 绑定返回数据
    dropList: [], // 级联列表
    title: "业务线：", // 展示的字段名
    titleWidth: 90,
    changeOnSelect: false
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "strategyStatus", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "状态：", // 展示的字段名
    titleWidth: 90,
    dropList: [
      {
        label: "已失效",
        value: -2
      },
      {
        label: "生效中",
        value: 1
      },
      {
        label: "未生效",
        value: 0
      }
    ]
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "oldCarLevel", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "被升舱车型：", // 展示的字段名
    dropList: [],
    titleWidth: 90
  },
  {
    name: "drop-input", // 文本输入框名
    bind_key: "newCarLevel", // 返回数据的key名
    placeholder: "请选择",
    value: "", // 用于数据绑定
    title: "升舱车型：", // 展示的字段名
    dropList: [],
    titleWidth: 90
  }
]

export const formRules = {
  upCarLevelStrategyName: [
    {
      required: true,
      message: "请填写策略名称"
    }
  ],
  cityCode: [
    {
      required: true,
      message: "请选择策略命中城市"
    }
  ],
  expandBizLine: [
    {
      required: true,
      message: "请选择业务线"
    }
  ],
  effectiveTime: [
    {
      required: true,
      message: "请选择策略生效时间"
    },
    {
      validator: (rule, value, callback) => {
        if (value.length !== 2 || value.some(item => !item)) {
          callback(new Error("请选择策略生效时间"))
        } else {
          callback()
        }
      }
    }
  ],
  priority: [
    {
      required: true,
      message: "请选择优先级"
    }
  ],
  typeTime: [
    {
      required: true,
      message: "请选择订单类型"
    },
  ],
  channel: [
    {
      required: true,
      message: "请选择订单渠道"
    },
  ],
  sources: [
    {
      required: true,
      message: "请选择渠道类型"
    },
  ]
};

export const props = {
  visible: {
    type: Boolean,
    default: false
  },
  cityList: {
    type: Array,
    default: () => []
  },
  carTypeList: {
    type: Array,
    default: () => []
  },
  submitLoading: {
    type: Boolean,
    default: false
  },
  detail: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  weekList: {
    type: Array,
    default: () => []
  }
};

const regInt = /^\d+$/

export const getRules = _this => {
  return {
    periodTime: [
      {
        required: true,
        message: "请选择策略时间段"
      },
      {
        validator: (rule, value, callback) => {
          if (value.length !== 2 || value.some(item => !item)) {
            callback(new Error("请选择策略时间段"))
          } else {
            callback()
          }
        }
      }
    ],
    week: [
      {
        required: true,
        message: "请选择重复机制"
      }
    ],
    oldCarLevelOrdersInHexagon: [
      {
        validator: (rule, value, callback) => {
          if (value || _this.form.newCarLevelOrdersInHexagon) {
            if (value && !regInt.test(value) || _this.form.newCarLevelOrdersInHexagon && !regInt.test(_this.form.newCarLevelOrdersInHexagon)) {
              callback(new Error("请输入整数"))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    ],
    newCarLevelOrdersInHexagon: [
      {
        validator: (rule, value, callback) => {
          if (value) {
            if (!regInt.test(value)) {
              callback(new Error("请输入整数"))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    ],
    upCarLevelOdds: [
      {
        validator: (rule, value, callback) => {
          if (value) {
            if (Number(value) > 100 || Number(value) < 0) {
              callback(new Error("请输入0-100有效范围内的数"))
            } else {
              callback()
            }
          } else {
            callback()
          }
        }
      }
    ],
    oldCarLevel: [
      {
        required: true,
        message: "请选择下单车型"
      }
    ],
    newCarLevel: [
      {
        required: true,
        message: "请选择目标车型"
      }
    ],
    driverFareModel: [
      {
        required: true,
        message: "请选择司机侧计费标准"
      }
    ],
    need2Pop: [
      {
        required: true,
        message: "请选择是否弹出升舱弹窗"
      },
    ],
  }
}

/*
增加业务线：单选，各业务线选项，读接口数据
订单类型：单选，实时单、预约单
订单渠道：单选，端内，端外
渠道类型：多选，根据订单渠道的选择后，展示该渠道下的类型选择，可多选；数据选择：全选+各渠道类型

策略优先级：单选，运力负载平衡，差价升舱

策略类型：单选，运力负载平衡，差价升舱。选中后司机侧计费标准自动出结果，运力负载平衡->按触发变更车型定价；差价升舱→按目标车型定价

触发变更车型（原名被升舱车型）：罗列产品线-车型的信息读接口，此处加上出租车车型，多选无限制，多选后自动将选中车型排序展示再触发变更车型计费优先级下面。
司机侧计费标准字段：跟随策略类型自动展示

触发变更车型计费优先级：自动展示触发变更车型中的选项，可以拖拽调整顺序，删减触发变更车型时，该车型自动从优先级排序中消失。

目标车型（原名升舱车型）: 罗列产品线-车型的信息读接口，此处加上出租车车型，单选车型。
乘客端配图：在选中差价升舱时，乘客端配置用于展示在弹窗内的配图
乘客端目标车型别名：不必填，该自动端填写后用于在乘客端展示目标接驾车型的名称信息。

提交策略：
校验同策略类型下，同时段，目标车型不能出现重复，重复提示：目标车型有重复配置。
校验目标车型不能同于触发变更车型，重复提示：目标车型不能与触发变更车型一致。
各城市同时段内只能存在一条策略。
订单类型：实时单和预约单各成为一条策略。
订单渠道：端内和端外各成为一条策略。
业务线：按照各业务线配置成为一条策略。
* */
