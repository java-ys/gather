export const state = [{
  value: 0,
  label: "待生效"
}, {
  value: 1,
  label: "生效中"
}, {
  value: 2,
  label: "已失效"
}]
export const qaTypeMap = [{
  value: 1,
  label: "费用说明"
}, {
  value: 2,
  label: "支付常见问题"
// }, {
//   value: 2,
//   label: "已失效"
}]
export const inputList = [
  {
    name: "text-input",
    title: "标题",
    titleWidth: 90,
    value: "",
    placeholder: "请输入标题名称",
    bind_key: "title"
  },
  {
    name: "drop-input",
    bind_key: "qaType",
    value: "",
    dropList: [
      ...qaTypeMap
    ],
    title: "类型",
    inputWidth: 150,
    titleWidth: 40,
    clearable: true,
    filterable: true
  }
]

