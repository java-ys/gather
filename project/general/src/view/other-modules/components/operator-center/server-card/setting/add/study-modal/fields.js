let inputList = [
  {
    name: "text-input",
    bind_key: "learningTaskName",
    placeholder: "模糊搜索",
    value: "",
    title: "学习任务名称：",
    titleWidth: 90,
    inputWidth: 300
  }
];

// tableb表头信息
let parColumns = [
  {
    type: "selection",
    width: 70,
    align: "center"
  },
  {
    title: "学习任务名称",
    key: "learningTaskName",
    tooltip: true,
    minWidth: 120
  },
  {
    title: "学习分类",
    key: "cataName",
    tooltip: true,
    minWidth: 100
  },
  {
    title: "状态",
    key: "publishStatus",
    minWidth: 80,
    render: (h, params) => {
      return h("div", '已上线');
    }
  }
];

export const cacheData = {
  inputList,
  pageObj: {
    total: 0,
    current: 1,
    pageSize: 10
  },
  searchData: {},
  parColumns,
  tableData: [],
  selectedList: []
};
