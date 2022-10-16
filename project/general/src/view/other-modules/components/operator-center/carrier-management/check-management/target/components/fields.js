
// 指标搜索项
export const indicatorInputList = [
  {
    name: "text-input",
    bind_key: "name",
    placeholder: "请输入",
    value: "",
    title: "指标名称：",
    titleWidth: 60,
    inputWidth: 200
  }
];
// 指标列
export const indicatorColumn = [
  {
    type: "selection",
    width: 60,
    align: "center",
    minWidth: 100
  },
  {
    title: "所属分类",
    key: "classifyEx",
    width: 120,
    tooltip: true,
    align: "center"
  },
  {
    title: "名称",
    key: "name",
    minWidth: 180,
    tooltip: true,
    align: "center"
  },
  {
    title: "说明",
    key: "remark",
    minWidth: 180,
    tooltip: true,
    align: "center"
  },
  {
    title: "类型",
    key: "typeEx",
    width: 120,
    tooltip: true,
    align: "center"
  }
];
