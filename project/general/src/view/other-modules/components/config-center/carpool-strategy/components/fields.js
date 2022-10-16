// 重复机制
export const repetitionMechanisms = [
  { value: 1, label: "工作日" },
  { value: 2, label: "休息日" },
];

export const repetitionMap = {
  1: "工作日",
  2: "休息日",
};

// 可拼位置
export const carpoolPositions = [
  { value: 0, label: "按车辆实际空位数" },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
];

// 拼车露出限制
export const carpoolShowLimits = [
  { value: 1, label: "全铺" },
  { value: 2, label: "接起率小于等于X值时全铺" },
  // { value: 3, label: "拼成率大于等于X值时全铺" },
];

export const carpoolShowMap = {
  1: "全铺",
  2: "接起率小于等于X值时全铺",
  // 3: "拼成率大于等于X值时全铺"
}

// 乘客定价折扣
export const pricingDiscounts = [
  { value: 1, label: "拼成一口价，拼不成实时计价" },
  { value: 2, label: "拼成一口价，拼不成一口价" },
];

export const pricingDiscountMap = {
  1: "拼成一口价，拼不成实时计价",
  2: "拼成一口价，拼不成一口价"
};


// 司机定价折扣
export const driverPricingDiscounts = [
  { value: 81, label: "拼成一口价，拼不成实时计价" },
  { value: 82, label: "拼成一口价，拼不成一口价" },
  { value: 83, label: "拼成实时计费，拼不成实时计费" },
];

export const driverPricingDiscountMap = {
  81: "拼成一口价，拼不成实时计价",
  82: "拼成一口价，拼不成一口价",
  83: "拼成实时计费，拼不成实时计费"
};

// 表单必填校验
export const ruleValidate = {
  startTime: [
    {
      required: true,
      message: "请选择开始时间",
      trigger: "change"
    },
  ],
  endTime: [
    {
      required: true,
      message: "请选择结束时间",
      trigger: "change",
    },
  ],
  workRestDayType: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "请选择重复机制",
      trigger: "change",
    },
  ],
  seats: [
    {
      required: true,
      type: "number",
      message: "请选择每车可拼位置",
      trigger: "change",
    },
  ],
  exposedType: [
    {
      required: true,
      type: "number",
      message: "请选择拼车露出限制",
      trigger: "change",
    },
  ],
  acceptRatio: [
    {
      required: true,
      type: "number",
      message: "请输入接起率",
      trigger: "blur,change",
    }
  ],
  successRatio: [
    {
      required: true,
      type: "number",
      message: "请输入拼成率",
      trigger: "blur,change",
    }
  ],
  carpoolFareType: [
    {
      required: true,
      type: "number",
      message: "请选择定价折扣",
      trigger: "change",
    },
  ],
  oneDiscount: [
    {
      required: true,
      type: "number",
      message: "请输入折扣",
      trigger: "blur,change",
    }
  ],
  twoDiscount: [
    {
      required: true,
      type: "number",
      message: "请输入折扣",
      trigger: "blur,change",
    }
  ],
  noDiscount: [
    {
      required: true,
      type: "number",
      message: "请输入折扣",
      trigger: "blur,change",
    }
  ],
  driverCarpoolFareType: [
    {
      // required: true,
      type: "number",
      message: "请选择定价折扣",
      trigger: "change",
    },
  ],
  oneDiscountDriver: [
    {
      required: true,
      type: "number",
      message: "请输入折扣",
      trigger: "blur,change",
    }
  ],
  twoDiscountDriver: [
    {
      required: true,
      type: "number",
      message: "请输入折扣",
      trigger: "blur,change",
    }
  ],
  noDiscountDriver: [
    {
      required: true,
      type: "number",
      message: "请输入折扣",
      trigger: "blur,change",
    }
  ],
  passengerCarpool: [
    {
      required: true,
      type: "number",
      message: "请输入乘客侧拼单上限",
      trigger: "blur,change",
    }
  ],
  driverCarpool: [
    {
      required: true,
      type: "number",
      message: "请输入司机侧拼单上限",
      trigger: "blur,change",
    }
  ],
  // carpoolMile: [
  //   {
  //     required: true,
  //     type: "string",
  //     message: "请输入拼车单里程上限",
  //     trigger: "blur",
  //   },
  // ],
  distanceRatio: [
    {
      required: true,
      type: "number",
      message: "请输入绕路系数上限",
      trigger: "blur,change",
    }
  ],
  commonMileRatio: [
  ],
  // freeWaitTime: [
  //   {
  //     required: true,
  //     type: "string",
  //     message: "请输入司机无责等待时长",
  //     trigger: "blur",
  //   },
  // ],
  redundancyTimes: [
    {
      required: true,
      type: "array",
      min: 1,
      message: "请添加订单冗余时长"
    },
  ],
};

export const popRuleValidate = {
  startMile: [
    {
      required: true,
      type: "number",
      message: "请输入里程",
      trigger: "blur,change",
    }
  ],
  endMile: [
    {
      required: true,
      type: "number",
      message: "请输入里程",
      trigger: "blur,change",
    }
  ],
  redundancyTime: [
    {
      required: true,
      type: "number",
      message: "请输入时长",
      trigger: "blur,change",
    }
  ],
};
