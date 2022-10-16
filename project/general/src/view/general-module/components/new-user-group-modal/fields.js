let typeList = [
  {
    value: "1",
    label: "导入类"
  },
  {
    value: "2",
    label: "条件类"
  }
];
let inputList = [
  {
    name: "text-input",
    bind_key: "userGroupName",
    placeholder: "请输入名称",
    value: "",
    title: "用户群名称：",
    titleWidth: 80,
    inputWidth: 150
  },
  {
    name: "text-input",
    bind_key: "userGroupCode",
    placeholder: "用户群编码",
    value: "",
    title: "用户群编码：",
    titleWidth: 80,
    inputWidth: 150
  },
  // {
  //   name: "drop-input", // 文本输入框名
  //   bind_key: "userGroupType", // 返回数据的key名
  //   placeholder: "请选择",
  //   value: "", // 用于数据绑定
  //   title: "用户群类型：", // 展示的字段名
  //   dropList: typeList,
  //   titleWidth: 80, // 展示的字段名的宽度
  //   inputWidth: 120
  // },
  {
    name: "text-input",
    bind_key: "createName",
    placeholder: "请输入创建人",
    value: "",
    title: "创建人：",
    titleWidth: 50,
    inputWidth: 150
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
    title: "用户群名称",
    key: "userGroupName",
    ellipsis: true,
    tooltip: true,
    minWidth: 120
  },
  {
    title: "用户群编码",
    key: "userGroupCode",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "是否动态更新",
    key: "dynamicUpdate",
    ellipsis: true,
    tooltip: true,
    minWidth: 80,
    render: (h, params) => {
      return h("div", params.row.dynamicUpdate === 1 ? "是" : "否");
    }
  },
  {
    title: "用户群人数",
    key: "userGroupCount",
    ellipsis: true,
    tooltip: true,
    minWidth: 80
  },
  {
    title: "创建人",
    key: "createName",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
  },
  {
    title: "创建时间",
    key: "createTime",
    ellipsis: true,
    tooltip: true,
    minWidth: 100
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
