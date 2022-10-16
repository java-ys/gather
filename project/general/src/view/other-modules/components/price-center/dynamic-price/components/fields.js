export const formRules = {
  resRateFrom: [{
    required: true,
    type: "number",
    message: "请填写接起率",
    trigger: "change"
  }],
  resRateTo: [{
    required: true,
    type: "number",
    message: "请填写接起率",
    trigger: "change"
  }],
  startCapacity: [{
    required: true,
    type: "number",
    message: "请填写区间",
    trigger: "change"
  }],
  endCapacity: [{
    required: true,
    type: "number",
    message: "请填写区间",
    trigger: "change"
  }],
  discountRate: [{
    required: true,
    type: "number",
    message: "请填写系数",
    trigger: "change"
  }],
}
