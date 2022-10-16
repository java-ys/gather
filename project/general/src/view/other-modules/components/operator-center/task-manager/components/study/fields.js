import moment from "moment"

const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss"

let inputList = [
  {
    name: "text-input",
    bind_key: "courseName",
    placeholder: "请输入课程名称",
    value: "",
    title: "课程名：",
    titleWidth: 70,
    inputWidth: 120
  }
];

// tableb表头信息
let parColumns = [
  {
    type: "selection",
    width: 60,
    align: "center"
  },
  {
    title: "课程名称",
    key: "courseName",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "上线时间",
    key: "onlineDate",
    ellipsis: true,
    tooltip: true,
    minWidth: 120,
    render(h, params) {
      return h("div", {}, moment(params.row.onlineDate).format(TIME_FORMAT))
    }
  },
  {
    title: "下线时间",
    key: "offlineDate",
    ellipsis: true,
    tooltip: true,
    minWidth: 120,
    render(h, params) {
      return h("div", {}, moment(params.row.offlineDate).format(TIME_FORMAT))
    }
  },
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
