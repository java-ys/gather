import moment from "moment"

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

let businessLineMap = {
  2: "专享",
  3: "拼车",
  4: "快享",
  8: "包车"
}

export let businessLineOptions = Object.keys(businessLineMap).map((item, index, arr) => ({
  label: businessLineMap[item],
  value: item
}))

let inputList = [{
    name: "text-input",
    bind_key: "name",
    placeholder: "请输入围栏名称",
    value: "",
    title: "围栏名称：",
    titleWidth: 70,
    inputWidth: 120
  },
  // {
  //   name: "cascader-input",
  //   inputWidth: "150",
  //   key: "cityCode",
  //   bind_key: ["provinceCode", "cityCode"],
  //   cascaderList: [],
  //   placeholder: "请选择",
  //   value: [],
  //   title: "城市：",
  //   titleWidth: 50
  // },
  // {
  //   name: "drop-input", // 文本输入框名
  //   bind_key: "serviceType", // 返回数据的key名
  //   placeholder: "请选择",
  //   value: "", // 用于数据绑定
  //   title: "产品线：", // 展示的字段名
  //   dropList: businessLineOptions,
  //   titleWidth: 70, // 展示的字段名的宽度
  //   inputWidth: 100
  // },
];

// tableb表头信息
let parColumns = [{
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "围栏名称",
    key: "name",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "城市",
    key: "cityName",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "产品线",
    key: "serviceType",
    ellipsis: true,
    tooltip: true,
    minWidth: 120,
    render(h, params) {
      return h("div", '全部')
    }
  },
  {
    title: "生效时间",
    key: "effectiveTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 120,
    render(h, params) {
      return h("div", moment(params.row.effectiveTime).format(TIME_FORMAT))
    }
  },
  {
    title: "失效时间",
    key: "failureTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 120,
    render(h, params) {
      return h("div", moment(params.row.failureTime).format(TIME_FORMAT))
    }
  }
];

export const cacheData = {
  inputList,
  pageObj: {
    total: 100,
    current: 1,
    pageSize: 10
  },
  searchData: {},
  parColumns,
  tableData: [],
  selectedList: []
};
