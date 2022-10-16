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

export const inputList = [
  {
    name: "text-input",
    title: "策略名称",
    titleWidth: 90,
    value: "",
    bind_key: "strategyName",
    maxlength: 20,
  },
  {
    name: "drop-input",
    bind_key: "expandBizLine",
    value: "",
    dropList: [

    ],
    title: "业务线",
    inputWidth: 150,
    titleWidth: 90,
    filterable: true
  },
  {
    name: "drop-input",
    bind_key: "state",
    value: -1,
    dropList: [
      {
        value: -1,
        label: "全部"
      },
      ...state
    ],
    title: "状态",
    inputWidth: 150,
    titleWidth: 90,
    filterable: true
  }
]

