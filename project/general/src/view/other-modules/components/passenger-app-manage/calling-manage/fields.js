export const inputList = [
  {
    name: "cascader-input", // 级联
    bind_key: ["provinceCode", "cityCode"],
    value: [],
    cascaderList: [],
    filterable: true,
    title: "城市"
  },
  // {
  //   name: "drop-input",
  //   bind_key: "businessType",
  //   value: "",
  //   dropList: [
  //
  //   ],
  //   title: "产品线",
  //   inputWidth: 150,
  //   titleWidth: 40,
  //   filterable: true
  // }
]

export const webTypeInfo = {
  0: {
    editTitle: "实时单正在呼叫页面管理策略",
    introText: [
      "本页面用以配置乘客APP自营运营渠道实时单正在呼叫页面的展示元素。",
      "未配置的城市将以默认配置生效。新建策略后的初始化配置与默认配置一致。"
    ]
  },
  1: {
    editTitle: "预约单正在呼叫页面管理策略",
    introText: [
      "本页面用以配置乘客APP自营运营渠道预约单正在呼叫页面的展示元素。",
      "未配置的城市将以默认配置生效。新建策略后的初始化配置与默认配置一致。"
    ]
  }
}
