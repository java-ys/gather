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
// 校验开始时间大于当前时间
const validNowTime = (rule, value, callback) => {
  if (!value[0] || !value[1]) callback(new Error("请选择有效时间"));
  let now = new Date();
  let dataTime = new Date(value[0]);
  if (dataTime < now) {
    callback(new Error("开始时间需在当前时间之后"));
  } else {
    callback();
  }
};

export const ruleValidate = {
  ruleName: [
    { required: true, message: "请填写策略名称", trigger: "blur" }
  ],
  districtType: [
    { required: true, type: "number", message: "请选择行政区类型", trigger: "change" }
  ],
  channelSource: [
    { required: true, type: "number", message: "请选择渠道", trigger: "change" }
  ],
  cityCode: [
    { required: true, type: "string", message: "请选择城市", trigger: "change" }
  ],
  areaCode: [
    { required: true, type: "string", message: "请选择区县", trigger: "change" }
  ],
  driverTypes: [
    { required: true, type: "array", min: 1, message: "请选择工资类别", trigger: "change" },
  ],
  effectiveTime: [
    { required: true, type: "array", min: 2, message: "请选择有效时间", trigger: "change" },
    { trigger: "change", validator: validNowTime }
  ],
  useChannelDiscount: [
    { required: true, type: "number", message: "请选择是否受渠道折扣影响", trigger: "change" }
  ],
  useDynamicDiscount: [
    { required: true, type: "number", message: "请选择是否受动态折扣影响", trigger: "change" }
  ],
  time: [
    { required: true, type: "array", message: "请选择时间段", trigger: "blur" },
    { type: "array", max: 20, message: "最多可添加20个时段", trigger: "blur" },
  ]
}