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

// 表单必填校验
export const ruleValidate = {
  ruleName: [
    {
      required: true,
      message: "请填写策略名称",
      trigger: "blur",
    },
  ],
  provinceCityCode: [
    {
      required: true,
      type: "array",
      message: "请选择策略命中城市",
      trigger: "change",
    },
  ],
  effectiveTimeVO: [
    {
      required: true,
      type: "array",
      message: "请选择策略生效日期",
      trigger: "change"
    },
  ],
  scene: [
    {
      required: true,
      message: "请选择拼车场景",
      type: "number",
      trigger: "change",
    },
  ],
};
