/*
 * @Author: Evil Cheng
 * @Date: 2021-10-19 09:41:41
 * @LastEditTime: 2021-11-10 09:36:29
 * @Description:
 */
export const handleTypeMap = {
  1: {
    title: "新增策略",
    type: "新增",
    closeAlert: true
  },
  2: {
    title: "编辑策略",
    type: "编辑",
    closeAlert: true
  },
  3: {
    title: "策略详情",
    type: "详情",
    closeAlert: false
  }
};

export const mileageObject = {
  1: "<",
  2: "<=",
  3: ">",
  4: ">="
}

// 校验开始时间大于当前时间
const validNowTime = (rule, value, callback) => {
  if (!value[0] || !value[1]) callback(new Error("请选择有效时间"));
  let now = new Date();
  let dataTime = new Date(value[0]);
  if (dataTime <= now) {
    callback(new Error("开始时间需在当前时间之后"));
  } else {
    callback();
  }
};
// 校验封顶金额
const validNumber = (rule, value, callback) => {
  const regexp = /^[1-9]\d*$/;
  if (!value && value !== 0) {
    callback()
  }
  if (regexp.test(value) && Number(value) > 0 && Number(value) <= 99999) {
    callback();
  } else {
    callback(new Error("封顶金额在1~99999之间的正整数"));
  }
};
export const ruleValidate = {
  channelStrategyName: [
    { required: true, message: "请填写策略名称", trigger: "blur" }
  ],
  channelCode: [
    { required: true, type: "number", message: "请选择渠道", trigger: "change" }
  ],
  typeModule: [
    { required: true, type: "number", message: "请选择产品线", trigger: "change" }
  ],
  carLevels: [
    { required: true, type: "array", min: 1, message: "请选择车型等级", trigger: "change" }
  ],
  cityCodes: [
    { required: true, type: "array", min: 1, message: "请选择城市", trigger: "change" }
  ],
  typeTimes: [
    { required: true, type: "array", min: 1, message: "请选择订单类型", trigger: "change" }
  ],
  typeTripLimited: [
    { required: true, type: "number", message: "请选择用车场景", trigger: "change" }
  ],
  typeTrips: [
    { required: true, type: "array", min: 1, message: "请选择用车场景", trigger: "change" }
  ],
  effectTime: [
    { required: true, type: "array", min: 2, message: "请选择有效时间", trigger: "change" },
    { trigger: "change", validator: validNowTime }
  ],
  dynamicDiscountOpened: [
    { required: true, type: "number", message: "请选择是否使用动态折扣", trigger: "change" }
  ],
  channelDiscountOpened: [
    { required: true, type: "number", message: "请选择是否使用渠道折扣", trigger: "change" }
  ],
  channelDiscount: [
    { required: true, type: "number", message: "请输入渠道折扣系数", trigger: "change" },
    { message: "大于0小于2,最多两位小数", pattern: /^([1]+|[01]+\.\d{1,2})$/, trigger: "change" }
  ],
  channelMarkUpFare: [
    { validator: validNumber, trigger: "blur" },
  ],
  channelFareMethod: [
    { required: true, type: "number", message: "请选择计费方式", trigger: "change" }
  ],
  otherFareMethod: [
    { required: true, type: "number", message: "请选择附加费添加方式", trigger: "change" }
  ],
  otherFare: [
    { required: true, type: "number", message: "请输入附加费金额", trigger: "change" },
    { message: "不小于0,最多两位小数", pattern: /^(\d+|\d+\.\d{1,2})$/, trigger: "change" }
  ],
  channelDirectMinus: [
    { message: "大于0,最多一位小数", pattern: /^([1-9]\d*|\d+\.\d{1})$/, trigger: "change" }
  ],
  time: [
    { required: true, type: "array", message: "请选择时间段", trigger: "blur" },
    { type: "array", max: 20, message: "最多可添加20个时段", trigger: "blur" },
  ],
  startMileage: [
    { required: true, type: "number", min: 0, max: 99999.99, message: "请输入里程", trigger: "change" },
    { message: "不小于0,最多两位小数", pattern: /^\d{1,5}(\.\d{1,2})?$/, trigger: "change" }
  ],
  endMileage: [
    { required: true, type: "number", min: 0, max: 99999.99, message: "请输入里程", trigger: "change" },
    { message: "不小于0,最多两位小数", pattern: /^\d{1,5}(\.\d{1,2})?$/, trigger: "change" }
  ],
}