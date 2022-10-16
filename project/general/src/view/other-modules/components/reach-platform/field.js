export const REACH_WAY_LIST = createOptions([
  "PUSH",
  "信鸽",
  "短信",
  "微信",
])

export const TEMPLATE_TYPE_LIST = createOptions([
  "验证码",
  "通知",
  "营销",
])

export const TASK_STATUS_LIST = createOptions([
  "待发送",
  "发送中",
  "已发送",
  "发送失败",
  "取消发送",
])

export const TEMPLATE_STATUS_LIST = createOptions([
  "有效",
  "无效",
  "待审批",
  "审批不通过",
  "删除"
], 1)


export const TARGET_LIST = createOptions([
  "乘客",
  "司机"
])

function createOptions(labels, start = 0) {
  return Object.freeze(labels.map((label, i) => ({ label, value: start + i })));
}