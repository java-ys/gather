import { mapToList } from "@/libs/util.js"
export const carStatusMap = {
  1: "接乘中",
  2: "进行中",
  3: "巡游中",
  4: "下线",
}
export const carStatusList = mapToList(carStatusMap)
export const targetMap = {
  1: "指定车牌号",
  2: "指定vin码",
  3: "指定运营商"
}
export const targetList = mapToList(targetMap)
// 校验开始时间大于当前时间
const validNowTime = (rule, value, callback) => {
  if (!value[0] || !value[1]) callback(new Error("请选择播报时段"));
  let now = new Date();
  let dataTime = new Date(value[0]);
  if (dataTime < now) {
    callback(new Error("开始时间不能小于当前时间"));
  } else {
    callback();
  }
};
const carNumValid = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入车牌号"));
  } else if (value.includes("，")) {
    return callback(new Error("请使用英文逗号间隔"));
  } else {
    callback();
  }
};
const vinValid = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入vin码"));
  } else if (value.includes("，")) {
    return callback(new Error("请使用英文逗号间隔"));
  } else {
    let arr = value.split(",")
    arr.forEach(item => {
      if (item.length !== 17) {
        return callback(new Error("请输入正确的vin码(17位)"));
      }
    })
    callback();
  }
};

export const ruleValidate = {
  strategyName: [
    { required: true, message: "请填写策略名称", trigger: "blur" }
  ],
  businessType: [
    { required: true, message: "请选择产品线", trigger: "change" }
  ],
  cityCodeList: [
    { required: true, type: "array", min: 1, message: "请选择城市", trigger: "blur" }
  ],
  sendTime: [
    { required: true, type: "array", min: 2, message: "请选择播报时段", trigger: "change" },
    { trigger: "change", validator: validNowTime }
  ],
  sendFrequency: [
    { required: true, type: "number", message: "请选择发送频次", trigger: "change" }
  ],
  broadcastObj: [
    { required: true, type: "number", message: "请选择播报对象", trigger: "change" }
  ],
  sendTimepoint: [
    { required: true, message: "请选择播报时间点" }
  ],
  carStatusList: [
    { required: true, type: "array", min: 1, message: "请选择车辆状态", trigger: "change" }
  ],
  carNumContent: [
    { required: true, message: "请输入车牌号", trigger: "blur" },
    { trigger: "blur", validator: carNumValid }
  ],
  vinContent: [
    { required: true, message: "请输入vin码", trigger: "blur" },
    { trigger: "blur", validator: vinValid }
  ],
  agentUuidList: [
    { required: true, type: "array", message: "请选择运营商", trigger: "blur" }
  ],
  voiceContent: [
    { required: true, message: "请输入播报内容", trigger: "blur" }
  ],
  voiceUrl: [
    { required: true, message: "请上传播报音频" }
  ],
  broadcastType: [
    { required: true, type: "number", message: "请选择播报内容", trigger: "change" }
  ],
}
