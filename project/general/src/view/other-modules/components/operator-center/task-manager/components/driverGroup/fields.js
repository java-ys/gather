// tableb表头信息
let parColumns = [
  {
    type: "selection",
    width: 80,
    align: "center"
  },
  {
    title: "司机人群名称",
    key: "crowdName",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
];

export const cacheData = {
  pageObj: {
    total: 100,
    current: 1,
    pageSize: 10
  },
  parColumns,
  tableData: [],
  selectedList: []
};
